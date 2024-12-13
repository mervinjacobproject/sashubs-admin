import React, { useEffect } from 'react';
import {
  useState,
} from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { GridRowId } from '@mui/x-data-grid';

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

import JobTab from './jobTab';
import JobHeader from 'src/pages/apps/invoice/list/jobheader';
import InvoiceTab from './jobTab';




const JobDetail = () => {

  const [value, setValue] = useState<string>('');
  const [selectedRows] = useState<GridRowId[]>([]);
  const [selectedRowData] = useState<any | null>(null);

  const handleFilter = (val: string) => {
    setValue(val);
  };
  
  useEffect(() => {
    document.title = 'Invoice - 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);

  // const handleStatusFilter = (
  //   event: React.ChangeEvent<{ value: unknown }>
  // ) => {
  //   setStatusValue(event.target.value as string);
  // };

  // const filteredData = statusValue
  //   ? defaultData.filter((row) => row.Status === statusValue)
  //   : defaultData;

  // const columns: GridColDef[] = [
  //   ...defaultColumns,
  //   {
  //     flex: 0.1,
  //     minWidth: 140,
  //     sortable: false,
  //     field: 'actions',
  //     headerName: 'Actions',
  //     renderCell: (params: CellType) => (
  //       <>
  //         <IconButton>
  //           <Icon icon="majesticons:font-size-line" />{' '}
  //           {/* Assuming you have an edit icon */}
  //         </IconButton>
  //         <IconButton>
  //           <Icon icon="majesticons:font-size-line" />{' '}
  //           {/* Assuming you have a delete icon */}
  //         </IconButton>
  //       </>
  //     ),
  //   },
  // ];


  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/*}  <JobHeader
            editid={selectedRowData?.id}
            value={value}
            selectedRows={selectedRows}
            handleFilter={handleFilter}
            onFetchData={handleFilter}
            bulkDelete={handleFilter}
  />*/}


        </Grid>
        <Grid item xs={12}>
          <InvoiceTab />
          <Card>

          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default JobDetail;


