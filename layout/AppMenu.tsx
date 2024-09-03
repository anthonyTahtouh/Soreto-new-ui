import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Dashboards',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'Global Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: 'Client Overview',
                    icon: 'pi pi-fw pi-image',
                    to: '/client-overview'
                }
            ]
        },
        {
            label: 'User Segmentation',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'User Segmentation',
                    icon: 'pi pi-fw pi-list',
                     to: '/userSegmentation/segmentation'
                },
                {
                    label: 'User Segmentation Scores',
                    icon: 'pi pi-fw pi-list',
                    to: '/userSegmentation/score'
                },
                {
                    label: 'User Segmentation Pools',
                    icon: 'pi pi-fw pi-list',
                    to: '/userSegmentation/userSegmentationPool'
                }
            ]
        },
        {
            label: 'User Management',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-list',
                    to: '/'
                },
                {
                    label: 'Create',
                    icon: 'pi pi-fw pi-plus',
                    to: '/'
                }
            ]
        },
        {
            label: 'Start',
            icon: 'pi pi-fw pi-download',
            items: [
                {
                    label: 'Buy Now',
                    icon: 'pi pi-fw pi-shopping-cart',
                    url: 'https://www.soreto.com'
                },
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-info-circle',
                    to: '/documentation'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
