
// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import React from 'react'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import InvoiceSteper from 'src/pages/transactions/invoice_old/invoicesteper'






interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

// type Anchor = 'top' | 'left' | 'bottom' | 'right';
const  InvoiceHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props

  // const [state, setState] = React.useState({
  //   top: false,
  //   left: false,
  //   bottom: false,
  //   right: false,
  // });
  // const toggleDrawer =
  // (anchor: Anchor, open: boolean) =>
  // (event: React.KeyboardEvent | React.MouseEvent) => {
  //   if (
  //     event.type === 'keydown' &&
  //     ((event as React.KeyboardEvent).key === 'Tab' ||
  //       (event as React.KeyboardEvent).key === 'Shift')
  //   ) {
  //     return;
  //   }

  //   setState({ ...state, [anchor]: open });
  // };
  // const list = (anchor: Anchor) => (
  //   <Box
  //     sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 850,}}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >

  //   </Box>
  // )
  const handleOpenDrawer = () => {
    // Handle the logic to open the drawer
  };

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
      <CustomTextField
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
      </CustomTextField>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4,  }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />

        {/* <Button sx={{ mb: 2 }}  onClick={}>
          Create Jobs
        </Button> */}

  <DrawerComponent  anchor="right"   onOpen={handleOpenDrawer} buttonLabel="Add new">
  <InvoiceSteper/>
  </DrawerComponent>


      </Box>
    </Box>
  )
}

export default InvoiceHeader
