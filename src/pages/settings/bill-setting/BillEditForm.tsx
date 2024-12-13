import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerSettings'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  type: string
  format: string
  value: any
  status: any
  email: any
}


const BillEditForm = ({ editId, rowId, editStatus, fetchData, resetEditid }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      type: '',
      format: '',
      value: '',
      status: 0
    }
  })

  

  const getFormDetails = useCallback(
    (rowId: any) => {
      const query = `query MyQuery {
      getBillSettings5AAB(ID: ${rowId}) {
        CurrentValue
        Format
        ID
        InsertedUserId
        InsertedBy
        Prefix
        Type
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
      'Content-Type': 'application/json'
    };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
        
          setValue('format', res.data.data.getBillSettings5AAB.Format)
          setValue('type', res.data.data.getBillSettings5AAB.Prefix)
          setValue('value', res.data.data.getBillSettings5AAB.CurrentValue)
        })

        .catch(err => {
          // console.error('Something went wrong', err);
        })
    },
    [setValue]
  )

  useEffect(() => {
    if (rowId) {
      getFormDetails(rowId)
    }
  }, [rowId, getFormDetails])

  useEffect(() => {
    return () => {
      resetEditid()
    }
  })

  const onSubmit = (data: FormData) => {
    const query = `mutation my {
      updateBillSettings5AAB(input: {CurrentValue: ${data.value}, Format: ${data.format},ID: ${rowId}, Prefix: "${data.type}"}) {
        CurrentValue
        Format
        ID
        InsertedBy
        InsertedUserId
        Prefix
        Type
      }
    }
    `
    
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
      'Content-Type': 'application/json'
    };

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
            closeRightPopupClick()
            fetchData()
      })
      .catch(err => {
        console.error('Something went wrong', err);
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
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'sans-serif',
          padding: '10px'
        }}
      >
        {' '}
        Bill Setting Invoice
      </Typography>

      <div>
        <Controller
          name='type'
          control={control}
          defaultValue=''
          rules={{ required: 'Type Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='type'
              // label={
              //   <div>
              //     <span className='status-container'>Prefix</span>

              //   </div>
              // }
              label={
                <div>
                  <span
                    className='prefix'
                    style={{
                      color: getColor()
                    }}
                  >
                    Prefix
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.type}
              helperText={errors.type && errors.type.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='format'
          control={control}
          rules={{
            required: 'Format is required'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='format'
              // label={
              //   <div>
              //     <span className='status-container'>Format Digits</span>

              //   </div>
              // }
              label={
                <div>
                  <span
                    className='prefix'
                    style={{
                      color: getColor()
                    }}
                  >
                    Format Digits
                  </span>
                </div>
              }
              type='number'
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.format}
              helperText={errors.format && errors.format.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='value'
          control={control}
          defaultValue=''
          rules={{ required: 'Current value  is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='value'
              // label={
              //   <div>
              //     <span className='status-container'>Starting value</span>

              //   </div>
              // }
              label={
                <div>
                  <span
                    className='prefix'
                    style={{
                      color: getColor()
                    }}
                  >
                    Starting value
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.value}
              // helperText={errors.value && errors.value.message}
            />
          )}
        />
        {errors.value && (
          <Typography variant='caption' color='error' sx={{ fontSize: '14px' }}>
            {String(errors.value.message)}
          </Typography>
        )}
      </div>

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
          Update
        </Button>
      </div>
    </form>
  )
}

export default BillEditForm
