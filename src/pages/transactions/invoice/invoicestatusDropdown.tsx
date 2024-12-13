import React, { useEffect } from 'react';

import CustomTextField from 'src/@core/components/mui/text-field';
import axios from 'axios';

import { toast } from 'react-hot-toast';
import AppSink from 'src/commonExports/AppSink';
import { MenuItem } from '@mui/material';
import ApiClient from 'src/apiClient/apiClient/apiConfig';

interface ActionsDropdownProps {
  value: boolean;
  rowId: number;
  fetchData: any;
  handlePaid: any;
  handleNotPaid: any;
  handledraft: any;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ rowId, value, fetchData ,handlePaid,handleNotPaid,handledraft}: ActionsDropdownProps) => {
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
      toast.success(` status updated to ${newValue === 'false' ? 'Draft' : 'Invoice'}`);
      fetchData();
      handlePaid()
      handleNotPaid()
      handledraft()

    } catch (error) {
      toast.error('Error updating payslip status');
    }
  };


  const handleBillSetting = () => {
    const query = `query MyQuery {
      listBillSettings5AABS(filter: {Type: {eq: "Invoice"}}) {
        totalCount
        items {
          CurrentValue
          Format
          ID
          InsertedBy
          InsertedUserId
          Prefix
          Type
        }
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {

        const items = res.data.data.listBillSettings5AABS.items
        updateBillSettings(items[0].CurrentValue)

      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }



  const updateBillSettings = (items: any) => {
    const query = `mutation my {
      updateBillSettings5AAB(input: {CurrentValue: ${items + 1}, ID: 7016}) {
        CurrentValue
        Format
        ID
        InsertedBy
        InsertedUserId
        Type
        Prefix
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {

        listJobInvoice()

      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }


  const listJobInvoice = () => {
    const query = `query MyQuery {
      listJobInvoice5AABS(filter: {ID: {eq:${rowId}}}) {
        items {
          AdditionalCharge
          AdditionalChargePrice
          AdditionalChargeRate
          AssignTo
          Customer
          DateTime
          Description
          Draft
          DropLat
          DropLng
          DropLocation
          DueDate
          EmpQTY1
          EmpTotal
          FinalNetTotal
          IP
          ID
          InvoiceFrom
          InvoiceId
          JobIds
          JobsNew
          KM
          NetTotal
          PickupDate
          Passup
          PickupLat
          PickupLng
          PickupLocation
          PickupTime
          Status
          SubTotal
          PriceCategory
          Tax
          TaxId
        }
      }
    }`;

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(async (res) => {
        try {
          const items = res.data.data.listJobInvoice5AABS.items;

          const jobIds = items[0].JobIds.split(",");
          updateJobsNew(jobIds)
        } catch (error) {
          toast.error('Error updating jobs');
        }
      })
      .catch((err) => {
        toast.error('Error fetching job invoices');
      });
  };


  const updateJobsNew = async (items: any) => {

    try {
      for (const item of items) {
        const query = `mutation my {
          updateJobsNew5AAB(input: { ID: ${item}, InvoiceType: 1 }) {
            ID
            InvoiceType
          }
        }`;

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        };

        const response = await ApiClient.post(`${AppSink}`, { query }, { headers });
      }
    } catch (err) {
      console.error('Error updating jobs:', err);

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
      <MenuItem onClick={handleBillSetting} sx={{ fontSize: '12px' }} value="true">Invoice</MenuItem>
    </CustomTextField>
  );
};

export default ActionsDropdown;

