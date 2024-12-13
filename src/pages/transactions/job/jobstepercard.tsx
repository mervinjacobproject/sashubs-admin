import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, MenuItem, Select } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import PlacesAutocomplete from 'react-places-autocomplete'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import * as yup from 'yup'
import InputIcon from 'react-multi-date-picker/components/input_icon'

interface AddressValues {
  JobID: string
  customer: string
  price_category: string
  job_notes: string
  pickup_time: string
  km: number
  cusreference: string
  status_result: any
  pickup_location: any
  drop_location: any
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
  jobId: any
  setJobId: any
  setCusJobId: any
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAJDyvS5KNpnvnegYaDI63SpMlSezrM9iE'

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const Jobstepercard: React.FC<jobProps> = forwardRef<JobstepercardInfoMethods, jobProps>(
  ({ editId, setEditId, handleNext, setJobId, setCusJobId }, ref) => {
    const formatedDate = (dateString: any) => {
      if (!dateString) return ''; // Handle empty input

      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) return '';

      // Format the date as DD/MM/YYYY
      const formattedDate = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      return formattedDate;
    }

    const todayStartOfDay = new Date();
    todayStartOfDay.setHours(0, 0, 0, 0);

    const router: any = useRouter()
    const { id: routerId } = router.query
 
   
    const [selectedTime, setSelectedTime] = useState('')
    const [createdId, setCreatedId] = useState<any>(null)
    const [PricingCat, setPricingCat] = useState<any>([])
    const [getCustomerlist, setCustomerlist] = useState<any>([])
    const [comapnyId, setComapanyId] = useState<any>([])
    const [pricingId, setPricingId] = useState<any>([])
    const [pickuplat, setpickuplat] = React.useState<number>(0)
    const [pickuplang, setpickuplang] = React.useState<number>(0)
    const [droplat, setdroplat] = React.useState<number>(0)
    const [droplang, setdroplang] = React.useState<number>(0)
    const [jobVal, setJobVal] = useState<any>('')
    const [valId, setValId] = useState('')
    const [valCid, setValCid] = useState<any>('')
    const [currentVal, setCurrentVal] = useState('')
    const [loading, setLoading] = useState(false)
    const [minTime, setMinTime] = React.useState<string>('00:00'); // Initial time

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
        listBillSettings5AABS(filter: {Type: {eq: "Job"}}) {
          items {
            Format
            CurrentValue
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
          setValue('JobID', response[0].Prefix + '' + response[0].CurrentValue)
          setJobVal(response[0].Prefix + '' + response[0].CurrentValue)
          setCusJobId(response[0].Prefix + '' + response[0].CurrentValue)
          setCurrentVal(response[0].CurrentValue)
        })

        .catch((err: any) => {
          //  hi
        })
    }

