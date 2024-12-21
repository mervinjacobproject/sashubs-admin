import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Autocomplete, Box, Button, CircularProgress, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import toast from 'react-hot-toast'
import ApiLoginClient from 'src/apiClient/apiClient/loginConfig'

interface FormData {
  CId: any
  SubCategory: string
  Status: boolean
  DisplayOrder: any
}

const SubForm = ({ rowData, onClose, fetchData, ParentCategory }: any) => {
  const [loader, setloder] = useState(false)
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      CId: '',
      SubCategory: '',
      Status: true,
      DisplayOrder: ''
    }
  })

  useEffect(() => {
    setloder(true)
    const mappedStatus: any = rowData?.row?.Status == true ? 1 : 0
    setValue('SubCategory', rowData?.row.SubCategory)
    setValue('Status', mappedStatus)
    setValue('DisplayOrder', rowData?.row.DisplayOrder)
    setValue('CId', rowData?.row.CId)

    setloder(false)
  }, [rowData, setValue])

  //OnSubmit form
  const onSubmit = async (data: any) => {
    let payload: any = {
      Status: data.Status ? true : false,
      SubCategory: data.SubCategory.charAt(0).toUpperCase() + data.SubCategory.slice(1),
      DisplayOrder: Number(data.DisplayOrder),
      CId: Number(data.CId)
    }
    // console.log(payload)
    // return
    if (rowData?.row.SCId) {
      const endpoint = 'api/categories/updatesubcategory'
      payload = { ...payload, SCId: rowData?.row.SCId }
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
      const endpoint = 'api/categories/createsubcategory'
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
        <Grid xs={12}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}
          >
            <Grid item xs={12} sm={12}>
              <Controller
                name='CId'
                control={control}
                rules={{ required: 'Parent Category is required' }}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      {...field}
                      sx={{
                        '.css-8yodjg-MuiInputBase-input-MuiOutlinedInput-input': {
                          padding: '13.5px 10px !important'
                        }
                      }}
                      options={ParentCategory}
                      getOptionLabel={(option: any) => option.Category || watch('CId')}
                      isOptionEqualToValue={(option: any, value: any) => option.ParentCategory == value}
                      value={ParentCategory?.find((c: any) => c.CId == field.value) || watch('CId')}
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
                                Parent Category Name
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
                        field.onChange(value ? value.CId : '')
                      }}
                    />
                    {errors.CId && (
                      <Typography variant='caption' color='error'>
                        {errors.CId.message as any}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} mb={2}>
              <div className='empTextField'>
                <Controller
                  name='SubCategory'
                  control={control}
                  rules={{ required: 'Sub Category is required' }}
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
                              Sub Category Name
                            </span>
                            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                              *
                            </Typography>
                          </div>
                        }
                        placeholder='Enter your Sub Category Name'
                        onChange={e => {
                          const inputValue = e.target.value
                          if (/^[A-Za-z0-9\s]*$/.test(inputValue) || inputValue === '') {
                            onChange(e)
                          }
                        }}
                      />
                      {errors.SubCategory && (
                        <Typography variant='caption' color='error'>
                          {errors.SubCategory.message as any}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={12} mb={2}>
              <div className='empTextField'>
                <Controller
                  name='DisplayOrder'
                  control={control}
                  rules={{ required: 'DisplayOrder is required' }}
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
                            id='invoice-add-payment-stub'
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

export default SubForm
