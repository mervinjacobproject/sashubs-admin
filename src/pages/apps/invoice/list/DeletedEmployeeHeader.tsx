import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import { useState } from 'react'

const DeletedEmployeeHeader = ({ bulkDelete, selectedRows, handleRestore }: any) => {
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [modalOpenRestore, setModalOpenRestore] = useState(false)

  const handleRestoreClick = () => {
    handleRestore()
    setModalOpenRestore(false)
  }

  const handleDeleteClick = () => {
    bulkDelete()
    setModalOpenDelete(false)
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
      <Box
        sx={{
          p: 5,
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Grid sx={{ display: 'flex', gap: '15px' }}>
            <Button
              onClick={() => setModalOpenRestore(true)}
              disabled={selectedRows.length < 1}
              variant='contained'
              sx={{
                backgroundColor: '#776cff',
                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                },
                height: '40px',
                padding: '5px 5px 5px 10px'
              }}
            >
              Restore
            </Button>

            <CustomModal
              open={modalOpenRestore}
              onClose={() => setModalOpenRestore(false)}
              onOpen={() => setModalOpenRestore(true)}
              buttonOpenText=''
              buttonText=''
            >
              <p
                style={{
                  color:
                  getColor(),
                  fontSize: '14px'
                }}
              >
                Are you sure you want to Restore?
              </p>

              <div
                className='delete-popup'
                style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
              >
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#808080',
                    '&:hover': {
                      background: '#808080',
                      color: 'white'
                    }
                  }}
                  onClick={() => {
                    setModalOpenRestore(false)
                  }}
                >
                  No
                </Button>
                <Button
                  variant='contained'
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  onClick={handleRestoreClick}
                >
                  Yes
                </Button>
              </div>
            </CustomModal>
            <CustomModal
              open={modalOpenDelete}
              onClose={() => setModalOpenDelete(false)}
              onOpen={() => setModalOpenDelete(true)}
              buttonOpenText=''
              buttonText=''
            >
              <p
                style={{
                  color:
                  getColor(),
                  fontSize: '14px'
                }}
              >
                Are you sure you want to delete?
              </p>

              <div
                className='delete-popup'
                style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
              >
                <Button
                  variant='contained'
                  sx={{
                    '&:hover': {
                      background: '#776cff',
                      color: 'white'
                    }
                  }}
                  onClick={handleDeleteClick}
                >
                  Delete
                </Button>

                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#808080',
                    '&:hover': {
                      background: '#808080',
                      color: 'white'
                    }
                  }}
                  onClick={() => {
                    setModalOpenDelete(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CustomModal>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default DeletedEmployeeHeader
