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
import { Autocomplete, Button, IconButton } from '@mui/material'
import { useEffect } from 'react'

interface FormData {
  name: string
  email: boolean
  mobile: string
}
const CustomerHeader = ({
  editid,
  showMessage,
  setActiveStatus,
  firstNameID,
  activeStatus,
  setShowMessage,
  setPhoneCode,
  phoneCode,
  setEmailName,
  allCustomerName,
  setFirstname,
  emailName,
  printData,
  fetchData,
  setAllCustomerName,
  customer,
  resetFilters,
    applyFilters,
}: any) => {
  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<FormData>({})

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }
  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleOpenDrawer = () => {
    setShowMessage(false)
  }
  const resetAll = () => {
    reset(); // Reset the form
    resetFilters()
    setActiveStatus('all')
    setPhoneCode('')
    setAllCustomerName('')
    setEmailName('')
    // setOwnerName('')
    // setOwnerSortName('')

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
 useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.altKey && (event.key === 'n' || event.key === 'N')) {
        handleOpenDrawer()
      }
    }
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleOpenDrawer])

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

            {/* <Tooltip title='Print'>
              <div
                style={{
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '40px',
                  alignItems: 'center'
                }}
              >
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip> */}
            <div style={{ color: getColor(), padding: '10px', fontSize: '16px' }}>Customer</div>
          </Grid>

          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Tooltip title=''>
              <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New'>
                <CustomerSteperform editid={editid} fetchData={fetchData} customer={customer} />
              </DrawerComponent>
          </Tooltip>
            </Box>
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
                gap: '10px',
                paddingTop: '4px'
              }}
            >
              <Grid>
                <label  style={{ fontSize: '13px',color: getColor(), }}>Status</label>
                <br></br>
                <Select sx={{ height: '40px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value='all'>Show All</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
                </Grid>
                <Grid className='empTextField'>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextField
                      value={allCustomerName}
                      fullWidth
                      autoFocus
                      label={
                        <div>
                          <span
                            className='name'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Customer Name
                          </span>
                        </div>
                      }
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^([a-z])(.*)$/.test(inputValue) || inputValue === '') {
                          const modifiedValue = inputValue.charAt(0).toLowerCase() + inputValue.slice(1)
                          onChange({ ...e, target: { ...e.target, value: modifiedValue } })
                          setAllCustomerName(modifiedValue)
                        }
                      }}
                      placeholder='Name'
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
                      value={emailName}
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
                        const inputValue = e.target.value
                        if (/^([a-z])(.*)$/.test(inputValue) || inputValue === '') {
                          const modifiedValue = inputValue.charAt(0).toLowerCase() + inputValue.slice(1)
                          onChange({ ...e, target: { ...e.target, value: modifiedValue } })
                          setEmailName(modifiedValue)
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
                          value={phoneCode}
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
                            const inputValue = e.target.value
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setPhoneCode(inputValue)
                              onChange(e)
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
                        onClick={() => applyFilters(activeStatus, allCustomerName,phoneCode,emailName,)}
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
export default CustomerHeader
