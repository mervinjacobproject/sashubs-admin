import { useForm, Controller } from 'react-hook-form'
import { Button, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Autocomplete from '@mui/material/Autocomplete'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  statename: string
  country: string
  groupName: string
  status: number
}

const StateForm = ({ onClose, onFetchData, }: any) => {
  const [countryName, setCountryName] = useState('')
  const [allCountry, setAllCountry] = useState<any[]>([]);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      statename: '',
      country: ''
    }
  })
  useEffect(() => {
    fetchCountryName()
  }, [])
  const fetchCountryName = async () => {
    try {
      const res = await ApiClient.post(`/getcountry`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setAllCountry(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  const onSubmit = (data: FormData) => {
    ApiClient.post(`/createstate?StateName=${data.statename}&CountryID=${data.country}&Status=${data.status}`)
      .then((res: any) => {
        onFetchData()
        toast.success('Saved successfully')
        onClose()
      })
      .catch((err: any) => {
       // console.error('Error saving data:', err)
        toast.error('Error saving data')
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center'
        }}
      >
        Add State Form
      </Typography>

      <div>
        <Controller
          name='statename'
          control={control}
          defaultValue=''
          rules={{ required: 'statename is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='statename'
              autoFocus
              label={
                <div>
                  <span className='status'>State Name</span>
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
              error={!!errors.statename}
              helperText={errors.statename && errors.statename.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='country'
          control={control}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={allCountry.sort((a: any, b: any) => a.CountryName.localeCompare(b.CountryName))}
                getOptionLabel={(option: any) => option.CountryName || ''}
                value={allCountry?.find((pricevalue: any) => pricevalue?.id === watch('country')) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setCountryName(newValue.CountryName)
                }}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    id='country'
                    label={
                      <div>
                        <span
                          className='vehicleType'
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
      </div>
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
          variant='contained'
          disabled={!isDirty || !watch('country')}
        >
          <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
          Save
        </Button>
      </div>
    </form>
  )
}

export default StateForm
