import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import PhpBaseUrl from 'src/commonExports/apiPhpUrl'
import { AuthContext } from 'src/context/AuthContext'
import { dispatch } from 'src/store'
import { fetchUserProfile } from 'src/store/apps/admin'
import * as yup from 'yup'

const states = [
  'Tamil Nadu',
  'Maharashtra',
  'Uttar Pradesh',
  'Gujarat',
  'Rajasthan',
  'Karnataka',
  'Kerala',
  'West Bengal',
  'Bihar',
  'Andhra Pradesh'
]

const cities: Record<string, string[]> = {
  TamilNadu: [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Erode',
    'Tiruppur',
    'Vellore',
    'Thoothukudi'
  ],
  Maharashtra: [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Nashik',
    'Thane',
    'Aurangabad',
    'Solapur',
    'Kolhapur',
    'Amravati',
    'Navi Mumbai'
  ],
  UttarPradesh: [
    'Lucknow',
    'Kanpur',
    'Varanasi',
    'Agra',
    'Allahabad',
    'Meerut',
    'Bareilly',
    'Aligarh',
    'Moradabad',
    'Ghaziabad'
  ],
  Gujarat: [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Junagadh',
    'Gandhinagar',
    'Jamnagar',
    'Nadiad',
    'Anand'
  ],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur', 'Sikar', 'Jaisalmer'],
  Karnataka: [
    'Bengaluru',
    'Mysuru',
    'Mangalore',
    'Hubli-Dharwad',
    'Belagavi',
    'Kalaburagi',
    'Davangere',
    'Shivamogga',
    'Tumakuru',
    'Ballari'
  ],
  Kerala: [
    'Thiruvananthapuram',
    'Kochi',
    'Kozhikode',
    'Thrissur',
    'Alappuzha',
    'Palakkad',
    'Kannur',
    'Kollam',
    'Kottayam',
    'Malappuram'
  ],
  WestBengal: [
    'Kolkata',
    'Asansol',
    'Durgapur',
    'Siliguri',
    'Howrah',
    'Darjeeling',
    'Malda',
    'Haldia',
    'Kharagpur',
    'Chandannagar'
  ],
  Bihar: [
    'Patna',
    'Gaya',
    'Bhagalpur',
    'Muzaffarpur',
    'Darbhanga',
    'Arrah',
    'Begusarai',
    'Katihar',
    'Munger',
    'Chhapra'
  ],
  AndhraPradesh: [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Tirupati',
    'Kurnool',
    'Nellore',
    'Rajahmundry',
    'Kadapa',
    'Anantapur',
    'Eluru'
  ]
}

interface FormValues {
  pan: any
  gst: any
  mobile: any
  gender: any
  lastname: any
  firstname: any
  dob: any
  email(email: any): unknown
  company_name: string
  address: string
  city: string
  state: string
  postal_code: string
  tagline: string
  website: string
  logo: string
}

