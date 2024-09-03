import SoretoLoadingPageBlocker from "@/components/SoretoLoadingPageBlocker";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UserSegmentationPoolService from "@/service/UserSegmentationPoolService";
import { AxiosError } from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { SegmentationPool } from "@/types/segmentation";
import ClientsDropdown from "@/components/dropdowns/ClientsDropdown";
import DropdownUserSegmentation from "@/components/dropdowns/UserSegmentationDropdown";
import { Toast } from "primereact/toast";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Tag } from "primereact/tag";
import Link from "next/link";

const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    userSegmentations: Yup.array()
        .min(1, "At least one segmentation must be added")
        .required("Segmentations are required"),
});

interface UserSegmentationPoolProps extends JSX.Element {
    id?: string;
    size?: { width: string; height: string };
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
}

const UserSegmentationPoolPageComponent = (
    props: UserSegmentationPoolProps
): ReactElement<any, any> => {
    const [segmentationPool, setSegmentationPool] = useState<any>({});
    const [loadingPageBlocker, setLoadingPageBlocker] = useState<{
        visible: boolean;
        errorMessage?: string;
    }>({ visible: true });

    const [selectedSegmentation, setSelectedSegmentation] = useState<any>(null);
    const toast = useRef<Toast>(null);

    // Create a ref for the cancel button
    const cancelButtonRef = useRef<any>(null);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            userSegmentations: [],
        },
    });

    useEffect(() => {
        if (!props.id) {
            setLoadingPageBlocker({ visible: false });
            return;
        }
        UserSegmentationPoolService.getUserSegmentationPoolById(props.id)
            .then((data: SegmentationPool) => {
                setSegmentationPool(data);
                setLoadingPageBlocker({ visible: false });

                // Set the name field with the fetched segmentation Pool name
                setValue("name", data.name || "");

                // Set the segmentations field with the fetched segmentation
                setValue("userSegmentations", data.userSegmentations || []);
            })
            .catch((error: AxiosError) => {
                let errorMessage = "";
                // treat 404
                if (error.response?.status === 404) {
                    errorMessage = "Resource data not found.";
                } else {
                    errorMessage = "There was an error fetching the data.";
                }
                setLoadingPageBlocker({
                    visible: true,
                    errorMessage,
                });
            });
    }, [props.id, setValue]);

    const defaultSize = { width: "900px", height: "900px" };
    const size = props.size || defaultSize;

    const onSubmit = async (data: any) => {
        const segmentationPoolPayload = {
            name: data.name,
            description: segmentationPool.description,
            client_id: segmentationPool.clientId,
            userSegmentationIds: data.userSegmentations.map(
                (segmentation: any) => segmentation.id
            ),
        };

        try {
            if (props.id) {
                const result =
                    await UserSegmentationPoolService.updateUserSegmentationPool(
                        props.id,
                        segmentationPoolPayload
                    );

                toast.current?.show({
                    severity: "success",
                    summary: "Update Successful",
                    detail: `User segmentation Pool "${result.resultData.name}" has been updated.`,
                    life: 3000,
                });
                props.onSave();
            } else {
                const result =
                    await UserSegmentationPoolService.createUserSegmentationPool(
                        segmentationPoolPayload
                    );

                toast.current?.show({
                    severity: "success",
                    summary: "Creation Successful",
                    detail: `User segmentation Pool "${result.name}" has been created.`,
                    life: 3000,
                });
                props.onSave();
            }
        } catch (error) {
            console.error("Error in onSubmit:", error);

            toast.current?.show({
                severity: "error",
                summary: "Operation Failed",
                detail: "There was an error processing your request.",
                life: 3000,
            });
        }
    };

    const handleAddSegmentation = () => {
        if (selectedSegmentation) {
            const isSegmentationAlreadyAdded =
                segmentationPool.userSegmentations?.some(
                    (segmentation: any) =>
                        segmentation.id === selectedSegmentation.id
                );

            if (!isSegmentationAlreadyAdded) {
                const updatedSegmentations = [
                    ...(segmentationPool.userSegmentations || []),
                    selectedSegmentation,
                ];

                setSegmentationPool((prevSegmentationPool: any) => ({
                    ...prevSegmentationPool,
                    userSegmentations: updatedSegmentations,
                }));

                setValue("userSegmentations", updatedSegmentations);
                setSelectedSegmentation(null);
            } else {
                toast.current?.show({
                    severity: "warn",
                    summary: "Duplicate Segmentation",
                    detail: "This Segmentation has already been added to the table.",
                    life: 3000,
                });
            }
        }
    };

    const handleDeleteSegmentation = (segmentationId: string) => {
        // Filter out the selected segmentation from the segmentation Pool
        const updatedSegmentation = segmentationPool.userSegmentations.filter(
            (s: any) => s.id !== segmentationId
        );

        // Update the state with the new array
        setSegmentationPool((prevSegmentationPool: any) => ({
            ...prevSegmentationPool,
            userSegmentations: updatedSegmentation,
        }));

        // Update the form's segmentation field
        setValue("userSegmentations", updatedSegmentation);

        // Show a success message
        toast.current?.show({
            severity: "success",
            summary: "Segmentation Deleted",
            detail: `Segmentation has been removed.`,
            life: 3000,
        });
    };

    const renderActions = (rowData: any) => {
        return (
            <>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    title="Delete"
                    onClick={() => handleDeleteSegmentation(rowData.id)}
                />
            </>
        );
    };

    return (
        <div
            className="p-fluid relative"
            style={{ width: size.width, height: size.height }}
        >
            <Toast ref={toast} />
            <SoretoLoadingPageBlocker
                {...loadingPageBlocker}
            ></SoretoLoadingPageBlocker>
            <div className="p-1">
                <div className="grid">
                    <div className="col-6">
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue={segmentationPool.name || ""}
                                render={({ field }) => (
                                    <InputText
                                        id="name"
                                        {...field}
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                        required
                                        autoFocus
                                        className={`w-full ${
                                            errors.name ? "p-invalid" : ""
                                        }`}
                                    />
                                )}
                            />
                            {errors.name && (
                                <small className="p-error">
                                    {errors.name.message}
                                </small>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={segmentationPool.description}
                                onChange={(e: any) =>
                                    setSegmentationPool({
                                        ...segmentationPool,
                                        description: e.target.value,
                                    })
                                }
                                required
                                className="w-full"
                                rows={1}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="client">Client</label>
                            <ClientsDropdown
                                id="client"
                                value={segmentationPool.clientId}
                                onChange={(e: any) =>
                                    setSegmentationPool({
                                        ...segmentationPool,
                                        clientId: e.value,
                                    })
                                }
                                placeholder="Select a client"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="userSegmentation">
                                Segmentations
                            </label>
                            <div className="flex align-items-center">
                                <DropdownUserSegmentation
                                    id="userSegmentation"
                                    value={selectedSegmentation}
                                    onChange={(e: any) =>
                                        setSelectedSegmentation(e.value)
                                    }
                                    placeholder="Select a Segmentation"
                                    clientId={segmentationPool.clientId}
                                    className="w-full"
                                />
                                <Button
                                    icon="pi pi-plus"
                                    className="ml-2"
                                    onClick={handleAddSegmentation}
                                    disabled={!selectedSegmentation}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segmentation Table */}
                <div className="grid">
                    <div className="col-12">
                        <DataTable
                            value={segmentationPool.userSegmentations || []}
                            className="w-full"
                        >
                            <Column
                                field="name"
                                header="Name"
                                body={(rowData) => (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`/userSegmentation/segmentation/${rowData.id}`}
                                    >
                                        {rowData.name}
                                    </a>
                                )}
                            />
                            <Column field="clientName" header="Custom Client" />

                            {/* New Column for Scores */}
                            <Column
                                header="Scores"
                                body={(rowData) =>
                                    rowData.scores &&
                                    rowData.scores.length > 0 ? (
                                        rowData.scores.map((score: any) => (
                                            <Tag
                                                key={score.id}
                                                className="mr-2 mb-2"
                                                severity="success"
                                            >
                                                <Link
                                                    href={`/userSegmentation/score/${score.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white"
                                                >
                                                    {score.name}
                                                </Link>
                                            </Tag>
                                        ))
                                    ) : (
                                        <span>No Scores</span>
                                    )
                                }
                            />

                            <Column header="Actions" body={renderActions} />
                        </DataTable>

                        {errors.userSegmentations && (
                            <small className="p-error">
                                {errors.userSegmentations.message}
                            </small>
                        )}
                    </div>
                </div>
                <div className="grid pt-6">
                    <div className="col-6">
                        <Button
                            className="p-button p-component p-button-outlined p-button-danger"
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={props.onCancel}
                            ref={cancelButtonRef}
                        />
                    </div>
                    <div className="col-6">
                        <Button
                            className=" border-round p-button p-component"
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSegmentationPoolPageComponent;
