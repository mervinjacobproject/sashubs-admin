import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import CustomTextField from 'src/@core/components/mui/text-field';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import AppSink from 'src/commonExports/AppSink';

interface ActionsDropdownProps {
  fetchData: any;
  statusID: any;
}

const JobCompleteDropdown: React.FC<ActionsDropdownProps> = ({ fetchData, statusID }) => {
  const [value, setValue] = useState('completed');

  const handleStatus = async (statusID: string, newValue: string) => {
    try {
      let statusValue;
      if (newValue === 'waiting') {
        statusValue = 1;
      } else if (newValue === 'completed') {
        statusValue = 2;
      }
  
      const query = `
      mutation my {
        updateJobsNew5AAB(input: {ID: ${statusID}, Status: ${statusValue}}) {
          Status
          ID
        }
      }`;
       
  
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };
  
      await ApiClient.post(`${AppSink}`, { query }, { headers });
      fetchData();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  }

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const newValue = event.target.value as string;
    if (newValue === 'completed') {
      alert("Job already in completed Status")
    } else {
      setValue(newValue);
      handleStatus(statusID, newValue); 
     
    }
  };
  

  return (
    <CustomTextField
      select
      defaultValue='waiting'
      sx={{ mr: 4, mb: 2, fontSize: "12px" }}
      SelectProps={{
        renderValue: (selected) =>
          (selected as string)?.length === 0 ? 'completed' : (selected as string),
      }}
      value={value}
      onChange={handleChange}
    >
      <MenuItem sx={{ fontSize: "12px" }} value='waiting'>
        Waiting
      </MenuItem>
      <MenuItem sx={{ fontSize: "12px" }} value='completed'>
        Job Complete
      </MenuItem>
    </CustomTextField>
  );
};
export default JobCompleteDropdown;

