import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Package, Download, ExternalLink, Calendar, DollarSign, TreePine, Leaf } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-2024-001",
      projectName: "Coastal Protection Project",
      ngoName: "Ocean Guardians",
      quantity: 100,
      pricePerCredit: 25.5,
      totalAmount: 2550,
      status: "completed",
      orderDate: "2024-02-10T14:30:00Z",
      completedDate: "2024-02-10T14:35:00Z",
      transactionHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      certificateUrl: "/certificates/ORD-2024-001.pdf",
    },
    {
      id: "ORD-2024-002",
      projectName: "Community Forest Initiative",
      ngoName: "Forest Guardians NGO",
      quantity: 250,
      pricePerCredit: 22.0,
      totalAmount: 5500,
      status: "processing",
      orderDate: "2024-02-12T09:15:00Z",
      completedDate: null,
      transactionHash: null,
      certificateUrl: null,
    },
    {
      id: "ORD-2024-003",
      projectName: "Mangrove Restoration Phase 1",
      ngoName: "Green Earth Foundation",
      quantity: 50,
      pricePerCredit: 28.75,
      totalAmount: 1437.5,
      status: "completed",
      orderDate: "2024-02-08T16:45:00Z",
      completedDate: "2024-02-08T16:50:00Z",
      transactionHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      certificateUrl: "/certificates/ORD-2024-003.pdf",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Completed</Badge>
      case "processing":
        return (
          <Badge variant="outline" className="border-amber-200 text-amber-700">
            Processing
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "failed":
        return <Package className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const completedOrders = orders.filter((order) => order.status === "completed")
  const processingOrders = orders.filter((order) => order.status === "processing")
  const totalSpent = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalCredits = completedOrders.reduce((sum, order) => sum + order.quantity, 0)

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
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">My Orders</Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/marketplace">Back to Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track your carbon credit purchases and download certificates</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{orders.length}</span>
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">lifetime orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Credits Purchased</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">{totalCredits}</span>
                  <TreePine className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">tCO₂e owned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</span>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">on carbon credits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-600">{processingOrders.length}</span>
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">pending orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{order.projectName}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>Order #{order.id}</span>
                          <span>{order.ngoName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-foreground">{order.quantity} tCO₂e</span>
                        </div>
                        <p className="text-lg font-bold text-primary">${order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${order.pricePerCredit}/credit</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {order.transactionHash && (
                          <span className="font-mono">
                            Tx: {order.transactionHash.slice(0, 10)}...{order.transactionHash.slice(-8)}
                          </span>
                        )}
                        {order.completedDate && (
                          <span>Completed: {new Date(order.completedDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {order.certificateUrl && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            Certificate
                          </Button>
                        )}
                        {order.transactionHash && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Explorer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{order.projectName}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>Order #{order.id}</span>
                          <span>{order.ngoName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-foreground">{order.quantity} tCO₂e</span>
                        </div>
                        <p className="text-lg font-bold text-primary">${order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${order.pricePerCredit}/credit</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {order.transactionHash && (
                          <span className="font-mono">
                            Tx: {order.transactionHash.slice(0, 10)}...{order.transactionHash.slice(-8)}
                          </span>
                        )}
                        {order.completedDate && (
                          <span>Completed: {new Date(order.completedDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {order.certificateUrl && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Download className="h-4 w-4 mr-2" />
                            Certificate
                          </Button>
                        )}
                        {order.transactionHash && (
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Explorer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {processingOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{order.projectName}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>Order #{order.id}</span>
                          <span>{order.ngoName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-foreground">{order.quantity} tCO₂e</span>
                        </div>
                        <p className="text-lg font-bold text-primary">${order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${order.pricePerCredit}/credit</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Processing payment and blockchain transfer...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
