import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Box, Button, CircularProgress } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-hot-toast'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import AppSink from 'src/commonExports/AppSink'

const RecentActivity = () => {
  const [employee, setEmployee] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [totalCount, setTotalCount] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = async () => {
    const query = `mutation my{
      deleteUserLog5AAB(input: {ID:${selectedRowId}}) {
        Browser
        CusId
        Device
        DeviceType
        ID
        IP
        LocationLang
        Location
        LocationLat
        LoggedInDateTime
        Status
        UserId
      }
    }
    `

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      await ApiClient.post(`${AppSink}`, { query }, { headers })
      toast.success('Deleted successfully')
      setModalOpenDelete(false)
      // fetchUserProfileData()
    } catch (error) {
      toast.error('Error deleting designation')
      console.error('Error deleting:', error)
    }
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const loginId = localStorage.getItem('adminLoginId')

  // const fetchUserProfileData = async () => {
  //   try {

  //     const query = `query MyQuery {
  //       listUserLog5AABS(filter: {UserId: {eq: "${loginId}"}}) {
  //         items {
  //           Browser
  //           CusId
  //           Device
  //           DeviceType
  //           ID
  //           IP
  //           Location
  //           LocationLang
  //           LocationLat
  //           LoggedInDateTime
  //           Status
  //           UserId
  //         }
  //       }
  //     }`

  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     }

  //     const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
  //     setEmployee(response.data.data.listUserLog5AABS.items)
  //     setTotalCount(response.data.data.listUserLog5AABS.items.length)
  //     setIsTableLoading(false)
  //     return response.data.data.listUserLog5AABS.items
  //   } catch (err) {
  //     setIsTableLoading(false)
  //     console.error('Error fetching data:', err)
  //   }
  // }

  const handleCompletedBulkDelete = async () => {
    try {
      const idsToDelete = selectedRows.join(',')
      const response: any = await ApiClient.delete(`/api.php?moduletype=Loginlog&apitype=bulkdelete&id=${idsToDelete}`)
      setSelectedRows([])
      // fetchUserProfileData()
      toast.success(response.data[0]?.status)
    } catch (error) {
      toast.error('Error during bulk delete')
    }
  }

  useEffect(() => {
    // fetchUserProfileData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel])

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      minWidth: 50,
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      sortable:false,
      filterable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.3,
      field: 'Browser',
      headerName: 'Browser',
      renderCell: ({ row }: any) => (
        <>
          <Box component='span' sx={{ mr: 2.5, display: 'flex', '& svg': { color: 'info.main' } }}>
            {row.Device === 'Windows' && <Icon icon='tabler:brand-windows' />}
            {row.Device === 'Windows Phone' && <Icon icon='icomoon-free:windows' />}
            {(row.Device === 'iOS' || row.Browser === 'Mac OS') && <Icon icon='iconoir:apple-mac' />}
            {row.Device === 'Android' && <Icon icon='devicon:android' />}
            {row.Device === 'Linux' && <Icon icon='logos:linux-tux' />}
          </Box>
          <Typography>
            {row.Browser} on {row.Device}
          </Typography>
        </>
      )
    },

    {
      flex: 0.3,
      field: 'DeviceType',
      headerName: 'Device',
      sortable:false,
      renderCell: ({ row }: any) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.DeviceType === 'Desktop' ? (
            <Icon fontSize='1rem' icon='cil:laptop' width={25} height={25} />
          ) : (
            <Icon fontSize='1rem' icon='clarity:mobile-solid' width={25} height={25} />
          )}
        </Typography>
      )
    },
    {
      flex: 0.3,
      field: 'Location',
      headerName: 'Location',
      renderCell: ({ row }: any) => {
        const getLocation = () => {
          
          const locationArray = row.Location.split(',')
          const lastIndex = locationArray.length - 1
          return locationArray[lastIndex].trim()
        }

        return (
          <Tooltip title={row.Location}>
            <Typography>{getLocation()}</Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.3,
      field: 'LoggedInDateTime',
      headerName: 'Recent Activities',
      sortable:false,
      renderCell: ({ row }: any) => {
        if (!row.LoggedInDateTime) {
          return <Typography sx={{ color: 'text.secondary' }}>No Date</Typography>
        }

        const dateTime = new Date(row.LoggedInDateTime)

        if (isNaN(dateTime.getTime())) {
          return <Typography sx={{ color: 'text.secondary' }}>Invalid Date</Typography>
        }
        const options: any = {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
        const formattedDate = dateTime.toLocaleString('en-US', options)

        return <Typography sx={{ color: 'text.secondary' }}>{formattedDate}</Typography>
      }
    },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      sortable: false,
      renderCell: ({ row }: any) => {
        if (!row.ID) {
          return null
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.ID)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const columns: GridColDef[] = [...defaultColumns]

  return (
    <>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
         
                <DataGrid
                  autoHeight
                  pagination
                  getRowId={(row: any) => row.ID}
                  loading={isTableLoading}
                  rows={employee}
                  columns={columns}
                  rowCount={totalCount}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10, 25, 50]}
                  paginationModel={paginationModel}
                  onPaginationModelChange={e => setPaginationModel({ ...e })}
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
        <p>Are you sure you want to delete?</p>

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

export default RecentActivity
