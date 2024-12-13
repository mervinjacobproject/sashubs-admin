import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import Icon from 'src/@core/components/icon'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { Box, Grid, Button, Tooltip, IconButton, Autocomplete } from '@mui/material'
import JobsteperformJob from 'src/pages/transactions/job/jobsteperform'
import { useRouter } from 'next/router'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Controller, useForm } from 'react-hook-form'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker'
import AppSink from 'src/commonExports/AppSink'

interface TableHeaderProps {
  selectedRows: any
  setcustomer: any
  showMessage: any
  setShowMessage: any
  setPickupDate: any
  setdropLocation: any
  dropLocation: any
  setCreatedDate: any
  companyName: any
  modalOpenRestore: any
  setModalOpenRestore: any
  handleCreateInvoice: any
  customerlist: any
  fetchData:any
}

interface FormData {
  name: string
  createddate: any
  pickupdate: any
  location: any
}

const JobHeader = (props: TableHeaderProps) => {
  const {
    selectedRows,
    setcustomer,
    showMessage,
    setShowMessage,
    setPickupDate,
    setdropLocation,
    dropLocation,
    setCreatedDate,
    companyName,
    modalOpenRestore,
    setModalOpenRestore,
    handleCreateInvoice,
    customerlist,
    fetchData
  } = props
  const router = useRouter()
  // const [isInitiallyOpen, setIsInitiallyOpen] = useState(false)
  const [selectedDOB] = useState(null)
  const [customerdetails, setCustomerdetails] = useState('')

  const {
    control,
    watch,
    formState: { errors: accountErrors }
  } = useForm<FormData>({})

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

  const handleRestoreClick = () => {
    selectedRows.forEach((rowId: any) => {
      const selectedJobId = rowId.toString()
      const idParam = 'create'
      const pathname = idParam === 'create' ? '/transactions/createInvoice' : '/transactions/invoice'
      const queryParams = idParam === 'create' ? { id: idParam, invoiceid: selectedJobId } : { id: idParam }

      const graphqlQuery = `query MyQuery {
        listJobsNew5AABS(filter: {ID: {eq: ${selectedJobId}}}) {
          items {
            AdditionChargeId
            AdditionalChargePrice
            AdditionalChargeRate
            AssignTo
            CreatedDate
            CusReference
            Customer
            DateTime
            Description
            DropIng
            DropLat
            DropLocation
            EmpQty1
            EmpTotal
            FinalNetTotal
            ID
            IP
            JobId
            InvoiceType
            JobNotes
            JobStatus
            KM
            ModifiedDate
            NetTotal
            PassUp
            PickupDate
            PickupIng
            PickupLat
            PickupLocation
            PickupTime
            PriceCategory
            Status
            SubTotal
            Tax
            TaxId
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      ApiClient.post(`${AppSink}`, { query: graphqlQuery }, { headers })
        .then(res => {
          getCustomerId(res.data.data.listJobsNew5AABS.items[0]?.Customer)
          router.push({
            pathname,
            query: {
              id: res.data.data.listJobsNew5AABS.items[0]?.Customer,
              invoiceid: selectedRows.join(',')
            }
          })
        })
        .catch(error => {
          console.error('Error while fetching jobs:', error)
        })
    })
  }

  const getCustomerId = async (id: any) => {
    const query = `query MyQuery {
      getCustomer5AAB(CId: ${id}) {
        Address1
        Address2
        CId
        CompanyName
        CompanyPanNo
        ContactPerson
        Country
        CusGroup
        CustomerId
        Date
        Email
        FirstName
        IP
        InsertedBy
        LandLine
        LastName
        Mobile
        Password
        Photo
        PostCode
        State
        Status
        Suburb
        Title
        UpdatedAt
        UpdatedBy
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        setCustomerdetails(res.data.data.getCustomer5AAB)
      })
      .catch(error => {
        console.error('Error while fetching jobs:', error)
      })
  }

  const handleRowId = async () => {
    const query = `query MyQuery {
      listJobsNew5AABS(filter: {ID: {eq: ${selectedRows}}}) {
        items {
          AdditionChargeId
          AdditionalChargePrice
          AdditionalChargeRate
          AssignTo
          CreatedDate
          CusReference
          Customer
          DateTime
          Description
          DropIng
          DropLat
          DropLocation
          EmpQty1
          EmpTotal
          FinalNetTotal
          ID
          IP
          JobId
          InvoiceType
          JobNotes
          JobStatus
          KM
          ModifiedDate
          NetTotal
          PassUp
          PickupDate
          PickupIng
          PickupLat
          PickupLocation
          PickupTime
          PriceCategory
          Status
          SubTotal
          Tax
          TaxId
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    await ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => res.data.data.listJobsNew5AABS.items)
      .catch(error => {
        console.error('Error fetching data:', error)
        return []
      })
  }

  useEffect(() => {
if (selectedRows.length > 0){
    handleRowId()
  }
          // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handleCusId = ()=>{
  //   const query = `query MyQuery {
  //     listCustomer5AABS(filter: {CId: {eq: ${cusId}}}) {
  //       items {
  //         CId
  //         CompanyName
  //       }
  //     }
  //   }`
  //   const headers = {
  //     'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //     'Content-Type': 'application/json'
  //   };
  //    ApiClient.post(`${AppSink}`, { query }, { headers })
  //     .then((res) => res.data.data.listJobsNew5AABS.items)
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       return [];
  //     });
  // };

  const handleInvoice = () => {
    handleCreateInvoice()
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleOpenDrawer = () => {
    router.push({
      pathname: '/transactions/job/',
      query: { id: 'new' }
    })
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
          <Grid sx={{ display: 'flex', gap: '8px' }}>
            <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

            <Button
              onClick={handleInvoice}
              variant='contained'
              sx={{
                backgroundColor: '#776cff',
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                },
                height: '40px',
                width: '150px'
              }}
            >
              Create Invoice
            </Button>

            <CustomModal
              open={modalOpenRestore}
              onClose={() => setModalOpenRestore(false)}
              onOpen={() => setModalOpenRestore(true)}
              buttonOpenText=''
              buttonText=''
            >
              {selectedRows?.length === 0
                ? 'Please select a row Create Invoice.'
                : 'Please confirm you want to take invoice?'}
              <div
                className='delete-popup'
                style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
              >
                {selectedRows?.length > 0 ? (
                  <>
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
                        setModalOpenRestore(false)
                      }}
                    >
                      No
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                      onClick={handleRestoreClick}
                    >
                      Yes
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='contained'
                    sx={{
                      '&:hover': {
                        background: '#776cff',
                        color: 'white'
                      }
                    }}
                    onClick={() => {
                      setModalOpenRestore(false)
                    }}
                  >
                    Close
                  </Button>
                )}
              </div>
            </CustomModal>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <DrawerComponent
                anchor='right'
                onOpen={handleOpenDrawer}
                buttonLabel='Add New'
                // initiallyOpen={isInitiallyOpen}
              >
                <JobsteperformJob fetchData={fetchData} customerdetails={customerdetails} customerlist={customerlist} />
              </DrawerComponent>
            </Box>
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
                              const formattedDate = e ? e.format('YYYY-MM-DD') : null
                              field.onChange(formattedDate)
                              setCreatedDate(formattedDate)
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
                              const formattedDate = e ? e.format('YYYY-MM-DD') : null
                              field.onChange(formattedDate)
                              setPickupDate(formattedDate)
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

export default JobHeader
