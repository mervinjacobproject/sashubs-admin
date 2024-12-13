import { useForm, Controller } from 'react-hook-form';
import { Box, Button, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import React from 'react';
import { toast } from 'react-hot-toast';

interface FormData {
  ProductName: string;
  Points: string;
  Price: string;
  Status: boolean;
}

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  return selectedMode === 'dark' ? 'rgba(208, 212, 241, 0.68)' : 'black';
};

const formatCurrency = (value: string) => {
  const num = parseFloat(value);
  return isNaN(num) ? '' : num.toFixed(2);
};

const Customergroupform = ({ onClose, onFetchData }: any) => {
  const { handleSubmit, control, watch, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      ProductName: '',
      Price: '',
      Points: '',
      Status: true
    }
  });

  const productName = watch('ProductName');

  const onSubmit = (data: FormData) => {
    const statusValue = data.Status ? 1 : 0;

    ApiClient.post(`/createproduct?ProductName=${data.ProductName}&Points=${data.Points}&Price=${data.Price}&Status=${statusValue}`)
      .then(() => {
        onFetchData();
        toast.success('Saved successfully');
        onClose();
      })
      .catch(() => {
        toast.error('Error saving data');
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ color: getColor(), textAlign: 'center', fontWeight: 600 }}>
        Add Product
      </Typography>

      <Box sx={{ position: 'relative', marginBottom: '1em' }}>
        <Typography variant='caption' sx={{ position: 'absolute', right: 0, top: 0, fontSize: '0.95em' }}>
          {productName.length}/20
        </Typography>
        <Controller
          name="ProductName"
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
              id="product-name"
              variant="outlined"
              fullWidth
              error={!!errors.ProductName}
              margin="normal"
              inputProps={{ maxLength: 20 }}
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
                id='status'
                color='primary'
                checked={!!field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
              <label style={{ color: getColor(), marginLeft: 8 }}>
                <Typography sx={{ fontWeight: 600 }}>{field.value ? 'Active' : 'Inactive'}</Typography>
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
            color: 'white'
          }
        }}
        disabled={!isDirty}
        variant='contained'
      >
        <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
        Save
      </Button>
    </form>
  );
};

export default Customergroupform;
