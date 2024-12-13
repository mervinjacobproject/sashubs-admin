import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerSettings'
import AppSink from 'src/commonExports/AppSink'
import { useSSR } from 'react-i18next'

interface FormData {
  username: string
  password: string
  sender_address: any
  status: any
  email: any
}

// moduletype=bill_settings&apitype=update&id=1&username=${username}&password=${password}&sender_address=${sender_address}&prefix=${prefix}

// moduletype=bill_settings&apitype=list&id=1

const EditSendGridForm = ({ editId, editStatus, fetchData, resetEditid, rowId,rowData }: any) => {
  const[item, setItem] = useState([])
  
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
      sender_address: '',
      email: '',
      status: 1
    }
  })

  

  const getFormDetails = useCallback(
    (rowId: any) => {
      
      const query = `query MyQuery {
        getSendGrid5AAB(SGID: ${rowId}) {
          APIKey
          IP
          Password
          SEmail
          SAddress
          SGID
          Status
          Username
        }
      }
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
        'Content-Type': 'application/json'
      };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setItem(res.data.data.getSendGrid5AAB)
          
        })

        .catch(err => {
          // console.error('Something went wrong', err);
        })
    },
    []
  )

  useEffect(() => {
    if (rowId) {
      getFormDetails(rowId)
    }
  }, [rowId, getFormDetails])

 

  useEffect(() => {
    if (rowId && rowData?.row) {
        setValue('username', rowData.row.Username)
        setValue('password', rowData.row.Password)
        setValue('sender_address', rowData.row.SAddress)
        setValue('email', rowData.row.SEmail)
        setValue('status', rowData.row.Status)
    }
}, [rowId, rowData, setValue])


 

  

  useEffect(() => {
    return () => {
      resetEditid()
    }
  })

  const onSubmit = (data: FormData) => {

    const query = `mutation my {
      updateSendGrid5AAB(input: {APIKey: "", IP: "", Password: "${data.password}", SAddress: "${data.sender_address}", SEmail: "${data.email}", SGID: ${rowId}, Status: true, Username: "${data.username}"}) {
        APIKey
        IP
        Password
        SAddress
        SEmail
        SGID
        Status
        Username
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
      'Content-Type': 'application/json'
    };

  
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        if (res.data && res.data.length > 0) {
          const { sender_address, username, email, password, status } = res.data[0]
          setValue('username', username)
          setValue('sender_address', sender_address)
          setValue('password', password)
          setValue('email', email)
          setValue('status', status)
        }
        toast.success(res.data[0]?.status)
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
        sx={{ display: 'flex', justifyContent: 'center', fontSize: '20px', fontWeight: 600, fontFamily: 'sans-serif' }}
      >
        {' '}
        Send Grid Details
      </Typography>

      <div>
        <Controller
          name='username'
          control={control}
          defaultValue=''
          rules={{ required: 'username Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='username'
              label={
                <div>
                  <span
                    className='username'
                    style={{
                      color:
                      getColor()
                    }}
                  >
                    UserName
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.username}
              helperText={errors.username && errors.username.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='password'
          control={control}
          rules={{
            required: 'password is required'
          }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='password'
              label={
                <div>
                  <span
                    className='username'
                    style={{
                      color:
                      getColor()
                    }}
                  >
                    Password
                  </span>
                </div>
              }
              // type="number"
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.password}
            />
          )}
        />
        {errors.password && (
          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
            {String(errors.password.message)}
          </Typography>
        )}
      </div>

      <div>
        <Controller
          name='email'
          control={control}
          defaultValue=''
          rules={{ required: 'email Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='email'
              // label={
              //   <div>
              //     <span className='status-container'>Email</span>
              //   </div>
              // }
              label={
                <div>
                  <span
                    className='username'
                    style={{
                      color:
                      getColor()
                    }}
                  >
                    Email
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.email}
              // helperText={errors.email && errors.email.message}
            />
          )}
        />
        {errors.email && (
          <Typography variant='caption' color='error' sx={{ mt: 1 }}>
            {String(errors.email.message)}
          </Typography>
        )}
      </div>

      <div>
        <Controller
          name='sender_address'
          control={control}
          defaultValue=''
          rules={{ required: 'sender_address is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='sender_address'
              label={
                <div>
                  <span
                    className='username'
                    style={{
                      color:
                      getColor()
                    }}
                  >
                    Address
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              margin='normal'
              error={!!errors.sender_address}
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
          id='status'
          name='status'
          checked={Boolean(field.value)} 
          onChange={e => field.onChange(e.target.checked)}
          color='primary'
        />
        <label htmlFor='status' style={{color:getColor()}}>
          {Boolean(field.value) ? 'Active' : 'Inactive'} 
        </label>
      </>
    )}
  />
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
          Save
        </Button>
      </div>
    </form>
  )
}

export default EditSendGridForm
