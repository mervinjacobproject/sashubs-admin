import React from 'react';

import CustomTextField from 'src/@core/components/mui/text-field';
import axios from 'axios';

import { toast } from 'react-hot-toast';
import AppSink from 'src/commonExports/AppSink';
import { MenuItem } from '@mui/material';

interface ActionsDropdownProps {
  value: boolean; 
  rowId: number;
  fetchData: any;
  handlePaid: any;
  handleNotPaid: any;
  handledraft: any;
}

const InvoiceDropDown: React.FC<ActionsDropdownProps> = ({ rowId, value, fetchData,handlePaid,handleNotPaid,handledraft }: ActionsDropdownProps) => {
  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value as string;

    const query = `
      mutation UpdateJobInvoice($id: Int!, $draft: Boolean!) {
        updateJobInvoice5AAB(input: {ID: $id, Draft: $draft}) {
          ID
          Status
        }
      }
    `;

    const variables = {
      id: rowId,
      draft: newValue === 'true',
    };

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(`${AppSink}`, { query, variables }, { headers });
      toast.success(`Invoice status updated to ${newValue === 'false' ? 'Draft' : 'Invoice'}`);
      fetchData();
      handlePaid()
      handleNotPaid()
      handledraft()
    } catch (error) {
      toast.error('Error updating payslip status');
    }
  };

  return (
    <CustomTextField
      select
      sx={{ mr: 4, mb: 2, fontSize: '12px' }}
      value={value ? 'true' : 'false'}
      onChange={handleChange}
    >
    
      <MenuItem sx={{ fontSize: '12px' }} value="false">Draft</MenuItem>
      <MenuItem sx={{ fontSize: '12px' }} value="true">Invoice</MenuItem>
    </CustomTextField>
  );
};







export default InvoiceDropDown;
