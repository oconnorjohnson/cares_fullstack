import {
  Transaction,
  columns,
} from "@/components/admin/tables/transactions/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestAllTransactions } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getTransactions(): Promise<Transaction[]> {
  const transactions = await requestAllTransactions();
  console.log(transactions);
  const modifiedTransactions = transactions.map((transaction) => ({
    ...transaction,
    id: transaction.id,
    created_at: format(new Date(transaction.created_at), "MM/dd/yyyy hh:mm a"), // Adjust the format string as needed
    UserId: transaction.UserId,
    FundTypeId: transaction.FundTypeId,
    quantity: transaction.quantity,
    unitValue: transaction.unitValue,
    totalValue: transaction.totalValue,
    TransactionId: transaction.TransactionId,
    isPurchase: transaction.isPurchase,
    isDisbursement: transaction.isDisbursement,
    isReversal: transaction.isReversal,
    isDeposit: transaction.isDeposit,
    isCARES: transaction.isCARES,
    isRFF: transaction.isRFF,
    details: transaction.details,
    previousBalance: transaction.previousBalance,
  }));
  console.log(modifiedTransactions);
  return modifiedTransactions as unknown as Transaction[];
}

export default async function TransactionsTable() {
  const transactions = await getTransactions();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={transactions}
        defaultSorting={[
          {
            id: "created_at",
            desc: true,
          },
        ]}
        searchPlaceholder="Search transactions..."
      />
    </div>
  );
}
