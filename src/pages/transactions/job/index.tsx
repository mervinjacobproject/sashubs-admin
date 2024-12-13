import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import JobTab from './jobTab';
import Head from 'next/head';

const JobDetail = () => {

  return (
    <>
      <Head>
        <title>Job - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={12}>
            <JobTab />
            <Card>
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  );
};

export default JobDetail;