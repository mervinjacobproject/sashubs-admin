// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
// import format from 'date-fns/format'

// ** Store & Actions Imports
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
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// interface InvoiceStatusObj {
//   [key: string]: {
//     icon: string
//     color: ThemeColor
//   }
// }

// interface CustomInputProps {
//   dates: Date[]
//   label: string
//   end: number | Date
//   start: number | Date
//   setDates?: (value: Date[]) => void
// }

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

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
    headerName: 'Category Code',
    renderCell: ({ row }: CellType) => (
      <Typography component={LinkStyled} href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'invoiceStatus',
    headerName: 'Status',
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 320,
    headerName: 'Category Name',
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
  {
    flex: 0.1,
    minWidth: 100,
    field: 'total',
    headerName: 'Parent Category',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`$${row.total || 0}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: 'issuedDate',
    headerName: 'Products Numbers',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'balance',
    headerName: 'Last Updated',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>{row.balance}</Typography>
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='Paid' />
      )
    }
  },
]

/* eslint-disable */
// const CustomInput = forwardRef((props: CustomInputProps, ref) => {
//   const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
//   const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

//   const value = `${startDate}${endDate !== null ? endDate : ''}`
//   props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
//   const updatedProps = { ...props }
//   delete updatedProps.setDates

//   return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
// })
/* eslint-enable */

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')

  // const [statusValue] = useState<string>('')

  // const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  
  // const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()

  const store = useSelector((state: RootState) => state.invoice)

  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       dates,
  //       q: value,
  //       status: statusValue
  //     })
  //   )
  // }, [dispatch,value, dates,statusValue])

  

  const handleFilter = (val: string) => {
    setValue(val)
    setDates(dates)
  }

  // const handleStatusValue = (e: SelectChangeEvent<unknown>) => {
  //   setStatusValue(e.target.value as string)
  // }

  // const handleOnChangeRange = (dates: any) => {
  //   const [start, end] = dates
  //   if (start !== null && end !== null) {
  //     setDates(dates)
  //   }
  //   setStartDateRange(start)
  //   setEndDateRange(end)
  // }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton size='small' sx={{ color: 'text.secondary' }}

            //  onClick={() => dispatch(deleteInvoice(row.id))}
             
             >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/apps/invoice/preview/${row.id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='tabler:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/apps/invoice/edit/${row.id}`,
                icon: <Icon icon='tabler:edit' fontSize={20} />
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='tabler:copy' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Invoice Status'
                    SelectProps={{ value: statusValue, onChange: e => handleStatusValue(e) }}
                  >
                    <MenuItem value=''>None</MenuItem>
                    <MenuItem value='downloaded'>Downloaded</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='paid'>Paid</MenuItem>
                    <MenuItem value='partial payment'>Partial Payment</MenuItem>
                    <MenuItem value='past due'>Past Due</MenuItem>
                    <MenuItem value='sent'>Sent</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
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
              pageSizeOptions={[10, 25, 50,100]}
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

export default InvoiceList
