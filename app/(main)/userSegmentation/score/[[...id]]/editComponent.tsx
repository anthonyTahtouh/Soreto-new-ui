"use client";

import SoretoLoadingPageBlocker from "@/components/SoretoLoadingPageBlocker";
import ClientsDropdown from "@/components/dropdowns/ClientsDropdown";
import UserSegmentationScoreService from "@/service/UserSegmentationScoreService";
import { UserSegmentationScore } from "@/types/segmentation";
import { AxiosError } from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import DropdownTypeShare from "@/components/dropdowns/DropdownTypeShare";
import { Toast } from "primereact/toast";

interface userSegmentationProps extends JSX.Element {
    id?: string;
    size?: { width: string; height: string };
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
}

const UserSegmentationScorePageComponent = (
    props: userSegmentationProps
): ReactElement<any, any> => {
    const [score, setScore] = useState<any>({});
    const toast = useRef<Toast>(null);
    const [loadingPageBlocker, setLoadingPageBlocker] = useState<{
        visible: boolean;
        errorMessage?: string;
    }>({ visible: true });
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (!props.id) {
            setLoadingPageBlocker({ visible: false });
            return;
        }

        UserSegmentationScoreService.getById(props.id)
            .then((data: UserSegmentationScore) => {
                data.type = {
                    id: data.type,
                    name:
                        data.type === "share_frequency"
                            ? "Frequency"
                            : "Recency",
                };
                setScore(data);
                setLoadingPageBlocker({ visible: false });
            })
            .catch((error: AxiosError) => {
                let errorMessage = "";

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
    }, [props.id]);

    const validateShareFrequency = (expression: string) => {
        if (!expression) return false;

        const regex = /share_count(=|>|<|>=|<=)\d+\sAND\speriod_days_ago=\d+/;

        return regex.test(expression);
    };

    const validateShareRecency = (expression: string) => {
        if (!expression) return false;

        const regex =
            /(last_share_days_gap(=|>|<|>=|<=)\d+\sAND\s)?last_share_minutes_gap(=|>|<|>=|<=)\d+/;

        return regex.test(expression);
    };

    const validateExpressionByType = (type: any, expression: string) => {
        if (type === "SHARE_FREQUENCY") {
            return validateShareFrequency(expression);
        } else if (type === "SHARE_RECENCY") {
            return validateShareRecency(expression);
        }
        
        return true;
    };

    const pageHandleSubmit = async (event: any) => {
        const updatedScore = {
            ...score,
            type: score.type.id,
            createdAt: moment
                .utc(score.createdAt)
                .format("YYYY/MM/DD HH:mm:ss"),
            updatedAt: moment
                .utc(score.updatedAt)
                .format("YYYY/MM/DD HH:mm:ss"),
        };

        if (!validateExpressionByType(updatedScore.type, updatedScore.expression)) {
            toast.current?.show({
                severity: "error",
                summary: "Invalid Expression",
                detail: "Please enter a valid expression for the selected type.",
                life: 3000,
            });
            return;
        }

        if (!props.id) {
            try {
                // Create a new score
                const result =
                    await UserSegmentationScoreService.createUserSegmentationScore(
                        updatedScore
                    );
                toast.current?.show({
                    severity: "success",
                    summary: "Creation Successful",
                    detail: `User segmentation score "${result.name}" has been created.`,
                    life: 3000,
                });
                props.onSave();
            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Creation Failed",
                    detail: "There was an error creating the user segmentation score.",
                    life: 3000,
                });
            }
        } else {
            try {
                // Update the score
                const result =
                    await UserSegmentationScoreService.updateUserSegmentationScore(
                        score._id,
                        updatedScore
                    );
                toast.current?.show({
                    severity: "success",
                    summary: "Update Successful",
                    detail: `User segmentation score"${result.name}" has been updated.`,
                    life: 3000,
                });
                props.onSave();
            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Update Failed",
                    detail: "There was an error updating the user segmentation score.",
                    life: 3000,
                });
            }
        }
    };

    useEffect(() => {
        reset(score);
    }, [score, reset]);

    const defaultSize = { width: "900px", height: "600px" };
    const size = props.size || defaultSize;

    return (
        <div
            className="p-fluid relative"
            style={{ width: size.width, height: size.height }}
        >
            <Toast ref={toast} />
            <SoretoLoadingPageBlocker
                {...loadingPageBlocker}
            ></SoretoLoadingPageBlocker>
            <form onSubmit={handleSubmit(pageHandleSubmit)}>
                <div className="p-1">
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id={field.name}
                                    value={score.name}
                                    autoFocus
                                    onChange={(e) =>
                                        setScore({
                                            ...score,
                                            name: e.target.value,
                                        })
                                    }
                                    className={classNames({
                                        "p-invalid": fieldState.invalid,
                                    })}
                                />
                            )}
                        />
                        {getFormErrorMessage("name", errors)}
                    </div>
                    <div className="field">
                        <label htmlFor="description">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputTextarea
                                    id={field.name}
                                    {...field}
                                    value={score.description}
                                    rows={3}
                                    cols={20}
                                    onChange={(e) =>
                                        setScore({
                                            ...score,
                                            description: e.target.value,
                                        })
                                    }
                                    className={classNames({
                                        "p-invalid": fieldState.invalid,
                                    })}
                                />
                            )}
                        />
                        {getFormErrorMessage("description", errors)}
                    </div>
                    <div className="field">
                        <label htmlFor="clientId">Client</label>
                        <Controller
                            name="clientId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <ClientsDropdown
                                    id={field.name}
                                    {...field}
                                    value={score.clientId}
                                    onChange={(e: any) =>
                                        setScore({
                                            ...score,
                                            clientId: e.value || null,
                                        })
                                    }
                                    className={classNames({
                                        "p-invalid": fieldState.invalid,
                                    })}
                                />
                            )}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="type" className="mb-3">
                            Type
                        </label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field, fieldState }) => (
                                <DropdownTypeShare
                                    id={field.name}
                                    {...field}
                                    value={score.type}
                                    onChange={(e: any) => {
                                        setScore({
                                            ...score,
                                            type: e.value,
                                        });
                                    }}
                                    className={classNames({
                                        "p-invalid": fieldState.invalid,
                                    })}
                                />
                            )}
                        />
                        {getFormErrorMessage("type", errors)}
                    </div>
                    <div className="field">
                        <label htmlFor="expression">Expression</label>
                        <Controller
                            name="expression"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputTextarea
                                    id={field.name}
                                    {...field}
                                    value={score.expression}
                                    rows={3}
                                    cols={20}
                                    onChange={(e: any) =>
                                        setScore({
                                            ...score,
                                            expression: e.target.value,
                                        })
                                    }
                                />
                            )}
                        />
                        <Tag
                            className={`p-mb-2 ${!score.type && "hidden"}`}
                            value={
                                score.type &&
                                typeTag.find((f) => f.name === score.type.id)
                                    ?.value
                            }
                            severity="info"
                        />
                    </div>
                    <div className="flex pt-6">
                        <Button
                            className="p-button p-component p-button-outlined p-button-danger"
                            label="Cancel"
                            icon="pi pi-times"
                            type="button"
                            onClick={props.onCancel}
                        />

                        <Button
                            className="col-offset-1 border-round p-button p-component"
                            label="Save"
                            icon="pi pi-check"
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const getFormErrorMessage = (name: string, errors: any) => {
    return <small className="p-error">{errors[name]?.message}</small>;
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().nullable(),
    type: Yup.object()
        .shape({
            id: Yup.string().required("ID is required"),
            name: Yup.string().required("Name is required"),
        })
        .required("Type is required"),
    clientId: Yup.string().nullable(),
    expression: Yup.string(),
});

const typeTag = [
    {
        name: "share_recency",
        value: "eg: last_share_days_gap<20 | last_share_minutes_gap>500",
    },
    {
        name: "share_frequency",
        value: "eg: share_count>5 AND period_days_ago=90",
    },
];

export default UserSegmentationScorePageComponent;
