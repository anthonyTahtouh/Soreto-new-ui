import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import UserSegmentationScoreService from "../../service/UserSegmentationScoreService";

interface DropdownUserSegmentationScoreProps {
    id: string;
    value?: string;
    onChange: (e: Event) => void;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    clientId?: string;
}

const DropdownUserSegmentationScore = (
    props: DropdownUserSegmentationScoreProps,
    ref: any
) => {
    const [userSegmentationScore, setUserSegmentationScore] = useState<any>([]);

    useEffect(() => {
        UserSegmentationScoreService.getPaginated("?$sort=name", { clientId: props.clientId })
            .then((response: any) => {
                const userSegmentationScoreArray = response.page.map(
                    (userSegmentationScore: any) => ({
                        ...userSegmentationScore,
                        label: userSegmentationScore.name,
                        value: userSegmentationScore._id,
                    })
                );

                setUserSegmentationScore(userSegmentationScoreArray);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const onChangeUserSegmentationScore = (e: any) => {
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
                onChange={onChangeUserSegmentationScore}
                options={userSegmentationScore}
                optionLabel="name"
                className={props.className}
                placeholder={props.placeholder || "Select One"}
            />
        </div>
    );
};

export default React.forwardRef(DropdownUserSegmentationScore);
