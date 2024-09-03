'use client';

import React, { useState, useEffect } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import '../styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '../styles/demo/Demos.scss';
import StoreProvider from '../store/Provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isCssLoaded, setIsCssLoaded] = useState(false);

    useEffect(() => {
        const stylesheet = document.getElementById('theme-link') as HTMLLinkElement;

        // Check if the CSS is already loaded
        if (stylesheet.sheet) {
            setIsCssLoaded(true);
        } else {
            // If not loaded, wait for it to load
            const onLoad = () => setIsCssLoaded(true);
            stylesheet.addEventListener('load', onLoad);

            // Cleanup event listener on component unmount
            return () => {
                stylesheet.removeEventListener('load', onLoad);
            };
        }
    }, []);

    

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-link" href={`/theme/theme-light/soreto-theme/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                {isCssLoaded ? (
                    <PrimeReactProvider>
                        <StoreProvider>
                            <LayoutProvider>{children}</LayoutProvider>
                        </StoreProvider>
                    </PrimeReactProvider>
                ) : (
                    <p></p>
                )}
            </body>
        </html>
    );
}