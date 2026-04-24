import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
const MainLayout = () => {
    return (
        <div className=' flex flex-col min-h-screen border border-red-500 border-3'>
            <Header />
            {/* <Navbar /> */}
            <div className='flex min-w-screen'>
                <Sidebar />
                <main className='flex-1 w-full overflow-x-auto p-2 border-3 border-blue-500'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout