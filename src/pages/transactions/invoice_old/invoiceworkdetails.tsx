import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import AdditionalChargesTable from '../invoice/additionalChargesTable'


const InvoiceWorkDetails = () => {
  const [items, setItems] = useState([{ id: 1 }])
  const [newItemIndex, setNewItemIndex] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  // const handleAddItem = () => {
  //   const newItem = { id: items.length + 1 }
  //   setItems([...items, newItem])
  //   setNewItemIndex(items.length)
  // }

  const handleDeleteItem = (id: any) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
  }

  useEffect(() => {
    if (newItemIndex !== null) {
      setTimeout(() => {
        setNewItemIndex(null)
      }, 300)
    }
  }, [newItemIndex])

  return (
    <>
      {items.map((item) => (
        <Card key={item.id} sx={{ padding: '10px', marginTop: '15px' }}>
          <Grid container spacing={3}>
            <Grid item xs={1} sx={{ display: 'grid', justifyItems: 'center', alignItems: 'center', marginTop: "14px" }}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: '12px' }}>S.No</Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {item.id}
                </Typography>
              </Grid>
              <Grid xs={12} sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card
                  onClick={() => handleDeleteItem(item.id)}
                  sx={{
                    width: '52px',
                    border: "1px solid #cacaca",
                    display: 'flex',
                    justifyContent: 'center',
                    height: '52px',
                    alignItems: 'center',
                  }}
                >
                  <Icon icon='ic:baseline-delete' />
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12} >
                  <TextField
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                    id='Description'
                    label='Employee Name'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    sx={{
                      '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                      '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                    id='Description'
                    label='Descriptionss'
                    multiline
                    rows={1}
                    margin='normal'
                    variant='outlined'
                    fullWidth
                    sx={{
                      '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                      '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              xs={5}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}
            >
              <Grid
                item
                xs={3}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <TextField
                  InputLabelProps={{
                    style: { fontSize: '12px' }
                  }}
                  id='Description'
                  label='Qty'
                  variant='outlined'
                  fullWidth
                  sx={{
                    '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                    '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                  }}
                />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Icon fontSize='1.625rem' icon='tdesign:multiply' />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}
              >
                <TextField
                  InputLabelProps={{
                    style: { fontSize: '12px' }
                  }}
                  id='Description'
                  label='Basic Rate'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  sx={{
                    margin: "0px !important",
                    '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                    '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                  }}
                />
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '4px',
                  fontWeight: 'bold',
                }}
              >
                <Icon fontSize='1.125rem' icon='lets-icons:add' />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}
              >
                <TextField
                  InputLabelProps={{
                    style: { fontSize: '12px' }
                  }}
                  id='Description'
                  label='Extra charge'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  sx={{
                    margin: "0px !important",
                    '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                    '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                  }}
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid
                item
                xs={4}
                sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: '2px' }}
              >
                <Icon fontSize='1.125rem' icon='material-symbols:equal' />
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Total</Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold' }}>$ 10.04</Typography>
              </Grid>

              {/* <Grid item xs={1}>
              <TextField
                InputLabelProps={{
                  style: { fontSize: '12px' }
                }}
                id='Description'
                label='Extra charge'
                variant='outlined'
                fullWidth
                margin='normal'
                sx={{
                  '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                  '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)' }
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                InputLabelProps={{
                  style: { fontSize: '12px' }
                }}
                id='Description'
                label='Amount'
                variant='outlined'
                fullWidth
                margin='normal'
              />
            </Grid> */}


            </Grid>
          </Grid>
        </Card>
      ))}
      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <CustomModal
          open={modalOpen}
          onClose={handleModalClose}
          onOpen={handleModalOpen}
          buttonOpenText='Add Additional Charges'
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
          <AdditionalChargesTable />
        </CustomModal>
        <Card sx={{ padding: '20px', width: '300px', textAlign: 'start' }}>
          <Typography> Working Charges : $</Typography>
        </Card>
      </Grid>
    </>
  )
}

export default InvoiceWorkDetails
