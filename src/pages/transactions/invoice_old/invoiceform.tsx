// ** MUI Imports
import Grid from '@mui/material/Grid'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { MenuItem } from '@mui/material'
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useState } from 'react'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import Icon from 'src/@core/components/icon'


interface AddressValues {
  JobID: string
  customer: string
  Pickuplocation: string
  pickUpTime: string
  km: string
  Droplocation: string

}


const InvoiceForm = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null);

  const defaultAddressValues: AddressValues = {
    JobID: '',
    customer: '',
    Pickuplocation: '',
    pickUpTime: '',
    Droplocation: '',
    km: '',

  }

  const handleDateChange = (value: any) => {
    setSelectedDate(value)
  }

  const handleTimeChange = (value: any) => {
    // Handle the time change here, you can set it to state or perform other actions
    setSelectedTime(value);
  };

  const addressSchema = yup.object().shape({
    doorNo: yup.string().required(),
    streetName: yup.string().required(),
    suburb: yup.string().required(),
    postCode: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required('Title is required'),
    designation: yup.string().required('Title is required'),
    employeeGroup: yup.string().required('Title is required'),
    JobID: yup.string().required(),
    Pickuplocation: yup.string().required(),
    PickupDate: yup.date().required('D.O.B is required'),
    Droplocation: yup.string().required(),
    km: yup.string().required(),
    status: yup.string().required('Title is required')
  })

  const {
    control: addressControl,
    formState: { errors: addressErrors }
  } = useForm({
    defaultValues: defaultAddressValues,
    resolver: yupResolver(addressSchema)
  })

  return (

    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <div className='empTextField'>
          <Controller
            name='JobID'
            control={addressControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <>
                <CustomTextField
                  fullWidth
                  value={value}

                  label={
                    <div>
                      <span className='status-container'>Invoice ID</span>
                      <Typography variant="caption" color="error" sx={{ fontSize: '17px', marginLeft: '2px' }}>

                      </Typography>
                    </div>
                  }

                  onChange={onChange}
                  placeholder='Job ID'
                  error={Boolean(addressErrors.JobID)}
                  aria-describedby='stepper-linear-account-username'
                  {...(addressErrors.JobID && { helperText: 'This field is required' })}
                />
              </>
            )}
          />
        </div>


      </Grid>

      <Grid item xs={12} sm={6}>
        <div className='empTextField'>
          <Controller
            name='customer'
            control={addressControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <>
                <CustomTextField
                  fullWidth
                  value={value}
                  label={
                    <div>
                      <span className='status-container'> Customer</span>
                      <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>

                      </Typography>
                    </div>
                  }
                  onChange={onChange}
                  placeholder='Customer'
                  error={Boolean(addressErrors.customer)}
                  aria-describedby='stepper-linear-account-Customer'
                  {...(addressErrors.customer && { helperText: 'This field is required' })}
                />
              </>
            )}
          />
        </div>


      </Grid>

      <Grid item xs={12} sm={6}>
        <CustomTextField label={
          <div>
            <span className='status-container'>  Price Catageory</span>
            <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>
              *
            </Typography>
          </div>
        } fullWidth select defaultValue='Price Catageories'>
          <MenuItem value='Price Catageories'>Price Catageory</MenuItem>
          <MenuItem value='App Customization'>App Customization</MenuItem>
          <MenuItem value='ABC Template'>ABC Template</MenuItem>
          <MenuItem value='App Development'>App Development </MenuItem>
        </CustomTextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div>
          <span className='status-container' style={{ fontSize: '13px', marginBottom: '4px' }}>Pickup Date</span>
          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
        </div>
        <div style={{ position: 'relative' }}>
          <Datepickers
              id="pickup_date"
              name="pickup_date"
           value={selectedDate}
            onChange={handleDateChange}
            placeholder='Select a date'
            error={null}
            touched={null}


          />

          <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
            <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
          </div>
        </div>
      </Grid>

      <Grid item xs={12} sm={6}>
        <div>

          <span className='status-container' style={{ fontSize: '13px', marginBottom: '4px' }}>Pickup Time</span>
          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
        </div>

        <DatePicker
          inputClass="custom-input"
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder='Select a date'
          disableDayPicker
          format="hh:mm: A"
          plugins={[
            <TimePicker key="timePickerKey" />
          ]}
        />
      </Grid>


      <Grid item xs={12} sm={6}>
        <Controller
          name='Pickuplocation'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <>
                    <span className='status-container'>  Pickup location</span>
                    <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>
                      *
                    </Typography>
                  </>
                }
                onChange={onChange}
                placeholder='pick location'
                error={Boolean(addressErrors.Pickuplocation)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.Pickuplocation && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name='Droplocation'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <>
                    <span className='status-container'>  Drop location</span>
                    <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>
                      *
                    </Typography>
                  </>
                }
                onChange={onChange}
                placeholder='Drop location'
                error={Boolean(addressErrors.Droplocation)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.Droplocation && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name='km'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <>
                    <span className='status-container'>  KM</span>
                    <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>
                      *
                    </Typography>
                  </>
                }
                onChange={onChange}
                placeholder='Enter your Salary Per hour'
                error={Boolean(addressErrors.km)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.km && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <div>
          <span className='status-container' style={{ fontSize: '13px', marginBottom: '4px' }}>Due Date</span>
          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
        </div>
        <div style={{ position: 'relative' }}>
          <Datepickers
   id="due_date"
   name="due_date"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder='Select a Due Date'
            error={null}
            touched={null}


          />

          <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
            <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
          </div>
        </div>
      </Grid>

    </Grid>

    
  )
}

export default InvoiceForm






