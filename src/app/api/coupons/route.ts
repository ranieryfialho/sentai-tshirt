import { NextResponse } from "next/server";
import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("\n[API COUPONS] 🔵 Recebeu requisição do frontend...");
    const coupons = await nuvemshopClient.getCoupons();
    console.log(`[API COUPONS] 🟢 Retornando ${coupons.length} cupons para o carrinho.\n`);
    
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("[API COUPONS] 🔴 Erro ao buscar cupons na API:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}