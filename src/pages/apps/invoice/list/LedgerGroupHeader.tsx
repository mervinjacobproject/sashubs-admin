import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { GridRowId } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field';
import Modal from '@mui/material/Modal';
import Employeegroupform from 'src/pages/apps/employee/employee-group/employeegroupform';
import { Tooltip } from '@mui/material';

import Icon from 'src/@core/components/icon'


interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ReusableModal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '8px',
          WebkitBoxShadow
          :
          '0 0 10px #222'
        ,
        boxShadow
          :
          '0 0 10px #222'
        ,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 3,
            right: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display:'flex',
            alignItems:'center',
            gap:"5px"
          }}
        >
              <p>[esc]</p>
          <img src="/images/icons/project-icons/cross.svg" alt="Close" width={20} height={20} />
        </button>
        {children}
      </Box>
    </Modal>
  );
};

interface EmployeegroupHeaderProps {
  value: string;
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

const LedgerGroupHeader = (props: EmployeegroupHeaderProps) => {
  const [isCreateJobsModalOpen, setCreateJobsModalOpen] = React.useState(false);

  const toggleCreateJobsModal = () => {
    setCreateJobsModalOpen(!isCreateJobsModalOpen);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        
        // toggleCreateJobsModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCreateJobsModalOpen]);
  
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <CustomTextField
        select
        defaultValue='Actions'
        sx={{ mr: 4, mb: 2 }}
        SelectProps={{
          displayEmpty: true,
          disabled: props.selectedRows.length === 0,
          renderValue: selected => ((selected as string)?.length === 0 ? 'Actions' : (selected as string)),
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
          value={props.value}
          sx={{ mr: 4 }}
          placeholder='Search'
          onChange={e => props.handleFilter(e.target.value)}
        />
        <Tooltip title="click or alt+D" arrow disableInteractive followCursor>
  <Button
    variant="contained"
    sx={{
      display: 'flex',
      justifyContent:"center",
      alignItems: 'center', 
     width:"100px",
     padding:"5px !important",
     height:'40px',
     fontSize:'15px',
     whiteSpace:"nowrap",
  
      '&:hover': {
        background: '#776cff',
        color: 'white',
      },
    }}
    onClick={toggleCreateJobsModal}
  >
    <Icon

icon="ic:twotone-add"
width={20}
height={20}
/>
    Add New
  </Button>
</Tooltip>
        <ReusableModal open={isCreateJobsModalOpen} onClose={toggleCreateJobsModal}>
        <Employeegroupform/>
        </ReusableModal>
      </Box>
    </Box>
  );
};

export default LedgerGroupHeader;
