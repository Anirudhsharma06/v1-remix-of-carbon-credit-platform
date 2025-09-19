"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface WalletConnectorProps {
  isLoggedIn: boolean
}

export function WalletConnector({ isLoggedIn }: WalletConnectorProps) {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }
    checkConnection()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress("")
        } else {
          setWalletAddress(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed!")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="mb-6">
      {walletAddress ? (
        <div className="text-green-600 font-medium">Connected: {walletAddress}</div>
      ) : (
        <Button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}
    </div>
  )
}
