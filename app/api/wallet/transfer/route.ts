import { type NextRequest, NextResponse } from "next/server"
import { WalletService } from "@/lib/wallet"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenAddress, recipientAddress, amount, senderAddress } = body

    // Validate required fields
    if (!tokenAddress || !recipientAddress || !amount || !senderAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate addresses
    if (!tokenAddress.startsWith("0x") || !recipientAddress.startsWith("0x") || !senderAddress.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    // Validate amount
    if (Number.isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Execute token transfer
    const transactionHash = await WalletService.sendTokens(tokenAddress, recipientAddress, amount, senderAddress)

    return NextResponse.json({
      success: true,
      data: {
        transactionHash,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error executing token transfer:", error)
    return NextResponse.json({ error: "Failed to execute token transfer" }, { status: 500 })
  }
}
