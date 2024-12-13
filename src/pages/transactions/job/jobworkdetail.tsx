import React, { forwardRef, useState, useImperativeHandle, useEffect, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { Autocomplete, Box, IconButton, Tooltip } from '@mui/material'
import toast from 'react-hot-toast'
import CustomAvatar from 'src/@core/components/mui/avatar'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'

export interface JobworkerInfoMethods {
  childMethod: (id: any) => void
}

interface jobworkerProps {
  ref: any
  editId: number
  jobId: number
  handleNext: () => void
}

const JobWorkDetails: React.FC<jobworkerProps> = forwardRef<JobworkerInfoMethods, jobworkerProps>(
  ({ handleNext }, ref) => {
    const router = useRouter()
    const { id: routerId } = router.query
    const empqtyRef = useRef<any>(null)
    const task_unitpriceRef = useRef<any>(null)
    const empextraamtRef = useRef<any>(null)
    const [items, setItems] = useState<any>([])
    const [employee, setEmployee] = useState<any>([])
    const [employeelist, setemployeelist] = useState<any>([])
    const [invoiceTask, setInvoiceTask] = useState<any>([])
    const [Totalqty, setTotalqty] = useState<any>()
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [totalTaskAmount, setTotalTaskAmount] = useState(0)
    const [isTableLoading, setIsTableLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState('')
    const [selectedEmployeeId, setselectedEmployeeId] = useState('')

    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalCloseDelete = () => setModalOpenDelete(false)

    const handleDelete = (id: string) => {
      handleModalOpenDelete()
      setSelectedRowId(id)
    }

    const handleDeleteConfirm = () => {
      const query = `mutation my {
        deleteJobWorker5AAB(input: {ID: ${selectedRowId}}) {
          AdditionChargeId
          Date
          Employee
          ID
          InvoiceId
          JobId
          PayId
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
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          toast.success('Deleted successfully')
          fetchCalculation()
          setModalOpenDelete(false)
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

    const {
      control,
      handleSubmit,
      trigger,
      reset,
      setValue,
      watch,
      formState: { errors }
    } = useForm()

    const Fetchemployee = async () => {
      const query = `query MyQuery {
        listDriver5AABS(filter: {Status: {eq: true},Deleted: {ne: true}}) {
          items {
            DID
            DriverID
            FirstName
            LastName
            Photo
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        setemployeelist(res.data.data.listDriver5AABS.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    useEffect(() => {
      Fetchemployee()
      fetchCalculation()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddItem = () => {
      const newItem = {
        idd: items.length + 1,
        invoiceid: routerId,
        tableid: '',
        task_employee: '',
        empqty: '',
        task_unitprice: '',
        empextraamt: '',
        totalamt: ''
      }
      setItems([...items, newItem])
    }

    if (items.length == 0) {
      if (Totalqty > 0) {
        handleAddItem()
      }
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      }
    }))

    const calculateTotalRate = () => {
      const qtyCalc = empqtyRef.current ? parseFloat(empqtyRef.current.value) : NaN
      const basicRateCalc = task_unitpriceRef.current ? parseFloat(task_unitpriceRef.current.value) : NaN
      const extraChargeCalc = empextraamtRef.current ? parseFloat(empextraamtRef.current.value) : NaN

      if (!isNaN(qtyCalc) && !isNaN(basicRateCalc) && basicRateCalc !== 0 && !isNaN(extraChargeCalc)) {
        const totalRate = qtyCalc * basicRateCalc + extraChargeCalc
        setValue('task_totamount', totalRate.toFixed(2))
      } else {
        setValue('task_totamount', '')
      }
    }

    const fetchCalculation = async () => {
      if (routerId && routerId !== 'new') {
        try {
          const query = `
          query MyQuery {
            listJobWorker5AABS(filter: {JobId: {eq: "${routerId}"}}) {
              items {
                AdditionChargeId
                Date
                Employee
                ID
                InvoiceId
                JobId
                PayId
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
          }
        `

          const headers = {
            'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
            'Content-Type': 'application/json'
          }
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          const items = res.data.data.listJobWorker5AABS.items
          setInvoiceTask(items)
          setTotalCount(res.data.data.listJobWorker5AABS.items.length)
          setIsTableLoading(false)
          const calculatedTotal = items.reduce((total: any, item: any) => {
            const parsedAmount = parseFloat(item.TaskAmountAud)
            if (!isNaN(parsedAmount)) {
              return total + parsedAmount
            } else {
              return total
            }
          }, 0)
          setTotalTaskAmount(calculatedTotal)
        } catch (error) {
          // hi
        }
      }
    }

    const handleCancelDelete = () => {
      setModalOpenDelete(false)
    }

    useEffect(() => {
      if (selectedRowData) {
        setValue('Tax', selectedRowData.Employee || '')
        setValue('empdescription', selectedRowData.TaskDescription || '')
        setValue('empqty', selectedRowData.TaskQuty || '')
        setValue('task_unitprice', selectedRowData.TaskUnitPrice || '')
        setValue('empextraamt', selectedRowData.TaskExtraAmt || '')
        setValue('task_totamount', selectedRowData.TaskAmountAud || '')
      }

      // No need to return anything here

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowData, reset])

    // Then you can use fullName wherever you need it

    const handleEdit = (id: string) => {
      const selectedRow = invoiceTask.find((row: any) => row.ID === id)
      setselectedEmployeeId(selectedRow.Employee)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
        setEditMode(true)
        setValue('Tax', selectedRow.Employee)
      }
    }


    const handleclickEmployee = (id:any) => {

      const selectedEmployee = invoiceTask.find((row:any) => row.Employee === id)
      // if(selectedEmployee){
      //   toast.error('Employee Name Already Exist')
      // }
   

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

    const fetchEmployee = () => {
      const query = `query MyQuery {
        listDriver5AABS {
          items {
            DID
            DriverID
            FirstName
            LastName
            Photo
          }
        }
      }
    `

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          const items = res.data.data.listDriver5AABS.items
          setEmployee(items)
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

    useEffect(() => {
      fetchEmployee()
    }, [])

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
        flex: 0.1,
        headerName: 'S.No',
        sortable: false,
        renderCell: (params: any) =>
          params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
      },

      {
        field: 'Employee',
        headerName: 'Employee',
        flex: 0.3,
        renderCell: (params: any) => {
          const countryId = params.row.Employee
          const country: any = employee.find((c: any) => c.DID == countryId)
          return country ? `${country.FirstName} ${country.LastName}` : ''
        }
      },
      {
        flex: 0.3,
        field: 'TaskDescription',
        headerName: 'Description',
        renderCell: ({ row }) => <b>{row.TaskDescription}</b>
      },
      {
        flex: 0.3,
        field: 'TaskQuty',
        headerName: 'Quantity'
      },
      {
        flex: 0.3,
        field: 'TaskUnitPrice',
        headerName: 'BAsic rate',
        renderCell: ({ row }) => <b>{formatCurrency(Number(row.TaskUnitPrice))}</b>
      },
      {
        flex: 0.3,
        field: 'TaskExtraAmt',
        headerName: 'Extra Charge',
        renderCell: ({ row }) => <b>{formatCurrency(Number(row.TaskExtraAmt))}</b>
      },
      {
        flex: 0.3,
        field: 'TaskAmountAud',
        headerName: 'Total',
        renderCell: ({ row }) => <b>{formatCurrency(Number(row.TaskAmountAud))}</b>
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
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() =>{ handleDelete(row.ID)}}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ]

    const columns: GridColDef[] = [...defaultColumns]


    
    const handleSaveItem = async (data: any, id: any) => {
      const isValid = await trigger()
      const { id: routerId } = router.query
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const formattedDateTime = `${year}-${month}-${day}`

      if (isValid) {
        const query = `
        mutation my {
          createJobWorker5AAB(input: {AdditionChargeId: "", Date: "${formattedDateTime}", Employee:${selectedTaxCharge?.chargeId}, InvoiceId: 0, JobId: "${routerId}", PayId:${id}, SubTotal: "", Subject:"Worker Charge", TaskAmountAud: "${data.task_totamount}", TaskDescription: "${data.empdescription}", TaskExtraAmt: "${data?.empextraamt}", TaskGST: "", TaskQuty: "${data.empqty}", TotGST: "", TotalAud: "", TaskUnitPrice: "${data?.task_unitprice}"}) {
            AdditionChargeId
            Date
            Employee
            InvoiceId
            ID
            JobId
            PayId
            Subject
            SubTotal
            TaskAmountAud   
            TaskDescription
            TaskExtraAmt   
            TaskQuty
            TaskUnitPrice   
            TotGST
            TotalAud   
          }
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            fetchCalculation()
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }

    // const handleSaveItemPaycalcuation = async (data: any) => {
    //   const isValid = await trigger()
    //   const { id: routerId } = router.query
    //   const currentDate = new Date()
    //   const year = currentDate.getFullYear()
    //   const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    //   const day = String(currentDate.getDate()).padStart(2, '0')

    //   const formattedDateTime = `${year}-${month}-${day}`
    //   if (isValid) {
    //     const query = `
    //   mutation my {
    //   createPayCalculation5AAB(input: {AdditionChargeId: "", Date: "${formattedDateTime}", Employee: ${selectedTaxCharge?.chargeId}, InvoiceId: 10, JobId: "${routerId}", PaidAmt: "", PayableAmt: "", Status: false, SubTotal: "", Subject: "Worker Charge", TaskAmountAud: "${data.task_totamount}", TaskDescription: "${data.empdescription}", TaskExtraAmt: "${data?.empextraamt}", TaskGST: "", TaskQuty: "${data.empqty}", TaskUnitPrice: "${data?.task_unitprice}", TotGST: "", TotalAud: ""}) {
    //     AdditionChargeId
    //     Date
    //     Employee
    //     ID
    //     InvoiceId
    //     JobId
    //     PaidAmt
    //     PayableAmt
    //     Status
    //     SubTotal
    //     Subject
    //     TaskAmountAud
    //     TaskDescription
    //     TaskExtraAmt
    //     TaskGST
    //     TaskQuty
    //     TaskUnitPrice
    //     TotGST
    //     TotalAud
    //   }
    // }`

    //     const headers = {
    //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
    //       'Content-Type': 'application/json'
    //     }

    //     try {
    //       const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
    //       const items = res.data.data.createPayCalculation5AAB
    //       reset()
    //       fetchCalculation()
    //       await handleSaveItem(data, items.ID)
    //     } catch (error) {
    //       return Promise.reject(error)
    //     }
    //   }
    // }

    const handleSaveItemPaycalcuation = async (data: any) => {
      const isValid = await trigger();
      const { id: routerId } = router.query;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
    
      const formattedDateTime = `${year}-${month}-${day}`;
    
      // const employeeExists = invoiceTask.some((row: any) => row.Employee === selectedTaxCharge?.chargeId);
      // if (employeeExists) {
      //   toast.error('Employee Name Already Exists');
      //   return;
      // }
    
      if (isValid) {
        const query = `
          mutation my {
            createPayCalculation5AAB(input: {
              AdditionChargeId: "", 
              Date: "${formattedDateTime}", 
              Employee: ${selectedTaxCharge?.chargeId}, 
              InvoiceId: 10, 
              JobId: "${routerId}", 
              PaidAmt: "", 
              PayableAmt: "", 
              Status: false, 
              SubTotal: "", 
              Subject: "Worker Charge", 
              TaskAmountAud: "${data.task_totamount}", 
              TaskDescription: "${data.empdescription}", 
              TaskExtraAmt: "${data?.empextraamt}", 
              TaskGST: "", 
              TaskQuty: "${data.empqty}", 
              TaskUnitPrice: "${data?.task_unitprice}", 
              TotGST: "", 
              TotalAud: ""
            }) {
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
          }`;
    
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        };
    
        try {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers });
          const items = res.data.data.createPayCalculation5AAB;
          reset();
          fetchCalculation();
          await handleSaveItem(data, items.ID);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
    

    const handleUpdateItem = async (data: any) => {
      const isValid = await trigger()
      const { id: routerId } = router.query
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const formattedDateTime = `${year}-${month}-${day}`

      // const employeeExists = invoiceTask.some((row: any) => row.Employee !== selectedTaxCharge?.chargeId);
      // if (employeeExists) {
      //   toast.error('Employee Name Already Exists');
      //   return;
      // }

      if (isValid) {
        const query = `
        mutation my {
          updateJobWorker5AAB(input: { ID:${selectedRowData?.ID}, Date: "${formattedDateTime}", Employee:${selectedEmployeeId}, InvoiceId: 0, JobId: "${routerId}", PayId: 0, SubTotal: "", Subject: "", TaskAmountAud: "${data.task_totamount}", TaskDescription: "${data.empdescription}", TaskExtraAmt: "${data?.empextraamt}", TaskGST: "", TaskQuty: "${data.empqty}", TotGST: "", TotalAud: "", TaskUnitPrice: "${data?.task_unitprice}"}) {
            AdditionChargeId
            Date
            Employee
            InvoiceId
            ID
            JobId
            PayId
            Subject
            SubTotal
            TaskAmountAud   
            TaskDescription
            TaskExtraAmt   
            TaskQuty
            TaskUnitPrice   
            TotGST
            TotalAud   
          }
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            reset()
            fetchCalculation()
            // setSelectedTaxCharge("")
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }

    return (
      <>
        <form
          onSubmit={handleSubmit(async formData => {
            if (editMode) {
              await handleUpdateItem(formData)
              setEditMode(false)
            } else {
              await handleSaveItemPaycalcuation(formData)
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
              padding: '20px',
              borderRadius: '5px'
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name='Tax'
                  control={control}
                  rules={{ required: 'Employee Name is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <Autocomplete
                        {...field}
                        options={employeelist.sort((a: any, b: any) => a.FirstName?.localeCompare(b.FirstName))}
                        getOptionLabel={data =>
                          data.FirstName + '' + data.LastName ? data.FirstName + ' ' + data.LastName : ''
                        }
                        value={
                          employeelist?.find((tax: any) => {
                            return tax.DID === watch('Tax')
                          }) || null
                        }
                        renderOption={(props, data) => (
                          <Box component='li' sx={{ '& > img': { flexShrink: 0 } }} {...props}>
                            {data.Photo ? (
                              <img
                                alt=''
                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                loading='lazy'
                                src={data.Photo}
                                srcSet={data.Photo}
                              />
                            ) : (
                              <CustomAvatar style={{ width: '30px', height: '30px' }}>
                                {data.FirstName
                                  ? data.FirstName.charAt(0).toUpperCase()
                                  : ''}
                              </CustomAvatar>
                            )}
                            <div style={{ padding: '10px' }}>
                              {data.FirstName + '' + data.LastName ? data.FirstName + '' + data.LastName : ''}
                              <div style={{ fontSize: '12px', color: '#776cff' }}>{data.DriverID}</div>
                            </div>
                          </Box>
                        )}
                        onChange={(_, newValue) => {
                          field.onChange(newValue?.DID || null)
                          handleclickEmployee(newValue?.DID)
                          setselectedEmployeeId(newValue?.DID)
                          setSelectedTaxCharge({
                            chargeId: newValue?.DID || null,
                            name: (newValue?.FirstName || '') + ' ' + (newValue?.LastName || '')
                          })

                          setValue('Tax', newValue?.DID || null)
                        }}
                        isOptionEqualToValue={(option, value) => {
                          return option?.DID === value?.DID
                        }}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            label={
                              <div>
                                <span
                                  className='firstname'
                                  style={{
                                    color: getColor()
                                  }}
                                >
                                  Employee Name   
                                </span>
                                <Typography
                                  variant='caption'
                                  color='error'
                                  sx={{ fontSize: '17px', marginLeft: '2px' }}
                                >
                                  *
                                </Typography>
                              </div>
                            }
                            error={!!fieldState.error}
                            helperText={fieldState.error ? fieldState.error.message : null}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6} sx={{ marginTop: '8px' }}>
                <Controller
                  name='empdescription'
                  control={control}
                  defaultValue=''
                  rules={{ required: 'Description is required' }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      InputLabelProps={{
                        style: { fontSize: '12px' }
                      }}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                        field.onChange(modifiedValue)
                      }}
                      id='Description'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Descriptions
                          </span>
                        </div>
                      }
                      multiline
                      inputProps={{
                        style: {
                          color: getColor()
                        }
                      }}
                      rows={1}
                      variant='outlined'
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ marginTop: '5px' }}>
              <Grid item xs={2}>
                <Controller
                  name='empqty'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Qty is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]*$/,
                      message: 'Invalid input. Please enter a valid number or decimal.'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      inputRef={empqtyRef}
                      InputLabelProps={{ style: { fontSize: '12px' } }}
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '') {
                          field.onChange(e)
                          calculateTotalRate()
                        }
                      }}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Qty
                          </span>
                        </div>
                      }
                      variant='outlined'
                      inputProps={{
                        style: {
                          color: getColor()
                        } // Change color here to the desired color
                      }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                  fontSize='1.625rem'
                  icon='tdesign:multiply'
                  style={{
                    color: getColor()
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name='task_unitprice'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Rate is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]*$/,
                      message: 'Invalid input. Please enter a valid number or decimal.'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      inputRef={task_unitpriceRef}
                      InputLabelProps={{ style: { fontSize: '12px' } }}
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '') {
                          field.onChange(e)
                          calculateTotalRate()
                        }
                      }}
                      id='Description'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Basic Rate
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
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '4px',
                  fontWeight: 'bold'
                }}
              >
                <Icon
                  fontSize='1.125rem'
                  icon='lets-icons:add'
                  style={{
                    color: getColor()
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name='empextraamt'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'Extra charge is required',
                    pattern: {
                      value: /^[0-9]*\.?[0-9]*$/,
                      message: 'Invalid input. Please enter a valid number or decimal.'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      inputRef={empextraamtRef}
                      InputLabelProps={{ style: { fontSize: '12px' } }}
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '') {
                          field.onChange(e)
                          calculateTotalRate()
                        }
                      }}
                      id='Description'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Extra Charge
                          </span>
                        </div>
                      }
                      variant='outlined'
                      inputProps={{
                        style: {
                          color: getColor()
                        } // Change color here to the desired color
                      }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '4px',
                  fontWeight: 'bold'
                }}
              >
                <Icon
                  fontSize='1.125rem'
                  icon='lucide:equal'
                  style={{
                    color: getColor()
                  }}
                />
              </Grid>
              <Grid item xs={3} sx={{ marginTop: '0px !important', width: '186px' }}>
                <Controller
                  name='task_totamount'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      sx={{ marginTop: '5px !important' }}
                      onKeyPress={e => {
                        if (isNaN(Number(e.key))) {
                          e.preventDefault()
                        }
                      }}
                      disabled
                      id='TotalRate'
                      // label='Total Rate'
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
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
                        } // Change color here to the desired color
                      }}
                      fullWidth
                      InputLabelProps={{
                        style: { fontSize: '12px' }
                      }}
                      margin='normal'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              paddingTop: '10px',
              width: router.pathname === '/transactions/job/jobdetails' ? '93.1%' : 'auto'
            }}
          >
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
          </Grid>
        </form>
        <Typography>
          Total Rate: $   
          <AnimatedNumber value={totalTaskAmount} duration={1200} />
        </Typography>
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

export default JobWorkDetails
