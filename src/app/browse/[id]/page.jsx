import React from 'react';
import CardDetailsPage from './CardDetailsPage';
import { getArtworkDetails, getPlan } from '@/lib/api/ArtistsCard';
import { getUserSession } from '@/lib/core/session';

const page = async ({ params }) => {

    const { id } = await params;
    const data = await getArtworkDetails(id);

    const user = await getUserSession();

    let currentPackage = '';

    if (user?.role === 'user') {
        currentPackage = user?.plan ? await getPlan(user.plan) : null;
    }

    return (
        <div>
            <CardDetailsPage data={data} user={user} currentPackage={currentPackage} id={id} />
        </div>
    );
};

export default page;