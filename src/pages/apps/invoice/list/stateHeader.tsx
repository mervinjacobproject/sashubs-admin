import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton, MenuItem, Select } from '@mui/material'
import StateForm from 'src/pages/common/state/stateForm'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import { Controller, useForm } from 'react-hook-form'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { set } from 'nprogress'

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

const StateHeader = ({
  stateValue,
  setSelectedRows,
  printData,
  onFetchData,
  bulkDelete,
  allCountry,
  setAllCountryName,
  allCountryName,
  setActiveStatus,
    activeStatus,
    setStateName,
    stateName,
  setAllState,
  stateSortName,
  setStateSortName,
  setPhoneCode,
  phoneCode,
  applyFilters,
  resetFilters,

  designation
}: any) => {
  const [isCreateJobsModalOpen] = React.useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [countryData, setCountry] = useState<any[]>([]);

  const handleIconButtonClick = () => {
    fetchCountry()
    setShowMessage(!showMessage)
  }

  const handleAddNewClick = () => {
    handleModalOpen()
  }
  const defaultAccountValues:any = {
    allCountryName: '',
    stateName: '',

  }

  const {
    control,
    reset,
    watch,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }
  const fetchCountry = async() => {
    try {
      const res = await ApiClient.post(`/getcountry`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setCountry(dataWithSerialNumber)
    } catch (err) {
      //toast.error('Error fetching data:')
    }
  }
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
    // Reset the form fields to their default values
    reset(); // Reset the form
    resetFilters(); // Reset the filters

     // Reset customer state
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
              <h3 style={{  marginTop: '8px' }}>State</h3>
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
              <StateForm
                allCountry={allCountry}
                onClose={handleModalClose}
                onFetchData={onFetchData}
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
                <Grid  className='empTextField'>
                <div>
                  <Controller
                    name='stateName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          placeholder='State'
                          value={stateName}
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor()
                                }}
                              >
                                State Name
                              </span>
                            </div>
                          }
                          onChange={e => {
                             let inputValue = e.target.value;
                             inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                             if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                              setStateName(inputValue);
                              onChange(e)
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>

              <Grid>
                <label style={{ marginRight: '10px', marginTop: '15px', marginLeft: '9px' }}>Country</label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='allCountryName'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={countryData}
                          getOptionLabel={(option: any) => option.CountryName || ''}
                          value={countryData?.find((pricevalue: any) => pricevalue?.id === watch('allCountryName')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.id || null)
                            setAllCountryName(newValue?.id)
                          }}
                          isOptionEqualToValue={(option, value) => option?.id === value?.id}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              inputProps={{
                                ...params.inputProps
                              }}
                              placeholder='country'
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              {/* <Grid  className='empTextField'>
              <Controller
                name='stateSortName'
                control={control}
                rules={{ required: 'State  is required' }}
                render={({ field: { onChange, value } }) => (
                  <CustomTextField
                    value={stateSortName}
                    fullWidth
                    autoFocus
                    label={
                      <div>
                        <span
                          className='stateSortName'
                          style={{
                            color: getColor(),
                            fontSize: '14px'
                          }}
                        >
                          State Name
                        </span>
                      </div>
                    }
                    onChange={e => {
                     // alert(e.target.value)
                      let inputValue = e.target.value;
                      inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                    //  console.log(inputValue,"inputValue")
                      if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                      //  console.log("here", inputValue)
                        setStateSortName(inputValue);
                        onChange(e);
                      }
                    }}
                    placeholder='State Sort Name'
                  />
                )}
              />
            </Grid> */}
              {/* <Grid item xs={12} sm={2}>
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
              </Grid> */}
              <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '10px', marginTop: '-5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(activeStatus, stateName,allCountryName, )}
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

export default StateHeader
