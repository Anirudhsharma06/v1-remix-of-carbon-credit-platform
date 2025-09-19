import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Shield, TrendingUp, Users, MapPin, Award } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation showAuthButtons={true} />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground">
            Blockchain-Powered Carbon Credits
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance font-heading">
            Transparent Carbon Credit
            <span className="text-primary"> Verification</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Empowering NGOs, governments, and investors with blockchain-based carbon credit verification, trading, and
            monitoring for a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">Start Verifying Credits</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Built for Trust & Transparency</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our platform combines blockchain technology with satellite monitoring to ensure every carbon credit is
              verified and traceable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Blockchain Verification</CardTitle>
                <CardDescription className="leading-relaxed">
                  Immutable records ensure every carbon credit is authentic and traceable
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="font-heading">Satellite Monitoring</CardTitle>
                <CardDescription className="leading-relaxed">
                  AI-powered satellite data validates plantation and restoration projects
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Smart Contracts</CardTitle>
                <CardDescription className="leading-relaxed">
                  Automated tokenization and trading through secure smart contracts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="font-heading">Multi-Stakeholder</CardTitle>
                <CardDescription className="leading-relaxed">
                  Designed for NGOs, government agencies, and corporate investors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-heading">MRV Automation</CardTitle>
                <CardDescription className="leading-relaxed">
                  Automated Monitoring, Reporting, and Verification reduces fraud
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="font-heading">Impact Tracking</CardTitle>
                <CardDescription className="leading-relaxed">
                  Real-time tracking of environmental impact and carbon sequestration
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">How CarbonChain Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A streamlined process from data collection to carbon credit trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary font-heading">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Data Collection</h3>
              <p className="text-muted-foreground leading-relaxed">
                NGOs upload plantation data with GPS, photos, and drone imagery
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary font-heading">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Government authorities verify data using satellite monitoring
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary font-heading">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Tokenization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart contracts mint carbon credit tokens on the blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-foreground font-heading">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Trading</h3>
              <p className="text-muted-foreground leading-relaxed">
                Investors purchase verified credits through our marketplace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Ready to Make an Impact?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the future of carbon credit verification and trading. Start building trust in environmental
            sustainability today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold font-heading">CarbonChain</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Transparent blockchain-based carbon credit platform for a sustainable future.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-heading">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-foreground transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-foreground transition-colors">
                    Verification
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-heading">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-heading">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CarbonChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
