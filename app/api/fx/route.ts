import { NextResponse } from "next/server";
import { quoteToIls } from "@/lib/fx";
export async function GET(request:Request){try{const currency=new URL(request.url).searchParams.get("currency")||"ILS"; return NextResponse.json(await quoteToIls(currency));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"FX quote failed"},{status:503});}}
