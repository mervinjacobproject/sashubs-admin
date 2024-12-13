import { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from 'react'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import Typography from '@mui/material/Typography'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Autocomplete, Backdrop, Box, Button, Fade, FormHelperText, IconButton, Modal, Switch, TextField } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'
import CloseIcon from '@mui/icons-material/Close'
import { Icon } from '@iconify/react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'


interface AddressValues {
  doorNo: string
  streetName: string
  area: string
  suburb: string
  postCode: any
  State: string
  Country: any
  status: boolean
}
export interface CustomerAddressMethods {
  childMethod: (id: any) => void
  triggerValidation: () => Promise<boolean>
  editid: any
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
interface customerProps {
  handleNext: () => void
  ref: any
  editid: any
  onFetchData: any
  createId: any
  customer: any
}

interface PlaceDetails {
  name: string
  address: string
  lat: number
  lng: number
}

interface Selected {
  lat: number
  lng: number
}
const center = {
  lat:  9.9039126,
  lng: 78.1165197
};
const libraries: Array<'places'> = ['places'];

const CustomerAddress: React.FC<customerProps> = forwardRef<CustomerAddressMethods, customerProps>(
  ({ handleNext, editid, createId, customer,onFetchData }, ref) => {
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [selectedState, setSelectedState] = useState<string>('')
    const [countries, setCountries] = useState<any>([])
    const [state, setState] = useState<any>([])
    const [subUrb, setSubUrb] = useState<any>([])
    const [countryName, setCountryName] = useState<any>('')
    const [stateNames, setStateNames] = useState<any>('')
    const [cityNames, setCityNames] = useState<any>('')
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Selected | null>(null)
    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
    const streetNameRef = useRef<HTMLInputElement>(null);
    const doorNoRef = useRef<HTMLInputElement>(null);
    const areaNameRef = useRef<HTMLInputElement>(null);
    const [initLatitude, setInitLatitude] = useState<any>(null);
const [initLongitude, setInitLongitude] = useState<any>(null);

    const addressSchema = yup.object().shape({
      doorNo: yup.string().required(),
      streetName: yup.string().required(),
      postCode: yup
        .string()
        .matches(/^\d{6}$/, 'Post code must have exactly 6 numbers')
        .required('Postcode is required'),
       State: yup.string().required("State is required"),
       City: yup.string().required("City is required"),
      Country: yup.string().required('Country is required'),
      area: yup.string().required('required'),
      latitude: yup.number().required('Latitude is required'),
      longitude: yup.number().required('Longitude is required')
    })
    const {
      handleSubmit,
      setValue,
      trigger,
      getValues,
      control: addressControl,
      formState: { errors: addressErrors }
    } = useForm({
      resolver: yupResolver(addressSchema)
    })
    
    const handleOpen = async() => {
      if (editid) {
       // alert('Edit mode not implemented yet')
        const selectedRow = customer.find((row: any) => row.Id == editid);

        if (selectedRow) {
           if(selectedRow.Lat && selectedRow.Lang){
          const latitude = parseFloat(selectedRow.Lat);
const longitude = parseFloat(selectedRow.Lang);

           setSelected({ lat: latitude, lng: longitude });
          
          
         // setSelected({ lat: selectedRow.Lat, lng: selectedRow.Lang });
          //fetchAddress(selectedRow.Lat, selectedRow.Lang)
            // Fetch address using reverse geocoding
            setOpen(true);
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {


          if (status === 'OK') {
            if (results[0]) {
              const address = results[0].formatted_address
              const name = results[0].address_components[0].long_name
              setPlaceDetails({
                name: name, // Replace with actual field if different
                address: address, // Replace with actual field if different
                lat: latitude,
                lng: longitude
              })
            } else {
              console.warn('No results found')
            }
          } else {
            console.error('Geocoder failed due to: ' + status)
          }
          
        })
      }
    
    else{
        setSelected({ lat: 9.9039126, lng: 78.1165197 });
        setOpen(true);
    }
        }
      }
      else{
        setOpen(true);
      }
    }
    
    
    const handleClose = () => setOpen(false)
    
    // const { isLoaded } = useLoadScript({
    //   googleMapsApiKey: 'AIzaSyDLeN_hkuZ5PhXNE4OBFbp-5VOvductY2U', // Replace with your Google Maps API key
    //   libraries: ['places']
    // })
    const handleMarkerDragEnd = async (event: any) => {
      const lat: any = event.latLng.lat()
      const lng: any = event.latLng.lng()
      setSelected({ lat, lng })
      setValue('latitude', lat)
          setValue('longitude', lng)
    //  fetchAddress(lat, lng)
      // Initialize the Geocoder service
      const geocoder = new window.google.maps.Geocoder()

      // Perform reverse geocoding to get place details from lat/lng
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            const address = results[0].formatted_address
            const name = results[0].address_components[0].long_name // You can choose a different component if needed

            setPlaceDetails({
              name,
              address,
              lat,
              lng
            })
          } else {
            console.warn('No results found')
          }
        } else {
          console.error('Geocoder failed due to: ' + status)
        }
      })
    }

    const handleCloseDetails = () => {
      setPlaceDetails(null)
    }

    const handleSearchBoxLoad = (ref: any) => {
      const searchBox = new window.google.maps.places.SearchBox(ref)
      searchBox.addListener('places_changed', () => {
        const places: any = searchBox.getPlaces()
        if (places.length === 0) return

        const { geometry } = places[0]
        setSelected({
          lat: geometry.location.lat(),
          lng: geometry.location.lng()
        })
        //fetchAddress(geometry.location.lat(), geometry.location.lng())
        setPlaceDetails({
          name: places[0].name,
          address: places[0].formatted_address,
          lat: geometry.location.lat(),
          lng: geometry.location.lng()
        })
      })
    }

    const handleMapClick = async (event: any) => {
      const latLng = event.latLng
      if (latLng) {
        // Update the selected coordinates
        setSelected({
          lat: latLng.lat(),
          lng: latLng.lng()
        })
        const lat = latLng.lat()
        const lng = latLng.lng()
        setValue('latitude', latLng.lat())
          setValue('longitude', latLng.lng())
        // Fetch the address based on the latitude and longitude
        //fetchAddress(latLng.lat(), latLng.lng())

        // Assuming fetchAddress returns the address details in a format similar to your setPlaceDetails
        // if (addressDetails) {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK') {
            if (results[0]) {
              const address = results[0].formatted_address
              const name = results[0].address_components[0].long_name
              setPlaceDetails({
                name: name, // Replace with actual field if different
                address: address, // Replace with actual field if different
                lat: latLng.lat(),
                lng: latLng.lng()
              })
            } else {
              console.warn('No results found')
            }
          } else {
            console.error('Geocoder failed due to: ' + status)
          }
        })
        // }
      }
    }
    const handleLiveLocationClick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords
            setSelected({
              lat: latitude,
              lng: longitude
            })
            //fetchAddress(latitude, longitude)
            setValue('latitude', latitude)
          setValue('longitude', longitude)
            // Fetch address using reverse geocoding
            try {
              const geocoder = new window.google.maps.Geocoder()
              const results: any = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                  if (status === 'OK') {
                    resolve(results)
                  } else {
                    reject(new Error(`Geocoder failed due to: ${status}`))
                  }
                })
              })

              if (results[0]) {
                const place = results[0]
                setPlaceDetails({
                  name: place.address_components[0]?.long_name || 'N/A', // Adjust as needed
                  address: place.formatted_address,
                  lat: latitude,
                  lng: longitude
                })
              }
            } catch (error) {
              // console.error('Error fetching address:', error);
            }
          },
          error => {
            //console.error('Error fetching live location:', error);
          }
        )
      } else {
        //console.error('Geolocation is not supported by this browser.');
      }
    }
    const findCityId = (city: any) => {
      const cityid = subUrb.find((country: any) => country.City === city)
      return cityid ? cityid.Id : null
    }
    const findStateId = (statename: any) => {
      const stateid = state?.find((country: any) => country.StateName === statename)

      return stateid ? stateid.id : null
    }
    const findCountryId = (countryName: any) => {
      const country = countries.find((country: any) => country.CountryName === countryName)
      return country ? country.id : null
    }
    const fetchAddress = async (lat: any, lng: any) => {
      const apikey = 'AIzaSyDLeN_hkuZ5PhXNE4OBFbp-5VOvductY2U'

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`
        )
        const data = await response.json()

        if (data.status === 'OK' && data.results.length > 0) {
          
          const addressComponents = data.results[0].address_components
           //console.log(addressComponents, 'addressComponents')

          // Improved extraction of address components
          const getAddressComponent = (components: any, type: any) => {
            const component = components.find((component: any) => component.types.includes(type))
            //   console.log(component, 'component')
            return component ? component.long_name : ''
          }
          const countryName = getAddressComponent(addressComponents, 'country')
          const city = getAddressComponent(addressComponents, 'administrative_area_level_3')
          //   console.log("city",city)
          const statename = getAddressComponent(addressComponents, 'administrative_area_level_1')
          //    console.log(statename, 'statename')
          const countryId = findCountryId(countryName)
          const stateid = findStateId(statename)
          const suburb = findCityId(city)
          const address: any = {
            doorNo: getAddressComponent(addressComponents, 'street_number'),
            streetName: getAddressComponent(addressComponents, 'route'),
            area: getAddressComponent(addressComponents, 'sublocality_level_1'),
            City: suburb,
            State: stateid,
            Country: countryId,
            postCode: getAddressComponent(addressComponents, 'postal_code')
          }
          setValue('Country', countryId)
          setValue('State', stateid)
          setValue('latitude', lat)
          setValue('longitude', lng)
          setCountryName(countryId)
          setStateNames(stateid)
          setCityNames(city)
          setValue('City', suburb)
          //   setValue('City', city)
          // setCityNames(selectedRow.City)
          if (countryId) {
            await fetchStateData(countryId)
          }
          if (stateid) {
            await fetchSubUrb(stateid)
          }
          Object.keys(address).forEach((key: any) => setValue(key, address[key]))
          trigger()
        } else {
          console.error('No results found for the given coordinates.')
        }
      } catch (error) {
        console.error('Error fetching address:', error)
      }
    }

    const getFormDetails = useCallback(
      async (editid: any) => {
        try {
          if(customer !== undefined)
            {
          const selectedRow = customer.find((row: any) => row.Id == editid)
          
            //console.log(selectedRow, 'editid')
            setValue('doorNo', selectedRow.DoorNo)
            setValue('streetName', selectedRow.Street)
            setValue('Country', selectedRow.CountryID)
            setValue('State', selectedRow.StateID)
            setValue('City', selectedRow.City)
            setCountryName(selectedRow.CountryID)
            setStateNames(selectedRow.StateID)
            setCityNames(selectedRow.City)
            setValue('postCode', selectedRow.PostalCode)
            setValue('status', (selectedRow.Status == 1) ? true : false)
            setValue('area', selectedRow.Area)
            setValue('latitude', selectedRow.Lat)
            setValue('longitude', selectedRow.Lang)
            setInitLatitude(selectedRow.Lat);
          setInitLongitude(selectedRow.Lang);
// setSelected({ lat: selectedRow.Lat, lng: selectedRow.Lang })
            if (selectedRow.CountryID) {
              await fetchStateData(selectedRow.CountryID)
            }
            if (selectedRow.StateID) {
              await fetchSubUrb(selectedRow.StateID)
            }
          }
            else{
              const res = await ApiClient.post(`/getcustomer`)
      const response = res.data.data
      const selectedRow = response.find((row: any) => row.Id == editid)
      if (selectedRow) {
              setValue('doorNo', selectedRow.DoorNo)
              setValue('streetName', selectedRow.Street)
              setValue('Country', selectedRow.CountryID)
              setValue('State', selectedRow.StateID)
              setValue('City', selectedRow.City)
              setCountryName(selectedRow.CountryID)
              setStateNames(selectedRow.StateID)
              setCityNames(selectedRow.City)
              setValue('postCode', selectedRow.PostalCode)
              setValue('status', (selectedRow.Status == 1) ? true : false)
              setValue('area', selectedRow.Area)
              setValue('latitude', selectedRow.Lat)
              setValue('longitude', selectedRow.Lang)
              setInitLatitude(selectedRow.Lat);
              setInitLongitude(selectedRow.Lang);
              if (selectedRow.CountryID) {
                await fetchStateData(selectedRow.CountryID)
              }
              if (selectedRow.StateID) {
                await fetchSubUrb(selectedRow.StateID)
              }
            }
          }
          
        } catch (err) {
          console.error('Something went wrong', err)
        }
      },
      [customer, setValue]
    )

    useEffect(() => {
      if (editid) {
        getFormDetails(editid)
      }
    }, [editid, getFormDetails])

    useEffect(() => {
      const fetchCountrData = async () => {
        try {
          const response = await ApiClient.post('/getcountry')
          setCountries(response.data.data)
        } catch (error) {
          // console.error('Error fetching countries:', error)
        }
      }

      fetchCountrData()
    }, [])
    const fetchStateData = async (countryId: string) => {
      try {
        const response = await ApiClient.post(`/getstatedetail?CountryID=${countryId}`)
        setState(response.data.data)
      } catch (error) {
        // console.error('Error fetching states:', error)
      }
    }
    const fetchSubUrb = async (stateId: string) => {
      try {
        const response = await ApiClient.post(`/getcitydetail?StateID=${stateId}`)
        setSubUrb(response.data.data)
      } catch (error) {
        // console.error('Error fetching suburbs:', error)
      }
    }

    const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      const selectedCountryId = event.target.value as string
      setSelectedCountry(selectedCountryId)
      if (selectedCountryId) {
        fetchStateData(selectedCountryId)
      }
    }
    const handleStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      const selectedStateId = event.target.value as string
      setSelectedState(selectedStateId)
      if (selectedStateId) {
        fetchSubUrb(selectedStateId)
      }
    }

    useImperativeHandle(ref, () => ({
      async childMethod() {
        await handleSubmit(onSubmit)()
        //handleNext()
      },
      triggerValidation: async () => {
        const isValid = await trigger()
        return isValid
      },
      editid
    }))

    const mapContainerStyle = {
      width: '100%',
      height: '480px'
    }
    // console.log(initLatitude, 'initLatitude')
    // console.log(initLongitude, 'initLongitude')
    



    const onSubmit = async (editedData: any) => {
      // console.log('onSubmit', editedData)
      const isValid = await trigger();
      if (!isValid) {
       
        return;
      }
      const statusValue = editedData.status ? 1 : 0
      const { doorNo, streetName, City, area, postCode, State, Country, latitude, longitude } = editedData
      //console.log(Country, 'Country')
      let hasErrors = false;

      // Check if each field is present, if not, trigger a specific toast error
      if (!Country) {
        toast.error('Country is required!');
        hasErrors = true;
      }
  
      if (!State) {
        toast.error('State is required!');
        hasErrors = true;
      }
  
      if (!City) {
        toast.error('City is required!');
        hasErrors = true;
      }
  
      // If any errors are found, prevent form submission
      if (hasErrors === true) {
        return;
      }
    else if(hasErrors === false){
      if (editid) {
        ApiClient.post(
          `/updatecustomer?Id=${editid}&DoorNo=${doorNo}&Street=${streetName}&Area=${area}&City=${City}&State=${State}&Country=${Country}&PostalCode=${postCode}&Lat=${latitude}&Lang=${longitude}&Status=${statusValue}`
        )
          .then(res => {
            if (res.data) {
              handleNext()
              toast.success('Updated Succesfully')
              onFetchData()
            }
          })
          .catch(err => {
            console.log('Something went wrong', err)
          })
      }
      if (createId) {
        ApiClient.post(
          `/createcustomer?DoorNo=${doorNo}&Street=${streetName}&Area=${area}&City=${City}&State=${State}&Country=${Country}&PostalCode=${postCode}&Lat=${latitude}&Lang=${longitude}&Status=${statusValue}`
        )
          .then(res => {
            if (res.data) {
              handleNext()
              toast.success('Created Succesfully')
              onFetchData()
            }
          })
          .catch(err => {
            // console.log('Something went wrong', err)
          })
      }
    }
    }
   
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: 'AIzaSyDLeN_hkuZ5PhXNE4OBFbp-5VOvductY2U',
      libraries
    });
    
    useEffect(() => {
      if (loadError) console.error('Error loading maps:', loadError);
      else if (!isLoaded) console.log('Loading Maps...');
    }, [isLoaded, loadError,selected]);
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div className='empTextField'>
              <Controller
                name='doorNo'
                control={addressControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      id='doorNo'
                      fullWidth
                      value={value}
                      autoFocus
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Door No / Building Name
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Door No / Building Name'
                      onChange={onChange}
                      error={Boolean(addressErrors.doorNo)}
                       onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        streetNameRef.current?.focus(); // Move to Shop Name input on Enter
                      }
                    }}
                    inputRef={doorNoRef} // Set ref
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.doorNo && { helperText: 'Door No  / Building Name is required' })}

                    />
                  </>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div>
              <Controller
                name='streetName'
                control={addressControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      id='streetName'
                      fullWidth
                      value={value}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Street Name / Landmark
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Street Name / Landmark'
                      onChange={onChange}
                      error={Boolean(addressErrors.streetName)}
                       onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        areaNameRef.current?.focus(); // Move to Shop Name input on Enter
                      }
                    }}
                    inputRef={streetNameRef} // Set ref
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.streetName && {
                        helperText: 'Street Name/ Landmark is required'
                      })}
                    />
                  </>
                )}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div>
              <Controller
                name='area'
                control={addressControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      id='area'
                      fullWidth
                      value={value}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Area Name
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Area Name'
                      onChange={onChange}
                      error={Boolean(addressErrors.area)}
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.area && {
                        helperText: 'Area Name is required'
                      })}
                    />
                  </>
                )}
              />
            </div>
          </Grid>
          <Grid sx={{ paddingTop: '13px !important', marginTop: '7px' }} item xs={6} sm={6}>
            {
              <div>
                <span
                  className='firstname'
                  style={{
                    color: getColor(),
                    fontSize: '14px'
                  }}
                >
                  Country
                </span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
            }
            <Controller
              name='Country'
              control={addressControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  id='country'
                  autoComplete='off'
                  fullWidth
                  select
                  {...field}
                  value={field.value || countries?.find((c: any) => c.id == countryName)?.id || ''}
                  error={Boolean(addressErrors.Country)}
      helperText={addressErrors.Country ? 'Country is required' : ''}
                  onChange={e => {
                    field.onChange(e)
                    handleCountryChange(e)
                  }}
                >
                  {countries
                    ?.sort((a: any, b: any) => a.CountryName.localeCompare(b.CountryName))
                    .map((country: any) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.CountryName}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
              />
              <Typography variant='body1'  sx={{ color: "#dd5254", fontSize: '14px',  }}>
              {Boolean(addressErrors.Country) &&  <p> {addressErrors.Country && 'Country Name  is required'} </p>
            }

            </Typography>
            {addressErrors.Country && <FormHelperText style={{ color: 'red' }}>Select Country</FormHelperText>}
              
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {
              <div>
                <span className='firstname' style={{ color: getColor(), fontSize: '14px' }}>
                  State
                </span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
            }
            <Controller
              name='State'
              control={addressControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  id='State'
                  fullWidth
                  select
                  {...field}
                  value={field.value || state?.find((c: any) => c.id == stateNames)?.id || ''}
                  error={Boolean(addressErrors.State)}
      helperText={addressErrors.State ? 'State is required' : ''}
                  onChange={e => {
                    field.onChange(e)
                    handleStateChange(e)
                  }}
                >
                  {state
                    ?.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName))
                    .map((stateItem: any) => (
                      <MenuItem key={stateItem.id} value={stateItem.id}>
                        {stateItem.StateName}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
            <Typography variant='body1'  sx={{ color: "#dd5254", fontSize: '14px',  }}>
              {Boolean(addressErrors.State) &&  <p> {addressErrors.State && 'State Name  is required'} </p>
            }
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            {
              <div>
                <span className='firstname' style={{ color: getColor(), fontSize: '14px' }}>
                  City
                </span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
            }
            <Controller
              name='City'
              control={addressControl}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  id='City'
                  fullWidth
                  select
                  {...field}
                  value={field.value || subUrb?.find((c: any) => c.Id == cityNames)?.Id || ''}
                  error={Boolean(addressErrors.City)}
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.City && {
                        helperText: 'City Name is required'
                      })}
                  onChange={e => {
                    field.onChange(e)
                  }}
                >
                  {!subUrb || subUrb.length === 0 ? (
                    <MenuItem disabled>No suburbs</MenuItem>
                  ) : (
                    subUrb
                      ?.sort((a: any, b: any) => a.City.localeCompare(b.City))
                      .map((s: any) => (
                        <MenuItem key={s.Id} value={s.Id}>
                          {s.City}
                        </MenuItem>
                      ))
                  )}
                </CustomTextField>
              )}
              
            />
            <Typography variant='body1'  sx={{ color: "#dd5254", fontSize: '14px', marginTop:"-10px"}}>
              {Boolean(addressErrors.City) &&  <p> {addressErrors.City && 'City Name  is required'} </p>
            }
            </Typography>
          </Grid>
         
          <Grid item xs={12} sm={6}>
            <div>
              <Controller
                name='postCode'
                control={addressControl}
                rules={{
                  required: true,
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Post code must have exactly 6 numbers'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      id='postCode'
                      fullWidth
                      value={value}
                      label={
                        <div>
                          <span
                            className='firstname'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Postcode
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Postcode'
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^\d{0,6}$/.test(inputValue)) {
                          onChange(e)
                        }
                      }}
                      error={Boolean(addressErrors.postCode)}
                      aria-describedby='stepper-linear-account-username'
                      {...(addressErrors.postCode && {
                        helperText: 'PostCode is required'
                      })}
                    />
                  </>
                )}
              />
            </div>
          </Grid>

          
          <Grid item sm={6}  xs={6}  >
          <Button className='btn btn-square hover-up' onClick={handleOpen}>
                  <Icon icon='material-symbols:my-location' width='20' style={{ marginRight: '0px' }} />
                  Locate Me
                </Button>
          </Grid>
            <Grid item xs={6} sm={6}></Grid>
          <Grid container spacing={1} item xs={6} sm={6} lg={6}>
          <Grid item xs={6} sm={6}>
          <div style={{ alignItems: 'center', marginLeft: '-20px', marginTop:'-40px', width: '500px'}}>

 <Typography variant='body1' style={{ color: getColor(), fontSize: '14px', marginLeft: '60px' }}>
   Latitude: {getValues('latitude') || 'N/A'}
 </Typography>
 <Typography variant='body1' style={{ color: getColor(), fontSize: '14px', marginLeft: '60px', marginTop:'10px' }}>
   Longitude: {getValues('longitude') || 'N/A'}
 </Typography>
 <Typography variant='body1'  sx={{ color: "#dd5254", fontSize: '14px', marginLeft: '60px', marginTop:'10px' }}>

{Boolean(addressErrors.latitude) &&  <p> {addressErrors.latitude && 'Latitude & Longitude  is required'} </p>
}
 </Typography>
 </div>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: '' }}>
            <div className='empTextField' style={{ display: 'Grid', alignItems: 'center' }}>
              <Typography
                sx={{ mb: 1, color: 'text.secondary', fontWeight: '600', fontSize: '12px', mr: 3, marginTop: '7px' }}
              >
                <span
                  className='firstname'
                  style={{
                    color: getColor(),
                    fontSize: '14px'
                  }}
                >
                  Status
                </span>
              </Typography>
              <div>
                <Controller
                  name='status'
                  control={addressControl}
                  //defaultValue={editStatus}
                  render={({ field }) => {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                          checked={!!field.value}
                          onChange={e => field.onChange(e.target.checked)}
                          sx={{ paddingBottom: '0 !important' }}
                          id='invoice-add-payment-stub'
                        />
                        <Typography sx={{ fontWeight: 600 }}>{field.value ? 'Active' : 'Inactive'}</Typography>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          </Grid>

          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={open}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: 'auto',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4
                }}
              >
                <Typography id='transition-modal-title' variant='h6' component='h2' style={{ marginTop: '-10px' }}>
                  Select Your Location
                </Typography>
                <div>
                  {/* <button onClick={handleLiveLocationClick}>Live Location</button> */}
                  <IconButton
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Box sx={{ position: 'relative', marginTop: 3 }}>
                    <TextField
                      fullWidth
                      variant='outlined'
                      label='Search Places'
                      placeholder='Search for a place'
                      inputRef={(ref: any) => {
                        if (ref && !ref.searchBoxLoaded) {
                          ref.searchBoxLoaded = true
                          handleSearchBoxLoad(ref)
                        }
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                    <Button
                      variant='contained'
                      onClick={handleLiveLocationClick}
                      sx={{
                        marginTop: 0,
                        marginBottom: 2,
                        backgroundColor: '#776cff',
                        color: 'white',

                        '&:hover': {
                          background: '#776cff',
                          color: 'white'
                        }
                      }}
                    >
                      <Icon icon='material-symbols:my-location' width='20' style={{ marginRight: '10px' }} />
                      Use My Current Location
                    </Button>
                    {/* <LoadScript googleMapsApiKey={'AIzaSyDLeN_hkuZ5PhXNE4OBFbp-5VOvductY2U'} libraries={libraries}> */}
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={selected || center}
                      zoom={15}
                      // width={200}
                      onClick={handleMapClick}
                      options={{
                        zoomControl: true,
                        mapTypeControl: true,
                        streetViewControl: true,
                        fullscreenControl: true
                      }}
                    >
                     {selected && (
    <Marker
      position={selected || center}
      draggable
      onDragEnd={handleMarkerDragEnd}
    />
  )}
                    </GoogleMap>
                    {/* </LoadScript> */}
                    {placeDetails && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: 20,
                          right: 20,
                          backgroundColor: 'white',
                          padding: 2,
                          borderRadius: 2,
                          boxShadow: 3
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='h6'> <b>Place Details:</b></Typography>
                          <IconButton onClick={handleCloseDetails} size='small'>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                       <Typography sx={{ color: 'black' }}><b>Name: {placeDetails.name}</b> </Typography>
<Typography sx={{ color: 'black' }}><b>Address: {placeDetails.address}</b></Typography>
<Typography sx={{ color: 'black' }}><b>Latitude: {placeDetails.lat}</b></Typography>
<Typography sx={{ color: 'black' }}><b>Longitude: {placeDetails.lng}</b></Typography>
                      </Box>
                    )}
                  </Box>
                </div>
              </Box>
            </Fade>
          </Modal>
        </Grid>
      </form>
    )
  }
)
export default CustomerAddress


