import React, { useState,useCallback, useEffect, forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Box, Button, Grid, InputAdornment, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'
import Customer from '../customer'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomerGroupName from '../point-Transaction/groupnamecustomer'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { CoPresentOutlined } from '@mui/icons-material'




interface FormData {
  OwnerName: any
  Amount: string
  status: any
  CustomerName: any
  CustomerID: any
  EarnedPoints: any
  TransDate: any
  TransactionType: any
  ProductId: any
  ProductName: any
  ReferenceDet: any
  mobileNumber: string  
  emailId: string
  createddate: string 
}

interface customerProps {
  
  editId: any
  onClose: any
  onfetchData: any;

}
export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
}
const TransactionForm: React.FC<customerProps> = forwardRef<CustomerNewMethods, customerProps>(
  ({ editId, onfetchData, onClose}: any) => {
  const [countryName, setMerchantName] = useState('')
  const [allMerchant, setAllMerchant] = useState([])
  const [customer, setCustomer] = useState([])
  const [Product, setProduct] = useState([])
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })

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
      status: true,
      ProductName: '',
      CustomerName: '',
      EarnedPoints: '',
      TransDate: '',
    }
  })

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
    if (editId.Id) {
      setValue('OwnerName', editId.OwnerName)
      setValue('Amount', editId.Amount)
      setValue('CustomerName', editId.CustomerID)
      setValue('ProductName', editId.ProductName)
      setValue('EarnedPoints', editId.EarnedPoints)
      setValue('TransDate', editId.TransDate)
      setFetchedgroupName(editId.CustomerID)

      
      
      // setValue('sortname', editId.SortName)
      setValue('status', editId.Status)
    }
  }, [editId, setValue])
  
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
   // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNameSearch])

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };
  

  useEffect(() => {
    fetchCustomerData()
    fetchProductData()
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

  const fetchProductData = async () => {
    try {
      const res = await ApiClient.post(`/getproduct`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setProduct(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }

  const [customerNameError, setCustomerNameError] = useState('');
  

  const onSubmit = async (data: FormData) => {
    const customerData = selectedgroupName?.id ? selectedgroupName?.id : fetchedgroupName;
    const referrerId = selectedgroupName?.id ? selectedgroupName?.id : fetchedgroupName;
      if (!referrerId) {
        setCustomerNameError('Please select a Customer Name');

          toast.error('Customer Name field cannot be empty');
          return; // Prevent further execution
      }

    try {

    const requestData = {
      Amount: data.Amount,
      MerchantID:data.OwnerName,
      CustomerID: customerData,
      ProductID: data.ProductName,
      EarnedPoints: data.EarnedPoints,
      TransDate: data.TransDate,

    }
    const requestEditedData = {
      Id: editId.Id,
      Amount: data.Amount,
      OwnerName:data.OwnerName,
      Status: data.status,
      ProductName: data.ProductName,
      CustomerName: data.CustomerName,
      EarnedPoints: data.EarnedPoints,
      TransDate: data.TransDate,
    }
    const body = editId.Id
      ? requestEditedData
      : requestData

    const endpoint = editId.Id
      ? `/updatetransaction`
      : `/createtransaction`

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    //const requestQuery = endpoint

    const response = await ApiClient.post(endpoint, body, { headers })
    if (response.status === 200) {
      onClose()
      onfetchData()
        editId.Id ? toast.success('Updated Successfully') : toast.success('Saved Successfully')
        
       
      }
    }
      catch(err) {
       console.error( err)
      }
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
      setFetchedgroupName(selectedRow.CustomerName)
    }

        }
       catch (err) {
        console.error(err) // Log the error
      }
    },
    [customer, setValue]
  )
  useEffect(() => {
    if (editId) {
      getFormDetails(editId)
    }

  }, [editId, getFormDetails])


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
  
  const fetchProductDetails = async (productId: any) => {
  
    try {
      // Fetching the product details based on productId
      const res = await ApiClient.post('/getproduct');
      
      // Assuming that the API response returns an array of products
      const productList = res.data.data;
  
      // Find the product that matches the provided productId
      const matchedProduct = productList.find((product: any) => product.Id === productId);
  
      // If the product is found, set the Points and Price fields
      if (matchedProduct) {
        setValue('EarnedPoints', matchedProduct.Points);
        setValue('Amount', matchedProduct.Price);
  
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  };
  


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'sans-serif',
          padding: '10px'
        }}
      >
        Add Transaction
      </Typography>

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
              {customerNameError && (
      <Typography variant='caption' color='error'>
        Please select a Customer.
      </Typography>
    )}
            </Grid>
       
      </div>
      <div>
        <Controller
          name='ProductName'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
              sx={{marginTop:'10px'}}
                {...field}
                options={Product.sort((a: any, b: any) => a.ProductName.localeCompare(b.ProductName))}
                getOptionLabel={(option: any) => option.ProductName || ''}
                value={Product?.find((pricevalue: any) => pricevalue?.Id === watch('ProductName')) || null}
                onChange={(_, newValue) => {
                  fetchProductDetails(newValue?.Id)

                  field.onChange(newValue?.Id || null)
                  setMerchantName(newValue.ProductName)
                }}
                isOptionEqualToValue={(option, value) => option?.Id === value?.Id}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id='ProductName'
                    label={
                      <div>
                        <span
                          className='vehicleType'
                          style={{
                            color: getColor(),
                            fontSize: '14px'
                          }}
                        >
                          Product Name
                        </span>
                        <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                          *
                        </Typography>
                      </div>
                    }
                    error={Boolean(errors.ProductName) && !field.value}
                    helperText={errors.ProductName && !field.value ? 'Product Name is required' : ''}
                    inputProps={{
                      ...params.inputProps
                    }}
                  />
                )}
              />
            </>
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
            sx={{marginTop:'10px'}}

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
              error={!!errors.Amount}
              helperText={errors.Amount && errors.Amount.message}
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              onChange={(e) => {
                // Allow the user to type freely without formatting
                field.onChange(e.target.value);
              }}
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
        <Controller
          name='EarnedPoints'
          control={control}
          rules={{
            required: 'Earned Points is required', // Rule for required input
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
            sx={{marginTop:'10px'}}

              {...field}
              id='EarnedPoints'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Earned Points
                  </span>
                </div>
              }
              //type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.EarnedPoints}
              helperText={errors.EarnedPoints && !field.value ? 'EarnedPoints  is required' : ''}
              placeholder="0.00"
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
          <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleEmployeeGroupClose}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <CustomerGroupName
            getEmployeeGroup={getEmployeeGroup}
            setSelectedgroupName={setSelectedgroupName}
            handleEmployeeGroupClose={handleEmployeeGroupClose}
            fetchEmployeeGroup={fetchEmployeeGroup}
            setgroupNameSearch={setgroupNameSearch}
            onFetchData={onfetchData}
            groupNameSearch={groupNameSearch}
          />
        </CustomModal>
      
    </form>
  )
}
)

export default TransactionForm;