const CompanyCard = () => {
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [previewImage, setPreviewImage] = useState<any | null>(null)
  const [selectedState, setSelectedState] = useState<string>('')
  const [cityOptions, setCityOptions] = useState<string[]>([])
  const [btnLoadding, setBtnLoading] = useState<any>(false)
  const { getCustomerApi }: any = useContext(AuthContext)
  const [formChanged, setFormChanged] = useState(false)

  const selectedMode = localStorage.getItem('selectedMode') || 'light'
  const textColor = selectedMode === 'dark' ? '#2f3349' : 'white'
  const tempUserData = typeof window !== 'undefined' ? window.localStorage.getItem('userData') : null
  const userData = tempUserData ? JSON.parse(tempUserData) : null

  const schema = yup.object().shape({
    company_name: yup.string().required('Company Name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postal_code: yup
      .string()
      .matches(/^[1-9][0-9]{5}$/, 'Invalid PinCode')
      .required('PinCode is required'),
    tagline: yup.string().max(150, 'Tagline cannot exceed 150 characters'),
    website: yup.string().url('Invalid website URL').required('Website is required')
    // logo: yup.string().required('logo is required')
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: userData.company_name != undefined ? userData.company_name : '',
      address: userData.address != undefined ? userData.address : '',
      city: userData.city != undefined ? userData.city : '',
      state: userData.state != undefined ? userData.state : '',
      postal_code: userData.postal_code != undefined ? userData.postal_code : '',
      tagline: userData.tagline != undefined ? userData.tagline : '',
      website: userData.website != undefined ? userData.website : '',
      logo: userData.logo != undefined ? userData.logo : ''
    }
  })

  useEffect(() => {
    setPreviewImage(userData.logo)
  }, [])

  useEffect(() => {
    // Whenever form data changes, set formChanged to true
    if (isDirty) {
      setFormChanged(true)
    }
  }, [isDirty])

  const selectedStateValue = watch('state')

  useEffect(() => {
    setCityOptions(selectedStateValue ? cities[selectedStateValue] : [])
  }, [selectedStateValue, setValue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.')
        return
      }
      if (file.size > 50 * 1024) {
        toast.error(`File size exceeds the maximum limit (50KB)`)
        return
      }
      setSelectedFile(file)
      setFormChanged(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormValues) => {
    data.email = userData.email
    data.logo = selectedFile
    ;(data.firstname = userData?.firstname || ''),
      (data.lastname = userData?.lastname || ''),
      (data.gender = userData?.gender || ''),
      (data.mobile = userData?.mobile || ''),
      (data.gst = userData?.gst || ''),
      (data.pan = userData?.pan || ''),
      (data.dob = userData && userData?.dob ? userData.dob : '')
    setBtnLoading(true)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value))
      const response = await ApiClient.post(`${PhpBaseUrl}/updateCustomer`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // setBtnLoading(false)

      if (response.status === 200) {
        setBtnLoading(false)
        setFormChanged(false)
        toast.success('Profile updated successfully')
        getCustomerApi(userData.email)
        reset(data)
        dispatch(fetchUserProfile())
      } else {
        toast.error('Error updating profile. Please try again.')
      }
    } catch (error) {
      setFormChanged(false)
      setBtnLoading(false)
      console.error('Error submitting form:', error)
      toast.error('Error submitting form')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title='Company Information' />
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                {/* Company Name */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='company_name'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Company Name'
                        error={Boolean(errors.company_name)}
                        helperText={errors.company_name?.message}
                      />
                    )}
                  />
                </Grid>

                {/* address */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='address'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='address'
                        error={Boolean(errors.address)}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Grid>

                {/* state */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.state)} sx={{ background: textColor }}>
                      State
                    </InputLabel>
                    <Controller
                      name='state'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || ''}
                          onChange={e => {
                            field.onChange(e)
                            setSelectedState(e.target.value)
                          }}
                          error={Boolean(errors.state)}
                        >
                          {states.map(state => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.state && <Typography color='error'>{errors.state.message}</Typography>}
                  </FormControl>
                </Grid>

                {/* city */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.city)} sx={{ background: textColor }}>
                      City
                    </InputLabel>
                    <Controller
                      name='city'
                      control={control}
                      render={({ field }) => (
                        <Select {...field} value={field.value || ''} error={Boolean(errors.city)}>
                          {cities.TamilNadu.map(city => (
                            <MenuItem key={city} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.city && <Typography color='error'>{errors.city.message}</Typography>}
                  </FormControl>
                </Grid>

                {/* postal_code */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='postal_code'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Postal Code'
                        error={Boolean(errors.postal_code)}
                        helperText={errors.postal_code?.message}
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // Restrict input to numbers only
                          e.target.value = e.target.value.replace(/[^0-9]/g, '')

                          // Limit input to 6 digits
                          if (e.target.value.length > 6) {
                            e.target.value = e.target.value.slice(0, 6)
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* tagline */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='tagline'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Tagline'
                        error={Boolean(errors.tagline)}
                        helperText={errors.tagline?.message}
                      />
                    )}
                  />
                </Grid>

                {/* website */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='website'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Website'
                        error={Boolean(errors.website)}
                        helperText={errors.website?.message}
                      />
                    )}
                  />
                </Grid>

                {/* logo Upload */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="start" flexDirection="column">
                    <Box sx={{ display: "flex",alignItems:"center" }}>
                      <Button variant="contained" component="label" sx={{height:"38px"}}>
                        Upload Logo
                        <input hidden type='file' onChange={handleFileChange} />
                      </Button>
                      {previewImage ? (
                        <Avatar src={previewImage} alt='Logo Preview' sx={{ width: 64, height: 64, marginLeft: 2 }} />
                      ) : (
                        <Avatar
                          src='/images/ProfileImage.png'
                          alt='Logo Preview'
                          sx={{ width: 64, height: 64, marginLeft: 2, objectFit: 'contain' }}
                        />
                      )}
                    </Box>
                    <Typography variant='body2' sx={{ marginTop: '10px' }}>
                      Allowed PNG, JPEG, or JPG. Max size of 50KB.
                    </Typography>
                  </Box>
                  {errors.logo && <Typography color='error'>{errors.logo.message}</Typography>}
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' size='large' variant='contained' disabled={!formChanged}>
                {btnLoadding ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={16} style={{ marginRight: '5px' }} color='inherit' />
                    <span>Save</span>
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CompanyCard
