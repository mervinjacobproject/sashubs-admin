import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Button } from '@mui/material'
import { toast } from 'react-hot-toast'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import DeletedEmployeeHeader from 'src/pages/apps/invoice/list/DeletedEmployeeHeader'
import Head from 'next/head'
import AppSink from 'src/commonExports/AppSink'
import CustomChip from 'src/@core/components/mui/chip'

const DeletedEmployeeDetails = () => {
  const [employe, setEmploye] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const rowDelete = () => {
    const query = `query MyQuery {
  listUsers5AABS(filter: {UserId: {eq: "${selectedRowId}"}}) {
    items {
      ID
      UserId
    }
  }
}`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
      setDeleteId(res.data.data.listUsers5AABS.items[0]?.ID)
    })
  }

  const rowDeleteId = () => {
    const query = `
    mutation my {
      deleteUsers5AAB(input: {ID: ${deleteId}}) {
        Date
        FirstName
        ID
        LastName
        Password
        ProfileImage
        RoleId
        Status
        UserId
        UserName
        UserType
      }
    } 
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
      // console.log(res.data)
    })
  }

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
    rowDelete()
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteDriver5AAB(input: {DID: ${selectedRowId}}) {
        Address1
        Address2
        AppAccess
        Country
        DID
        DOB
        DOJ
        DOT
        Date
        Deleted
        Designation
        DocumentExpiryDate
        DocumentName
        DriverID
        Email
        EmpGroup
        FirstName
        IP
        InsertedBy
        LandLine
        LastName
        License
        LicenseNo
        Mobile
        Password
        Photo
        PostCode
        SalaryDocuments
        SalaryFrequency
        SalaryFromKM
        SalaryPerHour
        SalaryPerSQM
        SalaryPerWeight
        State
        Status
        SubURB
        Title
        UpdatedAt
        UpdatedBy
        UserName
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        rowDeleteId()
        fetchData()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting employe')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const fetchData = () => {
    const query = `query MyQuery {
      listDriver5AABS(filter: {Deleted: {eq: true}}) {
        items {
          DID
          Address1
          Address2
          AppAccess
          Country
          DOB
          DOJ
          DOT
          Date
          Deleted
          Designation
          DocumentExpiryDate
          DocumentName
          DriverID
          Email
          EmpGroup
          FirstName
          IP
          InsertedBy
          LandLine
          LastName
          Mobile
          License
          LicenseNo
          Password
          Photo
          PostCode
          SalaryDocuments
          SalaryFrequency
          SalaryFromKM
          SalaryPerHour
          SalaryPerSQM
          SalaryPerWeight
          State
          Status
          SubURB
          Title
          UpdatedAt
          UpdatedBy
          UserName
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        setEmploye(res.data.data.listDriver5AABS.items)
        setTotalCount(res.data.data.listDriver5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch((err: any) => {
        setIsTableLoading(false)
        console.error('Error fetching data:', err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRestore = async () => {
    try {
      const deletePromises = selectedRows.map(async rowId => {
        const selectedRow: any = employe.find((row: any) => row.DID === rowId)
        if (selectedRow) {
          const query = `mutation my {
            updateDriver5AAB(input: {DID: ${selectedRow.DID}, Deleted: false}) {
              DID
              Deleted
            }
          }`
          const headers = {
            'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
            'Content-Type': 'application/json'
          }
          ApiClient.post(`${AppSink}`, { query }, { headers })
          fetchData()
        }
      })
      await Promise.all(deletePromises)
      setSelectedRows([])
      toast.success('Restore successful!')
    } catch (error) {
      toast.error('Error during Restore')
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
      minWidth: 50,
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      sortable: false,
      filterable: false,
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
      field: 'FirstName',
      headerName: 'Employee',
      flex: 0.3,
      renderCell: ({ row }: any) => (
        <Tooltip title={`${row.FirstName} ${row.LastName}`}>
          <Typography>{`${row.FirstName.charAt(0).toUpperCase() + row.FirstName.slice(1)} ${row.LastName}`}</Typography>
        </Tooltip>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.DID)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <Head>
        <title>Deleted Employee Details - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <DeletedEmployeeHeader
                handleRestore={handleRestore}
                selectedRows={selectedRows}
              />
              <DataGrid
                autoHeight
                pagination
                rows={employe}
                getRowId={row => row.DID}
                loading={isTableLoading}
                rowCount={totalCount}
                columns={columns}
                checkboxSelection
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
            color: getColor(),
            fontSize: '14px'
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

export default DeletedEmployeeDetails
