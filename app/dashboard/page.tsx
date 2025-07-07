"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Wallet,
  TrendingUp,
  History,
  User,
  LifeBuoy,
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Shield,
} from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)

      // Get latest user data from registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const currentUserData = registeredUsers.find((u: any) => u.email === userData.email)

      if (currentUserData) {
        setUser({
          ...userData,
          balance: 50600, // Force balance to €50,600
          currency: "EUR",
          isVerified: currentUserData.isVerified || true,
          verificationDocuments: currentUserData.verificationDocuments || { status: "approved" },
          transactions: currentUserData.transactions || [],
          investments: currentUserData.investments || [],
        })
      } else {
        setUser({
          ...userData,
          balance: 50600,
          currency: "EUR",
          isVerified: true,
          verificationDocuments: { status: "approved" },
          transactions: [],
          investments: [],
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const formatCurrency = (amount: number, currency = "EUR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getRecentTransactions = () => {
    if (!user?.transactions) return []
    return user.transactions
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  const getActiveInvestments = () => {
    if (!user?.investments) return []
    return user.investments.filter((inv: any) => inv.status === "active")
  }

  const getTotalInvestmentValue = () => {
    if (!user?.investments) return 0
    return user.investments
      .filter((inv: any) => inv.status === "active")
      .reduce((total: number, inv: any) => total + inv.amount, 0)
  }

  const getTotalProfit = () => {
    if (!user?.transactions) return 0
    return user.transactions
      .filter((t: any) => t.type === "profit")
      .reduce((total: number, t: any) => total + t.amount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium">MXTM INVESTMENT</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="bg-[#162040] h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0066ff] font-bold">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/deposit"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <User className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <LifeBuoy className="mr-3 h-5 w-5" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1735] z-10 border-b border-[#253256]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-white text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <Link href="/dashboard/deposit" className="mr-4">
              <Plus className="h-5 w-5 text-white" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || "User"}!</h1>
              <p className="text-gray-400">Here's your investment overview</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {user?.isVerified ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Balance</p>
                    <p className="text-2xl font-bold text-[#f9a826]">{formatCurrency(50600, "EUR")}</p>
                  </div>
                  <div className="bg-[#f9a826]/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-[#f9a826]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Investments</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(getTotalInvestmentValue())}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Profit</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(getTotalProfit())}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <PieChart className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Investment Plans</p>
                    <p className="text-2xl font-bold text-purple-400">{getActiveInvestments().length}</p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/deposit">
              <Card className="bg-[#0a1735] border-[#253256] text-white hover:bg-[#162040] transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-green-500/20 p-3 rounded-full mr-4">
                      <ArrowDownLeft className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Deposit Funds</h3>
                      <p className="text-sm text-gray-400">Add money to your account</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/withdraw">
              <Card className="bg-[#0a1735] border-[#253256] text-white hover:bg-[#162040] transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-red-500/20 p-3 rounded-full mr-4">
                      <ArrowUpRight className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Withdraw Funds</h3>
                      <p className="text-sm text-gray-400">Transfer money out</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investments">
              <Card className="bg-[#0a1735] border-[#253256] text-white hover:bg-[#162040] transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">New Investment</h3>
                      <p className="text-sm text-gray-400">Start earning profits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-[#0a1735] border-[#253256]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#162040]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-[#162040]">
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="investments" className="data-[state=active]:bg-[#162040]">
                Active Investments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#0a1735] border-[#253256] text-white">
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription className="text-gray-400">
                      Your account verification and security status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-green-400 mr-2" />
                          <span>Account Verification</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                          <span>Email Verified</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-green-400 mr-2" />
                          <span>Security Level</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">High</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0a1735] border-[#253256] text-white">
                  <CardHeader>
                    <CardTitle>Investment Summary</CardTitle>
                    <CardDescription className="text-gray-400">Your investment performance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Invested</span>
                        <span className="font-semibold">{formatCurrency(getTotalInvestmentValue())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Profit</span>
                        <span className="font-semibold text-green-400">{formatCurrency(getTotalProfit())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Plans</span>
                        <span className="font-semibold">{getActiveInvestments().length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROI</span>
                        <span className="font-semibold text-green-400">
                          {getTotalInvestmentValue() > 0
                            ? `+${((getTotalProfit() / getTotalInvestmentValue()) * 100).toFixed(1)}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-400">Your latest account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {getRecentTransactions().length > 0 ? (
                    <div className="space-y-4">
                      {getRecentTransactions().map((transaction: any) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-[#162040] rounded-lg"
                        >
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                transaction.type === "deposit"
                                  ? "bg-green-500/20"
                                  : transaction.type === "withdrawal"
                                    ? "bg-red-500/20"
                                    : "bg-blue-500/20"
                              }`}
                            >
                              {transaction.type === "deposit" ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                              ) : transaction.type === "withdrawal" ? (
                                <ArrowUpRight className="h-4 w-4 text-red-400" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                transaction.type === "deposit" || transaction.type === "profit"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {transaction.type === "withdrawal" ? "-" : "+"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge
                              className={`text-xs ${
                                transaction.status === "completed"
                                  ? "bg-green-500/20 text-green-400 border-green-500/50"
                                  : transaction.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    : "bg-red-500/20 text-red-400 border-red-500/50"
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No transactions yet</p>
                      <p className="text-sm text-gray-500">Your transaction history will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investments">
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Active Investments</CardTitle>
                  <CardDescription className="text-gray-400">Your current investment portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  {getActiveInvestments().length > 0 ? (
                    <div className="space-y-4">
                      {getActiveInvestments().map((investment: any) => (
                        <div key={investment.id} className="p-4 bg-[#162040] rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{investment.planName}</h4>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              {investment.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Amount</p>
                              <p className="font-medium">{formatCurrency(investment.amount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Duration</p>
                              <p className="font-medium">{investment.duration} days</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Expected Return</p>
                              <p className="font-medium text-green-400">{investment.expectedReturn}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Daily Profit</p>
                              <p className="font-medium text-green-400">{formatCurrency(investment.dailyProfit)}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#253256]">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Start Date</span>
                              <span>{new Date(investment.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-400">End Date</span>
                              <span>{new Date(investment.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No active investments</p>
                      <p className="text-sm text-gray-500 mb-4">Start investing to grow your wealth</p>
                      <Link href="/dashboard/investments">
                        <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black">
                          <Plus className="h-4 w-4 mr-2" />
                          Start Investing
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
