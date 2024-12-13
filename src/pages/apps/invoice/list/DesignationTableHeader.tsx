import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import EmployeeDesignationForm from 'src/pages/apps/employee/employee-designation/employeeDesignationform'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import { Controller, useForm } from 'react-hook-form'

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

const DesignationTableHeader = ({
  printData,
  onFetchData,
  setAllCountryName,
  stateValue,
  activeStatus,
  setActiveStatus,
  setShowMessage,
  showMessage,
  rideData
}: any) => {
  const [isCreateJobsModalOpen] = React.useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleAddNewClick = () => {
    handleModalOpen()
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }
  const handleModalOpen = () => {
    setModalOpen(true)
    setShowMessage(false)
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

  const defaultAccountValues: any = {
    country: ''
  }

  const {
    control,
    watch,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues
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
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

            <Tooltip title='Print'>
              <div>
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip>
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
              <EmployeeDesignationForm onClose={handleModalClose} onFetchData={onFetchData} rideData={rideData}/>
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
                gap: '20px'
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
                    height: '2px'
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
              <Grid sx={{ mb: 6 }}>
                <label
                  style={{
                    color: getColor()
                  }}
                >
                  Designation
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
                          options={stateValue}
                          getOptionLabel={(option: any) => option.Designation || ''}
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
              </Grid>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default DesignationTableHeader
