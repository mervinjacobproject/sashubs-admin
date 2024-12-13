import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import { Box, TextField } from '@mui/material'

const InvoiceTask = () => {
  const [items, setItems] = useState<any>([{ id: 1 }])
  const [newItemIndex, setNewItemIndex] = useState(null)

  const handleAddItem = () => {
    const newItem = { id: items.length + 1 }
    setItems([...items, newItem])
    setNewItemIndex(items.length) // Set the index of the newly added item
  }

  const handleDeleteItem = (id:any) => {
    const updatedItems = items.filter((item:any) => item.id !== id)
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
      {items.map((item:any) => (
        <Card key={item.id} sx={{ padding: '10px',marginTop:"15px" }}>
          <Grid container spacing={3}>
            <Grid item xs={1} sx={{ display: 'grid', justifyItems: 'center', alignItems: 'center' }}>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: '10px' }}>S.No</Typography>
                <Typography sx={{fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {item.id}
                </Typography>
              </Grid>
              <Grid xs={12} sx={{ cursor: 'pointer' }}>
                <Card
                  onClick={() => handleDeleteItem(item.id)}
                  sx={{
                    border:"1px solid #cacaca",
                    width: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '40px',
                    alignItems: 'center',
                    marginTop: '7px'
                  }}
                >
                  <Icon icon='ic:baseline-delete' />
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <TextField
                InputLabelProps={{
                  style: { fontSize: '12px' }
                }}
                id='Description'
                label='Description'
                variant='outlined'
                fullWidth
                multiline
                rows={2}
                margin='normal'
              />
            </Grid>
            <Grid item xs={3}>
              <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid xs={4} item>
                  <TextField
                    id='Quantity'
                    label='Quantity'
                    variant='outlined'
                    fullWidth
                    minRows={1}
                    margin='normal'
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                    sx={{
                      '& input': { fontSize: '12px', height: '20px', padding: '5px' }, 
                      '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)'}
                    }}
                  />
                </Grid>
                <Grid
                  xs={4}
                  item
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}
                >
                  <Icon fontSize='1.625rem' icon='tdesign:multiply' />
                </Grid>
                <Grid xs={4} item>
                  <TextField
                    id='PerRate'
                    label='Per Rate'
                    variant='outlined'
                    fullWidth
                    margin='normal'
                    InputLabelProps={{
                      style: { fontSize: '12px' }
                    }}
                    sx={{
                      '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                      '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)'}
                    }}
                  />
                </Grid>
              </Grid>
              <Grid sx={{height:"20px"}} xs={12}>
                <TextField
                  id='TotalRate'
                  label='Total Rate'
                  variant='outlined'
                  fullWidth
                  InputLabelProps={{
                    style: { fontSize: '12px' }
                  }}
                  margin='normal'
                  sx={{margin:"8px 0px 0px 0px !important", 
                    '& input': { fontSize: '12px', height: '20px', padding: '5px' },
                    '& label': { fontSize: '12px', top: '3px', transform: 'translate(14px, 5px) scale(0.75)'}
                  }}
                />
              </Grid>
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
      <Button
        onClick={handleAddItem}
        sx={{
          width: '100px',
          background: '#776cff',
          marginTop: '10px',
          color: '#fff',
          '&:hover': {
            background: '#776cff'
          }
        }}
      >
        Add Item
      </Button>
    </>
  )
}

export default InvoiceTask
