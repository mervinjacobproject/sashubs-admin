import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Switch, Typography, MenuItem, InputAdornment, Grid, Box, InputLabel } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState, useCallback, useEffect, forwardRef } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomerGroupName from '../point-Transaction/groupnamecustomer'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MerchantGroup from '../../merchant/merchant-Subscription/merchantpopup'

interface FormData {
  OwnerName: string
  CustomerName: string
  Amount: string
  Points: string
  mobileNumber: string
  emailId: string
  createddate: string
  TransDate: any
    CustomerID: any
  TransType: string
  status: number // Use number type to match your API's expected format
}
interface customerProps {
  // handleNext: () => void
  // ref: any
  editid: any
  TransDate: any
  OwnerName: any
  TransType: any
  // ProductName: any
  // EarnedPoints: any
  Points: any
  Amount: any
  editStatus: any
  onCloseModal: any
  //allMerchant: any
  CustomerName: any
  //customer: any
  // createId: any
  // setCreateId: any
  onFetchData:any
}
export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
}
const subdateformat =(value:any ) =>{
  const date = new Date(value)
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            return formattedDate
}

const PointTransactionEditForm: React.FC<customerProps> =
forwardRef<CustomerNewMethods, customerProps>(
  ({
  employeegroupName,
  editStatus,
  onFetchData,
  editid,
  onCloseModal,
  TransDate,
  OwnerName,
  Amount,
  CustomerName,

  Points,
  TransType,
  }: any) => {
//  console.log("TransType", TransType)
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      OwnerName: OwnerName,
      Amount: Amount,
      CustomerName:CustomerName,
      TransDate: subdateformat(TransDate),
      Points: Points,
      TransType: TransType, // Default value for TransType
      status: editStatus
    }
  })
  const [countryName, setMerchantName] = useState('')
  const [allMerchant, setAllMerchant] = useState([])
  const [customer, setCustomer] = useState([])
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [isContentChanged, setIsContentChanged] = useState<boolean>(false) // State variable to track content changes

  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [selectedgroupName1, setSelectedgroupName1] = useState({ OwnerName: '', id: '' })
  const [openPopupcustomerGroup1, setOpenPopupEmployeeGroup1] = useState(false)
  const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
  const [groupNameSearch1, setgroupNameSearch1] = useState('')
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')
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
  const handleOpengroupName = () => {
    setOpenPopupEmployeeGroup(true)
  }




  useEffect(() => {
    onFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const newCustomerId = selectedgroupName.id || fetchedgroupName;
if(selectedgroupName.id ){
  setIsContentChanged(true);
} else {
  setIsContentChanged(false);
}

  }, [selectedgroupName, fetchedgroupName]);
  useEffect(() => {
    const newCustomerId = selectedgroupName.id || fetchedgroupName;
if(selectedgroupName1.id ){
  setIsContentChanged(true);
} else {
  setIsContentChanged(false);
}

  }, [selectedgroupName1, fetchedgroupName]);


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
    fetchEmployeeGroup1()
    fetchEmployeeGroup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNameSearch])





  useEffect(() => {
    fetchMerchantName()
    fetchCustomerData()
  }, [])
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
  //console.log("resssss",res.data.data)
  const response = res.data.data;
  const filteredResponse = response.filter((row: any) => row.Status == 1);
          setGetEmployeeGroup1(filteredResponse)
  }
    catch (err) {
        console.error(err)
      }
  }
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

  const onSubmit = async (editedData: FormData) => {
    if (!isContentChanged && !isDirty) {
      toast.error('No changes detected. Please modify the content before saving.');
      return;
    }
    const customerData = selectedgroupName.id ? selectedgroupName.id : fetchedgroupName;
    const merchantData = selectedgroupName1.id ? selectedgroupName1.id : fetchedgroupName1;
    try {
      const requestData = {
        Id: editid,
        MerchantID: merchantData,
        CustomerID: customerData,
        PAmount: editedData.Amount,
        Points: editedData.Points,
        TransType: editedData.TransType
      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/updatepointstrans`

      const response = await ApiClient.post(apiEndpoint, requestData, { headers })

      if (response.status === 200) {
        onCloseModal()
        toast.success('Updated successfully')
        onFetchData()
      }
    } catch (error) {
      // console.error(error)
    }
  }

  useEffect(() => {
    setFetchedgroupName1(OwnerName)
    setFetchedgroupName(CustomerName)
    //console.log("CustomerName",CustomerName)
    setValue('status', editStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editStatus])

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
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center',
        }}
      >
        Edit Point Transaction
      </Typography>

      <Grid item xs={12} sm={5.5} sx={{ marginTop: !selectedgroupName1.id || !fetchedgroupName1 ? '' : '' }}>
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
                {selectedgroupName1.OwnerName !== '' || fetchedgroupName1 != '' ? (
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
                                // console.log("item", item)
                                // console.log("fetchedgroupName12",fetchedgroupName)
                                 if (Number(item.id) == Number(fetchedgroupName1 )) {

                                  // console.log("fetchedgroupName",fetchedgroupName)
                                  // console.log("item.Id", item.Id)
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
                    onClick={handleOpengroupName}
                  >
                    Select a Merchant Name
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
            </Grid>
      <Grid item xs={12} sm={5.5} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ? '' : '' }}>
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
                                // console.log("item", item)
                                // console.log("fetchedgroupName12",fetchedgroupName)
                                 if (Number(item.Id) == Number(fetchedgroupName )) {

                                  // console.log("fetchedgroupName",fetchedgroupName)
                                  // console.log("item.Id", item.Id)
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
            </Grid>
            <div>
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
          rules={{ required: 'Group Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='Amount'
              label={
                <div>
                  <span
                    className='status'
                    style={{
                      color: getColor()
                    }}
                  >
                    Amount (₹)
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
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
              autoFocus
              margin='normal'
              error={!!errors.Amount}
              helperText={errors.Amount && errors.Amount.message}
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
                    className='status'
                    style={{
                      color: getColor()
                    }}
                  >
                    Points
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              placeholder="0.00"
              InputProps={{
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              inputProps={{
                style: { color: getColor() }
              }}
              onChange={(e) => {
                // Get the input value
                const value = e.target.value;
                // Allow only positive numeric values (including float)
                const numericValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-decimal characters
                field.onChange(numericValue); // Update value in the controller
              }}
              margin='normal'
              error={!!errors.Points}
              helperText={errors.Points && errors.Points.message}
            />
          )}
        />
      </div>

      {/* <div>
        <Controller
          name='TransType'
          control={control}
          rules={{ required: 'TransType is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='TransType'
              select
              label={
                <div>
                  <span
                    className='status'
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
      </div> */}

<Grid item xs={4}>
                <div className='empTextField'>
                  <InputLabel shrink style={{ fontSize: '16px', fontWeight: '400', color: '#a5aac8', marginTop: '10px' }}>
                    Transaction Date
                  </InputLabel>
                  <Controller
                    name='TransDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value } }) => <span style={{ marginTop: '32px' }}>{value}</span>}
                  />
                </div>
              </Grid>
      <div>
        <Button
  disabled={!isDirty && !isContentChanged}
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
              background: '#776cff',
              color: 'white'
            }
          }}
          variant='contained'
        >
          <Icon
            style={{ marginRight: '5px' }}
            icon='material-symbols-light:save-outline'
            fontSize='1.5rem'
            width={25}
            height={25}
          />
          Update
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
          <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleEmployeeGroupClose1}>
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
export default PointTransactionEditForm
