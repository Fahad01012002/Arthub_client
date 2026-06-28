// app/components/RoleAssigner.jsx
"use client";

import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

export default function RoleAssigner() {
    useEffect(() => {
        const applyPendingRole = async () => {
            const pendingRole = localStorage.getItem("pendingRole");
            const pendingPlan = localStorage.getItem("pendingPlan");

            if (!pendingRole) return;

            const { data: session } = await authClient.getSession();
            if (!session?.user) return;

            await authClient.updateUser({
                role: pendingRole,
                plan: pendingPlan,
            });

            localStorage.removeItem("pendingRole");
            localStorage.removeItem("pendingPlan");
        };

        applyPendingRole();
    }, []);

    return null;
}