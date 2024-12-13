import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'

interface FormData {
  Tax: any
  suburb_name: string
  stateid: any
  countryid: any
  status: any
}

const EditSuburbForm = ({
  editId,
  fetchData,
  onCloseModal,
  rowCount,
  cityName,
  countryID,
  stateId,
  editStatus
}: any) => {
  const [countryName, setCountryName] = useState('')
  const [stateData, setStateData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [stateValue, setStateValue] = useState<any[]>([]);
  const [country, setCountry] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      suburb_name: cityName,
      countryid: countryID,
      Tax: stateId,
      status: editStatus
    }
  })
  useEffect(() => {
    setValue('status', editStatus)
  }, [editStatus])
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
  const fetchState = async () => {
    try {
      const res = await ApiClient.post(`/getstates`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setStateValue(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  useEffect(() => {
    fetchState()
    fetchCountry()
  }, [])
  const fetchStateData = async (countryId: string) => {
    try {
      const response = await ApiClient.post(`/getstatedetail?CountryID=${countryId}`)
      setStateData(response.data.data)
    } catch (error) {
     // console.error('Error fetching states:', error)
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

  const onSubmit = async (editedData: FormData) => {
    try {
      const requestData = {
        Id: editId,
        StateID: editedData.Tax,
        CountryID: editedData.countryid,
        City: editedData.suburb_name,
        Status: editedData.status
      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/updatecities`

      const response = await ApiClient.post(apiEndpoint, requestData, { headers })

      if (response.status === 200) {
        onCloseModal()
        toast.success('Updated successfully')
        fetchData()
      }
    } catch (error) {
      //  console.error(error)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center'
        }}
      >
        Edit City{' '}
      </Typography>
      <div>
        <Controller
          name='suburb_name'
          control={control}
          defaultValue=''
          rules={{ required: 'Suburb Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='suburb_name'
              label={
                <div>
                  <span className='status' style={{ color: getColor() }}>
                    City Name
                  </span>
                </div>
              }
              variant='outlined'
              inputProps={{
                style: { color: getColor() }
              }}
              fullWidth
              onChange={e => {
                let inputValue = e.target.value
                // Allow letters and spaces only
                inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '')
                // Capitalize the first letter of each word
                inputValue = inputValue.replace(/\b\w/g, char => char.toUpperCase())
                field.onChange(inputValue)
              }}
              margin='normal'
              error={!!errors.suburb_name}
              helperText={errors.suburb_name && errors.suburb_name.message}
            />
          )}
        />
      </div>

      <Grid item xs={6}>
        <Controller
          name='Tax'
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={stateValue.sort((a: any, b: any) => a.StateName.localeCompare(b.StateName))}
                getOptionLabel={data => data.StateName || ''}
                value={
                  stateValue.find((tax: any) => {
                    return tax.id === watch('Tax')
                  }) || null
                }
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setValue('Tax', newValue?.id || null)
                  setCountryName(newValue?.StateName)
                }}
                isOptionEqualToValue={(option, value) => {
                  return option?.id === value?.id
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id='Tax'
                    label={
                      <div>
                        <span className='status' style={{ color: getColor() }}>
                          State Name
                        </span>
                      </div>
                    }
                    fullWidth
                  />
                )}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='countryid'
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={country.sort((a: any, b: any) => a.CountryName.localeCompare(b.CountryName))}
                getOptionLabel={data => data.CountryName || ''}
                value={
                  country.find((countryid: any) => {
                    return countryid.id === watch('countryid')
                  }) || null
                }
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setValue('countryid', newValue?.id || null)
                  setCountryName(newValue?.CountryName)
                }}
                isOptionEqualToValue={(option, value) => {
                  return option?.id === value?.id
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id='countryid'
                    label={
                      <div>
                        <span className='status' style={{ color: getColor() }}>
                          Country Name
                        </span>
                      </div>
                    }
                    fullWidth
                  />
                )}
              />
            </>
          )}
        />
      </Grid>
      <div className='status-container'>
        <Controller
          name='status'

          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='status'
                checked={field.value == 1} // Convert number to boolean
                onChange={(e: any) => {
                  const isChecked = e.target.checked
                  setValue('status', isChecked ? 1 : 0, { shouldDirty: true }) // Set status as 1 or 0 and mark as dirty
                }}
                color='primary'
              />
              <label
                style={{
                  color: getColor()
                }}
              >
                {field.value == 1 ? 'Active' : 'Inactive'} {/* Show label based on 1 or 0 */}
              </label>
            </>
          )}
        />
      </div>
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
          disabled={!isDirty}
          variant='contained'
        >
          <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
          Update
        </Button>
      </div>
    </form>
  )
}
export default EditSuburbForm
