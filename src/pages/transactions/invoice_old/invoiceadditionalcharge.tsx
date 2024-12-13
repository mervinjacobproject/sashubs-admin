import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'

import { Box } from '@mui/system'
import InvoiceAdditionalTable from './invoiceadditionalTable'

const InvoiceAdditionalCharges = () => {
  const [items, setItems] = useState([{ id: 1 }])
  const [newItemIndex, setNewItemIndex] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const handleDeleteItem = (id:any) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
  }

  useEffect(() => {
    if (newItemIndex !== null) {
      // Reset newItemIndex after applying the animation
      setTimeout(() => {
        setNewItemIndex(null)
      }, 300) // Adjust the timeout duration based on your desired animation time
    }
  }, [newItemIndex])

  return (
    <>
    <Box sx={{ maxHeight: '400px', overflowY: 'auto',scrollbarWidth: 'thin' }}>
      {items.map((item) => (
        <Card key={item.id} sx={{ padding: '10px', marginTop: '15px', border:"1px solid #cacaca" }}>
          <Grid container spacing={3}>
            <Grid item xs={1} sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
              <div>
              <Typography sx={{ fontSize: '10px' }}>S.No</Typography>
              <Typography sx={{ fontSize: '12px',textAlign:"center" }}>
                {item.id}
              </Typography>
              </div>           
            </Grid>
            <Grid item xs={1} sx={{ cursor: 'pointer',display:"flex",justifyContent:"center",alignItems:"center" }}>
              <Card
                onClick={() => handleDeleteItem(item.id)}
                sx={{
                  border:"1px solid #cacaca",
                  width: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '32px',
                  alignItems: 'center',
                  marginTop:"8px"
                }}
              >
                <Icon icon='ic:baseline-delete' />
              </Card>
            </Grid>
            <Grid></Grid>
            <Grid item xs={5} sx={{textAlign:"center",display:"grid"}}>
            <Typography sx={{fontSize:"12px"}}>Name</Typography>
            <Typography sx={{fontSize:"12px",fontWeight:"bold"}}>AndreW Rusell</Typography>
            </Grid>
            <Grid item xs={5}>
              <TextField
                InputLabelProps={{
                  style: { fontSize: '12px' }
                }}
                id='Description'
                label='charge'
                variant='outlined'
                fullWidth
                margin='normal'
                sx={{
                  '& input': { fontSize: '12px', height: '20px', padding: '5px' }, 
                  '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)'}
                }}
              />
            </Grid>
          </Grid>
        </Card>
      ))}
       <style>
    {`
      /* WebKit browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 2px;
       
      }

      ::-webkit-scrollbar-thumb {
        background-color: #776cff;
      }
    `}
  </style>
      </Box>
<Grid xs={12} sx={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
      <CustomModal
        open={modalOpen}
        onClose={handleModalClose}
        onOpen={handleModalOpen}
        buttonOpenText='Add '
        buttonText=''
        width={1200}
      >
        <Button
          onClick={handleModalClose}
          style={{
            position: 'absolute',
            top: -12,
            right: -4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <p style={{ color: '#717171' }}>[esc]</p>
          <img src='/images/icons/project-icons/cross.svg' alt='Close' width={20} height={20} />
        </Button>
        <InvoiceAdditionalTable/>
      </CustomModal>
      <Card sx={{padding:"20px",width:"300px",textAlign:"start",border:"1px solid #cacaca"}}>
        <Typography> Additional Charges :</Typography>
        <Typography>Sub Total : </Typography>
        <Typography>GST :</Typography>
        <Typography>Net Amount :</Typography>
      </Card>
      </Grid>
    </>
  )
}



export default InvoiceAdditionalCharges
