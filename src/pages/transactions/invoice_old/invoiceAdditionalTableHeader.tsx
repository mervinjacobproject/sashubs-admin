// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import React from 'react'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

// type Anchor = 'top' | 'left' | 'bottom' | 'right';
const InvoiceAdditionalTableHeader = (props: TableHeaderProps) => {
  const { value, handleFilter } = props

  return (
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

      {/* <CustomTextField
        select
        defaultValue='Actions'
        sx={{ mr: 4, mb: 2 }}
        SelectProps={{
          displayEmpty: true,
          disabled: selectedRows && selectedRows.length === 0,
          renderValue: selected => ((selected as string)?.length === 0 ? 'Actions' : (selected as string))
        }}
      >
        <MenuItem disabled value='Actions'>
          Actions
        </MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Send'>Send</MenuItem>
      </CustomTextField> */}
      

      <Box sx={{ display: 'flex',justifyContent:"end", alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}



export default InvoiceAdditionalTableHeader
