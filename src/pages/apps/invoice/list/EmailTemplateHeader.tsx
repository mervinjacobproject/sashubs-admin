// ** Next Import
// ** MUI Imports
import Box from '@mui/material/Box'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select';
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button';
// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect ,useState} from 'react'
import RightDrawerCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerCatageory'
import PrincingCatagoriesform from 'src/pages/pricing/pricing-categories/PrincingCatagoriesforms'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal';
import EmailTemplateForm from 'src/pages/settings/email-template/editEmailTemplate';
import CardSnippet from 'src/@core/components/card-snippet';
import Editors from 'src/pages/forms/form-elements/editor';
import EditorControlled from 'src/views/forms/form-elements/editor/EditorControlled';
import RightDrawerSettingsCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerSettings';
import RightDrawerEmailCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerEmail';
import RightDrawerUsers from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerusers';


interface TableHeaderProps {
  value: string;
  selectedRows: GridRowId[];
  handleFilter: (val: string) => void;
  resetEditid?: () => void;
  editId: number | null;
  editStatus: number | null;
  fetchData:any
  rowId:any
 
}

// type Anchor = 'top' | 'left' | 'bottom' | 'right';
const EmailTemplateHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value,rowId, selectedRows, handleFilter, editId, editStatus  } = props
 
  const resetEditid = () => {
    props.resetEditid?.();
  };

  const fetchData = () => {
    props.fetchData()
  }


  const handleOpenDrawer = () => {

    // console.log('Drawer opened!');
  };
  const handleCloseDrawer = () => {

    // console.log('Drawer opened!');
  };
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
      
<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: "space-between", width: "100%", }}>
<Grid sx={{ display: 'flex', alignItems: "start" }} >




</Grid>
<Grid sx={{ display: "flex", alignItems: "center"  }}>
        <RightDrawerUsers anchor="right"  onOpen={handleOpenDrawer} buttonLabel="">
          <EmailTemplateForm  rowId={rowId} fetchData={fetchData} editStatus resetEditid={resetEditid} editId={editId} />
      
        </RightDrawerUsers>
</Grid>

     
      </Box>
    </Box>
       
  </>
)
}
  

export default EmailTemplateHeader
