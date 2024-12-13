import React, { useCallback, ElementType, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { Autocomplete, Avatar, Box, CardContent, Grid, IconButton, InputAdornment, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomTextField from 'src/@core/components/mui/text-field'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import toast from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { yupResolver } from '@hookform/resolvers/yup'
import AppSink from 'src/commonExports/AppSink'
import uploadFileToS3 from 'src/pages/apps/employee/employee-details/uploadImageS3'

interface FormData {
  firstname: string
  lastname: string
  email: string
  status: boolean
  password: string
  price_category: any
  selectedFile: File | null
}

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '50%',
    textAlign: 'center'
  }
}))

const UserDetailsForm = ({ editId, fetchData, resetEditid, deleteId }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<any>()
  const [data, setData] = useState([])
  const [role, setRole] = useState([])
  const [selectedRole, setSelectedRole] = useState({})
  const [nameValue, setNameValue] = useState<string>('')
  const [lastnameValue, setLastNameValue] = useState<string>('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [showValues, setShowValues] = useState<boolean>(false)
  const [selectedProfile, setSelectProfile] = useState<any>('')

  const accountSchema = yup.object().shape({
    firstname: yup
      .string()
      .required('Firstname  is required')
      .matches(/^[A-Za-z]+$/, 'Firstname must contain only letters'),
    lastname: yup.string().required(),
    email: yup
      .string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format. Please enter a valid email address.'
      ),
    password: yup.string().required(),
    price_category: yup.string().required(),

  })

  const {
    handleSubmit,
    control: control,
    setValue,
    watch,
    formState: { errors: accountErrors, isDirty, isValid }
  } = useForm<FormData>({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      price_category: '',
      status: true
    },
    resolver: yupResolver(accountSchema)
  })

  const handleModalOpenDelete: any = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)




  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const handleDeleteConfirm = () => {
    handleDelete()
    setModalOpenDelete(false)
  }


  const FetchRole = () => {

    const query = `
    query MyQuery {
      listUserRoles5AABS(filter: {Status: {eq: true}}) {
        totalCount
        items {
          ID
          RoleName
          Status
        }
      }
    }
    
  `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        const items = res.data.data.listUserRoles5AABS.items

        setRole(items)
      })
      .catch(err => {
        console.error('Error deleting designation:', err)

      })
  }

  const getFormDetails = useCallback(
    (editId: any) => {
      const query = `
  

query MyQuery {
  getUsers5AAB(ID:${editId}) {
    Date
    FirstName
    LastName
    ID
    Password
    ProfileImage
    RoleId
    Status
    UserId
    UserName
    UserType
  }
}

`;
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      };
      ApiClient.get(`${AppSink}?query=${encodeURIComponent(query)}`, { headers })
        .then(res => {
          if (res.data.data.getUsers5AAB && res.data.data.getUsers5AAB) {
            const { FirstName, LastName, UserName, ProfileImage, Password, Status, RoleId } = res.data.data.getUsers5AAB;
            const decodedPassword = atob(Password);
            setSelectProfile(res.data.data.getUsers5AAB)
            setNameValue(res.data.data.getUsers5AAB.FirstName)
            setLastNameValue(res.data.data.getUsers5AAB.LastName)
            setValue('firstname', FirstName)
            setValue('lastname', LastName)
            setValue('password', decodedPassword)
            setValue('email', UserName)
            setValue('status', Status)
            setValue('price_category', RoleId)
            setSelectedRole(RoleId)
            setPreviewImage(ProfileImage);
          }
        })
        .catch(err => {
          console.error('Something went wrong', err);
        });
    },
    [setValue]
  );

  useEffect(() => {
    if (editId) {
      getFormDetails(editId)
    }
  }, [editId, getFormDetails])

  useEffect(() => {
    FetchRole()
  }, [])



  useEffect(() => {
    return () => {
      resetEditid()
    }
  }, [resetEditid])


  const handleUpload = async (e: any) => {
    const MAX_FILE_SIZE = 50 * 1024
    const file = e.target.files && e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        const errorMessage = `File size exceeds the maximum limit (50KB).`
        const imageSizeMessage = `Selected image size: ${file.size / 1024} KB`
        toast.error(`${errorMessage} ${imageSizeMessage}`)
        return
      }
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      try {
        const uploadedUrl = await uploadFileToS3(
          file,
          'img.5aab.com/profile',
        )
        setPreviewImage(uploadedUrl)
      } catch (error) {
        console.error('Failed to upload file:', error)
      }
    }
  }

  const handleTogglePasswordView = () => {
    setShowValues(!showValues)
  }

  const onSubmit = (data: FormData) => {
    const encodedPassword = btoa(data.password);
    const statusValue = data.status ? true : false;
    const query = deleteId ?
      ` mutation my {
    updateUsers5AAB(input: {Date: "",ID:${deleteId}, LastName: "${data.lastname}", FirstName: "${data.firstname}", Password: "${encodedPassword}", ProfileImage: "${previewImage}", RoleId:${selectedRole}, Status:${statusValue}, UserId: "", UserName: "${data.email}", UserType: ""}) {
    Date
    FirstName
    ID
    LastName
    Password
    ProfileImage
    RoleId
    Status
    UserId
    UserName
    UserType
  }
}
`:
      `mutation my {
        createUsers5AAB(input: {Date: "", LastName: "${data.lastname}", FirstName: "${data.firstname}", Password: "${encodedPassword}", ProfileImage: "${previewImage}", RoleId:${selectedRole}, Status:${statusValue}, UserId: "", UserName: "${data.email}", UserType: ""}) {
          Date
          FirstName
          ID
          LastName
          Password
          ProfileImage
          RoleId
          Status
          UserId
          UserName
          UserType
        }
      }
    
    `;
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
    const requestQuery = query;
    ApiClient.post(`${AppSink}`, { query: requestQuery }, { headers })
      .then(res => {
        closeRightPopupClick();
        toast.success('Updated Successfully')
        fetchData();
      })
      .catch(err => {
        console.error('something went wrong', err);
      });
  };




  const handleDelete = () => {

    const query = `
    mutation my {
      updateUsers5AAB(input: { ID:${editId},ProfileImage: "",}) {
        Date
        FirstName
        ID
        LastName
        Password
        ProfileImage
        RoleId
        Status
        UserId
        UserName
        UserType
      }
    }
    
    
  `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        toast.success('Deleted successfully')
        setPreviewImage('')
        fetchData()
        setModalOpenDelete(false)
      })
      .catch(err => {
        console.error('Error deleting designation:', err)
        toast.error('Error deleting designation')
      })
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ display: "flex", justifyContent: "center", fontSize: "20px", fontWeight: 600, fontFamily: "sans-serif", padding: "10px", }}>User Details</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {previewImage ? (
            <div
              style={{
                border: '1px solid #cacaca',
                padding: '15px',
                margin: '10px 10px 10px 0px',
                borderRadius: '10px'
              }}
            >
              <Avatar
                sx={{ width: 60, height: 60, fontSize: 28, backgroundColor: '#cacaca' }}
                src={previewImage}

              />
            </div>
          ) : (
            <div
              style={{
                border: '1px solid #cacaca',
                padding: '15px',
                margin: '10px 10px 10px 0px',
                borderRadius: '10px',
              }}
            >
              <Avatar sx={{ width: 60, height: 60, fontSize: 28, color: 'white', backgroundColor: '#cacaca' }}>
                {nameValue && lastnameValue ? (
                  `${nameValue.charAt(0).toUpperCase()}${lastnameValue.charAt(0).toUpperCase()}`
                ) : null}
              </Avatar>


            </div>
          )}


          <div>
            <Button
              sx={{
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                }
              }}
              component='label'
              variant='contained'
            >
              <Icon fontSize='1.5rem' icon='material-symbols-light:upload' style={{ marginRight: '5px' }}>
                {' '}
              </Icon>
              Upload New Photo
              <input
                hidden
                type='file'
                accept='image/png, image/jpeg, image/jpg, image/webp'
                onChange={handleUpload}
                id='account-settings-upload-image'
              />
            </Button>
            {previewImage && (
              <Button
                variant='contained'
                sx={{
                  ml: 4,
                  '&:hover': {
                    background: '#776cff',
                    color: 'white',
                  }
                }}
                onClick={handleDeleteConfirm}
              >
                <Icon icon='tabler:trash' style={{ marginRight: '5px' }} />
                Delete
              </Button>
            )}
            <Typography sx={{ mt: 4, color: 'text.disabled' }}>
              Allowed PNG or JPEG. Max size of 50Kb.
            </Typography>
          </div>
        </Box>


        <div>
          <Controller
            name='firstname'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                value={value || ''}
                autoFocus
                id='firstname'
                label={
                  <div>
                    <span
                      className='firstname'
                      style={{
                        color:
                          getColor()
                      }}
                    >
                      First Name
                    </span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='First Name'
                onChange={e => {
                  const inputValue = e.target.value
                  if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                    onChange(e)
                  }
                }}
                variant='outlined'
                fullWidth
                margin='normal'
                error={Boolean(accountErrors.firstname)}
                aria-describedby='stepper-linear-account-firstname'
                {...(accountErrors.firstname && { helperText: 'Firstname is required' })}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name='lastname'
            control={control}
            rules={{
              required: 'Price per Unit is required'
            }}
            render={({ field: { onChange, value } }) => (
              <CustomTextField
                value={value || ''}
                id='lastname'
                label={
                  <div>
                    <span
                      className='lastname'
                      style={{
                        color:
                          getColor()
                      }}
                    >
                      Last Name
                    </span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='Last Name'
                onChange={e => {
                  const inputValue = e.target.value
                  if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                    onChange(e)
                  }
                }}
                variant='outlined'
                fullWidth
                margin='normal'
                error={Boolean(accountErrors.lastname)}
                aria-describedby='stepper-linear-account-lastname'
                {...(accountErrors.lastname && { helperText: 'Lastname is required' })}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{ required: 'Riskfactors is required' }}
            render={({ field: { onChange, value } }) => (
              <CustomTextField
                value={value || ''}
                id='email'
                label={
                  <div>
                    <span
                      className='firstname'
                      style={{
                        color:
                          getColor()
                      }}
                    >
                      E-mail
                    </span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='Email'
                variant='outlined'
                onChange={e => {
                  const inputValue = e.target.value
                  if (/^([a-z])(.*)$/.test(inputValue) || inputValue === '') {
                    const modifiedValue = inputValue.charAt(0).toLowerCase() + inputValue.slice(1)
                    onChange({ ...e, target: { ...e.target, value: modifiedValue } })
                  }
                }}
                fullWidth
                multiline
                margin='normal'
                error={Boolean(accountErrors.email)}
                aria-describedby='stepper-linear-account-email'
                {...(accountErrors.email && { helperText: 'Email is required' })}
              />
            )}
          />
        </div>


        <div>
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{ required: 'password is required' }}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextField
                onChange={onChange}
                value={value || ''}
                onBlur={onBlur}
                id='password'
                label={
                  <div>
                    <span
                      className='firstname'
                      style={{
                        color:
                          getColor()
                      }}
                    >
                      Password
                    </span>
                    <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                      *
                    </Typography>
                  </div>
                }
                placeholder='············'
                type={showValues ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleTogglePasswordView}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon={showValues ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                variant='outlined'
                fullWidth

                margin='normal'
                error={Boolean(accountErrors.password)}
                aria-describedby='stepper-linear-account-password'
                {...(accountErrors.password && { helperText: 'Password is required' })}
              />
            )}
          />
        </div>
        <Grid item xs={12} sm={12}>
          <Controller
            name='price_category'
            control={control}
            render={({ field }) => (
              <>
                <div>
                  <span style={{ fontSize: '14px', marginBottom: '4px' }}>Role</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                    *
                  </Typography>
                  <Typography
                    variant='caption'
                    color='error'
                    sx={{ fontSize: '17px', marginLeft: '2px' }}
                  ></Typography>
                </div>
                <Autocomplete
                  {...field}
                  options={role}
                  getOptionLabel={(option: any) => option.RoleName || ''}
                  value={role.find((pricevalue: any) => pricevalue?.ID === watch('price_category')) || null}
                  onChange={(_, newValue) => {

                    field.onChange(newValue?.ID || null)
                    setSelectedRole(newValue?.ID || null)
                    setValue('price_category', newValue?.ID || null)
                  }}
                  isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      error={Boolean(accountErrors.price_category) && !field.value}
                      helperText={accountErrors.price_category && !field.value ? 'Role field is required' : ''}
                      inputProps={{
                        ...params.inputProps
                      }}

                    />
                  )}
                />
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <>

                <div>
                  <span style={{ fontSize: '14px' }}>Status</span>
                  <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>

                  </Typography>
                </div>
                <Switch
                  {...field}
                  checked={Boolean(field.value)}
                  onChange={e => field.onChange(e.target.checked)}
                  color='primary'
                />
                <Typography sx={{ color: getColor() }}>{field.value ? 'Active' : 'Inactive'}</Typography>
              </>
            )}
          />
        </Grid>

        <div>
          <Button
            type='submit'
            sx={{
              mb: 2,
              mr: 2,
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
                background: '#776cff',
                color: 'white'
              }
            }}

            variant='contained'
          >
            <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
            Save
          </Button>
        </div>
      </form>
      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p>Are you sure you want to delete?</p>

        <div className='delete-popup' style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#808080',
              '&:hover': {
                background: '#808080',
                color: 'white'
              }
            }}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>

          <Button
            variant='contained'
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            onClick={handleDeleteConfirm}
          >
            {' '}
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
    </>
  )
}

export default UserDetailsForm
