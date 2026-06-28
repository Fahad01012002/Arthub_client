import { getTransactionHistory } from "@/lib/actions/Admin";




function TypeBadge({ type }) {
  const styles =
    type === "Purchase"
      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
      : "border-purple-500/40 bg-purple-500/10 text-purple-400";

  return (
    <span
      className={`inline-block text-xs px-3 py-1 rounded-md border ${styles}`}
    >
      {type}
    </span>
  );
}

export default async function TransactionsTable() {

  const transactions = await getTransactionHistory();

  return (
    <div className="bg-[#000000] px-3">
      <h1 className="font-bold text-4xl mb-10">All Transactions History</h1>
      <div className="rounded-xl border border-[#2d2d2d] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#2f2f2f]">
              {["ID", "Type", "Amount", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-[16px] uppercase tracking-wider text-[#8b8680] font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t border-[#1f1c18]">
                <td
                  className="px-6 py-4 text-sm text-[#d9a44e]"
                >
                  {t.sessionId}
                </td>
                <td className="px-6 py-4">
                  <TypeBadge type={t.type} />
                </td>
                
                <td
                  className="px-6 py-4 text-sm font-semibold text-[#d9a44e]"
                >
                  {t.amount}
                </td>
                <td
                  className="px-6 py-4 text-sm text-[#8b8680]"
                >
                  {t.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}