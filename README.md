# Carbon Credit Platform

A comprehensive carbon credit marketplace platform built with Next.js, Supabase, and blockchain integration. This platform connects NGOs, administrators, and investors in the carbon credit ecosystem.

## Features

- **NGO Dashboard**: Project submission and management
- **Admin Dashboard**: Project review, approval, and verification
- **Investor Marketplace**: Browse and invest in verified carbon credit projects
- **Supabase Integration**: Authentication and database management
- **Blockchain Support**: Ethereum wallet integration for transactions

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Blockchain**: Ethers.js for Ethereum integration
- **Package Manager**: pnpm (recommended) or npm

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- pnpm (recommended) or npm
- Git

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd carbon-credit-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   \`\`\`

3. **Set up environment variables**
   
   The following environment variables are required and should be configured in your Vercel project or local environment:
   
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   
   # Database Configuration (Supabase provides these)
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_HOST=your_postgres_host
   POSTGRES_DATABASE=your_postgres_database
   
   # Blockchain Configuration
   NEXT_PUBLIC_RPC_URL=your_ethereum_rpc_url
   
   # Development
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Set up the database**
   
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   \`\`\`bash
   # Execute these files in order:
   scripts/001_create_database_schema.sql
   scripts/002_create_profile_trigger.sql
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   # Using pnpm
   pnpm dev
   
   # Or using npm
   npm run dev
   \`\`\`

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── marketplace/       # Investor marketplace
│   ├── ngo/              # NGO dashboard pages
│   └── auth/             # Authentication pages
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   └── ...               # Feature-specific components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # General utilities
├── scripts/              # Database setup scripts
└── public/               # Static assets
\`\`\`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## User Roles

1. **NGOs**: Submit carbon credit projects for review
2. **Admins**: Review, approve, and verify submitted projects
3. **Investors**: Browse and invest in approved carbon credit projects

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue in the repository or contact the development team.
