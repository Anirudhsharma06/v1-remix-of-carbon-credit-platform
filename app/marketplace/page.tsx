"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  ShoppingCart,
  TrendingUp,
  MapPin,
  TreePine,
  Users,
  Shield,
  Star,
  ExternalLink,
  BarChart3,
  DollarSign,
  Globe,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { WalletConnector } from "@/components/wallet-connector"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { ethers } from "ethers"

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
  verification_date: string | null
  estimated_co2_tons: number
  tree_species: string[]
  media_urls: string[]
  submitted_by: string
  profiles?: {
    full_name: string
    organization: string
  }
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [loading, setLoading] = useState(true)

  const [walletAddress, setWalletAddress] = useState<string>("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const [projects, setProjects] = useState<Project[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchApprovedProjects() {
      try {
        const { data: projectsData, error } = await supabase
          .from("projects")
          .select(`
            *,
            profiles!projects_submitted_by_fkey (
              full_name,
              organization
            )
          `)
          .eq("status", "verified") // Only fetch approved/verified projects
          .order("verification_date", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          toast.error("Failed to load marketplace projects")
          return
        }

        setProjects(projectsData || [])
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load marketplace projects")
      } finally {
        setLoading(false)
      }
    }

    fetchApprovedProjects()
  }, [])

  const handleWalletConnected = (address: string, walletProvider: ethers.BrowserProvider) => {
    setWalletAddress(address)
    setProvider(walletProvider)
  }

  const marketplaceListings = projects.map((project) => ({
    id: project.id,
    projectName: project.title,
    ngoName: project.profiles?.organization || "Unknown NGO",
    projectType: project.project_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    location: project.location_name,
    area: `${project.area_hectares} hectares`,
    creditsAvailable: project.estimated_co2_tons,
    pricePerCredit: 25.0, // Default price - could be made dynamic
    totalValue: project.estimated_co2_tons * 25.0,
    rating: 4.7, // Default rating - could be made dynamic
    reviews: 15, // Default reviews - could be made dynamic
    verificationDate: project.verification_date || project.created_at,
    description: `${project.project_type.replace(/_/g, " ")} project covering ${project.area_hectares} hectares in ${project.location_name}. This verified carbon credit project contributes to environmental sustainability and community development.`,
    images: project.media_urls?.length > 0 ? project.media_urls : ["/forest-restoration.jpg"],
    impact: {
      treesPlanted: project.estimated_co2_tons * 50, // Estimate based on CO2 tons
      carbonSequestered: project.estimated_co2_tons,
      communitiesBenefited: Math.max(1, Math.floor(project.area_hectares / 5)), // Estimate
      jobsCreated: Math.max(5, Math.floor(project.area_hectares * 2)), // Estimate
    },
    certifications: ["Verified by Admin", "Carbon Credit Standard"],
    seller: {
      name: project.profiles?.organization || "Unknown NGO",
      verified: true,
      totalProjects: 1, // Could be calculated
      totalCredits: project.estimated_co2_tons,
    },
    tree_species: project.tree_species || [],
  }))

  const marketStats = {
    totalCredits: marketplaceListings.reduce((sum, listing) => sum + listing.creditsAvailable, 0),
    averagePrice:
      marketplaceListings.length > 0
        ? marketplaceListings.reduce((sum, listing) => sum + listing.pricePerCredit, 0) / marketplaceListings.length
        : 0,
    totalValue: marketplaceListings.reduce((sum, listing) => sum + listing.totalValue, 0),
    activeProjects: marketplaceListings.length,
  }

  const filteredListings = marketplaceListings.filter((listing) => {
    const matchesSearch =
      listing.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || listing.projectType.toLowerCase().includes(filterType.toLowerCase())
    const matchesLocation =
      filterLocation === "all" || listing.location.toLowerCase().includes(filterLocation.toLowerCase())
    const matchesPrice = listing.pricePerCredit >= priceRange[0] && listing.pricePerCredit <= priceRange[1]

    return matchesSearch && matchesType && matchesLocation && matchesPrice
  })

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.pricePerCredit - b.pricePerCredit
      case "price-high":
        return b.pricePerCredit - a.pricePerCredit
      case "rating":
        return b.rating - a.rating
      case "credits":
        return b.creditsAvailable - a.creditsAvailable
      default:
        return new Date(b.verificationDate).getTime() - new Date(a.verificationDate).getTime()
    }
  })

  const handlePurchase = (listing: any, quantity: number) => {
    console.log("Purchasing credits:", { listing: listing.id, quantity, total: quantity * listing.pricePerCredit })
    toast.success(`Purchase initiated for ${quantity} credits from ${listing.projectName}`)
    // Here you would integrate with payment processing and blockchain transfer
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation showAuthButtons={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Carbon Credit Marketplace</h1>
            <p className="text-muted-foreground">Trade verified carbon credits from sustainable projects worldwide</p>
          </div>

          {isLoggedIn && (
            <div className="mb-8">
              <WalletConnector isLoggedIn={isLoggedIn} onWalletConnected={handleWalletConnected} />
            </div>
          )}

          <Tabs defaultValue="traditional" className="space-y-6">
            <TabsContent value="traditional" className="space-y-6">
              {/* Market Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {marketStats.totalCredits.toLocaleString()}
                      </span>
                      <TreePine className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">tCO₂e for sale</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${marketStats.averagePrice.toFixed(2)}</span>
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-secondary mr-1" />
                      <span className="text-secondary">+5.2% this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Market Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        ${marketStats.totalValue.toLocaleString()}
                      </span>
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">total marketplace value</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">{marketStats.activeProjects}</span>
                      <Globe className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">verified listings</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects, NGOs, locations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Project Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="mangrove">Mangrove Restoration</SelectItem>
                        <SelectItem value="reforestation">Reforestation</SelectItem>
                        <SelectItem value="afforestation">Afforestation</SelectItem>
                        <SelectItem value="agroforestry">Agroforestry</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="brazil">Brazil</SelectItem>
                        <SelectItem value="indonesia">Indonesia</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="credits">Most Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Marketplace Listings */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={listing.images[0] || "/forest-restoration.jpg"}
                        alt={listing.projectName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-secondary/90 text-secondary-foreground">
                          {listing.creditsAvailable} tCO₂e
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-background/90">
                          ${listing.pricePerCredit}/credit
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{listing.projectName}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Users className="h-3 w-3" />
                            <span>{listing.ngoName}</span>
                            {listing.seller.verified && <Shield className="h-3 w-3 text-secondary" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{listing.rating}</span>
                          <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TreePine className="h-3 w-3" />
                          {listing.projectType}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.location}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium ml-1">{listing.area}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Trees:</span>
                          <span className="font-medium ml-1">{listing.impact.treesPlanted.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {listing.certifications.slice(0, 2).map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {listing.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.certifications.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="text-xl font-bold text-primary">${listing.totalValue.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Per Credit</p>
                            <p className="text-lg font-semibold">${listing.pricePerCredit}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => setSelectedProject(listing)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <TreePine className="h-5 w-5 text-secondary" />
                                  {selectedProject?.projectName}
                                </DialogTitle>
                                <DialogDescription>
                                  Verified carbon credit project by {selectedProject?.ngoName}
                                </DialogDescription>
                              </DialogHeader>

                              {selectedProject && (
                                <div className="space-y-6">
                                  {/* Project Images */}
                                  <div className="aspect-video relative overflow-hidden rounded-lg">
                                    <img
                                      src={
                                        selectedProject.images[0] ||
                                        "/placeholder.svg?height=300&width=400&query=forest+restoration" ||
                                        "/placeholder.svg"
                                      }
                                      alt={selectedProject.projectName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  {/* Project Details */}
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-foreground">Project Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Type:</span>
                                          <span className="font-medium">{selectedProject.projectType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Location:</span>
                                          <span className="font-medium">{selectedProject.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Area:</span>
                                          <span className="font-medium">{selectedProject.area}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Verified:</span>
                                          <span className="font-medium">
                                            {new Date(selectedProject.verificationDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-foreground">Impact Metrics</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Trees Planted:</span>
                                          <span className="font-medium">
                                            {selectedProject.impact.treesPlanted.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Carbon Sequestered:</span>
                                          <span className="font-medium text-secondary">
                                            {selectedProject.impact.carbonSequestered} tCO₂e
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Communities Benefited:</span>
                                          <span className="font-medium">
                                            {selectedProject.impact.communitiesBenefited}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Jobs Created:</span>
                                          <span className="font-medium">{selectedProject.impact.jobsCreated}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Species Information */}
                                  {selectedProject.tree_species && selectedProject.tree_species.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-foreground mb-2">Species Planted</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedProject.tree_species.map((species: string, index: number) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {species}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Description */}
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-2">Project Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                                  </div>

                                  {/* Certifications */}
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-2">Certifications</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProject.certifications.map((cert: string, index: number) => (
                                        <Badge
                                          key={index}
                                          className="bg-secondary/10 text-secondary border-secondary/20"
                                        >
                                          {cert}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Purchase Section */}
                                  <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <h4 className="font-semibold text-foreground">Purchase Credits</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedProject.creditsAvailable} credits available at $
                                          {selectedProject.pricePerCredit} each
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <div className="flex items-center gap-1 mb-1">
                                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                          <span className="font-medium">{selectedProject.rating}</span>
                                          <span className="text-sm text-muted-foreground">
                                            ({selectedProject.reviews} reviews)
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-3">
                                      <Input
                                        type="number"
                                        placeholder="Quantity"
                                        min="1"
                                        max={selectedProject.creditsAvailable}
                                        className="w-32"
                                      />
                                      <Button className="flex-1" onClick={() => handlePurchase(selectedProject, 100)}>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Purchase Credits
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" className="flex-1" onClick={() => handlePurchase(listing, 100)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {sortedListings.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No verified projects available</h3>
                    <p className="text-muted-foreground">
                      {projects.length === 0
                        ? "No projects have been approved by administrators yet."
                        : "Try adjusting your search criteria or filters to find carbon credit projects."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
