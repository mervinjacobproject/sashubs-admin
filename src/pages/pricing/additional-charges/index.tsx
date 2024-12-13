// ** React Imports
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, Typography } from '@mui/material'
import 'jspdf-autotable'
import Button from '@mui/material/Button'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import AdditionalChargesHeader from '../../apps/invoice/list/AdditionalChargesHeader'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'


const formatCurrency = (amount:any) =>
  amount.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
 

const defaultColumns: GridColDef[] = [
  {
    field: 'Sl.no',
    headerName: 'S.No',
    flex: 0.1,
    editable: false,
    filterable: false,
    sortable:false,
    renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    field: 'Name',
    flex: 0.3,
    headerName: 'Title',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.Name.charAt(0).toUpperCase() + row.Name.slice(1)}</Typography>
    )
  },
  {
    field: 'Description',
    flex: 0.3,
    headerName: 'Description',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary' }}>
        {row.Description.charAt(0).toUpperCase() + row.Description.slice(1)}
      </Typography>
    )
  },
  {
    flex: 0.2,
    field: 'Charge',
    headerName: 'Additional Charges',
    renderCell: ({ row }) => <b>{formatCurrency(Number(row.Charge))}</b>
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.3,
    sortable:false,
    renderCell: ({ row }: any) => {
      return (
        <Button
          sx={{
            padding: '5px 30px 5px 30px',
            width: '8px',
            borderRadius: '3px',
            cursor: 'initial',
            backgroundColor:
              row.Status === true ? '#dff7e9 !important' : row.Status === false ? '#f2f2f3 !important' : '',
            color: row.Status === true ? '#28c76f !important' : row.Status === false ? '#a8aaae !important' : '',
            fontWeight: '500',
            fontSize: row.Status === false ? '0.81em' : '0.81em'
          }}
        >
          {row.Status === true ? 'ACTIVE' : row.Status === false ? 'INACTIVE' : ''}
        </Button>
      )
    }
  }
]

const AdditionalCharges = () => {
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [allCountryName, setAllCountryName] = useState('')
  const [chargeCode, setChargeCode] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [rideData, setRideData] = useState([])
  const [stateValue, setStateValue] = useState([])
  const [showMessage, setShowMessage] = useState(false)

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const deletItem = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteAdditionalCharges5AAB(input: {ID: ${selectedRowId}}) {
        Description
        Charge
        ID
        Name
        Status
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchData()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const fetchAdd = async () => {
    const query = `query MyQuery {
      listAdditionalCharges5AABS {
        items {
          Name
          Status
          ID
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setStateValue(res.data.data.listAdditionalCharges5AABS.items)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchAdd()
  }, [])

  const fetchData = async () => {
    let filterString = `{Description: {contains: ""}`
    if (allCountryName) {
      filterString += `, ID: {eq: ${allCountryName}}`
    }
    if (chargeCode) {
      filterString += `, Charge: {contains: "${chargeCode}"}`
    }
    if (activeStatus === 'active') {
      filterString += `, Status: {eq: true}`
    } else if (activeStatus === 'inactive') {
      filterString += `, Status: {eq: false}`
    } else if (activeStatus === 'all') {
      filterString += `,`
    }
    filterString += '}'

    const query = `
     query MyQuery {
      listAdditionalCharges5AABS(filter: ${filterString}) {
        items {
          ID
          Charge
          Description
          Name
          Status
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setRideData(res.data.data.listAdditionalCharges5AABS.items)
      setTotalCount(res.data.data.listAdditionalCharges5AABS.items.length)
      setIsTableLoading(false)
    } catch (err) {
      setIsTableLoading(false)
      console.error( err)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, chargeCode, allCountryName])

  const printData = () => {
    const imageSource = '/images/icons/project-icons/sev 1.png'

    const fromAddress = `
      <div class="col-6">
        <strong>From Address:</strong><br>
        Khushdeep Singh<br>
        91, MAREEBA WAY, CRAIGIEBURN<br>
        VICTORIA - 3064<br>
        Australia<br>
        Email: khushdeepsingh14721@gmail.com<br>
        Phone: 0448459767<br>
      </div>
    `

    const tableHeader = '<tr style="text-align: center;"><th>S.No</th><th>Title</th><th>Description</th><th>Charge</th><th>Status</th></tr>'

    const tableRows = rideData
      .map((row: any, index: any) => {
        return `<tr>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Name}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Description}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Charge}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Status === true ? 'ACTIVE' : row.Status === false ? 'INACTIVE' : ''}</td>
        </tr>`
      })
      .join('')

    const printableData = `
      <style>
        .custom-table {
          width: 100%;
          margin-top: 20px;
        }
        .custom-table th, .custom-table td {
          padding: 19px;
          text-align: center;
        }
        .custom-table th {
          border-bottom: 1px solid #ddd;
        }
        .address-container {
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .address-head {
          padding-bottom: 20px;
          padding-top: 20px;
        }
        .size-content {
          display: flex;
          justify-content: start;
        }
        .address-head {
          padding-bottom: 30px;
          padding-top: 20px;
        }
      </style>
      
      <div class="row">
        <div class="address-container">
          <div>
            <img src="${imageSource}" alt="Cross Image" />
            <h3 class="size-content">Additional Charges</h3>
          </div>
          <div>${fromAddress}</div>
        </div>
      </div>
      
      <table class="custom-table">${tableHeader}${tableRows}</table>
    `

    // Print option
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
             <title>Additional Charges</title>
            <!-- Add Bootstrap CDN link here if not already included in your project -->
          </head>
          <body>
            <div id="pdf-container">${printableData}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    } else {
      console.error('Unable to open a new window. Please check your popup blocker settings.')
    }
  }

  function editItem(id: number) {
    setEditId(id)
  }

  const resetEditid = (val: string) => {
    setEditId(null)
  }

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else if (selectedMode === 'light') {
      return 'black'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else {
      return 'black'
    }
  }
  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.3,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      filterable: false,
      headerName: 'Actions',
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                editItem(row.id)
                setShowMessage(false)
                const btn = document.getElementById('NewChargeBtn')
                if (btn) {
                  const btnElement = btn as HTMLElement
                  btnElement.click()
                }
              }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => deletItem(row.id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Additional Charges - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <AdditionalChargesHeader
                rideData={rideData}
                editId={editId}
                printData={printData}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                setAllCountryName={setAllCountryName}
                setChargeCode={setChargeCode}
                chargeCode={chargeCode}
                stateValue={stateValue}
                showMessage={showMessage}
                setShowMessage={setShowMessage}
                resetEditid={resetEditid}
                fetchData={fetchData}
                
              />
              <DataGrid
                autoHeight
                pagination
                getRowId={row => row.ID}
                rowHeight={62}
                rows={rideData}
                columns={columns}
                loading={isTableLoading}
                rowCount={totalCount}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
              />
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p
          style={{
            color: getColor()
          }}
        >
          Are you sure you want to delete?
        </p>
        <div className='delete-popup' style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#808080',
              '&:hover': {
                background: '#808080',
                color: 'white'
              }
            }}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            onClick={handleDeleteConfirm}
          >
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default AdditionalCharges
