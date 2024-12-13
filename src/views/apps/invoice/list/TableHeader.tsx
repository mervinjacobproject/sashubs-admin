import Box from '@mui/material/Box'
import React, { useEffect, useState } from 'react'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import EmployeeStepper from 'src/pages/apps/employee/employee-details/employeeStepper'
import Select from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import { Autocomplete, IconButton, MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

const TableHeader = (props: any) => {
  const router = useRouter()
  const {  selectedEmployeeId, printData, employeeList,setEmployeeID,setActiveStatus,activeStatus,mobileNo,setMobileNo,setFilterMail,filterMail,fetchData,employee } = props
  const [showMessage, setShowMessage] = useState(false)

  const defaultAccountValues:any = {
    employee: '',
  }

  const {
    control,
    watch,
    formState: {}
  } = useForm<any>({
    defaultValues: defaultAccountValues,
  })

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage)
  }

  const handleStatusChange = (event: any) => {
    setActiveStatus(event.target.value)
  }

  const handleOpenDrawer = () => {
    router.push({
      pathname: '/apps/employee/employee-details/',
      query: { id: 'new' }
    })
  }

  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'n') {
        handleOpenDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleOpenDrawer]);



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
          justifyContent: 'end'
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
            <Tooltip title='Filter'>
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>

            <Tooltip title='Print'>
              <div>
                <IconButton onClick={printData}>
                  <Icon icon='ion:print' />
                </IconButton>
              </div>
            </Tooltip>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='Add New'>
              <EmployeeStepper fetchData={fetchData} selectedEmployeeId={selectedEmployeeId} employee={employee}/>
            </DrawerComponent>
          </Grid>
        </Box>
      </Box>

      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'  style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',gap:"12px"
              }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
              }}
            >
              <label style={{ marginRight: '10px' }}>Status</label>

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
              Employee
            </label>
            <br></br>
            <Grid sx={{ width: '250px' }}>
              <Controller
                name='employee'
                control={control}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      {...field}
                      options={employeeList}
                      getOptionLabel={(option: any) => option.FirstName + option.LastName || ''}
                      value={employeeList?.find((pricevalue: any) => pricevalue?.DID === watch('employee')) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.DID || null)
                        setEmployeeID(newValue?.DID)
                      }}
                      isOptionEqualToValue={(option, value) => option?.DID === value?.DID}
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
          <Grid  sx={{ mb: 6, width: '250px' }}>
                <div>
                  <Controller
                    name='mobile'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <CustomTextField
                          fullWidth
                          value={mobileNo}
                          autoFocus
                          label={
                            <div>
                              <span
                                className='firstname'
                                style={{
                                  color: getColor()
                                }}
                              >
                            Mobile
                              </span>
                            </div>
                          }
                          placeholder='Mobile'
                          onChange={e => {
                            const inputValue = e.target.value
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setMobileNo(inputValue);
                              onChange(e)
                            }
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </Grid>
              <Grid  sx={{ mb: 6, width: '250px' }}>
                <div className='empTextField'>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        value={filterMail}
                        fullWidth
                        autoComplete='off'
                        label={
                          <div>
                            <span
                              className='firstname'
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
                          const inputValue = e.target.value;
                          const filteredValue = inputValue.replace(/[^a-z.@]/gi, '');
                          const modifiedValue = filteredValue.toLowerCase();
                          onChange(modifiedValue); 
                          setFilterMail(modifiedValue); 
                        }}
                        placeholder='Email'
                        aria-describedby='stepper-linear-account-email'
                      />
                    )}
                  />
                </div>
              </Grid>
          </div>
         
        </div>
      )}
   
    </>
  )
}

export default TableHeader
