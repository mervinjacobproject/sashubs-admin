import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Controller, useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import { Autocomplete, CardHeader, IconButton } from '@mui/material'
import Customergroupform from 'src/pages/product/sub-category/Customerform'

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark' || selectedMode === 'systemMode') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  }
  return 'white'
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

interface FormData {
  OwnerName: string
  ShopName: string
  DoorNo: string
  GST: string
  Street: string
  Area: string
  City: string
  State: string
  Country: string
  PostalCode: string
  PhoneNo: string
  EmailID: string
  SellerType: string
  BCategory: string
  BSubCategory: string
  Lat: string
  Lang: string
  CashbackPoints: string
  isSetCoupon: boolean
  PurchaseAmount: string
  caccept: boolean
  SubExpiryDate: string
}

const CustomergroupHeader = ({
  activeStatus,
  setActiveStatus,
  showMessage,
  setShowMessage,
  setAllCountryName,
  onFetchData,
  printData,
  allCountry,
  customergroupname
}: any) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { control, watch, formState } = useForm<FormData>({
    defaultValues: {
      OwnerName: '',
      ShopName: '',
      DoorNo: '',
      GST: '',
      Street: '',
      Area: '',
      City: '',
      State: '',
      Country: '',
      PostalCode: '',
      PhoneNo: '',
      EmailID: '',
      SellerType: '',
      BCategory: '',
      BSubCategory: '',
      Lat: '',
      Lang: '',
      CashbackPoints: '',
      isSetCoupon: false,
      PurchaseAmount: '',
      caccept: false,
      SubExpiryDate: '',
    }
  })

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleAddNewClick = () => {
    handleModalOpen()
    setShowMessage(false)
  }

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark' || selectedMode === 'systemMode') {
      return 'rgba(208, 212, 241, 0.68)'
    } else if (selectedMode === 'light') {
      return 'black'
    }
    return 'black'
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
  }, [handleAddNewClick])

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

            <div style={{ color: getColor(), padding: '10px', fontSize: '16px'}}>SubCategory</div>

            {/* <Tooltip title='Print'>
              <div>
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip> */}
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Alt+N'>
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
              <Customergroupform
                onClose={handleModalClose}
                onFetchData={onFetchData}
                customergroupname={customergroupname}
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
                  GroupName
                </label>
                <br />
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='Country'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={allCountry}
                        getOptionLabel={(option: any) => option.GroupName || ''}
                        value={allCountry?.find((pricevalue: any) => pricevalue?.ID === watch('Country')) || null}
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

export default CustomergroupHeader
