import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, IconButton,Tooltip, Typography } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import ApprovalFormDetails from './approvalformdetails'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import AppSink from 'src/commonExports/AppSink'

export interface JobApprovalInfoMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
}

interface jobApprovalProps {
  ref: any
  editId: number
  handleNext: () => void
  editnotes: any
  customerlist:any
  cusJobId: any
}

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

const JobApprovalStatus: React.FC<jobApprovalProps> = forwardRef<JobApprovalInfoMethods, jobApprovalProps>(
  ({ handleNext, customerlist }, ref) => {

    const router = useRouter()
    const { id: routerId } = router.query
    const [ApprovalStatus, setApprovalStatus] = useState<any>([])
    const [totalCount, setTotalCount] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
    const [selectedRowId, setSelectedRowId] = useState('')
    const [isTableLoading, setIsTableLoading] = useState(true)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

    const handleModalCloseDelete = () => setModalOpenDelete(false)
    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalOpen = () => setModalOpen(true)
    const handleModalClose = () => setModalOpen(false)

    const handleDelete = (id: string) => {
      handleModalOpenDelete()
      setSelectedRowId(id)
    }

    const handleDeleteConfirm = async() => {
      const query = `mutation my {
        deleteJobApproval5AAB(input: {ID: ${selectedRowId}}) {
          Action
          ActionDate
          ActionMessage
          CustomerId
          ID
          JobId
          RequestDate
          RequestMessage
        }
      }`
  
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };
  
    await  ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          toast.success('Deleted successfully')
          fetchData()
          setModalOpenDelete(false)
        })
        .catch((err: any) => {
          toast.error('Error deleting Approval Message')
        })
    }

    const handleCancelDelete = () => {
      setModalOpenDelete(false)
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
      }
    }))

    useEffect(() => {
      if (selectedRowData) {
        setValue('request_date', selectedRowData.request_date || '')
        setValue('action', selectedRowData.action || '')
        setValue('action_date', selectedRowData.action_date || '')
        setValue('actionmessage', selectedRowData.actionmessage || '')
        setValue('requestmessage', selectedRowData.requestmessage || '')

        const status = selectedRowData.action === 'Approval' ? 'Approval' : 'Denied'
        setValue('status', status)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowData])

    const fetchData = () => {
      setIsTableLoading(true);
      const query = `
      query MyQuery {
        listJobApproval5AABS(filter: {JobId: {eq:${routerId}}}) {
          items {
            Action
            ActionDate
            ActionMessage
            CustomerId
            ID
            JobId
            RequestDate
            RequestMessage
          }
        }
      }`

      const headers = {
        'x-api-key': ' da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setIsTableLoading(false);
          const items = res.data.data.listJobApproval5AABS.items
          setApprovalStatus(items)
          setTotalCount(res.data.data.listJobApproval5AABS.items.length)
          setIsTableLoading(false)
        })
        .catch(err => {
          setIsTableLoading(false);
          console.error('something went wrong', err)
        })
    }

    useEffect(() => {
      fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { trigger, setValue, } = useForm()

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
    const defaultColumns: GridColDef[] = [
      {
        field: 'Sl.no',
        flex: 0.2,
        headerName: 'S.No',
        sortable: false,
        renderCell: (params: any) =>
          params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
      },
      {
        flex: 0.3,
        field: 'RequestDate',
        headerName: 'Request Date'
      },
      {
        flex: 0.3,
        field: 'ActionDate',
        headerName: 'Action Date'
      },
      {
        flex: 0.3,
        field: 'ActionMessage',
        headerName: 'Message'
      },
      {
        field: 'action',
        headerName: 'Customer Action',
        flex: 0.3,
        renderCell: ({ row }: any) => (
          <Button
            sx={{
              padding: '5px 10px 5px 10px',
              borderRadius: '3px',
              backgroundColor:
                row.Action === '1' ? '#dff7e9 !important' : row.Action === '0' ? '#f2f2f3 !important' : '',
              color:
                row.Action === '1' ? '#28c76f !important' : row.Action === '0' ? '#a8aaae !important' : '',
              fontWeight: '500',
              fontSize: row.Action === '0' ? '0.81em' : '0.81em'
            }}
          >
            {row.Action === '1' ? 'Approval' : row.Action === '0' ? 'Denied' : ''}
          </Button>
        )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.2,
        renderCell: ({ row }: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.ID)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>

            <CustomModal
              open={modalOpenDelete}
              onClose={handleModalCloseDelete}
              onOpen={handleModalOpenDelete}
              buttonText=''
              buttonOpenText=''
            >
              <Typography sx={{ color: getColor() }}>Are you sure you want to delete?</Typography>
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
          </Box>
        )
      }
    ]

    const columns: GridColDef[] = [...defaultColumns]

    return (
      <div>
        <Button
          type='submit'
          variant='contained'
          sx={{
            bottom: '10px',
            color: '#fff',
            '&:hover': {
              background: '#776cff'
            }
          }}
          onClick={handleModalOpen}
        >
          Request Approval
        </Button>

        <div style={{ height: '300px', overflow: 'auto' }}>
          <style>
            {`
      /* WebKit browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 2px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #776cff;
      }
    `}
          </style>

           <DataGrid
            columns={columns}
            autoHeight
            pagination
            disableRowSelectionOnClick
            loading={isTableLoading}
            getRowId={row => row.ID}
            paginationModel={paginationModel}
            rows={ApprovalStatus}
            pageSizeOptions={[10, 25]}
            rowCount={totalCount}
            onPaginationModelChange={e =>
              setPaginationModel({
                ...e
              })
            }
          />
        </div>
       

        <CustomModal
          open={modalOpen}
          onClose={handleModalClose}
          onOpen={handleModalOpen}
          buttonOpenText='Add new'
          buttonText=''
        >
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'start', gap: '10px' }}>
            <p style={{ color: getColor(), margin: '0px' }}>[esc]</p>
            <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleModalClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
          </div>
          <ApprovalFormDetails
            customerlist={customerlist}
            onFetchData={fetchData}
            onClose={handleModalClose}
            routerId={routerId}
          />
        </CustomModal>
      </div>
    )
  }
)

export default JobApprovalStatus
