import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className='flex min-w-screen'>
                <Sidebar />
                <main className='flex-1 w-full overflow-x-auto p-2'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
