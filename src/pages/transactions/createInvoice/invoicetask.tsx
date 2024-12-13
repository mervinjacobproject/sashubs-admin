import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
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
  editId: any
  handleNext: () => void
  customer: any
  separateId: any
}
const InvoiceCreateTask: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(
  ({ handleNext, editId, customer, separateId }, ref) => {
    const router: any = useRouter()
    const invoiceEditId = router.query.invoiceid === undefined ? separateId : router.query.invoiceid
    const createInvoiceId = router.query.createInvoiceId === undefined ? editId : router.query.createInvoiceId
    const quantityRef = useRef<any>(null)
    const perRatesRef = useRef<any>(null)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [createTaskItems, setCreateTaskItems] = useState([])
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [gstAmount, setGstAmount] = useState(0)
    const [netTotal, setNetTotal] = useState(0)
    const [totalTaskAmount, setTotalTaskAmount] = useState<any>(0)
    const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10
    })
   
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState('')
    const [updatetotal, setupdateTotal] = useState<any>([])
    const [updatetax, setupdateTax] = useState<any>([])
    const [finaltotal, setupdatefinaltotal] = useState<any>([])

    const { control, handleSubmit, trigger, setValue, reset } = useForm()

    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalCloseDelete = () => setModalOpenDelete(false)

    const handleDelete = (id: string) => {
      handleModalOpenDelete()
      setSelectedRowId(id)
    }

    const handleDeleteConfirm = () => {
      const query = `mutation my {
        deleteJobNewTask5AAB(input: {ID: ${selectedRowId}}) {
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
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          toast.success('Deleted successfully')
          fetchCreateTask(createInvoiceId)
          setModalOpenDelete(false)
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

    const handleCancelDelete = () => {
      setModalOpenDelete(false)
    }

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

    const fetchCreateTask = async (id: any) => {
      const query = `query MyQuery {
        listJobNewTask5AABS(filter: {JId: {eq: ${id}}}) {
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

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        if (res.status === 200) {
          const items = res.data.data.listJobNewTask5AABS.items
          setCreateTaskItems(items)
          const calculatedTotal = items.reduce((total: any, item: any) => total + parseFloat(item.TotalRate), 0)
          setTotalTaskAmount(calculatedTotal)
          const calculatedGst = calculatedTotal / 10
          setGstAmount(calculatedGst)
          const calculatedNetTotal = calculatedTotal + calculatedGst
          setNetTotal(calculatedNetTotal)
          totalcalAmount(calculatedTotal,calculatedGst,calculatedNetTotal)
          setTotalCount(items.length)
          if (items.length === 0) {
            FetchAllData()
          }
          return true
        }
      } catch (err) {
        return false
      }
    }

    const totalcalAmount = async (calculatedTotal:any,calculatedGst:any,calculatedNetTotal:any,) => {
      const query = `mutation my {
        updateJobInvoice5AAB(input: {ID: ${createInvoiceId}, SubTotal: "${calculatedTotal}", Tax: "${calculatedGst}", FinalNetTotal: "${calculatedNetTotal}"}) {
          ID
          FinalNetTotal
          SubTotal
          Tax
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      await ApiClient.post(`${AppSink}`, { query }, { headers })
    }

    useEffect(() => {
      if (createInvoiceId !== undefined) {
        fetchCreateTask(createInvoiceId)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createInvoiceId])

    const mergeAllData = async (id: any) => {
      try {
        setLoading(true)
        const query = `query MyQuery {
  listJobTask5AABS(filter: {JobId: {eq: ${id}}}) {
    items {
      AdditionalNotes
      Amount
      Description
      ID
      Image1
      Image2
      Image3
      InvoiceId
      JobId
      Passup
      PassupRate
      PerRate
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
        if (id) {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.listJobTask5AABS) {
            return { id, items: res.data.data.listJobTask5AABS.items }
          }
        }
        return null
      } catch (error) {
        setLoading(false)
      }
    }
    const FetchAllData = async () => {
      try {
        setLoading(true)
        const ids: any = invoiceEditId.split(',').map((id: any) => id.trim())
        const allResponse: any = []

        if (createTaskItems && createTaskItems.length === 0) {
          for (const id of ids) {
            const cusRef = await mergeAllData(id)
            if (cusRef) {
              allResponse.push(cusRef)
            }
          }
        }
        if (createTaskItems && createTaskItems.length === 0) {
          for (const response of allResponse) {
            for (const item of response.items) {
              const { Amount, Description, TotalRate, Qty, PerRate } = item
              const smallID = response.id
              await addAlldetails(smallID, Amount, Description, TotalRate, Qty, PerRate)
            }
          }
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(error)
      }
    }

    const addAlldetails = async (
      smallID: any,
      Amount: any,
      Description: any,
      TotalRate: any,
      Qty: any,
      PerRate: any
    ) => {
      try {
        const query = `mutation my {
            createJobNewTask5AAB(input: { Amount: "${Amount}",
            Description: "${Description}", JId: ${createInvoiceId}, JobId: ${smallID}, Passup: "", PassupRate: "", PerRate: "${PerRate}", PriceCategory: "", Qty: "${Qty}", TotalRate: "${TotalRate}", Updated: 10}) {
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
          }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        await ApiClient.post(`${AppSink}`, { query }, { headers })
        fetchCreateTask(createInvoiceId)
      } catch (err) {
        console.error(err)
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
      const selectedRow: any = createTaskItems.find((row: any) => row.ID === id)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
        if (selectedRow.ID === id) {
          setEditMode(true)
        }
      }
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      
      }
    }))

  

    const totalCalculation = async (SubTotal: any, Tax: any, FinalNetTotal: any) => {
      const query = `mutation my {
        updateJobInvoice5AAB(input: {ID: ${createInvoiceId}, SubTotal: "${SubTotal}", Tax: "${Tax}", FinalNetTotal: "${FinalNetTotal}"}) {
          ID
          FinalNetTotal
          SubTotal
          Tax
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      await ApiClient.post(`${AppSink}`, { query }, { headers })
    }

    const handleSaveItem = async (data: any) => {
      const isValid = await trigger()
      if (isValid) {
        const updatedTotalTaskAmount = parseFloat(totalTaskAmount || 0) + parseFloat(data?.task_totamount || 0)
        const updateTax = updatedTotalTaskAmount / 10
        const finalTotal = updatedTotalTaskAmount + updateTax

        const query = `
        mutation my {
              createJobNewTask5AAB(input: {Amount: "${updatedTotalTaskAmount}", Description: "${data.task_description}", JId:${createInvoiceId}, JobId:0, Passup: "", PassupRate: "", PerRate: "${data.task_unitprice}", PriceCategory: "", Qty: "${data.task_qty}", TotalRate: "${data.task_totamount}", Updated: 10}) {
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
            fetchCreateTask(createInvoiceId)
            totalCalculation(updatedTotalTaskAmount, updateTax, finalTotal)
            reset()
            toast.success("Task added successfully")
          })
          .catch((err: any) => {
            console.error(err)
          })
      }
    }

    const handleUpdateItem = async (data: any) => {
      const isValid = await trigger()
      if (isValid) {
        const updatedTotalTaskAmount =
          parseFloat(totalTaskAmount || 0) -
          parseFloat(selectedRowData?.TotalRate || 0) +
          parseFloat(data.task_totamount)
        const updateTax = updatedTotalTaskAmount / 10
        const finalTotal = updatedTotalTaskAmount + updateTax

        setupdateTotal(updatedTotalTaskAmount)
        setupdateTax(updatedTotalTaskAmount)
        setupdatefinaltotal(updatedTotalTaskAmount)

        const query = `
             mutation my {
                updateJobNewTask5AAB(input: {Amount: "${updatedTotalTaskAmount}", Description: "${data.task_description}", ID:${selectedRowData?.ID}, JId:${createInvoiceId},PerRate: "${data.task_unitprice}", Qty: "${data.task_qty}", TotalRate: "${data.task_totamount}"}) {
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
              }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            fetchCreateTask(createInvoiceId)
            totalCalculation(updatedTotalTaskAmount, updateTax, finalTotal)
            reset()
            toast.success("Task updated successfully")
            setSelectedRowData('')
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
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
        flex: 0.2,
        field: 'Sl.no',
        headerName: 'S.No',
        sortable: false,
        renderCell: params =>
          params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
      },
      {
        flex: 0.3,
        field: 'Description',
        headerName: 'Description',
        renderCell: ({ row }) => <b>{row.Description}</b>
      },
      {
        flex: 0.3,
        field: 'Qty',
        headerName: 'Quantity',
        renderCell: ({ row }) => <b>{row.Qty}</b>
      },
      {
        flex: 0.3,
        field: 'PerRate',
        headerName: 'Per Rates',
       
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
        {loading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(async formData => {
              if (editMode) {
                await handleUpdateItem(formData)
                setEditMode(false)
              } else {
                await handleSaveItem(formData)
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
                                color: getColor(), fontSize: '14px'
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
                          style: { color: getColor() },
                          onInput: (e: any) => {
                            e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                          }
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
                                color: getColor(), fontSize: '14px'
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
                          const sanitizedValue = e.target.value.replace(/\D/g, '')
                          field.onChange(sanitizedValue)
                          calculateTotalRate()
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
                                color: getColor(), fontSize: '14px'
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
                          const sanitizedValue = e.target.value.replace(/\D/g, '')
                          field.onChange(sanitizedValue)
                          calculateTotalRate()
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
                  {' '}
                  Sub Total :$
                  <AnimatedNumber value={totalTaskAmount} duration={1200} />
                </Typography>
                <Typography>
                  GST :$
                  <AnimatedNumber value={gstAmount} duration={1200} />
                </Typography>
                <Typography>
                  {' '}
                  Net Amount :$
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
        )}
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
            disableRowSelectionOnClick
            // loading={isTableLoading}
            paginationModel={paginationModel}
            rows={createTaskItems}
            getRowId={row => row.ID}
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
)
export default InvoiceCreateTask
