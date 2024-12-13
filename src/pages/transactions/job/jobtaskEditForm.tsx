  import { useForm, Controller, useFormContext } from 'react-hook-form'
import { Button, Switch, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'

interface FormData {
  Descriptiontask: string
  AdditionalNotes: string
  task_qty: string
  task_unitprice: string
  task_totamount: string
  status: any
  fetchCalculation: any
  watch: any
  totalTaskAmount: any
}

const JobEditForm = ({
  Descriptiontask,
  AdditionalNotes,
  totalTaskAmount,
  task_qty,
  task_unitprice,
  task_totamount,
  editStatus,
  fetchCalculation,
  editid,
  onCloseModal
}: any) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      Descriptiontask: Descriptiontask,
      AdditionalNotes: AdditionalNotes,
      task_qty: task_qty,
      task_unitprice: task_unitprice,
      task_totamount: task_totamount
    }
  })

  const quantityRef = useRef<any>(null);
  const perRatesRef = useRef<any>(null);

  const calculateTotalRate = () => {
    const qty = quantityRef.current ? parseFloat(quantityRef.current.value) : NaN;
  const rates = perRatesRef.current ? parseFloat(perRatesRef.current.value) : NaN;

    if (!isNaN(qty) && !isNaN(rates) && rates !== 0) {
      const totalRate = qty * rates
      setValue('task_totamount', totalRate.toFixed(2))
    } else {
      setValue('task_totamount', '')
    }
  }

  const onSubmit = async (editedData: any) => {
    try {
      const { Descriptiontask, AdditionalNotes, task_qty, task_unitprice, task_totamount } = editedData

      const id = editid
      const DESIGNATION_API_ENDPOINT = `/api.php?moduletype=job_task&apitype=edit&id=${editid}&task_description=${Descriptiontask}&additional_notes=${AdditionalNotes}&task_qty=${task_qty}&task_unitprice=${task_unitprice}&totamt=${totalTaskAmount}&task_totamount=${task_totamount}`
      await ApiClient.put(DESIGNATION_API_ENDPOINT, {
        id
      })

      if (isDirty) {
        onCloseModal()
        toast.success('Updated successfully')
        fetchCalculation()
      } else {
        toast.error('No changes made')
      }
    } catch (error: any) {
      console.error('Error updating designation:', error)

      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      } else if (error.request) {
        console.error('No response received from the server.')
      } else {
        console.error('Error setting up the request:', error.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6'>Update The JobTask</Typography>
      <div>
        <Controller
          name='Descriptiontask'
          control={control}
          defaultValue={Descriptiontask}
          rules={{ required: 'Descriptiontask is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='Descriptiontask'
              label='Description'
              variant='outlined'
              fullWidth
              margin='normal'
              //   error={!!errors.Descriptiontask}
              //   helperText={errors.Descriptiontask && errors.Descriptiontask.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='AdditionalNotes'
          control={control}
          defaultValue={AdditionalNotes}
          //   rules={{ required: 'AdditionalNotes is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='AdditionalNotes'
              label='Additional Notes'
              variant='outlined'
              fullWidth
              margin='normal'
              //   error={!!errors.AdditionalNotes}
              //   helperText={errors.AdditionalNotes && errors.AdditionalNotes.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='task_qty'
          control={control}
          defaultValue={task_qty}
          rules={{ required: 'task_qty is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              inputRef={quantityRef}
              id='task_qty'
              label='task_qty'
              variant='outlined'
              onChange={(e) => {
                field.onChange(e);
                calculateTotalRate();
              }}
              fullWidth
              margin='normal'
              error={!!errors.task_qty}
              helperText={errors.task_qty && errors.task_qty.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='task_unitprice'
          control={control}
          defaultValue={task_unitprice}
          rules={{ required: 'PerRates is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              inputRef={perRatesRef}
              id='task_unitprice'
              label='Per Rates'
              variant='outlined'
              onChange={(e) => {
                field.onChange(e);
                calculateTotalRate();
              }}
              fullWidth
              margin='normal'
              error={!!errors.task_unitprice}
              helperText={errors.task_unitprice && errors.task_unitprice.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name='task_totamount'
          control={control}
          defaultValue={task_totamount}
          rules={{ required: 'task_totamount is required' }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              id='task_totamount'
              label='Total Amount'
              variant='outlined'
              fullWidth
              margin='normal'
              //   error={!!errors.task_totamount}
              //   helperText={errors.task_totamount && errors.task_totamount.message}
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
          <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
          Save
        </Button>
      </div>
    </form>
  )
}

export default JobEditForm
