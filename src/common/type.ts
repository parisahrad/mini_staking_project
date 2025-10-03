export type Result<T> = {
    error?: boolean,
    status?: number,
    messega?: string,
    data?: T
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransactionType {
    WITHDRAW = 'withdraw',
    DEPOSIT = 'deposit'

}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}