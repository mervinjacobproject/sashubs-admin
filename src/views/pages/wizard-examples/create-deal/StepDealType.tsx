
import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import { Card, Checkbox, FormControlLabel, MenuItem } from '@mui/material'

interface FormValues {
  email: string
  Firstname: string
  lastname: string
  title: string
  dob: Date | null
  doj: Date | null
  dot: Date | null
  mobileNumber: string
}

const StepDealType = () => {
  const [selectedDate, setSelectedDate] = useState("")
  const defaultAccountValues: FormValues = {
    email: '',
    Firstname: '',
    lastname: '',
    title: '',
    dob: null,
    doj: null,
    dot: null,
    mobileNumber: ''
  }
  const accountSchema = yup.object().shape({
    Firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email().required(),
    title: yup.string().required('Title is required'),
    dob: yup.date().required('D.O.B is required'),
    doj: yup.date().required('D.O.J is required'),
    dot: yup.date().required('D.O.T is required'),
    mobileNumber: yup.string().required('Mobile number is required')
  })

  // const handleReset = () => {
  //   setActiveStep(0)
  //   accountReset({ email: '', Firstname: '', lastname: '', title: '' })
  // }

  const {
    control: accountControl,
    formState: { errors: accountErrors }
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  // const isCurrentStepValid = () => {
  //   switch (activeStep) {
  //     case 0:
  //       return (
  //         !accountErrors.title &&
  //         !accountErrors.Firstname &&
  //         !accountErrors.lastname &&
  //         !accountErrors.dob &&
  //         !accountErrors.doj &&
  //         !accountErrors.dot &&
  //         !accountErrors.mobileNumber &&
  //         !accountErrors.email
  //       )

  //     default:
  //       return false
  //   }
  // }

  const handleDateChange = (value:any) => {
    setSelectedDate(value)
  }
  const [checked, setChecked] = useState<boolean>(true)

  const handleChange = (event:any) => {
    setChecked(event.target.checked)
  }

  return (
    <>
      <Grid container sx={{ mb: 6 }} spacing={4}>
        <Grid item xs={12} sm={6} sx={{ mb: 2 }} className='empTextField'>
          <Controller
            name='Firstname'
            control={accountControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label='Firstname'
                onChange={onChange}
                error={Boolean(accountErrors.Firstname)}
                aria-describedby='stepper-linear-account-username'
                {...(accountErrors.Firstname && { helperText: 'This field is required' })}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className='empTextField'>
            <Controller
              name='lastname'
              control={accountControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  label='Lastname'
                  onChange={onChange}
                  error={Boolean(accountErrors.lastname)}
                  aria-describedby='stepper-linear-account-lastname'
                  {...(accountErrors.lastname && { helperText: 'This field is required' })}
                />
              )}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className='empTextField'>
            <Controller
              name='mobileNumber'
              control={accountControl}
              rules={{ required: 'Mobile number is required' }}
              render={({ field }) => (
                <div>
                  <Typography sx={{ fontSize: '12px', marginBottom: '4px' }}>Phone No</Typography>
                  <PhoneInput
                    inputStyle={{
                      background: '#fff',
                      height: '2.25rem',
                      width: '100%',
                      fontSize: '12px',
                      color: 'dddddd',
                      padding: '7.5px 13px 7.5px 2.7rem'
                    }}
                    value={field.value}
                    onChange={(value: any) => {
                      field.onChange(value)
                    }}
                  />
                  {accountErrors.mobileNumber && (
                    <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                      {accountErrors.mobileNumber.message}
                    </Typography>
                  )}
                </div>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className='empTextField'>
            <Controller
              name='email'
              control={accountControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='email'
                  value={value}
                  label='Email'
                  onChange={onChange}
                  error={Boolean(accountErrors.email)}
                  aria-describedby='stepper-linear-account-email'
                  {...(accountErrors.email && { helperText: accountErrors.email.message })}
                />
              )}
            />
          </div>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography sx={{ fontSize: '11px', mb: '4px' }}>D.O.B</Typography>
          <Datepickers
             id="dob_date"
             name="dob_date"
              value={selectedDate}
              onChange={handleDateChange}
              placeholder='Select a date'
              error={null}
              touched={null}
            />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography sx={{ fontSize: '11px', mb: '4px' }}>D.O.J</Typography>
          <Datepickers
             id="doj_date"
             name="doj_date"
              value={selectedDate}
              onChange={handleDateChange}
              placeholder='Select a date'
              error={null}
              touched={null}
            />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography sx={{ fontSize: '11px', mb: '4px' }}>D.O.J</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card
              sx={{
                width: '38px',
                height: '38px',
                borderRadius: '5px 0px 0px 5px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <FormControlLabel
                label=''
                control={<Checkbox checked={checked} onChange={handleChange} name='controlled' />}
                sx={{
                  margin: 0,
                  padding: 0,
                  '& .MuiButtonBase-root.MuiCheckbox-root': {
                    margin: 0,
                    padding: 0
                  }
                }}
              />
            </Card>
            <Datepickers
               id="doj_date"
               name="doj_date"
              value={selectedDate}
              onChange={handleDateChange}
              placeholder='Select a date'
              error={null}
              touched={null}
            />
          </div>
        </Grid>

        <Grid item xs={6} sm={6}>
          <CustomTextField label='Designation' fullWidth select defaultValue='App Design'>
            <MenuItem value='App Design'>App Design</MenuItem>
            <MenuItem value='App Customization'>App Customization</MenuItem>
            <MenuItem value='ABC Template'>ABC Template</MenuItem>
            <MenuItem value='App Development'>App Development</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={6} sm={6}>
          <CustomTextField label='Employee Group' fullWidth select defaultValue='App Design'>
            <MenuItem value='App Design'>App Design</MenuItem>
            <MenuItem value='App Customization'>App Customization</MenuItem>
            <MenuItem value='ABC Template'>ABC Template</MenuItem>
            <MenuItem value='App Development'>App Development</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={6} sm={6}>
          <CustomTextField label='Status' fullWidth select defaultValue='App Design'>
            <MenuItem value='App Design'>App Design</MenuItem>
            <MenuItem value='App Customization'>App Customization</MenuItem>
            <MenuItem value='ABC Template'>ABC Template</MenuItem>
            <MenuItem value='App Development'>App Development</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
      </>
  )
}



export default StepDealType


