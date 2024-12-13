// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect, useState } from 'react'

import PrincingCatagoriesform from 'src/pages/pricing/pricing-categories/PrincingCatagoriesforms'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'

import RightDrawerSettingsCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerSettings'
import EditSendGridForm from 'src/pages/settings/sendgrid/editFormSendGrid'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  resetEditid?: () => void
  editId: number | null
  editStatus: number | null
  fetchData: any
  rowId:any
  rowData:any
}

// type Anchor = 'top' | 'left' | 'bottom' | 'right';
const SendGridHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter, editId, editStatus,rowId,rowData } = props

  const [showMessage, setShowMessage] = useState(false);

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage);
  };
  
  const resetEditid = () => {
    props.resetEditid?.()
  }

  const fetchData = () => {
    props.fetchData()
  }

  const handleOpenDrawer = () => {
    //hi
  }

  const handleCloseDrawer = () => {
    //key
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
          {/* <Grid sx={{ display: 'flex', alignItems: 'start' }}>

          <div>
              <IconButton onClick={handleIconButtonClick}>
                <Icon icon='mingcute:filter-line' />
              </IconButton>
            </div>
          </Grid> */}
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
           
            <RightDrawerSettingsCatageory anchor='right' buttonLabel=''  onOpen={handleOpenDrawer}>
              <EditSendGridForm rowData={rowData} rowId={rowId} fetchData={fetchData} editStatus resetEditid={resetEditid} editId={editId} />
            </RightDrawerSettingsCatageory>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default SendGridHeader
