import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import CustomTextField from 'src/@core/components/mui/text-field';



interface ActionsDropdownProps {
  value: string;
  onChange: (value: string) => void;
  SelectedRowsInvoiced: any;
}

const JobInvoiceDropdown: React.FC<ActionsDropdownProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string;
    onChange(newValue);
  };

  return (

    <CustomTextField
      select
      defaultValue='completed'
      sx={{ mr: 4, mb: 2, fontSize: "12px" }}
      SelectProps={{
        renderValue: (selected) =>
          (selected as string)?.length === 0 ? 'Job Complete' : (selected as string),
      }}
      value={value}
      onChange={handleChange}
    >
      <MenuItem sx={{ fontSize: "12px" }} value='completed'>
        Job Complete
      </MenuItem>
      <MenuItem sx={{ fontSize: "12px" }} value='waiting'>Waiting</MenuItem>
    </CustomTextField>
  );
};

export default JobInvoiceDropdown;
