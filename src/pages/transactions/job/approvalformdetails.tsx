import { Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'

interface FormData {
  requestmessage: string
  status: any
}

const ApprovalFormDetails = ({ customerlist, routerId, onFetchData, onClose }: any) => {

  const [jobId, setJobId] = useState<any>('')

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {}
  })

  const fetchCustomerName = async () => {
    const query = `query MyQuery {
  getJobsNew5AAB(ID: ${routerId}) {
    Customer
    ID
    JobId
  }
}`
    const headers = {
      'x-api-key': ' da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    await ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        const items = res.data.data.getJobsNew5AAB.Customer
        setJobId(items)
      })
      .catch(err => {
        console.error('something went wrong', err)
      })
  }

  useEffect(() => {
    if (routerId) {
      fetchCustomerName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: FormData) => {

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const formattedDateTime = `${year}-${month}-${day}`
    const query = `
 mutation my {
  createJobApproval5AAB(input: {JobId: ${routerId}, CustomerId:${jobId} , ActionMessage: "", ActionDate: "", Action: "", RequestDate: "${formattedDateTime}", RequestMessage: "${data.requestmessage}"}) {
    Action
    ActionDate
    ActionMessage
    CustomerId
    ID
    JobId
    RequestDate
    RequestMessage
  }
}`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    await ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        res.data.data?.createJobApproval5AAB
        onClose()
        onFetchData()
      })
      .catch((err: any) => {
        //hi
      })
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px' }}>
        <Typography>Job Id :{jobId}</Typography>
        <Typography>
          Customer Name:
          {customerlist?.map((customer: any, index: any) => {
            const customerIdString = String(customer.CId)
            if (customerIdString.trim() === jobId.trim()) {
              return (
                <span key={index}>
                  {customer.FirstName} {customer.LastName}
                </span>
              )
            }
            return null
          })}
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name='requestmessage'
            control={control}
            rules={{ required: 'Message is required' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                id='requestmessage'
                name='requestmessage'
                label='Message'
                variant='outlined'
                fullWidth
                multiline
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const modifiedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                  field.onChange(modifiedValue)
                }}
                rows={4}
                margin='normal'
                error={!!errors.requestmessage}
                helperText={errors.requestmessage && errors.requestmessage.message}
              />
            )}
          />
        </div>

        <div>
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
          >
            <Icon style={{ marginRight: '5px' }} icon='icon-park-outline:send-email' width={25} height={25} />
            Send
          </Button>
        </div>
      </form>
    </>
  )
}

export default ApprovalFormDetails
