import { Typography } from '@mui/material'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#FF8A30' : '#308fe8',
  },
}));

const GpsTracking = () => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography >Delivery Process</Typography>
        <Typography>100%</Typography>
      </div>

      <BorderLinearProgress variant="determinate" value={50} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 10fr', width: '300px', marginTop: '10px' }}>
        <div style={{ display: 'grid' }}>
          <div style={{ display: 'flex' }}>
            <Typography
              sx={{ transform: 'rotate(90deg)', display: 'flex', flexDirection: 'row', alignItems: 'self-end' }}
            >
              <Icon style={{ transform: 'rotate(270deg)', color: '#20c997'  }} fontSize='1.2em' icon='teenyicons:tick-circle-outline' />
              <span style={{ marginLeft: '6px', color: '#20c997' }}>.........</span>
            </Typography>
          </div>
          <div style={{ display: 'flex' }}>
            <Typography
              sx={{ transform: 'rotate(90deg)', display: 'flex', flexDirection: 'row', alignItems: 'self-end' }}
            >
              
              <Icon style={{ transform: 'rotate(270deg)', color: '#20c997'  }} fontSize='1.2em' icon='teenyicons:tick-circle-outline' />
              <span style={{ marginLeft: '6px',color:"#a5a3ae" }}>.........</span>
            </Typography>
          </div>
          <div>
            <Typography >
              <Icon style={{ color:"#776cff",   position:"absolute",left: "8px"}}  fontSize='1.2em' icon='teenyicons:tick-circle-outline' />
            </Typography>
          </div>
        </div>
        <div style={{ display: 'grid',gap:"10px" }}>
          <div>
            <Typography sx={{ color: '#20c997' }}>TRACKING NUMBER CREATED</Typography>
            <Typography sx={{fontSize:"0.9375rem",color:"#5d596c"}}>Veronica Herman</Typography>
            <Typography sx={{color:"#a5a3ae"}}>Sep 01, 7:53 AM</Typography>
          </div>
          <div>
            <Typography sx={{ color: '#20c997' }}>OUT FOR DELIVERY</Typography>
            <Typography sx={{fontSize:"0.9375rem",color:"#5d596c"}}>Veronica Herman</Typography>
            <Typography sx={{color:"#a5a3ae"}}>Sep 03, 8:02 AM</Typography>
          </div>
          <div>
            <Typography>ARRIVING</Typography>
            <Typography sx={{fontSize:"0.9375rem",color:"#5d596c"}}>Veronica Herman</Typography>
            <Typography sx={{color:"#a5a3ae"}}>Sep 04, 8:18 AM</Typography>
          </div>
        </div>
      </div>
    </>
  )
}

export default GpsTracking
