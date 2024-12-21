import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, CircularProgress, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer1'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'

interface FormData {
  MasterName: string
  Url: string
  Icon: string
  Status: boolean
  Childof: any
  DisplayOrder: any
}

const ParentForm = ({ rowData, onClose, fetchData, chargeList }: any) => {
  const [loader, setloder] = useState(false)
  const [ChildId, setChildId] = useState(0)
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      MasterName: '',
      Icon: '',
      Url: '',
      Status: true,
      DisplayOrder: '',
      Childof: 0
    }
  })

  useEffect(() => {
    setloder(true)
    const mappedStatus: any = rowData?.row?.Status == true ? 1 : 0
    setValue('MasterName', rowData?.row.MasterName)
    setValue('Status', mappedStatus)
    setValue('DisplayOrder', rowData?.row.DisplayOrder)
    setValue('Icon', rowData?.row.Icon)
    setValue('Url', rowData?.row.Url)
    setValue('Childof', rowData?.row?.Childof)
    setloder(false)
  }, [rowData, setValue])

  const onSubmit = async (data: any) => {
    let payload: any = {
      Status: data.Status ? true : false,
      MasterName: data.MasterName.charAt(0).toUpperCase() + data.MasterName.slice(1),
      DisplayOrder: Number(data.DisplayOrder),
      Icon: data.Icon,
      Url: data.Url,
      Childof: ChildId
    }
    if (rowData?.row.Id) {
      const endpoint = 'api/userspermission/updateurlmaster'
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
      const endpoint = 'api/userspermission/createurlmaster'
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
                name='MasterName'
                control={control}
                rules={{ required: 'Parent MasterName is required' }}
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
                            MasterName
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Enter your MasterName '
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[&A-Za-z0-9_-\s]*$/.test(inputValue) || inputValue === '') {
                          onChange(e)
                        }
                      }}
                    />
                    {errors.MasterName && (
                      <Typography variant='caption' color='error'>
                        {errors.MasterName.message as any}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} mt={2}>
              <Controller
                name='Childof'
                control={control}
                // rules={{ required: 'Parent Master is required' }}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      {...field}
                      sx={{
                        '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                          padding: '13.5px 10px !important'
                        }
                      }}
                      options={chargeList}
                      getOptionLabel={(option: any) => option.MasterName || watch('Childof')}
                      isOptionEqualToValue={(option: any, value: any) => option.chargeList == value}
                      value={chargeList?.find((c: any) => c.Id == field.value) || watch('Childof')}
                      renderInput={(params: any) => (
                        <CustomTextField
                          {...params}
                          label={
                            <>
                              <span
                                className='lastname'
                                style={{
                                  fontSize: '14px'
                                }}
                              >
                                Parent Master
                              </span>
                              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                                *
                              </Typography>
                            </>
                          }
                          // error={Boolean(errors.CId)}
                          // helperText={errors.CId?.message}
                        />
                      )}
                      onChange={(_event, value: any) => {
                        field.onChange(value ? value.Id : 0)
                        setChildId(value ? value.Id : 0)
                      }}
                    />
                    {/* {errors.Childof && (
                      <Typography variant='caption' color='error'>
                        {errors.Childof.message as any}
                      </Typography>
                    )} */}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} mt={2}>
              <Controller
                name='Icon'
                control={control}
                // rules={{ required: 'Icon is required' }}
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
                            ICON
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Enter your Icon '
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[&A-Za-z0-9_-\s]*$/.test(inputValue) || inputValue === '' || true) {
                          onChange(e)
                        }
                      }}
                    />
                    {/* {errors.Icon && (
                      <Typography variant='caption' color='error'>
                        {errors.Icon.message as any}
                      </Typography>
                    )} */}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} mt={2}>
              <Controller
                name='Url'
                control={control}
                // rules={{ required: 'Url is required' }}
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
                            URL
                          </span>
                        </div>
                      }
                      placeholder='Enter your Url '
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[&A-Za-z0-9_-\s]*$/.test(inputValue) || inputValue === '' || true) {
                          onChange(e)
                        }
                      }}
                    />
                    {/* {errors.Url && (
                      <Typography variant='caption' color='error'>
                        {errors.Url.message as any}
                      </Typography>
                    )} */}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} mt={2}>
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
