import { type NextRequest, NextResponse } from "next/server"
import { monitoringService } from "@/lib/monitoring"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const dateRange =
      startDate && endDate
        ? {
            start: new Date(startDate),
            end: new Date(endDate),
          }
        : undefined

    const satelliteData = await monitoringService.fetchSatelliteData(projectId, dateRange)

    return NextResponse.json({
      success: true,
      data: satelliteData,
    })
  } catch (error) {
    console.error("Error fetching satellite data:", error)
    return NextResponse.json({ error: "Failed to fetch satellite data" }, { status: 500 })
  }
}
