import React, { forwardRef, useEffect, useCallback } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, Card, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'
import Head from 'next/head'
import AppSink from 'src/commonExports/AppSink'

export interface JobtaskInfoMethods {
  childMethod: () => void
}

interface jobtaskProps {
  ref: any
  editId: number
  handleNext: () => void
  editnotes: any
}

interface FormData {
  workstart: string
  customerlocationreached: string
  tripstart: string
  tripend: any
  jobcompleted: any
}

const JobAlerts: React.FC<jobtaskProps> = forwardRef<JobtaskInfoMethods, jobtaskProps>(
  () => {

    const {
      handleSubmit,
      control,
      setValue,
      formState: {  isDirty, isValid }
    } = useForm<FormData>({
      defaultValues: {}
    })

    const getFormDetails = useCallback(() => {
      const query = `query MyQuery {
        getJobAlerts5AAB(ID: 1177) {
          CustomerLocationReached
          JobCompleted
          ID
          TripEnd
          TripStart
          UpdatedBy
          UpdatedIP
          UpdatedTime
          WorkStart
        }
      }      
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', 
        'Content-Type': 'application/json'
      };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          const responseData = res.data.data.getJobAlerts5AAB
          if (responseData) {
            setValue('workstart', responseData.WorkStart)
            setValue('customerlocationreached', responseData.CustomerLocationReached)
            setValue('tripstart', responseData.TripStart)
            setValue('tripend', responseData.TripEnd)
            setValue('jobcompleted', responseData.JobCompleted)
          }
        })
        .catch(err => {
          throw err
        })
    }, [setValue])

    useEffect(() => {
      getFormDetails()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = (data: FormData) => {
      const query = `mutation my {
        updateJobAlerts5AAB(input: {CustomerLocationReached: "${data.customerlocationreached}", ID: 1177, JobCompleted: "${data.jobcompleted}", TripEnd: "${data.tripend}", TripStart: "${data.tripstart}", UpdatedBy: "", UpdatedIP: "", UpdatedTime: "", WorkStart: "${data.workstart}"}) {
          CustomerLocationReached
          ID
          JobCompleted
          TripEnd
          TripStart
          UpdatedBy
          UpdatedIP
          UpdatedTime
          WorkStart
        }
      }
      `
      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', 
        'Content-Type': 'application/json'
      };
      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          if (res.data) {
            const message = res.data
              toast.success('Updated Successfully')
            getFormDetails()
          }
        })
        .catch(err => {
          throw err
        })
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
      <>
        <Head>
          <title>Job Alerts - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Card sx={{padding:"30px"}}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit(onSubmit)}>
          <h3>App Alerts</h3>

          <div>
            <Controller
              name='workstart'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  label={
                    <div>
                      <span
                        className='work'
                        style={{
                          color: getColor()
                        }}
                      >
                        {' '}
                        Work Start
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  autoComplete='off'
                  variant='outlined'
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />
          </div>

          <div>
            <Controller
              name='customerlocationreached'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  multiline
                  rows={3}
                  label={
                    <div>
                      <span
                        className='location'
                        style={{
                          color: getColor()
                        }}
                      >
                        Customer Location Reached
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  autoComplete='off'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </div>

          <div>
            <Controller
              name='tripstart'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  multiline
                  rows={3}
                  label={
                    <div>
                      <span
                        className='container'
                        style={{
                          color: getColor()
                        }}
                      >
                        {' '}
                        Trip Start
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  autoComplete='off'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </div>

          <div>
            <Controller
              name='tripend'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  multiline
                  rows={3}
                  label={
                    <div>
                      <span
                        className='status'
                        style={{
                          color: getColor()
                        }}
                      >
                        {' '}
                        Trip End
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  autoComplete='off'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </div>

          <div>
            <Controller
              name='jobcompleted'
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  multiline
                  rows={3}
                  label={
                    <div>
                      <span
                        className='status'
                        style={{
                          color: getColor()
                        }}
                      >
                        Job Completed
                      </span>
                      <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                        *
                      </Typography>
                    </div>
                  }
                  autoComplete='off'
                  variant='outlined'
                  fullWidth
                />
              )}
            />
          </div>

          <div style={{ padding: '5px' }}>
            <Button
              type='submit'
              sx={{
                float: 'right',
                marginRight: '2px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '90px',
                padding: '5px !important',
                height: '35px',
                fontSize: '15px',
                whiteSpace: 'nowrap',

                '&:hover': {
                  background: '#776cff',
                  color: 'white'
                }
              }}
              variant='contained'
              disabled={!isDirty || !isValid}
            >
              <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
              Update
            </Button>
          </div>
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
        </form>
        </Card>
      </>
    )
  }
)

export default JobAlerts
