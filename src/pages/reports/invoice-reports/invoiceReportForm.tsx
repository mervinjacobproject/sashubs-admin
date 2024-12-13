
import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import 'react-phone-input-2/lib/style.css'
import { MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field';
import { Button } from '@mui/material';
import Icon from 'src/@core/components/icon'
import Datepickers from 'src/pages/components/ReusableComponents/datepicker/datepicker';

interface FormValues {
  InvoiceID: string
  lastname: string
  CompanyName: string
  CompanyABNNumber: string
  Designation: string
  CustomerGroup: string
  title: string
  mobileNumber: string
}

const InvoiceReportForm = ({ handleFilter }: any) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [statusval, setstatusval] = useState<string>('draft')


  const handleDateChange = (value: any) => {
    setSelectedDate(value)
  }

  const defaultAccountValues: FormValues = {
    InvoiceID: '',
    lastname: '',
    CompanyName: '',
    CompanyABNNumber: '',
    Designation: '',
    CustomerGroup: '',
    title: '',
    mobileNumber: ''
  }

  const accountSchema = yup.object().shape({
    InvoiceID: yup.string().required(),
    lastname: yup.string().required(),
    CompanyName: yup.string().required(),
    CompanyABNNumber: yup.string().required(),
    Designation: yup.string().required(),
    CustomerGroup: yup.string().required(),

    title: yup.string().required('Title is required'),
    mobileNumber: yup.string().required('Mobile number is required')
  })

  background: localStorage.getItem("selectedMode") === "dark" ? "transparent" :
    localStorage.getItem("selectedMode") === "light" ? "#fff" :
      localStorage.getItem("systemMode") === "dark" ? "transparent" : "#fff"

  const {
    control: accountControl,
    formState: { errors: accountErrors }
  } = useForm<FormValues>({
    defaultValues: defaultAccountValues,
    resolver: yupResolver(accountSchema)
  })

  const Searchpage = () => {
    handleFilter(statusval);
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
    <form >
      <span>Search By</span>
      <Grid container sx={{ mb: 2, mt: 5, border: "1px solid #cacaca", borderRadius: "5px", padding: '5px 4px 10px 4px', backgroundColor:backColor()  }} spacing={3}>

        <Grid item xs={12} sm={3} sx={{ marginTop: '5px' }} className='empTextField'>
          <Controller
            name='InvoiceID'
            control={accountControl}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                label={
                  <div>
                    <span className='status' style={{color:getColor()}}>Invoice ID</span>
                  </div>
                }
                placeholder='InvoiceID'
                inputProps={{
                  style: {  color:
                    getColor() 
                   }
                }}
                onChange={onChange}
                error={Boolean(accountErrors.InvoiceID)}
                aria-describedby='stepper-linear-account-username'
                {...(accountErrors.InvoiceID && { helperText: 'InvoiceID  is required' })}
              />
            )}
          />
        </Grid>


        <Grid item xs={3} sm={3}>
          <CustomTextField label={
            <div>
              <span className='status' style={{color:getColor()}}>Customer</span>
              <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>
                
              </Typography>
            </div>
          } 
          fullWidth select defaultValue='Customer'>
            <MenuItem value='App Design'>Mr</MenuItem>
            <MenuItem value='App Customization'>Mrs</MenuItem>
            <MenuItem value='ABC Template'>Miss</MenuItem>

          </CustomTextField>
        </Grid>


        <Grid item xs={3} sm={3}>

          <CustomTextField value={statusval}
            onChange={(e: any) => setstatusval(e.target.value)}
            label={
              <div>
                <span className='status' style={{color:getColor()}}>Status</span>
                <Typography variant="caption" color="error" sx={{ fontSize: "17px", marginLeft: "2px" }}>

                </Typography>
              </div>
            } fullWidth select defaultValue='draft'>
            <MenuItem value='draft' >Draft</MenuItem>
            <MenuItem value='notpaid' >Not Paid</MenuItem>
            <MenuItem value='paid'>Paid</MenuItem>

          </CustomTextField>
        </Grid>




        <Grid item xs={3} sm={3}>
          <div>
            <span className='status' style={{ fontSize: '13px', marginBottom: '4px' , color:getColor()}}>Date Range</span>
            <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
          </div>
          <div style={{ position: 'relative', marginTop: 4 }}>
            <Datepickers
            id="dateRange"
            name="dateRange"
              style={{
              
                    color:getColor()
              }}
              value={selectedDate}
              onChange={handleDateChange}
              placeholder='Select a date'
              error={null}
              touched={null}
            />

            <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
              <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} sx={{ justifyContent: "center" }} >


          <Button type="button" onClick={Searchpage} sx={{


            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            width: "90px",
            padding: "5px !important",
            height: '35px',
            fontSize: '15px',
            whiteSpace: "nowrap",

            '&:hover': {
              background: '#776cff',
              color: 'white',
            },
          }} variant="contained" >
            <Icon

              icon="material-symbols-light:save-sharp"
              width={25}
              height={25}
            />
            Search
          </Button>
        </Grid>
      </Grid>


    </form>



  );
};



export default InvoiceReportForm


