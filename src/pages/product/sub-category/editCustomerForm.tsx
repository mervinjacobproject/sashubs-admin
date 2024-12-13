import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  groupName: string
  status: any
  Tax: string
}

const CutomerGroupEditForm = ({
  employeegroupName,
  editStatus,
  onFetchData,
  editid,
  onCloseModal,
  designation,
  customergroupname
}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {  
      status: editStatus,
    }
  })

  const [employee, setEmployee] = useState<any>('')
  const [catageoryname, setcatageoryname] = useState<any>('')
  const [catageoryId, setcatageoryId] = useState<any>('')

  // useEffect(() => {
  //   onFetchData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const getFormDetails = useCallback(
    async (editid: any) => {
      try {
        const selectedRow = designation.find((row: any) => row.id === editid)

        if (selectedRow) {

          setValue('groupName', selectedRow.SubCategoryName)
          setValue('Tax', selectedRow.CategoryName)
          setcatageoryname(selectedRow.CategoryName)
          //setValue('status', selectedRow.Status == 1)
        }
      } catch (err) {
        console.error('Something went wrong', err)
      }
    },
    [designation, setValue, setcatageoryname]
  )

  useEffect(() => {
    if (editid) {
      getFormDetails(editid)
    }
  }, [editid, getFormDetails])


  const fetchEmployee = async () => {
    try {
      const response = await ApiClient.post('/getbydetail?status=1')
      const employeeList = await response.data.data
      setEmployee(employeeList)
    } catch (error) {
      console.error('Error fetching employee data:', error)
    }
  }

  useEffect(() => {
    fetchEmployee()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data: FormData) => {
    const { groupName, status } = data
    const statusValue = status ? 1 : 0
    ApiClient.post(
      `/updatesubcategory?Id=${editid}&SCName=${groupName}&Status=${statusValue}&CategoryID=${catageoryId}`
    )
      .then(res => {
        if (res.data && res.data.length > 0) {
          const { state_name } = res.data[0]
          setValue('groupName', state_name)
        }
        onCloseModal()
        onFetchData()
      })
      .catch(err => {
        console.error('Something went wrong', err)
      })
  }

  useEffect(() => {
    setValue('status', editStatus)
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
          color: getColor(),
          textAlign: 'center',
          fontWeight: 'bold'
          // marginTop: '20px',
        }}
      >
        Edit Sub-Category
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
                    SubCategory Name
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              inputProps={{
                style: { color: getColor() },
                onInput: (e: any) => {
                  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
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
      <div>
        <Controller
          name='Tax'
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={employee}
              getOptionLabel={data => data.CategoryName || ''}
              value={
                Array.isArray(employee)
                  ? employee.find(pricevalue => pricevalue.CategoryName === watch('Tax')) || null
                  : null
              }
              onChange={(_, newValue) => {
                field.onChange(newValue?.CategoryName || '')
                setcatageoryname(newValue?.CategoryName)
                setcatageoryId(newValue?.id)
              }}
              isOptionEqualToValue={(option, value) => option?.CategoryName === value?.CategoryName}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={
                    <div>
                      <span style={{ color: getColor() }} className='status'>
                        Category Name
                      </span>
                    </div>
                  }
                  fullWidth
                />
              )}
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
                checked={field.value == 1}
                onChange={(e: any) => {
                  const isChecked = e.target.checked
                  setValue('status', isChecked ? 1 : 0, { shouldDirty: true })
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
export default CutomerGroupEditForm
