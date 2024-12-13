import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Switch, TextField, Typography } from '@mui/material'

interface FormData {
    groupName: string
    status: boolean
}

const Customergroupform = () => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            groupName: '',
            status: false
        }
    })

    const onSubmit = (data: FormData) => {
       // console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant='h6'>Add New Customer Group </Typography>
            <div>
                <Controller
                    name='groupName'
                    control={control}
                    defaultValue=''
                    rules={{ required: 'groupName is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id='groupName'
                            label='groupName'
                            variant='outlined'
                            fullWidth
                            margin='normal'
                            error={!!errors.groupName}
                            helperText={errors.groupName && errors.groupName.message}
                        />
                    )}
                />
            </div>
            <div>
                <Controller
                    name='status'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <>
                            <Switch {...field} name='status' color='primary' />
                            <label>{field.value ? 'Active' : 'Inactive'}</label>
                        </>
                    )}
                />
            </div>

            <div>
                <Button type='submit'  variant="contained"  sx={{
                    mb: 2, mr: 2, '&:hover': {
                        background: '#776cff', color: "white",
                    },
                }} >
                    Save
                </Button>
            </div>
        </form>
    )
}

export default Customergroupform
