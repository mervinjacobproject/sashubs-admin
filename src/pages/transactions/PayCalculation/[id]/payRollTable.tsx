import React, { useEffect } from 'react'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import Card from '@mui/material/Card'
import { toast } from 'react-hot-toast'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Typography from '@mui/material/Typography'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Button, CardContent, CardHeader, Grid, MenuItem, SelectChangeEvent, Tooltip } from '@mui/material'

import { Box } from '@mui/system'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'

import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import { LexRuntime } from 'aws-sdk'

interface CellType {
  row: InvoiceType
}

const PayRollTable = ({ id }: any) => {
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [modalOpenRestore, setModalOpenRestore] = useState(false)
  const [employee, setEmployee] = useState<any>([])
  const [totalAmo, setTotalAmo] = useState('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [dropLocation, setDropLocation] = useState([])
  const [selectedRowId, setSelectedRowId] = useState('')
  const [rowId, setRowId] = useState('')

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const router = useRouter()

  const handleRestoreClick = () => {
    setModalOpenRestore(false)
    fetchData()
    setSelectedRows([])
    handleRouter()
    handleRowId()
  }

  const handleRowId = () => {
    const data = []
    let total = 0
    if (selectedRows.length > 0 && employee.length > 0) {
      for (let i = 0; i < selectedRows.length; i++) {
        const selectedEmployee = employee.find((emp: any) => emp.ID === selectedRows[i])
        if (selectedEmployee) {
          total += parseFloat(selectedEmployee.TaskAmountAud)
          const Amount = selectedEmployee.TaskAmountAud
          data.push(Amount)
        }
      }
      fetchPay(total.toFixed(2))
    }
  }

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const fetcDrop = () => {
    const query = `query MyQuery {
      listJobsNew5AABS {
        items {
          ID
          DropLocation
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
      setDropLocation(res.data.data.listJobsNew5AABS.items)
    })
  }

  const fetchData = () => {
    if (id) {
      const query = `
        query MyQuery {
            listPayCalculation5AABS(filter: {Subject: {eq: "Worker Charge"}, Employee: {eq: ${id}}, Status: {eq: true}}) {
                items {
                    AdditionChargeId
                    Date
                    Employee
                    ID
                    InvoiceId
                    JobId
                    PaidAmt
                    PayableAmt
                    Status
                    SubTotal
                    TaskAmountAud
                    Subject
                    TaskDescription
                    TaskGST
                    TaskExtraAmt
                    TaskQuty
                    TaskUnitPrice
                    TotGST
                    TotalAud
                }
            }
        }
        `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          const items = res.data.data.listPayCalculation5AABS.items
          setEmployee(items)
          setTotalAmo(res.data.data.listPayCalculation5AABS.items)
        })
        .catch(err => {
          console.error('Error fetching data:', err)
        })
    }
  }

  useEffect(() => {
    fetchData()
    fetcDrop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchPay = async (amo: any) => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${date}`

    const currentDate = new Date()

    const year1 = currentDate.getFullYear()
    const month1 = String(currentDate.getMonth() + 1).padStart(2, '0')
    const date1 = String(currentDate.getDate()).padStart(2, '0')
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const seconds = String(currentDate.getSeconds()).padStart(2, '0')

    async function getIpAddress() {
      try {
        const response = await fetch('https://api64.ipify.org?format=json')
        const data = await response.json()
        return data.ip
      } catch (error) {
        console.error('Error fetching IP address:', error)
        return null
      }
    }

    async function makeMutation() {
      const ipAddress = await getIpAddress()
      return ipAddress
    }

    const ipAddress = await makeMutation()
    const formattedDateTime = `${year1}-${month1}-${date1} ${hours}:${minutes}:${seconds}`
    const query = `mutation my {
        createPaySlip5AAB(input: {Date: "${formattedDate}", Draft: 1, DateTime: "${formattedDateTime}", Employee: ${id}, IP: "${ipAddress}", Status: false, TotalAmt: ${amo}}) {
          Date
          DateTime
          Draft
          Employee
          ID
          IP
          Status
          TotalAmt
        }
      }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      const items = res.data.data.createPaySlip5AAB.ID

      fetchPaySlip(items)
    } catch (error) {
      console.error('Error making mutation:', error)
    }
  }

  const fetchPaySlip = async (id: any) => {
    const data = []
    if (selectedRows.length > 0 && employee.length > 0) {
      for (let i = 0; i < selectedRows.length; i++) {
        const selectedEmployee = employee.find((emp: any) => emp.ID === selectedRows[i])
        if (selectedEmployee) {
          data.push(selectedEmployee)
        }
      }
    }

    if (data && data.length > 0) {
      for (const item of data) {
        await addAlldetails(item, id),
          await updateAlldetails(item)

      }
    }
  }

  const updateAlldetails = async (item: any) => {


    try {
      const {
        ID

      } = item

      const query = `mutation my {
  updatePayCalculation5AAB(input: { ID:${ID}, Status: true}) {
    AdditionChargeId
    Date
    Employee
    ID
    InvoiceId
    JobId
    PaidAmt
    PayableAmt
    Status
    SubTotal
    Subject
    TaskAmountAud
    TaskDescription
    TaskExtraAmt
    TaskGST
    TaskQuty
    TaskUnitPrice
    TotGST
    TotalAud
  }
}
`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
    } catch (err) {
      console.error(err)
    }
  }

  const addAlldetails = async (item: any, id: any) => {

    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')



    const currentDate = new Date()

    const year1 = currentDate.getFullYear()
    const month1 = String(currentDate.getMonth() + 1).padStart(2, '0')
    const date1 = String(currentDate.getDate()).padStart(2, '0')
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const seconds = String(currentDate.getSeconds()).padStart(2, '0')

    try {
      const {
        Employee,
        InvoiceId,
        JobId,
        PaidAmt,
        ID,
        PayableAmt,
        SubTotal,
        TaskAmountAud,
        TaskDescription,
        TaskExtraAmt,
        TaskGST,
        TaskQuty,
        TaskUnitPrice,
        TotalAud,
        TotGST
      } = item
      const formattedDateTime = `${year1}-${month1}-${date1} ${hours}:${minutes}:${seconds}`
      const query = `mutation my {
        createPaySlipDetails5AAB(input: {
          AdditionChargeId: 10,
          Date: "${formattedDateTime}",
          Employee: ${Employee},
          InvoiceId: ${InvoiceId},
          JobId: "${JobId}",
          PaidAmt: "${PaidAmt}",
          PayCalculationId: ${ID},
          PaySlipId: ${id},
          PayableAmt: "${PayableAmt}",
          Status: false,
          SubTotal: "${SubTotal}",
          Subject: "Worker Charge",
          TaskAmountAud: "${TaskAmountAud}",
          TaskDescription: "${TaskDescription}",
          TaskExtraAmt: "${TaskExtraAmt}",
          TaskGST: "${TaskGST}",
          TaskQuty: "${TaskQuty}",
          TaskUnitPrice: "${TaskUnitPrice}",
          TotAud: "${TotalAud}",
          TotGST: "${TotGST}"
        }) {
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
          TaskQuty
          TaskUnitPrice
          TotAud
          TotGST
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deletePayCalculation5AAB(input: {ID: ${selectedRowId}}) {
        Date
        AdditionChargeId
        Employee
        ID
        InvoiceId
        JobId
        PaidAmt
        PayableAmt
        Status
        SubTotal
        TaskAmountAud
        Subject
        TaskDescription
        TaskExtraAmt
        TaskGST
        TaskQuty
        TotGST
        TaskUnitPrice
        TotalAud
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



  const formatCurrency = (amount: any) =>
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      headerName: 'S.No',
      flex: 0.2,
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
      flex: 0.4,
      field: 'drop_location',
      headerName: 'Drop Location',
      renderCell: (params: any) => {
        const locationId = params.row.JobId
        const location: any = dropLocation.find((c: any) => c.ID == locationId)
        return location ? location.DropLocation : ''
      }
    },

    {
      flex: 0.3,
      field: 'invoiceId',
      headerName: 'Invoice Id',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.InvoiceId}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.TaskDescription}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'baserate',
      headerName: 'Base Rate',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}> {formatCurrency(Number(row.TaskUnitPrice))}</Typography>
    },

    {
      flex: 0.3,
      field: 'quantity',
      headerName: 'Quantity',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.TaskQuty}`}</Typography>
    },
    {
      flex: 0.3,
      field: 'extracharge',
      headerName: 'Extra Charge',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}> {formatCurrency(Number(row.TaskExtraAmt))}</Typography>
    },
    {
      flex: 0.3,
      field: 'totalamount',
      headerName: 'Total Amt',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{formatCurrency(Number(row.TaskAmountAud))}</Typography>
    }
  ]

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
      flex: 0.3,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDelete(row.ID)}>
              <Icon icon='ic:baseline-delete' />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]

  const handleRouter = () => {
    toast.success('Payslip Created successfully')
    router.push('/transactions/payslip/')
  }

  return (
    <>
      <DatePickerWrapper>
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Grid sx={{ display: 'flex', alignItems: 'start' }}></Grid>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={employee}
            getRowId={(row: any) => row.ID}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </DatePickerWrapper>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
        <Button
          variant='contained'
          sx={{
            cursor:'pointer',
            backgroundColor: '#776cff',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            }
          }}
          onClick={() => router.push('/transactions/paycalculation/')}
        >
          <Icon icon='ph:arrow-left-light' />
          Back
        </Button>
        <Button
          onClick={() => {
            setModalOpenRestore(true)
          }}
          variant='contained'
          disabled={selectedRows.length < 1}
          sx={{
          cursor:"pointer",
            backgroundColor: '#776cff',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            },
            height: '40px',
            width: '100px'
          }}
        >
          PaySlip
        </Button>

        <CustomModal
          open={modalOpenRestore}
          onClose={() => setModalOpenRestore(false)}
          onOpen={() => setModalOpenRestore(true)}
          buttonOpenText=''
          buttonText=''
        >
          <p>Are you sure you want to Payslip?</p>

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
              onClick={() => {
                setModalOpenRestore(false)
              }}
            >
              No
            </Button>
            <Button
              variant='contained'
              sx={{
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                }
              }}
              onClick={() => {
                handleRestoreClick()
              }}
            >
              Yes
            </Button>
          </div>
        </CustomModal>
      </div>
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
    </>
  )
}

export default PayRollTable
