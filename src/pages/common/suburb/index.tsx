import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import { Typography } from '@mui/material'
import 'jspdf-autotable'
// import SuburbHeader from 'src/pages/apps/invoice/list/surburpHeader'
import EditSuburbForm from './editForm'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'

const color = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#fff'
  } else if (selectedMode === 'light') {
    return '#222'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#fff'
  } else {
    return '#222'
  }
}

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit'
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit'
  } else {
    return '#fff'
  }
}

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: color(),
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

const Suburblist = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [value, setValue] = useState<any>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rideData, setRideData] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [toEmail, setToEmail] = useState('')
  const [allCountryName, setAllCountryName] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [rowCount, setRowCount] = useState<number>(0)
  const [countryId, setCountryId] = useState('')

  const [allState, setAllState] = useState([])
  const [allData, setAllData] = useState('')
  const [stateValue, setStateValue] = useState([])
  const [country, setCountry] = useState([])
  const [state, setState] = useState([])

  const rowTotalCount = rideData?.length
  // const [stateName, setStateName] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')

  const [citySortName, setCitySortName] = useState('')

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    ApiClient.post(`/deletecity?Id=${selectedRowId}`) // Corrected line
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

  const handleEmail = (e: any) => {
    setToEmail(e.target.value)
  }

  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  const applyFilters = async (activeStatus: any, allCountryName: any, citySortName: any, allState: any) => {
    try {
      let res: any
      const queryParams: string[] = []
      if (allState) {
        queryParams.push(`StateId=${allState}`)
      }
      if (citySortName) {
        queryParams.push(`CityName=${citySortName}`)
      }
      if (allCountryName) {
        queryParams.push(`CountryId=${allCountryName}`)
      }
      if (activeStatus && activeStatus !== 'all') {
        // Only add Status if it's not 'all'
        const status = activeStatus === 'active' ? 1 : 0
        queryParams.push(`Status=${status}`)
      }
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`
        res = await ApiClient.post(`/getcities${queryString}`)
      }
      const totalRowCount = res.data.data

      setTotalCount(totalRowCount)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setRideData(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }

  function resetFilters() {
    setCitySortName(''), setActiveStatus('all'), setAllCountryName('')
    fetchData()
  }
  //   const fetchData = async () => {
  //     try {
  //       //debugger
  //       let res: any;
  //       const queryParams: string[] = [];
  //       if (allState) {
  //         queryParams.push(`StateId=${allState}`);
  //       }
  //       if (citySortName) {
  //         queryParams.push(`CityName=${citySortName}`);
  //       }
  //       if (allCountryName) {
  //         queryParams.push(`CountryId=${allCountryName}`);
  //       }
  //       if (activeStatus && activeStatus !== 'all') {
  //         // Only add Status if it's not 'all'
  //         const status = activeStatus === 'active' ? 1 : 0;
  //         queryParams.push(`Status=${status}`);
  //       }
  //       if (queryParams.length) {
  //         const queryString = `?${queryParams.join('&')}`;
  //         https://api.apurvarewardz.com/getcities?CityName=N&StateId=24&CountryId=95&Status=1
  //         res = await ApiClient.post(`/getcities${queryString}`);
  //       } else {
  //  res = await ApiClient.post(`/getcities`)
  //       }
  //       const totalRowCount = res.data.data
  //       setRowCount(totalRowCount)
  //       setAllData(res.data.data)
  //       const response = res.data.data
  //       const dataWithSerialNumber = response.map((row: any, index: number) => ({
  //         ...row,
  //         'S.No': index + 1
  //       }))
  //       setRideData(dataWithSerialNumber)
  //     } catch (err) {
  //       //console.error('Error fetching data:', err)
  //     }
  //   }
  const fetchData = async () => {
    try {
      const res = await ApiClient.post(`/getcities`)
      const totalRowCount = res.data.data
      setRowCount(totalRowCount)
      setAllData(res.data.data)
      const response = res.data.data
      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))
      setRideData(dataWithSerialNumber)
      setTotalCount(response.length)
      setIsTableLoading(false)
    } catch (err) {
      toast.error('Error fetching data:')
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, allCountryName, allState, citySortName, allState])

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

    const tableHeader = '<tr style="text-align: center;"><th>S.No</th><th>SuburbName</th><th>StateName</th></tr>'

    const tableRows = rideData
      .map((row: any, index: any) => {
        return `<tr>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Name}</td>
          <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.StateName}</td>
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
            <h3 class="size-content">Suburb</h3>
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
             <title>Suburb</title>
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

  const handleEdit = (id: string) => {
    const selectedRow = rideData.find((row: any) => row.Id === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
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
      field: 'City',
      headerName: 'City Name',
      flex: 0.3,
      renderCell: ({ row }: any) => (
        <Tooltip title={row.City}>
          <Typography sx={{ color: 'text.secondary' }}>{row.City}</Typography>
        </Tooltip>
      )
    },
    {
      field: 'StateName',
      headerName: 'State Name',
      flex: 0.3,
      renderCell: ({ row }: any) => (
        <Tooltip title={row.StateName}>
          <Typography sx={{ color: 'text.secondary' }}>{row.StateName}</Typography>
        </Tooltip>
      )
    },
    {
      field: 'CountryName',
      headerName: 'Country Name',
      flex: 0.3,
      renderCell: ({ row }: any) => (
        <Tooltip title={row.CountryName}>
          <Typography sx={{ color: 'text.secondary' }}>{row.CountryName}</Typography>
        </Tooltip>
      )
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 0.2,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Button
          sx={{
            padding: '5px 30px 5px 30px',
            borderRadius: '5px',
            width: '8px',
            cursor: 'initial',
            backgroundColor: row.Status == 1 ? '#dff7e9 !important' : row.Status == 0 ? '#f2f2f3 !important' : '',
            color: row.Status == 1 ? '#28c76f !important' : row.Status == 0 ? '#a8aaae !important' : '',
            fontWeight: '400',
            fontSize: row.Status == false ? '0.81em' : '0.81em'
          }}
        >
          {row.Status == 1 ? 'Active' : row.Status == 0 ? 'Inactive' : ''}
        </Button>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleEdit(row.Id)}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.Id)}>
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
          <title>City - Apurva</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              {/* <SuburbHeader
                stateValue={stateValue}
                setAllCountryName={setAllCountryName}
                setAllState={setAllState}
                countryId={countryId}
                country={country}
                //handleFilter={handleFilter}
                setAllData={setAllData}
                setCountryId={setCountryId}
                setSelectedRows={setSelectedRows}
                printData={printData}
                onFetchData={fetchData}
                citySortName={citySortName}
                setCityySortName={setCitySortName}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
              /> */}
              <DataGrid
                autoHeight
                pagination
                columns={columns}
                getRowId={row => row.Id}
                //loading={isTableLoading}
                rows={rideData}
                rowCount={rowTotalCount}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={e =>
                  setPaginationModel({
                    ...e
                  })
                }
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
          buttonOpenText=''
          open={editMode}
          onClose={handleCloseModal}
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
          <EditSuburbForm
            rowCount={rowCount}
            countryId={countryId}
            editId={selectedRowData?.Id}
            cityName={selectedRowData?.City}
            stateId={selectedRowData?.StateID}
            countryID={selectedRowData?.CountryID}
            editStatus={selectedRowData?.Status}
            onCloseModal={handleCloseModal}
            fetchData={fetchData}
            country={country}
            stateValue={stateValue}
          />
        </CustomModal>
      )}
    </>
  )
}
export default Suburblist
