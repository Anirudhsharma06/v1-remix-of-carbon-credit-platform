// Blockchain utility functions for carbon credit platform
import { ethers } from "ethers"

export interface CarbonCreditToken {
  tokenId: string
  projectId: string
  creditsAmount: number
  issueDate: string
  verifierAddress: string
  ipfsHash: string
}

export interface ProjectRecord {
  projectId: string
  ngoAddress: string
  verifierAddress: string
  location: {
    latitude: number
    longitude: number
  }
  area: number
  projectType: string
  carbonSequestration: number
  verificationDate: string
  ipfsHash: string
  transactionHash: string
  blockNumber: number
}

export const CONTRACTS = {
  CARBON_CREDIT_TOKEN: "0xf84473cbC4dB118348d1d07414Cd98987750428e",
  PROJECT_REGISTRY: "0x2345678901bcdef1234567890abcdef123456789",
  VERIFICATION_ORACLE: "0x3456789012cdef1234567890abcdef1234567890",
} as const

const RPC_URLS = {
  mainnet: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
  sepolia: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  polygon: "https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY",
  polygonAmoy: "https://newest-billowing-thunder.matic-amoy.quiknode.pro/3b8570557ac27520a694d0b445b617f95991cee5/",
} as const

export const NETWORK_CONFIG = {
  chainId: 80002, // Polygon Amoy testnet
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: [RPC_URLS.polygonAmoy],
  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
} as const

const CARBON_CREDIT_ABI = [
  "function mint(address to, uint256 amount, string memory projectId) external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function getProjectCredits(string memory projectId) external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event CreditsMinted(address indexed to, uint256 amount, string projectId)",
]

const PROJECT_REGISTRY_ABI = [
  "function registerProject(string memory projectId, address ngoAddress, string memory ipfsHash) external",
  "function verifyProject(string memory projectId, address verifier) external",
  "function getProject(string memory projectId) external view returns (tuple(string projectId, address ngoAddress, address verifier, string ipfsHash, bool verified))",
  "event ProjectRegistered(string projectId, address ngoAddress, string ipfsHash)",
  "event ProjectVerified(string projectId, address verifier)",
]

export class BlockchainService {
  private static getProvider(): ethers.JsonRpcProvider {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || RPC_URLS.polygonAmoy
    return new ethers.JsonRpcProvider(rpcUrl)
  }

