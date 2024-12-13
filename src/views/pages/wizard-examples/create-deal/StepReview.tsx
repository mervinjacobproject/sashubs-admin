import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import { useDropzone } from 'react-dropzone'

interface FileProp {
  name: string
  type: string
  size: number
}

const StepImageUpload = () => {
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,

    // accept: ['.png', '.jpg', '.jpeg', '.gif'],

    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const img = files.map((file: FileProp, index: number) => (
    <div key={file.name} style={{ width: '15%', display: 'grid', justifyContent: 'center'}}>
      <img
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '5px 5px 0px 0px',
          objectFit: 'fill',
          padding: '10px',
          border: '1px solid #dddddd'
        }}
        key={file.name}
        alt={file.name}
        className='single-file-image'
        src={URL.createObjectURL(file as any)}
      />
      <div
        style={{
          borderRadius: '0px 0px 0px 0px',
          objectFit: 'cover',
          padding: '5px',
          display: 'grid',
          justifyContent: 'center',
          border: '1px solid #dddddd',
          borderBottom: '0px',
          borderTop: '0px'
        }}
      >
        <p style={{ fontWeight: '500', margin: '0px' }}>{file.name}</p>
        <i style={{ fontWeight: '400', margin: '0px', fontSize: '13px' }}>{(file.size / 1024).toFixed(2)} KB</i>
      </div>
      <p
        onClick={() => removeFile(index)}
        style={{
          border: '1px solid #dddddd',
          width: '180px',
          height: '40px',
          margin: '0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        Remove Files
      </p>
    </div>
  ))

  return (
    
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={files.length ? { height: 200, display: 'flex', justifyContent: 'center' } : {}}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
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
          <Typography sx={{ color: 'text.secondary' }}>
            (This is just a demo drop zone. Selected files are not actually uploaded.)
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StepImageUpload
