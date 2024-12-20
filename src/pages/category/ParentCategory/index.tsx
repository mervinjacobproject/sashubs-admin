import { useState, useEffect } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer1'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import ParentForm from './parentform'
import ParentTypeHeader from './tableHeader'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'

const ParentCategory = () => {
  const [totalCount, setTotalCount] = useState(0)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [dataList, setDatalist] = useState([])
  const [activeStatus, setActiveStatus] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [statusFilter, setstatusFilter] = useState('')
  const [ParentCategory, setParentCategory] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const deletItem = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const renderClient = (row: any) => {
    if (row?.Image && row?.Image[0].length != 0) {
      return <CustomAvatar src={` `} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(row.Category || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const handleCancelDelete = () => {
    handleModalCloseDelete()
  }

  const handleDeleteConfirm = () => {
    const endPoint = 'api/categories/deleteparentcategory' as string
    ApiLoginClient.delete(endPoint, {
      data: {
        CId: [Number(selectedRowId)]
      }
    } as any)
      .then((res: any) => {
        fetchData()
        handleModalCloseDelete()
        toast.success(`Successfully deleted the Parent Category:!!`)
      })
      .catch((err: any) => {
        console.log('Error occurred while deleting vehicle type:', err)
      })
  }

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      sortable: false,
      filterable: false,
      maxWidth: 85,
      headerName: 'ID',
      flex: 0.1,
      editable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.5,
      field: 'bo',
      headerName: 'Parent Category Name',
      sortable: false,

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
            {renderClient(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Tooltip title={`${row.Category}`}>
                <Typography>{row.Category}</Typography>
              </Tooltip>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.3,
      field: 'Display Order',
      headerName: 'Display Order',
      sortable: false,

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
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100px' }}>
              <Typography>{row.DisplayOrder}</Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return !row.Status ? (
          <CustomChip rounded size='small' skin='light' color='primary' label='Inactive' />
        ) : (
          <CustomChip rounded size='small' skin='light' color='success' label='Active' />
        )
      }
    }
  ]

  function applyFilters(status: any, PCName: any) {
    setActiveStatus(status != 2 ? status : '')
    setstatusFilter(status == 2 ? '' : `${status == 1 ? true : false}`)
    setParentCategory(PCName)
  }

  const resetfilter = () => {
    setActiveStatus('')
    setParentCategory('')
    setstatusFilter('')
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    // setIsTableLoading(true)
    const apiParams: any = {
      Category: ParentCategory,
      Status: statusFilter
    }
    const paramString = new URLSearchParams(apiParams).toString()
    const endpoint = 'api/categories/parentcategoryread'
    ApiLoginClient.get(endpoint + '?' + paramString)
      .then(res => {
        const HideSelect = res?.data
        setDatalist(HideSelect)
        const countVal = HideSelect.length
        setTotalCount(countVal)
        // setIsTableLoading(false)
      })
      .catch(err => {
        console.log('something went wrong', err)
        if (err.response?.data.statusCode == 404) {
          toast.error(err.response?.data.message)
          setDatalist([])
          // setIsTableLoading(false)
        }
        setDatalist([])
      })
  }
  const handleOpenDrawer = () => {
    return true
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      filterable: false,
      headerName: 'Actions',
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <DrawerComponent width='530px' anchor='right' onOpen={handleOpenDrawer} buttonLabel='Edit'>
              <ParentForm fetchData={fetchData} rowData={row} chargeList={dataList} />
            </DrawerComponent>
          </Tooltip>

          <Tooltip title='Delete '>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => deletItem(row.row.CId)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <Card>
        <ParentTypeHeader fetchData={fetchData} applyFilters={applyFilters} resetFilters={resetfilter} />

        <DataGrid
          autoHeight
          pagination
          getRowId={(row: any) => row.CId}
          rowHeight={62}
          rows={dataList}
          columns={columns}
          loading={isTableLoading}
          rowCount={totalCount}
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          pageSizeOptions={[10, 25, 50]}
          onPaginationModelChange={e => setPaginationModel({ ...e })}
        />
      </Card>

      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <Typography sx={{ padding: '5px', marginBottom: 5 }} variant='h5'>
          Are you sure to delete ?
        </Typography>

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
export default ParentCategory
