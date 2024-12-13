import React, { useState, useCallback, useEffect, forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Grid, Switch, Typography, MenuItem, Box, InputAdornment } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import MerchantGroup from '../../merchant/merchant-Subscription/merchantpopup'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'
import { styled } from '@mui/material/styles'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomerGroupName from './groupnamecustomer'
import { set } from 'nprogress'


interface customerProps {
  // handleNext: () => void
  // ref: any
  editId: any
 // setEditId: any
  onClose: any
  customer: any
  // createId: any
  // setCreateId: any
  onFetchData:any
}

interface FormData {
  OwnerName: any
  Amount: any
  CustomerName: string
  Points: string
  TransType: string
  status: any
  mobileNumber: string
  emailId: string
  createddate: string
  refer: string
}

interface Level {
  CustomerName: string;
  Amount: any; // or the appropriate type
}

export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
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

const PointTransactionForm: React.FC<customerProps> = forwardRef<CustomerNewMethods, customerProps>(
 ({ editId,  onClose,  onFetchData }: any) => {
  const [countryName, setMerchantName] = useState('')
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      OwnerName: '',
      Amount: '',
      Points: '',
      TransType: '0', // Default value for TransType
      status: true,
      CustomerName: '',
      mobileNumber: '',
      emailId: '',
      createddate: '',
      refer: ''
    }
  })



  useEffect(() => {
    if (editId.Id) {
      setValue('OwnerName', editId.OwnerName)
      setValue('Amount', editId.Amount)
      setValue('Points', editId.Points)
      setValue('TransType', editId.TransType)
      setValue('status', editId.Status)
    }
  }, [editId, setValue])


  const [allMerchant, setAllMerchant] = useState([])
  const [customer, setCustomer] = useState([])
  const [leveldata, setLevelData] = useState<Level[]>([]);
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName1, setSelectedgroupName1] = useState({ OwnerName: '', id: '' })
  const [openPopupcustomerGroup1, setOpenPopupEmployeeGroup1] = useState(false)
  const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
  const [groupNameSearch1, setgroupNameSearch1] = useState('')
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')


    useEffect(() => {
    fetchMerchantName()
    fetchCustomerData()
    fetchLevelStructure()
  }, [])
  const fetchCustomerData = async () => {
    try {
      const res = await ApiClient.post(`/getcustomer`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setCustomer(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }


  const fetchMerchantName = async () => {
    try {
      const res = await ApiClient.post(`/getmerchant`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setAllMerchant(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }

  const fetchLevelStructure = async () => {
    try {
      const res = await ApiClient.post(`/getlevel`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setLevelData(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }


  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  const [merchantError, setMerchantError] = useState('');
  const [customerError, setCustomerError] = useState('');


  const onSubmit = async (data: FormData) => {
    const customerID = selectedgroupName?.id ? selectedgroupName.id : fetchedgroupName;
    const merchantID = selectedgroupName1?.id ? selectedgroupName1.id : fetchedgroupName1;
      if (!customerID) {
        setCustomerError('Please select a Customer');

          toast.error('Customer field cannot be empty');
          return; // Prevent further execution
      }
      if (!merchantID) {
        setMerchantError('Please select a Merchant');

          toast.error('Merchant field cannot be empty');
          return; // Prevent further execution
      }
    try {
      const requestData = {
        PAmount: data.Amount,
        MerchantID: merchantID,
        CustomerID: customerID,
        Points: data.Points,
        TransType: data.TransType
      }
      
      const body = requestData

      const endpoint = `/createpointstransaction`

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const response = await ApiClient.post(endpoint, body, { headers })
      if (response.status === 200) {
        onClose()
        toast.success('Saved Successfully')
        onFetchData()
      }
    } catch (err) {
      console.error(err)
    }
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
  const handleEmployeeGroupClose1 = () => {
    setOpenPopupEmployeeGroup1(false)
  }
  const clearSelectedgroupname1 = () => {
    setSelectedgroupName1({ OwnerName: '', id: '' })
    setFetchedgroupName1('')
  }
  const handlegroupnameclick1 = () => {
    clearSelectedgroupname1()
  }
  const handleOpengroupName1 = () => {
    setOpenPopupEmployeeGroup1(true)
  }
  const fetchEmployeeGroup1 = async () => {
    try

    {
    let filterString = ''
    if (groupNameSearch1) {
      filterString += `GroupName: {contains: "${groupNameSearch1}"}`
    }
  const res = await ApiClient.post(`/getmerchant?OwnerName=${groupNameSearch1}`);
  const response = res.data.data;
  const filteredResponse = response.filter((row: any) => row.Status == 1);
          setGetEmployeeGroup1(filteredResponse)
  }
    catch (err) {
        console.error(err)
      }
  }
  const handleOpengroupName = () => {
    setOpenPopupEmployeeGroup(true)
  }

  const fetchEmployeeGroup = async () => {
    try

    {
    let filterString = ''
    if (groupNameSearch) {
      filterString += `GroupName: {contains: "${groupNameSearch}"}`
    }
  const res = await ApiClient.post(`/getcustomer?CustomerName=${groupNameSearch}`);
  const response = res.data.data;
  const filteredResponse = response.filter((row: any) => row.Status == 1);
          setGetEmployeeGroup(filteredResponse)
  }
    catch (err) {
        console.error(err)
      }
  }

  useEffect(() => {
    // if(groupNameSearch)
    // {
    fetchEmployeeGroup()
    fetchEmployeeGroup1()
   // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNameSearch])

  const handleEmployeeGroupClose = () => {
    setOpenPopupEmployeeGroup(false)
  }
  const clearSelectedgroupname = () => {
    setSelectedgroupName({ CustomerName: '', id: '' })
    setFetchedgroupName('')
  }
  const handlegroupnameclick = () => {
    clearSelectedgroupname()
  }

  const getFormDetails = useCallback(
    async (id: any) => {
      try {

          const res = await ApiClient.post(`/getcustomer`)
    const response = res.data.data

    const selectedRow = response.find((row: any) => row.Id == id)
    if (selectedRow) {
      setValue('CustomerName', selectedRow.CustomerName)
      setValue('mobileNumber', selectedRow.PhoneNo)
      setValue('emailId', selectedRow.EmailId)
      const date = new Date(selectedRow.CreatedDateTime)
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      setValue('createddate', formattedDate)
      setValue('refer', selectedRow.Referrer)
      setFetchedgroupName(selectedRow.Referrer)
    }

        }
       catch (err) {
        console.error(err) // Log the error
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer, setValue]
  )

  useEffect(() => {
    if (editId) {
      getFormDetails(editId)
    }

  }, [editId, getFormDetails])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center',
        }}
      >
        Add Point Transaction
      </Typography>

    

<Grid item xs={12} sm={12} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ? '' : '' }}>
              <span
                style={{
                  color: getColor(),
                  fontSize: '14px'
                }}
              >
                Merchant Name
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
                {selectedgroupName1.OwnerName !== '' || fetchedgroupName != '' ? (
                  <Typography sx={{ width: '100%' }} onClick={handleOpengroupName1}>
                    {selectedgroupName1.OwnerName !== '' ? (
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
                        <Typography sx={{ color: '#222' }}>{selectedgroupName1.OwnerName}</Typography>
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
                            getEmployeeGroup1
                              ?.sort((a: any, b: any) => a.OwnerName.localeCompare(b.OwnerName))
                              .map((item: any) => {
                                 if (Number(item.id) === Number(fetchedgroupName )) {
                                  return item.OwnerName
                                 }
                                return null
                              })
                              .filter((OwnerName: any) => OwnerName !== null)[0]
                          }
                        </Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    )}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: '#776cff', fontWeight: 600, width: '500px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', marginTop: '10px', borderRadius: '5px' }}
                    onClick={handleOpengroupName1}
                  >
                    Select a Merchant
                  </Typography>
                )}
                {(selectedgroupName1.id || fetchedgroupName1) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer' }}
                    onClick={handlegroupnameclick1}
                  />
                )}
              </Box>
              {merchantError && (
      <Typography variant='caption' color='error'>
        Please select a Merchant.
      </Typography>
    )}
            </Grid>

      <div>

      <Grid item xs={12} sm={12} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ? '' : '' }}>
              <span
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

                <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',

                }}
              >
                {selectedgroupName.CustomerName !== '' || fetchedgroupName != '' ? (
                  <Typography sx={{ width: '100%' }} onClick={handleOpengroupName}>
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
                                 if (Number(item.Id) === Number(fetchedgroupName )) {
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
                    sx={{ color: '#776cff', fontWeight: 600, width: '500px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', marginTop: '10px', borderRadius: '5px' }}
                    onClick={handleOpengroupName}
                  >
                    Select a Customer
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
              {customerError && (
      <Typography variant='caption' color='error'>
        Please select a Customer.
      </Typography>
    )}
            </Grid>
        <Controller
          name='TransType'
          control={control}
          rules={{
            required: 'TransType is required'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='TransType'
              select
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    TransType
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.TransType}
              helperText={errors.TransType && errors.TransType.message}
            >
              <MenuItem value='0'>Points</MenuItem>
              <MenuItem value='1'>Coupon</MenuItem>
            </CustomTextField>
          )}
        />
      </div>
      
      <div>
        <Controller
          name='Amount'
          control={control}
          rules={{
            required: 'Amount is required'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='Amount'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Amount (₹)
                  </span>
                </div>
              }
              type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              value={field.value ? field.value.replace(/^₹ /, '').trim() : ''}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
              error={!!errors.Amount}
              // helperText={errors.Amount && errors.Amount.message}

            />
          )}
        />
      </div>
      <div>
        <Controller
          name='Points'
          control={control}
          rules={{
            required: 'Points is required', // Rule for required input
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/, // Pattern to allow positive numbers (including floats)
              message: 'Only positive numbers are allowed', // Error message
            },
            validate: {
              // Custom validation for positive values
              isPositive: (value:any) => {
                if (parseFloat(value) < 0) return 'Only positive values are allowed';
                return true;
              },
            },
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='Points'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Points
                  </span>
                </div>
              }
              //  type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              placeholder="0.00"
              error={!!errors.Points}
              InputProps={{                
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              onChange={(e) => {
                // Get the input value
                const value = e.target.value;
                // Allow only positive numeric values (including float)
                const numericValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-decimal characters
                field.onChange(numericValue); // Update value in the controller
              }}
              helperText={errors.Points && errors.Points.message}
              
              onBlur={(e) => {
                // Format value on blur
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />
      </div>
      <div>
        <Button
          type='submit'
          sx={{
            mb: 2,
            mr: 2,
            float: 'right',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90px',
            padding: '5px !important',
            height: '35px',
            fontSize: '15px',
            whiteSpace: 'nowrap',

            '&:hover': {
              background: '#776cff',
              color: 'white'
            }
          }}
          disabled={!isDirty || !isValid}
          variant='contained'
        >
          <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
          {editId.Id ? "Update" : "Save"}
        </Button>
      </div>
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
          <CustomCloseButton id='rightDrawerClose' color='inherit'  onClick={handleEmployeeGroupClose}>
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
        <CustomModal
          open={openPopupcustomerGroup1}
          onClose={() => {
            handleEmployeeGroupClose1()
            setgroupNameSearch1('')
          }}
          onOpen={handleOpengroupName1}
          buttonText=''
          buttonOpenText=''
          height={500}
        >
          <CustomCloseButton id='rightDrawerClose'  color='inherit' onClick={handleEmployeeGroupClose1}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <MerchantGroup
            getEmployeeGroup={getEmployeeGroup1}
            setSelectedgroupName={setSelectedgroupName1}
            handleEmployeeGroupClose={handleEmployeeGroupClose1}
            fetchEmployeeGroup={fetchEmployeeGroup1}
            setgroupNameSearch={setgroupNameSearch1}
            onFetchData={onFetchData}
            groupNameSearch={groupNameSearch1}
          />
        </CustomModal>
    </form>
  )
}
)
export default PointTransactionForm;
