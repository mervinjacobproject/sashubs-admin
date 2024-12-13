// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
// import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import format from 'date-fns/format'
import {  useSelector } from 'react-redux'


// ** Types Imports
import { RootState } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, Typography } from '@mui/material'
import AdditionalChargesHeader from 'src/pages/apps/invoice/list/AdditionalChargesHeader'




interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
// const invoiceStatusObj: InvoiceStatusObj = {
//   Sent: { color: 'secondary', icon: 'tabler:circle-check' },
//   Paid: { color: 'success', icon: 'tabler:circle-half-2' },
//   Draft: { color: 'primary', icon: 'tabler:device-floppy' },
//   'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
//   'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
//   Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
// }

// ** renders client column
const renderClient = (row: InvoiceType) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
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
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }: CellType) => (
      <Typography component={LinkStyled} href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },

  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   field: 'invoiceStatus',
  //   renderHeader: () => <Icon icon='tabler:trending-up' />,
  //   renderCell: ({ row }: CellType) => {
  //     const { dueDate, balance, invoiceStatus } = row

  //     const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

  //     return (
  //       <Tooltip
  //         title={
  //           <div>
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               {invoiceStatus}
  //             </Typography>
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Balance:
  //             </Typography>{' '}
  //             {balance}
  //             <br />
  //             <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
  //               Due Date:
  //             </Typography>{' '}
  //             {dueDate}
  //           </div>
  //         }
  //       >
  //         <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
  //           <Icon icon={invoiceStatusObj[invoiceStatus].icon} />
  //         </CustomAvatar>
  //       </Tooltip>
  //     )
  //   }
  // },

  {
    flex: 0.25,
    field: 'name',
    minWidth: 320,
    headerName: 'Tittle',
    renderCell: ({ row }: CellType) => {
      const { name, companyEmail } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

//   {
//     flex: 0.1,
//     minWidth: 100,
//     field: 'total',
//     headerName: 'Total',
//     renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`$${row.total || 0}`}</Typography>
//   },
//   {
//     flex: 0.15,
//     minWidth: 140,
//     field: 'issuedDate',
//     headerName: 'Issued Date',
//     renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
//   },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'balance',
    headerName: 'Additional Charges',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>{row.balance}</Typography>
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const AdditionalCharges = () => {
  const [value, setValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const store = useSelector((state: RootState) => state.invoice)


  useEffect(() => {
    document.title = 'Draft reports 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       dates,
  //       q: value,
  //       status: statusValue
  //     })
  //   )
  // }, [dispatch, statusValue, value, dates])

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
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <Card>
            < AdditionalChargesHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
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
  )
}

export default AdditionalCharges
