"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Satellite, MapPin, AlertTriangle, CheckCircle, Clock, Leaf, Camera } from "lucide-react"

interface MonitoringData {
  id: string
  projectName: string
  location: string
  coordinates: [number, number]
  lastUpdate: string
  forestCover: number
  carbonSequestration: number
  healthScore: number
  alerts: number
  status: "healthy" | "warning" | "critical"
  satelliteImages: string[]
  trends: {
    month: string
    coverage: number
    carbon: number
  }[]
}

const mockMonitoringData: MonitoringData[] = [
  {
    id: "1",
    projectName: "Amazon Reforestation Initiative",
    location: "Acre, Brazil",
    coordinates: [-9.0238, -70.812],
    lastUpdate: "2024-01-15T10:30:00Z",
    forestCover: 87.5,
    carbonSequestration: 245.8,
    healthScore: 92,
    alerts: 0,
    status: "healthy",
    satelliteImages: ["/reforestation-community-forest.jpg"],
    trends: [
      { month: "Oct", coverage: 82, carbon: 220 },
      { month: "Nov", coverage: 85, carbon: 235 },
      { month: "Dec", coverage: 87, carbon: 242 },
      { month: "Jan", coverage: 87.5, carbon: 245.8 },
    ],
  },
  {
    id: "2",
    projectName: "Mangrove Restoration Project",
    location: "Sundarbans, Bangladesh",
    coordinates: [22.4707, 89.537],
    lastUpdate: "2024-01-14T15:45:00Z",
    forestCover: 73.2,
    carbonSequestration: 189.4,
    healthScore: 78,
    alerts: 2,
    status: "warning",
    satelliteImages: ["/mangrove-restoration-coastal-protection.jpg"],
    trends: [
      { month: "Oct", coverage: 75, carbon: 195 },
      { month: "Nov", coverage: 74, carbon: 192 },
      { month: "Dec", coverage: 73.5, carbon: 190 },
      { month: "Jan", coverage: 73.2, carbon: 189.4 },
    ],
  },
  {
    id: "3",
    projectName: "Urban Forest Initiative",
    location: "São Paulo, Brazil",
    coordinates: [-23.5505, -46.6333],
    lastUpdate: "2024-01-15T08:20:00Z",
    forestCover: 45.8,
    carbonSequestration: 98.7,
    healthScore: 65,
    alerts: 1,
    status: "warning",
    satelliteImages: ["/urban-afforestation-green-corridors.jpg"],
    trends: [
      { month: "Oct", coverage: 42, carbon: 89 },
      { month: "Nov", coverage: 44, carbon: 94 },
      { month: "Dec", coverage: 45, carbon: 96 },
      { month: "Jan", coverage: 45.8, carbon: 98.7 },
    ],
  },
]

export default function MonitoringPage() {
  const [selectedProject, setSelectedProject] = useState<MonitoringData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading satellite data
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Satellite className="h-12 w-12 animate-pulse text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Satellite Data</h3>
            <p className="text-muted-foreground">Fetching latest monitoring information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">GIS & Satellite Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring and verification of carbon credit projects using satellite imagery and GIS data
          </p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Satellite className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,847 ha</div>
            <p className="text-xs text-muted-foreground">+1,234 ha this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Carbon Sequestered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,456 tCO₂</div>
            <p className="text-xs text-muted-foreground">+567 tCO₂ this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Analysis</TabsTrigger>
          <TabsTrigger value="reports">MRV Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitored Projects</CardTitle>
                <CardDescription>Real-time status of all carbon credit projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMonitoringData.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                      <div>
                        <h4 className="font-medium">{project.projectName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{project.forestCover}%</div>
                      <div className="text-xs text-muted-foreground">Coverage</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedProject.projectName}
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {getStatusIcon(selectedProject.status)}
                      <span className="capitalize">{selectedProject.status}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{selectedProject.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Forest Cover</div>
                      <div className="text-2xl font-bold text-green-600">{selectedProject.forestCover}%</div>
                      <Progress value={selectedProject.forestCover} className="mt-2" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Health Score</div>
                      <div className="text-2xl font-bold">{selectedProject.healthScore}/100</div>
                      <Progress value={selectedProject.healthScore} className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Carbon Sequestration</div>
                    <div className="text-xl font-bold flex items-center">
                      <Leaf className="h-5 w-5 text-green-600 mr-2" />
                      {selectedProject.carbonSequestration} tCO₂
                    </div>
                  </div>

                  {selectedProject.alerts > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center text-amber-800">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span className="font-medium">{selectedProject.alerts} Active Alert(s)</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        Requires immediate attention for optimal carbon sequestration
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button className="w-full bg-transparent" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      View Satellite Imagery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="satellite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Satellite Image Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of satellite imagery for forest cover and health assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMonitoringData.map((project) => (
                  <div key={project.id} className="space-y-3">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={project.satelliteImages[0] || "/placeholder.svg"}
                        alt={`Satellite view of ${project.projectName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{project.projectName}</h4>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">Coverage: {project.forestCover}%</span>
                        <Badge variant={project.status === "healthy" ? "default" : "secondary"}>{project.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MRV Reports</CardTitle>
              <CardDescription>Monitoring, Reporting, and Verification reports generated automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Monthly Carbon Sequestration Report",
                    date: "2024-01-15",
                    status: "completed",
                    projects: 24,
                  },
                  { title: "Forest Cover Analysis Q4 2023", date: "2024-01-01", status: "completed", projects: 22 },
                  { title: "Biodiversity Impact Assessment", date: "2023-12-15", status: "completed", projects: 18 },
                  { title: "Satellite Verification Report", date: "2023-12-01", status: "processing", projects: 24 },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {report.projects} projects • Generated on {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={report.status === "completed" ? "default" : "secondary"}>{report.status}</Badge>
                      <Button variant="outline" size="sm">
                        {report.status === "completed" ? "Download" : "View Status"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Anomalies</CardTitle>
              <CardDescription>Automated detection of changes requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "warning",
                    title: "Decreased Forest Cover Detected",
                    project: "Mangrove Restoration Project",
                    description: "2.3% decrease in forest cover detected in the last 30 days",
                    time: "2 hours ago",
                  },
                  {
                    type: "info",
                    title: "New Growth Area Identified",
                    project: "Amazon Reforestation Initiative",
                    description: "Satellite imagery shows 15% increase in vegetation density",
                    time: "1 day ago",
                  },
                  {
                    type: "warning",
                    title: "Irregular Activity Pattern",
                    project: "Urban Forest Initiative",
                    description: "Unusual changes in vegetation patterns require verification",
                    time: "3 days ago",
                  },
                ].map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.project}</p>
                      <p className="text-sm mt-2">{alert.description}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
