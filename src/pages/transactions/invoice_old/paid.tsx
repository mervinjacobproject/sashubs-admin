import React from 'react';
import {
  useState,
} from 'react';
 
import Icon from 'src/@core/components/icon';
 
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
 
// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import PaidDropDown from './paiddropdown';

 
// interface CustomInputProps {
//   dates: Date[];
//   label: string;
//   end: number | Date;
//   start: number | Date;
//   setDates?: (value: Date[]) => void;
// }

 
// interface CellType {
//   row: InvoiceType;
// }

 
// ** Styled component for the link in the dataTable
// const LinkStyled = styled(Link)(({ theme }) => ({
//   textDecoration: 'none',
//   fontSize: theme.typography.body1.fontSize,
//   color: `${theme.palette.primary.main} !important`,
// }));

 
const defaultData = [
  {
    id: 1,
    S_No: '1',
    Created_Date: '2023-01-01',
    Date: '2023-01-02',
    JobId: '123',
    InvoiceId:'5AAB-00986',
    Customer: 'John Doe',
    Amount:"$ 5,845.99",
    Reference: 'Ref123',
    DropLocation: 'LocationA',
    Status: 'Paid',
    InvoiceStatus: 'Invoiced',
  },
  {
    id: 2,
    S_No: '2',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    JobId: '456',
    InvoiceId:'5AAB-00986',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    Amount:"$ 6,845.99",
    DropLocation: 'LocationB',
    Status: 'Paid',
    InvoiceStatus: 'Invoiced',
  },
  {
    id: 3,
    S_No: '3',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    InvoiceId:'5AAB-00985',
    JobId: '456',
    Customer: 'Jane Doe',
    Amount:"$ 7,845.99",
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Status: 'Paid',
    InvoiceStatus: 'Invoiced',
  },
  {
    id: 4,
    S_No: '4',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    InvoiceId:'5AAB-00985',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    Amount:"$ 4,845.99",
    DropLocation: 'LocationB',
    Status: 'Paid',
    InvoiceStatus: 'Invoiced',
  },
  {
    id: 5,
    S_No: '5',
    Created_Date: '2023-01-03',
    Date: '2023-01-04',
    InvoiceId:'5AAB-00986',
    JobId: '456',
    Customer: 'Jane Doe',
    Reference: 'Ref456',
    DropLocation: 'LocationB',
    Amount:"$ 9,845.99",
    Status: 'Paid',
    InvoiceStatus: 'Invoiced',
  },
];
 
 
const PaidInvoice = () => {
  // ** State
  const [statusValue] = useState<string | null>(null);
  const [ selectedRows,setSelectedRows] = useState<any>([]);
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(defaultData.length).fill('Paid'));
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
 
  const filteredData = statusValue
    ? defaultData.filter((row) => row.Status === statusValue)
    : defaultData;

    
const defaultColumns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'S_No',
      headerName: 'S.Id',
    },

  
  //   {
  //     flex: 0.1,
  //     minWidth: 100,
  //     field: 'Created_Date',
  //     headerName: 'Created Date',
  //   },

  
    {
      flex: 0.1,
      minWidth: 100,
      field: 'Date',
      headerName: 'Date',
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'InvoiceId',
      headerName: 'InvoiceId',
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'Customer',
      headerName: 'Customer',
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'Amount',
      headerName: 'Amount',
    },

  
  //   {
  //     flex: 0.15,
  //     minWidth: 140,
  //     field: 'DropLocation',
  //     headerName: 'Drop Location',
  //   },
  
  
    {
      flex: 0.1,
      minWidth: 100,
      field: 'Status',
      headerName: 'Status',
      renderCell: (params: any) => (
          <PaidDropDown
            value={dropdownValues[params.row.id - 1]} 
            onChange={(val) => handleFilter(val, params.row.id - 1)}
            selectedRows={selectedRows}
          />
        )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'InvoiceStatus',
      headerName: 'InvoiceStatus',
    },
  ];
 
  const handleFilter = (val: string, rowId: number) => {
    const updatedDropdownValues = [...dropdownValues];
    updatedDropdownValues[rowId] = val;
    setDropdownValues(updatedDropdownValues);
  }; 
  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => (
        <>
          <IconButton>
            <Icon icon="mingcute:edit-line" />{' '}

            {/* Assuming you have an edit icon */}

          </IconButton>
          <IconButton>
            <Icon icon="ic:baseline-delete" />{' '}

            {/* Assuming you have a delete icon */}

          </IconButton>
        </>
      ),
    },
  ];
 
  return (
    <DatePickerWrapper>
 
          <Card>
            <DataGrid  
              autoHeight
              pagination
              rowHeight={62}
              rows={filteredData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
            />
          </Card>
    </DatePickerWrapper>
  );
};

 
export default PaidInvoice;
 
 