import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import {  useSelector } from 'react-redux'

// import { deleteInvoice } from 'src/store/apps/invoice'

import { RootState } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

interface CellType {
  row: InvoiceType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))
 
const renderClient = (row: InvoiceType) => {

    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }

 
const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerName: 'O.ID',
    renderCell: ({ row }: CellType) => (
      <Typography component={LinkStyled} href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },
  
  {
    flex: 0.15,
    field: 'OrderDate',
    minWidth: 100,
    headerName: 'OrderDate',
    renderCell: ({ row }: CellType) => {
      const {  companyEmail } = row
 
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Name
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'OrderID',
    headerName: 'Order ID',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`$${row.total || 0}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: 'Customer',
    headerName: 'Customer',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'Amount',
    headerName: 'Amount',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 160,
    field: 'OrderStatus',
    headerName: 'Order Status',
    renderCell: ({ row }: CellType) => {
      return row? (
        <CustomChip rounded size='small' skin='light' color='primary' label='Inactive' />
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]

const DriverReborts = () => {

  const [value, setValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { data} = useSelector((state:any) => state.appInvoice) || {};
 
  // const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.invoice)

  useEffect(() => {
    document.title = 'Driver reports 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);
 
  const handleFilter = (val: string) => {
    setValue(val)
  }
 
 
  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton size='small' sx={{ color: 'text.secondary' }}

            // onClick={() => dispatch(deleteInvoice(row.id))}
            
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Icon icon='tabler:edit' fontSize={20} />
        </Box>
      )
    }
  ]
 
  return (
    <>
      {/* {countries.map(country => (
          <li key={country.id}>{country.title}</li>
        ))} */}
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              rows={store.data}
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
  )
}

export default DriverReborts