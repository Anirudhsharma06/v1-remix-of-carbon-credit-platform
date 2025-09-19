import { type NextRequest, NextResponse } from "next/server"
import { WalletService } from "@/lib/wallet"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Validate address format (basic validation)
    if (!address.startsWith("0x") || address.length !== 42) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 })
    }

    // Get token balances
    const balances = await WalletService.getTokenBalances(address)

    return NextResponse.json({
      success: true,
      data: {
        address,
        balances,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return NextResponse.json({ error: "Failed to fetch wallet balance" }, { status: 500 })
  }
}
