import { useState, ElementType, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { dispatch } from 'src/store'
import { useSelector } from 'react-redux'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Avatar } from '@mui/material'
import toast from 'react-hot-toast'
import uploadFileToS3 from 'src/pages/apps/employee/employee-details/uploadImageS3'
import AppSink from 'src/commonExports/AppSink'
import { fetchUserProfile, selectUserProfile } from 'src/store/apps/admin'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface FormValues {
  FirstName: string
  LastName: string
  Email: string
  Mobile: any
  Address1: string
  Address2: string
  SubURB: string
  PostCode: string
  Country: any
  State: string


}

const EmployeeAccount = () => {
  const userProfileState = useSelector(selectUserProfile)


  const loginId = localStorage.getItem('adminLoginId')
  useEffect(() => {
    dispatch(fetchUserProfile())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])



  const [nameValue, setNameValue] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [countries, setCountries] = useState<any>([])
  const [state, setState] = useState<any>([])
  const [subUrb, setSubUrb] = useState<any>([])
  const [userDetails, setUserDetails] = useState<any>([])
  const [modalOpenDelete, setModalOpenDelete] = useState(false)

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const handleDeleteConfirm = () => {
    handleDelete()
    setModalOpenDelete(false)
  }

  const profileImageUrl =  userProfileState?.data?.[0]?.ProfileImage
  const adminEmail = userDetails?.Email
  const adminFirstname = userDetails?.FirstName
  const adminMobileNumber = userDetails?.Mobile
  const adminPostcode = userDetails?.PostCode
  const adminAddress1 = userDetails?.Address1
  const adminAddress2 = userDetails?.Address2
  const adminSuburb = userDetails?.SubURB
  const adminState = userDetails?.State
  const adminCountry = userDetails?.Country
  const adminLastname = userDetails?.LastName
  const adminUserId = userProfileState?.data?.[0]?.UserId

  const loginType = localStorage.getItem('adminLoginId')
  const accountSchema = yup.object().shape({
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    Mobile: yup.string().required(),
    Email: yup.string().email('Invalid Email address').required('Email is required'),
    Address1: yup.string().required(),
    Address2: yup.string().required(),
    PostCode: yup
    .string()
    .matches(/^\d{4}$/, 'Post code must have exactly 4 numbers')
    .required('Postcode is required'),
     State: yup.string().required(),
    Country: yup.string().required()
  })



  const handleUserId = () => {
  const query = `
    query MyQuery {
      listDriver5AABS(filter: {DID: {eq:${adminUserId}}}) {
        items {
          Address1
          Address2
          AppAccess
          Country
          DID
          DOB
          DOJ
          DOT
          Date
          Deleted
          Designation
          DocumentExpiryDate
          DocumentName
          DriverID
          Email
          EmpGroup
          FirstName
          IP
          InsertedBy
          LandLine
          LastName
          License
          LicenseNo
          Mobile
          Password
          Photo
          PostCode
          SalaryDocuments
          SalaryFrequency
          SalaryFromKM
          SalaryPerHour
          SalaryPerSQM
          SalaryPerWeight
          State
          SubURB
          Status
          Title
          UpdatedAt
          UpdatedBy
          UserName
        }
      }
    }
  `;


  const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        const UserDetails = res.data.data.listDriver5AABS.items[0]
        setUserDetails(UserDetails)
       })
      .catch(err => {
        console.error('Error deleting :', err)

      })
  }

  useEffect(() =>{
    handleUserId()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[adminUserId])





  const {
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    setValue,
    formState: { errors: accountErrors }
  } = useForm<FormValues>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      FirstName: adminFirstname || '',
      LastName: adminLastname || '',
      Email: '',
      Mobile: '',
      Address1: '',
      Address2: '',
      SubURB: '',
      State: '',
      Country: '',
      PostCode: ''
    }
  })
  const {
    formState: { }
  } = useForm({ defaultValues: { checkbox: false } })





  useEffect(() => {
    if (adminState) {
      fetchSubUrb(adminState)
    }
  }, [adminState])


  useEffect(() => {
    if (adminCountry) {
      fetchStateData(adminCountry)
    }
  }, [adminCountry])


  const handleStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedStateId = event.target.value as string
    if (selectedStateId) {
      fetchSubUrb(selectedStateId)
    }
  }


  const getCountryNameById = (countryId: any) => {
    if (!Array.isArray(countries)) {
      return null
    }
    const selectedCountry = countries.find(country => country.ID === countryId)

    return selectedCountry ? selectedCountry.Name : null
  }

  const fetchSubUrb = async (selectedStateId: string) => {
    if (!selectedStateId) return
    const query = `
    query MyQuery {
      listCities5AABS(filter: {StateId: { eq: ${selectedStateId} }}) {
        items {
          ID
          InsertedBy
          InsertedUserId
          Name
          StateId
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setSubUrb(res.data.data.listCities5AABS.items)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCountryId = event.target.value as string
    if (selectedCountryId) {
      fetchStateData(selectedCountryId)
    }
  }


  const fetchStateData = async (selectedCountryId: string) => {
    if (!selectedCountryId) return

    const query = `
      query MyQuery {
        listStates5AABS(filter: {CountryId:{ eq: "${selectedCountryId}" }}) {
          items {
            CountryId
            ID
            InsertedBy
            InsertedUserId
            Name
          }
        }
      }
    `

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setState(res.data.data.listStates5AABS.items)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }


  const fetchCountrData = async () => {
    const query = `
query MyQuery {
  listCountries5AABS(filter: {Status: {eq: true}}) {
    items {
      ID
      InsertedBy
      InsertedUserId
      Name
      PhoneCode
      SortName
      Status
    }
  }
}
`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setCountries(res.data.data.listCountries5AABS.items)
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchCountrData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const updateFormValues = useCallback(
    (values: any) => {
      Object.entries(values).forEach(([fieldName, fieldValue]: any) => {
        setValue(fieldName, fieldValue)
      })
    },
    [setValue]
  )
  useEffect(() => {
    updateFormValues({
      FirstName: adminFirstname || '',
      LastName: adminLastname || '',
      Email: adminEmail || '',
      Mobile: adminMobileNumber || '',
      Address1: adminAddress1 || '',
      SubURB: adminSuburb || '',
      Address2: adminAddress2 || '',
      State: adminState || '',
      Country: adminCountry || '',
      PostCode: adminPostcode || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    adminFirstname,
    adminLastname,
    adminEmail,
    adminMobileNumber,
    adminAddress1,
    adminAddress2,
    adminSuburb,
    adminState,
    adminCountry,
    adminPostcode,
    setValue
  ])

  const MAX_FILE_SIZE = 50 * 1024
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        const errorMessage = `File size exceeds the maximum limit (50KB).`
        const imageSizeMessage = `Selected image size: ${file.size / 1024} KB`
        toast.error(`${errorMessage} ${imageSizeMessage}`)
        return
      }
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }





  const handleDelete = async () => {
    const mutation1 = `
      mutation my {
        updateDriver5AAB(input: {DID: ${adminUserId}, Photo: ""}) {
          Address1
          Address2
          DID
          Email
          FirstName
          LastName
          Mobile
          State
          SubURB
          PostCode
          Country
          Photo
        }
      }
    `;

    const mutation2 = `
      mutation my {
        updateUsers5AAB(input: { ID: ${loginType}, ProfileImage: ""}) {
          Date
          FirstName
          ID
          LastName
          Password
          ProfileImage
          RoleId
          Status
          UserId
          UserName
          UserType
        }
      }
    `;

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json',
    };

    try {
      // Execute the first mutation
      await ApiClient.post(`${AppSink}`, { query: mutation1 }, { headers });

      // Execute the second mutation
      await ApiClient.post(`${AppSink}`, { query: mutation2 }, { headers });

      // If both requests succeed
      toast.success('Deleted successfully');
      setPreviewImage('');
      handleUserId();
      setModalOpenDelete(false);
    } catch (err) {
      console.error('Error deleting designation:', err);
      toast.error('Error deleting designation');
    }
  };





  const handleSubmitAdmin = async (data: FormValues) => {


    try {
      const formData = new FormData()
      formData.append('FirstName', data.FirstName)
      formData.append('LastName', data.LastName)
      formData.append('usertype', '0')
      formData.append('Email', data.Email)
      formData.append('Mobile', data.Mobile)
      formData.append('Address1', data.Address1)
      formData.append('Address2', data.Address2)
      formData.append('SubURB', data.SubURB)
      formData.append('PostCode', data.PostCode)
      formData.append('State', data.State)
      formData.append('Country', data.Country)
      formData.append('image', selectedFile || '')


      let url: any = ''
      if (selectedFile) {
        url = await uploadFileToS3(selectedFile, 'img.5aab.com/profile')
      } else {
        url = profileImageUrl
      }

      for (const pair of formData.entries()) {
        // console.log(pair[0] + ': ' + pair[1])
      }

      const query = `
      mutation my {
        updateDriver5AAB(input: {DID:${adminUserId}, Address1: "${data.Address1}", Address2: "${data.Address2}", Country: "${data.Country}", Email: "${data.Email}", FirstName: "${data.FirstName}", LastName: "${data.LastName}", Mobile: "${data.Mobile}", Photo: "${url}", PostCode: "${data.PostCode}", State: "${data.State}", SubURB: "${data.SubURB}"}) {
          Address1
          Address2
          DID
          Email
          FirstName
          LastName
          Mobile
          State
          SubURB
          PostCode
          Country
          Photo
        }
      }
      `

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      await ApiClient.post(`${AppSink}`, { query }, { headers })
      // dispatch(fetchUserProfile())
      // handleUserId()
      updateUsers(data,url)
      toast.success('Form submitted successfully')
    } catch (error: any) {
      console.error('Error making API call:', error)
      toast.error('Error submitting form')
    }
  }



  const updateUsers = (data:any,url:any) => {
    const query = `
    mutation my {
      updateUsers5AAB(input: {FirstName: "${data.FirstName}", ID:${loginId}, LastName: "${data.LastName}", ProfileImage: "${url}", UserName: "${data.Email}"}) {
        FirstName
        LastName
        ID
        ProfileImage
        UserName
      }
    }
    `

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        // console
        })
      .catch(err => {
        console.error('Error updateUsers:', err)

      })
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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleAccountSubmit(handleSubmitAdmin)}>
            <CardHeader title='Profile Details' />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {adminFirstname && !profileImageUrl && !previewImage ? (
                  <>
                    <div
                      style={{
                        border: '1px solid #cacaca',
                        padding: '15px',
                        margin: '10px 10px 10px 0px',
                        borderRadius: '10px'
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56, fontSize: 28, backgroundColor: '#776cff' }}>
                        {adminFirstname.charAt(0).toUpperCase()}
                      </Avatar>
                    </div>
                  </>
                ) : (
                  <ImgStyled src={previewImage || profileImageUrl} alt='Profile Pic' />
                )}
                <div>
                  <ButtonStyled
                    sx={{
                      '&:hover': {
                        background: '#776cff',
                        color: 'white'
                      }
                    }} component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    <Icon fontSize='1.5rem' icon='material-symbols-light:upload' style={{ marginRight: '5px' }}>
                      {' '}
                    </Icon>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={e => handleFileChange(e)}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>

                  {profileImageUrl && (
                    <Button  onClick={handleModalOpenDelete}
                    variant='contained' sx={{
                      ml: 4, '&:hover': {
                        background: '#776cff',
                        color: 'white'
                      }
                    }}>
                      <Icon fontSize='1.5rem' icon='mdi-light:delete' style={{ marginRight: '5px' }}>
                        {' '}
                      </Icon>
                      Delete
                    </Button>
                  )}
                  <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 50Kb.</Typography>
                </div>
              </Box>
            </CardContent>

            <Divider />

            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='FirstName'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <CustomTextField
                        id='firstnameInput'
                        value={value || ''}
                        autoComplete='given-name'
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        // {...field}
                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>First Name</span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </>
                        }
                        onChange={e => {
                          const inputValue = e.target.value
                          if (/^[A-Z]*\.?[a-z\s]*$/.test(inputValue) || inputValue === '') {
                              onChange(e)
                          }
                      }}

                        placeholder='First Name'
                        error={Boolean(accountErrors.FirstName)}
                        aria-describedby='stepper-linear-account-username'
                        {...(accountErrors.FirstName && { helperText: 'First Name is required' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='LastName'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <CustomTextField
                        id='lastnameInput'
                        value={value || ''}
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        // {...field}
                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>Last Name</span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </>
                        }
                        onChange={e => {
                          const inputValue = e.target.value
                          if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                            onChange(e)
                          }
                        }}
                        placeholder='Last Name'
                        error={Boolean(accountErrors.LastName)}
                        aria-describedby='stepper-linear-account-username'
                        {...(accountErrors.LastName && { helperText: 'Last Name is required' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Email'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        id='emailInput'
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        {...field}
                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>Email</span>
                          </>
                        }
                        placeholder='Email'
                        error={Boolean(accountErrors.Email)}
                        aria-describedby='stepper-linear-account-username'
                        {...(accountErrors.Email && { helperText: 'Email is required' })}
                      />
                    )}
                  />
                </Grid>




                <Grid item xs={12} sm={6}>
                  <div className='empTextField'>
                    <Controller
                      name='Mobile'
                      control={accountControl}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <div>
                          <div>
                            <span style={{ fontSize: '12px', marginBottom: '4px', color: getColor(), fontWeight: '400' }}>
                              Phone No
                            </span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </div>
                          <div id='mobileNumberInputWrapper'>
                            <PhoneInput
                              inputStyle={{
                                background: 'inherit',
                                height: '2.25rem',
                                width: '100%',
                                fontSize: '12px',
                                color: getColor(),
                                padding: '7.5px 13px 7.5px 2.7rem'
                              }}
                              value={field.value}
                              onChange={(value: any) => {
                                field.onChange(value)
                              }}
                              aria-describedby='stepper-linear-account-username'
                            />
                            {accountErrors.Mobile && (
                              <Typography variant='caption' color='error'>
                                Mobile is required
                              </Typography>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </Grid>


                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Address1'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        id="doorNoInput"
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        {...field}
                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>Door No / Building Name</span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </>
                        }
                        placeholder='Door No / Building Name'
                        error={Boolean(accountErrors.Address1)}
                        aria-describedby='stepper-linear-account-username'
                        {...(accountErrors.Address1 && { helperText: 'Door No / Building Name is required' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='Address2'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        id="streetNameInput"
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        {...field}
                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>Street Name / Area Name / Landmark</span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </>
                        }
                        placeholder='Street Name / Area Name / Landmark'
                        error={Boolean(accountErrors.Address2)}
                        aria-describedby='stepper-linear-account-username'
                        {...(accountErrors.Address2 && { helperText: 'Street Name /Area Name / Landmark is required' })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='PostCode'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field:{onChange,value} }) => (
                      <CustomTextField
                        id="postCodeInput"
                        sx={{
                          '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                            padding: '13.5px 10px !important'
                          }
                        }}
                        value={value}

                        fullWidth
                        label={
                          <>
                            <span className='status' style={{ color: getColor() }}>PostCode</span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </>
                        }
                        placeholder='PostCode'
                        onChange={e => {
                          const inputValue = e.target.value
                         if (/^\d{0,4}$/.test(inputValue)) {
                            onChange(e)
                          }
                        }}
                        error={Boolean(accountErrors.PostCode)}
                        aria-describedby='stepper-linear-account-username'
                       {...(accountErrors.PostCode && { helperText: accountErrors.PostCode.message })}

                      />
                    )}
                  />
                </Grid>
                <Grid sx={{ paddingTop: '13px !important', marginTop: '3px' }} item xs={6} sm={6}>
                  {
                    <div>
                      <span
                        className='country'
                        style={{
                          color: getColor(),
                          fontSize: '0.8125rem'
                        }}
                      >
                        Country
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  <Controller
                    name='Country'
                    control={accountControl}
                    rules={{ required: true }}
                    defaultValue={getCountryNameById(adminCountry) || 'Australia'}
                    render={({ field }) => (
                      <CustomTextField
                        autoComplete='off'
                        id='Country'
                        fullWidth
                        select
                        {...field}
                        value={field.value || ''}
                        error={Boolean(accountErrors.Country)}
                        helperText={accountErrors.Country && 'Country is required'}
                        onChange={e => {
                          field.onChange(e)
                          handleCountryChange(e)
                        }}
                      >
                        {countries.map((country: any) => (
                          <MenuItem key={country.ID} value={country.ID}>
                            {country.Name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />


                </Grid>

                <Grid item xs={12} sm={6}>
                  {
                    <div>
                      <span
                        className='firstname'
                        style={{
                          color: getColor(),
                          fontSize: '0.8125rem'
                        }}
                      >
                        State
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  <Controller
                    name='State'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        autoComplete='off'
                        id='State'
                        fullWidth
                        select
                        {...field}
                        value={field.value || ''}
                        error={Boolean(accountErrors.State)}
                        helperText={accountErrors.State && 'State is required'}
                        onChange={e => {
                          field.onChange(e)
                          handleStateChange(e)
                        }}
                      >
                        {!state || state.length === 0 ? (
                          <MenuItem disabled>No State</MenuItem>
                        ) : (
                          state?.map((s: any) => (
                            <MenuItem key={s.ID} value={s.ID}>
                              {s.Name}
                            </MenuItem>
                          ))
                        )}
                      </CustomTextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  {
                    <div>
                      <span
                        className='firstname'
                        style={{
                          color: getColor(),
                          fontSize: '0.8125rem'
                        }}
                      >
                        Suburb
                      </span>
                    </div>
                  }
                  <Controller
                    name='SubURB'
                    control={accountControl}
                    rules={{ required: 'riskfactors is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        id='SubURB'
                        autoComplete='off'
                        fullWidth
                        select
                        {...field}
                        value={field.value || ''}
                      >
                        {!subUrb || subUrb.length === 0 ? (
                          <MenuItem disabled>No suburbs</MenuItem>
                        ) : (
                          subUrb.map((s: any) => (
                            <MenuItem key={s.ID} value={s.ID}>
                              {s.Name}
                            </MenuItem>
                          ))
                        )}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid xs={12} sx={{ marginTop: '10px' }}>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      mr: 4, float: 'right', display: 'flex', justifyContent: 'space-between', gap: '5px', '&:hover': {
                        background: '#776cff',
                        color: 'white'
                      }
                    }}
                  >
                    <Icon fontSize='1.5rem' icon='material-symbols-light:save-outline' />
                    Save
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>


          <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p>Are you sure you want to delete?</p>

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
            {' '}
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EmployeeAccount
