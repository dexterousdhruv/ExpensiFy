export type Expense = {
  id: string
  createdAt: Date
  updatedAt: Date
  
  expenseName:  string
  amount:        Number
  budgetCategory: string
  deletedAt: Date 
  
  timestamp: number

  userId: string      // n:1 relation to User
  budgetId: string      // n:1 relation to Budget

}

export type Budget = {
  id: string
  createdAt: Date
  updatedAt: Date

  budgetCategory: string
  amountSpent: Number
  budgetLimit: Number
  deletedAt: Date 
  
  timestamp: number

  userId: string      // n:1 relation to User
}