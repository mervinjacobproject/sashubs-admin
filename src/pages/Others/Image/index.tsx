import React, { useState, useCallback , useEffect} from 'react'
import { useDropzone } from 'react-dropzone'
import Grid from '@mui/material/Grid'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import FormControlLabel from '@mui/material/FormControlLabel'
import Icon from 'src/@core/components/icon'
import { toast } from 'react-hot-toast'
import { Button, Switch, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

import { Router, useRouter } from 'next/router'

interface FormValues {
  ImageAlt: string
  ImageName: string
  selectedImage: File | null
  status: number
}

    
const ImageForm = () => {
  const defaultAccountValues: FormValues = {
    ImageAlt: '',
    ImageName: '',
    selectedImage: null,
    status: 0
  }

  const accountSchema = yup.object().shape({
    ImageAlt: yup.string().required(),
    status: yup.number().required()
  })

  const {
    control: accountControl,
    formState: { errors: accountErrors },
    handleSubmit,
    setValue
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  const router = useRouter()
  const handleview = () => {
    router.push('Image/listImage')
  }

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles:any) => {
      const file = acceptedFiles[0];

      if (file && isChromeImage(file.type)) {
        setPreviewImage(URL.createObjectURL(file));
        setValue('selectedImage', file);
      } else {
        toast.error('Invalid image type. Please select a valid image.');
      }
    },
    [setValue]
  );


  const { getRootProps, getInputProps } = useDropzone({
    
    // accept: 'image/*',
    onDrop
  });
  

  const isChromeImage = (fileType:any) => {
   
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

    return supportedImageTypes.includes(fileType);
  };

  const onSubmit = (data: FormValues) => {

    const formData = new FormData()
    formData.append('image', data.selectedImage || '')

    ApiClient.post(`/api.php?moduletype=image_mgmt&apitype=add&image_alt=${data.ImageAlt}&image_name=${data.ImageName}&status=${data.status}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res: any) => {
     
        toast.success('Saved successfully')

        setValue('ImageAlt', '')
        setValue('ImageName', '')
        setValue('status', 0)
        setValue('selectedImage', null)
        setPreviewImage(null)
      })
      .catch((err: any) => {
        // console.error('Error saving data:', err)
        toast.error('Error saving data')
      })
  }
  useEffect(() => {
    document.title = 'Image Upload - 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <span>Search By</span> */}
      <Grid
        container
        sx={{
          mb: 2,
          mt: 5,
          height: '325px',
          border: '1px solid #cacaca',
          borderRadius: '5px',
          padding: '5px 4px 10px 4px'
        }}
        spacing={3}
      >
        <Grid item container sm={12}>
        <Grid item xs={12} sm={4}>
          <Grid item sm={12}>
        <Grid item xs={12} sm={12} sx={{ mb: 1 }} className='empTextField'>
          <Controller
            name='ImageAlt'
            control={accountControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <div>
                    <span className='status-container'>Image Alt</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='ImageAlt'
                onChange={onChange}
                error={Boolean(accountErrors.ImageAlt)}
                aria-describedby='stepper-linear-account-username'
                {...(accountErrors.ImageAlt && { helperText: 'ImageAlt  is required' })}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <Controller
            name='ImageName'
            control={accountControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <div>
                    <span className='status-container'>Image Name</span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='ImageName'
                onChange={onChange}
                error={Boolean(accountErrors.ImageAlt)}
                aria-describedby='stepper-linear-account-username'
                {...(accountErrors.ImageAlt && { helperText: 'ImageName  is required' })}
              />
            )}
          />
        </Grid>
        </Grid>
        </Grid>
        <Grid item sm={4}>
        <Grid item xs={12} sm={12}>
          <label htmlFor='imageInput'>Upload Image:</label>
          <Box {...getRootProps()} sx={previewImage ? { height: 200, display: 'flex', justifyContent: 'center' } : {}}>
            <input {...getInputProps()} />
            {previewImage ? (
              <img src={previewImage} alt='Preview' style={{ maxWidth: '100%', maxHeight: '70%', marginTop: '10px' }} />
            ) : (
              <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Box
                  sx={{
                    mb: 8.75,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                  }}
                >
                  <Icon icon='tabler:upload' fontSize='1.75rem' />
                </Box>
                <Typography variant='h4' sx={{ mb: 2.5 }}>
                  Drop files here or click to upload.
                </Typography>
                {/* ... (Additional content) */}
              </Box>
            )}
          </Box>
        </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name='status'
            control={accountControl}
            defaultValue={0} // Set default value for the Switch component
            render={({ field }) => (
              <>
                <Switch
                  {...field}
                  color='primary'
                  onChange={e => {
                    setValue('status', e.target.checked ? 1 : 0)
                  }}
                />
                <label>{field.value ? 'Active' : 'Inactive'}</label>
              </>
            )}
          />
        </Grid>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'end'  ,  alignItems: 'space-between', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
             
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
            onClick={handleview}
          >
            View Image
          </Button>

          <Button
            type='submit'
            sx={{
            
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
            <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ImageForm
