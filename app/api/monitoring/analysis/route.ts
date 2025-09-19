import { type NextRequest, NextResponse } from "next/server"
import { monitoringService } from "@/lib/monitoring"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const analysis = await monitoringService.performGISAnalysis(projectId)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("Error performing GIS analysis:", error)
    return NextResponse.json({ error: "Failed to perform GIS analysis" }, { status: 500 })
  }
}
