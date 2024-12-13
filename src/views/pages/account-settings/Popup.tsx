import { CircularProgress, Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

const Popup = ({ open, action, rowData, onClose }: any) => {
  const [domain, setDomain] = useState('')
  const [url, setUrl] = useState('')
  const [rowId, setRowId] = useState('')
  const [cusId, setCusId] = useState('')
  const [loading, setLoading] = useState(false)
  const { deleteProjectApi, editProjectApi, deleteLambdaProjectApi }: any = useContext(AuthContext)
  const selectedMode = localStorage.getItem('selectedMode') || 'light'
  const color = selectedMode === 'dark' ? '#262a3c' : 'white'

  useEffect(() => {
    if (open && rowData) {
      setDomain(rowData?.domainname || '')
      setUrl(rowData?.domainurl || '')
      setRowId(rowData?.id)
      setCusId(rowData?.cusid)
    }
  }, [open, rowData])

  const handleEditSubmit = async () => {
    setLoading(true)
    const response = await editProjectApi(rowId.toString(), cusId, domain)
    if (response) {
      setLoading(false)
      onClose()
    }
  }

  const handleDeleteSubmit = async () => {
    setLoading(true)
    const LambdaResponse = await deleteLambdaProjectApi(url, cusId)
    if (LambdaResponse) {
      const response = await deleteProjectApi(rowId, cusId)
      if (response) {
        setLoading(false)
        onClose()
      }
    }
  }

  return open ? (
    <div className='popup-overlay'>
      <div className='popup-content' style={{ background: color }}>
        <div className='popup-header'>
          <h2>{action === 'edit' ? 'Edit Project' : 'Delete Project'}</h2>
          <span className='close-icon' style={{ pointerEvents: loading ? 'none' : 'auto' }} onClick={onClose}>
            &times;
          </span>
        </div>
        {action === 'edit' ? (
          <div>
            <TextField
              label='Name'
              value={domain}
              onChange={e => setDomain(e.target.value)}
              fullWidth
              margin='normal'
            />
            <TextField
              label='URL'
              value={url}
              onChange={e => setUrl(e.target.value)}
              fullWidth
              margin='normal'
              disabled
            />
            <Button onClick={handleEditSubmit} variant='contained' color='primary' disabled={loading}>
              {loading ? <><CircularProgress size={16} color='inherit' sx={{marginRight:`3px`}}/> Save Changes</> : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <Typography variant='body1'>Are you sure you want to delete this project:</Typography>
              <Typography sx={{ marginLeft: '10px', textTransform: 'uppercase' }} variant='body1'>
                {rowData?.domainname}
              </Typography>
            </Box>
            <Button onClick={handleDeleteSubmit} variant='contained' color='error' disabled={loading}>
              {loading ? <><CircularProgress size={16} color='inherit' sx={{marginRight:`3px`}} />  Delete</> : 'Delete'}
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : null
}

export default Popup
