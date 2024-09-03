import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import ClientService from "../../service/ClientService";

interface DropdownClientProps {
    id: string;
    value?: string | string[];
    onChange: (e: Event) => void;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    multiSelect?: boolean;
}

const DropdownTypeShare = (props: DropdownClientProps, ref: any) => {
    const [clients, setClients] = useState<any>([
        { id: "share_frequency", name: "Frequency" },
        { id: "share_recency", name: "Recency" },
    ]);

    const onChangeClient = (e: any) => {
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
                onChange={onChangeClient}
                options={clients}
                optionLabel="name"
                className={props.className}
                placeholder={props.placeholder || "Select One"}
            />
        </div>
    );
};

export default React.forwardRef(DropdownTypeShare);
