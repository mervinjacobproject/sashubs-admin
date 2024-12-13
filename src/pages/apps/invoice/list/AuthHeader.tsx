// ** Next Import

// ** MUI Imports
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { IconButton, Typography } from '@mui/material'
import AdditionalChargeform from 'src/pages/pricing/additional-charges/AdditionalChargeform'

import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { toast } from 'react-hot-toast'
import RightDrawerCategory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import AddRole from 'src/pages/settings/Auth/addRole'
import AuthForm from 'src/pages/settings/Auth/authform'


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


const AuthHeader = (props: any) => {
  // ** Props
  const {
    value,
    selectedRows,
    handleFilter,
    editId,
    printData,
    handleInActiveButton,
    handleActiveButton,
    handleAllButton,
    bulkDelete,
    toEmail,
    setToEmail,
    handleSendFile,
    fetchData
  } = props

  const [modalOpenDelete, setModalOpenDelete] = useState<any>(false)
  const [modalOpenNotification, setModalOpenNotification] = useState(false)
  const [activeStatus, setActiveStatus] = useState('all')
  const [showMessage, setShowMessage] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [modalOpen, setModalOpen] = useState(false);

  const handleSendConfirm = async () => {
    if (!toEmail) {
      // Email is empty, display error message
      setIsValidEmail(false)
      return
    }

    if (isValidEmail) {
      try {
        await handleSendFile()
      } catch (error) {
        toast.error('Error sending mail')
      } finally {

        setToEmail('')
      }
    }
  }

  const handleEmail = (e: any) => {
    const email = e.target.value
    setToEmail(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@,]+$/
    setIsValidEmail(emailRegex.test(email))
  }


  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)




  const isShowAll = activeStatus === 'all'
  const isShowInactive = activeStatus === 'inactive'
  const isShowActive = activeStatus === 'active'

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleModalOpenNotification = () => setModalOpenNotification(true)
  const handleModalCloseNotification = () => setModalOpenNotification(false)

  const handleDeleteClick = () => {
    if (selectedRows.length >= 2) {
      handleModalOpenDelete()
    } else {
      setModalOpenNotification(true)
    }
  }

  const handleDeleteConfirm = () => {
    bulkDelete()
    setModalOpenDelete(false)
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const resetEditid = () => {
    props.resetEditid()
  }

  const handleOpenDrawer = () => {
    // console.log('Drawer opened!')
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
          <Grid sx={{ display: 'flex', alignItems: 'start',gap:"15px" }}>
            <CustomModal
              open={modalOpenDelete}
              onClose={handleModalCloseDelete}
              onOpen={handleModalOpenDelete}
              buttonOpenText=''
              buttonText=''
            >
              <Typography sx={{color: getColor()}}>Are you sure you want to delete?</Typography>

              <div
                className='delete-popup'
                style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
              >
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
                  Delete
                </Button>

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
              </div>
            </CustomModal>

            <CustomModal
              open={modalOpenNotification}
              onClose={handleModalCloseNotification}
              onOpen={handleModalOpenNotification}
              buttonOpenText=''
              buttonText=''
            >
              <p>Please select at least two checkboxes for bulk delete.</p>
              <Button
                variant='contained'
                sx={{
                  '&:hover': {
                    background: '#776cff',
                    color: 'white'
                  }
                }}
                onClick={handleModalCloseNotification}
              >
                OK
              </Button>
            </CustomModal>

            <CustomModal
              open={modalOpen}
              onClose={handleModalClose}
              onOpen={handleModalOpen}
              buttonOpenText="Add new"
              buttonText=''
            >
                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Typography style={{ color: getColor() }}>[esc]</Typography>

              <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleModalClose}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
           <AddRole fetchData={fetchData} onClose={handleModalClose}/>
            </CustomModal>

            <div>
              <IconButton onClick={handleIconButtonClick}>
                <Icon icon='mingcute:filter-line' />
              </IconButton>
            </div>

            <Button
              variant='contained'
              sx={{
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                }
              }}
              onClick={handleModalOpen}
            >
              Add User Role
            </Button>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='Role'>
              <AuthForm />
            </DrawerComponent>
          </Grid>
        </Box>
      </Box>

      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                marginTop: '0px',
                marginLeft: '20px'
              }}
            >
              <label style={{ marginRight: '10px' }}>Status</label>

              <Select sx={{ height: '40px', marginRight: '10px' }} value={activeStatus} onChange={handleStatusChange}>
                <MenuItem value='all'>Show All</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </Select>

              {isShowAll && (
                <Button
                  onClick={handleAllButton}
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  variant='contained'
                >
                  Search
                </Button>
              )}
              {isShowActive && (
                <Button
                  onClick={handleActiveButton}
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  variant='contained'
                >
                  Search
                </Button>
              )}

              {isShowInactive && (
                <Button
                  onClick={handleInActiveButton}
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  variant='contained'
                >
                  Search
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthHeader
