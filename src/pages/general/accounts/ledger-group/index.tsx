// ** React Imports
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

const LedgerGroup = () => {
  const [Designation, setDesignation] = useState([]);
  const [ setSelectedRows] = useState<any>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const fetchData = () => {
    ApiClient.get('/api.php?moduletype=designation&apitype=list_all')
      .then((res: any) => {
        setDesignation(res.data);  
      })
      .catch((err: any) => {
        console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.title = 'Ledger group 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'ID',
      headerName: 'ID',
      flex: 0.30,
    },


    {
      field: 'GroupName',
      headerName: 'GROUP NAME',
      flex: 0.30,
    },

    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   flex: 0.5,
    //   renderCell: ({ row }: any) => (
    //     <CustomChip
    //       rounded
    //       size='small'
    //       skin='light'
    //       color={row.status === 1 ? 'success' : 'primary'}  
    //       label={row.status === 1 ? 'Active' : 'Inactive'}  
    //     />
    //   ),
    // },

    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   flex: 0.2,
    //   sortable: false,
    //   renderCell: () => (
    //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //     <Tooltip title='Delete Invoice'>
    //       <IconButton size='small' sx={{ color: 'text.secondary' }}>
    //         <Icon icon='tabler:trash' />
    //       </IconButton>
    //     </Tooltip>
    //     <Icon icon='tabler:edit' fontSize={20} />
    //   </Box>
    //   ),
    // },
  ];

  return (
    <>
     <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} >
        </Grid>
        <Grid item xs={12} >
          <Card>
            {/* <LedgerGroupHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} /> */}
      <DataGrid
        autoHeight
        pagination
        rows={Designation}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={rows => setSelectedRows(rows)}
      />
 </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
    </>
  );
};
export default LedgerGroup
