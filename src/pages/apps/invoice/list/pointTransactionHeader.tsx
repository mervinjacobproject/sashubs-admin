import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

import { Autocomplete, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import StateForm from 'src/pages/common/state/stateForm'
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import PointTransactionForm from 'src/pages/customer/point-Transaction/pointTransactionform'
import MerchantGroup from './Merchantgroupheader'
import CustomerGroupName from './CustomerGroup'
import { IconButtonProps } from '@mui/material/IconButton'

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit'
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit'
  } else {
    return '#fff'
  }
}


const color = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#fff'
  } else if (selectedMode === 'light') {
    return '#222'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#fff'
  } else {
    return '#222'
  }
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: color(),
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


const DateTextField = styled(TextField)({
  // Add your custom styles here if needed
  margin: '0 10px',
  width: '100%',
})

const PointTransactionHeader = ({
  fetchData,
  Customer,
  setCustomer,
  merchantName,
  setMerchantName,
  transType,
  setTransType,
  activeStatus,
  setActiveStatus,
  setFromDate,
  setToDate,
  toDate,
  fromDate,
  applyFilters,
  resetFilters,
  customer,
  editId,
  allMerchant,
}: any) => {
  const [isCreateJobsModalOpen] = React.useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [selectedgroupName, setSelectedgroupName] = useState({ CustomerName: '', id: '' })
  const [openPopupcustomerGroup, setOpenPopupEmployeeGroup] = useState(false)
  const [getEmployeeGroup, setGetEmployeeGroup] = useState<any>([])
  const [groupNameSearch, setgroupNameSearch] = useState('')
  const [fetchedgroupName, setFetchedgroupName] = useState('')
  const [selectedgroupName1, setSelectedgroupName1] = useState({ OwnerName: '', id: '' })
  const [openPopupcustomerGroup1, setOpenPopupEmployeeGroup1] = useState(false)
  const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
  const [groupNameSearch1, setgroupNameSearch1] = useState('')
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')


  //const [fromDate, setFromDate] = useState(''); // State for From Date
  //const [toDate, setToDate] = useState(''); // State for To Date
  //const [activeStatus, setActiveStatus] = useState('all'); // Example state for active status

  const modalDesign = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return '#cacaca'
    } else if (selectedMode === 'light') {
      return '#f2f2f7'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return '#cacaca'
    } else {
      return '#f2f2f7'
    }
  }


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

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleAddNewClick = () => {
    handleModalOpen()
  }

  const defaultAccountValues:any = {
    country: '',
  }

  const {
    control,
    watch,
    reset,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)


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
  const handleStatusChange = (event: any) => {
    setTransType(event.target.value)
    //console.log('activeStatus', activeStatus)
  }
  // const handleStatusChange = (event: any) => {
  //   setActiveStatus(event.target.value)
  //   console.log('activeStatus', activeStatus)
  // }
  const handleChange = (event: any) => {
    setFromDate(event.target.value)
  }
  // console.log('fromDate', fromDate)



  const handledateChange = (event: any) => {
    setToDate(event.target.value)
  }

  const handleEmployeeGroupClose1 = () => {
    setOpenPopupEmployeeGroup1(false)
  }
  const clearSelectedgroupname1 = () => {
    setSelectedgroupName1({ OwnerName: '', id: '' })
    setFetchedgroupName1('')
  }
  const handlegroupnameclick1 = () => {
setMerchantName('')
  clearSelectedgroupname1()
  }
  const handleOpengroupName1 = () => {
    setOpenPopupEmployeeGroup1(true)
  }
  const fetchEmployeeGroup1 = async () => {
    try

    {
    let filterString = ''
    if (groupNameSearch1) {
      filterString += `GroupName: {contains: "${groupNameSearch1}"}`
    }
  const res = await ApiClient.post(`/getmerchant?OwnerName=${groupNameSearch1}`);
  //console.log("resssss",res.data.data)

        setGetEmployeeGroup1(res.data.data)
  }
    catch (err) {
        console.error(err)
      }
  }
  const handleOpengroupName = () => {
    setOpenPopupEmployeeGroup(true)
  }

  const fetchEmployeeGroup = async () => {
    try

    {
    let filterString = ''
    if (groupNameSearch) {
      filterString += `GroupName: {contains: "${groupNameSearch}"}`
    }
  const res = await ApiClient.post(`/getcustomer?Customer=${groupNameSearch}`);

        setGetEmployeeGroup(res.data.data)
  }
    catch (err) {
        console.error(err)
      }
  }

  useEffect(() => {
   // console.log("selectedgroupName1",selectedgroupName1)
    // if(groupNameSearch)
    // {
    fetchEmployeeGroup()
    fetchEmployeeGroup1()
   // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNameSearch,groupNameSearch1])

  const handleEmployeeGroupClose = () => {
    setOpenPopupEmployeeGroup(false)
  }
  const clearSelectedgroupname = () => {
    setSelectedgroupName({ CustomerName: '', id: '' })
    setFetchedgroupName('')
  }
  const handlegroupnameclick = () => {
    setCustomer('')
    clearSelectedgroupname()
  }

  //console.log('Todate', toDate)
  const resetAll = () => {
    // Reset the form fields to their default values
    reset(); // Reset the form
    resetFilters(); // Reset the filters
    setMerchantName(''); // Reset merchant name state
    setCustomer(''); // Reset product name state
    setToDate(''); // Reset customer state
    setFromDate('');
    selectedgroupName1.OwnerName = '';
    selectedgroupName.CustomerName = '';
    handlegroupnameclick1();
    handlegroupnameclick();
     // Reset customer state
    // Add any other reset logic necessary for your state or variables
  };

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
            <Grid sx={{ display: 'flex', alignItems: 'start' }}>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Grid>

            <div>
              <h3 style={{  marginTop: '8px' }}>Point Transaction</h3>
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
              <PointTransactionForm
                onClose={handleModalClose}
                onFetchData={fetchData}
                editId={editId}
                customer={customer}
               // allMerchant={allMerchant}
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

               <Grid item xs={4} sm={4} sx={{ marginTop: !selectedgroupName1.id || !fetchedgroupName1 ? '' : '' }}>
              {/* <span
                style={{
                  color: getColor(),
                  fontSize: '14px'
                }}
              >
                Merchant Name
              </span>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography> */}

                <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',

                }}
              >
                {selectedgroupName1.OwnerName !== '' || fetchedgroupName1 != '' ? (
                  <Typography sx={{ width: '100%' }} onClick={handleOpengroupName1}>
                    {selectedgroupName1.OwnerName !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginTop: '-60px',
                          width:'220px'
                        }}
                      >
                        <Typography sx={{ color: '#222' }}>{selectedgroupName1.OwnerName}</Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'

                        }}
                      >
                        <Typography sx={{ color: '#222' }}>
                          {
                            getEmployeeGroup1
                              ?.sort((a: any, b: any) => a.OwnerName.localeCompare(b.OwnerName))
                              .map((item: any) => {
                                 if (Number(item.id) == Number(fetchedgroupName1 )) {
                                  return item.OwnerName
                                 }
                                return null
                              })
                              .filter((OwnerName: any) => OwnerName !== null)[0]
                          }
                        </Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    )}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: '#776cff', fontWeight: 600, width: '150px',height:'40px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', borderRadius: '5px',marginTop: '-80px', justifyContent: 'center' }}
                    onClick={handleOpengroupName1}
                  >
                    Select a Merchant
                  </Typography>
                )}
                {(selectedgroupName1.id || fetchedgroupName1) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer', marginTop: '-80px', marginLeft: '-50px', width:'40px', height:'35px', color: 'red', fontWeight:'600' }}
                    onClick={handlegroupnameclick1}
                  />
                )}
              </Box>

            </Grid>
               <Grid item xs={3} sm={3} sx={{ marginTop: !selectedgroupName.id || !fetchedgroupName ?'' : ''   }}>
              {/* <span
                style={{
                  color: getColor(),
                  fontSize: '14px',


                }}
              >
                Customer Name
              </span> */}
              {/* <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography> */}

                <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                {selectedgroupName.CustomerName !== '' || fetchedgroupName != '' ? (
                  <Typography sx={{ width: '100%' }} onClick={handleOpengroupName}>
                    {selectedgroupName.CustomerName !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer',
                           marginTop:'-60px',
                          width: '160px',
                          marginLeft:'0px'
                        }}
                      >
                        <Typography sx={{ color: '#222' }}>{selectedgroupName.CustomerName}</Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'

                        }}
                      >
                        <Typography sx={{ color: '#222' }}>
                          {
                            getEmployeeGroup
                              ?.sort((a: any, b: any) => a.CustomerName.localeCompare(b.CustomerName))
                              .map((item: any) => {
                                 if (Number(item.Id) === Number(fetchedgroupName )) {
                                  return item.CustomerName
                                 }
                                return null
                              })
                              .filter((CustomerName: any) => CustomerName !== null)[0]
                          }
                        </Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    )}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: '#776cff', fontWeight: 600, width: '160px',height:'40px', cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', borderRadius: '5px', marginTop:'-80px', marginLeft:'-10px' }}
                    onClick={handleOpengroupName}
                  >
                    Select a Customer
                  </Typography>
                )}
               {(selectedgroupName.id || fetchedgroupName) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer', marginTop: '-80px', marginRight: '-10px', width:'40px', height:'45px', color: 'red', fontWeight:'600' }}
                    onClick={handlegroupnameclick}
                  />
                )}
              </Box>

            </Grid>

              <Grid className='empTextField' style={{marginBottom:'20px'}}>
                <Controller
                  name='fromDate'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateTextField
                      type='date'
                      value={fromDate}

                      label={<span style={{ color: getColor() }}>From Date</span>}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: { height: '38px' }, // Adjust the height as needed
                      }}
                      onChange={handleChange}
                    />
                  )}
                />
              </Grid>

              <Grid className='empTextField' style={{marginBottom:'20px'}}>
                <Controller
                  name='toDate'
                  control={control}
                  render={({ field: { onChange } }) => (
                    <DateTextField
                      type='date'
                      value={toDate}
                      label={<span style={{ color: getColor() }}>To Date</span>}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: { height: '38px' }, // Adjust the height as needed
                      }}
                      //setToDate={setToDate}
                      onChange={handledateChange}
                    />
                  )}
                />
              </Grid>

              <Grid className='empTextField' style={{marginBottom:'20px'}}>
              <div>
      <label style={{ color: getColor(), fontSize: '12px', marginLeft: '10px' }}>
        Transaction Type
      </label>
      <Controller
        name="transType"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <FormControl fullWidth variant="outlined">

          <Select
            labelId="transType-label"
            sx={{ height: '38px', marginLeft:'10px', width: '160px' }}
            value={value || 'all'}
            onChange={handleStatusChange}
            //label="Transaction Type" // This is necessary for accessibility
          >
            <MenuItem value='all'>Show All</MenuItem>
            <MenuItem value='0'>Point</MenuItem>
            <MenuItem value='1'>Coupon</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  </div>
