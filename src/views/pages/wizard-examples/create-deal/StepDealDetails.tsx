import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
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


const StepDealDetails = () => {

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
                    name='doorNo'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Door No / Building Name *'
                          onChange={onChange}
                          error={Boolean(addressErrors.doorNo)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.doorNo && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='streetName'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Street Name / Area Name / Landmark *'
                          onChange={onChange}
                          error={Boolean(addressErrors.streetName)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.streetName && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='suburb'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Suburb *'
                          onChange={onChange}
                          error={Boolean(addressErrors.suburb)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.suburb && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='postCode'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Postcode *'
                          onChange={onChange}
                          error={Boolean(addressErrors.postCode)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.postCode && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='state'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='State *'
                          onChange={onChange}
                          error={Boolean(addressErrors.state)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.state && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
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
  )
}

export default StepDealDetails
