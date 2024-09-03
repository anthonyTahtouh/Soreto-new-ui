import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import ClientService from '../../service/ClientService';

interface DropdownClientProps {
  id: string;
  value?: string | string[];
  onChange: (e: Event) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  multiSelect?: boolean;
}

const DropdownClients = ( props: DropdownClientProps, ref: any) => {
  const [clients, setClients] = useState<any>([]);

  useEffect(() => {
    ClientService.getAllClients('?$sort=name').then(response => {
      const clientsArray = response.map((client: any) => ({
        ...client,
        label: client.name,
        value: client._id,
      }));

      setClients(clientsArray);
    }).catch(error => { console.error(error); });
  }, []);

  const onChangeClient = (e: any) => {
    props.onChange(e);
  };

  /////////////////////////////////////////////////////
  //              Multi Select
  /////////////////////////////////////////////////////
  if (props.multiSelect) {

    return (
      <MultiSelect
        ref={ref}
        filter
        showClear
        filterBy="name"
        id={props.id}
        disabled={props.disabled}
        value={props.value}
        onChange={onChangeClient}
        options={clients}
        optionLabel="name"
        placeholder={props.placeholder || "Select one or more"}
      />
    );
  }

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
        placeholder={props.placeholder || 'Select One'}
      />
    </div>
  );
}

export default React.forwardRef(DropdownClients);