</Grid>


            </div>
            <Box sx={{ display: 'flex', alignItems: 'end', marginLeft: '-10px', marginTop: '-5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        onClick={() => applyFilters(merchantName, transType, customer, fromDate, toDate)}
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
          <CustomModal
          open={openPopupcustomerGroup}
          onClose={() => {
            handleEmployeeGroupClose()
            setgroupNameSearch('')
          }}
          onOpen={handleOpengroupName}
          buttonText=''
          buttonOpenText=''
          height={500}
        >
          <CustomCloseButton id='rightDrawerClose' color='inherit'  onClick={handleEmployeeGroupClose}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <CustomerGroupName
            getEmployeeGroup={getEmployeeGroup}
            setSelectedgroupName={setSelectedgroupName}
            handleEmployeeGroupClose={handleEmployeeGroupClose}
            fetchEmployeeGroup={fetchEmployeeGroup}
            setgroupNameSearch={setgroupNameSearch}
            onFetchData={fetchData}
            groupNameSearch={groupNameSearch}
            setCustomer={setCustomer}
          />
        </CustomModal>
        <CustomModal
          open={openPopupcustomerGroup1}
          onClose={() => {
            handleEmployeeGroupClose1()
            setgroupNameSearch1('')
          }}
          onOpen={handleOpengroupName1}
          buttonText=''
          buttonOpenText=''
          height={500}
        >
          <CustomCloseButton id='rightDrawerClose'  color='inherit' onClick={handleEmployeeGroupClose1}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <MerchantGroup
            getEmployeeGroup={getEmployeeGroup1}
            setSelectedgroupName={setSelectedgroupName1}
            handleEmployeeGroupClose={handleEmployeeGroupClose1}
            fetchEmployeeGroup={fetchEmployeeGroup1}
            onFetchData={fetchData}
            setgroupNameSearch={setgroupNameSearch1}
            groupNameSearch={groupNameSearch1}
            setMerchantName={setMerchantName}
          />
        </CustomModal>
        </div>
      )}
    </>
  )
}

export default PointTransactionHeader
