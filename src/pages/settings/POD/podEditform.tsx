import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useEffect, useState , useCallback } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  podname: string
  order: string
  status: any
}

const PodEditForm = ({ designationName, editStatus, onFetchData, editid, onCloseModal, OrderName , fetchData }: any) => {

  const[item, setItem] = useState([])
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      podname: designationName,
      order: OrderName,

      status: editStatus === 'Active'
    }
  })



  const getFormDetails = useCallback(
    (editid: any) => {
      
      const query = `query MyQuery {
        getPODSettings5AAB(UID: ${editid}) {
          CreatedDate
          LastModified
          Order
          PODName
          UID
          Status
        }
      }
      
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
        'Content-Type': 'application/json'
      };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
       
          setValue('podname',res.data.data.getPODSettings5AAB.PODName)
          setValue('order',res.data.data.getPODSettings5AAB.Order)
          setValue('status',res.data.data.getPODSettings5AAB.Status)
          // setItem(res.data.data.listPODSettings5AABS)
          
        })

        .catch(err => {
          // console.error('Something went wrong', err);
        })
    },
    [setValue]
  )




 

  useEffect(() => {
    if (editid) {
      getFormDetails(editid)
    }
  }, [editid, getFormDetails])


  useEffect(() => {
    onFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const onSubmit = async (editedData: any) => {
      const query = `mutation my {
        updatePODSettings5AAB(input: {CreatedDate: "", LastModified: "", Order: ${editedData.order}, PODName: "${editedData.podname}", Status: ${editedData.status}, UID: ${editid}}) {
          CreatedDate
          LastModified
          Order
          PODName
          Status
          UID
        }
      }`;
  
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
        'Content-Type': 'application/json'
      };
  
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          onCloseModal();
          onFetchData()
        })
        .catch(error => {
          console.error('Error updating podname:', error);
        });
    };
  


  useEffect(() => {
    setValue('status', editStatus === 'Active')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editStatus])

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
          // defaultValue={designationName}
          rules={{ required: 'PodName is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='podname'
              // label='Podname'
              label={
                <div>
                  <span className='status' style={{
                color:
                getColor()
              }}>Podname</span>

                </div>
              }
              variant='outlined'
              autoFocus
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
          // defaultValue={designationName}
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

      {/* <div className='status-container'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                checked={field.value === 1}
                onChange={e => field.onChange(e.target.checked ? '1' : '0')}
                color='primary'
              />
              <label>{field.value ? 'Active' : 'Inactive'}</label>
            </>
          )}
        />
      </div> */}

<div className='status-container'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='status'
                name='status'
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                color='primary'
              />
              <label htmlFor='status' style={{color:getColor()}}>{field.value ? 'Active' : 'Inactive'}</label>
            </>
          )}
        />
      </div>

      <div>
        <Button
          disabled={!isDirty}
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
          variant='contained'
          
        >
          <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
            Update
        </Button>
      </div>
    </form>
  )
}


export default PodEditForm
