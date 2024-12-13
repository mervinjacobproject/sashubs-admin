import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  CategoryName: string
  status: any
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
const CategoryForm = ({ onClose, onFetchData, customergroupname }: any) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      CategoryName: '',
      status: true
    }
  })

  const onSubmit = async(data: FormData) => {
   
    const statusValue = data.status ? 1 : 0

      ApiClient.post(`/categorycreate?CategoryName=${data.CategoryName}&Status=${statusValue}`)

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
        Add Category
      </Typography>

      <div>
        <Controller
          name='CategoryName'
          control={control}
          defaultValue=''
          rules={{ required: 'CategoryName is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='CategoryName'
              label={
                <div>
                  <span
                    className='status'
                    style={{
                      color: getColor()
                    }}
                  >
                    Category Name
                  </span>
                </div>
              }
              autoFocus
              inputProps={{
                style: { color: getColor() },
                onInput: (e:any) => {
                  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                }
              }}
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.CategoryName}
              helperText={errors.CategoryName && errors.CategoryName.message}
            />
          )}
        />
      </div>

      <div className='status-container'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='Status'
                color='primary'
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
              <label
                htmlFor='Status'
                style={{
                  color: getColor()
                }}
              >
                {' '}
                <Typography sx={{ fontWeight: 600 }}>{field.value ? 'Active' : 'Inactive'}</Typography>
              </label>
            </>
          )}
        />
      </div>


      <div>
        <Button
          type='submit'
          sx={{
            float: 'right',
            marginRight: '2px',
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
          <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
          Save
        </Button>
      </div>
    </form>
  )
}
export default CategoryForm
