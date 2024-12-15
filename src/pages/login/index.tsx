import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, Box, Button, Checkbox, IconButton, InputAdornment, Typography } from '@mui/material'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import themeConfig from 'src/configs/themeConfig'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import * as yup from 'yup'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'
import CognitoBaseUrl from 'src/commonExports/apiCongnitoUrl'
import PhpBaseUrl from 'src/commonExports/apiPhpUrl'
import { AuthContext } from 'src/context/AuthContext'
import animationData from '../../../public/loginAnimation.json'
import SecretKey from 'src/commonExports/SecretKeyUrl'
import GoogleSignIn from './google-signin'
import FacebookSignIn from './facebook-signin'
import TwitterSignIn from './twitter-signin'
import MicrosoftSignIn from './microsoft-signin'
import AppleSignIn from './apple-signin'
import axios from 'axios'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: { maxWidth: 450 },
  [theme.breakpoints.up('lg')]: { maxWidth: 600 },
  [theme.breakpoints.up('xl')]: { maxWidth: 750 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': { color: theme.palette.text.secondary }
}))

const schema = yup.object().shape({
  password: yup.string().min(4).required('Password is required'),
  username: yup.string().required('Email is required')
})

const defaultValues = {
  password: '',
  username: ''
}

interface FormData {
  password: string
  username: string
}

const LoginPage = () => {
  const router = useRouter()
  const { encrypt }: any = useContext(AuthContext)
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const selectedMode = localStorage.getItem('selectedMode') || 'light'
  const Color = selectedMode === 'dark' ? '#2f3349' : 'white'

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const lottieRef = useRef<any>(null)
  useEffect(() => {
    lottieRef.current?.setSpeed(0.8)
  }, [])

  const handleSuccess = async (response: any, username: any, CustomerDetails: any) => {
    const userData1: any = JSON.stringify(CustomerDetails)
    localStorage.setItem('userData', userData1)
    const { userData, accessToken }: any = response.data
    if (accessToken) {
      localStorage.setItem('adminLoginEmail', username)
      localStorage.setItem('adminLoginId', userData?.UserId)
      localStorage.setItem('accessToken', accessToken)
      toast.success('Login Success')
      router.push('/dashboards')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setLoading(false)
      toast.error('Username or Password was incorrect or Account may be inactive')
    }
  }

  const handleError = (error: any) => {
    const message = error.response?.data?.status || 'Failed to retrieve error message'
    toast.error(message)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { username, password } = data
    const requestData: any = {
      email: username,
      password: password
    }
    try {
      const endpoint = 'api/auth/login'
      const response = await ApiLoginClient.post(endpoint, requestData)
      console.log(response)
      if (response) {
        handleSuccess(response, username, response?.data)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>AI-Powered SEO Tool | GrowSeb - Comprehensive Website Analysis & Promotion</title>
        <meta
          name='description'
          content="Elevate your website's performance with GrowSeb, the AI-driven SEO tool offering in-depth analysis and actionable promotion strategies. Streamline your SEO efforts and achieve superior results with our all-in-one solution."
        />
        <meta
          name='keywords'
          content='AI SEO tool, website analysis, SEO optimization, digital marketing, website promotion, AI-powered SEO, SEO analysis, SEO guide, GrowSeb'
        />
      </Head>
      <Box
        className='content-right'
        sx={{ backgroundColor: 'background.paper', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {!hidden && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              borderRadius: '20px',
              justifyContent: 'center',
              backgroundColor: 'customColors.bodyBg',
              padding: '30px',
              margin: theme => theme.spacing(8, 0, 8, 8)
            }}
          >
            <div style={{ height: 'calc(80vh-80px)' }}>
              <Lottie animationData={animationData} lottieRef={lottieRef} loop autoplay />
            </div>
            <FooterIllustrationsV2 />
          </Box>
        )}
        <RightWrapper>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='login-container'>
            <Box sx={{ width: '100%', maxWidth: 400, marginTop: '-80px' }}>
              <img src='\images\Groesen-logo.png' width='80' height='auto' alt='icon' />
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {`Welcome to ${themeConfig.templateName}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2.5 }}>
                Please sign in to your account and start the adventure
              </Typography>
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    name='username'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        id='username'
                        autoComplete='on'
                        error={Boolean(errors.username)} // Updated to errors.username
                        helperText={errors.username?.message} // Updated to errors.username?.message
                        fullWidth
                        autoFocus
                        label='Email'
                        {...field}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid red',
                            borderColor: errors.username ? 'error.main' : 'grey.400',
                            '&:hover fieldset': {
                              borderColor: errors.username ? 'error.main' : 'grey.600'
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 1.5 }}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        autoComplete='on'
                        label='Password'
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{
                    mb: 1.75,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <FormControlLabel
                    id='rememberme'
                    name='rememberme'
                    label='Remember Me'
                    control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                  />
                  <Typography component={LinkStyled} href='/forgot-password'>
                    Forgot Password?
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  sx={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '10px',
                    alignItems: 'center',
                    '&:hover': { background: '#776cff', color: 'white' }
                  }}
                >
                  {loading ? (
                    <>
                      <Icon icon='mdi:key-outline' fontSize={20} />
                      Logging in...
                      <CircularProgress size={24} />
                    </>
                  ) : (
                    <>
                      <Icon icon='mdi:key-outline' fontSize={20} />
                      Login
                    </>
                  )}
                </Button>
                <Box>
                  <Typography sx={{ color: 'text.secondary', mb: 2.5, textAlign: 'center', py: 2 }}>
                    New on our platform?
                    <Typography
                      component={LinkStyled}
                      sx={{ marginLeft: '5px' }}
                      href='https://www.growseb.com/signup'
                      target='_blank'
                    >
                      Create an account
                    </Typography>
                  </Typography>
                  {/* <Box sx={{ borderBottom: '1px solid #E5E5E5', marginBottom: '25px', position: 'relative' }}>
                    <Typography
                      sx={{ position: 'absolute', top: '-12px', right: '47%', background: Color, padding: '0 9px' }}
                    >
                      {' '}
                      or
                    </Typography>
                  </Box> */}
                  <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {/* <Box className='social-google-login'>
                      <GoogleSignIn />
                    </Box> */}
                    {/* <Box>
                      <FacebookSignIn />
                    </Box> */}
                    {/* <Box>
                      <TwitterSignIn />
                    </Box> */}
                    {/* <Box>
                      <MicrosoftSignIn />
                    </Box> */}
                    {/* <Box sx={{ width: '45px' }}>
                      <AppleSignIn />
                    </Box> */}
                    {/* <Box sx={{ width: "45px" }}>
                    <TwitterSignIn />
                  </Box> */}
                  </Box>
                  {/* <Box sx={{ display: 'flex', gap: '15px', paddingTop: '15px', alignItems: 'center' }}>
                    <Box>
                      <TwitterSignIn />
                    </Box>
                    <Box>
                      <MicrosoftSignIn />
                    </Box>
                  </Box> */}
                </Box>
              </form>
            </Box>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
