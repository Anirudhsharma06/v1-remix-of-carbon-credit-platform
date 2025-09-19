import { type NextRequest, NextResponse } from "next/server"
import { monitoringService } from "@/lib/monitoring"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const alerts = await monitoringService.getActiveAlerts(projectId || undefined)

    return NextResponse.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
