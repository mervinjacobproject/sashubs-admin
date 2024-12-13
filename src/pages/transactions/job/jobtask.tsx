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
  handleNext: () => void
  ref: any
}

const Jobtask: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(
  ({ handleNext }, ref) => {

    const router = useRouter()
    const { id: routerId } = router.query
    const quantityRef = useRef<any>(null)
    const perRatesRef = useRef<any>(null)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [gstAmount, setGstAmount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [invoiceTask, setInvoiceTask] = useState<any>([])
    const [netTotal, setNetTotal] = useState(0)
    const [totalTaskAmount, setTotalTaskAmount] = useState<any>(0)
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
      deleteJobTask5AAB(input: {ID:${selectedRowId}}) {
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
              listJobTask5AABS(filter: { JobId: { eq: ${routerId} } }) {
                items {
                  AdditionalNotes
                  Amount
                  Description
                  ID
                  Image1
                  Image2
                  Image3
                  Passup
                  JobId
                  PassupRate
                  PerRate
                  Qty
                  TotalRate
                  Updated
                  InvoiceId
                }
              }
            }`
          const headers = {
            'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
            'Content-Type': 'application/json'
          }
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          const items = res.data.data.listJobTask5AABS.items
          const calculatedTotal = items.reduce((total: any, item: any) => total + parseFloat(item.TotalRate), 0)
          setTotalTaskAmount(calculatedTotal)
          const calculatedGst = calculatedTotal / 10
          setGstAmount(calculatedGst)
          const calculatedNetTotal = calculatedTotal + calculatedGst
          setNetTotal(calculatedNetTotal)
          setInvoiceTask(res.data.data.listJobTask5AABS.items)
          setTotalCount(res.data.data.listJobTask5AABS.items.length)
          setIsTableLoading(false)
        } catch (error) {
          setIsTableLoading(false)
          console.error('Error fetching data:', error)
        }
      }
      else {
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
        const updatedTotalTaskAmount = parseFloat(totalTaskAmount || 0) + parseFloat(data?.task_totamount || 0)
        const updateTax = updatedTotalTaskAmount / 10
        const finalTotal = updatedTotalTaskAmount + updateTax

        const query = `
          mutation my {
            createJobTask5AAB(input: {
              AdditionalNotes: "${data.additional_notes}",
              Amount: "${updatedTotalTaskAmount}",
              Description: "${data.task_description}",
              InvoiceId: 10,
              JobId: ${routerId},
              Passup: "",
              PassupRate: "",
              PerRate: "${data.task_unitprice}",
              Qty: "${data.task_qty}",
              TotalRate: "${data.task_totamount}",
              Updated: 10
            }) {
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
            updateJobsNew5AAB(input: {
              ID: ${routerId},
              SubTotal: "${updatedTotalTaskAmount}",
              Tax: "${updateTax}",
              FinalNetTotal: "${finalTotal}"
            }) {
              SubTotal
              ID
              Tax
              FinalNetTotal
            }
          }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            toast.success("Task Added Successfully")
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
        const updatedTotalTaskAmount = parseFloat(totalTaskAmount || 0) - parseFloat(selectedRowData?.TotalRate || 0) + parseFloat(data.task_totamount)
        const updateTax = updatedTotalTaskAmount / 10
        const finalTotal = updatedTotalTaskAmount + updateTax

        const query = `
          mutation my {
            updateJobTask5AAB(input: {
              AdditionalNotes: "${data.additional_notes}",
              Amount: "",
              Description: "${data.task_description}",
              InvoiceId: 10,
              JobId: ${routerId},
              ID:${selectedRowData?.ID},
              Passup: "",
              PassupRate: "",
              PerRate: "${data.task_unitprice}",
              Qty: "${data.task_qty}",
              TotalRate: "${data.task_totamount}",
              Updated: 10
            }) {
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
            
            updateJobsNew5AAB(input: {
              ID: ${routerId},
              SubTotal: "${updatedTotalTaskAmount}",
              Tax: "${updateTax}",
              FinalNetTotal: "${finalTotal}"
            }) {
              SubTotal
              ID
              Tax
              FinalNetTotal
            }
          }
        `

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            toast.success("Task Updated Successfully")
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
        setValue('additional_notes', selectedRowData?.AdditionalNotes || '')
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
        field: 'Sl.no',
        flex: 0.1,
        headerName: 'S.No',
        sortable: false,
        renderCell: (params: any) =>
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
        field: 'AdditionalNotes',
        headerName: 'Additional Notes',
        renderCell: ({ row }) => <b>{row.AdditionalNotes}</b>
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
        headerName: 'Rates',
        renderCell: ({ row }) => <b>{formatCurrency(Number(row.PerRate))}</b>
      },
      {
        flex: 0.3,
        field: 'TotalRate',
        headerName: 'Total Amount',
        renderCell: ({ row }) => <b>{formatCurrency(Number(row.TotalRate))}</b>
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.3,
        renderCell: ({ row }: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Update'>
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
          style={{ width: '100%' }}
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
              width: '100%',
              scrollbarWidth: 'thin',
              backgroundColor:
                localStorage.getItem('selectedMode') === 'dark'
                  ? 'inherit'
                  : localStorage.getItem('selectedMode') === 'light'
                    ? '#f6f6f7'
                    : localStorage.getItem('systemMode') === 'dark'
                      ? 'inherit'
                      : '#f6f6f7',

              padding: '20px',
              borderRadius: '5px'
            }}
          >
            <Grid container spacing={3} sx={{ padding: '10px' }}>
              <Grid item xs={6}>
                <Controller
                  name='task_description'
                  control={control}
                  defaultValue=''
                  rules={{ required: 'Description is required' }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      sx={{ margin: '0px !important' }}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              fontSize: '14px'
                            }}
                          >
                            Description
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                        field.onChange(modifiedValue)
                      }}
                      variant='outlined'
                      fullWidth
                      inputProps={{
                        style: {
                          color: getColor()
                        }
                      }}
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

              <Grid xs={3} item>
                <Controller
                  name='task_qty'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Qty is required',
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Enter a valid number'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      inputRef={quantityRef}
                      type='number'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              fontSize: '14px'
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
                        style: {
                          color: getColor()
                        }
                      }}
                      onChange={e => {
                        const input = e.target.value;
                        const isValidInput = /^[0-9.]*$/.test(input);
                        if (isValidInput) {
                          field.onChange(e);
                          calculateTotalRate();
                        }

                      }}
                      fullWidth
                      multiline
                      rows={1}
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid xs={3} item>
                <Controller
                  name='task_unitprice'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Per Rates is required',
                    pattern: {
                      value: /^[0-9]*$/,
                      message: 'Enter a valid number'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      sx={{ bottom: '2px !important' }}
                      inputRef={perRatesRef}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              fontSize: '14px'
                            }}
                          >
                            Per Rates
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      variant='outlined'
                      onChange={e => {
                        const input = e.target.value;
                        const isValidInput = /^[0-9.]*$/.test(input);
                        if (isValidInput) {
                          field.onChange(e);
                          calculateTotalRate();
                        }
                      }}
                      fullWidth
                      inputProps={{
                        style: {
                          color: getColor()
                        }
                      }}
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                      InputLabelProps={{
                        style: { fontSize: '12px' }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ padding: '10px' }}>
              <Grid item xs={6}>
                <Controller
                  name='additional_notes'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      sx={{ marginTop: 'px !important' }}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              fontSize: '14px'
                            }}
                          >
                            Additional Notes
                          </span>
                        </div>
                      }
                      variant='outlined'
                      inputProps={{
                        style: {
                          color: getColor()
                        }
                      }}
                      fullWidth
                      multiline
                      rows={1}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                        field.onChange(modifiedValue)
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid>
                  <Controller
                    name='task_totamount'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        onKeyPress={e => {
                          if (isNaN(Number(e.key))) {
                            e.preventDefault()
                          }
                        }}
                        disabled
                        id='TotalRate'
                        label={
                          <div>
                            <span
                              className='firstname'
                              style={{
                                fontSize: '14px'
                              }}
                            >
                              Total Rate
                            </span>
                          </div>
                        }
                        variant='outlined'
                        inputProps={{
                          style: {
                            color: getColor()
                          }
                        }}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', padding: '5px' }}
          >
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
                Sub Total:$ {''}
                <AnimatedNumber value={totalTaskAmount} duration={1200}
                />
              </Typography>

              <Typography>
                GST: $ {''}
                <AnimatedNumber value={gstAmount} duration={1200} />
              </Typography>
              <Typography>
                Net Amount: $ {''}
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
                {editMode ? 'Update' : 'Add'}
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
    `}
          </style>

          <DataGrid
            columns={columns}
            autoHeight
            pagination
            rowHeight={62}
            disableRowSelectionOnClick
            loading={isTableLoading}
            getRowId={row => row.ID}
            paginationModel={paginationModel}
            rows={invoiceTask}
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
          <Typography>Are you sure you want to delete?</Typography>
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

export default Jobtask