import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
    rolename: string
  status: boolean
}

const AddRole = ({ onClose, fetchData }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
        rolename: '',
      status: false
    }
  })

  const [status, setStatus] = useState<number>(1)

  const onSubmit = (data: FormData) => {

    const query = `mutation my {
      createUserRoles5AAB(input: {RoleName: "${data.rolename}", Status: ${data.status}}) {
        ID
        RoleName
        Status
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {      
        
          fetchData()
          onClose()
          toast.success('RoleName Added Successfully')
        
      })
      .catch((err: any) => {
        console.error('Error saving data:', err)
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
        {' '}
        Role Name
      </Typography>

      <div>
        <Controller
          name='rolename'
          control={control}
          defaultValue=''
          rules={{ required: 'Rolename is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='rolename'
              name='rolename'
              label={
                <div>
                  <span
                    className='status'
                    style={{
                      color:
                       getColor()
                    }}
                  >
                    Role Name
                  </span>
                </div>
              }
              autoFocus
              inputProps={{
                style: {
                  color:
                    getColor()
                } 
              }}
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.rolename}
              helperText={errors.rolename && errors.rolename.message}
            />
          )}
        />
      </div>

      <div className='status-container'>
        <Controller
          name='status'
          control={control}
          // defaultValue={1}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='status' 
                color='primary'
                // checked={status === 1}
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

export default AddRole