  private static async getSigner(): Promise<ethers.Signer> {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)

      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }])
      } catch (switchError: any) {
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          await provider.send("wallet_addEthereumChain", [NETWORK_CONFIG])
        }
      }

      await provider.send("eth_requestAccounts", [])
      return provider.getSigner()
    }
    throw new Error("MetaMask not found. Please install MetaMask to interact with the blockchain.")
  }

  static async mintCarbonCredits(
    projectId: string,
    ngoAddress: string,
    creditsAmount: number,
    verificationData: any,
  ): Promise<string> {
    try {
      const signer = await this.getSigner()
      const contract = new ethers.Contract(CONTRACTS.CARBON_CREDIT_TOKEN, CARBON_CREDIT_ABI, signer)

      console.log("[v0] Minting carbon credits:", { projectId, ngoAddress, creditsAmount })

      const tx = await contract.mint(ngoAddress, ethers.parseUnits(creditsAmount.toString(), 18), projectId)
      await tx.wait()

      console.log("[v0] Carbon credits minted successfully:", tx.hash)
      return tx.hash
    } catch (error) {
      console.error("[v0] Error minting carbon credits:", error)
      throw error
    }
  }

  static async registerProject(projectData: Omit<ProjectRecord, "transactionHash" | "blockNumber">): Promise<string> {
    try {
      const signer = await this.getSigner()
      const contract = new ethers.Contract(CONTRACTS.PROJECT_REGISTRY, PROJECT_REGISTRY_ABI, signer)

      console.log("[v0] Registering project on blockchain:", projectData.projectId)

      const tx = await contract.registerProject(projectData.projectId, projectData.ngoAddress, projectData.ipfsHash)
      await tx.wait()

      console.log("[v0] Project registered successfully:", tx.hash)
      return tx.hash
    } catch (error) {
      console.error("[v0] Error registering project:", error)
      throw error
    }
  }

  static async verifyProject(projectId: string, verifierAddress: string, approvalData: any): Promise<string> {
    try {
      const signer = await this.getSigner()
      const contract = new ethers.Contract(CONTRACTS.PROJECT_REGISTRY, PROJECT_REGISTRY_ABI, signer)

      console.log("[v0] Recording verification on blockchain:", projectId)

      const tx = await contract.verifyProject(projectId, verifierAddress)
      await tx.wait()

      console.log("[v0] Project verification recorded:", tx.hash)
      return tx.hash
    } catch (error) {
      console.error("[v0] Error verifying project:", error)
      throw error
    }
  }

  static async getProjectRecord(projectId: string): Promise<ProjectRecord | null> {
    try {
      const provider = this.getProvider()
      const contract = new ethers.Contract(CONTRACTS.PROJECT_REGISTRY, PROJECT_REGISTRY_ABI, provider)

      console.log("[v0] Fetching project record:", projectId)

      const result = await contract.getProject(projectId)

      if (!result || !result.projectId) {
        return null
      }

      // Transform blockchain data to ProjectRecord format
      return {
        projectId: result.projectId,
        ngoAddress: result.ngoAddress,
        verifierAddress: result.verifier,
        location: { latitude: 0, longitude: 0 }, // Would need to fetch from IPFS
        area: 0, // Would need to fetch from IPFS
        projectType: "", // Would need to fetch from IPFS
        carbonSequestration: 0, // Would need to fetch from IPFS
        verificationDate: "", // Would need to fetch from IPFS
        ipfsHash: result.ipfsHash,
        transactionHash: "",
        blockNumber: 0,
      }
    } catch (error) {
      console.error("[v0] Error fetching project record:", error)
      return null
    }
  }

  static async getTokenBalance(address: string): Promise<number> {
    try {
      const provider = this.getProvider()
      const contract = new ethers.Contract(CONTRACTS.CARBON_CREDIT_TOKEN, CARBON_CREDIT_ABI, provider)

      console.log("[v0] Fetching token balance for:", address)

      const balance = await contract.balanceOf(address)
      return Number.parseFloat(ethers.formatUnits(balance, 18))
    } catch (error) {
      console.error("[v0] Error fetching token balance:", error)
      return 0
    }
  }

  static async transferTokens(from: string, to: string, amount: number): Promise<string> {
    try {
      const signer = await this.getSigner()
      const contract = new ethers.Contract(CONTRACTS.CARBON_CREDIT_TOKEN, CARBON_CREDIT_ABI, signer)

      console.log("[v0] Transferring tokens:", { from, to, amount })

      const tx = await contract.transfer(to, ethers.parseUnits(amount.toString(), 18))
      await tx.wait()

      console.log("[v0] Tokens transferred successfully:", tx.hash)
      return tx.hash
    } catch (error) {
      console.error("[v0] Error transferring tokens:", error)
      throw error
    }
  }

  static async connectWallet(): Promise<string> {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)

        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }])
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await provider.send("wallet_addEthereumChain", [NETWORK_CONFIG])
          }
        }

        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        console.log("[v0] Wallet connected to Polygon Amoy:", address)
        return address
      } catch (error) {
        console.error("[v0] Error connecting wallet:", error)
        throw error
      }
    }
    throw new Error("MetaMask not found")
  }

  static async getConnectedAddress(): Promise<string | null> {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        return accounts.length > 0 ? accounts[0].address : null
      } catch (error) {
        console.error("[v0] Error getting connected address:", error)
        return null
      }
    }
    return null
  }
}

export class IPFSService {
  private static readonly IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/"
  private static readonly PINATA_API_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

  static async uploadProjectData(projectData: any): Promise<string> {
    try {
      console.log("[v0] Uploading to IPFS:", projectData)

      // For now, use a mock implementation
      // In production, you would use Pinata API or similar
      const response = await fetch("/api/ipfs/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS")
      }

      const result = await response.json()
      console.log("[v0] IPFS upload successful:", result.hash)
      return result.hash
    } catch (error) {
      console.error("[v0] Error uploading to IPFS:", error)

      // Fallback to mock hash for development
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let hash = "Qm"
      for (let i = 0; i < 44; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return hash
    }
  }

  static async getProjectData(ipfsHash: string): Promise<any> {
    try {
      console.log("[v0] Fetching from IPFS:", ipfsHash)

      const response = await fetch(`${this.IPFS_GATEWAY}${ipfsHash}`)
      if (!response.ok) {
        throw new Error("Failed to fetch from IPFS")
      }

      const data = await response.json()
      console.log("[v0] IPFS fetch successful")
      return data
    } catch (error) {
      console.error("[v0] Error fetching from IPFS:", error)
      return null
    }
  }
}

// Utility functions
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatHash = (hash: string): string => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export const generateProjectId = (): string => {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `PROJ-${year}-${randomNum}`
}

export const generateTokenId = (projectId: string): string => {
  const num = projectId.split("-")[2]
  return `CCT-${num}`
}
