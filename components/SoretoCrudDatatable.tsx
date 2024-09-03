/* eslint-disable react-hooks/exhaustive-deps */
import {
    buildCustomPrimeReactDataTableProps,
    buildSoretoQueryString,
} from "@/shared/primeReactDataTableQueryBuilder";
import { capitalize, mergeObjectsIgnoringUndefined } from "@/shared/utils";
import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useRef, useState } from "react";

interface SoretoCrudDatatableProps {
    pageResult?: ApiPaginatedResult<any>;
    columns: ColumnProps[];
    loadingDataTable: boolean;
    header?: JSX.Element;
    editionComponent?: ReactElement<any, any> | any;
    sortField?: string;
    sortOrder?: number;
    dataName?: string;
    initialEditionItemId?: string | string[];
    onDataTablePropsChange: (searchString: string) => void;
    onDelete?: (rowData: any) => void;
    onEdit?: (rowData: any) => void;
    onSave?: () => void;
}

const SoretoCrudDatatable = (props: SoretoCrudDatatableProps) => {
    const dataTableProps = {
        first: 0,
        rows: 10,
        page: 0,
        sortField: props.sortField || "createdAt",
        sortOrder: props.sortOrder || -1,
        filters: {
            ftSearch: { value: "", matchMode: "custom" },
        },
    };

    const dt = useRef<DataTable<any>>(null);
    const [tableProps, setTableProps] =
        useState<CustomDataTableProps>(dataTableProps);
    const [editionDialogVisible, setEditionDialogVisible] = useState(false);
    const [editionItemId, setEditionItemId] = useState(null);

    /**
     * Datatable property change
     *
     * When the datatable triggers an update
     * we must rebuild the query string and
     * send it to the 'parent' who implemented the component
     */
    useEffect(() => {
        props.onDataTablePropsChange(buildSoretoQueryString(tableProps));
    }, [tableProps]);

    /**
     * Initial Edition Item
     *
     * When the datatable edition must load an item on load
     */
    useEffect(() => {
        if (!props.initialEditionItemId) return;

        /**
         * The id we receve directly from the page next route can be an array
         * in order to solve it we pick the item zero for those cases
         */
        let singleId = Array.isArray(props.initialEditionItemId)
            ? props.initialEditionItemId[0]
            : props.initialEditionItemId;

        onEdit({ id: singleId });
    }, [props.initialEditionItemId]);

    /**
     * On Edit
     *
     * This method is triggered on the click of datatable row edition action
     *
     * @param rowData
     * @returns
     */
    const onEdit = (rowData: any): void => {
        // tells the parent the edition click happened
        if (props.onEdit) {
            props.onEdit(rowData);
        }

        // varidates if the row data has an Id
        if (!rowData.id) {
            console.warn(
                "In order to use dynamic edition components, the colection item must have an id"
            );
            return;
        }

        // set in the state the id of the item that has being edited
        setEditionItemId(rowData.id);

        // is the an edition component?
        if (props.editionComponent) {
            setShallowNavigationRoute(rowData.id, true);
            setEditionDialogVisible(true);
        }
    };

    /**
     * On Dialog cancel
     *
     * This method is triggered when the cancel or the dialog close button is hit
     *
     */
    const onDialogCancel = (): void => {
        setShallowNavigationRoute(editionItemId, false);
        setEditionDialogVisible(false);
    };

    const onDialogSave = () => {
        setEditionDialogVisible(false); // Close the modal
        if (props.onSave) {
            props.onSave(); // Call the parent onSave function, if provided
        }
    };
    /**
     *
     * Data table header template
     *
     */
    const defaultDataTableHeader: JSX.Element = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage {props.dataName}</h5>

            <div className="flex align-items-center gap-3">
                {/* SEARCH BUTTON */}
                <div className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(event) =>
                            setTableProps(
                                buildCustomPrimeReactDataTableProps(
                                    event as any,
                                    tableProps
                                )
                            )
                        }
                        placeholder="Search..."
                    />
                </div>
                <div>
                    {/* ADD BUTTON */}
                    <Button
                        icon="pi pi-plus"
                        severity="success"
                        className="p-button p-component p-button-icon-only p-button-rounded"
                        onClick={() => {
                            setEditionItemId(null);
                            setEditionDialogVisible(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );

    /**
     * Datatable action column template
     *
     * @param rowData
     * @returns
     */
    const actionColumBodyTemplate = (rowData: any): JSX.Element => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    severity="success"
                    className="mr-2"
                    onClick={() => onEdit(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    severity="warning"
                    rounded
                    onClick={() => {
                        if (props.onDelete) {
                            props.onDelete(rowData);
                        }
                    }}
                />
            </>
        );
    };

    return (
        <>
            <DataTable
                ref={dt}
                value={props.pageResult?.page}
                totalRecords={props.pageResult?.totalCount || 0}
                dataKey="id"
                paginator
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={`Showing {first} to {last} of {totalRecords} ${
                    props.dataName || ""
                }`}
                onFilter={(event: DataTableStateEvent) => {
                    setTableProps(
                        buildCustomPrimeReactDataTableProps(event, tableProps)
                    );
                }}
                onPage={(event: DataTableStateEvent) =>
                    setTableProps(
                        mergeObjectsIgnoringUndefined(tableProps, event)
                    )
                }
                onSort={(event: DataTableStateEvent) => {
                    setTableProps(
                        mergeObjectsIgnoringUndefined(tableProps, event)
                    );
                }}
                emptyMessage={`No ${props.dataName || "data"} found.`}
                loading={props.loadingDataTable}
                header={props.header || defaultDataTableHeader}
                rows={tableProps.rows}
                first={tableProps.first}
                sortField={tableProps.sortField}
                sortOrder={tableProps.sortOrder}
                lazy
            >
                {props.columns.map((c) => {
                    return (
                        <Column
                            key={c.field}
                            header={c.header || capitalize(c.field)}
                            {...c}
                        ></Column>
                    );
                })}

                <Column body={actionColumBodyTemplate}></Column>
            </DataTable>

            {/* 
                Edtion dialog holder 
            */}
            <Dialog
                visible={editionDialogVisible}
                header={props.dataName}
                modal
                className="p-fluid"
                onHide={onDialogCancel}
            >
                {props.editionComponent && (
                    <props.editionComponent
                        id={editionItemId}
                        onSave={onDialogSave}
                        onCancel={onDialogCancel}
                    ></props.editionComponent>
                )}
            </Dialog>
        </>
    );
};

export default SoretoCrudDatatable;

/**
 * Set Shallow Navigation route
 *
 * It is used to change the browser url to the resource id that is being edited
 *
 * @param itemId
 * @param add
 */
function setShallowNavigationRoute(itemId: any, add: boolean) {
    let pathName = window.location.pathname;

    if (add) {
        if (pathName && !pathName.includes(itemId)) {
            history.pushState({ itemId: itemId }, "", `${pathName}/${itemId}`);
        }
    } else {
        if (pathName && itemId && pathName.includes(itemId)) {
            let basePathNameParts = pathName.split("/");

            basePathNameParts.pop();

            history.pushState(
                { itemId: undefined },
                "",
                `${basePathNameParts.join("/")}`
            );
        } else {
            history.pushState({ itemId: undefined }, "", `${pathName}`);
        }
    }
}
