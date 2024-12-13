import { useForm, Controller } from 'react-hook-form'
import { Button, Grid, MenuItem, Switch, TextField, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Autocomplete from '@mui/material/Autocomplete'
import AppSink from 'src/commonExports/AppSink'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface FormData {
  name: string
  country: string
  state: string
  status: number
}

const SuburbForm = ({ onClose, onFetchData, }: any) => {
  const [countryName, setCountryName] = useState('')
  const [stateName, setStateName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [stateData, setStateData] = useState([])
  const [country, setCountry] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      country: '',
      state: ''
    }
  })
  const fetchCountry = async() => {
    try {
      const res = await ApiClient.post(`/getcountry`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setCountry(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  useEffect(() => {
    fetchCountry()
  }, [])
  const fetchStateData = async (countryId: string) => {
    try {
      const response = await ApiClient.post(`/getstatedetail?CountryID=${countryId}`)
      setStateData(response.data.data)
    } catch (error) {
    //  console.error('Error fetching states:', error)
    }
  }

  const handleCountryChange = (countryid: any) => {
    const selectedCountryId = countryid
    setSelectedCountry(selectedCountryId)
    if (selectedCountryId) {
      fetchStateData(selectedCountryId)
    }
  }
  const handleStateChange = (newValue: any) => {
    const selectedStateId = newValue?.id || ''
    setSelectedState(selectedStateId) 
  }

  const onSubmit = async (data: FormData) => {
    try {
      const requestData = {
        City: data.name,
        CountryID: data.country,
        StateID: data.state,
        Status: 1
      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/createcity`

      const response = await ApiClient.post(apiEndpoint, requestData, { headers })

      if (response.status === 200) {
        onFetchData()
        toast.success('Saved successfully')
        onClose()
      }
    } catch (error) {
      toast.error('Error saving data')
    }
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

  useEffect(() => {
    if (selectedCountry) {
      fetchStateData(selectedCountry)
    }
  }, [selectedCountry])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center'
        }}
      >
        Add City
      </Typography>

      <Grid item xs={12} sm={12}>
        {
          <div>
            <span className='firstname' style={{ color: getColor(), fontSize: '14px' }}>
              City Name
            </span>
            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
              *
            </Typography>
          </div>
        }
        <Controller
          name='name'
          control={control}
          defaultValue=''
          rules={{ required: 'City Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='name'
              autoFocus
              variant='outlined'
              inputProps={{
                style: { color: getColor() }
              }}
              fullWidth
              margin='normal'
              onChange={e => {
                let inputValue = e.target.value
                // Allow letters and spaces only
                inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '')
                // Capitalize the first letter of each word
                inputValue = inputValue.replace(/\b\w/g, char => char.toUpperCase())
                field.onChange(inputValue)
              }}
              error={!!errors.name}
              helperText={errors.name && errors.name.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={12}>
        {
          <div>
            <span className='firstname' style={{ color: getColor(), fontSize: '14px' }}>
              Country
            </span>
            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
              *
            </Typography>
          </div>
        }
        <Controller
          name='country'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}

                options={country.sort((a: any, b: any) => a.CountryName?.localeCompare(b.CountryName))}
                getOptionLabel={(option: any) => option.CountryName || ''}
                value={country?.find((pricevalue: any) => pricevalue?.id === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setCountryName(newValue?.CountryName)
                  handleCountryChange(newValue?.id)
                }}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={params => (
                  <CustomTextField
                  
                    {...params}
                    id='country'
                    error={Boolean(errors.country) && !field.value}
                    helperText={errors.country && !field.value ? 'Country is required' : ''}
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

      <Grid item xs={12} sm={12}>
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
          name='state'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              
              options={stateData.sort((a: any, b: any) => a.StateName?.localeCompare(b.StateName))}
              getOptionLabel={(option: any) => option.StateName || ''}
              value={stateData?.find((pricevalue: any) => pricevalue?.id === field.value) || null}
              onChange={(_, newValue1) => {
                field.onChange(newValue1?.id || null)
                setStateName(newValue1?.StateName || '')
                handleStateChange(newValue1)
              }}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  id='state'
                  error={Boolean(errors.state) && !field.value}
                  helperText={errors.state && !field.value ? 'State is required' : ''}
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid sx={{ display: 'flex', justifyContent: 'start', alignItems: '' }}>
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

          <div className='status-container'>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <>
                  <Switch
                    {...field}
                    id='status'
                    color='primary'
                    checked={field.value == 1} // Check if the value is 1
                    onChange={e => field.onChange(e.target.checked ? 1 : 0)} // Change to 1 if checked, else 0
                  />
                  <label
                    htmlFor='status'
                    style={{
                      color: getColor()
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>{field.value == 1 ? 'Active' : 'Inactive'}</Typography>
                  </label>
                </>
              )}
            />
          </div>
        </div>
      </Grid>
      <div style={{ paddingTop: '5px' }}>
        <Button
          type='submit'
          sx={{
            float: 'right',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90px',
            padding: '5px !important',
            height: '35px',
            fontSize: '15px',
            whiteSpace: 'nowrap',
            '&:hover': {
              background: '#776cff',
              color: 'white'
            }
          }}
          disabled={!isDirty || !watch('country') || !watch('state')}
          variant='contained'
        >
          <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
          Save
        </Button>
      </div>
    </form>
  )
}

export default SuburbForm
