import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, TreePine, Shield, Leaf } from "lucide-react"
import Link from "next/link"

export default function AdminAnalytics() {
  const monthlyData = [
    { month: "Jan", submissions: 12, approved: 8, credits: 1200 },
    { month: "Feb", submissions: 18, approved: 14, credits: 2100 },
    { month: "Mar", submissions: 15, approved: 11, credits: 1800 },
    { month: "Apr", submissions: 22, approved: 18, credits: 2800 },
    { month: "May", submissions: 28, approved: 22, credits: 3400 },
    { month: "Jun", submissions: 25, approved: 20, credits: 3100 },
  ]

  const projectTypeData = [
    { name: "Reforestation", value: 45, color: "#4ade80" },
    { name: "Mangrove", value: 30, color: "#d97706" },
    { name: "Afforestation", value: 15, color: "#3b82f6" },
    { name: "Agroforestry", value: 10, color: "#8b5cf6" },
  ]

  const regionData = [
    { region: "Maharashtra", projects: 25, credits: 4200 },
    { region: "Kerala", projects: 18, credits: 3100 },
    { region: "Tamil Nadu", projects: 15, credits: 2800 },
    { region: "Karnataka", projects: 12, credits: 2200 },
    { region: "Andhra Pradesh", projects: 8, credits: 1500 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">CarbonChain</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">Admin Portal</Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into carbon credit verification and impact</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">156</span>
                  <TreePine className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-secondary mr-1" />
                  <span className="text-secondary">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Credits Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">24,680</span>
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-secondary mr-1" />
                  <span className="text-secondary">tCO₂e tokens minted</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active NGOs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">42</span>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 text-secondary mr-1" />
                  <span className="text-secondary">+3 new this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">87.3%</span>
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex items-center mt-2 text-xs">
                  <TrendingDown className="h-3 w-3 text-amber-500 mr-1" />
                  <span className="text-amber-600">-2.1% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Submissions & Approvals</CardTitle>
                <CardDescription>Track submission trends and approval rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#d97706" name="Submissions" />
                    <Bar dataKey="approved" fill="#4ade80" name="Approved" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Types Distribution</CardTitle>
                <CardDescription>Breakdown of project types by percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Credits Issued Over Time</CardTitle>
                <CardDescription>Monthly carbon credit token generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="credits" stroke="#4ade80" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Projects and credits by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{region.region}</span>
                        <span className="text-muted-foreground">
                          {region.projects} projects • {region.credits} tCO₂e
                        </span>
                      </div>
                      <Progress value={(region.projects / 25) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Verification Activity</CardTitle>
              <CardDescription>Latest project verifications and blockchain transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Coastal Protection Project - Approved</p>
                      <p className="text-xs text-muted-foreground">366 tCO₂e tokens minted • 2 hours ago</p>
                    </div>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">Approved</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Community Forest Initiative - Under Review</p>
                      <p className="text-xs text-muted-foreground">Satellite analysis in progress • 4 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-amber-200 text-amber-700">
                    Pending
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Urban Green Belt - Rejected</p>
                      <p className="text-xs text-muted-foreground">Insufficient evidence provided • 6 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
