import React, { ElementType,useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Modal, Box, Select, FormControl, FormLabel, FormHelperText, TextField, InputLabel, Menu, CardContent, ButtonProps, Avatar } from '@mui/material'
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
import AppSink from 'src/commonExports/AppSink'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import CustomerGroupName from '../point-Transaction/groupnamecustomer'
import axios from 'axios'
import CustomerAddress from './CustomerAddress'
import md5 from 'md5'

//import { error } from 'console'

interface FormValues {
  customerName: string
  emailId: string
  mobileNumber: string
  refer: any
  createddate: string
  Password: any 
      ProfileImage: any

}
const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))
const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
}

interface Customer {
  Id: string
  CustomerName: string
}

interface customerProps {
  handleNext: () => void
  ref: any
  editid: any
  setEditId: any
  customer: any
  createId: any
  setCreateId: any
  onFetchData:any
}

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)'
  } else {
    return 'white'
  }
}

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const modalDesign = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#cacaca'
  } else if (selectedMode === 'light') {
    return '#f2f2f7'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#cacaca'
  } else {
    return '#f2f2f7'
  }
}

const CustomerNew: React.FC<customerProps> = forwardRef<CustomerNewMethods, customerProps>(
  ({ handleNext, editid, setEditId,onFetchData, customer, setCreateId, createId }, ref) => {
    const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
    const [emp_group, setEmployeegroup] = useState('')
    const [customerlist, setcustomerlist] = useState<any>([])
    const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
    const [showAddNewOption, setShowAddNewOption] = useState(true)
    const [fetchedgroupName, setFetchedgroupName] = useState('')
    const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
    const [groupNameSearch, setgroupNameSearch] = useState('')
    const [emailName, setEmailName] = useState('')
    const [referId, setReferId] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | any>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
   // console.log('IDDD', referId)
   const [showPassword, setShowPassword] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filteredOptions, setFilteredOptions] = useState<Customer[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    useEffect(() => {
      setFilteredOptions(customers)
    }, [customers])

    const {
      handleSubmit: handleSubmitEmployee,
      control: employeeControl,
      reset,
      formState: { errors: employeeErrors }

    } = useForm<any>({
      defaultValues: {
        CustomerName: ''
      }
    })

    const defaultAccountValues: FormValues = {
      customerName: '',
      mobileNumber: '',
      emailId: '',
      createddate: '',
      refer: '',
      Password: '', // New field for Password
      ProfileImage: null,
    }

    const fetchEmployeeGroup = async () => {
      try

      {
      let filterString = ''
      if (groupNameSearch) {
        filterString += `GroupName: {contains: "${groupNameSearch}"}`
      }
    const res = await ApiClient.post(`/getcustomer?CustomerName=${groupNameSearch}`);

          setGetEmployeeGroup(res.data.data)
    }
      catch (err) {
          console.error(err)
        }
    }

    useEffect(() => {
      // if(groupNameSearch)
      // {
      fetchEmployeeGroup()
     // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupNameSearch])


    const clearSelectedgroupname = () => {
      setSelectedgroupName({ CustomerName: '', id: '' })
      setFetchedgroupName('')
    }
    const handlegroupnameclick = () => {

      clearSelectedgroupname()
    }

    const handleOpengroupName = () => {

      setOpenPopupEmployeeGroup(true)
    }

    useEffect(() => {
      fetchCustomerData()
    }, [])


    const fetchCustomerData = async () => {
      try {
        const res = await ApiClient.post(`/getcustomer`)
        const response = res.data.data


        const dataWithSerialNumber = response.map((row: any, index: number) => ({
          ...row,
          'S.No': index + 1
        }))

        setcustomerlist(dataWithSerialNumber)
      } catch (err) {
        toast.error('Error fetching data:')
      }
    }


    //console.log('customerlist', customerlist)
    const accountSchema = yup.object().shape({
      customerName: yup.string().required('Firstname  is required'),
      mobileNumber: yup
  .string()
  .required('Mobile number is required'),

      emailId: yup.string()
      .required('Email ID is required')
      .email('Invalid email format'),
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setEmailName(inputValue)
      if (/^[a-zA-Z].*$/.test(inputValue) || inputValue === '') {
        const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
        // Filter options based on modifiedValue
        const filtered = customers.filter(option =>
          option.CustomerName.toLowerCase().startsWith(modifiedValue.toLowerCase())
        )
        setFilteredOptions(filtered)
      }
    }

    const handleMenuItemClick = (customerName: string, id: string) => {
      setValue('refer', customerName)
      setEmailName(customerName)
      setReferId(id)
      setAnchorEl(null) // Close the menu
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
      setAnchorEl(null)
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmit)()
        //handleNext()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
      },
      editid
    }))
    const getFormDetails = useCallback(
      async (id: any) => {
        // console.log("customer",customer)
        // console.log("id",id)
        try {
          if(customer !== undefined)
            {
          const selectedRow = customer.find((row: any) => row.Id == id)
            setValue('customerName', selectedRow.CustomerName)
            setValue('mobileNumber', `91${selectedRow.PhoneNo}`)
            setValue('emailId', selectedRow.EmailId)
            const date = new Date(selectedRow.CreatedDateTime)
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            setValue('createddate', formattedDate)
            setValue('refer', selectedRow.Referrer)
            setFetchedgroupName(selectedRow.Referrer)
            setSelectedFile(selectedRow?.ProfileImage)
            setPreviewImage(selectedRow?.ProfileImage)
            setValue('Password', selectedRow?.Password)
          }
          else{
            const res = await ApiClient.post(`/getcustomer`)
      const response = res.data.data

      const selectedRow = response.find((row: any) => row.Id == id)
      if (selectedRow) {
        setValue('customerName', selectedRow.CustomerName)
        setValue('mobileNumber', `91${selectedRow.PhoneNo}`)
        setValue('emailId', selectedRow.EmailId)
        const date = new Date(selectedRow.CreatedDateTime)
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        setValue('createddate', formattedDate)
        setValue('refer', selectedRow.Referrer)
        setFetchedgroupName(selectedRow.Referrer)
        setSelectedFile(selectedRow?.ProfileImage)
            setPreviewImage(selectedRow?.ProfileImage)
            setValue('Password', selectedRow?.Password)
      }

          }
        } catch (err) {
          console.error(err) // Log the error
        }
      },
      [customer, setValue]
    )

    useEffect(() => {
      if (editid) {
        getFormDetails(editid)
      }
      else{
        getFormDetails(createId)
      }
    }, [editid,createId, getFormDetails])

    const fetchData = async () => {
      try {
        const res = await ApiClient.post(`/getcustomername?Referername=${emailName}`)
        const response = res.data.data
        setCustomers(response)
        setFetchedgroupName(response[0].Referrer)
      } catch (err) {
        console.error('Error fetching data:', err)
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
    const handleEmployeeGroupOpen = () => {
      setOpenPopupEmployeeGroup(true)
    }
    const handleEmployeeGroupClose = () => {
      setOpenPopupEmployeeGroup(false)
    }

    const [refererError, setRefererError] = useState(false);
    const updateFormValues = useCallback(
      (values: any) => {
        Object.entries(values).forEach(([fieldName, fieldValue]: any) => {
          setValue(fieldName, fieldValue)
        })
      },
      [setValue]
    )
    const MAX_FILE_SIZE = 50 * 1024
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        const errorMessage = `File size exceeds the maximum limit (50KB).`
        const imageSizeMessage = `Selected image size: ${file.size / 1024} KB`
        toast.error(`${errorMessage} ${imageSizeMessage}`)
        return
      }
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const onSubmit = async (editedData: any) => {

    const { customerName, mobileNumber, emailId, Password } = editedData;
    const MobileNumber = mobileNumber.startsWith('91') ? mobileNumber.slice(2) : mobileNumber;
    const passwordhash = md5(Password);
    const referrerId = selectedgroupName?.id || fetchedgroupName;
  
    if (!referrerId) {
      setRefererError(true);
      toast.error('The referrer field is required');
      return;
    }
  
    const formData = new FormData();
    
    if (selectedFile) {
      formData.append('ProfileImage', selectedFile);
    }
  
    try {
      let res;
      //const commonQuery = `CustomerName=${customerName}&PhoneNo=${MobileNumber}&EmailId=${emailId}&Password=${passwordhash}&Referrer=${referrerId}`;
  
      if (editid) {
        res = await ApiClient.post(`/updatecustomer?Id=${editid}&CustomerName=${customerName}&PhoneNo=${MobileNumber}&EmailId=${emailId}&Password=${passwordhash}&Referrer=${referrerId}`, formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Set correct header for file upload
            },
          });
      } else {
        res = await ApiClient.post(`/createcustomer?CustomerName=${customerName}&PhoneNo=${MobileNumber}&EmailId=${emailId}&Password=${passwordhash}&Referrer=${referrerId}`, formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Set correct header for file upload
            },
          });
      }
  //console.log('res', res)
      if (res.data.message) {
        switch (res.data.message) {
          case 'Email ID Already Exists':
          case 'Phone Number Already Exists':
            toast.error(res.data.message);
            break;
            case 'You Are Already Referred to Another Customer' :
              toast.error('Referrer is Already Referred to Another Customer! Pls Change Referrer.');
              break;
          default:
            if (!editid) {
              setCreateId(res.data.id);
              setEditId(res.data.id);
            }
            handleNext();
            toast.success(`${editid ? 'Updated' : 'Created'} Successfully`);
        }
      }
    } catch (err) {
      console.log('Something went wrong', err);
      toast.error('An error occurred while processing your request.');
    }
  };

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
    const emailIdRef = useRef<HTMLInputElement>(null);
    const customerNameRef = useRef<HTMLInputElement>(null);
    const referRef = useRef<HTMLInputElement>(null);
    const mobileNumberRef = useRef<HTMLInputElement>(null);
    // console.log('selectedgroupName', selectedgroupName)

    // console.log("fetchedgroupName", fetchedgroupName)


    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container sx={{ mb: 6 }} spacing={4}>
            <Grid item xs={12} sm={6} sx={{ mb: 2 }} className='empTextField'>
              <Controller
                name='customerName'
                control={accountControl}
                rules={{
                  required: true
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      id='customerName'
                      fullWidth
                      value={value || ''}
                      label={
                        <div>
                          <span
                            className='customerName'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Customer Name
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Customer Name'
                      onChange={e => {
                        let inputValue = e.target.value
                        // Allow letters and spaces only
                        inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '')
                        // Capitalize the first letter of each word
                        inputValue = inputValue.replace(/\b\w/g, char => char.toUpperCase())
                        onChange(inputValue)
                      }}
                      error={Boolean(accountErrors.customerName)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          emailIdRef.current?.focus(); // Move to Shop Name input on Enter
                        }
                      }}
                      aria-describedby='stepper-linear-account-username'
                      inputRef={customerNameRef}
                    />
                    <FormHelperText>
                      <Typography sx={{ color: 'red', fontSize: '12px' }}>
                        {accountErrors.customerName ? 'Customer Name is required' : ''}
                      </Typography>
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Controller
                name='emailId'
                control={accountControl}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <>
                    <CustomTextField
                      id='emailId'
                      fullWidth
                      type='email'
                      value={value}
                      label={
                        <div>
                          <span className='firstname' style={{ color: getColor() }}>
                            Email
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      onChange={e => {
                        const inputValue = e.target.value
                        const filteredValue = inputValue.replace(/[^\w.@]/gi, '')
                        const modifiedValue = filteredValue.toLowerCase()
                        onChange(modifiedValue)
                      }}
                      placeholder='Enter your Email'
                      error={Boolean(error)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          referRef.current?.focus(); // Move to Shop Name input on Enter
                        }
                      }}
                      inputRef={emailIdRef} // Set ref
                      aria-describedby='stepper-linear-account-username'
                      helperText={error ? error.message : ' '}
                    />
                  </>
                )}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6} style={{ marginTop: '5px' }}>
              <Controller
                name='refer'
                control={accountControl}
                rules={{ required: 'Referrer is required' }}
                render={({ field: { onChange, value } }) => (
                  <CustomTextField
                    value={value} // Ensure value is used from the field
                    fullWidth
                    autoFocus
                    label={
                      <div>
                        <span className='refer' style={{ fontSize: '14px' }}>
                          Referrer
                        </span>
                      </div>
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(e)
                      onChange(e)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        mobileNumberRef.current?.focus(); // Move to Shop Name input on Enter
                      }
                    }}
                    inputRef={referRef} // Set ref
                    placeholder='Referrer'
                    onClick={handleMenuOpen}
                  />
                )}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && filteredOptions.length > 0}
                onClose={handleMenuClose}
              >
                {filteredOptions.map(option => (
                  <MenuItem key={option.Id} onClick={() => handleMenuItemClick(option.CustomerName, option.Id)}>
                    {option.CustomerName}
                  </MenuItem>
                ))}
              </Menu>
            </Grid> */}


            {/* <Grid item xs={12} sm={6} style={{ marginTop: '5px' }}>
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
                      }}>Ref</span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                      </Typography>

                        </div>
  }

<Controller
                name='refer'
                control={accountControl}
                rules={{ required: 'riskfactors is required' }}
                render={({ field }) => (

                  <CustomTextField
                    fullWidth
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
                    {customerlist.map((designationItem: any) => (
                      <MenuItem key={designationItem.Id} value={designationItem.Id}>
                        {designationItem.Id ? designationItem.CustomerName : 'No Designation'}
                      </MenuItem>
                    ))}

                  </CustomTextField>
                )}
              />
          </Grid> */}

