import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";

const keypair = Keypair.generate();

const envContent = [
  `PRIVATE_KEY=${Array.from(keypair.secretKey).join(",")}`,
  `HCAPTCHA_SECRET=yourhcaptchasecrethere`,
  `RPC_URL=yourrpcurlhere`,
  `DROP_AMOUNT=0.01`,
  `RATE_LIMIT_POINTS=1`,
  `RATE_LIMIT_DURATION=300`,
].join("\n");

fs.writeFileSync(path.resolve(".env.local"), envContent);

console.log(".env.local created");
console.log("Public key:", keypair.publicKey.toBase58());
