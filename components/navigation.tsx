"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Leaf, LogOut, User, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface NavigationProps {
  userRole?: "ngo" | "admin" | "investor"
  showAuthButtons?: boolean
}

export function Navigation({ userRole, showAuthButtons = false }: NavigationProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log("[v0] Checking for MetaMask...")

      if (typeof window === "undefined") {
        console.log("[v0] Not in browser environment")
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      let attempts = 0
      const maxAttempts = 20

      const checkForEthereum = () => {
        return new Promise((resolve) => {
          const check = () => {
            attempts++
            console.log(`[v0] MetaMask detection attempt ${attempts}`)
            console.log(`[v0] window.ethereum exists:`, !!window.ethereum)
            console.log(`[v0] window.ethereum.isMetaMask:`, window.ethereum?.isMetaMask)

            if (window.ethereum && window.ethereum.isMetaMask) {
              console.log("[v0] MetaMask detected!")
              resolve(true)
            } else if (attempts < maxAttempts) {
              console.log("[v0] MetaMask not found, retrying...")
              setTimeout(check, 200)
            } else {
              console.log("[v0] MetaMask not found after all attempts")
              resolve(false)
            }
          }
          check()
        })
      }

      const ethereumAvailable = await checkForEthereum()

      if (ethereumAvailable && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          console.log("[v0] Existing accounts:", accounts)
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("[v0] Error checking wallet connection:", error)
        }
      }
    }

    if (user) {
      checkWalletConnection()
    }
  }, [user])

  const connectMetaMask = async () => {
    console.log("[v0] Connect MetaMask clicked")
    console.log("[v0] window.ethereum exists:", !!window.ethereum)
    console.log("[v0] window.ethereum.isMetaMask:", window.ethereum?.isMetaMask)

    if (typeof window === "undefined" || !window.ethereum || !window.ethereum.isMetaMask) {
      console.log("[v0] MetaMask not detected")
      alert(
        "MetaMask is not installed or not detected! Please install MetaMask extension, refresh the page, and try again.",
      )
      return
    }

    setIsConnecting(true)
    try {
      console.log("[v0] Requesting accounts...")
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      console.log("[v0] Accounts received:", accounts)
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        console.log("[v0] Wallet connected:", accounts[0])
      }
    } catch (error: any) {
      console.error("[v0] Error connecting wallet:", error)
      if (error.code === 4001 || error.message?.includes("User rejected")) {
        console.log("[v0] User cancelled MetaMask connection")
        // Don't show an error for user cancellation - this is normal behavior
      } else {
        // Only show error alert for actual connection problems
        alert("Failed to connect MetaMask. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      if (walletAddress && window.ethereum) {
        try {
          // Clear the wallet connection by requesting accounts again with empty permissions
          await window.ethereum.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          })
          console.log("[v0] MetaMask wallet disconnected")
        } catch (walletError) {
          // If revokePermissions is not supported, try alternative method
          console.log("[v0] Wallet revoke not supported, clearing state only")
        }
      }

      await supabase.auth.signOut()
      setWalletAddress("")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getDashboardLink = () => {
    if (!profile?.role) return "/"

    switch (profile.role) {
      case "admin":
        return "/admin/dashboard"
      case "investor":
        return "/marketplace"
      case "ngo":
      default:
        return "/ngo/dashboard"
    }
  }

  const getRoleBadge = () => {
    if (!profile?.role) return null

    switch (profile.role) {
      case "admin":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Admin Portal</Badge>
      case "investor":
        return <Badge className="bg-accent/10 text-accent-foreground border-accent/20">Investor</Badge>
      case "ngo":
      default:
        return <Badge variant="secondary">NGO Portal</Badge>
    }
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href={user ? getDashboardLink() : "/"}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">CarbonChain</span>
          </Link>

          <div className="flex items-center space-x-4">
            {profile?.role && getRoleBadge()}

            {user && !loading && (
              <div className="flex items-center space-x-3">
                {walletAddress ? (
                  <div className="text-green-600 font-medium text-sm">
                    Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                ) : (
                  <Button onClick={connectMetaMask} disabled={isConnecting} variant="outline" size="sm">
                    <Wallet className="h-4 w-4 mr-2" />
                    {isConnecting ? "Connecting..." : "Connect MetaMask"}
                  </Button>
                )}
              </div>
            )}

            {user && !loading ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : showAuthButtons && !loading ? (
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
