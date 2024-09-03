'use client';
import { DataMockService } from '@/service/DataMockService';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions, ColumnFilterElementTemplateOptions } from 'primereact/column';
import type { Demo } from '@/types';
import { Avatar } from 'primereact/avatar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Chart } from 'primereact/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { TreeTable } from 'primereact/treetable';

interface DropdownItem {
    name: string;
    code: string;
}

let revenueChartData: ChartData;

const ClientOverviewAnalytics = () => {
    const [soretoData, setSoretoData] = useState<any[]>([]);
    const [idFrozen, setIdFrozen] = useState(false);
    const [loading2, setLoading2] = useState(true);
    const [dates, setDates] = useState(null);
    const [compareDates, setCompareDates] = useState(null);
    const [switchValue, setSwitchValue] = useState(false);
    const [revenueChartOptions, setRevenueChartOptions] = useState<ChartOptions | null>(null);
    const [nodes, setNodes] = useState<any[]>([])   ;

    const dt = useRef(null);

    const getRevenueChartData = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [11, 17, 30, 60, 88, 92],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: 0.4
                },
                {
                    data: [11, 19, 39, 59, 69, 71],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: 0.4
                },
                {
                    data: [11, 17, 21, 30, 47, 83],
                    backgroundColor: 'rgba(25, 146, 212, 0.2)',
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };

    const cols = [
        { field: 'name', header: 'Client' },
        { field: 'sharePlaceViewCountTotal', header: 'Placement Views' },
        { field: 'shareCountTotal', header: 'Enrolment' },
        { field: 'interstitialLoadCountTotal', header: 'Enrolment Rate' },
        { field: 'referralClickRate', header: 'Referral Clicks' },
        { field: 'interstitialCTACountTotal', header: 'Referral CTR' },
        { field: 'interstitialClickRate', header: 'Offer Clicks' },
        { field: 'saleCountTotal', header: 'Offer Clicks CTR' },
        { field: 'saleRevenueTotal', header: 'Sales' },
        { field: 'saleCommissionTotal', header: 'Order Value' },
        { field: 'saleRevenueTotal', header: 'Commission' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const [selectedCountry, setSelectedCountry] = useState(null);
    const countries = [
        { name: 'United Kingdom', code: 'UK' },
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const [selectedSector, setSelectedSector] = useState(null);
    const sectors = [
        { label: 'Health & Beauty', value: 'Health & Beauty' },
        { label: 'Technology', value: 'Technology' },
        { label: 'Travel', value: 'Travel' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Fashion', value: 'Fashion' },
        { label: 'Home & Garden', value: 'Home & Garden' },
    ];

    const [selectedFixedFee, setSelectedFixedFee] = useState(null);
    const fixedFees = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ];
     
    const [selectedClientType, setSelectedClientType] = useState(null);
    const clientTypes = [
        { label: 'NEW', value: 'new' },
        { label: 'EXISTING', value: 'existing' },
    ];

    const [selectedSalesRep, setSelectedSalesRep] = useState(null);
    const salesReps = [
        { label: 'Peter Rowe' },
        { label: 'Ricki Jones' },
        { label: 'Nicole Froes' },
        { label: 'Fatme Bostandzhieva' },
        { label: 'Sebastian Gallagher' },
        { label: 'Sophie Larger' }
    ];

    const [selectedPeriodOption, setSelectedPeriodOption] = useState(null);
    const periodOptions = [
        { label: 'This Month' },
        { label: 'Last Month' },
        { label: 'This Week' },
        { label: 'Last Week' },
        { label: 'Custom' }
    ];

    const [selectedComparePeriodOption, setSelectedComparePeriodOption] = useState(null);
    const comparePeriodOptions = [
        { label: 'N/A' },
        { label: 'This Month' },
        { label: 'Last Month' },
        { label: 'This Week' },
        { label: 'Last Week' },
        { label: 'Custom' }
    ];

    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const networks = [
        { label: 'Awin' },
        { label: 'Webgains' },
        { label: 'CJ' },
        { label: 'Tradedoubler' },
        { label: 'Rakuten' },
        { label: 'CF' },
        { label: 'Impact' },
        { label: 'Pepperjam' },
        { label: 'ShareASale' },
        { label: 'SuperSale' },
        { label: 'Parnetize' }
    ];

    const enrolmentRateTemplate = (rowData: any) => {
        return (
            <div>
                <span className="text-bold">{`${(rowData.shareRate).toFixed(2)}%`}</span>
            </div>
        );
    };

    const referralCTRTemplate = (rowData: any) => {
        return (
            <div>
                <span className="text-bold">{`${(rowData.referralClickRate).toFixed(2)}%`}</span>
            </div>
        );
    };
    
    const offerClicksCTRTemplate = (rowData: any) => {
        return (
            <div>
                <span className="text-bold">{`${(rowData.interstitialClickRate).toFixed(2)}%`}</span>
            </div>
        );
    };

    const orderValueTemplate = (rowData: any) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.saleRevenueTotal as number)}</span>
            </div>
        );
    };

    const commissionTemplate = (rowData: any) => {
        return (
            <div>
                <span className="text-bold">{formatCurrency(rowData.saleCommissionTotal as number)}</span>
            </div>
        );
    };

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'GBP'
        });
    };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getSoretoData = (data: any[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const getNodesData = (data: any[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const statusBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const itemTemplate = (option: Demo.Country) => {
        return (
            <div className="flex align-items-center">
                <img
                    src={`/demo/images/flag/flag_placeholder.png`}
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    className={'mr-2 flag flag-' + option.code.toLowerCase()}
                    style={{ width: '18px' }}
                    alt={option.name}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    useEffect(() => {
        setLoading2(true);
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const borderColor = documentStyle.getPropertyValue('--surface-border');

        DataMockService.getSoretoData().then((data) => {
            setSoretoData(getSoretoData(data));
            setLoading2(false);
            console.log(data);
        });

        DataMockService.getTreeTableNodes().then((data) => {
            console.log(data);
            setNodes(getNodesData(data))
            console.log(data);
        });

        setRevenueChartOptions({
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: {
                        color: borderColor
                    },
                    max: 100,
                    min: 0,
                    ticks: {
                        color: textColorSecondary
                    }
                },
                x: {
                    grid: {
                        color: borderColor
                    },
                    ticks: {
                        color: textColorSecondary
                    }
                }
            }
        });

        revenueChartData = getRevenueChartData();

    },[]);

    const exportCSV = (selectionOnly: any) => {
        if(dt && dt.current)
            (dt?.current as any)?.exportCSV({ selectionOnly });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(soretoData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'soretoData');
        });
    };

    const saveAsExcelFile = (buffer: ArrayBuffer, fileName: string) => {
        import('file-saver').then((module: any) => {
            if (module && module.default) {
                let EXCEL_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION: string = '.xlsx';
                const data: Blob = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Totals:" footerStyle={{ textAlign: 'left', color: 'red' }} />
                <Column footer="3,244,180" footerStyle={{ textAlign: 'center' }} />
                <Column footer="149,528" footerStyle={{ textAlign: 'center' }} />
                <Column footer="4.61%" footerStyle={{ textAlign: 'center' }} />
                <Column footer="98,543" footerStyle={{ textAlign: 'center' }} />
                <Column footer="65.90%" footerStyle={{ textAlign: 'center' }} />
                <Column footer="43,183" footerStyle={{ textAlign: 'center' }} />
                <Column footer="43.82%" footerStyle={{ textAlign: 'center' }} />
                <Column footer="6,117" footerStyle={{ textAlign: 'center' }} />
                <Column footer="£758,012.22" footerStyle={{ textAlign: 'center' }} />
                <Column footer="£37,933.01" footerStyle={{ textAlign: 'center' }} />
            </Row>
        </ColumnGroup>
    );

    return (
        <div className="grid align-items-center">
            <div className="col-12">
                <div className="card p-fluid">
                    {/* <h4>Filter</h4>*/}
                    <br /> 
                    <div className="grid">
                        <div className="col w-20rem">
                            <span className="p-float-label min-w-min md:min-w-max">
                                <Dropdown id="periodSelect" value={selectedPeriodOption} onChange={(e) => setSelectedPeriodOption(e.value)} options={periodOptions} optionLabel="label"
                                    className="w-full" />
                                <label htmlFor="periodSelect">Period</label>
                            </span> 
                        </div>
                        <div className="col">
                            <span className="p-float-label">
                                <Calendar id="customPeriod" value={dates} onChange={(e: any) => setDates(e.value as any)} selectionMode="range" />
                                <label htmlFor="customerPeriod">Custom Period</label>
                            </span>                        
                        </div>
                        <div className="col">
                            <span className="p-float-label">
                                <Dropdown id="comparePeriodSelect" value={selectedComparePeriodOption} onChange={(e) => setSelectedComparePeriodOption(e.value)} options={comparePeriodOptions} optionLabel="label"
                                    className="w-full" />
                                <label htmlFor="comparePeriodSelect">Compare Period</label>
                            </span> 
                        </div>
                        <div className="col">
                            <span className="p-float-label">
                                <Calendar id="compareDateRange" value={compareDates} onChange={(e: any) => setCompareDates(e.value as any)} selectionMode="range" />
                                <label htmlFor="compareDateRange">Custom Compare Period</label>
                            </span>                        
                        </div>
                        <div className="col">
                            <span className="p-float-label">
                                
                                <MultiSelect
                                    id="countryMultiSelect"
                                    inputId="country"
                                    options={countries}
                                    itemTemplate={itemTemplate}
                                    onChange={(e) => setSelectedCountry(e.value)}
                                    value={selectedCountry}
                                    optionLabel="name"
                                    filter
                                    filterBy="name"
                                    showClear
                                />
                                <label htmlFor="countryMultiSelect">
                                    Country
                                </label>
                            </span> 
                        </div>
                        <div className="col-1">
                            <Button label="Search" raised />
                        </div>
                        <div className="col-1">
                            <Button label="Reset" raised severity="secondary" />
                        </div>
                    </div>
                </div>
                    <div className="card p-0 grid grid-nogutter">
                        <div className="col-12 md:col-6 lg:col-3 py-5 px-6 border-none md:border-right-1 surface-border">
                            <div className="flex align-items-center justify-content-center mb-3">
                                <Avatar icon="pi pi-shopping-cart" size="large" shape="circle" className="text-base bg-indigo-100 text-indigo-700"></Avatar>
                                <span className="text-xl ml-2">Sales</span>
                            </div>
                            <div className="flex align-items-center justify-content-center mb-3">
                                <span className="block font-bold text-6xl mb-3">2202</span>
                            </div>
                            
                        </div>
                        <div className="col-12 md:col-6 lg:col-3 py-5 px-6 border-none md:border-right-1 surface-border">
                            <div className="flex align-items-center justify-content-center mb-3">
                                <Avatar icon="pi pi-money-bill" size="large" shape="circle" className="text-base bg-green-100 text-green-700"></Avatar>
                                <span className="text-xl ml-2">Order Value</span>
                            </div>
                            <div className="flex align-items-center justify-content-center mb-3">
                                <span className="block font-bold text-6xl mb-3">£352,561.46</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3 py-5 px-6 border-none md:border-right-1 surface-border">
                            <div className="flex align-items-center justify-content-center mb-3">
                                <Avatar icon="pi pi-users" size="large" shape="circle" className="text-base bg-yellow-100 text-yellow-700"></Avatar>
                                <span className="text-xl ml-2">Commission</span>
                            </div>
                            <div className="flex align-items-center justify-content-center mb-3">
                                <span className="block font-bold text-6xl mb-3">£15,748.35</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3 py-5 px-6">
                            <div className="flex align-items-center justify-content-center mb-3">
                                <Avatar icon="pi pi-comments" size="large" shape="circle" className="text-base bg-purple-100 text-purple-700"></Avatar>
                                <span className="text-xl ml-2">ROI</span>
                            </div>
                            <div className="flex align-items-center justify-content-center mb-3">
                                <span className="block font-bold text-6xl mb-3">2,238.72%</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid">
                    <div className="col-12">
                    <div className="card">
                        <h4>KPI Trends</h4>

                        <Chart type="line" height="328" data={revenueChartData} options={revenueChartOptions as ChartOptions} id="nasdaq-chart"></Chart>
                    </div>
                    </div>

                <div className="col-12">
                   
                <div className="card p-fluid">
                    <div className="flex flex-row gap-2 h-full justify-content-between">
                        <h4>KPI Overview</h4>
                        
                        <div className="flex align-items-center justify-content-end gap-2 bg-white">
                            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                       </div>
                    </div>
                    
                    <DataTable ref={dt} stripedRows={true} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3" footerColumnGroup={footerGroup}>
                        <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                        <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="shareRate" sortable header="Enrolment Rate" body={enrolmentRateTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialLoadCountTotal" sortable header="Referral Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="referralClickRate" sortable header="Referral CTR" body={referralCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialCTACountTotal" sortable header="Offer Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialClickRate" sortable header="Offer Clicks CTR" body={offerClicksCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCountTotal" sortable header="Sales" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleRevenueTotal" sortable header="Order Value" body={orderValueTemplate}style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCommissionTotal" sortable header="Commission" body={commissionTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                    </DataTable>
                </div>
                </div>
                
                    <div className="col-4">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Top Country</h4>
                            </div>
                            
                            <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                                <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                                <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                                <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Top Network</h4>
                            </div>
                            
                            <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                                <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                                <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                                <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Top Sector</h4>
                            </div>
                            
                            <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                                <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                                <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                                <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                
                <div className="col-12">
                        
                <div className="card p-fluid">
                    <div className="flex flex-row gap-2 h-full justify-content-between">
                        <h4>Share by Channel</h4>
                        
                        <div className="flex align-items-center justify-content-end gap-2 bg-white">
                            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                       </div>
                    </div>
                    
                    <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3" footerColumnGroup={footerGroup}>
                        <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                        <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="shareRate" sortable header="Enrolment Rate" body={enrolmentRateTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialLoadCountTotal" sortable header="Referral Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="referralClickRate" sortable header="Referral CTR" body={referralCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialCTACountTotal" sortable header="Offer Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialClickRate" sortable header="Offer Clicks CTR" body={offerClicksCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCountTotal" sortable header="Sales" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleRevenueTotal" sortable header="Order Value" body={orderValueTemplate}style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCommissionTotal" sortable header="Commission" body={commissionTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                    </DataTable>
                </div>
                </div>
                <div className="col-12">
            
                <div className="card p-fluid">
                    <div className="flex flex-row gap-2 h-full justify-content-between">
                        <h4>Share by Campaign Type</h4>
                        
                        <div className="flex align-items-center justify-content-end gap-2 bg-white">
                            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                       </div>
                    </div>
                    
                    <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3" footerColumnGroup={footerGroup}>
                        <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                        <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="shareRate" sortable header="Enrolment Rate" body={enrolmentRateTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialLoadCountTotal" sortable header="Referral Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="referralClickRate" sortable header="Referral CTR" body={referralCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialCTACountTotal" sortable header="Offer Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialClickRate" sortable header="Offer Clicks CTR" body={offerClicksCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCountTotal" sortable header="Sales" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleRevenueTotal" sortable header="Order Value" body={orderValueTemplate}style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCommissionTotal" sortable header="Commission" body={commissionTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                    </DataTable>
                </div>
                </div>
                <div className="col-12">
                        
                <div className="card p-fluid">
                    <div className="flex flex-row gap-2 h-full justify-content-between">
                        <h4>Share by Device</h4>
                        
                        <div className="flex align-items-center justify-content-end gap-2 bg-white">
                            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                       </div>
                    </div>
                    
                    <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3" footerColumnGroup={footerGroup}>
                        <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                        <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                        <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="shareRate" sortable header="Enrolment Rate" body={enrolmentRateTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialLoadCountTotal" sortable header="Referral Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="referralClickRate" sortable header="Referral CTR" body={referralCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialCTACountTotal" sortable header="Offer Clicks" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="interstitialClickRate" sortable header="Offer Clicks CTR" body={offerClicksCTRTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCountTotal" sortable header="Sales" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleRevenueTotal" sortable header="Order Value" body={orderValueTemplate}style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                        <Column field="saleCommissionTotal" sortable header="Commission" body={commissionTemplate} style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                    </DataTable>
                </div>
                </div>

                    <div className="col-6">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Top 10 Clients</h4>
                            </div>
                            
                            <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                                <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                                <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                                <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Top 10 Fallers</h4>
                            </div>
                            
                            <DataTable ref={dt} value={soretoData} scrollable scrollHeight="400px" loading={loading2} className="mt-3">
                                <Column field="name" header="Client" sortable style={{ flexGrow: 1, flexBasis: '160px' }} frozen className="font-bold"></Column>
                                <Column field="sharePlaceViewCountTotal" sortable header="Placement Views" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center'}} ></Column>
                                <Column field="shareCountTotal" sortable header="Enrolment" style={{ flexGrow: 1, flexBasis: '160px', textAlign: 'center' }} ></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <div className="flex flex-row gap-2 h-full justify-content-center">
                                <h4>Referrals</h4>
                            </div>
                            <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="name" header="Name" expander></Column>
                                <Column field="size" header="Size"></Column>
                                <Column field="type" header="Type"></Column>
                            </TreeTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientOverviewAnalytics;
