import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { Box, IconButton, Tooltip } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { toast } from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'

export interface JobtaskInfoMethods {
  childMethod: (id: any) => void
}
interface jobtaskProps {
  ref: any
  editId: number
  handleNext: () => void
  setEditId: any
}

const InvoiceTask: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(({ handleNext }, ref) => {
  const router = useRouter()
  const { id: routerId } = router.query
  const quantityRef = useRef<any>(null)
  const perRatesRef = useRef<any>(null)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [gstAmount, setGstAmount] = useState(0)
  const [invoiceTask, setInvoiceTask] = useState<any>([])
  const [netTotal, setNetTotal] = useState(0)
  const [totalTaskAmount, setTotalTaskAmount] = useState<any>(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
        deleteJobNewTask5AAB(input: {ID:${selectedRowId}}) {
          Amount
          Description
          ID
          JId
          JobId
          Passup
          PassupRate
          PerRate
          PriceCategory
          Qty
          Updated
          TotalRate
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

  const { control, handleSubmit, trigger, setValue, reset } = useForm()

  const calculateTotalRate = () => {
    const qty = quantityRef.current ? parseFloat(quantityRef.current.value) : NaN
    const rates = perRatesRef.current ? parseFloat(perRatesRef.current.value) : NaN

    if (!isNaN(qty) && !isNaN(rates) && rates !== 0) {
      const totalRate = qty * rates
      setValue('task_totamount', totalRate.toFixed(2))
    } else {
      setValue('task_totamount', '')
    }
  }

  const fetchData = async () => {
    if (routerId && routerId !== 'new') {
      try {
        const query = `
          query MyQuery {
            listJobNewTask5AABS(filter: {JId: {eq:${routerId}}}) {
              items {
                Amount
                Description
                ID
                JId
                JobId
                Passup
                PassupRate
                PerRate
                PriceCategory
                Qty
                TotalRate
                Updated
              }
            }
          }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        const items = res.data.data.listJobNewTask5AABS.items
        const calculatedTotal = items.reduce((total: any, item: any) => total + parseFloat(item.TotalRate), 0)
        setTotalTaskAmount(calculatedTotal)
        const calculatedGst = calculatedTotal / 10
        setGstAmount(calculatedGst)
        const calculatedNetTotal = calculatedTotal + calculatedGst
        setNetTotal(calculatedNetTotal)
        setInvoiceTask(res.data.data.listJobNewTask5AABS.items)
        setTotalCount(res.data.data.listJobNewTask5AABS.items.length)
        setIsTableLoading(false)
      } catch (error) {
        setIsTableLoading(false)
        console.error('Error fetching data:', error)
      }
    } else {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    async childMethod() {
      handleNext()
    }
  }))

  const handleSaveItem = async (data: any) => {
    const isValid = await trigger()
    if (isValid) {
      const updatedTotalTaskAmount = parseFloat(totalTaskAmount || 0) + parseFloat(data.task_totamount || 0)
      const updateTax = updatedTotalTaskAmount / 10
      const finalTotal = updatedTotalTaskAmount + updateTax

      const query = `
        mutation my {
              createJobNewTask5AAB(input: {Amount: "${updatedTotalTaskAmount}", Description: "${data.task_description}", JId:${routerId}, JobId:0, Passup: "", PassupRate: "", PerRate: "${data.task_unitprice}", PriceCategory: "", Qty: "${data.task_qty}", TotalRate: "${data.task_totamount}", Updated: 10}) {
                Amount
                Description
                ID
                JId
                JobId
                Passup
                PassupRate
                PerRate 
                PriceCategory
                Qty
                TotalRate
                Updated
              }
            }

           
              
            `

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          fetchData()
          reset()
          toast.success('Saved Successfully')
          setSelectedRowData('')
        })
        .catch(err => {
          console.error('something went wrong', err)
        })
    }
  }

//   updateJobInvoice5AAB(input: {
//     ID: ${routerId},
//     SubTotal: "${updatedTotalTaskAmount}",
//     Tax: "${updateTax}",
//     FinalNetTotal: "${finalTotal}"
//   }) {
//     SubTotal
//     ID
//     Tax
//     FinalNetTotal
//   }
// }

  const handleSaveItemTotal = async (data: any) => {
    const isValid = await trigger()
    if (isValid) {
      const updatedTotalTaskAmount = parseFloat(totalTaskAmount || 0) + parseFloat(data.task_totamount || 0)
      const updateTax = updatedTotalTaskAmount / 10
      const finalTotal = updatedTotalTaskAmount + updateTax

      const query = `
        mutation my {
          updateJobInvoice5AAB(input: {ID: ${routerId}, Tax: "${updateTax}", SubTotal: "${updatedTotalTaskAmount}", FinalNetTotal: "${finalTotal}"}) {
            AdditionalCharge
            AdditionalChargePrice
            AdditionalChargeRate
            AssignTo
            Customer
            DateTime
            Description
            Draft
            DropLat
            DropLng
            DropLocation
            DueDate
            EmpTotal
            FinalNetTotal
            EmpQTY1
            ID
            IP
            InvoiceFrom
            InvoiceId
            JobIds
            JobsNew
            KM
            NetTotal
            Passup
            PickupDate
            PickupLat
            PickupLng
            PickupLocation
            PickupTime
            PriceCategory
            Status
            SubTotal
            Tax
            TaxId
          }
        }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          fetchData()
          reset()
          setSelectedRowData('')
        })
        .catch(err => {
          console.error('something went wrong', err)
        })
    }
  }

  const handleUpdateItem = async (data: any) => {
    const isValid = await trigger()
    if (isValid) {
      const updatedTotalTaskAmount =
        parseFloat(totalTaskAmount || 0) - parseFloat(selectedRowData?.TotalRate || 0) + parseFloat(data.task_totamount)
      const updateTax = updatedTotalTaskAmount / 10
      const finalTotal = updatedTotalTaskAmount + updateTax

      const query = `
           mutation my {
              updateJobNewTask5AAB(input: {Amount: "", Description: "${data.task_description}", ID:${selectedRowData?.ID}, JId:${routerId}, JobId: 10, Passup: "", PassupRate: "", PerRate: "${data.task_unitprice}", PriceCategory: "", Qty: "${data.task_qty}", TotalRate: "${data.task_totamount}", Updated: 10}) {
                Amount
                Description
                ID
                JId
                JobId
                Passup
                PassupRate
                PerRate
                PriceCategory
                Qty
                TotalRate
                Updated
              }
            }
              
            `

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          fetchData()
          reset()
          toast.success('Updated Successfully')
          setSelectedRowData('')
        })
        .catch(err => {
          console.error('something went wrong', err)
        })
    }
  }

  const handleUpdateItemTotal = async (data: any) => {
    const isValid = await trigger()
    if (isValid) {
      const updatedTotalTaskAmount =
        parseFloat(totalTaskAmount || 0) - parseFloat(selectedRowData?.TotalRate || 0) + parseFloat(data.task_totamount)
      const updateTax = updatedTotalTaskAmount / 10
      const finalTotal = updatedTotalTaskAmount + updateTax

      const query = `
         mutation my {
            updateJobInvoice5AAB(input: {ID:${routerId}, Tax: "${updateTax}", SubTotal: "${updatedTotalTaskAmount}", FinalNetTotal: "${finalTotal}"}) {
              AdditionalCharge
              AdditionalChargePrice
              AdditionalChargeRate
              AssignTo
              Customer
              DateTime
              Description
              Draft
              DropLat
              DropLng
              DropLocation
              DueDate
              EmpTotal
              FinalNetTotal
              EmpQTY1
              ID
              IP
              InvoiceFrom
              InvoiceId
              JobIds
              JobsNew
              KM
              NetTotal
              Passup
              PickupDate
              PickupLat
              PickupLng
              PickupLocation
              PickupTime
              PriceCategory
              Status
              SubTotal
              Tax
              TaxId
            }
          }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          fetchData()
          reset()
          setSelectedRowData('')
        })
        .catch(err => {
          console.error('something went wrong', err)
        })
    }
  }

  useEffect(() => {
    if (selectedRowData) {
      setValue('task_description', selectedRowData.Description || '')
      setValue('task_qty', selectedRowData?.Qty || '')
      setValue('task_unitprice', selectedRowData?.PerRate || '')
      setValue('task_totamount', selectedRowData?.TotalRate || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowData])

  const handleEdit = (id: string) => {
    const selectedRow = invoiceTask.find((row: any) => row.ID === id)
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

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'Sl.no',
      headerName: 'S.No',
      sortable: false,
      renderCell: params =>
        params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
    },

    {
      flex: 0.2,
      field: 'Description',
      headerName: 'Description',
      renderCell: ({ row }) => <b>{row.Description}</b>
    },

    {
      flex: 0.2,
      field: 'Qty',
      headerName: 'Quantity',
      renderCell: ({ row }) => <b>{row.Qty}</b>
    },
    {
      flex: 0.2,
      field: 'PerRate',
      headerName: 'Rates',
      renderCell: ({ row }) => <b>{formatCurrency(Number(row.PerRate))}</b>
    },
    {
      flex: 0.2,
      field: 'TotalRate',
      headerName: 'Total Amount',
      renderCell: ({ row }) => <b>{formatCurrency(Number(row.TotalRate))}</b>
    },

    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleEdit(row.ID)}>
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
  const columns: GridColDef[] = [...defaultColumns]

  const formatCurrency = (amount:any) =>
    amount.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
   

  return (
    <>
      <form
        onSubmit={handleSubmit(async formData => {
          if (editMode) {
            await handleUpdateItem(formData)
            await handleUpdateItemTotal(formData)
            setEditMode(false)
          } else {
            await handleSaveItem(formData)
            await handleSaveItemTotal(formData)
          }
        })}
      >
        <Box
          sx={{
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            backgroundColor:
              localStorage.getItem('selectedMode') === 'dark'
                ? 'inherit'
                : localStorage.getItem('selectedMode') === 'light'
                ? '#f6f6f7'
                : localStorage.getItem('systemMode') === 'dark'
                ? 'inherit'
                : 'inherit',
            paddingY: '20px',
            paddingX: '10px',
            borderRadius: '5px'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={5}>
              <Controller
                name='task_description'
                control={control}
                defaultValue=''
                rules={{ required: 'Description is required' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    label={
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor()
                          }}
                        >
                          Description
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    variant='outlined'
                    inputProps={{
                      style: { color: getColor() }
                    }}
                    fullWidth
                    multiline
                    rows={1}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='task_qty'
                control={control}
                defaultValue=''
                rules={{
                  required: 'Quantity is required',
                  pattern: {
                    value: /^[0-9]*$/,
                    message: 'Enter a valid number'
                  }
                }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    inputRef={quantityRef}
                    label={
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor()
                          }}
                        >
                          Quantity
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    variant='outlined'
                    inputProps={{
                      style: { color: getColor() }
                    }}
                    onChange={e => {
                      const input = e.target.value
                      const isValidInput = /^[0-9.]*$/.test(input)
                      if (isValidInput) {
                        field.onChange(e)
                        calculateTotalRate()
                      }
                    }}
                    fullWidth
                    rows={1}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name='task_unitprice'
                control={control}
                defaultValue=''
                rules={{
                  required: 'Per rates is required',
                  pattern: {
                    value: /^[0-9]*$/,
                    message: 'Enter a valid number'
                  }
                }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    inputRef={perRatesRef}
                    label={
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor()
                          }}
                        >
                          Per rates
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    variant='outlined'
                    inputProps={{
                      style: { color: getColor() }
                    }}
                    onChange={e => {
                      const input = e.target.value
                      const isValidInput = /^[0-9.]*$/.test(input)
                      if (isValidInput) {
                        field.onChange(e)
                        calculateTotalRate()
                      }
                    }}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : null}
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name='task_totamount'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    disabled
                    id='TotalRate'
                    label={
                      <div>
                        <Typography className='firstname' sx={{ color: getColor(), fontSize: '0.8125rem' }}>
                          Total Rates
                        </Typography>
                      </div>
                    }
                    variant='outlined'
                    inputProps={{
                      style: { color: getColor() }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
          <div
            style={{
              width: '100%',
              textAlign: 'start',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '27px',
              alignItems: 'center'
            }}
          >
            <Typography>
              Sub Total: $  {''}
              <AnimatedNumber value={totalTaskAmount} duration={1200} />
            </Typography>
            <Typography>
              GST: $  {''}
              <AnimatedNumber value={gstAmount} duration={1200} />
            </Typography>
            <Typography>
              Net Amount: $  {''}
              <AnimatedNumber value={netTotal} duration={1200} />
            </Typography>
            <Button
              type='submit'
              sx={{
                float: 'right',
                width: '100px',
                display: 'flex',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                background: '#776cff',
                alignItems: 'center',
                color: '#fff',
                '&:hover': {
                  background: '#776cff'
                }
              }}
            >
              {editMode ? 'Update' : 'Save'}
            </Button>
          </div>
        </Grid>
      </form>
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
    `}{' '}
        </style>

        <DataGrid
          columns={columns}
          autoHeight
          pagination
          rowHeight={62}
          rowCount={totalCount}
          loading={isTableLoading}
          pageSizeOptions={[10, 25]}
          rows={invoiceTask}
          getRowId={row => row.ID}
          paginationModel={paginationModel}
          onPaginationModelChange={e =>
            setPaginationModel({
              ...e
            })
          }
        />
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
})

export default InvoiceTask
