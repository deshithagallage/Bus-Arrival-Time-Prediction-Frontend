import { Link } from "react-router-dom";
import { ArrowRight, Bus, ChartBar } from "lucide-react";
import NavBar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <ThemeProvider>
      <NavBar currentPage="" />
      <div className="min-h-screen mt-8">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <header className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="text-indigo-600 dark:text-indigo-400">Next</span>
              <span>Bus</span>
            </h1>
            <p className="mt-3 max-w-md text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Your ultimate companion for seamless public transportation. Never
              miss a bus again with our real-time tracking and insightful
              statistics.
            </p>
          </header>

          <main className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Card className="flex flex-col items-start rounded-lg p-6 shadow-lg transition-all hover:shadow-xl">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-2xl font-bold">Next Bus</h2>
                  <Bus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Find out when your next bus is arriving in real-time.
                </p>
                <Link
                  to="/nextbus"
                  className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Check Next Bus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-start rounded-lg p-6 shadow-lg transition-all hover:shadow-xl">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-2xl font-bold">Insights</h2>
                  <ChartBar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Explore detailed statistics and trends about your bus routes.
                </p>
                <Link
                  to="/stats"
                  className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Card>
            </div>
          </main>

          <footer className="mt-20 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Next Bus. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
