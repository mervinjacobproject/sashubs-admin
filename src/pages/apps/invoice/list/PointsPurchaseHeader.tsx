import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, Button, FormControl, IconButton, TextField, Typography } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect, useState } from 'react'
import RightDrawerCategory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import CountryForm from 'src/pages/common/country/countryform'
import { Controller, useForm } from 'react-hook-form'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import PointsPurchaseForm from 'src/pages/merchant/points-purchase/pointPurchaseform'
// import PointsPurchaseForm from 'src/pag'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import MerchantGroup from './Merchantgroupheader'

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
 // customer:any
  merchantName:any
  setMerchantName:any
  // setCustomer:any
  // setProductName:any
  // productName:any
  setToDate:any,
  toDate:any,
  resetFilters: any,
  applyFilters: any,
  date:any
  setDate:any
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

const DateTextField = styled(TextField)({
  // Add your custom styles here if needed
  margin: '0 10px',
  width: '100%',
})



  const PointsPurchaseHeader = ({
    countrySortName,
    editId,
    allCountry,
    setAllCountryName,
    setCountrySortName,
    setActiveStatus,
    activeStatus,
    setPhoneCode,
    phoneCode,
    showMessage,
    setShowMessage,
    fetchData,
    setToDate,
    toDate,
    fromDate,

    // rideData,
    allMerchant,
    setDate,
    merchantName,
    setMerchantName,
    setFromDate,
    resetFilters,
    applyFilters,
    date
  }: any) => {

  const defaultAccountValues:any = {
    postcode: '',
  }

  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }
  const handledateChange = (event: any) => {
    setToDate(event.target.value)
  }
  const handleChange = (event: any) => {
    setFromDate(event.target.value)
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(date || '');
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const resetEditid = () => {
    resetEditid()
  }
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setDate(newDate); // Update the parent component's state
  };
  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleOpenDrawer = () => {
    setShowMessage(false)
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
  const handleAddNewClick = () => {
    handleModalOpen()
    setShowMessage(false)
  }
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


  const [selectedgroupName1, setSelectedgroupName1] = useState({ OwnerName: '', id: '' })
  const [openPopupcustomerGroup1, setOpenPopupEmployeeGroup1] = useState(false)
  const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
  const [groupNameSearch1, setgroupNameSearch1] = useState('')
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')
  const handleEmployeeGroupClose1 = () => {
    setOpenPopupEmployeeGroup1(false)
  }
  
  const clearSelectedgroupname1 = () => {
    setSelectedgroupName1({ OwnerName: '', id: '' })
    setFetchedgroupName1('')
  }
  const handlegroupnameclick1 = () => {
setMerchantName('')
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

        setGetEmployeeGroup1(res.data.data)
  }
    catch (err) {
        console.error(err)
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
  const resetAll = () => {
    reset(); // Reset the form
    selectedgroupName1.OwnerName = '';
    handlegroupnameclick1();
    setMerchantName('');
    setToDate('');
    setFromDate('') ;// Reset merchant name state
  };
  useEffect(() => {
     fetchEmployeeGroup1()
    // }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [groupNameSearch1])

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
            <Grid>
            <Tooltip title='Filter'>
              <div
               style={{
                width: '40px',
                display: 'flex',
                justifyContent: 'center',
                height: '40px',
                alignItems: 'center'
              }}>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
              </Tooltip>
            </Grid>

            <div>
              <h3 style={{  marginTop: '8px' }}>Points Purchase</h3>
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
              width={400}
            >
              <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'start', gap: '10px' }}>
                <p style={{ color: getColor(), margin: '0px' }}>[esc]</p>
                <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleModalClose}>
                  <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton>
              </div>
              <PointsPurchaseForm fetchData={fetchData}  onClose={handleModalClose} />
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
                justifyContent: 'start',
                gap: '10px'
              }}
            >
              
              <Grid item xs={10}  sx={{ marginTop: !selectedgroupName1.id || !fetchedgroupName1 ? '' : '' }}>
              {/* <span
                style={{
                  color: getColor(),
                  fontSize: '14px'
                }}
              >
                Merchant Name
              </span> */}
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
                          cursor: 'pointer',
                          marginTop:'10px',
                          width: '260px'
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
                                 if (Number(item.id) == Number(fetchedgroupName1 )) {
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
                    sx={{ color: '#776cff', fontWeight: 600, width: '160px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', marginTop: '10px', borderRadius: '5px' }}
                    onClick={handleOpengroupName1}
                  >
                    Select a Merchant
                  </Typography>
                )}
                {(selectedgroupName1.id || fetchedgroupName1) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer', marginTop: '10px', marginLeft: '-10px', width:'40px', height:'40px', color: 'red', fontWeight:'600' }}
                    onClick={handlegroupnameclick1}
                  />
                )}
              </Box>
             

            </Grid>

            <Grid className='empTextField' style={{marginTop:'15px', marginLeft:'10px'}}>
                <Controller
                  name='fromDate'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTextField
                      type='date'
                      value={fromDate}

                      label={<span style={{ color: getColor() }}>From Date</span>}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: { height: '38px' }, // Adjust the height as needed
                      }}
                      onChange={handleChange}
                    />
                  )}
                />
              </Grid>

              <Grid className='empTextField' style={{marginTop:'15px'}}>
                <Controller
                  name='toDate'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DateTextField
                      type='date'
                      value={toDate}
                      label={<span style={{ color: getColor() }}>To Date</span>}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: { height: '38px' }, // Adjust the height as needed
                      }}
                      //setToDate={setToDate}
                      onChange={handledateChange}
                    />
                  )}
                />
              </Grid>
              {/* <Grid className='empTextField' style={{marginTop:'-5px'}}>
  <div>
    <label style={{ color: getColor() , fontSize:'12px', marginLeft:'10px'}}>Transaction Type</label>
    <Controller
      name='transType'

      control={control}

      rules={{ required: true }}

      render={({ field: { value, onChange } }) => (
        <FormControl fullWidth variant="outlined">

          <Select
            labelId="transType-label"
            sx={{ height: '38px', marginLeft:'10px', width: '160px' }}
            value={value}
            onChange={handleStatusChange}
            //label="Transaction Type" // This is necessary for accessibility
          >
            <MenuItem value='all'>Show All</MenuItem>
            <MenuItem value='0'>Mannual</MenuItem>
            <MenuItem value='1'>Online</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  </div>
</Grid> */}
 <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '20px', marginTop: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(merchantName, fromDate, toDate,)}
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
          
            </div>
          </div>
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
            onFetchData={fetchData}
            setgroupNameSearch={setgroupNameSearch1}
            groupNameSearch={groupNameSearch1}
            setMerchantName={setMerchantName}
          />
        </CustomModal>
        </div>
      )}
    </>
  )
}

export default PointsPurchaseHeader
