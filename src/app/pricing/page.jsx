import { getUserSession } from '@/lib/core/session';
import React from 'react';
import PricingPage from './Price';

const page = async () => {

    const {plan , id} = await getUserSession();

    console.log(plan, id)

    return (
        <div>
            <PricingPage currentPlanId={plan} buyerId={id} />
        </div>
    );
};

export default page;