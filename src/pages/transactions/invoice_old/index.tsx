import React from 'react';
import { useState,} from 'react';
 

 
// ** MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import {   GridRowId } from '@mui/x-data-grid';

 

 
// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import InvoiceTab from './invoiceTab';
import InvoiceHeader from 'src/pages/apps/invoice/list/invoiceheader';
 

 
// interface CellType {
//   row: InvoiceType;
// }

 
// const defaultData = [
//   {
//     id: 1,
//     S_No: '1',
  
//     Date: '2023-01-02',
//     JobId: '123',
//     Customer: 'John Doe',
//     Reference: 'Ref123',
//     DropLocation: 'LocationA',
//     Status: 'Waiting',
//     InvoiceStatus: 'pending',
//   },
//   {
//     id: 2,
//     S_No: '2',
  
//     Date: '2023-01-04',
//     JobId: '456',
//     Customer: 'Jane Doe',
//     Reference: 'Ref456',
//     DropLocation: 'LocationB',
//     Status: 'Completed',
//     InvoiceStatus: 'Invoiced',
//   },
//   {
//     id: 3,
//     S_No: '3',
 
//     Date: '2023-01-04',
//     JobId: '456',
//     Customer: 'Jane Doe',
//     Reference: 'Ref456',
//     DropLocation: 'LocationB',
//     Status: 'Completed',
//     InvoiceStatus: 'Invoiced',
//   },
//   {
//     id: 4,
//     S_No: '4',
   
//     Date: '2023-01-04',
//     JobId: '456',
//     Customer: 'Jane Doe',
//     Reference: 'Ref456',
//     DropLocation: 'LocationB',
//     Status: 'Completed',
//     InvoiceStatus: 'Invoiced',
//   },
//   {
//     id: 5,
//     S_No: '5',
 
//     Date: '2023-01-04',
//     JobId: '456',
//     Customer: 'Jane Doe',
//     Reference: 'Ref456',
//     DropLocation: 'LocationB',
//     Status: 'waiting',
//     InvoiceStatus: 'pending',
//   },
// ];
 
// const defaultColumns: GridColDef[] = [
//   {
//     flex: 0.1,
//     minWidth: 50,
//     field: 'S_Id',
//     headerName: 'S.Id',
//   },

//   // {
//   //   flex: 0.1,
//   //   minWidth: 100,
//   //   field: 'Created_Date',
//   //   headerName: 'Created Date',
//   // },

//   {
//     flex: 0.1,
//     minWidth: 100,
//     field: 'Date',
//     headerName: 'Date',
//   },
//   {
//     flex: 0.1,
//     minWidth: 140,
//     field: 'InvoiceId',
//     headerName: 'InvoiceId',
//   },
//   {
//     flex: 0.15,
//     minWidth: 100,
//     field: 'Customer',
//     headerName: 'Customer',
//   },
//   {
//     flex: 0.15,
//     minWidth: 140,
//     field: 'Amount',
//     headerName: 'Amount',
//   },

//   // {
//   //   flex: 0.15,
//   //   minWidth: 140,
//   //   field: 'DropLocation',
//   //   headerName: 'Drop Location',
//   // },

//   {
//     flex: 0.1,
//     minWidth: 100,
//     field: 'Status',
//     headerName: 'Status',
//   },
//   {
//     flex: 0.1,
//     minWidth: 100,
//     field: 'InvoiceStatus',
//     headerName: 'InvoiceStatus',
//   },
// ];
 
const InvoiceDetail = () => {
  const [value, setValue] = useState<string>('');
  const [selectedRows] = useState<GridRowId[]>([]);

 
  const handleFilter = (val: string) => {
    setValue(val);
  };
 
 
 
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
      <Grid item xs={12}>
      <InvoiceHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
            />
            </Grid>
        <Grid item xs={12}>
          <InvoiceTab/>
          <Card>
         
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};
 
export default InvoiceDetail;
 
 
