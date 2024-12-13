import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import InvoiceReportsTab from './invoicereportsTab'
import Head from 'next/head'


const InvoiceReports = () => {

  return (
    <DatePickerWrapper>
       <Head>
          <title>Invoice Reports - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <InvoiceReportsTab />
          <Card></Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceReports 
