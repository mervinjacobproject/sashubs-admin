import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { CircularProgress, MenuItem, Select } from '@mui/material'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

interface AddressValues {
  invoiceid: string
  customer_id: string
  price_category: string
  job_notes: string
  pickup_time: string
  km: number
  description: string
  status_result: any
  pickup_location: any
  drop_location: any
  due_date: any
}

export interface JobstepercardInfoMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
}

interface jobProps {
  editId: any
  setEditId: (id: string) => void
  handleNext: () => void
  ref: any
  customer: any
  separateId: any
}

const InvoiceCreateStepercard: React.FC<jobProps> = forwardRef<JobstepercardInfoMethods, jobProps>(
  ({ editId, customer, separateId }, ref) => {
    const formatedDate = (dateString: any) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      return formattedDate
    }

    const router: any = useRouter()
    const routerId = router.query.id === undefined ? customer : router.query.id
    const invoiceEditId = router.query.invoiceid === undefined ? separateId : router.query.invoiceid
    const createInvoiceId = router.query.createInvoiceId === undefined ? editId : router.query.createInvoiceId

    const [customerdetails, setCustomerdetails] = useState<any>('')
    const [jobVal, setJobVal] = useState<any>('')
    const [jobnewId, setJobNewId] = useState<any>('')
    const [loading, setLoading] = useState(false)
    const [draft, setDraft] = useState(false)

    const getDetails = async () => {
      const query = `query MyQuery {
      getCustomer5AAB(CId: ${routerId}) {
        CId
        CompanyName
      }
    }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setCustomerdetails(res.data.data.getCustomer5AAB)
        })
        .catch(error => {
          console.error('Error while fetching jobs:', error)
        })
    }

    useEffect(() => {
      if (routerId !== undefined) {
        getDetails()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routerId])
    useEffect(() => {
      if (customerdetails) {
        setValue('customer_id', customerdetails.CompanyName)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerdetails?.CompanyName])

    const FetchNextjobid = () => {
      const query = `query MyQuery {
        listBillSettings5AABS(filter: {Type: {eq: "Invoice"}}) {
          items {
            CurrentValue
            Format
            ID
            InsertedBy
            InsertedUserId
            Prefix
            Type
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          const response = res.data.data.listBillSettings5AABS.items
          if (!createInvoiceId) {
            setValue('invoiceid', response[0].Prefix + '' + response[0].CurrentValue)
          }
          setJobVal(response[0].Prefix + '' + response[0].CurrentValue)
          setJobNewId(response[0].ID)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    const FetchData_job = async (id: any) => {
      try {
        setLoading(true)
        const query = `query MyQuery {
          listJobsNew5AABS(filter: {ID: {eq: ${id}}}) {
            items {
              AdditionChargeId
              AdditionalChargePrice
              AdditionalChargeRate
              AssignTo
              CreatedDate
              CusReference
              Customer
              DateTime
              Description
              DropIng
              DropLat
              DropLocation
              EmpQty1
              EmpTotal
              FinalNetTotal
              ID
              IP
              JobId
              InvoiceType
              JobNotes
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
        if (id !== 'new') {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.listJobsNew5AABS) {
            return res.data.data.listJobsNew5AABS.items[0].CusReference
          }
        }
        return null
      } catch (error) {
        setLoading(false)
      }
    }

    const FetchInvoiceDetails = async () => {
      try {
        setLoading(true)
        const query = `query MyQuery {
          getJobInvoice5AAB(ID:${createInvoiceId}) {
            AdditionalCharge
              AdditionalChargePrice
              AssignTo
              AdditionalChargeRate
              Customer
              DateTime
              Description
              Draft
              DropLat
              DropLng
              DropLocation
              DueDate
              EmpTotal
              EmpQTY1
              FinalNetTotal
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
              PickupTime
              PickupLocation
              PickupLng
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
        if (createInvoiceId !== undefined) {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.getJobInvoice5AAB) {
            const { InvoiceId, Status, Description, Draft, DueDate } = res.data.data.getJobInvoice5AAB
            setValue('invoiceid', InvoiceId)
            setValue('description', Description)
            setValue('due_date', DueDate)
            setValue('status', Status)
            setValue('draft', Draft)
            setDraft(Draft)
          }
        }
      } catch (error) {
        setLoading(false)
      }
    }
    useEffect(() => {
      if (createInvoiceId !== undefined) {
        FetchInvoiceDetails()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createInvoiceId])

    const FetchAllData = async () => {
      try {
        setLoading(true)
        const ids = invoiceEditId.split(',').map((id: any) => id.trim())
        const cusReferences = []
        for (const id of ids) {
          const cusRef = await FetchData_job(id)
          if (cusRef) {
            cusReferences.push(cusRef)
          }
        }
        setValue('description', cusReferences.join(','))
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(error)
      }
    }

    useEffect(() => {
      if (!createInvoiceId && invoiceEditId) {
        FetchAllData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceEditId, createInvoiceId])

    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search)
      const urlId = queryParams.get('id')
      const idToUse = urlId === 'new' ? urlId : urlId || 'new'
      if (editId) {
        queryParams.set('invoiceid', editId)
        router.replace({
          search: queryParams.toString()
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routerId, editId])

    useEffect(() => {
      if (routerId !== undefined) {
        FetchNextjobid()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routerId])

    const defaultAddressValues: AddressValues = {
      invoiceid: '',
      customer_id: '',
      price_category: '',
      job_notes: '',
      pickup_time: '00:00',
      description: '',
      km: 0,
      status_result: 0,
      pickup_location: '',
      drop_location: '',
      due_date: null
    }

    const addressSchema = yup.object().shape({
      customer_id: yup.string().required('Customer Name is required'),
      description: yup.string().required(),
      status: yup.string().required('Status is required').nullable(),
      draft: yup.string().required('Invoice Status is required').nullable()
    })

    const {
      control: addressControl,
      formState: { errors: addressErrors },
      handleSubmit,
      setValue,
      trigger
    } = useForm<any>({
      defaultValues: defaultAddressValues,
      resolver: yupResolver(addressSchema)
    })

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmitForm)()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
      }
    }))

    const onSubmitForm = async (data: any) => {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const hours = String(currentDate.getHours()).padStart(2, '0')
      const minutes = String(currentDate.getMinutes()).padStart(2, '0')
      const seconds = String(currentDate.getSeconds()).padStart(2, '0')
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      await trigger()
      try {
        // const statusvalue = data.status === 1 ? false : true
        // const draftvalue = data.draft === 1 ? false : true
          const statusvalue = data.status === "true" ? true : data.status === "false" ? false : ''
        const draftvalue = data.draft === "true" ? true : data.draft === "false" ? false : ''
        const query = createInvoiceId
          ? `mutation my { 
          updateJobInvoice5AAB(input: {AdditionalCharge: "", ID:${createInvoiceId}, Customer:${
              customerdetails.CId
            }, DateTime: "${formattedDateTime}", Description: "${data.description}", Draft:${draftvalue}, DueDate: "${
              data.due_date
            }", InvoiceId: "${data.draft == 1 ? 0 : jobVal}",  JobIds: "${invoiceEditId}", KM:${
              data.km
            }, Status:${statusvalue}}) {
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
            EmpTotal
            EmpQTY1
            DueDate
            FinalNetTotal
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
          : ` mutation my { 
        createJobInvoice5AAB(input: {AdditionalCharge: "", AdditionalChargePrice: "", AdditionalChargeRate: "", AssignTo: 10, Customer:${
          customerdetails.CId
        }, DateTime: "${formattedDateTime}", Description: "${
              data.description
            }", Draft: ${draftvalue}, DropLat: "", DropLng: "", DropLocation: "", DueDate: "${
              data.due_date
            }", EmpQTY1: "", EmpTotal: "", FinalNetTotal: "", IP: "", InvoiceFrom: "JOB", InvoiceId: "${
              data.draft == 1 ? 0 : data.invoiceid
            }", JobIds: "${invoiceEditId}", JobsNew: "", KM: 2, NetTotal: 10, Passup: 10, PickupDate: "", PickupLat: "", PickupLng: "", PickupLocation: "", PickupTime: "", PriceCategory: 2, Status:${statusvalue}, SubTotal: "", Tax: "", TaxId: 10}) {
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
          EmpQTY1
          EmpTotal
          FinalNetTotal
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

        ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
          if (!createInvoiceId) {
            const urlParams = new URLSearchParams(router.query)
            urlParams.set(
              'createInvoiceId',
              res.data.data?.createJobInvoice5AAB
                ? res.data.data?.createJobInvoice5AAB.ID
                : res.data.data?.createJobInvoice5AAB.ID
            )
            const newUrl = `${router.pathname}?${urlParams.toString()}`
            router.replace(newUrl)
            toast.success("Invoice details added successfully");
          }
          else {
            toast.success("Invoice details updated successfully");
          }
        })
      } catch (error) {
        console.error('Error occurred while sending GraphQL mutation:', error)
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

    return (
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <div className='empTextField'>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}>Invoice ID</span>
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ fontSize: '17px', marginLeft: '2px' }}
                    ></Typography>
                  </div>
                  <Controller
                    name='invoiceid'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <CustomTextField disabled fullWidth size='small' value={value}></CustomTextField>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className='empTextField'>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}>Company Name</span>
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ fontSize: '17px', marginLeft: '2px' }}
                    ></Typography>
                  </div>
                  <Controller
                    name='customer_id'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <CustomTextField disabled fullWidth size='small' value={value}></CustomTextField>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <span style={{ fontSize: '14px', marginBottom: '4px' }}>Due date</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                </div>
                <div style={{ position: 'relative' }}>
                  <Controller
                    name='due_date'
                    control={addressControl}
                    render={({ field }) => (
                      <div>
                        <Datepickers
                          id='due_date'
                          name='due_date'
                          value={formatedDate(field.value)}
                          onChange={e => field.onChange(e ? e.format('YYYY-MM-DD') : null)}
                          placeholder='Select a date'
                          error={!!addressErrors.due_date}
                          touched={!!addressErrors.due_date}
                          style={{
                            color: getColor()
                          }}
                        />
                        {addressErrors.due_date && (
                          <Typography
                            variant='caption'
                            color='error'
                            sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
                          >
                            {String(addressErrors.due_date.message)}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                  <div style={{ position: 'absolute', top: '6%', right: '3%',cursor:'pointer' }}
                   onClick={() => {
                    const dateInput = document.getElementById('due_date');
                    if (dateInput) {
                      dateInput.focus(); 

                      dateInput.click();
                    }
                  }}>
                    <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
              <Grid item xs={12} sm={6}>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Customer Reference</span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px' }}>
                  *
                </Typography>
                <Controller
                  name='description'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      aria-multiline
                      multiline
                      rows={2}
                      fullWidth
                      onChange={e => onChange(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                      placeholder='Enter Customer Reference'
                      value={value}
                      error={Boolean(addressErrors.description)}
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.description && { helperText: 'Customer Reference is required' })}
                    ></TextField>
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6}></Grid>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'grid' }}>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Status</span>
                <Controller
                  name='status'
                  control={addressControl}
                  defaultValue='false'
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                    >
                      <MenuItem value={'false'}>Not Paid</MenuItem>
                      <MenuItem value={'true'}>Paid</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'grid' }}>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Invoice Status</span>
                <Controller
                  name='draft'
                  control={addressControl}
                  defaultValue='false'
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value}
                      onChange={e => {
                        field.onChange(e.target.value)
                      }}
                     
                    >
                      <MenuItem value={'false'}>draft</MenuItem>
                      <MenuItem value={'true'}>Invoice</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </>
    )
  }
)
export default InvoiceCreateStepercard
