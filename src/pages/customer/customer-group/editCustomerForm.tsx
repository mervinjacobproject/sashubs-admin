import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  groupName: string
  status: any
}

const CutomerGroupEditForm = ({ employeegroupName, editStatus, onFetchData, editid, onCloseModal ,customergroupname}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
  })

  useEffect(() => {
    onFetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFormDetails = useCallback(
    (editid: any) => {
      const query = `query MyQuery {
        getCustomerGroup5AAB(ID: ${editid}) {
          GroupName
          ID
          LastModified
          Status
        }
      }
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          
          setValue('groupName', res.data.data.getCustomerGroup5AAB.GroupName)
          setValue('status', res.data.data.getCustomerGroup5AAB.Status)
        })
        .catch(err => {
        //  console.error(err);
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
    debugger
    const designationExists = customergroupname?.some((item: any) => item.GroupName.toLowerCase() === editedData.groupName.toLowerCase() && item.ID !== editid)

    if (designationExists) {
      toast.error('Designation is already exist')
      return
    }
 else{
    const query = `mutation my {
      updateCustomerGroup5AAB(input: {ID: ${editid}, GroupName: "${editedData.groupName}", Status: ${editedData.status}, LastModified: ""}) {
        GroupName
        ID
        LastModified
        Status
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', 
      'Content-Type': 'application/json'
    };
    ApiClient.post(`${AppSink}`, { query }, { headers })
    .then(res =>{
      onCloseModal()
      toast.success('Updated successfully')
      onFetchData()
    })
      .catch(error => {
      //  console.error(error);
      });
  }
}

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
          color: getColor()
        }}
      >
        Customer Group
      </Typography>

      <div>
        <Controller
          name='groupName'
          control={control}
          defaultValue={employeegroupName}
          rules={{ required: 'Group Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='groupName'
              label={
                <div>
                  <span
                    className='status'
                    style={{
                      color: getColor()
                    }}
                  >
                    Group Name
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              inputProps={{
                style: { color: getColor() },
                onInput: (e:any) => {
                  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                }
              }}
              autoFocus
              margin='normal'
              error={!!errors.groupName}
              helperText={errors.groupName && errors.groupName.message}
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
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                color='primary'
              />
              <label
                style={{
                  color: getColor()
                }}
              >
                {field.value ? 'Active' : 'Inactive'}
              </label>
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
          <Icon
            style={{ marginRight: '5px' }}
            icon='material-symbols-light:save-outline'
            fontSize='1.5rem'
            width={25}
            height={25}
          />
          Update
        </Button>
      </div>
    </form>
  )
}
export default CutomerGroupEditForm