<Grid item xs={12} sm={4} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ? '' : '' }}>
              <span
                style={{
                  color: getColor(),
                  fontSize: '14px'
                }}
              >
                Referrer
              </span>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography>

                <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',

                }}
              >
                {selectedgroupName.CustomerName !== '' || fetchedgroupName != '' ? (
                  <Typography sx={{ width: '90%' }} onClick={handleOpengroupName}>
                    {selectedgroupName.CustomerName !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        <Typography sx={{ color: '#222' }}>{selectedgroupName.CustomerName}</Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',


                       justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'

                        }}
                      >
                        <Typography sx={{ color: '#222' }}>
                          {
                            getEmployeeGroup
                              ?.sort((a: any, b: any) => a.CustomerName.localeCompare(b.CustomerName))
                              .map((item: any) => {
                                 if (Number(item.Id) === Number(fetchedgroupName)) {
                                  return item.CustomerName
                                 }
                                return null
                              })
                              .filter((CustomerName: any) => CustomerName !== null)[0]
                          }
                        </Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    )}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: '#776cff', fontWeight: 600, cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', borderRadius: '5px' }}
                    onClick={handleOpengroupName}
                  >
                    Select a Referrer
                  </Typography>
                )}
{(selectedgroupName.id || fetchedgroupName) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer' }}
                    onClick={handlegroupnameclick}
                  />
                )}
              </Box>
              {errorMessage && (
                <Typography variant='caption' color='error' sx={{ marginTop: '5px' }}>
                    {errorMessage}
                </Typography>
            )}
             {refererError && (
      <Typography variant='caption' color='error'>
        Please select a Referrer.
      </Typography>
    )}
            </Grid>






            <Grid item xs={12} sm={4}>
              <div style={{ marginTop: '3px' }} className='empTextField'>
                <Controller
                  name='mobileNumber'
                  control={accountControl}
                  rules={{ required: 'Mobile Number is required' }}
                  render={({ field }) => (
                    <div>
                      <div>
                        <span
                          className='firstname'
                          style={{
                            color: getColor(),
                            fontSize: '14px'
                          }}
                        >
                          Mobile No
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                      <PhoneInput
                        inputStyle={{
                          background: 'none',
                          height: '2.25rem',
                          width: '100%',
                          fontSize: '12px',
                          color: getColor(),
                          padding: '7.5px 13px 7.5px 2.7rem'
                        }}
                        value={field.value || ''}
                        onChange={(value: any) => {
                          field.onChange(value)
                        }}
                        country={'in'}
                      />
                      {accountErrors.mobileNumber && (
                        <Typography variant='caption' color='error' sx={{ color: 'red', fontSize: '0.8125rem' }}>
                          {accountErrors.mobileNumber.message}
                        </Typography>
                      )}
                    </div>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
  <Controller
    name='Password'
    control={accountControl}
    rules={{ 
      required: 'Password is required', 
      minLength: { value: 8, message: 'Password must be at least 8 characters' }
    }}
    render={({ field: { value, onChange }, fieldState: { error } }) => {
      //const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

      return (
        <div style={{ position: 'relative' }}>
          <CustomTextField
            type={showPassword ? 'text' : 'password'} // Toggle between text and password
            id='Password'
            fullWidth
            value={value}
            label={<div>Password <Typography variant='caption' color='error'>*</Typography></div>}
            onChange={onChange}
            placeholder='Enter your Password'
            error={Boolean(error)}
            helperText={error ? error.message : ' '}
          />
          {!editid && value && ( // Show the icon only if there is a value in the password field
            <IconButton 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: 10, top: 20 }}>
              <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} />
            </IconButton>
          )}
        </div>
      );
    }}
  />
