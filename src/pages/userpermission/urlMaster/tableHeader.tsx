import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer1'
import UrlMasterform from './urlMasterform'

const ParentTypeHeader = (props: any) => {
  // ** Props
  const { applyFilters, resetFilters, fetchData, chargeList } = props
  const [activeStatus, setActiveStatus] = useState<any>(2)
  const [showMessage, setShowMessage] = useState(false)
  const [ParentCategory, setParentCategory] = useState('')
  const [ParentMaster, setParentMaster] = useState('')

  const resetAll = () => {
    setActiveStatus(2)
    resetFilters()
  }

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const resetEditid = () => {
    props.resetEditid()
  }

  const handleOpenDrawer = () => {
    console.log('')
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
    setActiveStatus(2)
    resetFilters()
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
          <Grid sx={{ display: 'flex', alignItems: 'start' }}>
            <div>
              <IconButton onClick={handleIconButtonClick}>
                <Icon icon='mingcute:filter-line' />
              </IconButton>
            </div>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <DrawerComponent width='530px' anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New'>
              <UrlMasterform fetchData={fetchData} resetEditid={resetEditid} chargeList={chargeList} />
            </DrawerComponent>
          </Grid>
        </Box>
      </Box>

      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '20px'
              }}
            >
              <Grid>
                <label style={{ marginRight: '10px' }}>Status</label>
                <br></br>
                <Select sx={{ height: '40px', marginRight: '5px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value={2}>Show All</MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </Grid>

              <Grid>
                <label style={{ marginRight: '10px', marginTop: '10px', marginLeft: '5px' }}>MasterName</label>
                <br></br>
                <CustomTextField
                  placeholder='MasterName'
                  sx={{ marginBottom: '15px', height: '40px' }}
                  value={ParentCategory}
                  onChange={e => {
                    setParentCategory(e.target.value)
                  }}
                />
              </Grid>
              <Grid>
                <label style={{ marginRight: '10px', marginTop: '10px', marginLeft: '5px' }}>Parenyt MasterName</label>
                <br></br>
                <CustomTextField
                  placeholder='Parenyt Master Name'
                  sx={{ marginBottom: '15px', height: '40px' }}
                  value={ParentMaster}
                  onChange={e => {
                    setParentMaster(e.target.value)
                  }}
                />
              </Grid>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => applyFilters(activeStatus, ParentCategory, ParentMaster)} variant='contained'>
                  <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='mingcute:filter-line' />
                  Filter
                </Button>
              </Box>
              <Box sx={{ display: 'flex', marginLeft: '5px', alignItems: 'center' }}>
                <Button
                  onClick={() => {
                    setParentCategory('')
                    setParentMaster('')
                    resetAll()
                  }}
                  variant='contained'
                >
                  <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='radix-icons:reset' />
                </Button>
              </Box>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ParentTypeHeader
