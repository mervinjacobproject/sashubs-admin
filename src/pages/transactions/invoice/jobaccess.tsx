import { Grid, Switch, Typography } from '@mui/material'
import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface FormValues {
  email: string
  Username: string
  lastname: string
  title: string
  dob: Date | null
  doj: Date | null
  dot: Date | null
  mobileNumber: string
}

const Jobaccess = () => {
  const [showValues, setShowValues] = useState<boolean>(false)
  const [showField,setShowField]=useState<boolean>(false)

  const defaultAccountValues: FormValues = {
    email: '',
    Username: '',
    lastname: '',
    title: '',
    dob: null,
    doj: null,
    dot: null,
    mobileNumber: ''
  }

  const accountSchema = yup.object().shape({
    Username: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email().required(),
    title: yup.string().required('Title is required'),
    dob: yup.date().required('D.O.B is required'),
    doj: yup.date().required('D.O.J is required'),
    dot: yup.date().required('D.O.T is required'),
    mobileNumber: yup.string().required('Mobile number is required')
  })

  const handleTogglePasswordView = () => {
    setShowValues(!showValues)
  }

  const {
    control: accountControl,
    formState: { errors: accountErrors }
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })


  return (

    <>
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: '' }}>
        <div className='empTextField' style={{ display: 'Grid', alignItems: 'center' }}>
          <Typography sx={{ mb: 1, color: 'text.secondary', fontWeight: '600', fontSize: '12px', mr: 3 }}>
            App access
           
          </Typography>
          <Switch sx={{ paddingBottom: '0 !important' }} id='invoice-add-payment-stub'  onChange={() => setShowField(!showField)}/>
        </div>
      </Grid>
      {showField && (
        <>
      <Grid item xs={12} sm={6} md={6} sx={{ mb: 2 }} className='empTextField'>
        <Controller
          name='Username'
          control={accountControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <CustomTextField
              fullWidth
              value={value}
              label={
                <>
                  Username
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                </>
              }
              placeholder='Username'
              onChange={onChange}
              error={Boolean(accountErrors.Username)}
              aria-describedby='stepper-linear-account-username'
              {...(accountErrors.Username && { helperText: 'This field is required' })}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <CustomTextField
          fullWidth
          label={
            <>
              Password
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography>
            </>
          }
          placeholder='············'
          type={showValues ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  edge='end'
                  onClick={handleTogglePasswordView}
                  onMouseDown={e => e.preventDefault()}
                  aria-label='toggle password visibility'
                >
                  <Icon fontSize='1.25rem' icon={showValues ? 'tabler:eye' : 'tabler:eye-off'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      </>)}
      </Grid>
    </>
  )
}

export default Jobaccess
