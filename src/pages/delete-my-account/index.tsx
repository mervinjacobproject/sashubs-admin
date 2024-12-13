import { useState, ReactNode, useEffect } from 'react'
import Head from 'next/head'
import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import { Box, BoxProps, Button, Card, CircularProgress, Typography } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useSettings } from 'src/@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'
import IconButton from '@mui/material/IconButton'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 570,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const DeleteMyAccount = () => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [allId, setAllId] = useState({ ID: '', UserId: '' });

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(5).required('Password is required')
  })

  const defaultValues = {
    password: '',
    email: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const query = `query MyQuery {
        listUsers5AABS(filter: {Status: {eq: true}, UserName: {eq: "${data.email}"}, Password: {eq: "${data.password}"}}) {
          items {
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
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      const items = response.data.data.listUsers5AABS.items

      if (items.length === 0) {
        toast.error('Incorrect credentials. Please try again.')
      } else {
        toast.success('Credentials are correct.')
        setAllId({ ID: items[0]?.ID, UserId: items[0]?.UserId });
        setLoginSuccess(true)
        reset()
      }

      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }
  const handleCancel=()=>{
    setLoginSuccess(!loginSuccess)
  }

  const deleteConfirmation = async () => {
    setLoading(true);
    
    const driverQuery = `mutation {
      deleteDriver5AAB(input: { DID: ${allId.UserId} }) {
        Address1
        Address2
        AppAccess
        Country
        DID
        DOB
        DOJ
        DOT
        Date
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
        Status
        SubURB
        Title
        UpdatedAt
        UpdatedBy
        UserName
      }
    }`;
  
    const userQuery = `mutation {
      deleteUsers5AAB(input: { ID: ${allId.ID} }) {
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
    }`;
  
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
  
    try {
      await Promise.all([
        ApiClient.post(`${AppSink}`, { query: driverQuery }, { headers }),
        ApiClient.post(`${AppSink}`,{  query: userQuery}, { headers }),
      ]);
      toast.success("Deleted Successfully")
      setLoginSuccess(!loginSuccess)
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Delete-My-Account - 5aab</title>
        <meta name='our-blogs' content='Delete-My-Account-5aab' key='desc' />
      </Head>
      <Box
        className='content-right'
        sx={{ backgroundColor: 'background.paper', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {loginSuccess ? (
          !hidden ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                borderRadius: '20px',
                justifyContent: 'center',
                backgroundColor: 'customColors.bodyBg',
                margin: theme => theme.spacing(8, 0, 8, 8)
              }}
            >
              <LoginIllustration alt='login-illustration' src={`/images/banners/delete.png`} />
              <FooterIllustrationsV2 />
            </Box>
          ) : null
        ) : !hidden ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              borderRadius: '20px',
              justifyContent: 'center',
              backgroundColor: 'customColors.bodyBg',
              margin: theme => theme.spacing(8, 0, 8, 8)
            }}
          >
            <LoginIllustration alt='login-illustration' src={`/images/banners/login.png`} />
            <FooterIllustrationsV2 />
          </Box>
        ) : null}

        {loginSuccess ? (
          <RightWrapper>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 450 }}>
                <img src='/images/icons/project-icons/sev 1.png' alt='icon' />
                <Card sx={{ padding: '20px', border: '1px solid #cacaca' }}>
                  <Typography variant='h3' sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Icon fontSize='2rem' icon='fluent:person-delete-16-regular' />{' '}
                    <span> Confirm Account Deletion</span>
                  </Typography>
                  <Typography>
                    Please click <span style={{ color: '#776cff', fontWeight: 'bold' }}>CONFIRM ACCOUNT DELETION</span>{' '}
                    below to confirm that you wish to delete your account. All your data will be anonymized, and your
                    account will be permanently closed.
                    <span style={{ color: '#776cff' }}> This action cannot be undone.</span>
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Button
                    onClick={handleCancel}
                      variant='contained'
                      sx={{
                        marginTop: '20px',
                        display: 'flex',
                        gap: '15px',
                        fontSize: '13px',
                        alignItems: 'center',
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      CANCEL
                    </Button>
                    <Button
                    onClick={deleteConfirmation}
                      variant='contained'
                      disabled={loading}
                      sx={{
                        marginTop: '20px',
                        display: 'flex',
                        fontSize: '13px',
                        alignItems: 'center',
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      {loading ? (
                      <>
                          <CircularProgress size={20} />
                        CONFIRM ACCOUNT DELETION
                     
                      </>
                    ) : (
                      <>
                        <Icon icon='mdi-light:delete' fontSize={20} />
                        CONFIRM ACCOUNT DELETION
                      </>
                    )}
                    
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Box>
          </RightWrapper>
        ) : (
          <RightWrapper>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <img src='/images/icons/project-icons/sev 1.png' alt='icon' />

                <Box>
                  <Typography variant='h3' sx={{ mb: 1.5 }}>
                    {`Welcome to ${themeConfig.templateName}! 👋🏻`}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 2.5 }}>
                    Please sign in to your account
                  </Typography>
                </Box>

                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ mb: 4 }}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          id='email'
                          name='email'
                          autoComplete='on'
                          fullWidth
                          autoFocus
                          label='Email'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.email)}
                          {...(errors.email && { helperText: errors.email.message })}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ mb: 1.5 }}>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <CustomTextField
                          fullWidth
                          autoComplete='on'
                          value={value}
                          onBlur={onBlur}
                          label='Password'
                          onChange={onChange}
                          id='auth-login-v2-password'
                          error={Boolean(errors.password)}
                          {...(errors.password && { helperText: errors.password.message })}
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'center',
                      '&:hover': {
                        background: '#776cff',
                        color: 'white'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <Icon icon='mdi:key-outline' fontSize={20} />
                        Login
                        <CircularProgress size={24} />
                      </>
                    ) : (
                      <>
                        <Icon icon='mdi:key-outline' fontSize={20} />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        )}
      </Box>
    </>
  )
}

DeleteMyAccount.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

DeleteMyAccount.guestGuard = true

export default DeleteMyAccount
