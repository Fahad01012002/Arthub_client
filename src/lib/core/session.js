'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { serverFetch } from "./Server";
import { redirect } from "next/navigation";


export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.user || null;
}

export const getUserToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.session?.token || null;
}

export const requireRole = async (role) => {
    const user = await getUserSession();
    if (user?.role !== role) {
        return redirect('/forbidden');
    }
}

export const getUserById = async (userId) => {
    return serverFetch(`/api/user/${userId}`);
}
