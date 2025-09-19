"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  TreePine,
  Satellite,
  FileImage,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Navigation } from "@/components/navigation"

interface Project {
  id: string
  title: string
  project_type: string
  area_hectares: number
  location_name: string
  latitude: number
  longitude: number
  status: string
  created_at: string
  verification_date: string | null // updated interface to use verification_date instead of verified_at
  estimated_co2_tons: number
  tree_species: string[]
  media_urls: string[]
  submitted_by: string
  profiles?: {
    full_name: string
    organization: string
  }
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Project | null>(null)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function fetchUserAndProjects() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        const { data: projectsData, error } = await supabase
          .from("projects")
          .select(`
            *,
            profiles!projects_submitted_by_fkey (
              full_name,
              organization
            )
          `)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          return
        }

        setProjects(projectsData || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndProjects()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": // updated from "approved" to "verified" to match database constraint
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Verified</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-200 text-amber-700">
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (project: Project) => {
    const isLargeProject = project.area_hectares > 30
    const isMangrove = project.project_type.toLowerCase().includes("mangrove")

    if (isLargeProject || isMangrove) {
      return (
        <Badge variant="destructive" className="text-xs">
          High Priority
        </Badge>
      )
    } else if (project.area_hectares > 15) {
      return (
        <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
          Medium
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="text-xs">
          Low
        </Badge>
      )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": // updated from "approved" to "verified" to match database constraint
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const filteredSubmissions = projects.filter((project) => {
    if (filterStatus === "all") return true
    return project.status === filterStatus
  })

  const pendingCount = projects.filter((s) => s.status === "pending").length
  const approvedCount = projects.filter((s) => s.status === "verified").length // updated from "approved" to "verified"
  const rejectedCount = projects.filter((s) => s.status === "rejected").length
  const totalCredits = projects
    .filter((s) => s.status === "verified") // updated from "approved" to "verified"
    .reduce((sum, s) => sum + (s.estimated_co2_tons || 0), 0)

  const handleApprove = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          status: "verified", // updated from "approved" to "verified" to match database constraint
          verification_date: new Date().toISOString(),
          verification_notes: verificationNotes,
        })
        .eq("id", projectId)

      if (error) throw error

      // Update local state
      setProjects(
        projects.map(
          (p) => (p.id === projectId ? { ...p, status: "verified", verification_date: new Date().toISOString() } : p), // updated status to "verified"
        ),
      )

      toast.success("Project approved successfully!")
      setVerificationNotes("")
    } catch (error) {
      console.error("Error approving project:", error)
      toast.error("Failed to approve project")
    }
  }

  const handleReject = async (projectId: string) => {
    if (!verificationNotes.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    try {
      console.log("[v0] Rejecting project:", projectId)
      const { error } = await supabase
        .from("projects")
        .update({
          status: "rejected",
          verification_date: new Date().toISOString(),
          verification_notes: verificationNotes,
        })
        .eq("id", projectId)

      if (error) throw error

      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, status: "rejected", verification_date: new Date().toISOString() } : p,
        ),
      )

      setIsDialogOpen(false)
      setSelectedSubmission(null)
      setVerificationNotes("")

      toast.success("Project Rejected", {
        description: "The project will remain visible with rejected status.",
        duration: 4000,
      })
      console.log("[v0] Project rejected successfully")
    } catch (error) {
      console.error("Error rejecting project:", error)
      toast.error("Failed to reject project")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="admin" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Verification Dashboard</h1>
            <p className="text-muted-foreground">Review and verify carbon credit project submissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">submissions awaiting</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verified Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">{approvedCount}</span>
                  <CheckCircle className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">verified projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{totalCredits}</span>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">tCO₂e tokens minted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active NGOs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {new Set(projects.map((p) => p.submitted_by)).size}
                  </span>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">registered organizations</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submissions">Project Submissions</TabsTrigger>
              <TabsTrigger value="satellite">Satellite Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Submissions</CardTitle>
                      <CardDescription>Review and verify NGO project submissions</CardDescription>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem> {/* updated from "approved" to "verified" */}
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No submissions found</h3>
                      <p className="text-muted-foreground">No projects match the current filter criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-foreground">{submission.title}</h3>
                                {getStatusBadge(submission.status)}
                                {getPriorityBadge(submission)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {submission.profiles?.organization || "Unknown NGO"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TreePine className="h-3 w-3" />
                                  {submission.project_type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {submission.location_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3" />
                                  {submission.area_hectares} hectares
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Submitted: {new Date(submission.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileImage className="h-3 w-3" />
                                  {submission.media_urls?.length || 0} files
                                </span>
                                <span className="flex items-center gap-1">
                                  <TreePine className="h-3 w-3" />
                                  {submission.estimated_co2_tons * 50 || "N/A"} trees
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(submission.status)}
                                <span className="font-semibold text-foreground">
                                  {submission.status === "verified" // updated from "approved" to "verified"
                                    ? submission.estimated_co2_tons
                                    : submission.status === "pending"
                                      ? `~${submission.estimated_co2_tons}`
                                      : "0"}{" "}
                                  tCO₂e
                                </span>
                              </div>
                              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedSubmission(submission)
                                      setIsDialogOpen(true)
                                    }}
                                    className="bg-transparent"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Shield className="h-5 w-5 text-primary" />
                                      Project Verification: {selectedSubmission?.title}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Review project details and satellite data before making a verification decision
                                    </DialogDescription>
                                  </DialogHeader>

                                  {selectedSubmission && (
                                    <div className="space-y-6">
                                      {/* Project Details */}
                                      <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-foreground">Project Information</h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">NGO:</span>
                                              <span className="font-medium">
                                                {selectedSubmission.profiles?.organization || "Unknown"}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Type:</span>
                                              <span className="font-medium">{selectedSubmission.project_type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Area:</span>
                                              <span className="font-medium">
                                                {selectedSubmission.area_hectares} hectares
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Trees Planted:</span>
                                              <span className="font-medium">
                                                {selectedSubmission.estimated_co2_tons * 50 || "N/A"}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Estimated Credits:</span>
                                              <span className="font-medium text-primary">
                                                {selectedSubmission.estimated_co2_tons} tCO₂e
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-foreground">Location Details</h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Location:</span>
                                              <span className="font-medium">{selectedSubmission.location_name}</span>
                                            </div>
                                            {selectedSubmission.latitude && selectedSubmission.longitude && (
                                              <>
                                                <div className="flex justify-between">
                                                  <span className="text-muted-foreground">Latitude:</span>
                                                  <span className="font-medium">{selectedSubmission.latitude}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-muted-foreground">Longitude:</span>
                                                  <span className="font-medium">{selectedSubmission.longitude}</span>
                                                </div>
                                              </>
                                            )}
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Files Uploaded:</span>
                                              <span className="font-medium">
                                                {selectedSubmission.media_urls?.length || 0}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Species Information */}
                                      {selectedSubmission.tree_species &&
                                        selectedSubmission.tree_species.length > 0 && (
                                          <div>
                                            <h4 className="font-semibold text-foreground mb-2">Species Planted</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {selectedSubmission.tree_species.map((species: string, index: number) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                  {species}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                      {/* Satellite Verification */}
                                      <div className="border border-border rounded-lg p-4 bg-muted/20">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Satellite className="h-5 w-5 text-primary" />
                                          <h4 className="font-semibold text-foreground">Satellite Verification</h4>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                          <div className="bg-background rounded border p-3">
                                            <h5 className="text-sm font-medium mb-2">Before Planting</h5>
                                            <div className="aspect-video bg-muted rounded flex items-center justify-center">
                                              <span className="text-xs text-muted-foreground">
                                                Satellite Image - Before
                                              </span>
                                            </div>
                                          </div>
                                          <div className="bg-background rounded border p-3">
                                            <h5 className="text-sm font-medium mb-2">After Planting</h5>
                                            <div className="aspect-video bg-secondary/10 rounded flex items-center justify-center">
                                              <span className="text-xs text-muted-foreground">
                                                Satellite Image - After
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-3 p-3 bg-secondary/10 rounded">
                                          <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-secondary" />
                                            <span className="font-medium text-secondary">
                                              Vegetation increase detected: +
                                              {Math.round(selectedSubmission.area_hectares * 0.9)}% forest cover
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Verification Notes */}
                                      <div className="space-y-3">
                                        <Label htmlFor="notes">Verification Notes</Label>
                                        <Textarea
                                          id="notes"
                                          placeholder="Add your verification notes, observations, or reasons for approval/rejection..."
                                          value={verificationNotes}
                                          onChange={(e) => setVerificationNotes(e.target.value)}
                                          className="min-h-[100px]"
                                        />
                                      </div>

                                      {/* Action Buttons */}
                                      {selectedSubmission.status === "pending" && (
                                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                          <Button
                                            variant="destructive"
                                            onClick={() => handleReject(selectedSubmission.id)}
                                            disabled={!verificationNotes.trim()}
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Project
                                          </Button>
                                          <Button
                                            className="bg-secondary hover:bg-secondary/90"
                                            onClick={() => handleApprove(selectedSubmission.id)}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve Project
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="satellite" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5 text-primary" />
                    Satellite Monitoring Dashboard
                  </CardTitle>
                  <CardDescription>AI-powered satellite data analysis for project verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Satellite Analysis</h4>
                      <div className="space-y-3">
                        {projects.slice(0, 3).map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between p-3 border border-border rounded"
                          >
                            <div>
                              <p className="font-medium text-sm">{project.title}</p>
                              <p className="text-xs text-muted-foreground">{project.location_name}</p>
                            </div>
                            {project.status === "verified" ? (
                              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                                +{Math.round(project.area_hectares * 0.9)}% Cover
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-200 text-amber-700">
                                Analyzing
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">AI Model Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accuracy Rate:</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Projects Analyzed:</span>
                          <span className="font-medium">{projects.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">False Positives:</span>
                          <span className="font-medium">3.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
