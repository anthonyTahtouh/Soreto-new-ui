"use client";
import SoretoCrudDatatable from "@/components/SoretoCrudDatatable";
import { SegmentationPoolDTO } from "@/types/segmentation";
import { ColumnProps } from "primereact/column";
import { useContext, useEffect, useRef, useState } from "react";
import UserSegmentationPoolService from "../../../../../service/UserSegmentationPoolService";
import { AxiosError } from "axios";
import { Toast } from "primereact/toast";
import UserSegmentationPoolPageComponent from "./editComponent";
import { Tag } from "primereact/tag";
import Link from "next/link";
import { formatDate } from "@fullcalendar/core";
import { LayoutContext } from "@/layout/context/layoutcontext";

// New memory variable to store the last search parameters
let lastSearchString = "";

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
        field: "clientName",
        header: "Client Name",
    },
    {
        field: "segmentations",
        header: "Segmentations",
        body: (rowData: SegmentationPoolDTO) =>
            Array.isArray(rowData.userSegmentations) &&
            rowData.userSegmentations.length > 0 ? (
                rowData.userSegmentations.map((segmentation) => (
                    <Tag
                        key={segmentation.id}
                        className="mr-2 mb-2"
                        severity="success"
                    >
                        <Link
                            href={`/userSegmentation/segmentation/${segmentation.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white"
                        >
                            {segmentation.name}
                        </Link>
                    </Tag>
                ))
            ) : (
                <span>No Segmentations Available</span>
            ),
    },
];

const UserSegmentationList = ({ params }: { params: { id?: string } }) => {
    const [loadingDataTable, setLoadingDataTable] = useState(true);
    const [pageResult, setPageResult] =
        useState<ApiPaginatedResult<SegmentationPoolDTO>>();
    const [searchString, setSearchString] = useState("");

    const toast = useRef<Toast | null>(null);
    const { showConfirmationModal } = useContext(LayoutContext);

    useEffect(() => {
        getPage();
    }, [searchString]);

    const getPage = () => {
        setLoadingDataTable(true);
        lastSearchString = searchString; // Save the current search string in memory
        UserSegmentationPoolService.getAggregatedUserSegmentationPools(
            searchString
        )
            .then((data: any) => {
                setPageResult(data);
            })
            .catch((error: AxiosError) => {
                // treat 404
                if (error.response?.status === 404) {
                    setPageResult({ page: [], totalCount: 0 });
                } else {
                    toast.current?.show({
                        content: "An error happened",
                    });
                }
            })
            .finally(() => {
                // set loading false
                setLoadingDataTable(false);
            });
    };

    const onDeleteRow = (rowData: SegmentationPoolDTO) => {
        showConfirmationModal(
            "Are you sure you want to delete this row?",
            (accepted: boolean) => {
                if (accepted) {
                    UserSegmentationPoolService.deleteUserSegmentationPool(
                        rowData.id
                    )
                        .then(() => {
                            toast.current?.show({
                                severity: "success",
                                summary: "Deleted",
                                detail: "Row deleted successfully",
                            });
                            getPage();
                        })
                        .catch((error: AxiosError) => {
                            toast.current?.show({
                                severity: "error",
                                summary: "Error",
                                detail: "Failed to delete the row",
                            });
                        });
                }
            }
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <SoretoCrudDatatable
                dataName="User Segmentation Pools"
                loadingDataTable={loadingDataTable}
                pageResult={pageResult}
                columns={dataTableColumns}
                onDataTablePropsChange={(newSearchString: string) => {
                    setSearchString(newSearchString);
                }}
                onDelete={(rowData: SegmentationPoolDTO) =>
                    onDeleteRow(rowData)
                }
                onSave={() => {
                    getPage();
                }}
                editionComponent={UserSegmentationPoolPageComponent}
                initialEditionItemId={params.id}
                sortField="updatedAt"
            ></SoretoCrudDatatable>
        </div>
    );
};

export default UserSegmentationList;
