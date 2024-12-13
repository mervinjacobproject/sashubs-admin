import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { styled } from '@mui/system';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  buttonText?: string;
  buttonOpenText?: string;
  onOpen?: () => void;
}

// Custom backdrop component with blurred background
const CustomBackdrop = styled(Backdrop)(({ theme }) => ({
  backdropFilter: 'blur(1px)',
  backgroundColor: 'inherit',
}));

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)';
  } else if (selectedMode === 'light') {
    return '#fff';
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)';
  } else {
    return '#fff';
  }
};

const CustomModal: React.FC<ModalProps> = ({ open, onClose, children, width, height }) => {
  const style = {
    position: 'absolute' as const,
    top: '50%' as const,
    left: '55%' as const,
    transform: 'translate(-50%, -50%)' as const,
    width: width || 400 as const,
    height: height as any,
    backgroundColor: getColor(),
    borderRadius: '8px' as const,
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)' as const,
    padding: 4 as const,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        '.MuiModal-backdrop': {
          backdropFilter: 'blur(1px)',
          backgroundColor: 'inherit',
        }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
