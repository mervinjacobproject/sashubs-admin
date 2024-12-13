import React, { useEffect, useSyncExternalStore } from 'react'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Typography from '@mui/material/Typography'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Box, Button, Grid, Tooltip } from '@mui/material'
import { toast } from 'react-hot-toast'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import CustomChip from 'src/@core/components/mui/chip'
import PaySlipView from './paySlipViewPage'

const PaySlipTable = ({ paySlipData, printData, fetchData, id, data, totalAmt,setTotalAmt }: any) => {
  const [paySlip, setPaySlip] = useState<InvoiceType[]>([])
  const [selectedRows, setSelectedRows] = useState<any>([])


  const [modalOpenDeleteDetails, setModalOpenDeleteDetails] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')

  const [employee, setEmployee] = useState([])
  const [invoiceIds, setInvoiceIds] = useState([])
  const [jobIds, setJobIds] = useState([])

  const handleModalOpenDeleteDetails = () => setModalOpenDeleteDetails(true)
  const handleModalCloseDeleteDetails = () => setModalOpenDeleteDetails(false)

  useEffect(() => {
    if (paySlip && paySlip.length > 0) {
      let sum = 0
      paySlip.forEach((row: any) => {
        const taskAmount = parseFloat(row.TaskAmountAud) || 0
        sum += taskAmount
      })
      setTotalAmt(sum)
      // fetchPay(sum)
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paySlip])

  
  const fetchDataId = () => {
    if (id) {
      const query = `
      query MyQuery {
        listPaySlipDetails5AABS(filter: {PaySlipId: {eq: ${id}}}) {
          items {
            AdditionChargeId
            Date
            Employee
            ID
            InvoiceId
            JobId
            PaidAmt
            PayCalculationId
            PaySlipId
            PayableAmt
            Status
            SubTotal
            Subject
            TaskAmountAud
            TaskDescription
            TaskExtraAmt
            TaskGST
            TaskUnitPrice
            TotAud
            TotGST
            TaskQuty
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setEmployee(res.data.data.listPaySlipDetails5AABS.items)
          setPaySlip(res.data.data.listPaySlipDetails5AABS.items)
        })
        .catch(err => {
          console.error('Error fetching data:', err)
        })
    }
  }

  useEffect(() => {
    fetchDataId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    fetchInvoiceId()
    fetchJobId()
  }, [])

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    debugger
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  // const fetchPay = async (val: any) => {
  //   debugger
  //   const d = new Date()
  //   const year = d.getFullYear()
  //   const month = String(d.getMonth() + 1).padStart(2, '0')
  //   const date = String(d.getDate()).padStart(2, '0')

  //   const formattedDate = `${year}-${month}-${date}`

  //   const currentDate = new Date()

  //   const year1 = currentDate.getFullYear()
  //   const month1 = String(currentDate.getMonth() + 1).padStart(2, '0')
  //   const date1 = String(currentDate.getDate()).padStart(2, '0')
  //   const hours = String(currentDate.getHours()).padStart(2, '0')
  //   const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  //   const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  //   async function getIpAddress() {
  //     try {
  //       const response = await fetch('https://api64.ipify.org?format=json')
  //       const data = await response.json()
  //       return data.ip
  //     } catch (error) {
  //       console.error('Error fetching IP address:', error)
  //       return null
  //     }
  //   }

  //   async function makeMutation() {
  //     const ipAddress = await getIpAddress()
  //     return ipAddress
  //   }

  //   const ipAddress = await makeMutation()
  //   const formattedDateTime = `${year1}-${month1}-${date1} ${hours}:${minutes}:${seconds}`
  //   const query = `mutation my {
  //       createPaySlip5AAB(input: {Date: "${formattedDate}", Draft: 1, DateTime: "${formattedDateTime}", Employee: ${id}, IP: "${ipAddress}", Status: false, TotalAmt: ${val}}) {
  //         Date
  //         DateTime
  //         Draft
  //         Employee
  //         ID
  //         IP
  //         Status
  //         TotalAmt
  //       }
  //     }`

  //   const headers = {
  //     'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //     'Content-Type': 'application/json'
  //   }

  //   try {
  //     const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
  //     const items = res.data.data.createPaySlip5AAB.ID
  //   } catch (error) {
  //     console.error('Error making mutation:', error)
  //   }
  // }

  // useEffect(()=>{
  //   fetchPay()
  // },[])

  const router = useRouter()
  const handleDeleteConfirm = () => {

    const query = `mutation my {
      deletePaySlipDetails5AAB(input: {ID: ${selectedRowId}}) {
        AdditionChargeId
        Date
        Employee
        ID
        InvoiceId
        PayCalculationId
        JobId
        PaidAmt
        PaySlipId
        PayableAmt
        Status
        SubTotal
        Subject
        TaskAmountAud
        TaskDescription
        TaskExtraAmt
        TaskGST
        TaskUnitPrice
        TotAud
        TaskQuty
        TotGST
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchDataId()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        console.error('Error deleting designation:', err)
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const handleDeleteConfirmDetails = () => {
    setModalOpenDeleteDetails(false)
  }

  const handleCancelDeleteDetails = () => {
    setModalOpenDeleteDetails(false)
  }

  const fetchInvoiceId = async () => {
    const query = `query MyQuery {
      listJobInvoice5AABS {
        items {
          ID
          InvoiceId
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers }).then((res: any) => {
      setInvoiceIds(res.data.data.listJobInvoice5AABS.items)
    })
  }

  const fetchJobId = async () => {
    const query = `query MyQuery {
  listJobsNew5AABS {
    totalCount
    items {
      AdditionChargeId
      AdditionalChargePrice
      AdditionalChargeRate
      AssignTo
      CusReference
      CreatedDate
      Customer
      Description
      DateTime
      DropIng
      DropLat
      DropLocation
      EmpQty1
      FinalNetTotal
      EmpTotal
      ID
      IP
      JobNotes
      JobId
      JobStatus
      KM
      ModifiedDate
      NetTotal
      PassUp
      PickupDate
      PickupIng
      PickupLat
      PickupLocation
      PickupTime
      PriceCategory
      Status
      SubTotal
      Tax
      TaxId
    }
  }
}`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers }).then((res: any) => {
      setJobIds(res.data.data.listJobsNew5AABS.items)
    })
  }

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
      field: 'Date',
      headerName: 'Date',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.Date}`}</Typography>
    },
  

    {
      field: 'JobId',
      headerName: 'Job Id',
      flex: 0.2,
      renderCell: (params: any) => {
        const jobId = params.row.JobId;
        const job: any = jobIds.find((c: any) => c.ID == jobId);
    
        return (
          job ? (
            <CustomChip
              rounded
              size='small'
              skin='light'
              color='success'
              label={job.JobId}  
            />
          ) : ''
        );
      }
    },
    

    {
      field: 'InvoiceId',
      headerName: 'Invoice Id',
      flex: 0.4,
      renderCell: (params: any) => {
    
        const InvoiceId = params.row.InvoiceId
        const Invoice: any = invoiceIds.find((c: any) => c.ID == InvoiceId)
     
        return (
          Invoice ? (
            <CustomChip
              rounded
              size='small'
              skin='light'
              color='success'
              label={Invoice.InvoiceId}  
            />
          ) : ''
        );
      }
    },

    {
      flex: 0.3,
      field: 'TaskDescription',
      headerName: 'Description',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.TaskDescription}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'TaskUnitPrice',
      headerName: 'Base Rate',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{formatCurrency(Number(row.TaskUnitPrice))}</Typography>
    },

    {
      flex: 0.3,
      field: 'TaskQuty',
      headerName: 'Quantity',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.TaskQuty}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'TaskExtraAmt',
      headerName: 'Extra Charge',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{formatCurrency(Number(row.TaskExtraAmt))}</Typography>
    },
    {
      flex: 0.3,
      field: 'TaskAmountAud',
      headerName: 'Total Amount',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}> {formatCurrency(Number(row.TaskAmountAud))}</Typography>
    }
  ]

  const columns: any = [
    ...defaultColumns,
    {
      sortable: false,
      fixed: true,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: any) => (
        <>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDelete(row.ID)}>
              <Icon icon='ic:baseline-delete' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Print'>
            <IconButton onClick={() => printData(row.ID)}>
              <Icon icon='ion:print' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Send'>
            <IconButton>
              <Icon icon='icon-park-outline:send-email' />
            </IconButton>
          </Tooltip>

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
                  localStorage.getItem('selectedMode') === 'dark'
                    ? '#222'
                    : localStorage.getItem('selectedMode') === 'light'
                    ? '#222'
                    : localStorage.getItem('systemMode') === 'dark'
                    ? '#222'
                    : '#222'
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
  ]

  return (
    <>
      <DatePickerWrapper>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Grid sx={{ display: 'flex', alignItems: 'start', padding: '10px' }}>
            <CustomModal
              open={modalOpenDeleteDetails}
              onClose={handleModalCloseDeleteDetails}
              onOpen={handleModalOpenDeleteDetails}
              buttonText=''
              buttonOpenText=''
            >
              <p>Are you sure you want to delete?</p>

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
                  onClick={handleCancelDeleteDetails}
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
                  onClick={handleDeleteConfirmDetails}
                >
                  {' '}
                  <Icon icon='ic:baseline-delete' />
                  Delete
                </Button>
              </div>
            </CustomModal>
          </Grid>
        </Box>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            getRowId={(row: any) => row.ID}
            rows={employee}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </DatePickerWrapper>
      <div style={{ padding: '10px' }}>
        <Button
          variant='contained'
          sx={{
            backgroundColor: '#776cff',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            }
          }}
          onClick={() => router.push('/transactions/payslip/')}
        >
          <Icon icon='ph:arrow-left-light' />
          Back
        </Button>
      </div>

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Card sx={{ padding: '20px', width: '300px', textAlign: 'start', border: '1px solid #cacaca' }}>
          <Typography> Total Amount: {formatCurrency(Number(totalAmt))}</Typography>
        </Card>
      </Grid>
      {/* <PaySlipView/> */}
    </>
  )
}

export default PaySlipTable
