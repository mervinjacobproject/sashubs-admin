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
import CustomAvatar from 'src/@core/components/mui/avatar'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'
import toast from 'react-hot-toast'

export interface JobworkerInfoMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
}

interface jobworkerProps {
  ref: any
  editId: any
  handleNext: () => void
  separateId: any
  customer: any
}

const InvoiceWorkDetails: React.FC<jobworkerProps> = forwardRef<JobworkerInfoMethods, jobworkerProps>(
  ({ handleNext, editId, customer, separateId }, ref) => {
    const router: any = useRouter()
    const invoiceEditId = router.query.invoiceid === undefined ? separateId : router.query.invoiceid
    const createInvoiceId = router.query.createInvoiceId === undefined ? editId : router.query.createInvoiceId
    const empqtyRef = useRef<any>(null)
    const task_unitpriceRef = useRef<any>(null)
    const empextraamtRef = useRef<any>(null)
    const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: 10
    })
    const [employeelist, setemployeelist] = useState<any>([])
    const [createTaskItems, setCreateTaskItems] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [totalTaskAmount, setTotalTaskAmount] = useState(0)
    const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [modalOpenDelete, setModalOpenDelete] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState('')
    const [loading, setLoading] = useState(true)

    const handleModalOpenDelete = () => setModalOpenDelete(true)
    const handleModalCloseDelete = () => setModalOpenDelete(false)

    const handleDelete = (id: string) => {
      const selectedRow: any = createTaskItems.find((row: any) => row.ID === id)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
      }
      handleModalOpenDelete()
      setSelectedRowId(id)
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
        listDriver5AABS(filter: {Status: {eq: true},Deleted:{ne:true}}) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleNext()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
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

    const handleCancelDelete = () => {
      setModalOpenDelete(false)
    }

    useEffect(() => {
      if (selectedRowData) {
        setValue('Tax', parseFloat(selectedRowData.Employee) || '')
        setValue('empdescription', selectedRowData.TaskDescription || '')
        setValue('empqty', selectedRowData.TaskQuty || '')
        setValue('task_unitprice', selectedRowData.TaskUnitPrice || '')
        setValue('empextraamt', selectedRowData.TaskExtraAmt || '')
        setValue('task_totamount', selectedRowData.TaskAmountAud || '')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowData, reset])

    const handleEdit = (id: string) => {
      const selectedRow: any = createTaskItems.find((row: any) => row.ID === id)
      if (selectedRow) {
        setSelectedRowData(selectedRow)
        setEditMode(true)
        setValue('Tax', parseFloat(selectedRow.Employee))
      }
    }

    const handleDeleteConfirm = () => {
      const query = `mutation my {
        deleteJobNewInvoice5AAB(input: {ID: ${selectedRowId}}) {
          AdditionChargeId
          Date
          Employee
          ID
          JobId
          JId
          PayId
          SubTotal
          Subject
          TaskAmountAud
          TaskDescription
          TaskGST
          TaskQuty
          TaskUnitPrice
          TotalAud
          TotalGST
          TaskExtraAmt
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
          deletePayCalculation()
          reset()
        })
        .catch((err: any) => {
          toast.error('Error deleting designation')
        })
    }

    const deletePayCalculation = () => {
      const query = `mutation my {
    deleteJobNewInvoice5AAB(input: {ID: ${selectedRowData?.PayId}}) {
      AdditionChargeId
      Date
      Employee
      ID
      JobId
      JId
      PayId
      SubTotal
      Subject
      TaskAmountAud
      TaskDescription
      TaskGST
      TaskQuty
      TaskUnitPrice
      TotalAud
      TotalGST
      TaskExtraAmt
    }
  }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
      reset()
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
        flex: 0.2,
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
          const country: any = employeelist.find((c: any) => c.DID == countryId)
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
        renderCell: ({ row }:any) => <b>{formatCurrency(Number(row.TaskUnitPrice))}</b>

      },
      {
        flex: 0.3,
        field: 'TaskExtraAmt',
        headerName: 'Extra Charge9999',
        renderCell: ({ row }:any) => <b>{formatCurrency(Number(row.TaskExtraAmt))}</b>
      },
      {
        flex: 0.3,
        field: 'TaskAmountAud',
        headerName: 'Total',
        renderCell: ({ row }:any) => <b>{formatCurrency(Number(row.TaskAmountAud))}</b>
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.3,

        renderCell: ({ row }: any) => {
          return (
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
      }
    ]

    const columns: GridColDef[] = [...defaultColumns]

    const fetchCreateTask = async (id: any) => {
      const query = `
      query MyQuery {
        listJobNewInvoice5AABS(filter: {JId: {eq: ${id}}}) {
          items {
            AdditionChargeId
            Date
            Employee
            ID
            JId
            JobId
            PayId
            Subject
            SubTotal
            TaskAmountAud
            TaskDescription
            TaskExtraAmt
            TaskGST
            TaskQuty
            TaskUnitPrice
            TotalAud
            TotalGST
          }}}`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      try {
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        if (res.status === 200) {
          const items = res.data.data.listJobNewInvoice5AABS.items
          setCreateTaskItems(items)
          const calculatedTotal = items.reduce((total: any, item: any) => {
            const parsedAmount = parseFloat(item.TaskAmountAud)
            if (!isNaN(parsedAmount)) {
              return total + parsedAmount
            } else {
              return total
            }
          }, 0)
          setTotalTaskAmount(calculatedTotal)
          setTotalCount(items.length)
          if (items.length === 0) {
            FetchAllData()
          }
          return true
        }
      } catch (err) {
        console.error(err)
        return false
      }
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
          listJobWorker5AABS(filter: {JobId: {eq: "${id}"}}) {
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
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        if (id) {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.listJobWorker5AABS) {
            return { id, items: res.data.data.listJobWorker5AABS.items }
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
              const {
                Employee,
                TaskAmountAud,
                TaskDescription,
                TaskGST,
                TaskExtraAmt,
                TaskQuty,
                TaskUnitPrice,
                TotalAud,
                TotGST
              } = item
              const smallID = response.id
              await addAlldetails(
                smallID,
                Employee,
                TaskAmountAud,
                TaskDescription,
                TaskGST,
                TaskExtraAmt,
                TaskQuty,
                TaskUnitPrice,
                TotalAud,
                TotGST
              )
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
      Employee: any,
      TaskAmountAud: any,
      TaskDescription: any,
      TaskGST: any,
      TaskExtraAmt: any,
      TaskQuty: any,
      TaskUnitPrice: any,
      TotalAud: any,
      TotGST: any
    ) => {
      try {
        const currentDate = new Date()
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')
        const formattedDateTime = `${year}-${month}-${day}`
        const query = `mutation my {
          createPayCalculation5AAB(input: {AdditionChargeId: "", Date: "${formattedDateTime}", Employee: ${Employee}, InvoiceId: ${createInvoiceId}, JobId: "${smallID}", PaidAmt: "", PayableAmt: "", Status: true, SubTotal: "", Subject: "Worker Charge", TaskAmountAud: "${TaskAmountAud}", TaskDescription: "${TaskDescription}", TaskExtraAmt: "${TaskExtraAmt}", TaskGST: "${TaskGST}", TaskQuty: "${TaskQuty}", TaskUnitPrice: "${TaskUnitPrice}", TotGST: "${TotGST}", TotalAud: "${TotalAud}"}) {
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
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        storeAllDetails(
          res.data.data.createPayCalculation5AAB.ID,
          formattedDateTime,
          Employee,
          smallID,
          TaskAmountAud,
          TaskDescription,
          TaskGST,
          TaskQuty,
          TaskExtraAmt,
          TaskUnitPrice,
          TotalAud,
          TotGST
        )
      } catch (err) {
        console.error(err)
      }
    }
    const storeAllDetails = async (
      id: any,
      date: any,
      Employee: any,
      smallID: any,
      TaskAmountAud: any,
      TaskDescription: any,
      TaskGST: any,
      TaskQuty: any,
      TaskExtraAmt: any,
      TaskUnitPrice: any,
      TotalAud: any,
      TotGST: any
    ) => {
      try {
        const query = `mutation my {
          createJobNewInvoice5AAB(input: {AdditionChargeId: "", Date: "${date}", Employee: "${Employee}", JId: ${createInvoiceId}, JobId: ${smallID},  PayId: ${id}, SubTotal: "", Subject: "", TaskAmountAud: "${TaskAmountAud}", TaskDescription: "${TaskDescription}", TaskGST: "${TaskGST}", TaskExtraAmt: "${TaskExtraAmt}", TaskQuty: "${TaskQuty}", TaskUnitPrice: "${TaskUnitPrice}", TotalAud: "${TotalAud}", TotalGST: "${TotGST}"}) {
            AdditionChargeId
            Date
            Employee
            ID
            JId
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
            TotalAud
            TotalGST
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

    const handleSaveItem = async (data: any) => {
      const isValid = await trigger()
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const formattedDateTime = `${year}-${month}-${day}`

      if (isValid) {
        const query = `mutation my {
          createPayCalculation5AAB(input: {AdditionChargeId: "", Date:"${formattedDateTime}", Employee:${selectedTaxCharge?.chargeId}, InvoiceId:${createInvoiceId}, JobId:"0", PaidAmt: "", PayableAmt: "", Status: true, SubTotal: "", Subject: "Worker Charge",  TaskAmountAud: "${data.task_totamount}", TaskDescription:"${data?.empdescription}", TaskExtraAmt: "${data?.empextraamt}", TaskGST: "", TaskQuty:"${data.empqty}", TaskUnitPrice: "${data?.task_unitprice}", TotGST: "", TotalAud: ""}) {
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
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        await ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(async res => {
            await saveItem(
              res.data.data.createPayCalculation5AAB.ID,
              formattedDateTime,
              data.task_totamount,
              data?.empdescription,
              data?.empextraamt,
              data.empqty,
              data?.task_unitprice
            )
            reset()
            await fetchCreateTask(createInvoiceId)
            toast.success('Work details added successfully')
          })

          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }

    const saveItem = async (
      id: any,
      formattedDateTime: any,
      task_totamount: any,
      empdescription: any,
      empextraamt: any,
      empqty: any,
      task_unitprice: any
    ) => {
      const query = `
      mutation my {
        createJobNewInvoice5AAB(input: {AdditionChargeId: "", Date: "${formattedDateTime}", Employee: "${selectedTaxCharge?.chargeId}", JId: ${createInvoiceId}, JobId: 0, PayId: '${id}', SubTotal: "", Subject: "Worker Charge", TaskAmountAud: "${task_totamount}", TaskDescription: "${empdescription}", TaskExtraAmt: "${empextraamt}", TaskGST: "", TaskQuty: "${empqty}", TaskUnitPrice: "${task_unitprice}", TotalAud: ""}) {
          AdditionChargeId
          Date
          Employee
          ID
          JId
          JobId
          SubTotal
          PayId
          Subject
          TaskAmountAud
          TaskDescription
          TaskExtraAmt
          TaskGST
          TaskQuty
          TaskUnitPrice
          TotalAud
          TotalGST
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      await ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
        // console.log(res)
      })
    }

    const handleUpdateItem = async (data: any) => {
      const isValid = await trigger()
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const formattedDateTime = `${year}-${month}-${day}`

      if (isValid) {
        const query = `
        mutation my {
          updateJobNewInvoice5AAB(input: { Date: "${formattedDateTime}", Employee: "${selectedTaxCharge?.chargeId}", ID:${selectedRowData?.ID},TaskAmountAud: "${data.task_totamount}", TaskExtraAmt: "${data?.empextraamt}", TaskDescription: "${data.empdescription}",TaskQuty: "${data.empqty}", TaskUnitPrice: "${data?.task_unitprice}"}) {
            AdditionChargeId
            Date
            Employee
            ID
            JId
            JobId
            PayId
            SubTotal
            Subject
            TaskAmountAud
            TaskDescription
            TaskExtraAmt
            TaskGST
            TaskUnitPrice
            TaskQuty
            TotalAud
            TotalGST
          }
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        ApiClient.post(`${AppSink}`, { query }, { headers })
          .then(res => {
            handleUpdateWorkdetail(
              formattedDateTime,
              data.task_totamount,
              data.empdescription,
              data?.empextraamt,
              data.empqty,
              data?.task_unitprice
            ),
              fetchCreateTask(createInvoiceId)
            reset()
            toast.success('Work details updated successfully')
          })
          .catch(err => {
            console.error('something went wrong', err)
          })
      }
    }
    const handleUpdateWorkdetail = (
      date: any,
      task_totamount: any,
      empdescription: any,
      empextraamt: any,
      empqty: any,
      task_unitprice: any
    ) => {
      const query = `mutation my {
        updatePayCalculation5AAB(input: { Date: "${date}", Employee: ${selectedTaxCharge?.chargeId}, ID: ${selectedRowData?.PayId}, InvoiceId: ${createInvoiceId}, JobId: "", PaidAmt: "", PayableAmt: "", Status: false, SubTotal: "",  Subject: "Worker Charge", TaskAmountAud: "${task_totamount}", TaskDescription: "${empdescription}", TaskExtraAmt: "${empextraamt}", TaskGST: "", TaskQuty:"${empqty}", TaskUnitPrice:"${task_unitprice}", TotGST: "", TotalAud: ""}) {
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
        .then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.error('something went wrong', err)
        })
    }

    return (
      <>
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
                        options={employeelist}
                        getOptionLabel={data =>
                          data.FirstName + '' + data.LastName ? data.FirstName + ' ' + data.LastName : ''
                        }
                        value={
                          employeelist.find((tax: any) => {
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
                                {data.FirstName ? data.FirstName.charAt(0).toUpperCase() : ''}
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

              <Grid item xs={6} sx={{ marginTop: '9px' }}>
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
                      onChange={e => {
                        const inputValue = e.target.value
                        const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
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
                  rules={{ required: 'Qty is required' }}
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
                        }
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
                  rules={{ required: 'Basic Rate is required' }}
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
                  rules={{ required: 'Charge is required' }}
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
                            Extra charge
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
                        }
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
          Total Rate:$<AnimatedNumber value={totalTaskAmount} duration={1200}></AnimatedNumber>
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
            getRowId={row => row.ID}
            pageSizeOptions={[10, 25]}
            rowCount={totalCount}
            // loading={isTableLoading}
            rowHeight={62}
            rows={createTaskItems}
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
          <Typography
            sx={{
              color: getColor()
            }}
          >
            Are you sure you want to delete?
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
export default InvoiceWorkDetails
