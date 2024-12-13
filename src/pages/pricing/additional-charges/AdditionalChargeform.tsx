import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  name: string
  additionalCharge: string
  description: string
  status: any
}

const AdditionalChargeform = ({ editId, fetchData, resetEditid,rideData }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      additionalCharge: '',
      description: '',
      status: true
    }
  })

  const getFormDetails = useCallback(
    (editId: any) => {
      const query = `
      query MyQuery {
        getAdditionalCharges5AAB(ID:${editId}) {
          Charge
          Description
          ID
          Name
          Status
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      ApiClient.get(`${AppSink}?query=${encodeURIComponent(query)}`, { headers })
        .then(res => {
          if (res.data.data.getAdditionalCharges5AAB && res.data.data.getAdditionalCharges5AAB) {
            const { Name, Description, Status, Charge } = res.data.data.getAdditionalCharges5AAB
            setValue('name', Name)
            setValue('additionalCharge', Charge)
            setValue('description', Description)
            setValue('status', Status === true)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    [setValue]
  )

  useEffect(() => {
    if (editId) {
      getFormDetails(editId)
    }
  }, [editId, getFormDetails])

  useEffect(() => {
    return () => {
      resetEditid()
    }
  }, [resetEditid])

  const onSubmit = (data: FormData) => {
    const designationExists = rideData?.some(
      (item: any) => item.Name.toLowerCase() === data.name.toLowerCase() && item.ID
      !== editId
    )
    if (designationExists) {
      toast.error('Title already exist')
      return
    } 
    const statusValue = data.status ? true : false
    const query = editId
      ? `mutation my {
      updateAdditionalCharges5AAB(input: {Charge: "${data.additionalCharge}", Description: "${data.description}", Name: "${data.name}", Status:${statusValue}, ID: ${editId}}) {
        Charge
        ID
        Name
        Status
        Description
      }
    }`
      : `mutation my {
      createAdditionalCharges5AAB(input: {Charge: "${data.additionalCharge}", Description: "${data.description}", Name: "${data.name}", Status: ${data.status}}) {
        Charge
        Description
        ID
        Name
        Status
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    const requestQuery = query
    ApiClient.post(`${AppSink}`, { query: requestQuery }, { headers })
      .then(res => {
        closeRightPopupClick()
        editId ? toast.success('Updated Successfully') : toast.success('Saved Successfully')
        fetchData()
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, getFormDetails, setValue])

  const handleClose = () => {
    // console.log('Drawer close!')
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
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
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
        Additional Charges
      </Typography>

      <div>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              autoFocus
              onChange={(e) => {
                const inputValue = e.target.value;
                const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                field.onChange(modifiedValue)
              }}
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Name
                  </span>
                </div>
              }
              autoComplete='off'
              variant='outlined'
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='description'
          control={control}
          defaultValue=''
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='description'
              label={
                <div>
                  <span
                    className='firstname'
                    style={{
                      color: getColor()
                    }}
                  >
                    Description
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              onChange={(e) => {
                const inputValue = e.target.value;
                const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                field.onChange(modifiedValue)
              }}
              multiline
              rows={4}
              margin='normal'
              error={!!errors.description}
              helperText={errors.description && errors.description.message}
              autoComplete='off'
            />
          )}
        />
      </div>

      <div>
  <Controller
    name="additionalCharge"
    control={control}
    rules={{ required: 'Additional Charges are required' }}
    render={({ field }) => (
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: '10px',
             top: '65%',
             transform: 'translateY(-50%)',
            color: getColor(),
            zIndex: 1,
          }}
        >
          $
        </span>
        <CustomTextField
          {...field}
          label={
            <div>
              <span
                className="firstname"
                style={{
                  color: getColor(),
                }}
              >
                Additional Charges
              </span>
            </div>
          }
          type="number"
          variant="outlined"
          error={!!errors.additionalCharge}
          helperText={errors.additionalCharge?.message}
          fullWidth
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <span
                style={{
                  marginRight: '10px',
                }}
              >
                {/* This space is to offset the dollar symbol */}
              </span>
            ),
          }}
          style={{ paddingLeft: '20px' }} // Adjust padding to make space for the dollar symbol
        />
      </div>
    )}
  />
</div>


      <div className='status-container'>
        <Controller
          name='status'
          control={control}
          defaultValue={true}
          render={({ field }) => {
            return (
              <>
                <Switch
                  {...field}
                  checked={!!field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  color='primary'
                />
                <label>
                  {
                    <div>
                      <span
                        className='firstname'
                        style={{
                          color: getColor()
                        }}
                      >
                        {' '}
                        Status {field.value ? true : false}
                      </span>
                    </div>
                  }
                </label>
              </>
            )
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          type='submit'
          sx={{
            float: 'right',
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
          <Icon onClick={handleClose} icon='material-symbols-light:save-outline' width={25} height={25} />
          {editId ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
export default AdditionalChargeform
