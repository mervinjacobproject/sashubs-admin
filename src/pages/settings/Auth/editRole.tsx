import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
    rolename: string
  status: any
}

const EditRole = ({ designationName, editStatus, onFetchData, editid, onCloseModal }: any) => {
    
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
        rolename: designationName,
      status: editStatus === 1
    }
  })

  useEffect(() => {
    onFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFormDetails = useCallback(
    (editid: any) => {
      
    

      const query = `query MyQuery {
        getUserRoles5AAB(ID: ${editid}) {
          ID
          RoleName
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
        
          setValue('rolename',res.data.data.getUserRoles5AAB.RoleName)
          setValue('status',res.data.data.getUserRoles5AAB.Status)
          // setValue('groupName', res.data.data.getCustomerGroup5AAB.GroupName)
          // setValue('status', res.data.data.getCustomerGroup5AAB.Status)
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

  const onSubmit = async (editedData: any) => {
    const statusValue = editedData.status ? 1 : 0;

    const query = `mutation my {
      updateUserRoles5AAB(input: {ID: ${editid}, Status: ${editedData.status}, RoleName: "${editedData.rolename}"}) {
        ID
        RoleName
        Status
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
      'Content-Type': 'application/json'
    };
  
  
      ApiClient.post(`${AppSink}`, { query }, { headers })
     .then(res =>{
      onCloseModal()
      toast.success('Updated successfully')
      onFetchData()
    })

      .catch(error => {
        console.error('Error updating podname:', error);
      });
  }
  

  useEffect(() => {
    setValue('status', editStatus === 1)
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
      <Typography variant='h6' sx={{
                color:
                 getColor()
              }}>Role Name</Typography>
      <div>
        <Controller
          name='rolename'
          control={control}
          defaultValue={designationName}
          rules={{ required: 'Rolename is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='rolename'
              name='rolename'
              // label='Designation'
              label={ 
                <div>
                  <span className='status' style={{
                color:
                 getColor()
              }}>Role Name</span>

                </div>
              }
              variant='outlined'
              inputProps={{
                style: {  color:
                  getColor()  } 
              }}
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
              <label htmlFor='status' style={{color:getColor()}}>{field.value ? "Active" : "Inactive"}</label>
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

export default EditRole
