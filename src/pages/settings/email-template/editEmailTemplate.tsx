import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'

import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

import CustomTextField from 'src/@core/components/mui/text-field'
import EditorControlled from './editer'
import { closeRightPopupClick } from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerEmail'
import toast from 'react-hot-toast'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  subject: string
  priceperuom: string
  status: any
  email: any
  description: any
}

const EmailTemplateForm = ({ editId, rowId, editStatus, fetchData, resetEditid }: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<FormData>({
  })

  // moduletype=emailtemplate&apitype=list&id=1

  const getFormDetails = useCallback(
    (rowId: any) => {
      const query = `query MyQuery {
        getEmailTemplate5AAB(EId: ${rowId}) {
          Description
          EId
          IP
          Order
          Status
          Subject
        }
      }
      `

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', // This might be your authentication token
        'Content-Type': 'application/json'
      };

      ApiClient.post(`${AppSink}`, { query }, { headers })
        .then(res => {
          setValue('subject', res.data.data.getEmailTemplate5AAB.Subject)

          setValue('description', res.data.data.getEmailTemplate5AAB.Description)
        })

        .catch(err => {
          // console.error('Something went wrong', err)
        })
    },
    [setValue]
  )

  useEffect(() => {
    if (rowId) {
      getFormDetails(rowId)
    }
  }, [rowId, getFormDetails])

  useEffect(() => {
    return () => {
      resetEditid()
    }
  })

  const onSubmit = (data: FormData) => {

    const query = `mutation my {
      updateEmailTemplate5AAB(input: {Description: "${data.description}", EId: ${rowId}, IP: "", Order: "", Status: true, Subject: "${data.subject}"}) {
        Description
        EId
        IP
        Order
        Status
        Subject
      }
    }
    `

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
    
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        
        closeRightPopupClick()
        fetchData()
      })

      .catch(err => {
        console.error('Something went wrong', err)
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'sans-serif',
          padding: '10px'
        }}
      >
        {' '}
        Email Template Details{' '}
      </Typography>
      <div>
        <Controller
          name='subject'
          control={control}
          defaultValue=''
          rules={{ required: 'Subject Name is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='subject'
              // label={
              //   <div>
              //     <span className='status-container'>Subject</span>
              //   </div>
              // }
              label={
                <div>
                  <span
                    className='prefix'
                    style={{
                      color: getColor()
                    }}
                  >
                    Subject
                  </span>
                </div>
              }
              variant='outlined'
              fullWidth
              margin='normal'
              error={!!errors.subject}
              helperText={errors.subject && errors.subject.message}
            />
          )}
        />
      </div>

      {/* <div style={{ border: "2px solid",width:"100%" }}>
  <div style={{display:"flex"}}>
    <EditorControlled />
  </div>
</div> */}

      <Controller
        name='description'
        control={control}
        defaultValue=''
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <CustomTextField
            {...field}
            id='description'
            // label={
            //   <div>
            //     <span className='status-container'>Description</span>
            //   </div>
            // }
            label={
              <div>
                <span
                  className='prefix'
                  style={{
                    color: getColor()
                  }}
                >
                  Description
                </span>
              </div>
            }
            variant='outlined'
            fullWidth
            multiline
            rows={4}
            margin='normal'

            // error={!!errors.description}
            // helperText={errors.description ? (
            //   <div className="error-message">{errors.description.message}</div>
            // ) : null}
          />
        )}
      />

      <div>
        <Button
          type='submit'
          sx={{
            mb: 2,
            mr: 2,
            float: 'right',
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
          disabled={!isDirty || !isValid}
          variant='contained'
        >
          <Icon icon='material-symbols-light:save-sharp' width={25} height={25} />
          Save
        </Button>
      </div>
    </form>
  )
}

export default EmailTemplateForm
