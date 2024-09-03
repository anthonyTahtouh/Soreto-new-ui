"use client";

import { ColumnProps } from "primereact/column";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserSegmentationScoreService from "../../../../../service/UserSegmentationScoreService";
import UserSegmentationScorePageComponent from "./editComponent";
import { LayoutContext } from "../../../../../layout/context/layoutcontext";
import { formatDate } from "@/shared/dateUtils";
import { AxiosError } from "axios";
import { UserSegmentationScoreDTO } from "@/types/segmentation";
import SoretoCrudDatatable from "../../../../../components/SoretoCrudDatatable";

const dataTableColumns: ColumnProps[] = [
    {
        field: "name",
        header: "Name",
        sortable: true,
    },
    {
        field: "createdAt",
        header: "Created At",
        body: (cp: any) => formatDate(cp.createdAt),
        sortable: true,
    },
    {
        field: "type",
    },
    {
        field: "clientName",
        header: "Client Name",
    },
    {
        field: "expression",
    },
];

const UserSegmentationScoreList = ({ params }: { params: { id?: string } }) => {
    const { showConfirmationModal } = useContext(LayoutContext);
    const [pageResult, setPageResult] =
        useState<ApiPaginatedResult<UserSegmentationScoreDTO>>();
    const [loadingDataTable, setLoadingDataTable] = useState(true);
    const [searchString, setSearchString] = useState("");

    const toast = useRef<Toast | null>(null);

    useEffect(() => {
        getPage();
    }, [searchString]);

    const getPage = () => {
        setLoadingDataTable(true);
        UserSegmentationScoreService.getPaginated(searchString, '')
            .then((data: any) => {
                setPageResult(data);
            })
            .catch((error: AxiosError) => {
                if (error.response?.status === 404) {
                    setPageResult({ page: [], totalCount: 0 });
                } else {
                    toast.current?.show({
                        content: "An error happened",
                    });
                }
            })
            .finally(() => {
                setLoadingDataTable(false);
            });
    };

    const confirmDeleteScore = (rowData: UserSegmentationScoreDTO) => {
        showConfirmationModal(
            "Are you sure you want to delete the Score?",
            (accepted: boolean) => {
                if (accepted) {
                    UserSegmentationScoreService.delete(
                        "userSegmentationScore/" + rowData.id
                    ).then(() => {
                        toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Row deleted successfully' });
                        getPage();
                    })
                    .catch((error: AxiosError) => {
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete the row' });
                    });
                }
            }
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <SoretoCrudDatatable
                        dataName="User Segmentation Score"
                        loadingDataTable={loadingDataTable}
                        pageResult={pageResult}
                        columns={dataTableColumns}
                        onDataTablePropsChange={(newSearchString: string) => {
                            setSearchString(newSearchString);
                        }}
                        onDelete={confirmDeleteScore}
                        onSave={() => {
                            getPage();
                        }}
                        editionComponent={UserSegmentationScorePageComponent}
                        initialEditionItemId={params.id}
                        sortField="updatedAt"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserSegmentationScoreList;
