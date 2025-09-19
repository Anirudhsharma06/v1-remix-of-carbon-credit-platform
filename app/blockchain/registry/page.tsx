"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Hash,
  Coins,
  TreePine,
  MapPin,
  Calendar,
  Users,
  Leaf,
  LinkIcon,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function BlockchainRegistry() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const blockchainRecords = [
    {
      id: 1,
      projectId: "PROJ-2024-001",
      projectName: "Coastal Protection Project",
      ngoName: "Ocean Guardians",
      tokenId: "CCT-001",
      creditsIssued: 366,
      transactionHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      blockNumber: 18234567,
      timestamp: "2024-02-01T10:30:00Z",
      verifierAddress: "0x9876543210fedcba0987654321fedcba09876543",
      status: "minted",
      location: "Tamil Nadu, India",
      area: "18.3 hectares",
      projectType: "Mangrove Restoration",
      carbonSequestration: 366,
      verificationDate: "2024-02-01",
      ipfsHash: "QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T",
    },
    {
      id: 2,
      projectId: "PROJ-2024-002",
      projectName: "Mangrove Restoration Phase 1",
      ngoName: "Green Earth Foundation",
      tokenId: "CCT-002",
      creditsIssued: 510,
      transactionHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      blockNumber: 18234890,
      timestamp: "2024-02-05T14:15:00Z",
      verifierAddress: "0x9876543210fedcba0987654321fedcba09876543",
      status: "minted",
      location: "Maharashtra, India",
      area: "25.5 hectares",
      projectType: "Mangrove Restoration",
      carbonSequestration: 510,
      verificationDate: "2024-02-05",
      ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W",
    },
    {
      id: 3,
      projectId: "PROJ-2024-003",
      projectName: "Community Forest Initiative",
      ngoName: "Forest Guardians NGO",
      tokenId: "CCT-003",
      creditsIssued: 800,
      transactionHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      blockNumber: 18235123,
      timestamp: "2024-02-08T09:45:00Z",
      verifierAddress: "0x9876543210fedcba0987654321fedcba09876543",
      status: "minted",
      location: "Kerala, India",
      area: "40.0 hectares",
      projectType: "Reforestation",
      carbonSequestration: 800,
      verificationDate: "2024-02-08",
      ipfsHash: "QmB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X",
    },
  ]

  const smartContracts = [
    {
      name: "Carbon Credit Token (CCT)",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      type: "ERC-20",
      totalSupply: "1,676 CCT",
      description: "Main carbon credit token contract",
      verified: true,
    },
    {
      name: "Project Registry",
      address: "0x2345678901bcdef1234567890abcdef123456789",
      type: "Registry",
      totalProjects: "156",
      description: "Immutable project data storage",
      verified: true,
    },
    {
      name: "Verification Oracle",
      address: "0x3456789012cdef1234567890abcdef1234567890",
      type: "Oracle",
      totalVerifications: "142",
      description: "Satellite data verification oracle",
      verified: true,
    },
  ]

  const filteredRecords = blockchainRecords.filter(
    (record) =>
      record.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.transactionHash.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

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
              <Badge className="bg-primary/10 text-primary border-primary/20">Blockchain Registry</Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/marketplace">Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Blockchain Registry</h1>
            <p className="text-muted-foreground">
              Immutable record of all verified carbon credit projects and smart contract interactions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{blockchainRecords.length}</span>
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">on blockchain</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">
                    {blockchainRecords.reduce((sum, record) => sum + record.creditsIssued, 0).toLocaleString()}
                  </span>
                  <Coins className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">tCO₂e tokens minted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{smartContracts.length}</span>
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">deployed & verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Block</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {Math.max(...blockchainRecords.map((r) => r.blockNumber)).toLocaleString()}
                  </span>
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">block height</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="records" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="records">Project Records</TabsTrigger>
              <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
              <TabsTrigger value="explorer">Block Explorer</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Verified Project Records</CardTitle>
                      <CardDescription>
                        Immutable blockchain records of all verified carbon credit projects
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects, NGOs, or transaction hashes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-80"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-foreground">{record.projectName}</h3>
                              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                                {record.creditsIssued} tCO₂e
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {record.tokenId}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {record.ngoName}
                              </span>
                              <span className="flex items-center gap-1">
                                <TreePine className="h-3 w-3" />
                                {record.projectType}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {record.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                Block: {record.blockNumber.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(record.timestamp).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1 font-mono">
                                <LinkIcon className="h-3 w-3" />
                                {formatHash(record.transactionHash)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRecord(record)}
                                  className="bg-transparent"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Blockchain Record: {selectedRecord?.projectName}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Immutable blockchain record of verified carbon credit project
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedRecord && (
                                  <div className="space-y-6">
                                    {/* Project Information */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <h4 className="font-semibold text-foreground">Project Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Project ID:</span>
                                            <span className="font-mono">{selectedRecord.projectId}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">NGO:</span>
                                            <span className="font-medium">{selectedRecord.ngoName}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span className="font-medium">{selectedRecord.projectType}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Area:</span>
                                            <span className="font-medium">{selectedRecord.area}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Location:</span>
                                            <span className="font-medium">{selectedRecord.location}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <h4 className="font-semibold text-foreground">Blockchain Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Transaction Hash:</span>
                                            <div className="flex items-center gap-2">
                                              <span className="font-mono text-xs">
                                                {formatHash(selectedRecord.transactionHash)}
                                              </span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(selectedRecord.transactionHash)}
                                              >
                                                <Copy className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Block Number:</span>
                                            <span className="font-mono">
                                              {selectedRecord.blockNumber.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Token ID:</span>
                                            <span className="font-mono">{selectedRecord.tokenId}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Credits Issued:</span>
                                            <span className="font-medium text-secondary">
                                              {selectedRecord.creditsIssued} tCO₂e
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Verifier:</span>
                                            <div className="flex items-center gap-2">
                                              <span className="font-mono text-xs">
                                                {formatAddress(selectedRecord.verifierAddress)}
                                              </span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(selectedRecord.verifierAddress)}
                                              >
                                                <Copy className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* IPFS Data */}
                                    <div className="border border-border rounded-lg p-4 bg-muted/20">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Download className="h-5 w-5 text-primary" />
                                        <h4 className="font-semibold text-foreground">Decentralized Storage</h4>
                                      </div>
                                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground">IPFS Hash:</span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs">
                                              {formatHash(selectedRecord.ipfsHash)}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => copyToClipboard(selectedRecord.ipfsHash)}
                                            >
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Storage Status:</span>
                                          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                                            Pinned
                                          </Badge>
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Project data, images, and verification documents are stored on IPFS for
                                        decentralized access
                                      </p>
                                    </div>

                                    {/* Verification Timeline */}
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-foreground">Verification Timeline</h4>
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 border border-border rounded">
                                          <CheckCircle className="h-4 w-4 text-secondary" />
                                          <div className="flex-1">
                                            <p className="font-medium text-sm">Project Verified</p>
                                            <p className="text-xs text-muted-foreground">
                                              Government authority approved project data
                                            </p>
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(selectedRecord.verificationDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border border-border rounded">
                                          <Coins className="h-4 w-4 text-primary" />
                                          <div className="flex-1">
                                            <p className="font-medium text-sm">Tokens Minted</p>
                                            <p className="text-xs text-muted-foreground">
                                              {selectedRecord.creditsIssued} tCO₂e tokens created on blockchain
                                            </p>
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(selectedRecord.timestamp).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Contracts</CardTitle>
                  <CardDescription>
                    Deployed and verified smart contracts powering the carbon credit platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {smartContracts.map((contract, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-foreground">{contract.name}</h3>
                              <Badge variant="outline">{contract.type}</Badge>
                              {contract.verified && (
                                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{contract.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 font-mono">
                                <Hash className="h-3 w-3" />
                                {formatAddress(contract.address)}
                              </span>
                              <span>
                                {contract.type === "ERC-20"
                                  ? `Supply: ${contract.totalSupply}`
                                  : contract.type === "Registry"
                                    ? `Projects: ${contract.totalProjects}`
                                    : `Verifications: ${contract.totalVerifications}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(contract.address)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Explorer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explorer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Block Explorer</CardTitle>
                  <CardDescription>Real-time blockchain data and transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Latest Blocks</h4>
                      <div className="space-y-3">
                        {blockchainRecords
                          .sort((a, b) => b.blockNumber - a.blockNumber)
                          .slice(0, 5)
                          .map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center justify-between p-3 border border-border rounded"
                            >
                              <div>
                                <p className="font-medium text-sm">Block #{record.blockNumber.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(record.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">1 tx</p>
                                <p className="text-xs text-muted-foreground">Carbon Credit</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Transactions</h4>
                      <div className="space-y-3">
                        {blockchainRecords
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .slice(0, 5)
                          .map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center justify-between p-3 border border-border rounded"
                            >
                              <div>
                                <p className="font-mono text-sm">{formatHash(record.transactionHash)}</p>
                                <p className="text-xs text-muted-foreground">Token Mint</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-secondary">{record.creditsIssued} CCT</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(record.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
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
