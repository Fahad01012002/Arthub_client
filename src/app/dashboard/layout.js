
import React from 'react';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';

const DashboardLayout = ({children}) => {
    return (
        <div className='flex min-h-screen mt-30 w-11/12 mx-auto'>
            <DashboardSidebar />
            <main className='flex-1'>{children}</main>
        </div>
    );
};

export default DashboardLayout;