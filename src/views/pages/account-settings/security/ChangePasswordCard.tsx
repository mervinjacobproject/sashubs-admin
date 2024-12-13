import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import SecretKey from 'src/commonExports/SecretKeyUrl'
import CognitoBaseUrl from 'src/commonExports/apiCongnitoUrl'
import { AuthContext } from 'src/context/AuthContext'
import * as yup from 'yup'
import TextField from '@mui/material/TextField' // Importing MUI TextField
import { CircularProgress } from '@mui/material'

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
  currentPassword: yup
    .string()
    .required('Current Password is required')
    .oneOf([yup.ref('currentPassword')], 'Current Password required')
})

const ChangePasswordCard = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })
  const { encrypt }: any = useContext(AuthContext)
  const [formChanged, setFormChanged] = useState(false) 
  const [btnLoadding, setBtnLoading] = useState<any>(false)


  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors,isDirty},
    getValues
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  useEffect(() => {
    // Whenever form data changes, set formChanged to true
    if (isDirty) {
      setFormChanged(true)
    }
  }, [isDirty])  // `isDirty` will automatically change when form data changes

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onPasswordFormSubmit = async () => {
    setBtnLoading(true)
    const loginId = localStorage.getItem('adminLoginEmail')
    if (!loginId) {
      toast.error('Login ID not found. Please log in again.')
      return
    }
    const newpassword = getValues('newPassword')
    const newpasswordhash = encodeURIComponent(encrypt(newpassword, SecretKey))
    const oldpassword = getValues('currentPassword')
    const oldpasswordhash = encodeURIComponent(encrypt(oldpassword, SecretKey))
    const confirmpassword = getValues('confirmNewPassword')
    const confirmpasswordhash = encodeURIComponent(encrypt(confirmpassword, SecretKey))
    if (getValues('newPassword') == getValues('currentPassword')) {
      toast.success('Your Old Password and New Password should not be same')
      return
    }
    if (getValues('newPassword') === getValues('confirmNewPassword')) {
      await ApiClient.get(
        `${CognitoBaseUrl}?operation=cognito_change_password&email=${loginId}&previous_password=${oldpasswordhash}&proposed_password=${newpasswordhash}`
      )
        .then((res: any) => {
          if (res.status == 200) {
            setBtnLoading(false)
            toast.success('Password Changed Successfully')
            setFormChanged(true)
            reset(defaultValues)
          } else if (res.status == 201 && res.data.status == 'Incorrect username or password') {
            setBtnLoading(false)
            toast.error('Incorrect Current Password')
          }
        })
        .catch((err: any) => {
          setBtnLoading(false)

          console.error('API Error:', err)
          toast.error('An unexpected error occurred. Please try again.')
        })
    } else {
      setBtnLoading(false)
      toast.error('New Password and Confirm New Password should be same')
    }
  }

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='currentPassword'
                control={control}
                rules={{
                  required: 'Current Password is required'
                }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Current Password'
                    placeholder='············'
                    id='input-current-password'
                    error={Boolean(error)}
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    helperText={error ? error.message : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleClickShowCurrentPassword}
                          >
                            <Icon
                              fontSize='1.25rem'
                              icon={values.showCurrentPassword ? 'tabler:eye' : 'tabler:eye-off'}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    autoComplete='current-password'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='New Password'
                    id='input-new-password'
                    placeholder='············'
                    error={Boolean(errors.newPassword)}
                    type={values.showNewPassword ? 'text' : 'password'}
                    {...(errors.newPassword && { helperText: errors.newPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon fontSize='1.25rem' icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='confirmNewPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    placeholder='············'
                    label='Confirm New Password'
                    id='input-confirm-new-password'
                    error={Boolean(errors.confirmNewPassword)}
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    {...(errors.confirmNewPassword && { helperText: errors.confirmNewPassword.message })}
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
                )}
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
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
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
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
