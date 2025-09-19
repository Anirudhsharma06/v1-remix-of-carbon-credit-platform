"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ethers } from "ethers"

export function BlockchainMarketplace() {
  const [verifiedProjects, setVerifiedProjects] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const CONTRACT_ADDRESS = "REPLACE_WITH_YOUR_CONTRACT_ADDRESS"
  const CONTRACT_ABI = "REPLACE_WITH_YOUR_ABI_JSON"

  useEffect(() => {
    fetchVerifiedProjects()
  }, [])

  const fetchVerifiedProjects = async () => {
    if (CONTRACT_ADDRESS === "REPLACE_WITH_YOUR_CONTRACT_ADDRESS") {
      return
    }

    if (typeof window === "undefined" || !window.ethereum) {
      return
    }

    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

      const verified: number[] = []

      for (let id = 1; id <= 50; id++) {
        try {
          const isVerified = await contract.verifiedProjects(id)
          if (isVerified) {
            verified.push(id)
          }
        } catch (error) {
          console.error(`Error checking project ${id}:`, error)
        }
      }

      setVerifiedProjects(verified)
    } catch (error) {
      console.error("Error fetching verified projects:", error)
    } finally {
      setLoading(false)
    }
  }

  if (CONTRACT_ADDRESS === "REPLACE_WITH_YOUR_CONTRACT_ADDRESS") {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please configure CONTRACT_ADDRESS and CONTRACT_ABI to view blockchain projects.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Verified Blockchain Projects</h2>

      {loading ? (
        <p>Loading verified projects...</p>
      ) : verifiedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {verifiedProjects.map((projectId) => (
            <Card key={projectId} className="border border-gray-200">
              <CardHeader>
                <CardTitle>Project #{projectId}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-4">ID: {projectId}</p>
                <Button className="w-full">Buy Credits</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No verified projects found.</p>
      )}
    </div>
  )
}
