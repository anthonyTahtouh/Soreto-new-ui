'use client';

import router, { useRouter } from 'next/router';
import Layout from '../../layout/layout';
import { useContext, useEffect } from 'react';
import StoreContext from '@/store/Context';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
        const { isAuthenticated } = useContext(StoreContext);

        // Render the wrapped component only if the user is authenticated
        if (!isAuthenticated) {
            return null; // Or you can return a loading spinner or some placeholder
        }

        return <Layout>{children}</Layout>;
}