import { useForm, Controller } from 'react-hook-form';
import { Autocomplete, Box, Button, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface FormData {
  ProductName: string;
  Points: string;
  Price: string;
  Status: any;
}

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  return selectedMode === 'dark' ? 'rgba(208, 212, 241, 0.68)' : 'black';
};

const formatCurrency = (value: string) => {
  const num = parseFloat(value);
  return isNaN(num) ? '' : num.toFixed(2);
};
const formatCurrencyValue = (amount:any) =>
  amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CutomerGroupEditForm = ({ employeegroupName, editStatus, price, points, onFetchData, editid, onCloseModal }: any) => {
  const { handleSubmit, control, setValue, watch, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      ProductName: employeegroupName,
      Points: points,
      Price: formatCurrencyValue(price),
      Status: editStatus,
    }
  });

  const onSubmit = (data: FormData) => {
    const statusValue = data.Status ? 1 : 0;
    ApiClient.post(`/updateproduct?Id=${editid}&ProductName=${data.ProductName}&Points=${data.Points}&Price=${data.Price}&Status=${statusValue}`)
      .then(() => {
        toast.success('Product updated successfully');
        onCloseModal();
        onFetchData();
      })
      .catch(() => {
        toast.error('Error updating product');
      });
  };

  useEffect(() => {
    setValue('Status', editStatus);
  }, [editStatus, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ color: getColor(), textAlign: 'center', fontWeight: 'bold' }}>
        Edit Product
      </Typography>

      <Box sx={{ marginBottom: '1em' }}>
        <Controller
          name='ProductName'
          control={control}
          rules={{
            required: 'Product Name is required',
            maxLength: {
              value: 20,
              message: 'Product Name must be at most 20 characters long',
            },
            pattern: {
              value: /^[A-Za-z\s]+$/, // Allow alphabets and spaces
              message: 'Product Name must contain only letters and spaces',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Product Name"
              id="ProductName"
              variant="outlined"
              fullWidth
              error={!!errors.ProductName}
              helperText={errors.ProductName?.message || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              margin="normal"
              inputProps={{ maxLength: 20 }} // Limit to 20 characters
            />
          )}

        />
      </Box>

      <Box sx={{ marginBottom: '1em' }}>
        <Controller
          name="Points"
          control={control}
          rules={{
            required: 'Points are required',
            pattern: {
              value: /^[0-9]+(\.\d{1,2})?$/,
              message: 'Format should be like 0.00, Should not exceed 2 digits after decimal',
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Points"
              variant="outlined"
              id="points"
              fullWidth
              type="number"
              margin="normal"
              error={!!errors.Points}
              helperText={errors.Points?.message || ''}
              placeholder="0.00"
              InputProps={{
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />
      </Box>

      <Box sx={{ marginBottom: '1em' }}>
        <Controller
          name="Price"
          control={control}
          rules={{
            required: 'Price is required',
            pattern: {
              value: /^[0-9]+(\.\d{1,2})?$/,
              message: 'Invalid price format'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price (₹)"
              id='price'
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.Price}
              helperText={errors.Price?.message || ''}
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: {
                  style: { textAlign: 'right' },
                },
              }}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              onBlur={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />
      </Box>

      <div className='status-container'>
        <Controller
          name='Status'
          control={control}
          render={({ field }) => (
            <>
              <Switch
                {...field}
                id='Status'
                checked={field.value == 1} // Convert number to boolean
                onChange={(e: any) => {
                  const isChecked = e.target.checked;
                  setValue('Status', isChecked ? 1 : 0, { shouldDirty: true }); // Update status and mark as dirty
                }}
                color='primary'
              />
              <label style={{ color: getColor() }}>
                {field.value == 1 ? 'Active' : 'Inactive'} {/* Show label based on status */}
              </label>
            </>
          )}
        />
      </div>

      <Button
        type='submit'
        sx={{
          float: 'right',
          marginRight: '2px',
          width: '90px',
          padding: '5px !important',
          height: '35px',
          fontSize: '15px',
          whiteSpace: 'nowrap',
          '&:hover': {
            background: '#776cff',
            color: 'white',
          },
        }}
        disabled={!isDirty}
        variant='contained'
      >
        <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
        Update
      </Button>
    </form>
  );
};

export default CutomerGroupEditForm;
