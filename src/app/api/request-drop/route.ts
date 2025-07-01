import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

const payer = Keypair.fromSecretKey(
  new Uint8Array(
    process.env.PRIVATE_KEY!.split(",").map((v) => parseInt(v))
  )
);

const hcaptchaSecret = process.env.HCAPTCHA_SECRET!;
const dropAmount = parseFloat(process.env.DROP_AMOUNT!) * LAMPORTS_PER_SOL;

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_POINTS!),
  duration: parseInt(process.env.RATE_LIMIT_DURATION!),
});

const connection = new Connection(process.env.RPC_URL!, "confirmed");

export async function POST(req: NextRequest) {
  try {
    const { address, hcaptchaToken } = await req.json();

    if (!address || !hcaptchaToken) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const hRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: hcaptchaSecret,
        response: hcaptchaToken,
      }),
    });

    const hData = await hRes.json();
    if (!hData.success) {
      return NextResponse.json({ error: "hCaptcha failed" }, { status: 403 });
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(address);
    } catch {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      address;

    try {
      await rateLimiter.consume(ip as string);
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: dropAmount,
      })
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    return NextResponse.json({ signature: sig });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Transaction failed", detail: err.message },
      { status: 500 }
    );
  }
}
