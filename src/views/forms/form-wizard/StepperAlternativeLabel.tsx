import { Fragment, useState, forwardRef, ForwardedRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Switch from '@mui/material/Switch'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import * as yup from 'yup'
import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import FileUploaderSingle from '../form-elements/file-uploader/FileUploaderSingle'

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
interface FileValues {
  image: string | Blob | null
  ded: Date | null
}
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

const steps = [
  {
    title: 'Employee',
    subtitle: 'Add new Employee'
  },
  {
    title: 'Images',
    subtitle: 'Photo'
  },
  {
    title: 'Address',
    subtitle: 'Add Address'
  }
]
const StepperAlternativeLabel = () => {
  const [selected] = useState<string>('')


  const [activeStep, setActiveStep] = useState<number>(0)
  const [fileInputs, setFileInputs] = useState<number[]>([]);


  const CustomInput = forwardRef(
    ({ ...props }: React.ComponentProps<typeof CustomTextField>, ref: ForwardedRef<HTMLElement>) => {
      return <CustomTextField fullWidth inputRef={ref} sx={{ width: "100%" }} {...props} />
    }
  )

  // const { getRootProps, getInputProps } = useDropzone({
  //   maxFiles: 2,
  //   maxSize: 2000000,
  //   accept: {
  //     'image/*': ['.png', '.jpg', '.jpeg', '.gif']
  //   },
  //   onDrop: (acceptedFiles: File[]) => {
  //     setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
  //   },
  //   onDropRejected: () => {
  //     toast.error('You can only upload 2 files & maximum size of 2 MB.', {
  //       duration: 2000
  //     })
  //   }
  // })

  // const renderFilePreview = (file: FileProp) => {
  //   if (file.type.startsWith('image')) {
  //     return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
  //   } else {
  //     return <Icon icon='tabler:file-description' />
  //   }
  // }

  // const handleRemoveFile = (file: FileProp) => {
  //   const uploadedFiles = files
  //   const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
  //   setFiles([...filtered])
  // }

  const allowedFileFormats = '.jpeg, .jpg, .png, .pdf, .doc, .docx, .xls, .xlsx'
  const handleFileUpload = (event: any, index: any) => {
    const selectedFile = event.target.files[0]

    // Perform any additional logic with the selected file

  }
  const addAnotherDocument = () => {
    setFileInputs(prevInputs => [...prevInputs, prevInputs.length])
  }

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
  const defaultFileValues: FileValues = {
    image: null,
    ded: null
  }
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

  // const fileSchema = yup.object().shape({
  //   image: yup.mixed().nullable().test('required', 'Image is required', value => {
  //     return value !== null && (value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File))
  //   }),
  //   ded: yup.date().required('D.O.T is required'),
  // });
  const fileSchema = yup.object().shape({
    // image: yup
    //   .mixed()
    //   .nullable()
    //   .test('required', 'Image is required', (value) => {
    //     return value === null || (value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File));
    //   }),
    // ded: yup.date().required('D.O.T is required'),
  })

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
    reset: accountReset,
    control: accountControl,
    handleSubmit: handleAccountSubmit,
    formState: { errors: accountErrors }
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })
  const {
    // reset: fileReset,
    control: fileControl,
    handleSubmit: handleFileSubmit,
    formState: { errors: fileErrors }
  } = useForm({
    defaultValues: defaultFileValues,
    resolver: yupResolver(fileSchema)
  })
  const {
    // reset: addressReset,
    control: addressControl,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors }
  } = useForm({
    defaultValues: defaultAddressValues,
    resolver: yupResolver(addressSchema)
  })
  const handleReset = () => {
    setActiveStep(0)
    accountReset({ email: '', Firstname: '', lastname: '', title: '' })
  }
  handleAccountSubmit(data => {
    // console.log('Base64 Encoded Form Data:', data)
  })
  handleFileSubmit(data => {
    // console.log('Base64 Encoded Form Data:', data)
  })
  handleAddressSubmit(data => {
    // console.log('Base64 Encoded Form Data:', data)
  })

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleNext = () => {
    if (isCurrentStepValid()) {
      if (activeStep === 0) {
        handleAccountSubmit(data => {
          setActiveStep(prevActiveStep => prevActiveStep + 1)
        })()
      } else if (activeStep === 1) {
        handleFileSubmit(data => {
          setActiveStep(prevActiveStep => prevActiveStep + 1)
        })()
      } else if (activeStep === 2) {
        handleAddressSubmit(data => {
          setActiveStep(prevActiveStep => prevActiveStep + 1)
        })()
      }
    } else {
    }
  }


  const isCurrentStepValid = () => {
    switch (activeStep) {
      case 0:
        return (
          !accountErrors.title &&
          !accountErrors.Firstname &&
          !accountErrors.lastname &&
          !accountErrors.dob &&
          !accountErrors.doj &&
          !accountErrors.dot &&
          !accountErrors.mobileNumber &&
          !accountErrors.email
        )
      case 1:
        return true
      case 2:
        return (
          !addressErrors.doorNo &&
          !addressErrors.streetName &&
          !addressErrors.suburb &&
          !addressErrors.postCode &&
          !addressErrors.state &&
          !addressErrors.country &&
          !addressErrors.designation &&
          !addressErrors.employeeGroup &&
          !addressErrors.salaryPerSqm &&
          !addressErrors.minoCharge &&
          !addressErrors.salaryPerWeight &&
          !addressErrors.salaryPerHour &&
          !addressErrors.postCode &&
          !addressErrors.status
        )
      default:
        return false
    }
  }
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <div style={{ display: 'flex' }}>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name='title'
                      control={accountControl}
                      rules={{ required: 'Status is required' }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          label='Title'
                          select
                          sx={{
                            // width: '100px',
                            width:"90%",
                            '& .MuiFilledInput-input.MuiSelect-select': {
                              // minWidth: '4rem !important'
                            }
                          }}
                          SelectProps={{ value, onChange }}
                          {...(accountErrors.title && { error: true, helperText: accountErrors.title.message })}
                        >
                          <MenuItem value=''>Select</MenuItem>
                          <MenuItem value='Mr'>Mr</MenuItem>
                          <MenuItem value='Mrs'>Mrs</MenuItem>
                          <MenuItem value='Miss'>Miss</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9} className='empTextField'>
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
                          placeholder='carterLeonard'
                          error={Boolean(accountErrors.Firstname)}
                          aria-describedby='stepper-linear-account-username'
                          {...(accountErrors.Firstname && { helperText: 'This field is required' })}
                        />
                      )}
                    />
                  </Grid>
                </div>
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
                        placeholder='yourLastName'
                        error={Boolean(accountErrors.lastname)}
                        aria-describedby='stepper-linear-account-lastname'
                        {...(accountErrors.lastname && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6} >
                <div className='empTextField'>
                  <Controller
                    name='mobileNumber'
                    control={accountControl}
                    rules={{ required: 'Mobile number is required' }}
                    render={({ field }) => (
                      <div>
<Typography sx={{fontSize:"12px",marginBottom:"4px"}}>Phone No</Typography>
                        <PhoneInput
                          inputStyle={{ background: '#fff',height:"2.25rem",width:"100%", fontSize: '12px', color: 'dddddd',padding:"7.5px 13px 7.5px 2.7rem" }}
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
                        placeholder='carterleonard@gmail.com'
                        aria-describedby='stepper-linear-account-email'
                        {...(accountErrors.email && { helperText: accountErrors.email.message })}
                      />
                    )}
                  />
                  {/* <button onClick={hanldeApi}>Add</button> */}
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className='empTextField'>
                  <Controller
                    name='dob'
                    control={accountControl}
                    rules={{ required: 'D.O.B is required' }}
                    render={({ field, fieldState }) => (
                      <div className='empTextField'>
                        <Typography sx={{ mb: 2, color: 'text.secondary', fontWeight: '600', fontSize: '10px' }}>
                          D.O.B
                        </Typography>
                        <DatePicker
                          selected={field.value}
                          onChange={date => field.onChange(date)}
                          customInput={<CustomInput />}
                          wrapperClassName=''
                        />
                        {fieldState?.error && (
                          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className='empTextField'>
                  <Controller
                    name='doj'
                    control={accountControl}
                    rules={{ required: 'D.O.J is required' }}
                    render={({ field, fieldState }) => (
                      <div className='empTextField'>
                        <Typography sx={{ mb: 2, color: 'text.secondary', fontWeight: '600', fontSize: '10px' }}>
                          D.O.J
                        </Typography>
                        <DatePicker
                          selected={field.value}
                          onChange={date => field.onChange(date)}
                          customInput={<CustomInput />}
                          wrapperClassName='w-full'
                        />
                        {fieldState?.error && (
                          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className='empTextField'>
                  <Controller
                    name='dot'
                    control={accountControl}
                    rules={{ required: 'D.O.T is required' }}
                    render={({ field, fieldState }) => (
                      <div className='empTextField'>
                        <Typography sx={{ mb: 2, color: 'text.secondary', fontWeight: '600', fontSize: '10px' }}>
                          D.O.T
                        </Typography>
                        <DatePicker
                          selected={field.value}
                          onChange={date => field.onChange(date)}
                          customInput={<CustomInput />}
                          wrapperClassName='w-full'
                        />
                        {fieldState?.error && (
                          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sm={3} sx={{display:'flex',justifyContent:"center",alignItems:"end"}}>
                <div className='empTextField' style={{display:"flex",alignItems:"center",justifyContent:"end"}}>
                  <Typography sx={{ mb: 1, color: 'text.secondary', fontWeight: '600', fontSize: '11px' }}>
                    App Access
                  </Typography>
                  <Switch sx={{paddingBottom:"0 !important"}} id='invoice-add-payment-stub' />
                </div>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={e => e.preventDefault()}>
            <Grid container spacing={12}>
            <Grid item xs={12} sm={6}>
           <FileUploaderSingle/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  Documents (Upload Only .jpeg , .jpg , .png ,.pdf ,.doc ,.docx,.xls ,.xlsx Files Only)
                </Typography>
                <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                  {fileInputs.map((input:any, index:number) => (
                    <div key={index} style={{ display: 'grid', gap: '5px' }}>
                      <Typography sx={{ mb: 2, color: 'text.secondary' }}>Document Name {index + 1}</Typography>
                      <Controller
                        name={`documents[${index}]` as 'image' | 'ded'}
                        control={fileControl}
                        defaultValue={null}
                        rules={{ required: 'Document is required' }}
                        render={({ field }) => (
                          <div>
                            <input
                              type='file'
                              accept={allowedFileFormats}
                              onChange={event => {
                                handleFileUpload(event, index)
                                field.onChange(event)
                              }}
                            />
                            {/* {fileErrors?.documents && fileErrors.documents[index] && (
                              <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                                {fileErrors.documents[index].message}
                              </Typography>
                            )} */}
                          </div>
                        )}
                      />
                    </div>
                  ))}
                  <Typography
                    sx={{ mb: 2, color: '#776cff', cursor: 'pointer', marginY: '20px' }}
                    onClick={addAnotherDocument}
                  >
                    Add another Document
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div className='empTextField'>
                  <Controller
                    name='ded'
                    control={fileControl}
                    rules={{ required: 'D.E.D is required' }}
                    render={({ field }) => (
                      <div className='empTextField'>
                        <Typography sx={{ mb: 2, color: 'text.secondary', fontWeight: '600', fontSize: '10px' }}>
                          Document Expiry Date
                        </Typography>
                        <DatePicker
                          selected={field.value}
                          onChange={date => field.onChange(date)}
                          customInput={<CustomInput />}
                          wrapperClassName='w-full'
                        />

                        {/* {fieldState?.error && (
                          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                            {fieldState.error.message}
                          </Typography>
                        )} */}
                      </div>
                    )}
                  />
                </div>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={e => e.preventDefault()}>
            <Grid container spacing={12}>
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
                          placeholder='Enter Your Door No / Building Name'
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
                          placeholder='Street Name / Area Name / Landmark'
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
                          placeholder='Enter your Suburb'
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
                          placeholder='Enter your Postcode'
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
                          placeholder='Enter your State'
                          error={Boolean(addressErrors.state)}
                          aria-describedby='stepper-linear-account-username'
                          {...(addressErrors.state && { helperText: 'This field is required' })}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='country'
                    control={addressControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          label='Country'
                          select
                          sx={{
                            width: '100%',
                            '& .MuiFilledInput-input.MuiSelect-select': {
                              minWidth: '4rem !important'
                            }
                          }}
                          SelectProps={{ value, onChange }}
                          {...(addressErrors.country && { error: true, helperText: 'This field is required' })}
                        >
                          <MenuItem value=''>Select</MenuItem>
                          <MenuItem value='ind'>India</MenuItem>
                          <MenuItem value='aus'>Australia</MenuItem>
                          <MenuItem value='ire'>Ireland</MenuItem>
                        </CustomTextField>
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='designation'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <CustomTextField
                        label='Designation'
                        select
                        sx={{
                          width: '100%',
                          '& .MuiFilledInput-input.MuiSelect-select': {
                            minWidth: '4rem !important'
                          }
                        }}
                        SelectProps={{ value, onChange }}
                        {...(addressErrors.designation && { error: true, helperText: 'This field is required' })}
                      >
                        <MenuItem value=''>Select</MenuItem>
                        <MenuItem value='ind'>India</MenuItem>
                        <MenuItem value='aus'>Australia</MenuItem>
                        <MenuItem value='ire'>Ireland</MenuItem>
                      </CustomTextField>
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='employeeGroup'
                  control={addressControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <CustomTextField
                        label='Employee Group *'
                        select
                        sx={{
                          width: '100%',
                          '& .MuiFilledInput-input.MuiSelect-select': {
                            minWidth: '4rem !important'
                          }
                        }}
                        SelectProps={{ value, onChange }}
                        {...(addressErrors.employeeGroup && { error: true, helperText: 'This field is required' })}
                      >
                        <MenuItem value=''>Select</MenuItem>
                        <MenuItem value='ind'>India</MenuItem>
                        <MenuItem value='aus'>Australia</MenuItem>
                        <MenuItem value='ire'>Ireland</MenuItem>
                      </CustomTextField>
                    </>
                  )}
                />
              </Grid>
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name='status'
                  control={addressControl}
                  rules={{ required: 'Status is required' }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <CustomTextField
                        label='Status *'
                        select
                        sx={{
                          width: '100%',
                          '& .MuiFilledInput-input.MuiSelect-select': {
                            minWidth: '4rem !important'
                          }
                        }}
                        SelectProps={{ value, onChange }}
                        {...(addressErrors.status && { error: true, helperText: addressErrors.status.message })}
                      >
                        <MenuItem value=''>Select</MenuItem>
                        <MenuItem value='ind'>India</MenuItem>
                        <MenuItem value='aus'>Australia</MenuItem>
                        <MenuItem value='ire'>Ireland</MenuItem>
                      </CustomTextField>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return (
        <form onSubmit={e => e.preventDefault()} >
          <Grid container spacing={5}>
            <Grid item xs={12} sx={{padding:"0px !important"}}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', marginY: '10px' }}>
                {steps[activeStep].title}
              </Typography>
              <Typography variant='caption' component='p'>
                {/* {steps[activeStep].subtitle} */}
              </Typography>
            </Grid>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between',marginTop:"1rem" }}>
              <Button variant='tonal' color='secondary' disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button
                sx={{
                  background: '#776cff',
                  color: '#fff',
                  '&:hover': {
                    background: '#776cff'
                  }
                }}
                onClick={handleNext}
                disabled={Object.keys(accountErrors).length !== 0}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    }
  }

  return (
    <Fragment>
      <StepperWrapper
        sx={{
          border: '2px solid #fff',
          padding: '10px',
          borderRadius: '10px',
          background:
            localStorage.getItem('selectedMode') === 'dark'
              ? 'transparent'
              : localStorage.getItem('selectedMode') === 'light'
              ? '#fff'
              : localStorage.getItem('systemMode') === 'dark'
              ? 'transparent'
              : '#fff'
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => {
            return (
              <Step key={index}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                      {/* <Typography className='step-subtitle'>{step.subtitle}</Typography> */}
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      <Card sx={{ mt: 4, padding: '20px', border: '2px solid #fff' }}>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </Fragment>
  )
}

export default StepperAlternativeLabel
