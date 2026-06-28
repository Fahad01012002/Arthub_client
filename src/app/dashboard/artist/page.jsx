// src/app/studio/page.jsx (অথবা আপনার ডিরেক্টরি অনুযায়ী)
import React from "react";
import StudioDashboardClient from "./StudioDashboardClient";
import { getArtworksById } from "@/lib/api/ArtistsCard";
import { getUserSession } from "@/lib/core/session";


export default async function StudioDashboard() {

  const user = await getUserSession();
  console.log(user?.id)

  const data = await  getArtworksById(user.id);

  const stats = [
    {
      title: "TOTAL ARTWORKS",
      value: "12",
      icon: (
        <svg className="w-5 h-5 text-amber-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgIcon: "bg-amber-950/30",
    },
    {
      title: "TOTAL SALES",
      value: "23",
      icon: (
        <svg className="w-5 h-5 text-emerald-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgIcon: "bg-emerald-950/30",
    },
    {
      title: "REVENUE",
      value: "$24,890",
      icon: (
        <svg className="w-5 h-5 text-blue-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgIcon: "bg-blue-950/30",
    },
    {
      title: "VIEWS",
      value: "7,340",
      icon: (
        <svg className="w-5 h-5 text-purple-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bgIcon: "bg-purple-950/30",
    },
  ];

  return <StudioDashboardClient stats={stats} data={data} />;
}