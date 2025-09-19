// Wallet utility functions for carbon credit platform

export interface WalletConnection {
  address: string
  chainId: number
  isConnected: boolean
  provider: string
}

export interface TokenBalance {
  symbol: string
  name: string
  balance: number
  decimals: number
  contractAddress: string
  priceUSD: number
  value: number
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  token: string
  timestamp: string
  status: "pending" | "confirmed" | "failed"
  gasUsed?: string
  gasPrice?: string
}

// Mock wallet service (would integrate with actual Web3 providers)
export class WalletService {
  static async connectWallet(provider: "metamask" | "walletconnect" = "metamask"): Promise<WalletConnection> {
    // Mock implementation - would integrate with actual wallet providers
    console.log("Connecting to wallet:", provider)

    // Simulate wallet connection
    return {
      address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
      chainId: 1, // Ethereum mainnet
      isConnected: true,
      provider,
    }
  }

  static async disconnectWallet(): Promise<void> {
    console.log("Disconnecting wallet")
    // Would clear wallet connection state
  }

  static async getTokenBalances(address: string): Promise<TokenBalance[]> {
    // Mock implementation - would query blockchain for token balances
    console.log("Fetching token balances for:", address)

    return [
      {
        symbol: "CCT",
        name: "Carbon Credit Token",
        balance: 1250,
        decimals: 18,
        contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
        priceUSD: 25.5,
        value: 31875,
      },
    ]
  }

  static async sendTokens(
    tokenAddress: string,
    recipientAddress: string,
    amount: string,
    senderAddress: string,
  ): Promise<string> {
    // Mock implementation - would execute token transfer
    console.log("Sending tokens:", {
      tokenAddress,
      recipientAddress,
      amount,
      senderAddress,
    })

    // Simulate transaction hash
    return `0x${Math.random().toString(16).substr(2, 64)}`
  }

  static async getTransactionHistory(address: string): Promise<Transaction[]> {
    // Mock implementation - would fetch transaction history from blockchain
    console.log("Fetching transaction history for:", address)

    return [
      {
        hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        from: "0x9876543210fedcba0987654321fedcba09876543",
        to: address,
        value: "366",
        token: "CCT",
        timestamp: "2024-02-10T14:35:00Z",
        status: "confirmed",
        gasUsed: "21000",
        gasPrice: "20000000000",
      },
    ]
  }

  static async estimateGasFee(
    tokenAddress: string,
    recipientAddress: string,
    amount: string,
  ): Promise<{ gasLimit: string; gasPrice: string; totalFee: string }> {
    // Mock implementation - would estimate gas costs
    console.log("Estimating gas fee for transfer:", {
      tokenAddress,
      recipientAddress,
      amount,
    })

    return {
      gasLimit: "65000",
      gasPrice: "20000000000",
      totalFee: "0.0013", // ETH
    }
  }

  static async switchNetwork(chainId: number): Promise<void> {
    console.log("Switching to network:", chainId)
    // Would request network switch in wallet
  }

  static async addTokenToWallet(tokenAddress: string, symbol: string, decimals: number): Promise<void> {
    console.log("Adding token to wallet:", { tokenAddress, symbol, decimals })
    // Would request to add token to wallet
  }
}

// Utility functions
export const formatTokenAmount = (amount: number, decimals = 18): string => {
  return (amount / Math.pow(10, decimals)).toFixed(4)
}

export const parseTokenAmount = (amount: string, decimals = 18): string => {
  return (Number.parseFloat(amount) * Math.pow(10, decimals)).toString()
}

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatTransactionHash = (hash: string): string => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export const calculatePortfolioValue = (tokens: TokenBalance[]): number => {
  return tokens.reduce((total, token) => total + token.value, 0)
}

export const calculatePortfolioChange = (
  currentValue: number,
  previousValue: number,
): { change: number; percentage: number } => {
  const change = currentValue - previousValue
  const percentage = (change / previousValue) * 100
  return { change, percentage }
}

// Constants
export const SUPPORTED_NETWORKS = {
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
    blockExplorer: "https://etherscan.io",
  },
  POLYGON: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
  },
} as const

export const TOKEN_CONTRACTS = {
  CCT: "0x1234567890abcdef1234567890abcdef12345678",
} as const
