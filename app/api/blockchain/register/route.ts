import { type NextRequest, NextResponse } from "next/server"
import { BlockchainService, IPFSService, generateProjectId } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectData, ngoAddress } = body

    // Validate required fields
    if (!projectData || !ngoAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate project ID
    const projectId = generateProjectId()

    // Upload project data to IPFS
    const ipfsHash = await IPFSService.uploadProjectData({
      ...projectData,
      projectId,
      submissionDate: new Date().toISOString(),
    })

    // Register project on blockchain
    const transactionHash = await BlockchainService.registerProject({
      projectId,
      ngoAddress,
      verifierAddress: "", // Will be set during verification
      location: {
        latitude: Number.parseFloat(projectData.coordinates.lat),
        longitude: Number.parseFloat(projectData.coordinates.lng),
      },
      area: Number.parseFloat(projectData.area),
      projectType: projectData.type,
      carbonSequestration: 0, // Will be calculated during verification
      verificationDate: "",
      ipfsHash,
    })

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        projectId,
        transactionHash,
        ipfsHash,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error registering project:", error)
    return NextResponse.json({ error: "Failed to register project" }, { status: 500 })
  }
}
