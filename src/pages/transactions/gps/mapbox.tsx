import React, { useEffect, useState, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'firebase/firestore'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import {
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Accordion,
  Typography,
  Tooltip,
  Avatar
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import { getFirestore, collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { initializeApp } from 'firebase/app'
import AppSink from 'src/commonExports/AppSink'

const firebaseConfig = {
  apiKey: 'AIzaSyD48xOYK8SZaSfbtXG6F66lbSk5-MMVToA',
  authDomain: 'aab-f47fc.firebaseapp.com',
  databaseURL: 'https://aab-f47fc-default-rtdb.firebaseio.com',
  projectId: 'aab-f47fc',
  storageBucket: 'aab-f47fc.appspot.com',
  messagingSenderId: '408257656220',
  appId: '1:408257656220:web:8761aecf9039e098d78459',
  measurementId: 'G-5BSS7ZDCG1'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#FF8A30' : '#308fe8'
  }
}))

const Mapbox = () => {
  const [map, setMap] = useState<any>(null)
  const mapContainer = useRef<any>(null)
  const [locationData, setLocationData] = useState<any>({})
  const [firebaseData, setFirebaseData] = useState([])
  const [driverJob, setDriverJob] = useState<any>('')
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const [selectedAccordion, setSelectedAccordion] = useState<any>(null)
  const [addresses, setAddresses] = useState<any>({})
  const [selectedLocationDistance, setSelectedLocationDistance] = useState<any>(null)
  const [averageSpeed] = useState(30)
  const [estimatedTime, setEstimatedTime] = useState<any>(null)
  const [estimatedHour, setEstimatedHour] = useState<any>(null)
  const [totalDistance, setTotalDistance] = useState<any>(null)

  const calculateLastSeen = (lastSeenTime: any) => {
    try {
      const lastSeen: any = new Date(lastSeenTime)
      if (isNaN(lastSeen.getTime())) {
        throw new Error('Invalid date')
      }
      const now: any = new Date()
      const timeDifference = now - lastSeen
      const minute = 60 * 1000
      const minutesAgo = Math.floor(timeDifference / minute)

      if (minutesAgo < 2) {
        return 'Last seen just now'
      } else if (minutesAgo < 60) {
        return `Last seen ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
      } else if (minutesAgo < 120) {
        return `Last seen 1 hour ago`
      } else if (minutesAgo < 180) {
        return `Last seen 2 hours ago`
      } else {
        if (lastSeen.toDateString() === now.toDateString()) {
          return `Last seen Today ${lastSeen.getHours().toString().padStart(2, '0')}:${lastSeen
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        } else if (lastSeen.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
          return `Last seen Yesterday ${lastSeen.getHours().toString().padStart(2, '0')}:${lastSeen
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        } else {
          return `${lastSeen.getDate()} ${new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(
            lastSeen
          )} ${lastSeen.getFullYear()} ${lastSeen.getHours().toString().padStart(2, '0')}:${lastSeen
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        }
      }
    } catch (error) {
      return 'Invalid date'
    }
  }

  const calculateDistance = (pickupLat: any, pickupLng: any, dropLat: any, dropLng: any) => {
    const toRadians = (degree: any) => (degree * Math.PI) / 180
    const R = 6371
    const dLat = toRadians(dropLat - pickupLat)
    const dLng = toRadians(dropLng - pickupLng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(pickupLat)) * Math.cos(toRadians(dropLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }
  const formatTime = (hours: any, minutes: any) => {
    const formattedHours = hours > 0 ? `${hours} hr` : ''
    const formattedMinutes = minutes > 0 ? ` ${minutes} min` : ''
    return `${formattedHours}${formattedMinutes}`
  }

  const calculateEstimatedTime = (distance: any, averageSpeed: any) => {
    const distanceInMiles = distance * 0.621371
    const estimatedTimeHours = distanceInMiles / averageSpeed
    const estimatedHours = Math.floor(estimatedTimeHours)
    const estimatedMinutes = Math.round((estimatedTimeHours - estimatedHours) * 60)
    return { hours: estimatedHours, minutes: estimatedMinutes }
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
      console.error(error)
      return ''
    }
  }

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2VsdmFrdW1hcnRwIiwiYSI6ImNscXYxOTNtMjRyaW8ybm80OTlqYTg0a3EifQ.OLwAdUvr9BnCBBcWbVfwAg'

    const fetchFirebaseData = async () => {
      try {
        const db = getFirestore()
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db, 'your_collection'))
        const firebaseData: any = querySnapshot.docs.map(doc => doc.data())
        setFirebaseData(firebaseData)
      } catch (error) {
        // Handle other response statuses if needed
      }
    }

    fetchFirebaseData()
  }, [])

  const initializeMap = () => {
    const newMap: any = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 5
    })

    setMap(newMap)
  }

  useEffect(() => {
    if (!map) {
      initializeMap()
    }
  }, [map])

  const addMarkerToMap = (location: any, name: any, isSelectedLocation: any) => {
    const truckImage = '/images/avatars/truck.png'
    const markerElement = document.createElement('div')
    markerElement.className = 'custom-marker'
    markerElement.style.backgroundImage = `url(${truckImage})`
    markerElement.style.width = '100px'
    markerElement.style.height = '40px'
    markerElement.style.backgroundSize = 'cover'
    const marker = new mapboxgl.Marker({ element: markerElement })
      .setRotation(location.Direction)
      .setLngLat([location.Longitude, location.Latitude])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<div style="display:grid; justify-items:center; gap: 10px;">
            ${
              location.profileImage
                ? `<img width=40px height=40px borderRadius=50px src="${location.profileImage}" alt="Driver Image" />`
                : `<Avatar alt="" src="" style="width: 40px; height: 40px; border-radius:50%;border:1px solid #cacaca;display:flex;justify-content:center;align-items:center;background-color:#cacaca">${name.charAt(
                    0
                  )}</Avatar>`
            }
            <div>
              <p>Driver ID: ${location.driverId}</p>
              <p>Name: ${name}</p>
            </div>
          </div>`
        )
      )
      .addTo(map)

    if (isSelectedLocation) {
      marker.getElement().classList.add('selected-marker')
    }
  }

  const fetchDriverId = async (driverId: any) => {
    try {
      const res = await ApiClient.get(`/api.php?moduletype=driver_details&id=${driverId}`)
    } catch (err) {
      // Handle other response statuses if needed
    }
  }

  const fetchDriverData = async (jobId: any) => {
    const query = `query MyQuery {
      listJobsNew5AABS(filter: {ID: {eq: ${jobId}}}) {
        items {
          ID
          JobId
          PickupLocation
          PickupLat
          PickupIng
          DropLocation
          DropLat
          DropIng
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
        .then((res: any) => {
          setDriverJob(res.data.data.listJobsNew5AABS.items)
        })
        .catch(err => {
          console.error(err.message)
        })
    } catch (err) {
      console.error('Error fetching data:', err)
    }
  }

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
        await fetchDriverData(jobId)
        await fetchDriverId(driverId)
      })
    } catch (error) {
      // Handle other response statuses if needed
    }
  }

  useEffect(() => {
    fetchLocationData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAccordionClick = async (jobId: any, driverId: any) => {
    const selectedLocation: any = Object.values(locationData).find(
      (location: any) => location.jobId === jobId && location.driverId === driverId
    )

    if (selectedLocation) {
      const distance: any = calculateDistance(
        driverJob?.[0]?.PickupLat,
        driverJob?.[0]?.PickupIng,
        driverJob?.[0]?.DropLat,
        driverJob?.[0]?.DropIng
      )
      const totalDistance: any = calculateDistance(
        selectedLocation?.Latitude,
        selectedLocation?.Longitude,
        driverJob?.[0]?.DropLat,
        driverJob?.[0]?.DropIng
      )
      const distanceAndTime = calculateDistance(
        selectedLocation?.Latitude,
        selectedLocation?.Longitude,
        driverJob?.[0]?.DropLat,
        driverJob?.[0]?.DropIng
      )
      const estimatedTime: any = calculateEstimatedTime(distance, averageSpeed)
      const estimatedHour: any = calculateEstimatedTime(distanceAndTime, averageSpeed)
      setTotalDistance(totalDistance)
      setSelectedLocationDistance(distance)
      setEstimatedTime(estimatedTime)
      setEstimatedHour(estimatedHour)

      setMap((prevMap: any) => {
        if (prevMap) {
          const newCenter = {
            lat: parseFloat(selectedLocation.Latitude),
            lng: parseFloat(selectedLocation.Longitude)
          }

          prevMap.flyTo({
            center: newCenter,
            zoom: 15,
            essential: true
          })
        }
        return prevMap
      })
    }

    setActiveAccordion(prevAccordion => (prevAccordion === jobId ? null : jobId))
    setSelectedAccordion({ jobId, driverId })
    await fetchDriverData(jobId)
  }

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
            updatedAddresses[name] = address
            addMarkerToMap(locationData[name], name, selectedAccordion?.jobId === locationData[name]?.jobId)
          }
        })
      )
      setAddresses(updatedAddresses)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <div style={{ position: 'relative' }}>
        <Card
          sx={{
            maxHeight: '800px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            position: 'absolute',
            left: -1,
            top: -1,
            zIndex: 1000,
            width: 350,
            padding: 0
          }}
        >
          <CardContent>
            {Object.keys(locationData).map(name => {
  
              return (
                <Accordion
                  key={name}
                  expanded={activeAccordion === locationData[name].jobId}
                  onChange={() => handleAccordionClick(locationData[name].jobId, locationData[name].driverId)}
                >
                  <AccordionSummary>
                    <div style={{ display: 'flex', alignContent: 'center', gap: '5px' }}>
                      {locationData[name].profileImage ? (
                        <img
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          src={locationData[name].profileImage}
                          alt='Gps Image'
                        />
                      ) : (
                        <Avatar alt='' src=''>
                          {name.charAt(0)}
                        </Avatar>
                      )}
                      <div>
                        <Typography sx={{ color: getColor(), fontSize: '0.9375rem' }}> {name}</Typography>
                        <Typography sx={{ color: '#a5a3ae', fontSize: '0.9375rem', fontWeight: 300 }}>
                          {calculateLastSeen(locationData[name].DateTime)}
                        </Typography>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      {selectedLocationDistance !== null && (
                        <Typography>Distance: {selectedLocationDistance.toFixed(2)} km</Typography>
                      )}

                      <Typography>
                        Estimated Time of Arrival: {formatTime(estimatedTime?.hours, estimatedTime?.minutes)}
                      </Typography>
                      {totalDistance && selectedLocationDistance !== null && (
                        <>
                          {(totalDistance - selectedLocationDistance) / totalDistance >= 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography>Delivery Process</Typography>
                              <Typography>
                                {totalDistance
                                  ? `${(((totalDistance - selectedLocationDistance) / totalDistance) * 100).toFixed(
                                      2
                                    )}%`
                                  : ''}
                                (
                                {calculateDistance(
                                  locationData[name]?.Latitude,
                                  locationData[name]?.Longitude,
                                  driverJob?.[0]?.DropLat,
                                  driverJob?.[0]?.DropIng
                                ).toFixed(2)}{' '}
                                km)
                              </Typography>
                            </div>
                          )}
                          {(totalDistance - selectedLocationDistance) / totalDistance >= 0 && (
                            <BorderLinearProgress
                              variant='determinate'
                              value={((totalDistance - selectedLocationDistance) / totalDistance) * 100}
                            />
                          )}
                        </>
                      )}
                      <Typography sx={{ color: '#28C76F', fontWeight: 500, fontSize: '0.8125rem', marginTop: '15px' }}>
                        <>
                          <div style={{ display: 'flex' }}>
                            <div style={{ writingMode: 'vertical-lr' }}>
                              {' '}
                              <Icon
                                icon='teenyicons:tick-circle-outline'
                                fontSize={17}
                                style={{ marginRight: '7px' }}
                              />
                              ........
                            </div>
                            <div>
                              PICKUP LOCATION:
                              {driverJob?.[0]?.PickupLocation && (
                                <Typography> {driverJob?.[0]?.PickupLocation}</Typography>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <div style={{ writingMode: 'vertical-lr' }}>
                              {' '}
                              <Icon
                                icon='teenyicons:tick-circle-outline'
                                fontSize={17}
                                style={{ marginRight: '7px' }}
                              />
                              ........
                            </div>
                            <div>
                              <Typography sx={{ color: '#28C76F', fontWeight: 500, fontSize: '0.8125rem' }}>
                                CURRENT LOCATION
                              </Typography>

                              <Tooltip title={addresses[name]}>
                                <Typography
                                  style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    width: '248px'
                                  }}
                                >
                                  {addresses[name]}
                                </Typography>
                              </Tooltip>
                            </div>
                          </div>
                        </>
                        {/* )} */}
                        <div style={{ display: 'flex' }}>
                          <div style={{ writingMode: 'vertical-lr' }}>
                            {' '}
                            <Icon
                              icon='carbon:location'
                              fontSize={17}
                              style={{
                                marginRight: '7px',
                                color: totalDistance && totalDistance > selectedLocationDistance ? '#776cff' : '#28C76F'
                              }}
                            />
                          </div>
                          <div>
                            <Typography
                              sx={{
                                color:
                                  totalDistance && totalDistance > selectedLocationDistance ? '#776cff' : '#28C76F',
                                fontWeight: 500,
                                fontSize: '0.8125rem'
                              }}
                            >
                              DROP LOCATION
                            </Typography>

                            {driverJob?.[0]?.DropLocation && <Typography> {driverJob?.[0]?.DropLocation}</Typography>}
                            <Typography>
                              Arriving at: {formatTime(estimatedHour?.hours, estimatedHour?.minutes)}
                            </Typography>
                          </div>
                        </div>
                      </Typography>
                    </div>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </CardContent>

          <style>
            {`
      /* WebKit browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 2px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: #776cff;
      }
      .custom-marker {
        background-size: cover;
        width: 40px;
        height: 40px;
      }
  
      .selected-marker {
        transform: scale(1.2); /* Adjust the scale as needed */
      }
    `}
          </style>
        </Card>
      </div>

      <div className='map-container' ref={mapContainer} style={{ height: 'calc(100vh - 180px)', width: '100%' }}></div>
    </>
  )
}

export default Mapbox
