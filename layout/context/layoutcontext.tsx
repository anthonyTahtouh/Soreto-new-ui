'use client';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import type { ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb } from '@/types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const LayoutContext = React.createContext({} as LayoutContextProps);

let _confirmationCallback = (accepted: boolean) => {};

export const LayoutProvider = (props: ChildContainerProps) => {
    const [tabs, setTabs] = useState<any>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => {
        const savedConfig = sessionStorage.getItem('layoutConfig');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        } else {
            return {
                ripple: false,
                inputStyle: 'outlined',
                menuMode: 'static',
                colorScheme: 'light',
                componentTheme: 'soreto-theme',
                scale: 14,
                theme: 'soreto-theme',
                menuTheme: 'light',
                layoutTheme: 'primaryColor',
                topBarTheme: 'primaryColor'
            };
        }
    });
    const [dialogState, setDialogState] = useState({ message: '', opened: false });

    useEffect(() => {
        sessionStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
    }, [layoutConfig]);

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });

    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };

    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isSlim = () => {
        return layoutConfig.menuMode === 'slim';
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === 'slim-plus';
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === 'horizontal';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };
    const openTab = (value: number) => {
        setTabs((prevTabs: number[]) => [...prevTabs, value]);
    };
    const closeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
    };

    const hideConfirmationDialog = (accepted = false) => {
        setDialogState({ message: '', opened: false });
        _confirmationCallback(accepted);
    }

    const showConfirmationModal = (message: string, confirmationCallback: (accepted: boolean) => void) => {
        setDialogState({ message, opened: true });
        _confirmationCallback = confirmationCallback; 
    }

    const confirmationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={ () => hideConfirmationDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={() => hideConfirmationDialog(true)} />
        </>
    );

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar,
        tabs,
        closeTab,
        openTab,
        showConfirmationModal
    };

    return (
        <LayoutContext.Provider value={value as any}>
            <>
                <Head>
                    <title>Soreto</title>
                    <meta charSet="UTF-8" />
                    <meta name="description" content="Soreto Platform" />
                    <meta name="robots" content="noindex" />
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
                </Head>

                <Dialog 
                    visible={dialogState.opened} 
                    style={{ width: '450px' }} 
                    header="Confirm" modal 
                    onHide={hideConfirmationDialog}
                    footer={confirmationDialogFooter} >
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>
                                {dialogState.message}
                            </span>                        
                    </div>
                </Dialog>
                {props.children}
            </>
        </LayoutContext.Provider>
    );
};
