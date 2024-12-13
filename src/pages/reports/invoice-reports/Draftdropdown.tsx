import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import CustomTextField from 'src/@core/components/mui/text-field';



interface ActionsDropdownProps {
  value: string;
  onChange: (value: string) => void;
  selectedRows: any;
}

const DraftDropDownReports: React.FC<ActionsDropdownProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string;
    onChange(newValue);
  };

  return (

    <CustomTextField
      select
      defaultValue='NotPaid'
      sx={{ mr: 4, mb: 2, fontSize: "12px", }}
      SelectProps={{
        renderValue: (selected) =>
          (selected as string)?.length === 0 ? 'NotPaid' : (selected as string),
      }}
      value={value}
      onChange={handleChange}
    >
      <MenuItem sx={{ fontSize: "12px" }} value='NotPaid'>
        Not Paid
      </MenuItem>
      <MenuItem sx={{ fontSize: "12px" }} value='Paid'>Paid</MenuItem>
    </CustomTextField>
  );
};

export default DraftDropDownReports;
