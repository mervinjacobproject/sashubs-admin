import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  CountryName: any
  CountryCode: string
  // sortname: string
  status: any
}

const CountryForm = ({ editId, fetchData, resetEditid ,rideData,onClose}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      CountryName: '',
      CountryCode: '',
      // sortname: '',
      status: true
    }
  })

  useEffect(() => {
    if (editId.id) {
      setValue('CountryName', editId.Name)
      setValue('CountryCode', editId.PhoneCode)
      // setValue('sortname', editId.SortName)
      setValue('status', editId.Status)
    }
  }, [editId, setValue])



  useEffect(() => {
    return () => {
      resetEditid()
    }
  }, [resetEditid])



  const onSubmit = async (data: FormData) => {
    try {
    const designationExists = rideData?.some(
      (item: any) => item.CountryName.toLowerCase() === data.CountryName.toLowerCase() && item.id != editId.id
    )
    if (designationExists) {
      toast.error('Country Name already exist')
      return
    }
    const requestData = {
      CountryCode: data.CountryCode,
      CountryName:data.CountryName,
      Status: data.status
    }
    const requestEditedData = {
      Id: editId.id,
      CountryCode: data.CountryCode,
      CountryName:data.CountryName,
      Status: data.status
    }
    const body = editId.id
      ? requestEditedData
      : requestData

    const endpoint = editId.id
      ? `/updatecountry`
      : `/createcountry`

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    //const requestQuery = endpoint

    const response = await ApiClient.post(endpoint, body, { headers })
    if (response.status === 200) {
      onClose()
        editId.id ? toast.success('Updated Successfully') : toast.success('Saved Successfully')
        fetchData()
      }
    }
      catch(err) {
       // console.error( err)
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
        sx={{
          display: 'flex',
          justifyContent: 'center',
          // padding: '10px'
        }}
      >
        Add Country
      </Typography>

      <div>
        <Controller
          name='CountryName'
          control={control}
          defaultValue=''
          rules={{ required: 'Country Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              autoFocus
              id='CountryName'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Country Name
                  </span>
                </div>
              }
              variant='outlined'
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
              error={!!errors.CountryName}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='CountryCode'
          control={control}
          rules={{
            required: 'Country Code is required'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='CountryCode'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Country Code
                  </span>
                </div>
              }
              type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.CountryCode}
              helperText={errors.CountryCode && errors.CountryCode.message}
            />
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
          <Typography sx={{ fontWeight: 600 }}>
            {field.value == 1 ? 'Active' : 'Inactive'}
          </Typography>
        </label>
      </>
    )}
  />
</div>
</div>
      </Grid>
      <div>
        <Button
          type='submit'
          sx={{
            mb: 2,
            mr: 2,
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
          disabled={!isDirty || !isValid}
          variant='contained'
        >
          <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
         {editId.id ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  )
}
export default CountryForm
