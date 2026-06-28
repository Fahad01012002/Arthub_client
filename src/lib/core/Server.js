'use server'

import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
    const token = await getUserToken();
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};

    return header;
}

export const serverFetch = async (path) => {
    const res = await fetch(`${baseURL}${path}`, { cache: 'no-store' }); // এটি যুক্ত করুন
    return res.json();
}

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseURL}${path}`, {
        headers: await authHeader()
    });

    return handleStatusCode(res);
}

export const serverMutation = async (path, data = null, method = 'POST') => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ... await authHeader()
        }
    };

    if (data && method !== 'DELETE') {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(`${baseURL}${path}`, options);

    return handleStatusCode(res);
}

const handleStatusCode = res => {
    //handle 401 , 403 
    if (res.status === 401) {
        redirect('/auth/login')
    }

    if (res.status === 403) {
        redirect('/forbidden');
    }

    return res.json();
}