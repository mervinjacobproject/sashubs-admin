import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import 'jspdf-autotable'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CountryHeader from 'src/pages/apps/invoice/list/countryHeader'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import AppSink from 'src/commonExports/AppSink'
import CountryEditForm from './countryEditForm'

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)'
  } else {
    return 'white'
  }
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))
const defaultColumns: GridColDef[] = [
  {
    field: 'Sl.no',
    headerName: 'S.No',
    flex: 0.1,
    editable: false,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.3,
    field: 'CountryName',
    headerName: 'Country Name',
    renderCell: ({ row }: any) => 
    <Tooltip title={row.CountryName}>

      <Typography sx={{ color: 'text.secondary' }}>{row.CountryName}</Typography>
    </Tooltip>
  },
  {
    flex: 0.3,
    field: 'CountryCode',
    headerName: 'PhoneCode',
    sortable: false,
    renderCell: ({ row }: any) => 
      <Tooltip title={row.CountryCode}>

        <Typography sx={{ color: 'text.secondary' }}>{row.CountryCode}</Typography>
      </Tooltip>
  },
  {
    field: 'Status',
    headerName: 'Status',
    flex: 0.3,
    sortable: false,
    renderCell: ({ row }: any) => (
      <Button
        sx={{
          padding: '5px 30px 5px 30px',
          borderRadius: '5px',
          width: '8px',
          cursor: 'initial',
          backgroundColor:
            row.Status == 1 ? '#dff7e9 !important' : row.Status == 0 ? '#f2f2f3 !important' : '',
          color: row.Status == 1 ? '#28c76f !important' : row.Status == 0 ? '#a8aaae !important' : '',
          fontWeight: '400',
          fontSize: row.Status == 0 ? '0.81em' : '0.81em'
        }}
      >
        {row.Status == 1 ? 'Active' : row.Status == 0 ? 'Inactive' : ''}
      </Button>
    )
  },
]

const Countrylist = () => {
  const [editId, setEditId] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
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
  const [designation, setDesignation] = useState([])
  const rowCount = designation?.length;
  const calculateHeight = (rowCount: any, pageSize: any) => {
    const rowHeight = 59 // Default row height in Material-UI DataGrid
    const headerHeight = 59 // Default header height in Material-UI DataGrid
    const paginationHeight = 56 // Default pagination height in Material-UI DataGrid

    let visibleRows
    if (rowCount <= pageSize) {
      visibleRows = rowCount
    } else {
      visibleRows = pageSize
    }

    return headerHeight + paginationHeight + visibleRows * rowHeight
  }

  const deleteItem = (id: any) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }
  const handleEdit = (id: any) => {
    const selectedRow = designation.find((row: any) => row.id === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }

  const handleDeleteConfirm = () => {

    // const apiEndpoint =
    ApiClient.post(`/deletecountry?id=${selectedRowId}`) // Corrected line
    .then((res: any) => {
      toast.success('Deleted successfully');
      fetchData();
      setModalOpenDelete(false);
    })
    .catch((err: any) => {
    toast.error('Error deleting designation');
  })
};

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const fetchData = async () => {
    try {
     
      const res = await ApiClient.post(`/getcountry`);
      const totalRowCount = res.data.data;
      setTotalCount(totalRowCount);
  
      const dataWithSerialNumber = totalRowCount.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1,
      }));
  
      setDesignation(dataWithSerialNumber);
    } catch (err) {
      toast.error('Error fetching data');
    }
  };
  
  

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, ])

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

    const tableHeader = '<tr style="text-align: center;"><th>S.No</th><th>CountryName</th><th>SortName</th><th>PhoneCode</th><th>Status</th></tr>'

    const tableRows = rideData
      .map((row: any, index: any) => {
        return `<tr>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Name}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.SortName}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.PhoneCode}</td>
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
            <h3 class="size-content">Country</h3>
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
             <title>Country</title>
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
     // console.error('Unable to open a new window. Please check your popup blocker settings.')
    }
  }

  const resetEditid = () => {
    setEditId([])
  }

  function editItem(id: any) {
    setEditId(id)
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
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setShowMessage(false)
                handleEdit(row.id)
              }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => deleteItem(row.id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }
  const applyFilters = async(activeStatus: any, phoneCode: any,countrySortName: any) => {
    try {
      let res: any;
      const queryParams: string[] = [];
      if (countrySortName) {
        queryParams.push(`CountryName=${countrySortName}`);
      }
      if (activeStatus && activeStatus !== 'all') {
        const status = activeStatus === 'active' ? 1 : 0;
        queryParams.push(`Status=${status}`);
      }
      if (phoneCode) {
        queryParams.push(`CountryCode=${phoneCode}`);
      }
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`;
        res = await ApiClient.post(`/getcountry${queryString}`);
      }
  
      // Process the response data
      const totalRowCount = res.data.data;
      setTotalCount(totalRowCount);
  
      const dataWithSerialNumber = totalRowCount.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1,
      }));
  
      setDesignation(dataWithSerialNumber);
    } catch (err) {
      toast.error('Error fetching data');
    }
  }
  function resetFilters() {
    setActiveStatus('all')
    setPhoneCode('')
    setCountrySortName('')
    fetchData()
  }

  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Country - Apurva</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <CountryHeader
                rideData={designation}
                allCountry={allCountry}
                printData={printData}
                fetchData={fetchData}
                editId={editId}
                countrySortName={countrySortName}
                setAllCountryName={setAllCountryName}
                setCountrySortName={setCountrySortName}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                setPhoneCode={setPhoneCode}
                phoneCode={phoneCode}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
                resetEditid={resetEditid}
                resetFilters={resetFilters}
                applyFilters={applyFilters}

              />
              <DataGrid
                autoHeight
                pagination
                rows={designation}
                getRowId={row => row.id}
                //loading={isTableLoading}
                columns={columns}
                rowCount={rowCount}
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
      {editMode && (
        <CustomModal
          buttonText=''
          open={editMode}
          onClose={handleCloseModal}
          buttonOpenText=''
          onOpen={() => setEditMode(true)}
          width={400}
        >
          <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
              <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleCloseModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <CountryEditForm
            editid={selectedRowData?.id}
            CountryName={selectedRowData?.CountryName}
            CountryCode={selectedRowData?.CountryCode}
            editStatus={selectedRowData?.Status}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
          />
        </CustomModal>
      )}
    </>
  )
}
export default Countrylist

