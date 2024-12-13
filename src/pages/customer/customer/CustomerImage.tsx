import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Grid from '@mui/material/Grid'
import AppSink from 'src/commonExports/AppSink'
import { CircularProgress } from '@mui/material'
import uploadFileToS3 from 'src/pages/apps/employee/employee-details/uploadImageS3'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

export interface CustomerImageMethods {
  childMethod: () => void
}

interface customerProps {
  ref: any
  editid: any
  handleNext: any
}

const CustomerImage: React.FC<customerProps> = forwardRef<CustomerImageMethods, customerProps>(
  ({ editid, handleNext }, ref) => {
    const imagesValues: any = {
      name: '',
      size: 0,
      type: '',
      preview: ''
    }

    const [filesVal, setFilesVal] = useState<File[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [bannerImage, setBannerImage] = useState('')
    const [imageSrc, setImageSrc] = useState('')
    const [showPreview, setShowPreview] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fullSizeImage, setFullSizeImage] = useState(false) 

    useImperativeHandle(ref, () => ({
      async childMethod() {
        handleSubmit(onSubmitForm)()
        handleNext()
      }
    }))

    useEffect(() => {
      filesVal && handleUpload(filesVal)
    }, [filesVal])

    const handleUpload = async (files: any) => {
      if (files.length === 0) {
        return
      }
      const file = files[0]
      try {
        setLoading(true)
        const url:any = await uploadFileToS3(file, 'img.5aab.com/profile')
        setImageSrc(url)
        setBannerImage(url)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    const { getRootProps, getInputProps } = useDropzone({
      multiple: false,
      onDrop: (acceptedFiles: File[], fileRejections: any) => {
        if (fileRejections.length > 0) {
          toast.error('Please select only image files.')
        } else {
          setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
          setFilesVal(acceptedFiles.map((file: File) => Object.assign(file)))
        }
      }
    })

    const handleData = async () => {
      if (editid) {
        const id = editid
        const query = `
          query MyQuery {
            listUsers5AABS(filter: {UserId: {eq: "${id}"}}) {
              items {
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
          }`
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        try {
          const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
        } catch (error) {
          console.error( error)
        }
      } else {
        console.error('Error: No id provided')
      }
    }

    const onSubmitForm = async () => {
      try {
        const query = editid
          ? `         
        mutation my {
          updateCustomer5AAB(input: { Photo:"${imageSrc}",  CId:${editid}}) {
            Address2
            Address1
            CId
            CompanyName
            CompanyPanNo
            ContactPerson
            Country
            CusGroup
            CustomerId
            Date
            Email
            FirstName
            IP
            InsertedBy
            LandLine
            LastName
            Mobile
            Password
            Photo
            PostCode
            State
            Status
            Suburb
            Title
            UpdatedBy
            UpdatedAt
          }
        }
        `
          : `mutation my {
          createCustomer5AAB(input: {  Photo:"${bannerImage}",}) {
            Address2
            Address1
            CId
            CompanyName
            CompanyPanNo
            ContactPerson
            Country
            CusGroup
            CustomerId
            Date
            Email
            FirstName
            IP
            InsertedBy
            LandLine
            LastName
            Mobile
            Password
            Photo
            PostCode
            State
            Status
            Suburb
            Title
            UpdatedBy
            UpdatedAt
          }
        }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        toast.success('Profile Image Updated Successful') 
        await ApiClient.post(`${AppSink}`, { query }, { headers })
      } catch (error) {
        console.error(error)
      }
    }

    const listData = async (editid: any) => {
      try {
        setLoading(true)
        const query = `
          query MyQuery {
            getCustomer5AAB(CId:${editid}) {
              Address1
              Address2
              CId
              CompanyName
              CompanyPanNo
              ContactPerson
              Country
              CusGroup
              CustomerId
              Date
              Email
              FirstName
              IP
              InsertedBy
              LandLine
              LastName
              Mobile
              Password
              Photo
              PostCode
              State
              Status
              Suburb
              Title
              UpdatedAt
              UpdatedBy
            }
          }`

        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }
        const res = await ApiClient.get(`${AppSink}?query=${encodeURIComponent(query)}`, { headers })

        if (res.data.data.getCustomer5AAB) {
          const { Photo } = res.data.data.getCustomer5AAB
          setImageSrc(Photo)
        } else {
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      handleData()
      listData(editid)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { handleSubmit } = useForm({
      defaultValues: imagesValues
    })

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
        {loading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={5} sx={{ display: 'grid', width: '100%' }}>
              <Grid item xs={12} sm={12} lg={12}>
                <Box
                  sx={{
                    color: getColor(),
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                  {...getRootProps({ className: 'dropzone' })}
                >
                  <input {...getInputProps({ onChange: () => handleUpload(files) })} />
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
                      <Box
                        sx={{
                          mb: 8.75,
                          height: 48,
                          width: 48,
                          display: 'flex',
                          borderRadius: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                        }}
                      >
                        <Icon icon='tabler:upload' fontSize='1.75rem' />
                      </Box>
                      <Typography variant='h6'>Drop files here or click to upload.</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} lg={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{ borderRadius: '10px', border: '1px solid #cacaca', padding: '5px' }}
                  onClick={() => setFullSizeImage(true)}
                >
                   {imageSrc && (
                  <img src={imageSrc} alt='banner Image' style={{ width: '150px', height: '150px' }} />)}
                </div>
              </Grid>
            </Grid>
          </form>
        )}
        {fullSizeImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 9999
            }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <button onClick={() => setFullSizeImage(false)} style={{ float: 'right' }}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </button>
              <img src={imageSrc} alt='Full size image' style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
            </div>
          </div>
        )}
      </>
    )
  }
)
export default CustomerImage
