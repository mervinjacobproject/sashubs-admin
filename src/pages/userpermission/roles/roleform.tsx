import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer1'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'

interface FormData {
  RoleName: string
  Status: boolean
  DisplayOrder: any
}
interface FileProp {
  name: string
  type: string
  size: number
}
const ParentForm = ({ rowData, onClose, fetchData }: any) => {
  const [loader, setloder] = useState(false)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      RoleName: '',
      Status: true,
      DisplayOrder: ''
    }
  })

  useEffect(() => {
    setloder(true)
    const mappedStatus: any = rowData?.row?.Status == true ? 1 : 0
    setValue('RoleName', rowData?.row.RoleName)
    setValue('Status', mappedStatus)
    setValue('DisplayOrder', rowData?.row.DisplayOrder)
    setloder(false)
  }, [rowData, setValue])

  const onSubmit = async (data: any) => {
    let payload: any = {
      Status: data.Status ? true : false,
      RoleName: data.RoleName.charAt(0).toUpperCase() + data.RoleName.slice(1),
      DisplayOrder: Number(data.DisplayOrder)
    }
    if (rowData?.row.Id) {
      const endpoint = 'api/userspermission/updateuserroles'
      payload = { ...payload, Id: rowData?.row.Id }
      ApiLoginClient.put(endpoint, payload)
        .then((res: any) => {
          toast.success(res?.data?.message)
          closeRightPopupClick()
          fetchData()
        })
        .catch((err: any) => {
          console.log(err.message)
        })
    } else {
      const endpoint = 'api/userspermission/createuserroles'
      ApiLoginClient.post(endpoint, payload)
        .then(res => {
          toast.success(res?.data?.message)
          closeRightPopupClick()
          fetchData()
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }

  return (
    <>
      {loader ? (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid xs={12} sx={{ marginTop: '25px' }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}
          >
            <Grid item xs={12} sm={12}>
              <Controller
                name='RoleName'
                control={control}
                rules={{ required: 'Parent RoleName is required' }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={
                        <div>
                          <span
                            className='lastname'
                            style={{
                              fontSize: '14px'
                            }}
                          >
                            RoleName
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Enter your RoleName '
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[&A-Za-z0-9_-\s]*$/.test(inputValue) || inputValue === '') {
                          onChange(e)
                        }
                      }}
                    />
                    {errors.RoleName && (
                      <Typography variant='caption' color='error'>
                        {errors.RoleName.message as any}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className='empTextField'>
                <Controller
                  name='DisplayOrder'
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <CustomTextField
                        fullWidth
                        value={value}
                        label={
                          <>
                            <span
                              style={{
                                fontSize: '13px'
                              }}
                            >
                              Display Order
                            </span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '13px' }}>
                              *
                            </Typography>
                          </>
                        }
                        placeholder='Display Order'
                        onChange={e => {
                          const inputValue = e.target.value
                          if (/^[0-9\s]*$/.test(inputValue) || inputValue === '') {
                            onChange(e)
                          }
                        }}
                      />
                      {errors.DisplayOrder && (
                        <Typography variant='caption' color='error'>
                          {errors.DisplayOrder.message as any}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: '' }}>
              <div className='empTextField' style={{ display: 'Grid', alignItems: 'center' }}>
                <Typography
                  sx={{ mb: 1, color: 'text.secondary', fontWeight: '600', fontSize: '12px', mr: 3, marginTop: '7px' }}
                >
                  <span
                    className='firstname'
                    style={{
                      fontSize: '14px'
                    }}
                  >
                    Status
                  </span>
                </Typography>
                <div>
                  <Controller
                    name='Status'
                    control={control}
                    defaultValue={true}
                    render={({ field }) => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Switch
                            checked={!!field.value}
                            onChange={e => field.onChange(e.target.checked)}
                            sx={{ paddingBottom: '0 !important' }}
                          />
                          <Typography sx={{ fontWeight: 600 }}>{field.value ? 'Active' : 'Inactive'}</Typography>
                        </div>
                      )
                    }}
                  />
                </div>
              </div>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                type='submit'
                sx={{
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
                    color: 'white'
                  }
                }}
                variant='contained'
              >
                <Icon onClick={onClose} width={25} height={25} icon={''} />
                Save
              </Button>
            </div>
          </form>
        </Grid>
      )}
    </>
  )
}

export default ParentForm
