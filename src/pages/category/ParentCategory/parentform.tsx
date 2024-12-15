import React, { useEffect, useState } from 'react'

import { Box, Button, CircularProgress, Grid, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'

interface FormData {
  category: string
  status: boolean
  displayOrder: any
  image: any
  amenitiesIds: string
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
      category: '',
      status: true,
      displayOrder: '',
      image: '',
      amenitiesIds: ''
    }
  })

  useEffect(() => {
    const mappedStatus: any = rowData?.row?.Status == true ? 1 : 0
    setValue('category', rowData?.row.Name)
    setValue('status', mappedStatus)
    setValue('displayOrder', rowData?.row.DisplayOrder)
  }, [rowData, setValue])

  const [files, setFiles] = useState<File[]>([])
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFiles(acceptedFiles)
      }
    }
  })

  const onSubmit = async (data: any) => {
    if (files.length == 0 && !rowData?.row.Image) {
      toast.error('Please upload an image.')

      return
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    let payload: any = {
      status: data.status ? true : false,
      category: data.category.charAt(0).toUpperCase() + data.category.slice(1),
      displayOrder: data.displayOrder,
      amenitiesIds: data.amenitiesIds
    }
    if (rowData?.row.CId) {
      payload = { ...payload, uid: rowData?.row.CId }

      files.forEach((file: any, index) => {
        const currentdate = new Date()
        const day = String(currentdate.getDate()).padStart(2, '0')
        const month = String(currentdate.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const year = currentdate.getFullYear()
        const hours = String(currentdate.getHours()).padStart(2, '0')
        const minutes = String(currentdate.getMinutes()).padStart(2, '0')
        const seconds = String(currentdate.getSeconds()).padStart(2, '0')
        const fileName = `${day}${month}${year}_${hours}${minutes}${seconds}_${file.name}`
        const renamedFile = new File([file as any], fileName, { type: file.type })
        payload = { ...payload, image: fileName }
      })

      // ApiClient.put(`${endpoint}${`api/servicescategory/update`}`, payload, { headers })
      //   .then(res => {
      //     toast.success(res?.data?.message)
      //     closeRightPopupClick()
      //     fetchData()
      //   })
      //   .catch(err => {
      //     console.log(err.message)
      //   })
    } else {
      files.forEach((file: any, index) => {
        const currentdate = new Date()
        const day = String(currentdate.getDate()).padStart(2, '0')
        const month = String(currentdate.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const year = currentdate.getFullYear()
        const hours = String(currentdate.getHours()).padStart(2, '0')
        const minutes = String(currentdate.getMinutes()).padStart(2, '0')
        const seconds = String(currentdate.getSeconds()).padStart(2, '0')
        const fileName = `${day}${month}${year}_${hours}${minutes}${seconds}_${file.name}`
        const renamedFile = new File([file as any], fileName, { type: file.type })
        // uploadFile(renamedFile as any, 'images/service/cg/')
        // ServiceImageUploadWrite('cg', renamedFile)
        payload = { ...payload, image: fileName }
      })

      // ApiClient.post(`${endpoint}${`api/servicescategory/add`}`, payload, { headers })
      //   .then(res => {
      //     toast.success(res?.data?.message)
      //     closeRightPopupClick()
      //     fetchData()
      //   })
      //   .catch(err => {
      //     console.log(err.message)
      //   })
    }
  }

  const img = files.map((file: FileProp) => (
    <img
      style={{ width: '150px', height: '150px', borderRadius: '10%' }}
      key={file.name}
      alt={file.name}
      className='single-file-image'
      src={URL.createObjectURL(file as any)}
    />
  ))

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
                name='category'
                control={control}
                rules={{ required: 'Parent Category is required' }}
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
                            Parent Category Name
                          </span>
                          <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                            *
                          </Typography>
                        </div>
                      }
                      placeholder='Enter your Parent Category Name'
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[A-Za-z0-9\s]*$/.test(inputValue) || inputValue === '') {
                          onChange(e)
                        }
                      }}
                    />
                    {errors.category && (
                      <Typography variant='caption' color='error'>
                        {errors.category.message as any}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className='empTextField'>
                <Controller
                  name='displayOrder'
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
                      {errors.displayOrder && (
                        <Typography variant='caption' color='error'>
                          {errors.displayOrder.message as any}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div>
                <span
                  className='lastname'
                  style={{
                    fontSize: '14px'
                  }}
                >
                  Parent Category Image
                </span>
                <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                  *
                </Typography>
              </div>
              <Box
                {...getRootProps({ className: 'dropzone' })}
                {...(files.length && {
                  sx: {
                    height: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                    alignItems: 'center'
                  }
                })}
              >
                <input {...getInputProps()} />
                {files.length > 0 ? (
                  img
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Icon icon='tabler:upload' fontSize='1.75rem' />
                      </div>
                      <Typography variant='h4' className='mbe-2.5'>
                        Drop files here or click to upload.
                      </Typography>
                    </div>
                  </div>
                )}
              </Box>

              {rowData?.row?.Image && files.length == 0 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: '5px 5px 0px 0px',
                      objectFit: 'fill',
                      padding: '10px',
                      border: '1px solid #dddddd'
                    }}
                    src={``}
                    alt='Parent Category'
                  />
                </div>
              )}
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
                    name='status'
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

export default ParentForm
