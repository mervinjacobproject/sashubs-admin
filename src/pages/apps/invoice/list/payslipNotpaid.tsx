import React, { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import {
  Box,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Autocomplete,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'

type TableHeaderProps = {
  setSelectedRows:any
  stateValue:any
  setAllEmpName:any
  setAllDate:any
}

const PaySlipNotpaidHeader: React.FC<TableHeaderProps> = ({
  setSelectedRows,
  stateValue,
  setAllEmpName,
  setAllDate
}) => {
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [selectedDOB] = useState(null)

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
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
    control: accountControl,
    formState: { errors },
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
            width: '100%',
            padding: '5px'
          }}
        >
          <Grid sx={{ display: 'flex' }}>
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
            <CustomModal
              open={modalOpenDelete}
              onClose={() => setModalOpenDelete(false)}
              onOpen={() => setModalOpenDelete(true)}
              buttonOpenText=''
              buttonText=''
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
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  // onClick={handleDeleteClick}
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
                  onClick={() => {
                    setModalOpenDelete(false)
                    setSelectedRows([])
                  }}
                >
                  Cancel
                </Button>
              </div>
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
                    Date
                  </span>
                </div>
                <div>
                  <Controller
                    name='dob'
                    control={accountControl}
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
                              const formattedDate = e ? e.format('YYYY-MM-DD') : null
                              field.onChange(formattedDate)
                              setAllDate(formattedDate)
                            } }
                            placeholder='Select a date'
                            style={{
                              color: getColor()
                            }} error={undefined} touched={undefined}                         
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

              <Grid>
                <label style={{ marginRight: '10px', marginTop: '15px', marginLeft: '9px' }}>Employee</label>
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
                          getOptionLabel={(option: any) => option.FirstName + ' ' + option.LastName || ''}
                          value={stateValue?.find((pricevalue: any) => pricevalue?.DID === watch('country')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.DID || null)
                            setAllEmpName(newValue?.DID)
                          }}
                          isOptionEqualToValue={(option, value) => option?.DID === value?.DID}
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

export default PaySlipNotpaidHeader
