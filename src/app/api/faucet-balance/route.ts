import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { NextResponse } from "next/server";

const payer = Keypair.fromSecretKey(
  new Uint8Array(
    process.env.PRIVATE_KEY!.split(",").map((v) => parseInt(v))
  )
);

const connection = new Connection(process.env.RPC_URL!, "confirmed");

export async function GET() {
  try {
    const balanceLamports = await connection.getBalance(payer.publicKey);
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

    return NextResponse.json({
      balance: balanceSol.toFixed(4),
      address: payer.publicKey.toBase58(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch balance", detail: err.message },
      { status: 500 }
    );
  }
}
