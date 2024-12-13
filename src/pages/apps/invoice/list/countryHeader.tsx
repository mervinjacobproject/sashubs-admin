import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, Button, IconButton } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect, useState } from 'react'
import RightDrawerCategory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import CountryForm from 'src/pages/common/country/countryform'
import { Controller, useForm } from 'react-hook-form'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'

interface TableHeaderProps {
  showMessage:any
  setShowMessage:any
  countrySortName:any
  editId: any
  printData: any
  allCountry: any
  setAllCountryName: any
  setCountrySortName: any
  setActiveStatus: any
  activeStatus: any
  setPhoneCode: any
  phoneCode:any
  fetchData:any
  resetEditid:any
  rideData: any
  applyFilters:any
  resetFilters:any
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
const CountryHeader = (props: TableHeaderProps) => {
  const {
    countrySortName,
    editId,
    printData,
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
    rideData,
    resetFilters,
    applyFilters,
  } = props

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
  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const resetEditid = () => {
    props.resetEditid()
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
  const handleAddNewClick = () => {
    handleModalOpen()
    setShowMessage(false)
  }
  const resetAll = () => {
    reset(); // Reset the form
    resetFilters()
    setActiveStatus('all')
    setPhoneCode('')
    setCountrySortName('')

  };

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
              <h3 style={{  marginTop: '8px' }}>Country</h3>
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
              <CountryForm fetchData={fetchData} editStatus editId={editId} resetEditid={resetEditid} onClose={handleModalClose} rideData={rideData}/>
            </CustomModal>
            {/* <RightDrawerCategory anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add new'>
              <CountryForm fetchData={fetchData} editStatus editId={editId} resetEditid={resetEditid} rideData={rideData}/>
            </RightDrawerCategory> */}
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
             <Grid>
                <label  style={{ fontSize: '13px',color: getColor(), }}>Status</label>
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
                  Country
                </label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={allCountry}
                          getOptionLabel={(option: any) => option.Name || ''}
                          value={allCountry?.find((pricevalue: any) => pricevalue?.ID === watch('country')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.ID || null)
                            setAllCountryName(newValue?.ID)
                          }}
                          isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
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
              <Grid  className='empTextField'>
              <Controller
                name='countrySortName'
                control={control}
                rules={{ required: 'Country  is required' }}
                render={({ field: { onChange, value } }) => (
                  <CustomTextField
                    value={countrySortName}
                    fullWidth
                    autoFocus
                    label={
                      <div>
                        <span
                          className='countrySortName'
                          style={{
                            color: getColor(),
                            fontSize: '14px'
                          }}
                        >
                          Country Name
                        </span>
                      </div>
                    }
                    onChange={e => {
                      let inputValue = e.target.value;
                      inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                      if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                        setCountrySortName(inputValue);
                        onChange(e);
                      }
                    }}
                    placeholder='Country Sort Name'
                  />
                )}
              />
            </Grid>
              <Grid item xs={12} sm={2}>
                <div>
                  <Controller
                    name='postcode'
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
                                  color: getColor()
                                }}
                              >
                                Phone code
                              </span>
                            </div>
                          }
                          placeholder='code'
                          onChange={e => {
                            const inputValue = e.target.value
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setPhoneCode(inputValue);
                              onChange(e)
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '20px', marginBottom: '5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(activeStatus, phoneCode,countrySortName)}
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

export default CountryHeader
