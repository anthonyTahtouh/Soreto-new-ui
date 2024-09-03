interface CustomDataTableProps {
    first: number;
    rows: number;
    page: number;
    sortField: string;
    sortOrder: DataTableSortOrderType;
    filters: { ftSearch: { value: string; matchMode: string } };
}