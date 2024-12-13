// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import { useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { Avatar } from '@mui/material'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'

const CrmLastTransaction = () => {
  const router = useRouter()
  const [locationData, setLocationData] = useState<any>({})
  const [addresses, setAddresses] = useState<any>({})

  const calculateLastSeen = (lastSeenTime: any) => {
    const now: any = new Date()
    const lastSeen: any = new Date(lastSeenTime)
    const timeDifference = now - lastSeen
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const month = 30 * day

    if (timeDifference < minute) {
      return 'Just now'
    } else if (timeDifference < hour) {
      const minutesAgo = Math.floor(timeDifference / minute)
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
    } else if (timeDifference < day) {
      const hoursAgo = Math.floor(timeDifference / hour)
      const minutesAgo = Math.floor((timeDifference % hour) / minute)
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
    } else if (timeDifference < month) {
      if (lastSeen.getMonth() === now.getMonth() && lastSeen.getFullYear() === now.getFullYear()) {
        const options: any = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }
        return new Intl.DateTimeFormat('en-GB', options).format(lastSeen)
      } else if (lastSeen.getMonth() === now.getMonth() - 1 && lastSeen.getFullYear() === now.getFullYear()) {
        const options: any = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }
        return new Intl.DateTimeFormat('en-GB', options).format(lastSeen)
      } else {
        const options: any = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }
        return new Intl.DateTimeFormat('en-GB', options).format(lastSeen)
      }
    } else {
      const options: any = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }
      return new Intl.DateTimeFormat('en-GB', options).format(lastSeen)
    }
  }

  const getAddressForLocation = async (lat: any, lng: any) => {
    try {
      const apiKey = 'pk.eyJ1Ijoic2VsdmFrdW1hcnRwIiwiYSI6ImNscXYxOTNtMjRyaW8ybm80OTlqYTg0a3EifQ.OLwAdUvr9BnCBBcWbVfwAg'
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        return data.features[0].place_name
      }
    } catch (error) {
      return ''
    }
  }

  // const fetchListUser = async (id:any) => {
  //   const query = `
  //   query MyQuery {
  //     listUsers5AABS(filter: {ID: {eq: 2803}}) {
  //       items {
  //         Date
  //         FirstName
  //         ID
  //         LastName
  //         Password
  //         ProfileImage
  //         RoleId
  //         Status
  //         UserId
  //         UserName
  //         UserType
  //       }
  //     }
  //   }`

  //   const headers = {
  //     'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //     'Content-Type': 'application/json'
  //   }

  //   try {
  //     const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
  //     fetchDriverId(response.data.listUsers5AABS.items[0]?.UserId)
  //   } catch (error) {
  //     console.error( error)
  //   }
  // }

  // const fetchDriverId = async (id:any) => {
  //   const query = `
  //     query MyQuery {
  //       listDriver5AABS(filter: {DID: ${id}}) {
  //         items {
  //           Address1
  //         }
  //       }
  //     }`

  //   const headers = {
  //     'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //     'Content-Type': 'application/json'
  //   }

  //   try {
  //     const response = await  ApiClient.post(`${AppSink}`, { query }, { headers })

  //   } catch (error) {
  //     console.error('Error fetching driver ID:', error)
  //   }
  // }

  const fetchLocationData = async () => {
    try {
      const databaseURL = 'https://aab-f47fc-default-rtdb.firebaseio.com/'
      const response = await fetch(`${databaseURL}/5aab.json`)
      const data = await response.json()
      setLocationData(data)
      Object.keys(data).forEach(async name => {
        const jobId = data[name].jobId
        const driverId = data[name].driverId
        const liveLocationlat = data[name].Latitude
        const liveLocationlng = data[name].Longitude
        const liveTimeStamp = data[name].Timestamp
        // await fetchListUser(driverId)
      })
    } catch (error) {
      // Handle other response statuses if needed
    }
  }

  useEffect(() => {
    fetchLocationData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const updatedAddresses: any = {}
      await Promise.all(
        Object.keys(locationData).map(async name => {
          if (locationData[name]?.Latitude && locationData[name]?.Longitude) {
            const address = await getAddressForLocation(
              parseFloat(locationData[name]?.Latitude),
              parseFloat(locationData[name]?.Longitude)
            )
            const lastSeenTime = calculateLastSeen(locationData[name]?.DateTime)
          }
        })
      )
      setAddresses(updatedAddresses)
    }

    fetchData()
  }, [locationData])

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
    <Card sx={{ height: '100%' }}>
      <CardHeader title='Vehicles overview' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              <TableCell>On the way</TableCell>
              <TableCell>Job</TableCell>
              <TableCell>Last Updated Time</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object?.keys(locationData).map(name => {
              return (
                <TableRow key={name}>
                  <TableCell sx={{ padding: '5px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 3 } }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {locationData[name].profileImage ? (
                          <img
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            src={locationData[name].profileImage}
                            alt='dashboard Image'
                          />
                        ) : (
                          <Avatar alt='' src=''>
                            {name.charAt(0)}
                          </Avatar>
                        )}
                        <div>
                          <Typography sx={{ color: getColor(), fontSize: '0.9375rem' }}>
                            {' '}
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                        <CustomChip
                          onClick={() => {
                            router.push(`/transactions/job?id=${locationData[name].jobId}`)
                          }}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#776cff',
                              color: '#fff'
                            }
                          }}
                          rounded
                          size='small'
                          skin='light'
                          color={'success'}
                          label={locationData[name].jobId}
                        />
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {calculateLastSeen(locationData[name].DateTime)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', cursor: 'pointer' }}>
                      <Icon
                        onClick={() => {
                          router.push('/transactions/gps/')
                        }}
                        icon='ion:eye'
                      ></Icon>
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

    </Card>
  )
}

export default CrmLastTransaction
