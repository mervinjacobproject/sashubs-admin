// DrawerComponent.tsx
import React, { useState, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Icon from 'src/@core/components/icon'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'


type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerComponentProps {
  anchor: Anchor;
  onOpen: () => void;
  buttonLabel: string;
  children: ReactNode
  updateParent?: () => void
  width?: string;
  textBoolean?: boolean;
  closeCommand?:boolean
}

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit';
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit' 
  } else {
    return '#fff'
  }
}



const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 15,
  left: 0,
  color: 'black',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const RightDrawerSettingsCatageory: React.FC<DrawerComponentProps> = ({ anchor, onOpen, buttonLabel, children, width, textBoolean,closeCommand, updateParent }) => {
  const [open, setOpen] = useState(false);

  // const [close, setClose] = useState(false);



  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent, open: boolean) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const handleClose = () => {
    if(updateParent){
      updateParent && updateParent()
      setOpen(false);
    }else{
      setOpen(false);      
    }
  };


  const list = () => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '400px', padding: "20px ", background: "#2f2b3d0f", height: "100vh" }}
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
      }}

    > <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleClose}>
    <Icon icon='tabler:x' fontSize='1.25rem' />
    </CustomCloseButton>

      {children}
    </Box>
  );

  return (
    <React.Fragment>
      <div

        id='NewChargeBtn'
        onClick={() => {
          onOpen(); setOpen(true);

        }}>



        {/* <Icon

          icon="ic:twotone-add"
          width={20}
          height={20}
        /> */}



        {buttonLabel}
      </div>
      <Drawer anchor={anchor} open={open || textBoolean ? true : false} onClose={() => toggleDrawer({} as React.MouseEvent, false)}>
        {list()}
      </Drawer>

    </React.Fragment>
  );
};

export default RightDrawerSettingsCatageory;
export function closeRightPopupClick() {
  const button = document.getElementById('rightDrawerClose')
  if (button) {
    button.click()
  } else {
  }
}