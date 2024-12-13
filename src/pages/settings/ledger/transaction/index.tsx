import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import toast from 'react-hot-toast'
import 'jspdf-autotable'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import axios from 'axios'
import AppSink from 'src/commonExports/AppSink'

const renderName = (row: any) => {
  if (row.photo) {
    return <CustomAvatar src={row.photo} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {`${row.FirstName.charAt(0).toUpperCase()}`}
      </CustomAvatar>
    )
  }
}

const defaultColumns: any = [
  {
    field: 'Sl.no',
    minWidth: 50,
    headerName: 'S.No',
    flex: 0.1,
    editable: false,
    filterable: false,
    sortable: false,
    renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.3,
    field: 'DriverID',
    headerName: 'Employee ID',
    renderCell: ({ row }: any) => (
      <CustomChip rounded size='small' skin='light' color={'success'} label={row.DriverID} />
    )
  },
  {
    flex: 0.3,
    field: 'FirstName',
    headerName: 'Employee',
    renderCell: ({ row }: any) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gridTemplateColumns: '1fr 1fr',
            justifyItems: 'center'
          }}
        >
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={`${row.FirstName}${row.LastName}`}>
              <Typography>
                {`${row.FirstName.charAt(0).toUpperCase() + row.FirstName?.slice(1)}
             ${row.LastName}`}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.3,

    field: 'Email',
    headerName: 'Email',
    renderCell: ({ row }: any) => (
      <Tooltip title={` ${row.Email}`}>
        <span>{row.Email}</span>
      </Tooltip>
    )
  },
  {
    flex: 0.3,
    field: 'Mobile',
    headerName: 'Mobile',
    renderCell: ({ row }: any) => (
      <Tooltip title={` ${row.Mobile}`}>
        <span>{row.Mobile}</span>
      </Tooltip>
    )
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.3,

    renderCell: ({ row }: any) => (
      <Button
        sx={{
          padding: '5px 30px 5px 30px',
          borderRadius: '3px',
          width: '8px',
          cursor: 'initial',
          backgroundColor:
            row.Status === true ? '#dff7e9 !important' : row.Status === false ? '#f2f2f3 !important' : '',
          color: row.Status === true ? '#28c76f !important' : row.Status === false ? '#a8aaae !important' : '',
          fontWeight: '400',
          fontSize: row.Status === false ? '0.81em' : '0.81em'
        }}
      >
        {row.Status === true ? 'ACTIVE' : row.Status === false ? 'INACTIVE' : ''}
      </Button>
    )
  }
]

const Transaction = () => {
  const [value, setValue] = useState<string>('')
  const [employee, setEmployee] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [displayemployee, setDisplayemployee] = useState([])
  const [toEmail, setToEmail] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [employeeList,setEmployeeList] = useState([])
  const [employeeID,setEmployeeID]= useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [mobileNo,setMobileNo]=useState('')
  const [filterMail,setFilterMail]=useState('')
  const [deleteId,setDeleteId] = useState('')
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const printData = async () => {
    try {
      const jsonData = JSON.stringify(
        employee.map((item: any) => ({
          EmployeeId: item.driverid,
          Employee: item.FirstName + ' ' + item.LastName,
          Email: item.Email,
          Mobile: item.Mobile,
          Status: item.Status === true ? 'Active' : item.Status === false ? 'Inactive' : item.Status
        }))
      )

      const response = await fetch(`${PrintUrl}/EmpDet/Get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })

      if (response.ok) {
        const data = await response.blob()
        const url = window.URL.createObjectURL(data)
        window.open(url)
        setTimeout(() => {
          window.open(url)
        }, 1000)
      } else {
        console.error('Error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
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

  const columns: any = [
    ...defaultColumns,
    {
      flex: 0.2,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      filterable: false,
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='EDit'>
            <EmployeeStepper fetchData={fetchData} editid={row.DID} />
          </DrawerComponent> */}

          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} >
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
          <title>Transaction - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <TableHeader 
                toEmail={toEmail}
                employeeList={employeeList}
                setToEmail={setToEmail}
                printData={printData}
                value={value}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                setEmployeeID={setEmployeeID}
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                setMobileNo={setMobileNo}
                mobileNo={mobileNo}
                filterMail={filterMail}
                setFilterMail={setFilterMail}
              />
              <DataGrid
                autoHeight
                pagination
                rows={employee}
                getRowId={row => row.DID}
                loading={isTableLoading}
                columns={columns}
                rowCount={totalCount}
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
            
          >
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default Transaction
