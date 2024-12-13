import { useState, useEffect, Fragment } from 'react'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import Typography from '@mui/material/Typography'
import { Avatar, Box, Button } from '@mui/material'
import CustomModal from '../components/ReusableComponents/Modal/modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getMessaging, onMessage } from 'firebase/messaging'
import toast from 'react-hot-toast'
import useFcmToken from 'src/@core/utils/useFcmToken'
import firebaseApp from '../../@core/utils/firebase'
import { getDatabase, ref, push, set, get, child } from 'firebase/database'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomChip from 'src/@core/components/mui/chip'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import { IconButton } from '@mui/material'
import AppSink from 'src/commonExports/AppSink'

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

const sleep = (delay = 0) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

const ShowNotification = () => {
  const [matchedIds, setMatchedIds] = useState<any>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Customer')
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('')
  const [selectedCustomerName, setSelectedCustomerName] = useState('')
  const [selectedFcmtoken, setSelectedFcmtoken] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<any>([])
  const [customerOptions, setCustomerOptions] = useState<any>([])
  const [totalCount, setTotalCount] = useState(0)
  const [active, setActive] = useState(true)
  const loading = open && options.length === 0
  const customLoading = open && customerOptions.length === 0
  const { fcmToken } = useFcmToken()

  const [notification, setNotification] = useState<any>([])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp)
      const unsubscribe = onMessage(messaging, (payload: any) => {
        toast(payload.notification?.body)
      })
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!loading) {
      return undefined
    }

    const fetchEmployee = async () => {
      try {
        const query=`query MyQuery {
          listUsers5AABS(filter: {Status: {eq: true}, UserType: {eq: "0"}}) {
            items {
              Date
              FirstName
              ID
              LastName
              Password
              ProfileImage
              Status
              RoleId
              UserId
              UserName
              UserType
            }
          }
        }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
        await sleep(1000)
        const employeeList: any = response.data.data.listUsers5AABS.items
        setOptions([...employeeList])
      } catch (error) {
        // console.error('Error fetching employee data:', error)
      }
    }
    fetchEmployee()

    return () => {
      active = false
    }
  }, [loading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])
  const handleModalNotification = () => {
    fetchEmployee()
    setSelectedOption('Employee')
    setModalOpenDelete(true)
  }
  const fetchEmployee = async () => {
    try {
      const query=`query MyQuery {
        listUsers5AABS(filter: {Status: {eq: true}, UserType: {eq: "0"}}) {
          items {
            Date
            FirstName
            ID
            LastName
            Password
            ProfileImage
            Status
            RoleId
            UserId
            UserName
            UserType
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      await sleep(1000)
      const employeeList: any = response.data.data.listUsers5AABS.items
      setOptions([...employeeList])
    } catch (error) {
      // console.error('Error fetching employee data:', error)
    }
  }

  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const fetchCustomer = async () => {
    try {
      const query=`query MyQuery {
        listCustomer5AABS(filter: {Status: {eq: true}, Deleted: {ne: true}}) {
          items {
            Address1
            Address2
            CId
            CompanyName
            CompanyPanNo
            ContactPerson
            Country
            CusGroup
            CustomerId
            Deleted
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
            UpdatedAt
            UpdatedBy
            Title
          }
        }
      }`
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      await sleep(1000)
      const customerList: any = response.data.data.listCustomer5AABS.items
      if (active) {
        setCustomerOptions([...customerList])
      }
    } catch (error) {
    //  console.error(error)
    }
  }

  const handleRadioChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = (event.target as HTMLInputElement).value
    setOptions([])
    setCustomerOptions([])
    setSelectedOption(selectedValue)

    try {
      if (selectedValue === 'Employee') {
        await fetchEmployee()
      } else if (selectedValue === 'Customer') {
        await fetchCustomer()
      }
    } catch (error) {
      // console.error('Error fetching data:', error)
    }
  }
  const handleSend = async () => {
    try {
      const database = getDatabase(firebaseApp)
      const notificationsRef = ref(database, 'notification/' + selectedEmployeeId)

      if (selectedOption === 'Employee') {
        const descriptionElement: any = document.getElementById('description')
        const description = descriptionElement ? descriptionElement.value : ''
        const snapshot = await get(notificationsRef)
        const newIndex = snapshot.exists() ? Object.keys(snapshot.val()).length : 0

        const newNotificationRef = child(notificationsRef, newIndex.toString())
        const currentDate = new Date()
        const sentAt = currentDate.toISOString()
        set(newNotificationRef, {
          notification: {
            title: 'Notification Title',
            body: `Employee: ${selectedEmployeeName}, Description: ${description}`
          },
          data: {
            employeeId: selectedEmployeeId,
            employeeName: selectedEmployeeName,
            description: description,
            fcmToken: fcmToken,
            type: selectedOption,
            sentAt: sentAt
          }
        })
        const notificationPayload = {
          to: selectedFcmtoken,
          notification: {
            title: 'Notification Title',
            body: `Customer: ${selectedEmployeeName}, Description: ${description}`
          },
          data: {
            customerId: selectedEmployeeId,
            customerName: selectedEmployeeName,
            description: description,
            sentAt: sentAt
          }
        }
        await fetch('https://fcm.googleapis.com/v1/projects/aab-f47fc/messages:send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload)
        })
      } else {
        // console.error('Invalid selection or no data available')
        return
      }
      toast.success('Notification sent successfully')
      setModalOpenDelete(false)
    } catch (error) {
      toast.error('Error sending notification')
    }
  }

  const handleSendCustomer = async () => {
    try {
      const database = getDatabase(firebaseApp)
      const notificationsRef = ref(database, 'notification/' + selectedCustomerId)

      if (selectedOption === 'Customer') {
        const descriptionElement: any = document.getElementById('description')
        const description = descriptionElement ? descriptionElement.value : ''
        const snapshot = await get(notificationsRef)
        const newIndex = snapshot.exists() ? Object.keys(snapshot.val()).length : 0

        const newNotificationRef = child(notificationsRef, newIndex.toString())
        const currentDate = new Date()
        const sentAt = currentDate.toISOString()
        set(newNotificationRef, {
          notification: {
            title: 'Notification Title',
            body: `Employee: ${selectedCustomerName}, Description: ${description}`
          },
          data: {
            customerId: selectedCustomerId,
            customerName: selectedCustomerName,
            description: description,
            fcmToken: fcmToken,
            type: selectedOption,
            sentAt: sentAt
          }
        })
        const notificationPayload = {
          to: selectedFcmtoken,
          notification: {
            title: 'Notification Title',
            body: `Customer: ${selectedCustomerName}, Description: ${description}`
          },
          data: {
            customerId: selectedCustomerId,
            customerName: selectedCustomerName,
            description: description,
            sentAt: sentAt
          }
        }
        await fetch('https://fcm.googleapis.com/v1/projects/aab-f47fc/messages:send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload)
        })
      }
      toast.success('Notification sent successfully')
      setModalOpenDelete(false)
    } catch (error) {
      toast.error('Error sending notification')
    }
  }

  const formatDate = (datetime: any) => {
    const currentDate: any = new Date()
    const date: any = new Date(datetime)

    const timeDifference = currentDate - date
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return `${seconds} seconds ago`
    } else if (minutes === 1) {
      return '1 minute ago'
    } else if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours === 1) {
      return '1 hour ago'
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else if (date.getDate() === currentDate.getDate() - 1) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return `${date.getDate()} ${date.toLocaleString('default', {
        month: 'short'
      })} ${date.getFullYear()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }
  }

  const renderName = (row: any) => {
    if (row.ProfileImage) {
      return <Avatar alt='Remy' src={row.ProfileImage} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(row.FirstName || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const columns: GridColDef[] = [
    {
    field: 'sno',
    headerName: 'S.No',
    flex: 0.03,
    renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1,
  },
    {
      flex: 0.1,
      field: 'bo',
      headerName: '',
      renderCell: ({ row }: any) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gridTemplateColumns: '1fr 1fr',
              justifyItems: 'center',
              gap:"15px"
            }}
          >
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 700 }}>
                {row.FirstName.charAt(0).toUpperCase() + row.FirstName?.slice(1)} {row.LastName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                {formatDate(row.Datetime)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      field: 'notification',
      headerName: '',
      flex: 0.2,
      renderCell: ({ row }: any) => (
        <Typography
          sx={{
            fontSize: '0.8125rem',
            fontWeight: '400',
            color: getColor()
          }}
        >
          This <CustomChip rounded size='small' skin='light' color={'success'} label={row.JobId} /> was{' '}
          {row.JobType === 'Start' ? 'started' : 'stopped'} by {row.FirstName}
          {row.LastName}
        </Typography>
      )
    }
  ]

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

  useEffect(() => {
    fetchNotification()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNotification = async () => {
    const query = `query MyQuery {
        listJobLocation5AABS {
          items {
            Datetime
            ID
            EmpId
            JobId
            JobType 
            Latitude
            Longitude
            Read
          }
        }
      }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setNotification(response.data.data.listJobLocation5AABS.items)
      if (response.data.data.listJobLocation5AABS.items.length > 0) {
        await fetchListJob(response.data.data.listJobLocation5AABS.items)
      }
    } catch (error) {
    //  console.error('Error:', error)
    }
  }

  const fetchListJob = async (res: any) => {
    const jobQuery = `query MyJobQuery {
      listJobsNew5AABS {
        items {
          ID
          JobId
        }
      }
    }`;
  
    const userQuery = `query MyUserQuery {
      listUsers5AABS {
        items {
          FirstName
          LastName
          ProfileImage
          ID
          UserId
        }
      }
    }`;
  
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
  
    try {
      const jobResponse = await ApiClient.post(`${AppSink}`, { query: jobQuery }, { headers });
      const userResponse = await ApiClient.post(`${AppSink}`, { query: userQuery }, { headers });
  
      const userMap = new Map(
        userResponse.data.data.listUsers5AABS.items.map((userItem: any) => [userItem.UserId, userItem])
      );
  
      const matchedJobs = res.map((locationItem: any) => {
        const matchingJobItem = jobResponse.data.data.listJobsNew5AABS.items.find(
          (jobItem: any) => jobItem.ID === locationItem.JobId
        );
  
        const matchingUser:any = userMap.get(locationItem.EmpId.toString());
  
        if (matchingJobItem && matchingUser) {
          return {
            ...matchingJobItem,
            ...locationItem,
            FirstName: matchingUser.FirstName,
            LastName: matchingUser.LastName,
            ProfileImage: matchingUser.ProfileImage
          };
        }
        return null;
      }).filter(Boolean); 
  
      setMatchedIds(matchedJobs);
    } catch (error) {
    //  console.error('Error:', error);
    }
  };

  return (
    <>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Button
              variant='contained'
              sx={{
                float: 'right',
                display: 'flex',
                gap: '10px',
                backgroundColor: '#776cff',
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                },
                height: '40px'
              }}
              onClick={handleModalNotification}
            >
              <Icon icon='basil:notification-outline'></Icon>
              Add New
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <DataGrid
                disableColumnMenu
                autoHeight
                pagination
                rowHeight={62}
                rows={matchedIds}
                getRowId={row => row.ID}
                columns={columns}
                sx={{
                  '.MuiDataGrid-sortIcon': {
                    display: 'none'
                  },
                  '.MuiDataGrid-iconSeparator': {
                    display: 'none !important'
                  }
                }}
                rowCount={totalCount}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={e =>
                  setPaginationModel({
                    ...e
                  })
                }
              />
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalNotification}
        buttonText=''
        buttonOpenText=''
      >
        <div style={{ float: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
            <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleModalCloseDelete}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
          </div>
        </div>
        <Typography>Notification</Typography>

        <FormControl>
          <RadioGroup
            row
            aria-labelledby='demo-row-radio-buttons-group-label'
            name='row-radio-buttons-group'
            value={selectedOption}
            onChange={handleRadioChange}
          >
            <FormControlLabel value='Employee' control={<Radio />} label='Employee' />
            <FormControlLabel value='Customer' control={<Radio />} label='Customer' />
          </RadioGroup>
        </FormControl>

        {selectedOption === 'Employee' && (
          <CustomAutocomplete
            open={open}
            options={options}
            loading={loading}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            id='autocomplete-asynchronous-request'
            renderOption={(props, option) => (
              <li {...props}>
                <Typography>{option.FirstName} {option.LastName}</Typography>
              </li>
            )}
            onChange={(event, value) => {
              setSelectedEmployeeName(value?.FirstName + value?.LastName|| '')
              setSelectedEmployeeId(value?.ID || '')
            }}
            getOptionLabel={(option: any) => option.FirstName + option.LastName}
            isOptionEqualToValue={(option: any, value) => option.ID === value.ID}
            renderInput={params => (
              <CustomTextField
                {...params}
                label={
                  <div>
                    <span className='status' style={{ color: getColor() }}>
                      Employee
                    </span>
                  </div>
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
          />
        )}

        {selectedOption === 'Customer' && (
          <CustomAutocomplete
            open={open}
            options={customerOptions}
            loading={customLoading}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            id='autocomplete-asynchronous-request-customer'
            renderOption={(props, option) => (
              <li {...props}>
                  <Typography>{option.FirstName} {option.LastName}</Typography>
              </li>
            )}
            onChange={(event, value) => {
              setSelectedCustomerName(value?.FirstName +  value?.LastName|| '')
              setSelectedCustomerId(value?.CId || '')
              setSelectedFcmtoken(value?.fcm_token || '')
            }}
            getOptionLabel={(option: any) => option.FirstName +  option.LastName}
            isOptionEqualToValue={(option, value) => option.CId === value.CId}
            renderInput={params => (
              <CustomTextField
                {...params}
                label={
                  <div>
                    <span className='status' style={{ color: getColor() }}>
                      Customer
                    </span>
                  </div>
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
              />
            )}
          />
        )}

        <CustomTextField
          id='description'
          label={
            <div>
              <span className='status' style={{ color: getColor() }}>
                Description
              </span>
            </div>
          }
          variant='outlined'
          fullWidth
          multiline
          rows={4}
          margin='normal'
        />
        <Button
          variant='contained'
          sx={{
            float: 'right',
            backgroundColor: '#776cff',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            },
            height: '40px',
            width: '100px',
            padding: '5px 5px 5px 10px'
          }}
          onClick={selectedOption === 'Employee' ? handleSend : handleSendCustomer}
        >
          Send
        </Button>
      </CustomModal>
    </>
  )
}
export default ShowNotification
