import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { MenuItem, Select } from '@mui/material'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import Icon from 'src/@core/components/icon'
import Autocomplete from '@mui/material/Autocomplete'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import axios from 'axios'
import PlacesAutocomplete from 'react-places-autocomplete'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'
import InputIcon from 'react-multi-date-picker/components/input_icon'

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
  pickup_date: any
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
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAJDyvS5KNpnvnegYaDI63SpMlSezrM9iE'

interface MainTextMatchedSubstrings {
  offset: number
  length: number
}
interface StructuredFormatting {
  main_text: string
  secondary_text: string
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[]
}

const Jobstepercard: React.FC<jobProps> = forwardRef<JobstepercardInfoMethods, jobProps>(
  ({ editId, setEditId, handleNext }, ref) => {
  

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
    const { id: routerId } = router.query
    const [selectedTime, setSelectedTime] = useState('')
    const [createdId, setCreatedId] = useState<any>(null)
    const [PricingCat, setPricingCat] = useState<any>([])
    const [getCustomerlist, setCustomerlist] = useState<any>([])
    const [pickuplat, setpickuplat] = React.useState<number>(0)
    const [pickuplang, setpickuplang] = React.useState<number>(0)
    const [droplat, setdroplat] = React.useState<number>(0)
    const [droplang, setdroplang] = React.useState<number>(0)
    const [currentVal, setCurrentVal] = useState('')
    const [jobVal, setJobVal] = useState<any>('')
    const [jobnewId, setJobNewId] = useState<any>('')
    const [comapnyId, setComapanyId] = useState<any>([])
    const [pricingId, setPricingId] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const getCoordinates = async (location: string): Promise<{ latitude: number; longitude: number } | null> => {
      try {
        const apiKey = GOOGLE_MAPS_API_KEY
        const encodedLocation = encodeURIComponent(location)
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`
        const response = await axios.get(apiUrl)
        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location

          return { latitude: lat, longitude: lng }
        } else {
          throw new Error('No coordinates found for the location')
        }
      } catch (error) {
        console.error(error)

        return null
      }
    }

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
      
          setValue('invoiceid', response[0].Prefix + '' + response[0].CurrentValue)
          setJobVal(response[0].Prefix + '' + response[0].CurrentValue)
          setCurrentVal(response[0].CurrentValue)
          setJobNewId(response[0].ID)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    const updateData = () => {
      const query = `
      mutation my {
        updateBillSettings5AAB(input: {CurrentValue:${currentVal + 1}, ID:${jobnewId}}) {
          CurrentValue
          ID
          Format
          InsertedBy
          InsertedUserId
          Prefix
          Type
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
        // console.log(res.data)
      })
    }

    const Fetchpricecat = () => {
      const query = `query MyQuery {
        listPricing5AABS(filter: {Status: {eq: true}}) {
          items {
            CId
            ID
            PricePerUOM
            RiskFactors
            Status
            Title
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          setPricingCat(res.data.data.listPricing5AABS.items)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    const Fetchcuslist = () => {
      const query = `query MyQuery {
        listCustomer5AABS(filter: {Status: {eq: true},Deleted: {ne : true}}) {
          items {
            CId
            CompanyName
            FirstName
            LastName
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
    
          setCustomerlist(res.data.data.listCustomer5AABS.items)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    const convertTo24HourFormat = (time12Hour: any) => {
      const [time, modifier] = time12Hour.split(' ')
      const [hours, minutes] = time.split(':')
      let updatedHours = hours
      if (modifier === 'PM' && hours !== '12') {
        updatedHours = String(Number(hours) + 12)
      }
      if (modifier === 'AM' && hours === '12') {
        updatedHours = '00'
      }

      return `${hours}:${minutes}`
    }

    const FetchData_job = async (editId: any) => {
      try {
        setLoading(true)
        const query = `query MyQuery {
          getJobInvoice5AAB(ID:${editId}) {
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

        if (editId !== 'new') {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.getJobInvoice5AAB) {
            const {
              InvoiceId,
              PriceCategory,
              Status,
              Customer,
              PickupLocation,
              DropLocation,
              PickupTime,
              Description,
              Draft,
              PickupDate,
              KM,
              DueDate
            } = res.data.data.getJobInvoice5AAB

            setValue('price_category', parseFloat(PriceCategory))
            setPricingId(PriceCategory)
            setValue('invoiceid', InvoiceId)
            setJobVal(InvoiceId)
            setValue('customer_id', parseFloat(Customer))
            setComapanyId(Customer)
            setValue('pickup_location', PickupLocation)
            setValue('drop_location', DropLocation)
            const pickupTimeFromApi = PickupTime
            const convertedTime = convertTo24HourFormat(pickupTimeFromApi)
            setValue('pickup_time', convertedTime)
            trigger('pickup_time')
            setSelectedTime(convertedTime)
            trigger('pickup_time')
            setValue('description', Description)
            setValue('pickup_date', PickupDate)
            setValue('due_date', DueDate)
            setValue('km', KM)
            const newPickupDate = PickupDate
            setValue('pickup_date', newPickupDate)
            setValue('status', Status)
            setValue('draft', Draft)
          }

          if (editId !== 'new' && res.data.data.getJobInvoice5AAB) {
            const urlParams = new URLSearchParams(router.query)
            urlParams.set('id', editId)
            const newUrl = `${router.pathname}?${urlParams.toString()}`
            router.replace(newUrl)
          }
        }
      } catch (error) {
        setLoading(false)
      }
    }

    useEffect(() => {
      Fetchpricecat()
      Fetchcuslist()
    }, [])

    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search)
      const urlId = queryParams.get('id')
      const idToUse = urlId === 'new' ? urlId : urlId || 'new'
      if (idToUse) {
        FetchData_job(idToUse)
      }
      if (editId) {
        FetchData_job(editId)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId])

    useEffect(() => {
      if (editId == 0 || editId == null) {
        FetchNextjobid()
      }
      if (editId != null) {
        setCreatedId(editId)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId])

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
      pickup_date: null,
      due_date: null
    }
    const handleTimeChange = (event: any) => {
      const timeValue = event.target.value
      setSelectedTime(timeValue)
      setValue('pickup_time', timeValue)
      trigger('pickup_time')
    }
    const addressSchema = yup.object().shape({
      customer_id: yup.string().required('Customer Name is required'),
      price_category: yup.string().required('Pricing Category is required'),
      pickup_location: yup.string().required('Pickup Location is required'),
      drop_location: yup.string().required('Drop Location is required'),
      km: yup.string().required(),
      description: yup.string().required(),
      pickup_date: yup.string().required('Pickup Date is required'),
      due_date: yup.string().required('Pickup Date is required'),
      pickup_time: yup
        .string()
        .required('Pickup time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      status: yup.string().required('Status is required').nullable(),
      draft: yup.string().required('Invoice status is required').nullable()
    })
    const {
      control: addressControl,
      formState: { errors: addressErrors },
      handleSubmit,
      setValue,
      trigger,
      watch
    } = useForm<any>({
      defaultValues: defaultAddressValues,
      resolver: yupResolver(addressSchema)
    })

    const handleSelect = async (address: any, type: any) => {
      if (type === 'pickup') {
        setValue('pickup_location', address)
      } else if (type === 'drop') {
        setValue('drop_location', address)
      }
      await FindKM(address, type)
      async function FindKM(data: string | undefined, type: string) {
        if (data !== undefined) {
          try {
            const coordinates = await getCoordinates(data)
            if (coordinates) {
              if (type === 'pickup') {
                setpickuplat(coordinates.latitude)
                setpickuplang(coordinates.longitude)
                const res = calculateDistance(coordinates.latitude, coordinates.longitude, droplat, droplang)
                setValue('km', res)
              } else if (type === 'drop') {
                setdroplat(coordinates.latitude)
                setdroplang(coordinates.longitude)
                const res = calculateDistance(pickuplat, pickuplang, coordinates.latitude, coordinates.longitude)
                setValue('km', res)
              }
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmitForm)()
        setEditId(createdId)
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
      const formattedDateTime = `${year}-${month}-${day}`
      await trigger()
      const dropCoordinatesPromise = getCoordinates(data.drop_location)
      const pickupCoordinatesPromise = getCoordinates(data.pickup_location)
      try {
        const [dropCoordinates, pickupCoordinates] = await Promise.all([
          dropCoordinatesPromise,
          pickupCoordinatesPromise
        ])
        const dropLat = dropCoordinates?.latitude || ''
        const dropLng = dropCoordinates?.longitude || ''
        const pickupLat = pickupCoordinates?.latitude || ''
        const pickupLng = pickupCoordinates?.longitude || ''
        const statusvalue = data.status === "true" ? true : data.status === "false" ? false : ''
        const draftvalue = data.draft === "true" ? true : data.draft === "false" ? false : ''
        const query =
        routerId === 'new' ?
            `
      mutation my {
        createJobInvoice5AAB(input: {AdditionalCharge: "", AdditionalChargePrice: "", AdditionalChargeRate: "", AssignTo: 10, Customer:${comapnyId}, DateTime: "${formattedDateTime}", Description: "${data.description}", Draft:${draftvalue}, DropLat: "${dropLat}", DropLng: "${dropLng}", DropLocation: "${data.drop_location}", DueDate: "${data.due_date}", EmpQTY1: "", EmpTotal: "", FinalNetTotal: "", IP: "", InvoiceFrom: "", InvoiceId: "${jobVal}", JobIds: "", JobsNew: "", KM:${data.km}, NetTotal: 10, Passup: 10, PickupDate: "${data.pickup_date}", PickupLat: "${pickupLat}", PickupLng: "${pickupLng}", PickupLocation: "${data.pickup_location}", PickupTime: "${data.pickup_time}", PriceCategory:${pricingId}, Status:${statusvalue}, SubTotal: "", Tax: "", TaxId: 10}) {
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
            : `
      mutation my {
        updateJobInvoice5AAB(input: {AdditionalCharge: "", AdditionalChargePrice: "", AdditionalChargeRate: "", AssignTo: 10, Customer:${comapnyId}, DateTime: "${formattedDateTime}", Description: "${data.description}", Draft:${draftvalue}, DropLat: "${dropLat}", DropLng: "${dropLng}", DropLocation: "${data.drop_location}", DueDate: "${data.due_date}", EmpQTY1: "", EmpTotal: "", FinalNetTotal: "", ID:${routerId}, IP: "", InvoiceFrom: "", InvoiceId: "${jobVal}", JobIds: "", JobsNew: "", KM:${data.km}, NetTotal: 10, Passup: 10, PickupDate: "${data.pickup_date}", PickupLat: "${pickupLat}", PickupLng: "${pickupLng}", PickupLocation: "${data.pickup_location}", PickupTime: "${data.pickup_time}", PriceCategory:${pricingId}, Status: ${statusvalue}, SubTotal: "", Tax: "", TaxId: 10}) {
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
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
          toast.success('Invoice Details Updated Successfully')
          if (res.data.data?.createJobInvoice5AAB) {
            const newJobId = res.data.data?.createJobInvoice5AAB.ID

            router.push({
              pathname: '/transactions/invoice/',
              query: { id: newJobId }
            })
            updateData()
            handleNext()

            return newJobId
          } else {
            console.error('createJobInvoice5AAB is null')
          }
        })
      } catch (error) {
        console.error('Error occurred while sending GraphQL mutation:', error)
      }
    }

    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371
      const dLat = deg2rad(lat2 - lat1)
      const dLon = deg2rad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c
      const dist = Math.round(distance)

      return dist
    }

    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180)
    }

    async function FindKM(data: string | undefined, type: string) {
      if (data != undefined) {
        try {
          const coordinatesPromise = getCoordinates(data)
          const coordinates = await coordinatesPromise
          let kmres = 0
          if (coordinates) {
            coordinates.latitude + ',' + coordinates.longitude
            if (type == 'pickup') {
              setpickuplat(coordinates.latitude)
              setpickuplang(coordinates.longitude)
              const res = calculateDistance(coordinates.latitude, coordinates.longitude, droplat, droplang)
              if (res > 0) {
                kmres = res
              }
            }
            if (type == 'drop') {
              setdroplat(coordinates.latitude)
              setdroplang(coordinates.longitude)
              const res = calculateDistance(pickuplat, pickuplang, coordinates.latitude, coordinates.longitude)
              if (res > 0) {
                kmres = res
              }
            }
            setValue('km', kmres)
          }
        } catch (error) {
          console.error(error)
        }
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
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div className='empTextField'>
              <div>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Invoice ID</span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
              </div>
              <Controller
                name='invoiceid'
                control={addressControl}
                rules={{ required: true }}
                render={({ field: { value } }) => <TextField disabled fullWidth size='small' value={value}></TextField>}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='customer_id'
              control={addressControl}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size='small'
                  options={getCustomerlist.sort((a: any, b: any) => a.CompanyName?.localeCompare(b.CompanyName))}
                  getOptionLabel={(option: any) => option?.CompanyName || ''}
                  value={
                    getCustomerlist.find((tax: any) => {
                      const matches = tax?.CId === watch('customer_id')
                      if (matches) {
                      }
                      return matches
                    }) || null
                  }
                  onChange={(_, newValue) => {
                    field.onChange(newValue?.CId || null)
                    setComapanyId(newValue?.CId)
                  }}
                  isOptionEqualToValue={(option, value) => option?.CId === value?.CId}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label={
                        <div>
                          <span style={{ fontSize: '14px', marginBottom: '4px' }}>Customer</span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                    />
                  )}
                />
              )}
            />
            {addressErrors.customer_id && (
              <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                {String(addressErrors.customer_id.message)}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='price_category'
              control={addressControl}
              render={({ field }) => (
                <>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}> Pricing Category</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                  <Autocomplete
                    {...field}
                    options={PricingCat.sort((a: any, b: any) => a.Title?.localeCompare(b.Title))}
                    getOptionLabel={(option: any) => option.Title || ''}
                    value={PricingCat.find((tax: any) => tax?.ID === watch('price_category')) || null}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.ID || null)
                      setPricingId(newValue?.ID)
                    }}
                    isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                    renderInput={params => (
                      <CustomTextField
                        {...params}
                        inputProps={{
                          ...params.inputProps
                        }}
                      />
                    )}
                  />
                  {addressErrors.price_category && (
                    <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                      {String(addressErrors.price_category.message)}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <div>
              <span style={{ fontSize: '14px', marginBottom: '4px' }}>Pickup Date</span>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography>
            </div>
            <div style={{ position: 'relative' }}>
              <Controller
                name='pickup_date'
                control={addressControl}
                render={({ field }) => (
                  <div>
                    <Datepickers
                      id='pickup_date'
                      name='pickup_date'
                      value={formatedDate(field.value)}
                      onChange={e => field.onChange(e ? e.format('YYYY-MM-DD') : null)}
                      placeholder='Select a date'
                      error={addressErrors.pickup_date ? true : false}
                      touched={addressErrors.pickup_date ? true : false}
                      minDate={new Date()}
                      // Add ref to access the date picker input directly
                    
                    />
                    {addressErrors.pickup_date && (
                      <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                        {String(addressErrors.pickup_date.message)}
                      </Typography>
                    )}
                  </div>
                )}
              />
              <div
                style={{ position: 'absolute', top: '6%', right: '3%', cursor: 'pointer' }}
                onClick={() => {
                  const dateInput = document.getElementById('pickup_date');
                  if (dateInput) {
                    dateInput.focus(); // Focus the date picker input to open it
                    // Manually trigger the date picker if needed
                    dateInput.click();
                  }
                }}
              >
                <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
              </div>
            </div>
          </Grid>


          <Grid item xs={6} sm={6}>
            <div>
              <span style={{ fontSize: '14px', marginBottom: '4px' }}>Due Date</span>
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
                      minDate={new Date()}
                    />
                    {addressErrors.due_date && (
                      <Typography variant='caption' color='error' sx={{ mt: 1 }}>
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
                  dateInput.focus(); // Focus the date picker input to open it
                  // Manually trigger the date picker if needed
                  dateInput.click();
                }
              }}
              >
                <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
              </div>
            </div>

          </Grid>

          <Grid item xs={12} sm={6}>
            <div>
              <span style={{ fontSize: '14px', marginBottom: '4px' }}>Pickup Time</span>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography>
            </div>
            <div style={{ position: 'relative' }}>
              <Controller
                name='pickup_time'
                control={addressControl}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    sx={{ width: '100%' }}
                    value={selectedTime}
                    onChange={handleTimeChange}
                    placeholder='Select a time'
                    type='time'
                    id='appt'
                    name='pickup_time'
                  />
                )}
              />
              {addressErrors.pickup_time && (
                <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                  {String(addressErrors.pickup_time.message)}
                </Typography>
              )}
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <>
              <div>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}> Pickup Location</span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
              <Controller
                name='pickup_location'
                control={addressControl}
                render={({ field }) => (
                  <PlacesAutocomplete
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    onSelect={address => handleSelect(address, 'pickup')}
                    searchOptions={{}}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <CustomTextField
                          sx={{ width: '100%' }}
                          {...getInputProps({
                            placeholder: 'Search Places ...'
                          })}
                          value={field.value}
                        />
                        <div>
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => (
                            <div key={index}>
                              <div
                                style={{
                                  border: '0.5px solid #dddddd',
                                  padding: '4px',
                                  zIndex: '-1',
                                  backgroundColor: 'inherit',
                                  borderRadius: '2px'
                                }}
                                {...getSuggestionItemProps(suggestion)}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                )}
              />
              {addressErrors.pickup_location && (
                <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                  {String(addressErrors.pickup_location.message)}
                </Typography>
              )}
            </>
          </Grid>

          <Grid item xs={12} sm={4}>
            <>
              <div>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Drop Location</span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
              <Controller
                name='drop_location'
                control={addressControl}
                rules={{ required: true }}
                render={({ field }) => (
                  <PlacesAutocomplete
                    value={field.value}
                    onChange={value => field.onChange(value)}
                    onSelect={address => handleSelect(address, 'drop')}
                    searchOptions={{}}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <CustomTextField
                          sx={{ width: '100%' }}
                          {...getInputProps({
                            placeholder: 'Search Places ...'
                          })}
                        />
                        <div>
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => (
                            <div key={index}>
                              <div
                                style={{
                                  border: '0.5px solid #dddddd',
                                  padding: '4px',
                                  zIndex: '-1',
                                  backgroundColor: 'inherit',
                                  borderRadius: '2px'
                                }}
                                {...getSuggestionItemProps(suggestion)}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                )}
              />
              {addressErrors.drop_location && (
                <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                  {String(addressErrors.drop_location.message)}
                </Typography>
              )}
            </>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <span style={{ fontSize: '14px', marginBottom: '4px' }}>Km</span>
            </div>
            <Controller
              name='km'
              control={addressControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder='Enter your Km...'
                    error={Boolean(addressErrors.km)}
                    aria-describedby='stepper-linear-account-username'
                    {...(addressErrors.km && { helperText: 'This field is required' })}
                  />
                </>
              )}
            />
          </Grid>
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
                  rows={3}
                  fullWidth
                  onChange={onChange}
                  placeholder='Enter Customer Reference'
                  value={value}
                  error={Boolean(addressErrors.description)}
                  aria-describedby='stepper-linear-account-username'
                  {...(addressErrors.description && { helperText: 'Customer Reference is required' })}
                ></TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: "grid" }}>
            <span style={{ fontSize: '14px' }}>Status</span>
            <Controller
              name='status'
              control={addressControl}
              defaultValue='false'
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onChange={e => {
                    field.onChange(e.target.value === 'true')
                  }}
                >
                  <MenuItem value={'true'}>Paid</MenuItem>
                  <MenuItem value={'false'}>Not Paid</MenuItem>
                </Select>
              )}
            />
            {addressErrors.status && (
              <Typography
                variant='caption'
                color='error'
                sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
              >
                {String(addressErrors.status.message)}
              </Typography>
            )}
          </Grid>

          {routerId === 'new' || routerId === null ? (

            <Grid item xs={12} sm={3} sx={{ display: "grid" }}>
              <span style={{ fontSize: '14px' }}>Invoice Status</span>
              <Controller
                name='draft'
                control={addressControl}
                defaultValue='false'
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    onChange={e => {
                      field.onChange(e.target.value === 'true')
                    }}
                  >
                    <MenuItem value={'false'}>draft</MenuItem>

                  </Select>
                )}
              />
              {addressErrors.draft && (
                <Typography
                  variant='caption'
                  color='error'
                  sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
                >
                  {String(addressErrors.draft.message)}
                </Typography>
              )}
            </Grid>
          ) : (

            <Grid item xs={12} sm={3} sx={{ display: "grid" }}>
              <span style={{ fontSize: '14px' }}>Invoice Status</span>
              <Controller
                name='draft'
                control={addressControl}
                defaultValue='false'
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    onChange={e => {
                      field.onChange(e.target.value === 'true')
                    }}
                  >
                    <MenuItem value={'false'}>draft</MenuItem>
                    <MenuItem value={'true'}>Invoice</MenuItem>
                  </Select>
                )}
              />
              {addressErrors.draft && (
                <Typography
                  variant='caption'
                  color='error'
                  sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
                >
                  {String(addressErrors.draft.message)}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </form>
    )
  }
)

export default Jobstepercard
