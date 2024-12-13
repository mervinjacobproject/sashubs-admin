import { Autocomplete, IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import CustomTextField from 'src/@core/components/mui/text-field';
import RightDrawerEmailCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerEmail';
import UserDetailsForm from 'src/pages/settings/users/usersform';

interface FormData {
  name: string
  email: boolean
  mobile: string
}



interface TableHeaderProps {


  resetEditid?: () => void;
  editId: number | null;
  fetchData: any
  showMessage: any
  setActiveStatus: any
  firstNameID: any
  activeStatus: any
  setShowMessage: any
  deleteId: any
  setEmailName: any
  setFirstname: any
  emailName: any

}



const UsersHeader = (props: TableHeaderProps) => {

  const { editId, showMessage,
    setActiveStatus,
    firstNameID,
    activeStatus,
    setShowMessage,
    deleteId,
    setEmailName,
    setFirstname,
    emailName, } = props


  const {
    control,
    watch,
    formState: { }
  } = useForm<FormData>({})


  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value);
  };

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage);
  };

const resetEditid = () => {
    props.resetEditid?.();
  };

const fetchData = () => {
    props.fetchData()
  }

  const handleOpenDrawer = () => {
    setShowMessage(false);


  };

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else if (selectedMode === 'light') {
      return 'black'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else {
      return 'black'
    }
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


        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: "space-between", width: "100%", }}>

          <Grid sx={{ display: 'flex', alignItems: "start" }} >
         <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

           </Grid>
          <Grid sx={{ display: "flex", alignItems: "center" }}>
          <RightDrawerEmailCatageory anchor="right" onOpen={handleOpenDrawer} buttonLabel="Add New">
              <UserDetailsForm fetchData={fetchData} deleteId={deleteId} resetEditid={resetEditid} editId={editId} />
            </RightDrawerEmailCatageory>

          </Grid>
           </Box>
      </Box>
      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '10px',
                paddingTop: '4px'
              }}
            >
              <div
                style={{
                  display: 'grid'
                }}
              >
                <span
                  style={{
                    color: getColor(),
                    height: '2px'
                  }}
                >
                  Status
                </span>
                <Select sx={{ height: '40px' }} value={activeStatus} onChange={handleStatusChange}>
                  <MenuItem value='all'>Show All</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </div>
              <Grid sx={{ mb: 6 }}>
                <label
                  style={{
                    color: getColor()
                  }}
                >
                  Customer
                </label>
                <br></br>
                <Grid sx={{ width: '250px' }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <>
                        <Autocomplete
                          {...field}
                          options={firstNameID}
                          getOptionLabel={(option: any) => option.FirstName + '' + option.LastName}
                          value={firstNameID?.find((pricevalue: any) => pricevalue?.ID === watch('name')) || null}
                          onChange={(_, newValue) => {
                            field.onChange(newValue?.ID || null)
                            setFirstname(newValue?.ID)
                          }}
                          isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
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
              </Grid>
              <Grid className='empTextField'>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: 'Country  is required' }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextField
                      value={emailName}
                      fullWidth
                      autoFocus
                      label={
                        <div>
                          <span
                            className='emailName'
                            style={{
                              color: getColor(),
                              fontSize: '14px'
                            }}
                          >
                            Email
                          </span>
                        </div>
                      }
                      onChange={e => {
                        const inputValue = e.target.value
                        if (/^[A-Z]*\.?[a-z]*$/.test(inputValue) || inputValue === '') {
                          setEmailName(inputValue)
                          onChange(e)
                        }
                      }}
                      placeholder='Email'
                    />
                  )}
                />
              </Grid>

            </div>
          </div>
        </div>
      )}


    </>
  )
}



export default UsersHeader
