import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton, MenuItem, Select } from '@mui/material'
import SuburbForm from 'src/pages/common/suburb/suburbForm'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Controller, useForm } from 'react-hook-form'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'black',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const SuburbHeader = ({
  setSelectedRows,
  countryId,
  setCountryId,
  printData,
  onFetchData,
  bulkDelete,
  country,
  setAllCountryName,
  allCountryName,
  allCountry,
  setAllState,
  setAllData,
  stateValue,
  setCityySortName,
    setActiveStatus,
    citySortName,
    activeStatus,
    applyFilters,
    resetFilters,
}: any) => {

  const [isCreateJobsModalOpen] = React.useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [stateData, setStateData] = useState([])
  const [countryData, setCountry] = useState<any[]>([]);
  const handleIconButtonClick = () => {
    fetchState()
    fetchCountry()
    setShowMessage(!showMessage)
  }
  const fetchState = async () => {
    // console.log('countryId', countryId)
    try {
      const response = await ApiClient.post(`/getstates`)
      setStateData(response.data.data)
    } catch (error) {
    //  console.error('Error fetching states:', error)
    }
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

  const handleDeleteConfirm = () => {
    bulkDelete()
    setModalOpenDelete(false)
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
    setSelectedRows([])
  }

  const handleAddNewClick = () => {
    handleModalOpen()
  }

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleModalOpenDelete: any = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)


  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }



  const resetAll = () => {
    // Reset the form fields to their default values
    reset(); // Reset the form
    resetFilters(); // Reset the filters

     // Reset customer state
    // Add any other reset logic necessary for your state or variables
  };

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

  const defaultAccountValues:any = {
    country: '',
    state: ''

  }

  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

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
            <div>
            <IconButton onClick={handleIconButtonClick}>
              <Icon icon='mingcute:filter-line' />
            </IconButton>
            </div>
            {/* <CustomTextField
              value={value}
              sx={{ mr: 4 }}
              placeholder='Search '
              onFocus={handleFocus}
              onChange={(e) => handleFilter(e.target.value)}
            /> */}
            <CustomModal
              open={modalOpenDelete}
              onClose={handleModalCloseDelete}
              onOpen={handleModalOpenDelete}
              buttonText=''
              buttonOpenText=''
            >
              <p
                style={{
                  color: getColor()
                }}
              >
                Are you sure you want to delete?
              </p>

              <div
                className='delete-popup'
                style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
              >
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#808080',
                    '&:hover': {
                      background: '#808080',
                      color: 'white'
                    }
                  }}
                  onClick={handleCancelDelete}
                >
                  Cancel
                </Button>

                <Button
                  variant='contained'
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  onClick={handleDeleteConfirm}
                >
                  {' '}
                  <Icon icon='ic:baseline-delete' />
                  Delete
                </Button>
              </div>
            </CustomModal>

            {/* <Tooltip title='Print'>
              <div>
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip> */}
            <div>
              <h3 style={{  marginTop: '8px' }}>City</h3>
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
              <SuburbForm
                onClose={handleModalClose}
                country={country}
                stateValue={stateValue}
                onFetchData={onFetchData}
                countryId={countryId}
                setCountryId={setCountryId}
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
              <Controller
                name='cityySortName'
                control={control}
                rules={{ required: 'Country  is required' }}
                render={({ field: { onChange, value } }) => (
                  <CustomTextField
                    value={citySortName}
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
                          City Name
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
                        setCityySortName(inputValue);
                        onChange(e);
                      }
                    }}
                    placeholder='Country Sort Name'
                  />
                )}
              />
            </Grid>

              <Grid>
                <label style={{ fontSize: '13px' }}>State</label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='state'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={stateData}
                          getOptionLabel={(option: any) => option.StateName || ''}
                          value={stateData?.find((pricevalue: any) => pricevalue?.id === watch('state')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.id || null)
                            setAllState(newValue?.id)
                          }}
                          isOptionEqualToValue={(option, value) => option?.id === value?.id}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              inputProps={{
                                ...params.inputProps
                              }}
                              placeholder='State'
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid>

              <Grid>
                <label style={{ marginRight: '10px', marginTop: '15px', marginLeft: '9px' }}>Country</label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={countryData}
                          getOptionLabel={(option: any) => option.CountryName || ''}
                          value={countryData?.find((pricevalue: any) => pricevalue?.id === watch('country')) || null}
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
                              placeholder='Country'
                            />
                          )}
                        />
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '10px', marginTop: '-5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(activeStatus, allCountryName, citySortName)}
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

export default SuburbHeader
