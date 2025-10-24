import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentPay } from "../target/types/agent_pay";

describe("agent_pay", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchor as Program<AgentPay>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initializeRegistry().rpc();
    console.log("Your transaction signature", tx);
  });
});
