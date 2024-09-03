import SoretoLoadingPageBlocker from "@/components/SoretoLoadingPageBlocker";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UserSegmentationService from "@/service/UserSegmentationService";
import { AxiosError } from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { UserSegmentation } from "@/types/segmentation";
import ClientsDropdown from "@/components/dropdowns/ClientsDropdown";
import DropdownUserSegmentationScore from "@/components/dropdowns/UserSegmentationScoreDropdown";
import { Toast } from "primereact/toast";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    scores: Yup.array()
        .min(1, "At least one score must be added")
        .required("Scores are required"),
});

interface userSegmentationProps extends JSX.Element {
    id?: string;
    size?: { width: string; height: string };
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
}

const UserSegmentationPageComponent = (
    props: userSegmentationProps
): ReactElement<any, any> => {
    const [segmentation, setSegmentation] = useState<any>({});
    const [loadingPageBlocker, setLoadingPageBlocker] = useState<{
        visible: boolean;
        errorMessage?: string;
    }>({ visible: true });

    const [selectedScore, setSelectedScore] = useState<any>(null);
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
            scores: [],
        },
    });

    useEffect(() => {
        // is it creation mode?
        if (!props.id) {
            setLoadingPageBlocker({ visible: false });
            return;
        }
        UserSegmentationService.getUserSegmentation(props.id)
            .then((data: UserSegmentation) => {
                setSegmentation(data);
                setLoadingPageBlocker({ visible: false });

                // Set the name field with the fetched segmentation name
                setValue("name", data.name || "");

                // Set the scores field with the fetched segmentation scores
                setValue("scores", data.scores || []);
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
        const segmentationPayload = {
            name: data.name,
            description: segmentation.description,
            client_id: segmentation.clientId,
            userSegmentationScoreIds: data.scores.map((score: any) => score.id),
        };

        if (props.id) {
            // Update the user segmentation
            try {
                const result =
                    await UserSegmentationService.updateUserSegmentation(
                        props.id,
                        segmentationPayload
                    );

                toast.current?.show({
                    severity: "success",
                    summary: "Update Successful",
                    detail: `User segmentation "${result.name}" has been updated.`,
                    life: 3000,
                });
                props.onSave();
            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Update Failed",
                    detail: "There was an error updating the user segmentation.",
                    life: 3000,
                });
            }
        } else {
            // Create the user segmentation
            try {
                const result =
                    await UserSegmentationService.createUserSegmentation(
                        segmentationPayload
                    );

                toast.current?.show({
                    severity: "success",
                    summary: "Creation Successful",
                    detail: `User segmentation "${result.name}" has been created.`,
                    life: 3000,
                });
                props.onSave();
            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Creation Failed",
                    detail: "There was an error creating the user segmentation.",
                    life: 3000,
                });
            }
        }
    };

    const handleAddScore = () => {
        if (selectedScore) {
            const isScoreAlreadyAdded = segmentation.scores?.some(
                (score: any) => score.id === selectedScore.id
            );

            if (!isScoreAlreadyAdded) {
                const updatedScores = [
                    ...(segmentation.scores || []),
                    selectedScore,
                ];

                setSegmentation((prevSegmentation: any) => ({
                    ...prevSegmentation,
                    scores: updatedScores,
                }));

                setValue("scores", updatedScores); // Update the form's scores field
                setSelectedScore(null);
            } else {
                toast.current?.show({
                    severity: "warn",
                    summary: "Duplicate Score",
                    detail: "This score has already been added to the table.",
                    life: 3000,
                });
            }
        }
    };

    const handleDeleteScore = (scoreId: string) => {
        // Filter out the selected score from the segmentation scores
        const updatedScores = segmentation.scores.filter(
            (s: any) => s.id !== scoreId
        );

        // Update the state with the new array
        setSegmentation((prevSegmentation: any) => ({
            ...prevSegmentation,
            scores: updatedScores,
        }));

        // Update the form's scores field
        setValue("scores", updatedScores);

        // Show a success message
        toast.current?.show({
            severity: "success",
            summary: "Score Deleted",
            detail: `Score has been removed.`,
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
                    onClick={() => handleDeleteScore(rowData.id)}
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
                                defaultValue={segmentation.name || ""}
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
                                value={segmentation.description}
                                onChange={(e: any) =>
                                    setSegmentation({
                                        ...segmentation,
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
                                value={segmentation.clientId}
                                onChange={(e: any) =>
                                    setSegmentation({
                                        ...segmentation,
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
                            <label htmlFor="userSegmentationScore">Score</label>
                            <div className="flex align-items-center">
                                <DropdownUserSegmentationScore
                                    id="userSegmentationScore"
                                    value={selectedScore}
                                    onChange={(e: any) =>
                                        setSelectedScore(e.value)
                                    }
                                    placeholder="Select a score"
                                    clientId={segmentation.clientId}
                                    className="w-full"
                                />
                                <Button
                                    icon="pi pi-plus"
                                    className="ml-2"
                                    onClick={handleAddScore}
                                    disabled={!selectedScore}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Table */}
                <div className="grid">
                    <div className="col-12">
                        <DataTable
                            value={segmentation.scores || []}
                            className="w-full"
                        >
                            <Column
                                field="name"
                                header="Name"
                                body={(rowData) => (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`/userSegmentation/score/${rowData.id}`}
                                    >
                                        {rowData.name}
                                    </a>
                                )}
                            />
                            <Column field="type" header="Type" />
                            <Column field="clientName" header="Custom Client" />
                            <Column field="expression" header="Expression" />
                            <Column header="Actions" body={renderActions} />
                        </DataTable>
                        {errors.scores && (
                            <small className="p-error">
                                {errors.scores.message}
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

export default UserSegmentationPageComponent;
