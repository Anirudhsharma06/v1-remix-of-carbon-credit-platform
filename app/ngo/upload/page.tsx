"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { MapPin, Upload, TreePine, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ProjectFormData {
  projectName: string
  projectType: string
  description: string
  startDate: string
  duration: string
  budget: string
  country: string
  region: string
  latitude: string
  longitude: string
  totalArea: string
  plantedArea: string
  species: string
  treesPlanted: string
}

export default function NGOUploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: "", lng: "" })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: "",
    projectType: "",
    description: "",
    startDate: "",
    duration: "",
    budget: "",
    country: "",
    region: "",
    latitude: "",
    longitude: "",
    totalArea: "",
    plantedArea: "",
    species: "",
    treesPlanted: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const supabase = createClient()

  const updateFormData = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6)
          const lng = position.coords.longitude.toFixed(6)
          setGpsCoordinates({ lat, lng })
          updateFormData("latitude", lat)
          updateFormData("longitude", lng)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter coordinates manually.",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("[v0] Upload form - User data:", user) // Added debug logging

      if (userError || !user) {
        console.log("[v0] Upload form - No user or error:", userError) // Added debug logging
        toast({
          title: "Authentication Error",
          description: "Please log in to submit a project.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const requiredFields = [
        { field: "projectName", label: "Project Name" },
        { field: "projectType", label: "Project Type" },
        { field: "description", label: "Description" },
        { field: "startDate", label: "Start Date" },
        { field: "country", label: "Country" },
        { field: "region", label: "Region" },
        { field: "latitude", label: "Latitude" },
        { field: "longitude", label: "Longitude" },
        { field: "totalArea", label: "Total Area" },
        { field: "plantedArea", label: "Planted Area" },
        { field: "species", label: "Species" },
      ]

      const missingFields = requiredFields.filter(({ field }) => !formData[field as keyof ProjectFormData])

      if (missingFields.length > 0) {
        console.log(
          "[v0] Upload form - Missing fields:",
          missingFields.map((f) => f.field),
        )
        toast({
          title: "Missing Information",
          description: `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`,
          variant: "destructive",
        })
        return
      }

      // Calculate estimated carbon credits (simplified calculation)
      const estimatedCredits = Math.round(Number.parseFloat(formData.plantedArea) * 20) // ~20 tCO2e per hectare

      const projectData = {
        title: formData.projectName,
        project_type: formData.projectType,
        description: formData.description,
        planting_date: formData.startDate,
        location_name: `${formData.region}, ${formData.country}`,
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
        area_hectares: Number.parseFloat(formData.totalArea),
        tree_species: [formData.species], // Convert to array as per schema
        estimated_co2_tons: estimatedCredits,
        submitted_by: user.id,
        status: "pending",
      }

      console.log("[v0] Upload form - Project data to insert:", projectData) // Added debug logging

      // Insert project into database
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert(projectData)
        .select()
        .single()

      console.log("[v0] Upload form - Insert result:", { project, projectError }) // Added debug logging

      if (projectError) {
        console.error("Project submission error:", projectError)
        toast({
          title: "Submission Failed",
          description: `Database error: ${projectError.message}`,
          variant: "destructive",
        })
        return
      }

      // TODO: Upload files to storage and link to project
      // For now, we'll just show success message

      toast({
        title: "Project Submitted Successfully!",
        description: `Your project "${formData.projectName}" has been submitted for verification.`,
      })

      console.log("[v0] Upload form - Redirecting to dashboard") // Added debug logging
      // Redirect to dashboard
      router.push("/ngo/dashboard")
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="ngo" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Project Data</h1>
            <p className="text-muted-foreground">
              Submit your plantation/restoration project for verification and carbon credit generation
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">Step {currentStep} of 4</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-2" />

            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Project Info</span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Location & Area</span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Media Upload</span>
              <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Review & Submit</span>
            </div>
          </div>

          {/* Step 1: Project Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Provide basic information about your plantation or restoration project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      placeholder="e.g., Mangrove Restoration Phase 1"
                      value={formData.projectName}
                      onChange={(e) => updateFormData("projectName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => updateFormData("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reforestation">Reforestation</SelectItem>
                        <SelectItem value="afforestation">Afforestation</SelectItem>
                        <SelectItem value="mangrove_restoration">Mangrove Restoration</SelectItem>
                        <SelectItem value="agroforestry">Agroforestry</SelectItem>
                        <SelectItem value="urban_forestry">Urban Forestry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project objectives, methods, and expected outcomes..."
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData("startDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="12"
                      value={formData.duration}
                      onChange={(e) => updateFormData("duration", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="50000"
                      value={formData.budget}
                      onChange={(e) => updateFormData("budget", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep}>Next: Location & Area</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location & Area */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location & Area Details
                </CardTitle>
                <CardDescription>Specify the exact location and area coverage of your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="brazil">Brazil</SelectItem>
                        <SelectItem value="indonesia">Indonesia</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="philippines">Philippines</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">State/Region *</Label>
                    <Input
                      id="region"
                      placeholder="e.g., Maharashtra, Amazonas"
                      value={formData.region}
                      onChange={(e) => updateFormData("region", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>GPS Coordinates *</Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        placeholder="19.0760"
                        value={formData.latitude}
                        onChange={(e) => {
                          updateFormData("latitude", e.target.value)
                          setGpsCoordinates((prev) => ({ ...prev, lat: e.target.value }))
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        placeholder="72.8777"
                        value={formData.longitude}
                        onChange={(e) => {
                          updateFormData("longitude", e.target.value)
                          setGpsCoordinates((prev) => ({ ...prev, lng: e.target.value }))
                        }}
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" onClick={getCurrentLocation} className="w-full bg-transparent">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Current Location
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">Total Area (hectares) *</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      step="0.01"
                      placeholder="25.5"
                      value={formData.totalArea}
                      onChange={(e) => updateFormData("totalArea", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantedArea">Planted Area (hectares) *</Label>
                    <Input
                      id="plantedArea"
                      type="number"
                      step="0.01"
                      placeholder="20.0"
                      value={formData.plantedArea}
                      onChange={(e) => updateFormData("plantedArea", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species Planted *</Label>
                  <Textarea
                    id="species"
                    placeholder="List the species planted (e.g., Rhizophora mucronata, Avicennia marina, Sonneratia alba)"
                    value={formData.species}
                    onChange={(e) => updateFormData("species", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treesPlanted">Number of Trees/Seedlings Planted</Label>
                  <Input
                    id="treesPlanted"
                    type="number"
                    placeholder="5000"
                    value={formData.treesPlanted}
                    onChange={(e) => updateFormData("treesPlanted", e.target.value)}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={nextStep}>Next: Media Upload</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Media Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  File Upload
                </CardTitle>
                <CardDescription>
                  Upload any files related to your project (photos, videos, documents, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unified upload option */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Files</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload any type of file: photos, videos, documents, drone imagery, reports, etc.
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="*/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" className="bg-transparent pointer-events-none">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported: All file types • Max size: 50MB per file
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Uploaded Files ({selectedFiles.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative border border-border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.type || "Unknown type"} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button onClick={nextStep}>Next: Review & Submit</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Review & Submit
                </CardTitle>
                <CardDescription>Review your project details before submitting for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Before You Submit</h4>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Ensure all required fields are completed accurately</li>
                        <li>• GPS coordinates should be precise and verified</li>
                        <li>• Upload high-quality photos and videos as evidence</li>
                        <li>• Your submission will be reviewed by government authorities</li>
                        <li>• Verification typically takes 5-10 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Project Summary</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Name:</span>
                        <span className="font-medium">{formData.projectName || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Type:</span>
                        <span className="font-medium">{formData.projectType || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Area:</span>
                        <span className="font-medium">
                          {formData.totalArea ? `${formData.totalArea} hectares` : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">
                          {formData.region && formData.country
                            ? `${formData.region}, ${formData.country}`
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Files Uploaded:</span>
                        <span className="font-medium">{selectedFiles.length} files</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GPS Verified:</span>
                        <span className="font-medium text-secondary">
                          {formData.latitude && formData.longitude ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Credits:</span>
                        <span className="font-medium text-primary">
                          {formData.plantedArea
                            ? `~${Math.round(Number.parseFloat(formData.plantedArea) * 20)} tCO₂e`
                            : "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Verification"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
