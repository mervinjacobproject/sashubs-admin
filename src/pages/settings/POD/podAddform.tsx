import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  podname: string
  order: string
  status: boolean
}

const PodForm = ({ onClose, onFetchData }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors,isDirty }
  } = useForm<FormData>({
    defaultValues: {
      podname: '',
      order: '',
      status: false
    }
  })
  const [status, setStatus] = useState<number>(1)

  const onSubmit = (data: FormData) => {
    // const statusValue = data.status ? 1 : 0
  
    const query = `mutation my {
      createPODSettings5AAB(input: {CreatedDate: "", LastModified: "", Order: ${data.order}, PODName: "${data.podname}", Status: ${data.status}}) {
        CreatedDate
        LastModified
        Order
        PODName
        Status
        UID
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
      'Content-Type': 'application/json'
    };
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        onFetchData()

        toast.success('Saved successfully')

        onClose()
      })
      .catch((err: any) => {
        // Show error toast if needed
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
          color:
          getColor()
        }}
      >
        Podname
      </Typography>

      <div>
        <Controller
          name='podname'
          control={control}
          defaultValue=''
          rules={{ required: 'PodName is required' }}
          render={({ field }) => (
            <CustomTextField
              autoFocus
              {...field}
              id='podname'
              // label='PodName'
              label={
                <div>
                  <span className='status' style={{
                color:
                getColor()
              }}>PodName</span>

                </div>
              }
              variant='outlined'
              inputProps={{
                style: {  color:
                  getColor()  } // Change color here to the desired color
              }}
              fullWidth
              margin='normal'
              error={!!errors.podname}
              helperText={errors.podname && errors.podname.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='order'
          control={control}
          defaultValue=''
          rules={{ required: 'Order is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='order'
              // label='Order'
              label={
                <div>
                  <span className='status' style={{
                color:
                getColor()
              }}>Order</span>

                </div>
              }
              variant='outlined'
              inputProps={{
                style: {  color:
                  getColor() } // Change color here to the desired color
              }}
              fullWidth
              margin='normal'
              error={!!errors.order}
              helperText={errors.order && errors.order.message}
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
                id='status' // Added unique id attribute
                color='primary'
                onChange={e => {
                  setStatus(e.target.checked ? 1 : 0)
                  setValue('status', e.target.checked ? true : false)
                }}
              />
              <label htmlFor='status' style={{color:getColor()}}>{status === 1 ? 'Active' : 'Inactive'}</label>
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

export default PodForm
