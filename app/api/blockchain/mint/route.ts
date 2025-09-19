import { type NextRequest, NextResponse } from "next/server"
import { BlockchainService, IPFSService, generateTokenId } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, ngoAddress, creditsAmount, verificationData } = body

    // Validate required fields
    if (!projectId || !ngoAddress || !creditsAmount || !verificationData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload verification data to IPFS
    const ipfsHash = await IPFSService.uploadProjectData({
      projectId,
      verificationData,
      timestamp: new Date().toISOString(),
    })

    // Mint carbon credit tokens on blockchain
    const transactionHash = await BlockchainService.mintCarbonCredits(
      projectId,
      ngoAddress,
      creditsAmount,
      verificationData,
    )

    // Generate token ID
    const tokenId = generateTokenId(projectId)

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        tokenId,
        transactionHash,
        ipfsHash,
        creditsAmount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error minting carbon credits:", error)
    return NextResponse.json({ error: "Failed to mint carbon credits" }, { status: 500 })
  }
}
