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
import { Button } from '@mui/material'
import { toast } from 'react-hot-toast'
import DeletedDesignationHeader from 'src/pages/apps/invoice/list/DeletedDesignationHeader'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Head from 'next/head'
import AppSink from 'src/commonExports/AppSink'

const DeletedEmployeeDesignation = () => {
  const [designation, setDesignation] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteEmployeeCategory5AAB(input: {ID: ${selectedRowId}}) {
        Deleted
        Designation
        ID
        IP
        LastModified
        LastModifier
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

  const fetchData = () => {
    const query = `query MyQuery {
      listEmployeeCategory5AABS(filter: {Deleted: {eq: true}}) {
        items {
          Deleted
          Designation
          ID
          IP
          LastModified
          LastModifier
          Status
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        setDesignation(res.data.data.listEmployeeCategory5AABS.items)
        setTotalCount(res.data.data.listEmployeeCategory5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch((err: any) => {
        setIsTableLoading(false)
        console.error(err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRestore = async () => {
    try {
      const deletePromises = selectedRows.map(async rowId => {
        const selectedRow: any = designation.find((row: any) => row.ID === rowId)
        if (selectedRow) {
          const query = `mutation my {
            updateEmployeeCategory5AAB(input: {ID: ${selectedRow.ID}, Deleted: false}) {
              Deleted
              Designation
              ID
              IP
              LastModified
              LastModifier
              Status
            }
          }`
          const headers = {
            'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
            'Content-Type': 'application/json'
          }
          await ApiClient.post(`${AppSink}`, { query }, { headers })
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
      headerName: 'S.No',
      flex: 0.3,
      editable: false,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'Designation',
      headerName: 'Group Name',
      flex: 0.3
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      <Head>
        <title>Deleted Designation - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <DeletedDesignationHeader
                handleRestore={handleRestore}
                selectedRows={selectedRows}
              />
              <DataGrid
                autoHeight
                pagination
                rows={designation}
                getRowId={row => row.ID}
                columns={columns}
                rowCount={totalCount}
                checkboxSelection
                loading={isTableLoading}
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
            color:
              getColor(),
            fontSize: '14px'
          }}
        >
          Are you sure you want to delete?
        </p>
        <div
          className='delete-popup'
          style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
        >
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

export default DeletedEmployeeDesignation
