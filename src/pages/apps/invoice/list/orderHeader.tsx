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
import { Autocomplete, CardHeader, IconButton, Modal } from '@mui/material'
import Customergroupform from 'src/pages/product/order/OrderForm'

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark' || selectedMode === 'systemMode') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  }
  return 'white'
}
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const ReusableModal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          width: "100%",
          height:"100vh",
          bgcolor: 'background.paper',
          // borderRadius: '8px',
          WebkitBoxShadow
          :
          '0 0 10px #222'
        ,
        boxShadow
          :
          '0 0 10px #222'
        ,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 25,
            left: 10,
            padding: '5px !important',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display:'flex',
            alignItems:'center',
            gap:"5px"
          }}
        >
              
          {/* <img src="/images/icons/project-icons/cross.svg" alt="Close" width={20} height={20} /> */}
        </button> 
        {children}
      </Box>
    </Modal>
  );
};
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
  productName: string
}

const CustomergroupHeader = ({
  activeStatus,
  setActiveStatus,
  showMessage,
  setShowMessage,
  setAllCountryName,
  onFetchData,
  printData,
  productName,
  setProductName,
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
      productName: '',
    }
  })
  const [isCreateJobsModalOpen, setCreateJobsModalOpen] = React.useState(false);
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
  const toggleCreateJobsModal = () => {    
    setCreateJobsModalOpen(!isCreateJobsModalOpen);
    
  };
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

            <div style={{ color: getColor(), padding: '10px', fontSize: '16px'}}>Order</div>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Alt+N'>
              <Button
                type='submit'
                variant='contained'
                onClick={toggleCreateJobsModal}
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
            <ReusableModal open={isCreateJobsModalOpen} onClose={toggleCreateJobsModal} >
              <Customergroupform
                onClose={toggleCreateJobsModal}
                onFetchData={onFetchData}
                customergroupname={customergroupname}
              />
            </ReusableModal>
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
              <Grid  className='empTextField'>
                <div>
                  <Controller
                    name='productName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={productName}
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor()
                                }}
                              >
                                Product Name
                              </span>
                            </div>
                          }
                          onChange={e => {
                             let inputValue = e.target.value;
                             inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                             if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue != '') {
                              setProductName(inputValue);
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

export default CustomergroupHeader
