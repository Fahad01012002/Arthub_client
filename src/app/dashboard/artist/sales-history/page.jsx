import TransactionHistoryTable from "@/app/components/Dashboard/TransactionHistory";
import { getArtworksFromTransaction } from "@/lib/api/Transaction";
import { getUserSession } from "@/lib/core/session";


const ArtistHistoryPage = async () => {

    const user = await getUserSession();

    const transactionHistory = await getArtworksFromTransaction(user.id);

    return (
        <div>
            <TransactionHistoryTable transactionHistory={transactionHistory} />
        </div>
    );
};

export default ArtistHistoryPage;