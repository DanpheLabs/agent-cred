import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentPay } from "../target/types/agent_pay";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  // Configure the client to use devnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AgentPay as Program<AgentPay>;

  console.log("🚀 Initializing AgentPay Registry on Devnet");
  console.log("==========================================");
  console.log("");
  console.log("Program ID:", program.programId.toString());
  console.log("Authority:", provider.wallet.publicKey.toString());
  console.log("");

  // Derive registry PDA
  const [registryPda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("registry")],
    program.programId
  );

  console.log("Registry PDA:", registryPda.toString());
  console.log("Bump:", bump);
  console.log("");

  try {
    // Check if registry already exists
    try {
      const existingRegistry = await program.account.registry.fetch(registryPda);
      console.log("⚠️  Registry already initialized!");
      console.log("Agent Count:", existingRegistry.agentCount.toString());
      console.log("Total Volume:", existingRegistry.totalVolume.toString());
      return;
    } catch (e) {
      // Registry doesn't exist, continue with initialization
    }

    console.log("📝 Sending initialization transaction...");

    const tx = await program.methods
      .initializeRegistry()
      .accounts({
        registry: registryPda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("");
    console.log("✅ Registry initialized successfully!");
    console.log("Transaction signature:", tx);
    console.log("");
    console.log("🔗 View on Solana Explorer:");
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log("");

    // Fetch and display registry data
    const registry = await program.account.registry.fetch(registryPda);
    console.log("📊 Registry Data:");
    console.log("  Authority:", registry.authority.toString());
    console.log("  Agent Count:", registry.agentCount.toString());
    console.log("  Total Volume:", registry.totalVolume.toString());
    console.log("");

  } catch (error) {
    console.error("❌ Initialization failed:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
