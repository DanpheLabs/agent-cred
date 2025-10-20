import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentPay } from "../target/types/agent_pay";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount } from "@solana/spl-token";
import { assert } from "chai";

describe("agent-pay", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AgentPay as Program<AgentPay>;
  
  let usdcMint: PublicKey;
  let coldkey: Keypair;
  let hotkey: Keypair;
  let user: Keypair;
  let recipient: Keypair;
  let coldkeyTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;
  let recipientTokenAccount: PublicKey;
  let agentPda: PublicKey;
  let registryPda: PublicKey;

  const DAILY_LIMIT = new anchor.BN(1000 * 1_000_000); // 1000 USDC

  before(async () => {
    // Generate keypairs
    coldkey = Keypair.generate();
    hotkey = Keypair.generate();
    user = Keypair.generate();
    recipient = Keypair.generate();

    // Airdrop SOL to accounts
    await Promise.all([
      provider.connection.requestAirdrop(coldkey.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
      provider.connection.requestAirdrop(hotkey.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
    ]);

    // Wait for confirmations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create USDC mock mint
    usdcMint = await createMint(
      provider.connection,
      user,
      provider.wallet.publicKey,
      null,
      6 // USDC has 6 decimals
    );

    // Create token accounts
    coldkeyTokenAccount = await createAccount(
      provider.connection,
      coldkey,
      usdcMint,
      coldkey.publicKey
    );

    userTokenAccount = await createAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );

    recipientTokenAccount = await createAccount(
      provider.connection,
      recipient,
      usdcMint,
      recipient.publicKey
    );

    // Mint USDC to user and coldkey
    await mintTo(
      provider.connection,
      user,
      usdcMint,
      userTokenAccount,
      provider.wallet.publicKey,
      10000 * 1_000_000 // 10,000 USDC
    );

    await mintTo(
      provider.connection,
      user,
      usdcMint,
      coldkeyTokenAccount,
      provider.wallet.publicKey,
      5000 * 1_000_000 // 5,000 USDC
    );

    // Derive PDAs
    [registryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("registry")],
      program.programId
    );

    [agentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("agent"),
        coldkey.publicKey.toBuffer(),
        hotkey.publicKey.toBuffer(),
      ],
      program.programId
    );
  });

  it("Initializes registry", async () => {
    await program.methods
      .initializeRegistry()
      .accounts({
        registry: registryPda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const registry = await program.account.registry.fetch(registryPda);
    assert.equal(registry.agentCount.toNumber(), 0);
    assert.equal(registry.totalVolume.toNumber(), 0);
  });

  it("Registers an agent", async () => {
    await program.methods
      .registerAgent(hotkey.publicKey, DAILY_LIMIT)
      .accounts({
        agent: agentPda,
        registry: registryPda,
        coldkey: coldkey.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([coldkey])
      .rpc();

    const agent = await program.account.agent.fetch(agentPda);
    assert.equal(agent.coldkey.toBase58(), coldkey.publicKey.toBase58());
    assert.equal(agent.hotkey.toBase58(), hotkey.publicKey.toBase58());
    assert.equal(agent.dailyLimit.toNumber(), DAILY_LIMIT.toNumber());
    assert.equal(agent.isActive, true);

    const registry = await program.account.registry.fetch(registryPda);
    assert.equal(registry.agentCount.toNumber(), 1);
  });

  it("Updates agent daily limit", async () => {
    const newLimit = new anchor.BN(2000 * 1_000_000); // 2000 USDC

    await program.methods
      .updateAgentLimit(newLimit)
      .accounts({
        agent: agentPda,
        coldkey: coldkey.publicKey,
      })
      .signers([coldkey])
      .rpc();

    const agent = await program.account.agent.fetch(agentPda);
    assert.equal(agent.dailyLimit.toNumber(), newLimit.toNumber());
  });

  it("User pays agent", async () => {
    const amount = new anchor.BN(100 * 1_000_000); // 100 USDC

    await program.methods
      .payAgent(amount)
      .accounts({
        agent: agentPda,
        registry: registryPda,
        user: user.publicKey,
        userTokenAccount,
        coldkeyTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    const agent = await program.account.agent.fetch(agentPda);
    assert.equal(agent.totalReceived.toNumber(), amount.toNumber());

    const coldkeyBalance = await getAccount(provider.connection, coldkeyTokenAccount);
    assert.equal(coldkeyBalance.amount, BigInt(5100 * 1_000_000)); // 5000 + 100
  });

  it("Agent makes instant payment within daily limit", async () => {
    const amount = new anchor.BN(50 * 1_000_000); // 50 USDC

    await program.methods
      .agentPay(amount)
      .accounts({
        agent: agentPda,
        hotkey: hotkey.publicKey,
        recipient: recipient.publicKey,
        coldkeyTokenAccount,
        recipientTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([hotkey])
      .rpc();

    const agent = await program.account.agent.fetch(agentPda);
    assert.equal(agent.dailySpent.toNumber(), amount.toNumber());
    assert.equal(agent.totalSent.toNumber(), amount.toNumber());

    const recipientBalance = await getAccount(provider.connection, recipientTokenAccount);
    assert.equal(recipientBalance.amount, BigInt(50 * 1_000_000));
  });

  it("Prevents agent payment exceeding daily limit", async () => {
    const amount = new anchor.BN(1000 * 1_000_000); // 1000 USDC (would exceed limit)

    try {
      await program.methods
        .agentPay(amount)
        .accounts({
          agent: agentPda,
          hotkey: hotkey.publicKey,
          recipient: recipient.publicKey,
          coldkeyTokenAccount,
          recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([hotkey])
        .rpc();
      assert.fail("Should have thrown error");
    } catch (error) {
      assert.include(error.toString(), "DailyLimitExceeded");
    }
  });

  it("Creates payment request", async () => {
    const amount = new anchor.BN(200 * 1_000_000); // 200 USDC
    const purpose = "Large payment requiring approval";

    const timestamp = Math.floor(Date.now() / 1000);
    const [paymentRequestPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment_request"),
        agentPda.toBuffer(),
        hotkey.publicKey.toBuffer(),
        Buffer.from(new Uint8Array(new BigInt64Array([BigInt(timestamp)]).buffer)),
      ],
      program.programId
    );

    await program.methods
      .requestPayment(amount, purpose)
      .accounts({
        paymentRequest: paymentRequestPda,
        agent: agentPda,
        hotkey: hotkey.publicKey,
        recipient: recipient.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([hotkey])
      .rpc();

    const request = await program.account.paymentRequest.fetch(paymentRequestPda);
    assert.equal(request.amount.toNumber(), amount.toNumber());
    assert.equal(request.purpose, purpose);
    assert.equal(request.status.pending !== undefined, true);
  });

  it("Deactivates agent", async () => {
    await program.methods
      .deactivateAgent()
      .accounts({
        agent: agentPda,
        coldkey: coldkey.publicKey,
      })
      .signers([coldkey])
      .rpc();

    const agent = await program.account.agent.fetch(agentPda);
    assert.equal(agent.isActive, false);
  });

  it("Prevents inactive agent from receiving payments", async () => {
    const amount = new anchor.BN(10 * 1_000_000);

    try {
      await program.methods
        .payAgent(amount)
        .accounts({
          agent: agentPda,
          registry: registryPda,
          user: user.publicKey,
          userTokenAccount,
          coldkeyTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();
      assert.fail("Should have thrown error");
    } catch (error) {
      assert.include(error.toString(), "AgentInactive");
    }
  });
});
