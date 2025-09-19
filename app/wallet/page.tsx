"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Wallet,
  Send,
  Receipt as Receive,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertCircle,
  Clock,
  Leaf,
  Coins,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isConnected, setIsConnected] = useState(true) // Mock wallet connection

  const walletData = {
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    balance: {
      eth: 2.45,
      usd: 4890.25,
    },
    tokens: [
      {
        symbol: "CCT",
        name: "Carbon Credit Token",
        balance: 1250,
        value: 31875, // $25.5 per token
        pricePerToken: 25.5,
        change24h: 5.2,
        contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      },
    ],
  }

  const transactions = [
    {
      id: 1,
      type: "receive",
      token: "CCT",
      amount: 366,
      value: 9333,
      from: "0x9876543210fedcba0987654321fedcba09876543",
      to: walletData.address,
      hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      timestamp: "2024-02-10T14:35:00Z",
      status: "confirmed",
      description: "Carbon credits from Coastal Protection Project",
    },
    {
      id: 2,
      type: "send",
      token: "CCT",
      amount: 100,
      value: 2550,
      from: walletData.address,
      to: "0x1111222233334444555566667777888899990000",
      hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      timestamp: "2024-02-08T16:20:00Z",
      status: "confirmed",
      description: "Transfer to corporate offset program",
    },
    {
      id: 3,
      type: "receive",
      token: "CCT",
      amount: 510,
      value: 14662.5,
      from: "0x9876543210fedcba0987654321fedcba09876543",
      to: walletData.address,
      hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      timestamp: "2024-02-05T14:15:00Z",
      status: "confirmed",
      description: "Carbon credits from Mangrove Restoration Phase 1",
    },
    {
      id: 4,
      type: "send",
      token: "CCT",
      amount: 250,
      value: 5500,
      from: walletData.address,
      to: "0x2222333344445555666677778888999900001111",
      hash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      timestamp: "2024-02-03T11:45:00Z",
      status: "pending",
      description: "Retirement for carbon neutrality claim",
    },
  ]

  const portfolioStats = {
    totalValue: walletData.tokens.reduce((sum, token) => sum + token.value, 0),
    totalTokens: walletData.tokens.reduce((sum, token) => sum + token.balance, 0),
    change24h: 5.2,
    changeValue: 1520.75,
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTransactionIcon = (type: string, status: string) => {
    if (status === "pending") return <Clock className="h-4 w-4 text-amber-500" />
    if (type === "receive") return <TrendingUp className="h-4 w-4 text-secondary" />
    return <TrendingDown className="h-4 w-4 text-primary" />
  }

  const handleTransfer = () => {
    console.log("Transferring tokens:", {
      amount: transferAmount,
      recipient: recipientAddress,
      token: selectedToken?.symbol,
    })
    // Here you would integrate with Web3 wallet for actual transfer
  }

  const connectWallet = () => {
    setIsConnected(true)
    // Here you would integrate with MetaMask or other wallet providers
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
              <Badge className="bg-primary/10 text-primary border-primary/20">Wallet</Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/marketplace">Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Carbon Credit Wallet</h1>
            <p className="text-muted-foreground">
              Manage your carbon credit tokens and track your environmental impact
            </p>
          </div>

          {!isConnected ? (
            /* Wallet Connection */
            <Card className="text-center py-12">
              <CardContent>
                <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your Web3 wallet to manage carbon credit tokens and view your portfolio
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={connectWallet} className="px-8">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </Button>
                  <Button variant="outline" onClick={connectWallet} className="px-8 bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Connect WalletConnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Wallet Overview */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        ${portfolioStats.totalValue.toLocaleString()}
                      </span>
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-secondary mr-1" />
                      <span className="text-secondary">+${portfolioStats.changeValue.toLocaleString()} (24h)</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-secondary">{portfolioStats.totalTokens}</span>
                      <Coins className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">tCO₂e tokens</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-secondary">+{portfolioStats.change24h}%</span>
                      <TrendingUp className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">price movement</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-mono">{formatAddress(walletData.address)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(walletData.address)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <Shield className="h-3 w-3 text-secondary mr-1" />
                      <span className="text-secondary">Connected</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="tokens" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tokens">My Tokens</TabsTrigger>
                  <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                  <TabsTrigger value="analytics">Portfolio Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="tokens" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Token Holdings</CardTitle>
                          <CardDescription>Your carbon credit token portfolio</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="bg-transparent">
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Send Carbon Credits</DialogTitle>
                                <DialogDescription>
                                  Transfer carbon credit tokens to another wallet address
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="recipient">Recipient Address</Label>
                                  <Input
                                    id="recipient"
                                    placeholder="0x..."
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="amount">Amount (CCT)</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                  />
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <span>
                                      Estimated gas fee: ~$2.50 • Transaction will be irreversible once confirmed
                                    </span>
                                  </div>
                                </div>
                                <Button onClick={handleTransfer} className="w-full">
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Tokens
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button>
                            <Receive className="h-4 w-4 mr-2" />
                            Receive
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {walletData.tokens.map((token, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                                <Coins className="h-6 w-6 text-secondary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{token.name}</h3>
                                <p className="text-sm text-muted-foreground">{token.symbol}</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {formatAddress(token.contractAddress)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">
                                {token.balance.toLocaleString()} {token.symbol}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${token.value.toLocaleString()} • ${token.pricePerToken}/token
                              </p>
                              <div className="flex items-center justify-end gap-1 text-xs">
                                <TrendingUp className="h-3 w-3 text-secondary" />
                                <span className="text-secondary">+{token.change24h}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>All your carbon credit token transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                {getTransactionIcon(tx.type, tx.status)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-foreground capitalize">
                                    {tx.type} {tx.token}
                                  </h4>
                                  <Badge
                                    variant={tx.status === "confirmed" ? "default" : "outline"}
                                    className={
                                      tx.status === "confirmed"
                                        ? "bg-secondary/10 text-secondary border-secondary/20"
                                        : "border-amber-200 text-amber-700"
                                    }
                                  >
                                    {tx.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{tx.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                  <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                                  <span className="font-mono">
                                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                                  </span>
                                  <span>
                                    {tx.type === "receive" ? "From" : "To"}:{" "}
                                    {formatAddress(tx.type === "receive" ? tx.from : tx.to)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">
                                {tx.type === "receive" ? "+" : "-"}
                                {tx.amount} {tx.token}
                              </p>
                              <p className="text-sm text-muted-foreground">${tx.value.toLocaleString()}</p>
                              <Button variant="ghost" size="sm" className="mt-1">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>Your carbon credit investment performance over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Initial Investment</span>
                            <span className="font-medium">$28,500</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Current Value</span>
                            <span className="font-medium text-secondary">$31,875</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Gain</span>
                            <span className="font-medium text-secondary">+$3,375 (+11.8%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">24h Change</span>
                            <span className="font-medium text-secondary">+$1,521 (+5.2%)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Environmental Impact</CardTitle>
                        <CardDescription>Your contribution to carbon offset and sustainability</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total CO₂ Offset</span>
                            <span className="font-medium text-secondary">1,250 tCO₂e</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Equivalent Cars Off Road</span>
                            <span className="font-medium">271 cars/year</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Trees Supported</span>
                            <span className="font-medium">16,500 trees</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Projects Supported</span>
                            <span className="font-medium">3 projects</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Token Distribution</CardTitle>
                      <CardDescription>Breakdown of your carbon credit holdings by project type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-border rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-secondary rounded"></div>
                            <span className="font-medium">Mangrove Restoration</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">876 CCT</span>
                            <span className="text-sm text-muted-foreground ml-2">(70.1%)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-primary rounded"></div>
                            <span className="font-medium">Reforestation</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">256 CCT</span>
                            <span className="text-sm text-muted-foreground ml-2">(20.5%)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-amber-500 rounded"></div>
                            <span className="font-medium">Afforestation</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">118 CCT</span>
                            <span className="text-sm text-muted-foreground ml-2">(9.4%)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
