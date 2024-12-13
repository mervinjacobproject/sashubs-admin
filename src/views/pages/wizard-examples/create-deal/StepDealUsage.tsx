import Grid from '@mui/material/Grid'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'

interface AddressValues {
  doorNo: string
  streetName: string
  suburb: string
  postCode: string
  state: string
  country: string
  designation: string
  employeeGroup: string
  salaryPerSqm: string
  minoCharge: string
  salaryPerWeight: string
  salaryPerHour: string
  status: string
}

const StepDealUsage = () => {

  const defaultAddressValues: AddressValues = {
    doorNo: '',
    streetName: '',
    suburb: '',
    postCode: '',
    state: '',
    country: '',
    designation: '',
    employeeGroup: '',
    salaryPerSqm: '',
    minoCharge: '',
    salaryPerWeight: '',
    salaryPerHour: '',
    status: ''
  }

  const addressSchema = yup.object().shape({
    doorNo: yup.string().required(),
    streetName: yup.string().required(),
    suburb: yup.string().required(),
    postCode: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required('Title is required'),
    designation: yup.string().required('Title is required'),
    employeeGroup: yup.string().required('Title is required'),
    salaryPerSqm: yup.string().required(),
    minoCharge: yup.string().required(),
    salaryPerWeight: yup.string().required(),
    salaryPerHour: yup.string().required(),
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
            name='salaryPerSqm'
            control={addressControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <>
                <CustomTextField
                  fullWidth
                  value={value}
                  label='Salary per SQM * (AUD)'
                  onChange={onChange}
                  placeholder='Enter your Salary Per Sqm'
                  error={Boolean(addressErrors.salaryPerSqm)}
                  aria-describedby='stepper-linear-account-username'
                  {...(addressErrors.salaryPerSqm && { helperText: 'This field is required' })}
                />
              </>
            )}
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name='minoCharge'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label='MinoCharge *'
                onChange={onChange}
                placeholder='Enter your Salary Per Km'
                error={Boolean(addressErrors.minoCharge)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.minoCharge && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name='salaryPerWeight'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label='Salary per Weight(Per kg) * (AUD)'
                onChange={onChange}
                placeholder='Enter your Salary Per Weight'
                error={Boolean(addressErrors.salaryPerWeight)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.salaryPerWeight && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name='salaryPerHour'
          control={addressControl}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <>
              <CustomTextField
                fullWidth
                value={value}
                label='Salary per Hour * (AUD)'
                onChange={onChange}
                placeholder='Enter your Salary Per hour'
                error={Boolean(addressErrors.salaryPerHour)}
                aria-describedby='stepper-linear-account-username'
                {...(addressErrors.salaryPerHour && { helperText: 'This field is required' })}
              />
            </>
          )}
        />
      </Grid>
    </Grid>
  )
}

export default StepDealUsage






