import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import React, { ElementType, useCallback, useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import PhpBaseUrl from 'src/commonExports/apiPhpUrl'
import { AuthContext } from 'src/context/AuthContext'
import { dispatch } from 'src/store'
import { fetchUserProfile, selectUserProfile } from 'src/store/apps/admin'
import * as yup from 'yup'

const ButtonStyled = styled(Button)<{ component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface FormValues {
  address: string
  gst: any
  pan: any
  logo: any
  city: any
  state: any
  postal_code: any
  tagline: any
  website: any
  company_name: any
  image: string
  firstname: string
  lastname: string
  email: string
  gender: string
  mobile: any
  dob: string // Date of Birth field
}

const AdminLogin = () => {
  const userProfileState = useSelector(selectUserProfile)
  const tempUserData = typeof window != 'undefined' ? window.localStorage.getItem('userData') : null
  const userData = tempUserData ? JSON.parse(tempUserData) : null
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const loginId = localStorage.getItem('adminLoginId')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<any>(null)
  const [btnLoadding, setBtnLoading] = useState<any>(false)
  const { getCustomerApi }: any = useContext(AuthContext)
  const [formChanged, setFormChanged] = useState(true)

  useEffect(() => {
    dispatch(fetchUserProfile())
    if (userData?.image) {
      setPreviewImage(userData.image)
    }
  }, [])

  const accountSchema = yup.object().shape({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    gender: yup.string().required('Gender is required'),
    mobile: yup
      .string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    dob: yup.date().required('Date of Birth is required').nullable()
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      firstname: userData?.firstname != undefined ? userData.firstname : '',
      lastname: userData?.lastname != undefined ? userData.lastname : '',
      email: userData?.email != undefined ? userData.email : '',
      gender: userData?.gender != undefined ? userData.gender : '',
      mobile: userData?.mobile != undefined ? userData.mobile : '',
      dob: userData && userData?.dob ? userData.dob : ''
      // dob:userData && userData?.dob ? new Date(userData.dob)?.toISOString().split('T')[0] : '',
    }
  })

  useEffect(() => {
    // Whenever form data changes, set formChanged to true
    if (isDirty) {
      setFormChanged(false)
    }
  }, [isDirty])

  const updateFormValues = useCallback(
    (values: any) => {
      Object.entries(values).forEach(([fieldName, fieldValue]: any) => {
        setValue(fieldName, fieldValue)
      })
    },
    [setValue]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.')
        return
      }
      if (file.size > 50 * 1024) {
        toast.error(`File size exceeds the maximum limit (50KB)`)
        return
      }
      setFormChanged(false)
      setSelectedFile(file)
      // setPreviewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitAdmin = async (data: FormValues) => {
    setBtnLoading(true)
    if (previewImage) {
      data.image = previewImage
    }
    data.address = userData.address
    data.gst = userData.gst
    data.pan = userData.pan
    data.company_name = userData.company_name
    data.city = userData.city
    data.state = userData.state
    data.postal_code = userData.postal_code
    data.tagline = userData.tagline
    data.website = userData.website
    if (data.dob) {
      const dobDate = new Date(data.dob)
      dobDate.setMinutes(dobDate.getMinutes() - dobDate.getTimezoneOffset())
      data.dob = dobDate.toISOString().split('T')[0] // This will format the date as "YYYY-MM-DD"
    }

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value))
      const response = await ApiClient.post(`${PhpBaseUrl}/updateCustomer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setBtnLoading(false)
      setFormChanged(true)

      if (response.status === 200) {
        toast.success('Profile updated successfully')
        getCustomerApi(data.email)
        reset(data)
        dispatch(fetchUserProfile())
      } else {
        toast.error('Error updating profile. Please try again.')
      }
    } catch (error) {
      setBtnLoading(false)
      console.error('Error submitting form:', error)
      toast.error('Error submitting form')
    }
  }

  // const handleDelete = async () => {
  //   try {
  //     const query = `mutation my { updateUsers5AAB(input: {ProfileImage: "", ID: ${loginId}}) { ProfileImage }}`
  //     await ApiClient.post(
  //       `${AppSink}`,
  //       { query },
  //       { headers: { 'x-api-key': 'your-api-key', 'Content-Type': 'application/json' } }
  //     )
  //     toast.success('Image deleted successfully')
  //     setPreviewImage(null)
  //     setSelectedFile(null)
  //     dispatch(fetchUserProfile())
  //   } catch (error) {
  //     toast.error('Error deleting image')
  //   }
  // }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Head>
              <title>Admin Account Settings</title>
              <meta name='description' content='Admin Account Settings' />
            </Head>
            <form onSubmit={handleSubmit(handleSubmitAdmin)}>
              <CardHeader title='Profile Detail' />
              <Divider />
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='firstname'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='First Name'
                          error={Boolean(errors.firstname)}
                          helperText={errors.firstname?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='lastname'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Last Name'
                          error={Boolean(errors.lastname)}
                          helperText={errors.lastname?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Email'
                          disabled
                          error={Boolean(errors.email)}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='gender'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label='Gender'
                          error={Boolean(errors.gender)}
                          helperText={errors.gender?.message}
                        >
                          <MenuItem value='Male'>Male</MenuItem>
                          <MenuItem value='Female'>Female</MenuItem>
                          <MenuItem value='Other'>Other</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='mobile'
                      control={control}
                      render={({ field }: any) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Phone'
                          error={Boolean(errors.mobile)}
                          onInput={(e: any) => {
                            // Allow only numbers and limit the length to 10 digits
                            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                          }}
                          helperText={errors.mobile?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='dob'
                      control={control}
                      render={({ field }: any) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Date of Birth'
                          type='date'
                          InputLabelProps={{
                            shrink: true
                          }}
                          error={Boolean(errors.dob)}
                          helperText={errors.dob?.message}
                          inputProps={{
                            max: new Date().toISOString().split('T')[0] // Set the max date to today
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <CardContent sx={{ display: 'flex' }}>
                    <div>
                      <ButtonStyled component='label' variant='contained' htmlFor='upload-image'>
                        Upload New Photo
                        <input
                          hidden
                          type='file'
                          onChange={e => handleFileChange(e)}
                          accept='image/png, image/jpeg, image/jpg'
                          id='upload-image'
                        />
                      </ButtonStyled>
                      <Typography variant='body2' sx={{ marginTop: '2.3rem' }}>
                        Allowed PNG, JPEG, or JPG. Max size of 50KB.
                      </Typography>
                    </div>
                    <Box>
                      {(userData?.firstname || userData?.lastname) && !previewImage ? (
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            fontSize: 28,
                            borderRadius: '50%',
                            backgroundColor: '#cacaca',
                            marginLeft: '10px'
                          }}
                        >
                          {userData?.firstname.charAt(0).toUpperCase()}
                          {userData?.lastname.charAt(0).toUpperCase()}
                        </Avatar>
                      ) : (
                        <img
                          src={previewImage}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            border: '1px solid #e3d8d8',
                            marginLeft: '10px',
                            borderRadius: '50%'
                          }}
                          alt='pic'
                        />
                      )}
                    </Box>
                  </CardContent>
                </Grid>
              </CardContent>
              <Divider />
              <Box sx={{ p: 3, textAlign: 'end' }}>
                <Button type='submit' size='large' variant='contained' disabled={formChanged}>
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
      {/* <CustomModal
        open={modalOpenDelete}
        onClose={() => setModalOpenDelete(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete your image?"
      /> */}
    </>
  )
}

export default AdminLogin
