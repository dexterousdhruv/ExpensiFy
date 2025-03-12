export interface Budget {
  id: string
  createdAt: Date | string
  updatedAt: Date | string

  budgetCategory: string
  amountSpent: number
  budgetLimit: number
  deletedAt: Date | string | null

  timestamp: number

  userId: string      
}

export interface Expense {
  id: string
  createdAt: Date | string
  updatedAt:     Date | string
  expenseName:  string
  amount:        number
  budgetCategory: string
  deletedAt:     Date | string | null

  timestamp: number

  userId: string
  budgetId: string

}
