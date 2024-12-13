import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  CategoryName: string
  status: number // Use number type to match your API's expected format
}

const CategoryEditForm = ({
  employeegroupName,
  editStatus,
  onFetchData,
  editid,
  onCloseModal,
  customergroupname
}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      CategoryName: employeegroupName,
      status: editStatus
    }
  })
  const onSubmit = async (editedData: FormData) => {
    try {
      const requestData = {
        Id: editid,
        CategoryName: editedData.CategoryName,
        Status: editedData.status
      }
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      const apiEndpoint = `/updatecategory`

      const response = await ApiClient.post(apiEndpoint, requestData, { headers })

      if (response.status === 200) {
        onCloseModal()
        toast.success('Updated successfully')
        onFetchData()
      }
    } catch (error) {
    //  console.error(error)
    }
  }

  useEffect(() => {
    setValue('status', editStatus)
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
          color: getColor(),
          textAlign: 'center',
          fontWeight: 'bold',
          // marginTop: '20px',
        }}
      >
        Edit Category
      </Typography>

      <div>
        <Controller
          name='CategoryName'
          control={control}
          rules={{ required: 'Group Name is required' }}
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
              variant='outlined'
              fullWidth
              inputProps={{
                style: { color: getColor() },
                onInput: (e: any) => {
                  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                }
              }}
              autoFocus
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

export default CategoryEditForm