    const updateData = () => {
      const query = `mutation my {
        updateBillSettings5AAB(input: {CurrentValue: ${currentVal + 1}, ID: 6278}) {
          CurrentValue
          Format
          ID
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
          setValId(res.data.data.listPricing5AABS.items[0].ID)
        })
        .catch((err: any) => {
          //  hi
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
          setValCid(res.data.data.listCustomer5AABS.items[0].ID)
        })
        .catch((err: any) => {
          //  hi
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
          getJobsNew5AAB(ID: ${editId}) {
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
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        if (editId !== 'new') {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setLoading(false)
          if (res.data.data.getJobsNew5AAB) {
            const {
              JobId,
              PriceCategory,
              Status,
              Customer,
              PickupLocation,
              DropLocation,
              PickupTime,
              JobNotes,
              CusReference,
              PickupDate,
              KM
            } = res.data.data.getJobsNew5AAB

            setValue('price_category', parseFloat(PriceCategory))
            setPricingId(PriceCategory)
            setValue('JobID', JobId)
            setJobVal(JobId)
            setValue('customer', parseFloat(Customer))
            setComapanyId(Customer)
            setValue('pickup_location', PickupLocation)
            setValue('drop_location', DropLocation)
            const pickupTimeFromApi = PickupTime
            const convertedTime = convertTo24HourFormat(pickupTimeFromApi)
            setValue('pickup_time', convertedTime)
            trigger('pickup_time')
            setSelectedTime(convertedTime)
            trigger('pickup_time')
            setValue('job_notes', JobNotes)
            setValue('cusreference', CusReference)
            setValue('pickup_date', PickupDate)
            setValue('km', KM)
            const newPickupDate = PickupDate
            setValue('pickup_date', newPickupDate)
            setValue('status', Status)
          }
          if (editId !== 'new' && res.data) {
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
      const queryParams = new URLSearchParams(window.location.search)
      const urlId = queryParams.get('id')
      const idToUse = urlId === 'new' ? urlId : urlId || 'new'
      if (idToUse) {
        FetchData_job(idToUse)
      }
      if (editId) {
        FetchData_job(editId)
      }
      if (!editId) {
        setLoading(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId])

    useEffect(() => {
      Fetchpricecat()
      Fetchcuslist()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
      JobID: '',
      customer: '',
      price_category: '',
      job_notes: '',
      pickup_time: '',
      cusreference: '',
      km: 0,
      status_result: 0,
      pickup_location: '',
      drop_location: '',
      pickup_date: null
    }
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event && event.target) {
        const timeValue = event.target.value;
        setSelectedTime(timeValue);
        setValue('pickup_time', timeValue);
        trigger('pickup_time');
      } else {
        console.error('Invalid event object:', event);
      }
    };

    const addressSchema = yup.object().shape({
      customer: yup.string().required('Customer Field is required'),
      price_category: yup.string().required('Price Category is required'),
      pickup_location: yup.string().required('Pickup location is required'),
      drop_location: yup.string().required('Drop location is required'),
      km: yup.string().required('Km is required'),
      cusreference: yup.string().required('Customer Reference is required'),
      pickup_date: yup.string().required('Pickup date is required'),
      pickup_time: yup
        .string()
        .required('Pickup time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      status: yup.string().required('Status is required').nullable()
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
            //  hi
          }
        }
      }
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmitForm)()
        setEditId(createdId)
        handleNext()
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
        const statusvalue = data.status === '1' ? 1 : data.status === '2' ? 2 : 5
        const query =
          routerId === 'new'
            ? `mutation my {
        createJobsNew5AAB(input: {AdditionChargeId: 10,InvoiceType:0, CusReference: "${data.cusreference}", Customer: "${comapnyId}", DateTime: "${formattedDateTime}", CreatedDate:"${formattedDateTime}", Description: "", DropIng: "${dropLng}", DropLat: "${dropLat}", DropLocation: "${data.drop_location}", EmpQty1: "", EmpTotal: "", FinalNetTotal: "", IP: "", JobId: "${jobVal}", JobNotes: "${data.job_notes}", JobStatus: "", KM: "${data.km}",  PickupIng: "${pickupLng}", PickupDate: "${data.pickup_date}", PickupLat: "${pickupLat}", PickupLocation: "${data.pickup_location}", PickupTime: "${data.pickup_time}", PriceCategory: "${pricingId}", Status: ${statusvalue}}) {
          AdditionChargeId
          AdditionalChargePrice
          AdditionalChargeRate
          CreatedDate
          AssignTo
          CusReference
          Customer
          DateTime
          Description
          DropIng
          DropLat
          DropLocation
          EmpQty1
          EmpTotal
          IP
          ID
          FinalNetTotal
          JobId
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
      }`
            : `mutation my {
        updateJobsNew5AAB(input: {AdditionChargeId: 10, ID:${routerId}, CusReference: "${data.cusreference}", Customer: "${comapnyId}", DateTime: "${formattedDateTime}",   CreatedDate:"${formattedDateTime}", DropIng: "${dropLng}", DropLat: "${dropLat}", DropLocation: "${data.drop_location}",  JobId: "${jobVal}", JobNotes: "${data.job_notes}",  KM: "${data.km}",  PickupIng: "${pickupLng}", PickupDate: "${data.pickup_date}", PickupLat: "${pickupLat}", PickupLocation: "${data.pickup_location}", PickupTime: "${data.pickup_time}", PriceCategory: "${pricingId}", Status: ${statusvalue}}) {
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
      }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        ApiClient.post(`${AppSink}`, { query }, { headers }).then(res => {
          if (res.data.data.createJobsNew5AAB) {
            const newJobId = res.data.data?.createJobsNew5AAB?.ID

            if (router.pathname !== '/transactions/job/jobdetails') {
              router.push({
                pathname: '/transactions/job/',
                query: { id: newJobId }
              })
            }
            setJobId(newJobId)
            updateData()
            handleNext()
            toast.success('Job Details Added Successfully')
            return newJobId
          } else if (res.data.data.updateJobsNew5AAB) {
            const updateId = res.data.data?.updateJobsNew5AAB?.ID
            if (router.pathname !== '/transactions/job/jobdetails') {
              router.push({
                pathname: '/transactions/job/',
                query: { id: updateId }
              })
            }
            toast.success('Job Details Updated Successfully')
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
          <div style={{ height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <div className='empTextField'>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}>Job ID</span>
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ fontSize: '17px', marginLeft: '2px' }}
                    ></Typography>
                  </div>
                  <Controller
                    name='JobID'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <TextField disabled fullWidth size='small' value={value}></TextField>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='customer'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      size='small'
                      options={getCustomerlist.sort((a: any, b: any) => a.CompanyName?.localeCompare(b.CompanyName))}
                      getOptionLabel={(optioncustomer: any) => optioncustomer?.CompanyName || ''}
                      value={
                        getCustomerlist.find((tax: any) => {
                          const matches = tax?.CId === watch('customer')
                          if (matches) {
                          }
                          return matches
                        }) || null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.CId || null)
                        setComapanyId(newValue?.CId)
                      }}
                      isOptionEqualToValue={(optioncustomer, value) => optioncustomer?.CId === value?.CId}
                      renderInput={params => (
                        <CustomTextField
                          {...params}
                          error={Boolean(addressErrors.customer) && !field.value}
                          helperText={addressErrors.customer && !field.value ? 'Customer field is required' : ''}
                          label={
                            <div>
                              <span style={{ fontSize: '14px', marginBottom: '4px' }}>Company Name</span>
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
                        <Typography
                          variant='caption'
                          color='error'
                          sx={{ fontSize: '17px', marginLeft: '2px' }}
                        ></Typography>
                      </div>
                      <Autocomplete
                        {...field}
                        options={PricingCat.sort((a: any, b: any) => a.Title?.localeCompare(b.Title))}
                        getOptionLabel={(option: any) => option.Title || ''}
                        value={PricingCat.find((pricevalue: any) => pricevalue?.ID === watch('price_category')) || null}
                        onChange={(_, newValue) => {
                          field.onChange(newValue?.ID || null)
                          setPricingId(newValue?.ID)
                        }}
                        isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            error={Boolean(addressErrors.price_category) && !field.value}
                            helperText={addressErrors.price_category && !field.value ? 'Pricing field is required' : ''}
                            inputProps={{
                              ...params.inputProps
                            }}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <div>
                  <span style={{ fontSize: '14px', marginBottom: '4px' }}>Pickup date</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                </div>
                <div style={{ position: 'relative' }}>
                  <Controller
                    name='pickup_date'
                    control={addressControl}
                    defaultValue='' // Ensure default value is provided
                    render={({ field }) => {
                      // Ensure field.value is defined
                      const dateValue = field.value || '';

                      return (
                        <div>
                          <Datepickers
                            id='pickup_date'
                            name='pickup_date'
                            value={formatedDate(dateValue)}
                            onChange={(e) => {
                              const selectedDate = new Date(e ? e.format('YYYY-MM-DD') : '');
                              const today = new Date();
                              today.setHours(0, 0, 0, 0); // Set to start of the day

                              if (selectedDate >= today) {
                                const currentTime = new Date();
                                const currentTimeString = currentTime.toTimeString().slice(0, 5); // Format time as HH:MM
                                setMinTime(currentTimeString); // Set min time to the current time
                              } else {
                                setMinTime('00:00'); // Reset to midnight for other dates
                              }

                              field.onChange(e ? e.format('YYYY-MM-DD') : null);
                            }}
                            placeholder='Select a date'
                            error={Boolean(addressErrors.pickup_date)}
                            touched={Boolean(addressErrors.pickup_date)}
                            minDate={todayStartOfDay} // Pass a Date object
                            style={{
                              width: '100%' // Ensure the input takes up space and is focusable
                            }}
                          />
                        </div>
                      );
                    }}
                  />
                  <div
                    style={{ position: 'absolute', top: '6%', right: '3%', cursor: 'pointer' }}
                    onClick={() => {
                      setTimeout(() => {
                        const dateInput = document.getElementById('pickup_date');
                        if (dateInput) {
                          dateInput.focus(); // Focus the date picker input to open it
                        }
                      }, 0);
                    }}
                  >
                    <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Controller
                  name='pickup_time'
                  control={addressControl}
                  defaultValue='' // Ensure default value is provided
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      sx={{ width: '100%', fontSize: '14px' }}
                      value={field.value || selectedTime}
                      onChange={handleTimeChange}
                      placeholder='Select a time'
                      type='time'
                      id='appt'
                      name='pickup_time'
                      label='Pickup Time'
                      inputProps={{
                        min: minTime, // Set the minimum selectable time dynamically
                      }}
                    />
                  )}
                />
                {addressErrors.pickup_time && (
                  <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                    {String(addressErrors.pickup_time.message)}
                  </Typography>
                )}
              </Grid>

             <Grid item xs={12} sm={6}>
                <>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}> Pickup location</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      {' '}
                      *{' '}
                    </Typography>
                  </div>
                  <Controller
                    name='pickup_location'
                    control={addressControl}
                    rules={{ required: true }}
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
                              {suggestions.map((suggestion, index) => {
                                return (
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
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                    )}
                  />
                  {addressErrors.pickup_location && (
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
                    >
                      {String(addressErrors.pickup_location.message)}
                    </Typography>
                  )}
                </>
              </Grid>

              <Grid item xs={12} sm={4}>
                <>
                  <div>
                    <span style={{ fontSize: '14px', marginBottom: '4px' }}>Drop location</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      {' '}
                      *{' '}
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
                              {suggestions.map((suggestionlocation, i) => (
                                <div key={i}>
                                  <div
                                    style={{
                                      border: '0.5px solid #dddddd',
                                      padding: '4px',
                                      zIndex: '-1',
                                      backgroundColor: 'inherit',
                                      borderRadius: '2px'
                                    }}
                                    {...getSuggestionItemProps(suggestionlocation)}
                                  >
                                    {suggestionlocation.description}
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
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ color: '#EA5455', fontSize: '13px', fontWeight: '100' }}
                    >
                      {String(addressErrors.drop_location.message)}
                    </Typography>
                  )}
                </>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Controller
                  name='km'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <CustomTextField
                        fullWidth
                        value={value}
                        label='Km'
                        onChange={onChange}
                        placeholder='Km'
                        error={Boolean(addressErrors.km)}
                        aria-describedby='stepper-linear-account-username'
                        {...(addressErrors.km && { helperText: 'km is required' })}
                      />
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <span style={{ fontSize: '14px', marginBottom: '4px' }}>Customer Reference</span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
                <Controller
                  name='cusreference'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      id='cusreference'
                      name='cusreference'
                      aria-multiline
                      multiline
                      rows={3}
                      fullWidth
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                        }
                      }}
                      onChange={e => onChange(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                      placeholder='Enter Customer Reference'
                      value={value}
                      error={Boolean(addressErrors.cusreference)}
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.cusreference && { helperText: 'Customer Reference is required' })}
                    ></CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Status </Typography>
                <Controller
                  name='status'
                  control={addressControl}
                  defaultValue=''
                  render={({ field }) => (
                    <div>
                      <Select
                        {...field}
                        value={field.value}
                        onChange={e => {
                          field.onChange(e.target.value)
                        }}
                      >
                        <MenuItem value={2}>Completed</MenuItem>
                        <MenuItem value={1}>Waiting</MenuItem>
                        <MenuItem value={5}>Ongoing</MenuItem>
                      </Select>
                    </div>
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
            </Grid>
          </form>
        )}
      </>
    )
  }
)

export default Jobstepercard
