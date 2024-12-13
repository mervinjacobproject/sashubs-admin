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
  state_name: string
  status:any

}

const StateEditForm = ({ editId, fetchData, StateName,onCloseModal, countryId, editStatus}: any) => {
  const [countryName, setCountryName] = useState('')
  const [allCountry, setAllCountry] = useState<any[]>([]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      state_name: StateName,
      Tax:countryId,
      status: editStatus
    }
  })
  useEffect(() => {
    setValue('status', editStatus)
  }, [editStatus])
  const onSubmit = async (editedData: FormData) => {
    try {
      const requestData = {
        Id: editId,
        StateName: editedData.state_name,
        CountryID: editedData.Tax,
        Status: editedData.status
      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/updatestate`

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

  useEffect(() => {
    fetchCountryName()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant='h6'
        sx={{
          color: getColor(),
          textAlign: 'center',
          fontWeight: 'bold',
          // marginTop: '20px',
        }}
      >
        Edit State Name{' '}
      </Typography>
      <div>
        <Controller
          name='state_name'
          control={control}
          defaultValue=''
          rules={{ required: 'Suburb Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='state_name'
              label={
                <div>
                  <span className='status'>State Name</span>
                </div>
              }
              inputProps={{
                style: { color: getColor() }
              }}
              variant='outlined'
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
              error={!!errors.state_name}
              helperText={errors.state_name && errors.state_name.message}
            />
          )}
        />
      </div>
      <Grid item xs={6}>
        <Controller
          name="Tax"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={allCountry.sort((a: any, b: any) => a.CountryName.localeCompare(b.CountryName))}
                getOptionLabel={(data) => data.CountryName || ''}
                value={
                  allCountry.find((tax:any) => {
                    return tax.id === watch('Tax')
                  }) || null
                }
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || null)
                  setValue('Tax', newValue?.id || null)
                  setCountryName(newValue?.CountryName)
                }}
                isOptionEqualToValue={(option, value) => {
                  return option?.id === value?.id
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    id='Tax'
                    label={
                      <div>
                        <span style={{ color: getColor() }} className="status">
                          Country
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

      <div style={{ display: 'flex', justifyContent: 'end', paddingTop: '5px' }}>
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
export default StateEditForm
