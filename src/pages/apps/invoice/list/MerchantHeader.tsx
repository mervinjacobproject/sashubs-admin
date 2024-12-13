import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import CustomerSteperform from 'src/pages/customer/customer/CustomerSteperform'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Controller, useForm } from 'react-hook-form'
import { Autocomplete, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ResuseModal from 'src/pages/components/ReusableComponents/Modal/resusemodal'
import MerchantSteperform from 'src/pages/merchant/merchant/Merchantform'
import { set } from 'nprogress'
import { s } from '@fullcalendar/core/internal-common'

interface FormData {
  name: string
  email: boolean
  mobile: string
  OwnerName: string
  ShopName: string
  
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
const MerchantHeader = ({
  editid,
  showMessage,
  setActiveStatus,
  firstNameID,
  activeStatus,
  setShowMessage,
  setPhoneCode,
  phoneCode,
  setEmailName,
  setFirstname,
  emailName,
  setOwnerName,
  OwnerName,
  setShopName,
  shopName,
  setPrintData,
    printData,
  fetchData,
  customer,
  customergroupname,
  contactSortName,
  setContactSortName,
  ownerSortName,
  setOwnerSortName,
  phoneSortName,
  setPhoneSortName,
  emailSortName,
  setEmailSortName,
  resetFilters,
    applyFilters,
}: any) => {
  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<FormData>({})
  const [modalOpen, setModalOpen] = useState(false)
  // const [shopName, setShopName] = useState('')

  
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
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleAddNewClick = () => {
    handleModalOpen()
    setShowMessage(false)
  }
  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }
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
  const resetAll = () => {
    reset(); // Reset the form
    resetFilters()
    setShopName('')
    setActiveStatus('all')
    setPhoneSortName('')
    setEmailSortName('')
    setContactSortName('')
    // setOwnerName('')
    // setOwnerSortName('')

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
            <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

            <div>
              <h3 style={{ marginTop: '8px' }}>Merchant</h3>
            </div>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Tooltip title=' Alt+N'> */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

              <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New' >
                <MerchantSteperform editid={editid} fetchData={fetchData} customergroupname={customergroupname}customer={customer} />
              </DrawerComponent>
            </Box>
              {/* </Tooltip> */}
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
                gap: '10px'
              }}
            >
              <Grid>
                <label  style={{ fontSize: '13px',color: getColor(),  marginRight:"5px"}}>Status</label>
                <br></br>
                <Select sx={{ height: '40px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value='all'>Show All</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
                </Grid>
             
              {/* <Grid sx={{ mb: 6 }}>
                <label
                  style={{
                    color: getColor()
                  }}
                >
                  Customer
                </label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={firstNameID}
                          getOptionLabel={(option: any) => option.FirstName + '' + option.LastName}
                          value={firstNameID?.find((pricevalue: any) => pricevalue?.CId === watch('name')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.CId || null)
                            setFirstname(newValue?.CId)
                          }}
                          isOptionEqualToValue={(option, value) => option?.CId === value?.CId}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              inputProps={{
                                ...params.inputProps
                              }}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid> */}
              <Grid className='empTextField'>
                <Controller
                  name='OwnerName'
                  control={control}
                  //rules={{ required: 'Country  is required' }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextField
                      value={contactSortName}
                      fullWidth
                      autoFocus
                      label={
                        <div>
                          <span
                            className='OwnerName'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Contact Person
                          </span>
                        </div>
                      }
                      onChange={e => {
                         let inputValue = e.target.value;
                         inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                         if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                           setContactSortName(inputValue);
                           onChange(e);
                         }
                       }}
                                            
                       placeholder='Person Name'
                    />
                  )}
                />
              </Grid>
              <Grid className='empTextField'>
                <Controller
                  name='ShopName'
                  control={control}
                  rules={{ required: 'shopname  is required' }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextField
                      value={shopName}
                      fullWidth
                      autoFocus
                      label={
                        <div>
                          <span
                            className='ShopName'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                           Shop Name
                          </span>
                        </div>
                      }
                      onChange={e => {
                         let inputValue = e.target.value;
                         inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                         if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                           setShopName(inputValue);
                           onChange(e);
                         }
                       }}
                      placeholder='ShopName'
                    />
                  )}
                />
              </Grid>



              <Grid className='empTextField'>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: 'Country  is required' }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextField
                      value={emailSortName}
                      fullWidth
                      autoFocus
                      label={
                        <div>
                          <span
                            className='emailName'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Email
                          </span>
                        </div>
                      }
                      onChange={e => {
                         let inputValue = e.target.value;
                         inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                         if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                           setEmailSortName(inputValue);
                           onChange(e);
                         }
                       }}
                      placeholder='Email'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <div>
                  <Controller
                    name='mobile'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={phoneSortName}
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor(),
                                  fontSize: '14px'
                                }}
                              >
                                Mobile
                              </span>
                            </div>
                          }
                          placeholder='Mobile'
                          onChange={e => {
                             let inputValue = e.target.value;
                             inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                             if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                               setPhoneSortName(inputValue);
                               onChange(e);
                             }
                           }}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '20px', marginTop: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(activeStatus, shopName,phoneSortName,emailSortName,contactSortName,)}
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
        </div>
      )}
    </>
  )
}
export default MerchantHeader
