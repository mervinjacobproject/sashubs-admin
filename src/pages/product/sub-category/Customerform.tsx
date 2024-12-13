import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Button, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  groupName: string
  Tax: any
  status: boolean
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
const Customergroupform = ({ onClose, onFetchData, customergroupname }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      groupName: '',
      status: true
    }
  })

  const [employee, setEmployee] = useState<any>('')
  const [catageoryId, setcatageoryId] = useState<any>('')

  const [selectedTaxCharge, setSelectedTaxCharge] = useState<any>({})
  const [stateid, setStateId] = useState([])

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
    // setValue('Tax', selectedCountry?.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const onSubmit = (data: FormData) => {
  //   const designationExists = customergroupname?.some(
  //     (item: any) => item.GroupName.toLowerCase() === data.groupName.toLowerCase()
  //   )

  //   if (designationExists) {
  //     toast.error('Designation is already exist')
  //     return
  //   } else {
  //     const query = `mutation my {
  //     createCustomerGroup5AAB(input: {GroupName: "${data.groupName}", LastModified: "", Status: ${data.status}}) {
  //       GroupName
  //       ID
  //       LastModified
  //       Status
  //     }
  //   }
  //   `
  //     const headers = {
  //       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
  //       'Content-Type': 'application/json'
  //     }

  //     ApiClient.post(`${AppSink}`, { query }, { headers })
  //       .then((res: any) => {
  //         onFetchData()
  //         toast.success('Saved successfully')
  //         onClose()
  //       })
  //       .catch((err: any) => {
  //         toast.error('Error saving data')
  //       })
  //   }
  // }

  const onSubmit = (data: FormData) => {
    const statusValue = data.status ? 1 : 0
    ApiClient.post(`/createsubcategory?SCName=${data.groupName}&Status=${statusValue}&CategoryID=${catageoryId}`)
      .then((res: any) => {
        // if (res.data[0].message === 'State Name already Exists..') {
        //   toast.error('State Name already Exists..')
          // reset({ groupName: '' })
        // } else {
          onFetchData()
          toast.success('Saved successfully')
          onClose()
        // }
      })
      .catch((err: any) => {
        console.error('Error saving data:', err)
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

        }}
      >
        Add SubCategory
      </Typography>

      <div>
        <Controller
          name='groupName'
          control={control}
          defaultValue=''
          rules={{ required: 'groupName is required' }}
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
              autoFocus
              inputProps={{
                style: { color: getColor() },
                onInput: (e: any) => {
                  e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                }
              }}
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.groupName}
              helperText={errors.groupName && errors.groupName.message}
            />
          )}
        />
      </div>

      {/* <Grid item xs={6}> */}
      <div>
        <Controller
          name='Tax'
          control={control}

          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <>
              <Autocomplete
                {...field}
                options={employee}
                getOptionLabel={data => data.CategoryName || ''}
                value={employee.CategoryName}
                onChange={(_, newValue) => {
                  field.onChange(newValue.CategoryName)
                  setcatageoryId(newValue?.id)
                }}
                isOptionEqualToValue={(option, value) => option?.CategoryName === value?.CategoryName}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                      id='Tax'
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
            </>
          )}
        />
      </div>
      {/* </Grid> */}

      <div className='status-container'>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='status'
                color='primary'
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
              <label
                htmlFor='status'
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
export default Customergroupform
