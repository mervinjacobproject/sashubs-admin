// ** Next Import

import React, { useState } from 'react'
import { toast } from 'react-hot-toast';

import { GridRowId } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import Jobsteperform from 'src/pages/transactions/invoice/jobsteperform'
import Icon from 'src/@core/components/icon'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { Box, Grid, Accordion, AccordionSummary, Button, IconButton, Tooltip, AccordionDetails, Typography, Autocomplete } from '@mui/material'
import JobsteperformJob from 'src/pages/transactions/job/jobsteperform';
import { Controller, useForm } from 'react-hook-form';
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker';

interface TableHeaderProps {
  showMessage:any
  setShowMessage:any
  setcustomer:any
  companyName:any
  setCreatedDate:any
  setdropLocation:any
  setPickupDate:any
  dropLocation:any
  fetchData:any
}



interface FormData {
  name: string
 
  createddate:any
  pickupdate:any
  location:any
}

// type Anchor = 'top' | 'left' | 'bottom' | 'right';
const JobInvoicedHeader = (props: TableHeaderProps) => {
  // ** Props
  const {  showMessage,
    setShowMessage,
    companyName,
    setCreatedDate,
    setdropLocation,
    setcustomer,
    dropLocation,
    setPickupDate,
    fetchData
    } = props
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedDOB, setSelectedDOB] = useState(null)
  const [modalOpenSend, setModalOpenSend] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  // handleCompleteEmail={handleCompleteEmail}
  // handleCompleteFile={handleCompleteFile}
  // tocompleteEmail={tocompleteEmail}

  const handleModalSendOpen: any = () => setModalOpenSend(true)
  const handleModalCloseSend = () =>{
    setModalOpenSend(false)
    setIsValidEmail(true);
  } 
  
  const handleSendClick = () => {
    handleModalSendOpen(true);
  }

 
  const formatedDate = (dateString: any) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    return formattedDate
  }

  const {
    control,
    watch,
    formState:{ errors: accountErrors }
  } = useForm<FormData>({})

 



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

  const handleOpenDrawer = () => {

    setShowMessage(false)

   
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleopendelModal = () => {
    setModalOpenDelete(true);
  }
  return (

    <>


      <Box
        sx={{
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
     

        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <Grid sx={{ display: 'flex' }}>
        
 
 <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

         


            

          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
             
              <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New'>
                <JobsteperformJob />
              </DrawerComponent>



            </Box>

          </Grid>
        </Box>

      </Box >


      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '10px',
          
              }}
            >
             <Grid sx={{ mb: 6 }}>
                <label
                  style={{
                    color: getColor(),
                    fontSize: '14px'
                  }}
                >
                  Customer
                </label>
                <br></br>
              <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={companyName}
                          getOptionLabel={(option: any) => option.CompanyName}
                          value={companyName?.find((pricevalue: any) => pricevalue?.CId === watch('name')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.CId || null)
                            setcustomer(newValue?.CId)
                          }}
                          isOptionEqualToValue={(option, value) => option?.CId === value?.CId}
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
                <Grid item xs={6} sm={6}>
                <div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '400',
                      marginBottom: '4px',
                      color: getColor()
                    }}
                  >
                 Created Date
                  </span>
                  
                </div>
                <div>
                  <Controller
                    name='createddate'
                    control={control}
                    rules={{
                      required: true,
                      validate: {
                        validDate: value => !isNaN(Date.parse(value)) || 'Invalid input. Please enter a valid date.'
                      }
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                          <Datepickers
                            inputClass='custom-input'
                            id='dob'
                            name='dob'
                            value={selectedDOB || formatedDate(selectedDOB)}
                            onChange={e => {
                              const formattedDate = e ? e.format('YYYY-MM-DD') : null;
                              field.onChange(formattedDate);
                              setCreatedDate(formattedDate);
                            }}
                            
                            placeholder='Select a date'
                            error={!!accountErrors.createddate}
                            touched={!!accountErrors.createddate}
                            style={{
                              color: getColor()
                            }}
                          />
                        
                        </div>
                      )
                    }}
                  />
                  <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
                    <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
                  </div>
                </div>
              </Grid>

              <Grid item xs={6} sm={6}>
                <div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '400',
                      marginBottom: '4px',
                      color: getColor()
                    }}
                  >
                   Pickup Date
                  </span>
                  
                </div>
                <div>
                  <Controller
                    name='pickupdate'
                    control={control}
                    rules={{
                      required: true,
                      validate: {
                        validDate: value => !isNaN(Date.parse(value)) || 'Invalid input. Please enter a valid date.'
                      }
                    }}
                    render={({ field }) => {
                      return (
                        <div>
                          <Datepickers
                            inputClass='custom-input'
                            id='dob'
                            name='dob'
                            value={selectedDOB || formatedDate(selectedDOB)}
                            onChange={e => {
                              const formattedDate = e ? e.format('YYYY-MM-DD') : null;
                              field.onChange(formattedDate);
                              setPickupDate(formattedDate);
                            }}
                            
                            placeholder='Select a date'
                            error={!!accountErrors.pickupdate}
                            touched={!!accountErrors.pickupdate}
                            style={{
                              color: getColor()
                            }}
                          />
                        
                        </div>
                      )
                    }}
                  />
                  <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
                    <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div>
                  <Controller
                    name='location'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={dropLocation}
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor(),
                                  fontSize: '14px'
                                }}
                              >
                                Location
                              </span>
                            </div>
                          }
                          placeholder='Location'
                          onChange={e => {
                            const inputValue = e.target.value
                            if (/^[A-Za-z0-9]*\.?[A-Za-z0-9]*$/.test(inputValue) || inputValue === '') {
                              setdropLocation(inputValue)
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



export default JobInvoicedHeader
