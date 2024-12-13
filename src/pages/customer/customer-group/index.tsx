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
import 'jspdf-autotable'
import { Typography } from '@mui/material'
import CutomerGroupEditForm from './editCustomerForm'
import CustomergroupHeader from 'src/pages/apps/invoice/list/CustomergroupHeader'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'

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

const Customergroup = () => {
  const [customergroupname, setCustomergroupname] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [editMode, setEditMode] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [allCountryName, setAllCountryName] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [allCountry, setAllCountry] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [rowCount, setRowCount] = useState<number>(0)
  const [designation, setDesignation] = useState([])

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  // const handleDeleteConfirm = () => {
  //   const query = `
  //   mutation my {
  //     updateCustomerGroup5AAB(input: {ID: ${selectedRowId}, Deleted: true}) {
  //       GroupName
  //       ID
  //     }
  //   }
  //   `
  //   const headers = {
  //     'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //     'Content-Type': 'application/json'
  //   }
  //   ApiClient.post(`${AppSink}`, { query }, { headers })
  //     .then((res: any) => {
  //       toast.success('Deleted successfully')
  //       fetchData()
  //       fetchCountryName()
  //       setModalOpenDelete(false)
  //     })
  //     .catch((err: any) => {
  //       toast.error('Error deleting designation')
  //     })
  // }
  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  // useEffect(() => {
  //   fetchCountryName()
  // }, [])

  //   const fetchCountryName = async () => {
  //     const query = `query MyQuery {
  //   listCustomerGroup5AABS(filter: {Deleted: {ne: true}}) {
  //     items {
  //       GroupName
  //       Deleted
  //       ID
  //       LastModified
  //       Status
  //     }
  //   }
  // }`
  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     }
  //     try {
  //       const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
  //       setAllCountry(res.data.data.listCustomerGroup5AABS.items)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   const fetchData = async () => {
  //     let filterString = `{Deleted: {ne: true}`
  //     if (activeStatus === 'active') {
  //       filterString += `, Status: {eq: true}`
  //     } else if (activeStatus === 'inactive') {
  //       filterString += `, Status: {eq: false}`
  //     } else if (activeStatus === 'all') {
  //       filterString += `,`
  //     }
  //     if (allCountryName) {
  //       filterString += `, ID: {eq: ${allCountryName}}`
  //     }
  //     filterString += '}'
  //     const query = `
  //     query MyQuery {
  //       listCustomerGroup5AABS(filter: ${filterString} ) {
  //         items {
  //           GroupName
  //           ID
  //           Status
  //         }
  //       }
  //     }
  //     `
  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     }
  //     ApiClient.post(`${AppSink}`, { query }, { headers })
  //       .then(res => {
  //         setCustomergroupname(res.data.data.listCustomerGroup5AABS.items)
  //         setTotalCount(res.data.data.listCustomerGroup5AABS.items.length)
  //         setIsTableLoading(false)
  //       })
  //       .catch(error => {
  //         setIsTableLoading(false)
  //       })
  //   }

  // const printData = () => {
  //   const imageSource = '/images/icons/project-icons/sev 1.png'

  //   const fromAddress = `
  //     <div class="col-6">
  //       <strong>From Address:</strong><br>
  //       Khushdeep Singh<br>
  //       91, MAREEBA WAY, CRAIGIEBURN<br>
  //       VICTORIA - 3064<br>
  //       Australia<br>
  //       Email: khushdeepsingh14721@gmail.com<br>
  //       Phone: 0448459767<br>
  //     </div>
  //   `

  //   const tableHeader = '<tr style="text-align: center;"><th>S.No</th><th>GroupName</th><th>Status</th></tr>'

  //   const tableRows = customergroupname
  //     .map((row: any, index: any) => {
  //       return `<tr>
  //         <td style="text-align: center; border-bottom: 1px solid #ddd;">${index + 1}</td>
  //         <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.GroupName}</td>
  //         <td style="text-align: center; border-bottom: 1px solid #ddd;">${row.Status === true ? 'ACTIVE' : row.Status === false ? 'INACTIVE' : ''}</td>
  //       </tr>`
  //     })
  //     .join('')

  //   const printableData = `
  //     <style>
  //       .custom-table {
  //         width: 100%;
  //         margin-top: 20px;
  //       }
  //       .custom-table th, .custom-table td {
  //         padding: 19px;
  //         text-align: center;
  //       }
  //       .custom-table th {
  //         border-bottom: 1px solid #ddd;
  //       }
  //       .address-container {
  //         padding-top: 20px;
  //         display: flex;
  //         justify-content: space-between;
  //       }
  //       .address-head {
  //         padding-bottom: 20px;
  //         padding-top: 20px;
  //       }
  //       .size-content {
  //         display: flex;
  //         justify-content: start;
  //       }
  //       .address-head {
  //         padding-bottom: 30px;
  //         padding-top: 20px;
  //       }
  //     </style>

  //     <div class="row">
  //       <div class="address-container">
  //         <div>
  //           <img src="${imageSource}" alt="Cross Image" />
  //           <h3 class="size-content">Customer Group</h3>
  //         </div>
  //         <div>${fromAddress}</div>
  //       </div>
  //     </div>

  //     <table class="custom-table">${tableHeader}${tableRows}</table>
  //   `

  //   // Print option
  //   const printWindow = window.open('', '_blank')

  //   if (printWindow) {
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //            <title>Customer Group</title>
  //           <!-- Add Bootstrap CDN link here if not already included in your project -->
  //         </head>
  //         <body>
  //           <div id="pdf-container">${printableData}</div>
  //         </body>
  //       </html>
  //     `)
  //     printWindow.document.close()
  //     printWindow.print()
  //   } else {
  //     console.error('Unable to open a new window. Please check your popup blocker settings.')
  //   }
  // }

  const handleEdit = (id: any) => {
    const selectedRow = customergroupname.find((row: any) => row.ID === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }

  const fetchData = async () => {
    try {
      debugger
      const res = await ApiClient.get(`https://api.apurvarewardz.com/getsubcategory`)
      const totalRowCount = res.data[0].Total_row_count
      setRowCount(totalRowCount)
      const response = res.data[0].state_array

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))
      setDesignation(dataWithSerialNumber)
    } catch (err) {
     // console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      field: 'GroupName',
      headerName: 'Group Name',
      flex: 0.3,
      renderCell: ({ row }: any) => <div>{row.GroupName.charAt(0).toUpperCase() + row.GroupName.slice(1)}</div>
    },
    {
      field: 'status',
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
              row.Status === true ? '#dff7e9 !important' : row.Status === false ? '#f2f2f3 !important' : '',
            color: row.Status === true ? '#28c76f !important' : row.Status === false ? '#a8aaae !important' : '',
            fontWeight: '400',
            fontSize: row.Status === false ? '0.81em' : '0.81em'
          }}
        >
          {row.Status === true ? 'Active' : row.Status === false ? 'Inactive' : ''}
        </Button>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setShowMessage(false)
                handleEdit(row.ID)
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.ID)}>
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
          <title>Customer Group - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <CustomergroupHeader
                customergroupname={customergroupname}
                allCountry={allCountry}
                setAllCountryName={setAllCountryName}
                // printData={printData}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                onFetchData={fetchData}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
              />
              <DataGrid
                autoHeight
                pagination
                rows={customergroupname}
                columns={columns}
                loading={isTableLoading}
                rowCount={totalCount}
                getRowId={row => row.ID}
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
            // onClick={handleDeleteConfirm}
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
              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <CutomerGroupEditForm
            editid={selectedRowData?.ID}
            employeegroupName={selectedRowData?.groupname}
            editStatus={selectedRowData?.status}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
            customergroupname={customergroupname}
          />
        </CustomModal>
      )}
    </>
  )
}

export default Customergroup
