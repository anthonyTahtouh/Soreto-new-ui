import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import UserSegmentationService from "../../service/UserSegmentationService";

interface DropdownUserSegmentationProps {
    id: string;
    value?: string;
    onChange: (e: Event) => void;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    clientId?: string;
}

const DropdownUserSegmentation = (
    props: DropdownUserSegmentationProps,
    ref: any
) => {
    const [userSegmentation, setUserSegmentation] = useState<any>([]);

    useEffect(() => {
        UserSegmentationService.getAggregatedUserSegmentations("?$sort=name", { clientId: props.clientId })
            .then((response: any) => {
                const userSegmentationArray = response.page.map(
                    (userSegmentation: any) => ({
                        ...userSegmentation,
                        label: userSegmentation.name,
                        value: userSegmentation._id,
                    })
                );

                setUserSegmentation(userSegmentationArray);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const onChangeUserSegmentation = (e: any) => {
        props.onChange(e);
    };

    /////////////////////////////////////////////////////
    //              Single Select
    /////////////////////////////////////////////////////

    return (
        <div className="w-full">
            <Dropdown
                ref={ref}
                filter
                showClear
                filterBy="name"
                id={props.id}
                value={props.value}
                disabled={props.disabled}
                onChange={onChangeUserSegmentation}
                options={userSegmentation}
                optionLabel="name"
                className={props.className}
                placeholder={props.placeholder || "Select One"}
            />
        </div>
    );
};

export default React.forwardRef(DropdownUserSegmentation);
