import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Modal, Box, Select, FormControl, FormLabel, FormHelperText } from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneInput from 'react-phone-input-2'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import 'react-phone-input-2/lib/style.css'
import { MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'

interface FormValues {
  Firstname: string
  lastname: string
  CompanyName: string
  CompanyABNNumber: string
  CustomerGroup: string
  title: string
  mobileNumber: string
}

export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
}

interface customerProps {
  handleNext: () => void
  ref: any
  editid: any
  setEditId: any
}

const CustomerNew: React.FC<customerProps> = forwardRef<CustomerNewMethods, customerProps>(
  ({ handleNext, editid, setEditId }, ref) => {
    const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
    const [emp_group, setEmployeegroup] = useState('')
    const [customerlist, setcustomerlist] = useState<any>([])
    const [qty, setQty] = useState('')
    const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
    const [showAddNewOption, setShowAddNewOption] = useState(true)
    const defaultAccountValues: FormValues = {
      Firstname: '',
      lastname: '',
      CompanyName: '',
      CompanyABNNumber: '',
      CustomerGroup: '',
      title: '',
      mobileNumber: ''
    }
    const handleEmployeeGroupOpen = () => {
      setOpenPopupEmployeeGroup(true)
    }
    const handleEmployeeGroupClose = () => {
      setOpenPopupEmployeeGroup(false)
    }

    const fetchEmployeeGroup = async () => {
      try {
        const response = await ApiClient.get(`/api.php?moduletype=customer_grp&apitype=list_all&status=1`)
        setGetEmployeeGroup(response.data)
      } catch (error) {
        throw error
      }
    }

    useEffect(() => {
      fetchEmployeeGroup()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
      handleSubmit: handleSubmitEmployee,
      control: employeeControl,
      reset,
      formState: { errors: employeeErrors }

    } = useForm<any>({
      defaultValues: {
        groupName: ''
      }
    })

    const onSubmitEmployee = (data: any) => {
      ApiClient.post(
        `/api.php?moduletype=customer_grp&apitype=add&groupname=${data.groupName}&status=1&lastmodifier=${1}`
      )
        .then((res: any) => {


          if(res.data[0].message ==="Group Name already Exists.."){
            toast.error('Group Name already Exists..')
            reset({ groupName: '' });


        }else{
          fetchEmployeeGroup()
          toast.success('Saved successfully')
          handleEmployeeGroupClose()
        }



        })
        .catch((err: any) => {
          toast.error('Error saving data')
        })
    }

    const accountSchema = yup.object().shape({
      Firstname: yup
        .string()
        .required('Firstname  is required')
        .matches(/^[A-Za-z]+$/, 'Firstname must contain only letters'),
      lastname: yup.string().required(),
      CustomerGroup: yup.string().required(),
      CompanyName: yup.string().required(),
      CompanyABNNumber: yup.string().matches(/^\d{11}$/, 'ABN must be 11 digits').required(),
      title: yup.string().required('Title is required'),
      mobileNumber: yup.string().required('Mobile number is required')

    })


    const {
      handleSubmit,
      setValue,
      trigger,
      watch,
      control: accountControl,
      formState: { errors: accountErrors }
    } = useForm<FormValues>({
      defaultValues: defaultAccountValues,
      resolver: yupResolver(accountSchema)
    })

    const watchAllFields = watch()

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

    const fetchData = useCallback(async () => {
      if (editid != '' && editid != null && editid != undefined) {
        ApiClient.get('/api.php?moduletype=customer&apitype=list&id=' + editid)
          .then((res: any) => {
            setcustomerlist(res.data)

            const response = res.data

            setValue('title', response['0'].title)
            setValue('Firstname', response['0'].firstname)
            setValue('lastname', response['0'].lastname)
            setValue('CompanyName', response['0'].companyname)
            setValue('CompanyABNNumber', response['0'].cmpyabnno)
            setValue('title', response['0'].title)
            setValue('mobileNumber', response['0'].mobile)
            setValue('CustomerGroup', response['0'].cus_group)
          })
          .catch((err: any) => {
            throw err
          })
      }
    }, [editid, setValue, setcustomerlist])

    useEffect(() => {
      if (editid != '' && editid != null && editid != undefined) {
        fetchData()
      }
    }, [editid, fetchData])

    const onSubmit = async (editedData: any) => {
      const { Firstname, lastname, CompanyName, CompanyABNNumber, title, CustomerGroup, mobileNumber } = editedData
      const lastmodifier = '1'
      let str = ''
      let apitype = 'add'
      if (editid != null && editid != '' && editid != undefined) {
        str = `&id=${editid}`
        apitype = 'edit'
      }
      try {
        let DESIGNATION_API_ENDPOINT = `https://api.5aabtransport.com.au/api.php?moduletype=customer${str}`
        DESIGNATION_API_ENDPOINT += `&apitype=${apitype}`
        DESIGNATION_API_ENDPOINT += `&firstname=${Firstname}`
        DESIGNATION_API_ENDPOINT += `&cus_group=${CustomerGroup}`
        DESIGNATION_API_ENDPOINT += `&lastname=${lastname}`
        DESIGNATION_API_ENDPOINT += `&companyname=${CompanyName}`
        DESIGNATION_API_ENDPOINT += `&cmpyabnno=${CompanyABNNumber}`
        DESIGNATION_API_ENDPOINT += `&title=${title}`
        DESIGNATION_API_ENDPOINT += `&mobile=${mobileNumber}`
        DESIGNATION_API_ENDPOINT += `&lastmodifier=${lastmodifier}`

        await axios
          .post(DESIGNATION_API_ENDPOINT)
          .then(response => {
            const id = response.data[0].id

            if (id !== undefined) {
              setEditId(id)
            }
            if (response.data[0].message === 'Companyname Alreay exists.') {
              toast.error('Company Name Alreay exists..')
              return
            } else {
              toast.success(response.data[0].message)
              handleNext()
            }
          })
          .catch(error => {
            throw error
          })
      } catch (error: any) {
        throw error
      }
    }

    const handleEmployeeGroup = (event: any) => {
      const value = event?.target.value
      if (value === 'Add New') {
        handleEmployeeGroupOpen()
      } else {
        setEmployeegroup(value)
      }
    }

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container sx={{ mb: 6 }} spacing={4}>
            <Grid item xs={2}>
              <Controller
                render={({ field }) => (
                  <FormControl error={Boolean(accountErrors.title)}>
                    <FormLabel htmlFor='title' className='font-medium text-14' component='legend'>
                      <div>
                        <span className='title' style={{
                      color:
                        localStorage.getItem('selectedMode') === 'dark'
                          ? '#fff'
                          : localStorage.getItem('selectedMode') === 'light'
                          ? '#222'
                          : localStorage.getItem('systemMode') === 'dark'
                          ? '#fff'
                          : '#fff', fontSize: '14px'
                    }}>Title</span>
                        <Typography
                          variant='caption'
                          color='error'
                          sx={{ fontSize: '17px', marginLeft: '2px', marginBottom: '10px' }}
                        >
                          *
                        </Typography>
                      </div>
                    </FormLabel>
                    <Select id='title' {...field} variant='outlined' sx={{ paddingTop: '3px' }} size='small'>
                      <MenuItem value='Mr' selected={customerlist && customerlist['0']?.title === 'Mr'}>
                        Mr
                      </MenuItem>
                      <MenuItem value='Mrs' selected={customerlist && customerlist['0']?.title === 'Mrs'}>
                        Mrs
                      </MenuItem>
                      <MenuItem value='Miss' selected={customerlist && customerlist['0']?.title === 'Miss'}>
                        Miss
                      </MenuItem>
                    </Select>
                    <FormHelperText >
                    <Typography sx={{ color: 'red'  , fontSize: '12px'}}>{accountErrors.title ? 'Title is required' : ''}</Typography>
                    </FormHelperText>
                  </FormControl>
                )}
                name='title'
                control={accountControl}

              />
            </Grid>

            <Grid item xs={4} sx={{ mb: 2 }} className='empTextField'>
              <Controller
                name='Firstname'
                control={accountControl}
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
                    id='Firstname'
                    fullWidth
                    value={value || ''}
                    label= {
                      <div>
                        <span className='firstname' style={{
                      color:
                        localStorage.getItem('selectedMode') === 'dark'
                          ? '#fff'
                          : localStorage.getItem('selectedMode') === 'light'
                          ? '#222'
                          : localStorage.getItem('systemMode') === 'dark'
                          ? '#fff'
                          : '#fff', fontSize: '14px'
                    }}>First Name</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                    </Typography>

                      </div>
                    }
                    placeholder='First Name'
                    onChange={e => {
                      const inputValue = e.target.value
                      if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                        onChange(e)
                      }
                    }}
                    error={Boolean(accountErrors.Firstname)}
                    aria-describedby='stepper-linear-account-username'


                  />
                  <FormHelperText >
                  <Typography sx={{ color: 'red'  , fontSize: '12px'}}>{accountErrors.Firstname ? 'First Name is required' : ''}</Typography>
                  </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <div className='empTextField'>
                <Controller
                  name='lastname'
                  control={accountControl}
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
                      id='lastname'
                      fullWidth
                      value={value}
                      label= {
                        <div>
                          <span className='firstname' style={{
                        color:
                          localStorage.getItem('selectedMode') === 'dark'
                            ? '#fff'
                            : localStorage.getItem('selectedMode') === 'light'
                            ? '#222'
                            : localStorage.getItem('systemMode') === 'dark'
                            ? '#fff'
                            : '#fff', fontSize: '14px'
                      }}>Last Name</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                      </Typography>

                        </div>
                      }
                      placeholder='Last Name'
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                          onChange(e)
                        }
                      }}
                      error={Boolean(accountErrors.lastname)}
                      aria-describedby='stepper-linear-account-lastname'
                      // {...(accountErrors.lastname && { helperText: 'LastName is required' })}
                    />
                    <FormHelperText>
                  <Typography sx={{ color: 'red'  , fontSize: '12px'}}>{accountErrors.lastname ? 'Last Name is required' : ''}</Typography>
                  </FormHelperText>
                  </>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className='empTextField'>
                <Controller
                  name='CompanyName'
                  control={accountControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                    <CustomTextField
                      id='CompanyName'
                      fullWidth
                      value={value}
                      label= {
                        <div>
                          <span className='firstname' style={{
                        color:
                          localStorage.getItem('selectedMode') === 'dark'
                            ? '#fff'
                            : localStorage.getItem('selectedMode') === 'light'
                            ? '#222'
                            : localStorage.getItem('systemMode') === 'dark'
                            ? '#fff'
                            : '#fff', fontSize: '14px'
                      }}>Company Name</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                      </Typography>

                        </div>
                      }
                      placeholder='Company Name'
                      onChange={onChange}
                      error={Boolean(accountErrors.CompanyName)}
                      aria-describedby='stepper-linear-account-CompanyName'
                      // {...(accountErrors.CompanyName && { helperText: 'company Name  is required' })}
                    />
                    <FormHelperText>
                  <Typography sx={{ color: 'red'  , fontSize: '12px'}}>{accountErrors.CompanyName? 'Company Name is required' : ''} </Typography>
                  </FormHelperText>
                  </>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className='empTextField'>
                <Controller
                  name='CompanyABNNumber'
                  control={accountControl}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^\d{11}$/,
                      message: 'ABN must be 11 digits'
                    }
                  }}
                  render={({ field: { value, onChange } }) => (
                    <>
                    <CustomTextField
                      id='CompanyABNNumber'
                      fullWidth
                      value={value}
                      label= {
                        <div>
                          <span className='firstname' style={{
                        color:
                          localStorage.getItem('selectedMode') === 'dark'
                            ? '#fff'
                            : localStorage.getItem('selectedMode') === 'light'
                            ? '#222'
                            : localStorage.getItem('systemMode') === 'dark'
                            ? '#fff'
                            : '#fff', fontSize: '14px'
                      }}>Company ABN Number</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                      </Typography>

                        </div>
                      }
                      placeholder='Company ABN Number'
                      onChange={e => {
                        const inputValue = e.target.value
                        // if (/^[0-9]*\.?[0-9]*$/.test(inputValue) || inputValue === '')
                        if (/^\d{0,11}$/.test(inputValue))
                        {
                          onChange(e)
                        }
                      }}
                      error={Boolean(accountErrors.CompanyABNNumber)}
                      aria-describedby='stepper-linear-account-CompanyABNNumber'
                      // {...(accountErrors.CompanyABNNumber && { helperText: accountErrors.CompanyABNNumber.message  })}
                    />
                    <FormHelperText >
                  <Typography sx={{ color: 'red'  , fontSize: '12px'}}>{accountErrors.CompanyABNNumber ? 'ABN must be 11 digits' : ''}</Typography>
                  </FormHelperText>
                  </>
                  )}
                />
              </div>
            </Grid>

              <Grid item xs={3}>
                <div style={{ paddingTop: '6px' }} className='empTextField'>
                  <Controller
                    name='mobileNumber'
                    control={accountControl}
                    rules={{ required: 'Mobile Number is required' }}
                    render={({ field }) => (
                      <div>
                        {/* <div>
                          <span style={{ fontSize: '13px',color: '#222' }}>Mobile No</span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div> */}
                         <div>
                          <span className='firstname' style={{
                        color:
                          localStorage.getItem('selectedMode') === 'dark'
                            ? '#fff'
                            : localStorage.getItem('selectedMode') === 'light'
                            ? '#222'
                            : localStorage.getItem('systemMode') === 'dark'
                            ? '#fff'
                            : '#fff', fontSize: '14px'
                      }}>Mobile No</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                      </Typography>

                        </div>
                        <PhoneInput
                          inputProps={{ name: 'phone', autoComplete: 'tel' }}
                          inputStyle={{
                            background: '#fff',
                            height: '2.25rem',
                            width: '100%',
                            fontSize: '12px',
                            color: 'dddddd',
                            padding: '7.5px 13px 7.5px 2.7rem'
                          }}
                          value={field.value || ''} // Set value to an empty string if it's null
                          onChange={(value: any) => {
                            field.onChange(value)
                          }}


                          country={'au'}
                        />


                        {accountErrors.mobileNumber && (
                          <Typography variant='caption' color='error' sx={{ color: 'red' , fontSize: '12px'  }}>
                            {accountErrors.mobileNumber.message}
                          </Typography>
                        )}
                      </div>
                    )}
                  />
                </div>
              </Grid>

            <Grid item xs={3} sx={{ marginTop: '5px'}}>
            {
                        <div>
                          <span className='firstname' style={{
                        color:
                          localStorage.getItem('selectedMode') === 'dark'
                            ? '#fff'
                            : localStorage.getItem('selectedMode') === 'light'
                            ? '#222'
                            : localStorage.getItem('systemMode') === 'dark'
                            ? '#fff'
                            : '#fff', fontSize: '14px'
                      }}>Customer Group</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                      </Typography>

                        </div>
                      }
              <Controller
                name='CustomerGroup'
                control={accountControl}
                rules={{ required: 'riskfactors is required' }}
                render={({ field }) => (

                  <CustomTextField
                    fullWidth
                    error={Boolean(accountErrors.CustomerGroup)}
                    placeholder='Customer Group'
                    select
                    {...field}
                    onChange={e => {
                      field.onChange(e)
                      handleEmployeeGroup(e)
                    }}
                  >
                      {showAddNewOption && (
                      <MenuItem
                        value='Add New'
                        onClick={() => setShowAddNewOption(false)}
                        sx={{
                          backgroundColor: '#ff8a30',
                          marginInline: '0px',
                          borderRadius: '1px',
                          '&:hover': {
                            background: '#ff8a30 !important',
                            color: 'white !important'
                          }
                        }}
                      >
                        <Icon icon='ic:twotone-add' width={20} height={20} />
                        Add New
                      </MenuItem>
                    )}
                    {getEmployeeGroup.map((designationItem: any) => (
                      <MenuItem key={designationItem.id} value={designationItem.id}>
                        {designationItem.id ? designationItem.groupname : 'No Designation'}
                      </MenuItem>
                    ))}

                  </CustomTextField>
                )}
              />
              {accountErrors.CustomerGroup && (
                <Typography variant='caption' color='error' sx={{ color : 'red',fontSize: '12px'}}>
                  {String(accountErrors.CustomerGroup.message)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>






        <Modal
          open={openPopupcustomerGroup}
          onClose={handleEmployeeGroupClose}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, p: 5, width: 400 }}>
          <div style={{ float: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ color: '#717171', margin: '0px !important' }}>[esc]</Typography>
                <img
                  onClick={handleEmployeeGroupClose}
                  src='/images/icons/project-icons/cross.svg'
                  alt='Close'
                  width={20}
                  height={30}
                />
              </div>
            </div>
            <form onSubmit={handleSubmitEmployee(onSubmitEmployee)}>
              <Typography variant='h6'>Add New Group Name</Typography>
              <div>
                <Controller
                  name='groupName'
                  control={employeeControl}
                  rules={{ required: 'groupName is required' }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id='groupName'
                      label='Group Name'
                      variant='outlined'
                      fullWidth
                      margin='normal'
                      error={!!employeeErrors?.groupName}
                    />
                  )}
                />
                {employeeErrors.groupName && (
                  <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                    {String(employeeErrors.groupName.message)}
                  </Typography>
                )}
              </div>

              <div>
                <Button
                  type='submit'
                  sx={{
                    float: 'right',
                    marginRight: '2px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '90px',
                    padding: '5px !important',
                    height: '35px',
                    fontSize: '15px',
                    whiteSpace: 'nowrap',

                    '&:hover': {
                      background: '#ff8a30',
                      color: 'white'
                    }
                  }}
                  variant='contained'
                >
                  <Icon
                    style={{ marginRight: '5px' }}
                    icon='material-symbols-light:save-outline'
                    width={25}
                    height={25}
                  />
                  Save
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </>
    )
  }
)

export default CustomerNew
