// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Type Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomTextField from 'src/@core/components/mui/text-field'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}
interface CellType {
  row: InvoiceType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler:circle-check' },
  Paid: { color: 'success', icon: 'tabler:circle-half-2' },
  Draft: { color: 'primary', icon: 'tabler:device-floppy' },
  'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 90,
    headerName: '# ID',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'invoiceStatus',
    renderHeader: () => <Icon icon='tabler:trending-up' fontSize={20} />,
    renderCell: ({ row }: CellType) => {
      const { dueDate, balance, invoiceStatus } = row

      const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {invoiceStatus}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 30, height: 30 }}>
            <Icon icon={invoiceStatusObj[invoiceStatus].icon} fontSize='1rem' />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>${row.total || 0}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'issuedDate',
    headerName: 'Issued Date',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.issuedDate}</Typography>
  }
]

const EcommerceInvoiceTable = () => {

  const [editId, setEditId] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 4 })
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rideData, setRideData] = useState([])
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [allCountry, setAllCountry] = useState([])
  const [allCountryName, setAllCountryName] = useState('')
  const [countrySortName, setCountrySortName] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [showMessage, setShowMessage] = useState(false)
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)
  const [date, setDate] = useState('')
  const [merchantName, setMerchantName] = useState('')
  const [designation, setDesignation] = useState([])
  const [allMerchant, setAllMerchant] = useState([])
  const rowCount = designation?.length
  // ** State
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoice)

  const [pagination, setPagination] = useState({
    pageSize: 4,
    page: 0,
  });

  const deleteItem = (id: any) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }
  const handleEdit = (Id: any) => {
    const selectedRow = designation.find((row: any) => row.Id === Id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }

  const handleDeleteConfirm = () => {
    ApiClient.post(`/deletesubscription?Id=${selectedRowId}`)
      .then((res: any) => {
        toast.success('Deleted successfully')
        // fetchData()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const fetchData = async () => {
    try {
      let res: any;
      const queryParams: string[] = [];
      if (merchantName) {
        queryParams.push(`MerchantName=${merchantName}`);
      }
      if (date) {
       // https://api.apurvarewardz.com/getsubscription?ExpiryDate=2024-10-13 10:23:48&MerchantName=P
        queryParams.push(`ExpiryDate=${date}`);
      }
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`;
        res = await ApiClient.post(`/getsubscription${queryString}`);
      } else {
       res = await ApiClient.post(`/getsubscription`)
      }
      const response = res.data.data
      setDesignation(response)
      setTotalCount(response.length)
      setIsTableLoading(false)
    } catch (err) {
      toast.error('Error fetching data:')
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    // fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, activeStatus, allCountryName, phoneCode,date,merchantName])
  const columns: GridColDef[] = [
    {
      field: 'Sl.no',
      headerName: 'S.No',
      flex: 0.0,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'MerchantName',
      headerName: 'Merchant Name',
      flex: 0.2,
      renderCell: ({ row }: any) =>
        <Tooltip title={row.MerchantName}>

          <Typography sx={{ color: 'text.secondary' }}>{row.MerchantName}</Typography>
        </Tooltip>
    },

    {
      flex: 0.2,
      field: 'SubscriptionDate',
      headerName: 'Subscription Date',
      sortable: false,
      renderCell: ({ row }: any) => {
        const date = new Date(row.SubscriptionDate)
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

        return (
          <Tooltip title={formattedDate}>

            <Typography sx={{ color: 'text.secondary' }}>{formattedDate}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      field: 'SubscriptionExpiryDate',
      headerName: 'Sub-Expiry Date',
      sortable: false,
      renderCell: ({ row }: any) =>
         {
        const date = new Date(row.SubscriptionExpiryDate)
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        return (
          <Tooltip title={formattedDate}>

            <Typography sx={{ color: 'text.secondary' }}>{formattedDate}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Amount',
      headerName: 'Amount (₹)',
      sortable: false,
      type: 'number',
      renderCell: ({ row }: any) =>
        <Tooltip title={row.Amount}>

          <Typography sx={{ color: 'text.secondary', headerAlign: 'right',align:'right' }}>{row.Amount}</Typography>
        </Tooltip>
    },
    {
      flex: 0.1,
      field: 'Days',
      headerName: 'Days',
      sortable: false,
      renderCell: ({ row }: any) => {
        // Determine the background color based on DaysRemaining
        const backgroundColor = row.DaysRemaining <= 2
          ? '#f8d7da'
          : (row.DaysRemaining <= 7 ? '#776cff' : '#65D798');

        // Determine the text color based on DaysRemaining
        const color = row.DaysRemaining <= 2
          ? '#721c24' // Dark red
          : (row.DaysRemaining <= 7 ? 'white' : 'black'); // White or black

        return (
          <Button
            sx={{
              padding: '5px 30px',
              borderRadius: '5px',
              width: 'auto', // Adjusted width to fit content
              cursor: 'pointer', // Change cursor to pointer for better UX
              backgroundColor: backgroundColor,
              color: color,
              fontWeight: '700',
              fontSize: '16px',
              transition: 'background-color 0.3s ease', // Smooth transition effect
              '&:hover': {
                backgroundColor: row.DaysRemaining <= 2
                  ? '#f5c6cb' // Slightly darker red for hover
                  : (row.DaysRemaining <= 7 ? '#e67e22' : '#57b68c'), // Darker orange or green
                color: color === 'white' ? '#000' : color // Change text color for contrast on hover if necessary
              }
            }}
          >
            {row.DaysRemaining}
          </Button>
        );
      }
    },
    // {
    //   flex: 0.1,
    //   minWidth: 140,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }: any) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //       <Tooltip title='Edit'>
    //         <IconButton
    //           size='small'
    //           sx={{ color: 'text.secondary' }}
    //           onClick={() => {
    //             setShowMessage(false)
    //             handleEdit(row.Id)
    //           }}
    //         >
    //           <Icon icon='tabler:edit' fontSize={20} />
    //         </IconButton>
    //       </Tooltip>

    //       <Tooltip title='Delete'>
    //         <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => deleteItem(row.Id)}>
    //           <Icon icon='tabler:trash' />
    //         </IconButton>
    //       </Tooltip>
    //     </Box>
    //   )
    // }
  ]

  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  return (
    <Card>
      <CardContent
        sx={{ gap: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* <Button component={Link} variant='contained' href='/apps/invoice/add' startIcon={<Icon icon='tabler:plus' />}>
          Create Invoice
        </Button> */}
        <Box sx={{ gap: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
  value={merchantName}
  placeholder='Search Merchant Name'
  onChange={(e) => {
    setMerchantName(e.target.value); // Update merchantName on change
    // fetchData(); // Fetch data after updating the merchant name
  }}
/>

          {/* <CustomTextField
            select
            sx={{ pr: 4, '& .MuiFilledInput-input.MuiSelect-select': { minWidth: '8rem !important' } }}
            SelectProps={{
              displayEmpty: true,
              value: statusValue,
              onChange: e => setStatusValue(e.target.value as string)
            }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='downloaded'>Downloaded</MenuItem>
            <MenuItem value='draft'>Draft</MenuItem>
            <MenuItem value='paid'>Paid</MenuItem>
            <MenuItem value='partial payment'>Partial Payment</MenuItem>
            <MenuItem value='past due'>Past Due</MenuItem>
            <MenuItem value='sent'>Sent</MenuItem>
          </CustomTextField> */}
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rowHeight={54}
        getRowId={row => row.Id}
        loading={isTableLoading}
        rowCount={totalCount}

        rows={designation}
        columns={columns}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        pageSizeOptions={[4, 10, 25, 50]}
        onPaginationModelChange={setPaginationModel}

      />
    </Card>
  )
}

export default EcommerceInvoiceTable
