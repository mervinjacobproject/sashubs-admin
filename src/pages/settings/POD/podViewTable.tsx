import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

interface PodEditFormProps {
  designationName: string;
  editid: any;
  OrderName: any;
  editStatus: any;
}

const PodViewTable: React.FC<PodEditFormProps> = ({
  designationName,
  editid,
  OrderName,
  editStatus,
}: any) => {
  const columns: GridColDef[] = [
    {
      field: 'S.No',
      headerName: 'S.No',
      width: 100,
      renderCell: (params) => <Typography>{params.row.id}</Typography>,
    },
    {
      field: 'Title',
      headerName: 'POD Name',
      width: 320,
      renderCell: () => <Typography>{designationName}</Typography>,
    },
    {
      field: 'Order',
      headerName: 'ORDER',
      width: 200,
      renderCell: () => <Typography>{OrderName}</Typography>,
    },
    {
      field: 'Status',
      headerName: 'STATUS',
      width: 100,
      renderCell: () => (
        <Button
          sx={{
            padding: '5px 10px 5px 10px',
            borderRadius: '3px',
            backgroundColor: `${
              editStatus === 1 ? '#dff7e9 !important' : editStatus === 0 ? '#f2f2f3 !important' : ''
            }`,
            color: `${
              editStatus === 1 ? '#28c76f !important' : editStatus === 0 ? '#a8aaae !important' : ''
            }`,
            fontWeight: '500',
            fontSize: `${editStatus === 0 ? '0.81em' : '0.81em'}`, // Adjust text size for status '0'
          }}
        >
          {editStatus === 1 ? 'ACTIVE' : editStatus === 0 ? 'INACTIVE' : ''}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 130, width: '100%', marginTop: '10px' }}>
      <DataGrid
        rows={[{ id: 1 }]}
        columns={columns}
        autoHeight
        hideFooter
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default PodViewTable;
