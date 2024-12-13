import React, { ReactNode, useContext, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { CircularProgress, TextField } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Icon from 'src/@core/components/icon'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/router'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'
import Head from 'next/head'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'
import CognitoBaseUrl from 'src/commonExports/apiCongnitoUrl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import { AuthContext } from 'src/context/AuthContext'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import SecretKey from 'src/commonExports/SecretKeyUrl'

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const VerifyEmailIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
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

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  confirmNewPassword: ''
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'New Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'New password must contain uppercase, lowercase, number, and special character'
    )
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .required('Confirm New Password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})
const schema1 = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

});


const ForgotPassword = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showVerificationBox, setShowVerificationBox] = useState(false)
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: yupResolver(showVerificationBox ? schema : schema1) })
  const theme = useTheme()
  const [resetEmail, setResetEmail] = useState('')
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const inputRefs = useRef(Array(6).fill(null));



  const { encrypt }: any = useContext(AuthContext)

  const handleLogin = () => {
    setLoading(true)
    router.push('/login')
  }

  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleInputChange = (event: any, index: any) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 1) {
      const newValues = [...otpValues];
      newValues[index] = newValue;
      setOtpValues(newValues);

      if (newValue && index < newValues.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (event: any, index: any) => {
    if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
      setOtpValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[index - 1] = '';
        return newValues;
      });
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: any) => {
    event.preventDefault(); // Prevent the default paste action
    const pastedData = event.clipboardData.getData('text/plain').slice(0, 6); // Get the pasted data and ensure it's max 6 chars
    const newValues = pastedData.split(""); // Convert string to array of single characters

    // Update the entire OTP values array
    setOtpValues(newValues);

    // Focus the last input field after paste
    inputRefs.current[5]?.focus();
  };
  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      await sendResetEmail(data.email);
      return;

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const sendResetEmail = async (email: string) => {
    try {
      const response = await ApiLoginClient.get(`${CognitoBaseUrl}?operation=cognito_forgotpassword&email=${email}`);
      if (response && response?.status == 200) {
        setLoading(false);
        setResetEmail(email);
        await setShowVerificationBox(true);
        toast.success('Mail Sent Successfully');
      }
      else if (response && response?.status == 201) {
        setLoading(false);
        toast.error('Email doesn\'t exist');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in sending reset email', error);
      toast.error('An error occurred while sending reset email. Please try again.');
    }
  };



  const onPasswordFormSubmit = async () => {
    const loginId = localStorage.getItem('adminLoginEmail');
    const otpChangeValues = otpValues.join('');

    if (!loginId) {
      toast.error('Login ID not found. Please log in again.');
      return;
    }

    const newPassword = getValues('newPassword');
    const currentPassword = getValues('currentPassword');
    const confirmNewPassword = getValues('confirmNewPassword');

    if (newPassword === currentPassword) {
      toast.error('Your Old Password and New Password should not be the same.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New Password and Confirm New Password should be the same.');
      return;
    }

    const newPasswordHash = encodeURIComponent(encrypt(newPassword, SecretKey));
    const confirmationCode = encodeURIComponent(encrypt(otpChangeValues, SecretKey));

    // Log the URL and parameters for debugging
    const requestUrl = `${CognitoBaseUrl}?operation=cognito_forgotpassword_confirm&email=${loginId}&confirmation_code=${confirmationCode}&new_password=${newPasswordHash}`;
    try {
      const res = await ApiClient.get(requestUrl);

      if (res.status === 200) {
        toast.success('Password Changed Successfully');
        reset(defaultValues);
        router.push('/login')
      } else if (res.status === 201 && res.data.status === 'Incorrect username or password') {
        toast.error('Incorrect Current Password');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      if (err?.response) {
        // Specific handling for 400 errors
        if (err.response.status === 400 || err.response.status === 401 || err.response.status === 500) {
          toast.error(`Bad request: ${err.response.data.message || 'Invalid input provided.'}`);
        } else {
          toast.error(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
      } else {
        console.error('API Error:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };




  return (
    <>
      <Head>
        <title>Forgot Password - Growseb</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      {!showVerificationBox && (
        <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
          {!hidden ? (
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
              <ForgotPasswordIllustration
                alt='forgot-password-illustration'
                src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
              />
              <FooterIllustrationsV2 />
            </Box>
          ) : null}
          <RightWrapper>
            <Box
              sx={{
                p: [6, 12],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <img src='\images\Groesen-logo.png' alt='icon' width='80' height='auto' />

                <Box sx={{ my: 6 }}>
                  <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                    Forgot Password? 🔒
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Enter your email and we&prime;ll send you instructions to reset your password
                  </Typography>
                </Box>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Controller
                    name='email'
                    control={control}
                    defaultValue=''
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        autoComplete='off'
                        fullWidth
                        autoFocus
                        type='email'
                        label='Email'
                        sx={{ display: 'flex', mb: 4 }}
                      />
                    )}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <Button
                      fullWidth
                      type='submit'
                      variant='contained'
                      onClick={handleLogin}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        mb: 4,
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      <Icon icon='material-symbols:arrow-back' fontSize={20} />
                      Back to Login
                    </Button>
                    <Button
                      fullWidth
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      sx={{
                        display: 'flex',
                        gap: '15px',
                        mb: 4,
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          Send reset link
                          <CircularProgress size={20} color='inherit' />
                        </>
                      ) : (
                        <>
                          Send reset link
                          <Icon icon='fluent:send-48-filled' fontSize={20} />
                        </>
                      )}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </RightWrapper>
        </Box>
      )}
      {showVerificationBox && (
        <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
          {!hidden ? (
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
              <VerifyEmailIllustration
                alt='verify-email-illustration'
                src={`/images/pages/auth-v2-verify-email-illustration-${theme.palette.mode}.png`}
              />
              <FooterIllustrationsV2 />
            </Box>
          ) : null}
          <RightWrapper>
            <Box
              sx={{
                p: [6, 12],
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: 500 }}>
                <img src='\images\Groesen-logo.png' alt='icon' width='80' height='auto' />
                <Box sx={{ my: 6 }}>
                  <Typography variant='h4' sx={{ mb: 1.5 }}>
                    Password details send to your email ✉️
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Password requested information has been sent to your email address:
                    <span style={{ color: '#776cff' }}> {resetEmail}</span> Please enter the otp to
                    continue.
                  </Typography>
                </Box>
                {/* <OTPInput onSubmit={handleOtpSubmit} />
                {otpStatus && <p>{otpStatus}</p>} */}
                <CardContent>
                  <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
                    <Grid container spacing={5}>
                      <Grid item xs={12} sm={6}>
                        {/* <Controller
                          name='OTP'
                          control={control}
                          rules={{
                            required: 'OTP is required'
                            // minLength: { value: 8, message: 'Password must be at least 8 characters long' }
                          }}
                          render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <CustomTextField
                              fullWidth
                              value={value}
                              onChange={onChange}
                              label='OTP'
                              placeholder='Enter Otp'
                              id='input-OTP'
                              error={Boolean(error)}
                              type={'text'}
                              helperText={error ? error.message : ''}
                              // InputProps={{
                              //   endAdornment: (
                              //     <InputAdornment position='end'>
                              //       <IconButton
                              //         edge='end'
                              //         onMouseDown={e => e.preventDefault()}
                              //         onClick={handleClickShowCurrentPassword}
                              //       >
                              //         <Icon
                              //           fontSize='1.25rem'
                              //           icon={values.showCurrentPassword ? 'tabler:eye' : 'tabler:eye-off'}
                              //         />
                              //       </IconButton>
                              //     </InputAdornment>
                              //   )
                              // }}
                              autoComplete='OTP'
                            />
                          )}
                        /> */}
                        {/* <form className='otp-input-form'>
                          <div className="otp-input-container">
                            {Array(6).fill(null).map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                value={otp[index] || ''} // Show digit or empty string
                                onChange={(e) => handleChange(e, index)}
                                onFocus={() => handleFocus(index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                maxLength={1}
                                className='otp-input'
                                autoFocus={index === focusedIndex} // Auto-focus on active input
                              />
                            ))}
                          </div>
                        </form> */}
                        <form className='otp-form' >
                          <label htmlFor='otp-input' className='otp-label' style={{ fontSize: "0.8125rem" }}>
                            Enter the OTP
                          </label>
                          <div className='otp-input-container'>
                            {otpValues.map((value, index) => (
                              <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='tel'
                                className='otp-input'
                                maxLength={1}
                                autoFocus={index === 0}
                                value={value}
                                onChange={(e) => handleInputChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                style={{ clipPath: 'inset(0)' }}
                              />
                            ))}
                          </div>

                        </form>
                      </Grid>
                    </Grid>
                    <Grid container spacing={5} sx={{ mt: 0 }}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="newPassword"
                          control={control}
                          rules={{ required: 'New Password is required' }}
                          render={({ field: { value, onChange } }) => {
                            const isError = Boolean(errors.newPassword);
                            const helperText = errors?.newPassword?.message as string | undefined;

                            return (
                              <CustomTextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                label="New Password"
                                id="input-new-password"
                                placeholder=""
                                error={isError}
                                helperText={helperText}
                                type={values.showNewPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        edge="end"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={(e) => e.preventDefault()}
                                      >
                                        <Icon
                                          fontSize="1.25rem"
                                          icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                        />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            );
                          }}
                        />
                      </Grid>


                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='confirmNewPassword'
                          control={control}
                          rules={{ required: 'Confirm New Password is required' }} // Adding a specific error message for better user feedback
                          render={({ field: { value, onChange } }) => {
                            const isError = Boolean(errors.confirmNewPassword);
                            const helperText = errors?.confirmNewPassword?.message as string | undefined;
                            return (
                              <CustomTextField
                                fullWidth
                                value={value}
                                onChange={onChange}
                                placeholder=''
                                label='Confirm New Password'
                                id='input-confirm-new-password'
                                error={isError}
                                helperText={helperText}
                                type={values.showConfirmNewPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton
                                        edge='end'
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={handleClickShowConfirmNewPassword}
                                      >
                                        <Icon
                                          fontSize='1.25rem'
                                          icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                        />
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            );
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant='h6'>Password Requirements:</Typography>
                        <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                          <li>Minimum 8 characters long - the more, the better</li>
                          <li>At least one lowercase & one uppercase character</li>
                          <li>At least one number, symbol, or whitespace character</li>
                        </Box>
                      </Grid>
                    </Grid>
                    <Button
                      fullWidth
                      type='submit'
                      variant='contained'
                      sx={{
                        display: 'flex',
                        gap: '25px',
                        fontSize: '16px',
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      <Icon icon='mdi:key-outline' fontSize={20} />
                      Verify
                    </Button>
                  </form>
                </CardContent>

              </Box>
            </Box>
          </RightWrapper>
        </Box>
      )}
    </>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
