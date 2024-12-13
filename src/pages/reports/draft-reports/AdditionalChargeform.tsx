import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Switch, TextField, Typography } from '@mui/material';

interface FormData {
  Name: string;
  AdditionalCharges: number;
  Description: string;
  status: boolean;
}

const AdditionalChargeform = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      Name: '',
      AdditionalCharges: 0, 
      Description: '',
      status: false,
    },
  });

  const onSubmit = (data: FormData) => {
    // console.log(data);
  };
  
  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6">Add New Additional Charges </Typography>

      <div>
        <Controller
          name="Name"
          control={control}
          defaultValue=""
          rules={{ required: ' Name Field is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              id="Name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Name}
              helperText={errors.Name && errors.Name.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="AdditionalCharges"
          control={control}
          defaultValue={0}
          rules={{
            required: 'Additional Charges is required',
            validate: (value) => value > 0 || 'Additional Charges is required',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              id="AdditionalCharges"
              label="Additional Charges"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.AdditionalCharges}
              helperText={errors.AdditionalCharges && errors.AdditionalCharges.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="Description"
          control={control}
          defaultValue=""
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              id="Description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              error={!!errors.Description}
              helperText={errors.Description && errors.Description.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="status"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <>
              <Switch {...field} name="status" color="primary" />
              <label>{field.value ? 'Active' : 'Inactive'}</label>
            </>
          )}
        />
      </div>

      <div>
        <Button type="submit" variant="contained"  sx={{
                    mb: 2, mr: 2, '&:hover': {
                        background: '#776cff', color: "white",
                    },
                }}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AdditionalChargeform;