</Grid>

            {editid ? (
              <Grid item xs={12} sm={6}>
                <div className='empTextField'>
                  <InputLabel
                  id='createddate'
                    shrink={true}
                    style={{ fontSize: '16px', fontWeight: '400', color: '#a5aac8', marginTop: '10px' }}
                  >
                    Created Date
                  </InputLabel>
                  <Controller

                    name='createddate'
                    control={accountControl}
                    rules={{ required: true }}
                    render={({ field: { value } }) => <span style={{ marginTop: '32px' }}>{value}</span>}
                  />
                </div>
              </Grid>
            ) : null}

          </Grid>
          <Grid item xs={8}></Grid>
          <CardContent sx={{  display:'flex', }}>
            <div style={{ marginTop:'70px'}}>
                  <ButtonStyled
                    sx={{
                       marginLeft:'40px',
                      '&:hover': {
                        background: '#776cff',
                        color: 'white'


                      }
                    }}
                    component='label'
                    variant='contained'
                    htmlFor='account-settings-upload-image'
                  >
                    <Icon fontSize='1.5rem' icon='material-symbols-light:upload'>
                      {' '}
                    </Icon>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={e => handleFileChange(e)}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>

                  <Typography sx={{ mt: 4, color: 'text.disabled', marginRight:'20px' }}>Allowed PNG or JPEG. Max size of 50Kb.</Typography>
                </div>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!previewImage ? (
                  <>
                    <div
                      style={{
                        border: '1px solid #cacaca',
                        padding: '15px',
                        margin: '10px 10px 10px 0px',
                        borderRadius: '10px',
                        width:'200px'
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56, fontSize: 28, backgroundColor: '#5441ad' }}>
                        {/* {adminFirstname.charAt(0).toUpperCase()} */}
                      </Avatar>
                    </div>
                  </>
                ) : (
                  <ImgStyled src={previewImage} alt='Profile Pic' />
                )}

              </Box>
            </CardContent>
        </form>

        <CustomModal
          open={openPopupcustomerGroup}
          onClose={() => {
            handleEmployeeGroupClose()
            setgroupNameSearch('')
          }}
          onOpen={handleOpengroupName}
          buttonText=''
          buttonOpenText=''
          height={500}
        >
          <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleEmployeeGroupClose}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <CustomerGroupName
            getEmployeeGroup={getEmployeeGroup}
            setSelectedgroupName={setSelectedgroupName}
            handleEmployeeGroupClose={handleEmployeeGroupClose}
            fetchEmployeeGroup={fetchEmployeeGroup}
            setgroupNameSearch={setgroupNameSearch}
            onFetchData={onFetchData}
            groupNameSearch={groupNameSearch}
          />
        </CustomModal>

      </>
    )
  }
)

export default CustomerNew
