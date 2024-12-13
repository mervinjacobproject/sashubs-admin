import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Box, Button, Grid, InputAdornment, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState,useCallback, useEffect, forwardRef } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomerGroupName from '../point-Transaction/groupnamecustomer'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

interface FormData {
  OwnerName: any
  Amount: string
  // sortname: string
  status: any
  CustomerName: any
  CustomerID: any
  EarnedPoints: any
  TransDate: any
  TransactionType: any
  ProductID: any
  ProductName: any
  ReferenceDet: any
  mobileNumber: string
  emailId: string
  createddate: string
}



interface customerProps {
  // handleNext: () => void
  // ref: any
  editid: any
  OwnerName: any
  ProductName: any
  EarnedPoints: any
  Amount: any
  editStatus: any
  onCloseModal: any
  allMerchant: any
  CustomerName: any
  customer: any
  // createId: any
  // setCreateId: any
  onFetchData:any
}

export interface CustomerNewMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
}
const TransactionEditForm: React.FC<customerProps> =
forwardRef<CustomerNewMethods, customerProps>(
({
  employeegroupName,

  editStatus,
  onFetchData,
  editid,
  CustomerName,
  onCloseModal,
  OwnerName,
  ReferenceDet,
  ProductName,
  TransactionType,
  ProductID,TransDate,
  CustomerID,
  EarnedPoints,
  Amount,
  onClose,
  allMerchant
}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      OwnerName: OwnerName,
      Amount:Amount,
      status: editStatus,
      CustomerName: CustomerName,
      CustomerID: CustomerName,
      EarnedPoints: EarnedPoints,
      TransDate: TransDate,
      TransactionType: TransactionType,
      ProductID: ProductID,
      ProductName: ProductName,
      ReferenceDet: ReferenceDet
    }
  })

  const [countryName, setMerchantName] = useState('')
  const [customer, setCustomer] = useState([])
  const [Product, setProduct] = useState([])

  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isContentChanged, setIsContentChanged] = useState<boolean>(false) // State variable to track content changes



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



  useEffect(() => {
    //fetchCustomerData()
    fetchProductData()
  }, [])

  // const fetchCustomerData = async () => {
  //   try {
  //     const res = await ApiClient.post(`/getcustomer`)
  //     const response = res.data.data

  //     const dataWithSerialNumber = response.map((row: any, index: number) => ({
  //       ...row,
  //       'S.No': index + 1
  //     }))

  //     setCustomer(dataWithSerialNumber)
  //     setFetchedgroupName(response[0].CustomerName)

  //   } catch (err) {
  //     toast.error('Error fetching data:')
  //   }
  // }

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


  useEffect(() => {
    onFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const newCustomerId = selectedgroupName.id || fetchedgroupName;
    setCustomerId(newCustomerId); // Set the customerId
if(selectedgroupName.id){
  setIsContentChanged(true);
} else {
  setIsContentChanged(false);
}

  }, [selectedgroupName, fetchedgroupName]);

  // Effect to check if any form field has been modified

  const onSubmit = async (editedData: FormData) => {
    if (!isContentChanged && !isDirty) {
      toast.error('No changes detected. Please modify the content before saving.');
      return;
    }
    const customerData = selectedgroupName.id ? selectedgroupName.id : fetchedgroupName;
    try {
      const requestData = {
        Id: editid,
        Amount: editedData.Amount,
        Status: editedData.status,
        ProductName: editedData.ProductName,
        CustomerID: customerData,
        EarnedPoints: editedData.EarnedPoints,
        TransDate: editedData.TransDate,
        TransactionType: editedData.TransactionType,
        ProductID: editedData.ProductName,
        ReferenceDet: editedData.ReferenceDet

      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/updatetransaction`

      const response = await ApiClient.post(apiEndpoint, requestData, { headers })

      if (response.status === 200) {
        onCloseModal()
        toast.success('Updated successfully')
        onFetchData()
      }
    } catch (error) {
    //  console.error(error)
    }
  }

  useEffect(() => {
    setFetchedgroupName(CustomerName)
    setValue('status', editStatus)
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

  // const getFormDetails = useCallback(
  //   async (id: any) => {
  //     try {

  //         const res = await ApiClient.post(`/getcustomer`)
  //   const response = res.data.data

  //   const selectedRow = response.find((row: any) => row.Id == id)
  //   if (selectedRow) {
  //     setValue('CustomerName', selectedRow.CustomerName)
  //     setValue('mobileNumber', selectedRow.PhoneNo)
  //     setValue('emailId', selectedRow.EmailId)
  //     const date = new Date(selectedRow.CreatedDateTime)
  //     const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  //     setValue('createddate', formattedDate)
  //     setFetchedgroupName(selectedRow.Id)
  //   }


  //     } catch (err) {
  //       console.error(err) // Log the error
  //     }
  //   },
  //   [customer, setValue]
  // )

  // useEffect(() => {
  //   if (editid) {
  //     getFormDetails(editid)
  //   }

  // }, [editid, getFormDetails])




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
        Edit Transaction
      </Typography>



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
                                 if (Number(item.Id) == Number(fetchedgroupName )) {
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
          name='ProductName'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={Product.sort((a: any, b: any) => a.ProductName.localeCompare(b.ProductName))}
                getOptionLabel={(option: any) => option.ProductName || ''}
                value={Product?.find((pricevalue: any) => pricevalue?.Id === watch('ProductName')) || null}
                onChange={(_, newValue) => {
                  // console.log(newValue)
                  field.onChange(newValue?.Id || null)
                  setMerchantName(newValue.ProductName)
                }}
                isOptionEqualToValue={(option, value) => option?.Id === value?.Id}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id="ProductName"
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


       {/* <Grid item xs={4}>
            <Controller
              name='EarnedPoints'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  label='Earned Points'
                  fullWidth
                  type="number"
                  {...field}
                  error={Boolean(errors.EarnedPoints)}
                  helperText={errors.EarnedPoints && !field.value ? 'EarnedPoints  is required' : ''}
                />
              )}
            />
          </Grid> */}


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
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
              error={!!errors.Amount}
              helperText={errors.Amount && errors.Amount.message}
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
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
              error={!!errors.EarnedPoints}
              // helperText={errors.EarnedPoints && errors.EarnedPoints.message}
            />
          )}
        />
      </div>
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
    </form>
  )
}
)
export default TransactionEditForm;
