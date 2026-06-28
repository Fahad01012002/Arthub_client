import { serverMutation } from "../core/Server"


export const createTransactionHistory = async (data) => {
    return serverMutation('/api/transaction-history' , data)
}