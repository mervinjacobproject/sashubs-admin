import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from 'src/@core/components/mui/text-field'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import { Autocomplete, IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SubForm from './subform'

interface FormValues {
  ParentCategory: any
}
const SubTypeHeader = (props: any) => {
  // ** Props
  const { applyFilters, resetFilters, fetchData, isWrite, ParentCategory } = props
  const [activeStatus, setActiveStatus] = useState<any>(2)
  const [showMessage, setShowMessage] = useState(false)
  const [searchvehicle, setSearchvehicle] = useState('')
  const [loading, setloading] = useState(false)
  const [getcuid, setgetcuid] = useState('')

  const defaultAccountValues: FormValues = {
    ParentCategory: ''
  }
  const accountSchema = yup.object().shape({})
  const {
    control: accountControl,
    formState: { errors: accountErrors },
    handleSubmit,
    setValue,
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,

    resolver: yupResolver(accountSchema)
  })

  const cleartext = () => {
    reset({ ParentCategory: '' })
  }

  const resetAll = () => {
    resetFilters()
    cleartext()
    reset()
    setActiveStatus(2)

    setgetcuid('')
    setTimeout(() => {
      setloading(false)
    }, 500)
  }

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const resetEditid = () => {
    props.resetEditid()
    resetFilters()
  }

  const handleOpenDrawer = () => {
    console.log('')
  }

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
    setActiveStatus(2)
    resetFilters()
  }

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
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Grid sx={{ display: 'flex', alignItems: 'start' }}>
            <div>
              <IconButton onClick={handleIconButtonClick}>
                <Icon icon='mingcute:filter-line' />
              </IconButton>
            </div>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <DrawerComponent width='530px' anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New'>
              <SubForm fetchData={fetchData} editStatus resetEditid={resetEditid} ParentCategory={ParentCategory} />
            </DrawerComponent>
          </Grid>
        </Box>
      </Box>

      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '20px'
              }}
            >
              <Grid>
                <label style={{ marginRight: '10px' }}>Status</label>
                <br></br>
                <Select sx={{ height: '40px', marginRight: '5px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value={2}>Show All</MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </Grid>
              <Grid sx={{ width: '200px' }}>
                <label
                  style={{
                    marginRight: '10px',
                    marginTop: '15px',
                    marginLeft: '9px'
                  }}
                >
                  {' '}
                  Parent Category Filter{' '}
                </label>

                <Controller
                  name='ParentCategory'
                  control={accountControl}
                  render={({ field }) => (
                    <>
                      <Autocomplete
                        {...field}
                        options={ParentCategory}
                        getOptionLabel={(option: any) => option.Category || ''}
                        value={
                          ParentCategory?.find((pricevalue: any) => pricevalue?.Category == watch('ParentCategory')) ||
                          null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue?.Category || null)
                          setgetcuid(newValue?.CId)
                        }}
                        isOptionEqualToValue={(option, value) => option?.CId === value?.CId}
                        renderInput={params => (
                          <CustomTextField
                            {...params}
                            inputProps={{
                              ...params.inputProps
                            }}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid>
                <label style={{ marginRight: '10px', marginTop: '10px', marginLeft: '5px' }}>Sub Category Name</label>
                <br></br>
                <CustomTextField
                  placeholder='Sub Category Name'
                  sx={{ marginBottom: '15px', height: '40px' }}
                  value={searchvehicle}
                  onChange={e => {
                    setSearchvehicle(e.target.value)
                  }}
                />
              </Grid>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={() => applyFilters(activeStatus, searchvehicle, getcuid)} variant='contained'>
                  <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='mingcute:filter-line' />
                  Filter
                </Button>
              </Box>
              <Box sx={{ display: 'flex', marginLeft: '5px', alignItems: 'center' }}>
                <Button
                  onClick={() => {
                    setSearchvehicle('')
                    resetAll()
                  }}
                  variant='contained'
                >
                  <Icon fontSize='1.125rem' style={{ marginRight: '5px' }} icon='radix-icons:reset' />
                </Button>
              </Box>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SubTypeHeader
