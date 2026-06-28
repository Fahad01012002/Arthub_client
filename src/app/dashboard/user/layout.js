import { requireRole } from "@/lib/core/session";


const Recruiterlayout = async ({children}) => {
    await requireRole('user');
    return children;
};

export default Recruiterlayout;