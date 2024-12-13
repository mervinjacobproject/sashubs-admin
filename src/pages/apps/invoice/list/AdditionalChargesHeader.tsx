import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton } from '@mui/material'
import AdditionalChargeform from 'src/pages/pricing/additional-charges/AdditionalChargeform'
import RightDrawerCategory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import { Controller, useForm } from 'react-hook-form'

const AdditionalChargesHeader = (props: any) => {
  const {
    editId,
    printData,
    activeStatus,
    setActiveStatus,
    setAllCountryName,
    setChargeCode,
    chargeCode,
    stateValue,
    setShowMessage,
    showMessage,
    rideData
  } = props

    const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const resetEditid = () => {
    props.resetEditid()
  }

  const handleOpenDrawer = () => {
    setShowMessage(false)
  }
  
  const fetchData = () => {
    props.fetchData()
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

  const defaultAccountValues:any = {
    country: '',
  }

  const {
    control,
    watch,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

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
              <div
                style={{
                  width: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '40px',
                  alignItems: 'center'
                }}
              >
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

            <Tooltip title='Print'>
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
            </Tooltip>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <RightDrawerCategory anchor='right' isOld={true} onOpen={handleOpenDrawer} buttonLabel='Add new'>
              <AdditionalChargeform fetchData={fetchData}  resetEditid={resetEditid} editId={editId} rideData={rideData} />
            </RightDrawerCategory>
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
              <div
                style={{
                  display: 'grid'
                }}
              >
                <span
                  style={{
                    color: getColor(),
                    height: '2px',
                    marginBottom:'20px'
                  }}
                >
                  Status
                </span>

                <Select sx={{ height: '40px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value='all'>Show All</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </div>
            
                <Grid sx={{ width:'200px' }}>
                  <label
                    style={{
                      color: getColor()
                    }}
                  >
                    Title
                  </label>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={stateValue}
                          getOptionLabel={(option: any) => option.Name || ''}
                          value={stateValue?.find((pricevalue: any) => pricevalue?.ID === watch('country')) || null}
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
                          value={chargeCode}
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor()
                                }}
                              >
                                Charge
                              </span>
                            </div>
                          }
                          placeholder='code'
                          onChange={e => {
                            const inputValue = e.target.value
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setChargeCode(inputValue)
                              onChange(e)
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdditionalChargesHeader
