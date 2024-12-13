import Grid from '@mui/material/Grid'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { IconButton, InputAdornment } from '@mui/material'
import Icon from 'src/@core/components/icon'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'

interface AddressValues {
  ContactPerson: string
  MobileNumbr: string
  Email: string
  password: any
}

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'rgba(208, 212, 241, 0.68)'
  } else if (selectedMode === 'light') {
    return 'black'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgba(208, 212, 241, 0.68)'
  } else {
    return 'black'
  }
}
interface contactProps {
  setEditId: (id: string) => void
  handleNext: () => void
  ref: any
  editid: any
  customer: any
}
export interface CustomerContactMethods {
  childMethod: any
  triggerValidation: () => Promise<boolean>
}

const CustomerContact: React.FC<contactProps> = forwardRef<CustomerContactMethods, contactProps>(
  ({ editid, handleNext, customer }, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const defaultAddressValues: AddressValues = {
      ContactPerson: '',
      MobileNumbr: '',
      Email: '',
      password: ''
    }

    const addressSchema = yup.object().shape({
      ContactPerson: yup.string().required(),
      MobileNumbr: yup.string().required(),
      Email: yup.string().required(),
      password: yup
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
        'Password must contain at least 1 uppercase letter, 1 number, and 1 symbol'
      )
      .required('Password is required'),
});
    const {
      handleSubmit,
      setValue,
      trigger,
      control: addressControl,
      formState: { errors: addressErrors }
    } = useForm({
      defaultValues: defaultAddressValues,
      resolver: yupResolver(addressSchema)
    })

    const fetchData = useCallback(async () => {
      const query = `query MyQuery {
        getCustomer5AAB(CId: ${editid}) {
          Address1
          Address2
          CId
          CompanyName
          CompanyPanNo
          ContactPerson
          Country
          CusGroup
          CustomerId
          Date
          Email
          FirstName
          IP
          InsertedBy
          LandLine
          LastName
          Mobile
          Password
          Photo
          PostCode
          State
          Status
          Suburb
          Title
          UpdatedAt
          UpdatedBy
        }
      }
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          const { Password } = res.data.data.getCustomer5AAB
          const decodedPassword = atob(Password);
          setValue('ContactPerson', res.data.data.getCustomer5AAB.ContactPerson)
          setValue('MobileNumbr', res.data.data.getCustomer5AAB.LandLine)
          setValue('Email', res.data.data.getCustomer5AAB.Email)
          setValue('password', decodedPassword)
        })

        .catch(err => {
          console.error(err)
        })
    }, [editid, setValue])
    useEffect(() => {
      if (editid != '' && editid != null && editid != undefined) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editid])

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmit)()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
      },
      editid
    }))

    const onSubmit = async (editedData: any) => {
      const encodedPassword = btoa(editedData.password);
      const designationExists = customer?.some(
        (item: any) => item.Email.toLowerCase() === editedData.Email.toLowerCase() && item.CId != editid
      )
      if (designationExists) {
        toast.error('Email is already exist')
        return
      }
      const query = editid
        ? `mutation my {
          updateCustomer5AAB(input: { ContactPerson: "${editedData.ContactPerson}", Email: "${editedData.Email}", LandLine: "${editedData.MobileNumbr}",CustomerId: "5AABC00${editid}" , Password: "${encodedPassword}", CId: ${editid}}) {
            Address2
            Address1
            CId
            CompanyName
            CompanyPanNo
            ContactPerson
            Country
            CusGroup
            CustomerId
            Date
            Email
            FirstName
            IP
            InsertedBy
            LandLine
            LastName
            Mobile
            Password
            Photo
            PostCode
            State
            Status
            Suburb
            Title
            UpdatedBy
            UpdatedAt
          }
        }`
        : `mutation my {
          createCustomer5AAB(input: {Address1: "", Address2: "", CId: 10, CompanyName: "", CompanyPanNo: "", ContactPerson: "${editedData.ContactPerson}", Country: "", CusGroup: "", CustomerId: "", Date: "", Email: "${editedData.Email}", FirstName: "", IP: "", InsertedBy: "", LandLine: "${editedData.MobileNumbr}", LastName: "", Mobile: "", Password: "${encodedPassword}", Photo: "", PostCode: "", State: "", Status: false, Suburb: "", Title: "", UpdatedAt: "", UpdatedBy: ""}) {
            Address2
            Address1
            CId
            CompanyName
            CompanyPanNo
            ContactPerson
            Country
            CusGroup
            CustomerId
            Date
            Email
            FirstName
            IP
            InsertedBy
            LandLine
            LastName
            Mobile
            Password
            Photo
            PostCode
            State
            Status
            Suburb
            Title
            UpdatedBy
            UpdatedAt
          }
        }`
    
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
    
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          toast.success('Contact Details Updated Successfully')
          const id = editid ? res.data.data.updateCustomer5AAB.CId : res.data.data.createCustomer5AAB.CId
          handleNext()
        })
        .catch(err => {
          console.log(err)
        })
    }
    
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div className='empTextField'>
              <Controller
                name='ContactPerson'
                control={addressControl}
                rules={{
                  required: true,
                  pattern: {
                    value: /^[A-Z]*\.?[a-z]*$/,
                    message: 'Invalid input. Please enter a valid number or decimal.'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor()
                            }}
                          >
                            Contact Person
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(inputValue)) {
                          const modifiedValue = inputValue.replace(/\b\w/g, (char) => char.toUpperCase());
                          onChange(modifiedValue);
                        }
                      }}
                      
                      placeholder='Contact Person'
                      error={Boolean(addressErrors.ContactPerson)}
                      aria-describedby='stepper-linear-account-ContactPerson'
                      {...(addressErrors.ContactPerson && { helperText: 'Contact Person is required' })}
                    />
                  </>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='MobileNumbr'
              control={addressControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor()
                          }}
                        >
                          Landline Number
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    onChange={e => {
                      const inputValue = e.target.value
                      if (/^\d{0,10}$/.test(inputValue)) {
                        onChange(e)
                      }
                    }}
                    placeholder='Enter your Landline Number'
                    error={Boolean(addressErrors.MobileNumbr)}
                    aria-describedby='stepper-linear-account-username'
                    {...(addressErrors.MobileNumbr && { helperText: 'Landline Number is required' })}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name='Email'
              control={addressControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor()
                          }}
                        >
                          Email
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    onChange={e => {
                      const inputValue = e.target.value;
                      const filteredValue = inputValue.replace(/[^\w.@]/gi, ''); 
                      const modifiedValue = filteredValue.toLowerCase();
                      onChange(modifiedValue);
                    }}
                    placeholder='Enter your Email'
                    error={Boolean(addressErrors.Email)}
                    aria-describedby='stepper-linear-account-username'
                    {...(addressErrors.Email && { helperText: 'Email is required' })}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: '0px' }}>
            <Controller
              name='password'
              control={addressControl}
              rules={{ required: true}}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label={
                    <div>
                      <span
                        className='firstname'
                        style={{
                          color: getColor()
                        }}
                      >
                        Password
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }   
                  onChange={onChange}
                  id='auth-login-v2-password'
                  helperText={
                    addressErrors.password ? (typeof addressErrors.password.message === 'string' ? addressErrors.password.message : '') : ''
                  }
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
                  error={Boolean(addressErrors.password)}
                  FormHelperTextProps={{
                    style: {
                      color: addressErrors.password ? '#EA5455' : 'inherit',
                      fontSize: '0.8125rem'
                    }
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    )
  }
)
export default CustomerContact
