



// DrawerComponent.tsx
import React, { useState, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import Icon from 'src/@core/components/icon'

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerComponentProps {
  anchor: Anchor;
  isOld?: boolean
  onOpen: () => void;

  buttonLabel: string;
  children: ReactNode
}

const RightDrawerInvoice: React.FC<DrawerComponentProps> = ({ anchor, onOpen, buttonLabel, children }) => {
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

  const list = () => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '1316px', padding: "20px ", background: "#2f2b3d0f", height: "100vh" }}
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
      }}

    >
      {children}
    </Box>
  );

  return (
    <React.Fragment>
      <Button variant="contained" sx={{
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        width: "100px",
        padding: "5px !important",
        height: '40px',
        fontSize: '15px',
        whiteSpace: "nowrap",
        '&:hover': {
          background: '#776cff',
          color: 'white',
        },
      }}
        id='NewChargeBtn'
        onClick={() => {
          onOpen(); setOpen(true);

        }}>



        <Icon

          icon="ic:twotone-add"
          width={20}
          height={20}
        />



        {buttonLabel}
      </Button>
      <Drawer anchor={anchor} open={open} onClose={() => toggleDrawer({} as React.MouseEvent, false)}>
        {list()}
      </Drawer>

    </React.Fragment>
  );
};

export default RightDrawerInvoice;
