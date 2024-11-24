import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, Globe, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/nav'

export default function LandingPage() {
  return (
    <>
    <Navbar />
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Global Trade for Indian SMBs
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your export processes, manage shipments, and grow your international business with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup"><Button>Get Started</Button></Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Real-time Communication</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Stay connected with carriers, customers, and partners through instant messaging and video calls.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Document Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easily organize, share, and track all your export documentation in one secure place.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Query Resolution</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Quickly address and resolve customer queries and shipping issues with our integrated ticketing system.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Gain insights into your export performance and identify areas for improvement with detailed analytics.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Globe className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Compliance Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Stay up-to-date with international trade regulations and ensure compliance across all your exports.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ArrowRight className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Shipment Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Monitor your shipments in real-time and provide accurate updates to your customers.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Simplify Your Global Trade?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of Indian SMBs who are already using our platform to streamline their export processes and grow their international business.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex space-x-2">
                  <Link href="/signup" className="w-full">
                    <Button className="w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 CargoGlide. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
    </>
  )
}

