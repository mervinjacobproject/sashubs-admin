import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-hot-toast';
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import PodForm from 'src/pages/settings/POD/podAddform'


const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit';
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit' 
  } else {
    return '#fff'
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




const PodTableHeader = ({ value, setToEmail, toEmail, selectedRows,setSelectedRows, handleSendFile, handleAllButton, handleFilter, printData, handleActiveButton, handleInActiveButton, onFetchData, bulkDelete }: any) => {
  const [isCreateJobsModalOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDelete, setModalOpenDelete] = useState(false);
  const [modalOpenSend, setModalOpenSend] = useState(false);

  const [modalOpenNotification, setModalOpenNotification] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [activeStatus, setActiveStatus] = useState('all');
  const [isValidEmail, setIsValidEmail] = useState(true);


  const isShowAll = activeStatus === 'all';
  const isShowInactive = activeStatus === 'inactive';
  const isShowActive = activeStatus === 'active';

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value);
  };





  const handleIconButtonClick = () => {
    setShowMessage(!showMessage);
  };



  const handleDeleteClick = () => {


    if (selectedRows.length >= 2) {
      handleModalOpenDelete(true);
    } else {
      setModalOpenNotification(true);

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

  const handleSendClick = () => {
    handleModalSendOpen(true);
  }

  const handleSendConfirm = async () => {
    if (!toEmail) {
      // Email is empty, display error message
      setIsValidEmail(false);
      return;
    }
  
    if (isValidEmail) {
      try {
        await handleSendFile();
      } catch (error) {
        toast.error('Error sending mail');
      } finally {
        setModalOpenSend(false);
        setToEmail('');
      }
    }
  };
  const handleEmail = (e: any) => {
    const email = e.target.value;
    setToEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@,]+$/;
    setIsValidEmail(emailRegex.test(email));
  }




  const handleCancelSend = () => {
    setModalOpenSend(false)
    setIsValidEmail(true);
    setToEmail('');
  }


  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleModalOpenDelete: any = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)


  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () =>{
    setModalOpenSend(false)
    setIsValidEmail(true);
  } 

  const handleModalOpenNotification: any = () => setModalOpenNotification(true)
  const handleModalCloseNotification = () => setModalOpenNotification(false)

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
    const handleKeyPress = (event:any) => {
      // Check if the pressed keys are Alt + N
      if (event.altKey && (event.key === 'n' || event.key === 'N')) {
        // Trigger the same action as clicking the button
        handleAddNewClick();
      }

    };

    // Add event listener for key presses
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
          justifyContent: 'space-between',
        }}
      >


        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: "space-between", width: "100%", }}>

          <Grid sx={{ display: 'flex', alignItems: "start", }} >


            <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>


              </div>
            </Tooltip>
            <Tooltip title='Print'>
              <div
              >
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip>

          </Grid>


          <Grid sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title=' Alt+N'>

              <Button
                type="submit"
                variant="contained"
                onClick={handleAddNewClick}
                sx={{
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: 'center',
                  width: "100px",
                  padding: "5px !important",
                  height: '40px',
                  fontSize: '15px',
                  whiteSpace: "nowrap",

                  '&:hover': {
                    background: '#776cff',
                    color: 'white'
                  }
                }}
              >
                <Icon

                  icon="ic:twotone-add"
                  width={20}
                  height={20}
                />

                Add New</Button>
            </Tooltip>


            <CustomModal
              open={modalOpen}
              onClose={handleModalClose}
              onOpen={handleModalOpen}
              buttonOpenText="Add new"
              buttonText=''
            >
              <div style={{ float: "right" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography style={{ color: getColor(), margin: "0px !important" }}>[esc]</Typography>
                  {/* <img onClick={handleModalClose} src="/images/icons/project-icons/cross.svg" alt="Close" width={20} height={20} /> */}
                  <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleModalClose}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
                </div></div>
              <PodForm onClose={handleModalClose} onFetchData={onFetchData} />

            </CustomModal>
          </Grid>
        </Box>
      </Box>
      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className="message-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '0px', marginLeft: '20px' }}>
              <label style={{ marginRight: '10px' }}>Status</label>

              <Select sx={{ height: '40px', marginRight: '10px' }} value={activeStatus} onChange={handleStatusChange}>
                <MenuItem value="all">Show All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>



              {isShowAll && (
                <Button onClick={handleAllButton} sx={{


                  '&:hover': {
                    background: '#776cff',
                    color: 'white',
                  },
                }} variant="contained" >
                  Search
                </Button>
              )}
              {isShowActive && (
                <Button onClick={handleActiveButton} sx={{


                  '&:hover': {
                    background: '#776cff',
                    color: 'white',
                  },
                }} variant="contained" >
                  Search
                </Button>
              )}

              {isShowInactive && (
                <Button onClick={handleInActiveButton} sx={{


                  '&:hover': {
                    background: '#776cff',
                    color: 'white',
                  },
                }} variant="contained" >
                  Search
                </Button>
              )}





            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodTableHeader
