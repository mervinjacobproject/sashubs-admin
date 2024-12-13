import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import { Controller, useForm } from 'react-hook-form'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import TransactionForm from 'src/pages/customer/transaction/transactionform'
import CustomerGroupName from './CustomerGroup'
import { fetchData } from 'src/store/apps/user'
import { Label } from 'recharts'
// import TransactionForm from 'src/pages/customer/transaction/transactionform'

interface TableHeaderProps {
  showMessage:any
  setShowMessage:any
  countrySortName:any
  editId: any
  allCountry: any
  setAllCountryName: any
  setCountrySortName: any
  setActiveStatus: any
  activeStatus: any
  setPhoneCode: any
  phoneCode:any
  fetchData:any
  resetEditid:any
//  rideData: any
  allMerchant:any
 customer:any
  merchantName:any
  setMerchantName:any
  applyFilters:any
  resetFilters:any
  setCustomer:any
  setProductName:any
  productName:any

  date:any
  setDate:any
}
const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit'
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit'
  } else {
    return '#fff'
  }
}

const color = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#fff'
  } else if (selectedMode === 'light') {
    return '#222'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#fff'
  } else {
    return '#222'
  }
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: color(),
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


const TransactionHeader = ({
  stateValue,
  setSelectedRows,
  printData,
  onfetchData,
  bulkDelete,
  allCountry,
  setProductName,
  applyFilters,
  productName,
  setCustomer,
  customer,
  date,
  setDate,
  resetFilters,
  setActiveStatus,
  activeStatus,
  setAllCountryName,
  allMerchant,
  setAllState,
  designation,
  editId
}: any) => {
  const [isCreateJobsModalOpen] = React.useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [productData, setProductData] = useState<any[]>([]);
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [selectedDate, setSelectedDate] = useState(date || '');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setDate(newDate); // Update the parent component's state
  };

  const handleIconButtonClick = () => {
    fetchProduct()
    setShowMessage(!showMessage)
  }

  const handleAddNewClick = () => {
    handleModalOpen()
  }

  const defaultAccountValues:any = {
    country: '',
  }

  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCreateJobsModalOpen])

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.altKey && (event.key === 'n' || event.key === 'N')) {
        handleAddNewClick()
      }
    }
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
setCustomer("")
    clearSelectedgroupname()
  }
  const handleOpengroupName = () => {
    setOpenPopupEmployeeGroup(true)
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
  const fetchProduct = async() => {
    try {
      const res = await ApiClient.post(`/getproduct`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setProductData(dataWithSerialNumber)
    } catch (err) {
      //toast.error('Error fetching data:')
    }
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

  const resetAll = () => {
    // Reset the form fields to their default values
    reset(); // Reset the form
    resetFilters()

    setProductName(''); 
    setSelectedDate("")
    // Reset product name state
    setCustomer(''); // Reset customer state
    selectedgroupName.CustomerName = '' // Reset employee group state
    handlegroupnameclick() // Reset employee group state
    // Add any other reset logic necessary for your state or variables
  };

  return (
    <>
      <Box
        sx={{
          p: 5,
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Grid sx={{ display: 'flex', alignItems: 'start' }}>
            <Grid sx={{ display: 'flex', alignItems: 'start' }}>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Grid>

            <div>
              <h3 style={{  marginTop: '8px' }}>Transaction</h3>
              </div>
          </Grid>

          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title=' Alt+N'>
              <Button
                type='submit'
                variant='contained'
                onClick={handleAddNewClick}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100px',
                  padding: '5px !important',
                  height: '40px',
                  fontSize: '15px',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: '#776cff',
                    color: 'white'
                  }
                }}
              >
                <Icon icon='ic:twotone-add' width={20} height={20} />
                Add New
              </Button>
            </Tooltip>

            <CustomModal
              open={modalOpen}
              onClose={handleModalClose}
              onOpen={handleModalOpen}
              buttonOpenText='Add new'
              buttonText=''
            >
              <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'start', gap: '10px' }}>
                <p style={{ color: getColor(), margin: '0px' }}>[esc]</p>
                <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleModalClose}>
                  <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton>
              </div>
              <TransactionForm
                //allCountry={allCountry}
                onClose={handleModalClose}
                onfetchData={onfetchData}
                editId={editId}
                //allMerchant={allMerchant}
              />
            </CustomModal>
          </Grid>
        </Box>
      </Box>
      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'start',
                gap: '10px',
                marginBottom:"10px"
              }}
            >
              <Grid>
                <label style={{ fontSize: '13px' }}>Product Name</label>
                <br></br>
                <Grid sx={{ width: '250px', marginBottom: '20px' }}>
                  <Controller
                    name='productName'
                    
                    rules={{
                      required: 'Please select a product name'
                    }}
                    control={control}
                    render={({ field }) => (
                      <>
                     
                        <Autocomplete
                          {...field}
                          options={productData}
                          getOptionLabel={(option: any) => option.ProductName || ''}
                          value={productData?.find((pricevalue: any) => pricevalue?.Id === watch('productName')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.Id || null)
                            setProductName(newValue?.Id)
                          }}
                          isOptionEqualToValue={(option, value) => option?.Id === value?.Id}
                          renderInput={params => (
                            
                            <CustomTextField
                              {...params}
                              inputProps={{
                                ...params.inputProps
                              }}
                              placeholder='Product Name'
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid>


              <Grid item xs={4} sm={4} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ?'' : ''   }}>
              <label
                style={{
                  color: getColor(),
                  fontSize: '12px',
                }}
              >
                {/* Customer Name */}
              </label>
              {/* <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography> */}

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
                          cursor: 'pointer',
                          marginTop:'-60px',
                          width: '190px',
                          height:'40px'
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
                    sx={{ color: '#776cff', fontWeight: 600, width: '220px',height:'40px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', borderRadius: '5px', marginTop: '-80px', justifyContent: 'center' }}
                    onClick={handleOpengroupName}
                  >
                    Select a Customer
                  </Typography>
                )}
            {(selectedgroupName.id || fetchedgroupName) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer', marginTop: '-80px', marginRight: '-40px', width:'40px', height:'40px', color: 'red', fontWeight:'600' }}
                    onClick={handlegroupnameclick}
                  />
                )}
              </Box>

            </Grid>

            <Grid className="empTextField" style={{ marginLeft: '60px', marginBottom:'20px' }}>
  <TextField
    id="date"
    label="Trans Date"
    type="date"
    value={selectedDate}
    onChange={handleDateChange}
    sx={{
      marginRight: 2,
      '& .MuiInputBase-root': {
        height: '38px',
      },
      '& input': {
        padding: '8px', // Adjust padding inside the TextField
      }
    }}
    InputLabelProps={{
      shrink: true,
    }}
  />
</Grid>
            </div>
            <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '20px', marginTop: '-10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(customer, productName, date)}
                        variant='contained'
                      >
                        <Icon fontSize='1.125rem' style={{}} icon='mingcute:filter-line' />
                        Filter
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', marginLeft: '5px', alignItems: 'center' }}>
                      <Button
                        onClick={() => {
                          resetAll()
                        }}
                        variant='contained'
                      >
                        <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='radix-icons:reset' />
                      </Button>
                    </Box>
                  </Box>
            {/* <Box sx={{ display: 'flex', marginLeft: '40px', alignItems: 'center', marginTop: '-10px' }}>
      <Button
        onClick={resetAll} // Call resetAll on button click
        variant='contained'
      >
            <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='radix-icons:clear' />
            Clear

      </Button>
    </Box> */}
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
            setCustomer={setCustomer}
            groupNameSearch={groupNameSearch}
          />
        </CustomModal>
        </div>
      )}
    </>
  )
}

export default TransactionHeader
function resetFilters() {
  throw new Error('Function not implemented.')
}

