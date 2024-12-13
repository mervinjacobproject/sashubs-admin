import { useForm, Controller } from 'react-hook-form';
import { Box, Button, InputAdornment, Switch, TextField, Typography, Avatar } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface FormData {
  ProductName: string;
  Description: string;
  MRP: string;
  Price: string;
  SpecialPrice: string;
  OrderNo: string;
  TaxPercentage: string;
  Image: File | null; // Change here to File type for image upload
  Status: boolean;
}

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  return selectedMode === 'dark' ? 'rgba(208, 212, 241, 0.68)' : 'black';
};

const Customergroupform = ({ onClose, onFetchData }: any) => {
  const { handleSubmit, control, watch,setValue, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      ProductName: '',
      Description: '',
      MRP: '',
      Price: '',
      SpecialPrice: '',
      OrderNo: '',
      TaxPercentage: '',
      Image: null, // Default value for the image
      Status: true,
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const MRP = watch('MRP');
  const Price = watch('Price');
  const SpecialPrice = watch('SpecialPrice');

  const onSubmit = (data: FormData) => {
    const statusValue = data.Status ? 1 : 0;
    const formData = new FormData();

    // Append all form fields to FormData
    formData.append('ProductName', data.ProductName);
    formData.append('Description', data.Description);
    formData.append('MRP', data.MRP);
    formData.append('Price', data.Price);
    formData.append('SpecialPrice', data.SpecialPrice);
    formData.append('OrderNo', data.OrderNo);
    formData.append('TaxPercentage', data.TaxPercentage);
    if (data.Image) {
      formData.append('Images', data.Image); // Append uploaded image
    }
    formData.append('Status', statusValue.toString());

    ApiClient.post('/createproducts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      }
    })
    .then(() => {
      onFetchData();
      toast.success('Saved successfully');
      onClose();
    })
    .catch(() => {
      toast.error('Error saving data');
    });
  };

  // Handle image upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a local URL for the preview
      setValue('Image', file); // Set the image file in form state
    }
  };
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ color: getColor(), textAlign: 'center', fontWeight: 600 }}>
        Add Product
      </Typography>

      {/* Product Name */}
      <Controller
        name="ProductName"
        control={control}
        rules={{ required: 'Product Name is required' }}
        render={({ field }) => (
          <TextField {...field} label="Product Name" variant="outlined" fullWidth margin="normal" error={!!errors.ProductName} />
        )}
      />

      {/* Description */}
      <Controller
        name="Description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" variant="outlined" fullWidth margin="normal" />
        )}
      />

      {/* MRP */}
      <Controller
        name="MRP"
        control={control}
        rules={{ required: 'MRP is required', pattern: { value: /^[0-9]+(\.\d{1,2})?$/, message: 'Invalid MRP format' } }}
        render={({ field }) => (
          <TextField {...field} label="MRP (₹)" variant="outlined" fullWidth margin="normal" type="number" error={!!errors.MRP} 
          InputProps={{                
            inputProps: {
              style: { textAlign: 'right' },
            },
          }} onBlur={(e) => {
            const formattedValue = formatCurrency(e.target.value);
            field.onChange(formattedValue);
          }}/>
        )}
      />

      {/* Price */}
      <Controller
  name="Price"
  control={control}
  rules={{
    required: 'Price is required',
    validate: {
      isLessThanMRP: value => {
        const priceValue = parseFloat(value); // Get the current price value
        const mrpValue = parseFloat(MRP); // Assume MRP is in scope and being watched
        if (priceValue && mrpValue) {
          return priceValue <= mrpValue || 'Price must be equal to or less than MRP'; // Compare values and return appropriate message
        }
        return true; // If no value, skip validation
      },
      isValidFormat: value => {
        if (value) {
          return /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid price format'; // Check if value matches the expected format
        }
        return true; // If no value, skip validation
      }
    }
  }}
  render={({ field }) => (
    <TextField
      {...field}
      label="Price (₹)"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      error={!!errors.Price}
      InputProps={{
        inputProps: {
          style: { textAlign: 'right' },
        },
      }}
      onBlur={(e) => {
        const formattedValue = formatCurrency(e.target.value);
        field.onChange(formattedValue);
      }}
      helperText={errors.Price?.message} // Show error message if any
    />
  )}
/>
      <Controller
  name="SpecialPrice"
  control={control}
  rules={{
    required: 'Special Price is required', // Ensure this is added for better user experience
    validate: {
      isLessThanPrice: value => {
        const specialPriceValue = parseFloat(value); // Current Special Price
        const priceValue = parseFloat(Price); // Current Price
        if (specialPriceValue !== undefined && priceValue !== undefined) {
          // Check if Special Price is greater than Price
          return specialPriceValue <= priceValue || 'Special Price may be 0 or less than Price';
        }
        return true; // If no value, don't trigger this validation
      },
      isValidFormat: value => {
        if (value) {
          return /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid Special Price format'; // Validate format
        }
        return true; // If no value, don't trigger this validation
      }
    }
  }}
  render={({ field }) => (
    <TextField
      {...field}
      label="Special Price (₹)"
      variant="outlined"
      fullWidth
      margin="normal"
      type="number"
      error={!!errors.SpecialPrice}
      InputProps={{
        inputProps: {
          style: { textAlign: 'right' },
        },
      }}
      onBlur={(e) => {
        const formattedValue = formatCurrency(e.target.value);
        field.onChange(formattedValue);
      }}
      helperText={errors.SpecialPrice?.message} // Show error message if any
    />
  )}
/>
      {/* Order No */}
      <Controller
  name="OrderNo"
  control={control}
  rules={{
    required: 'Order Number is required',
    pattern: {
      value: /^[1-9]\d*$/, // Only positive integers are allowed
      message: 'Order Number must be a positive integer without decimal or negative values',
    }
  }}
  render={({ field }) => (
    <TextField
      {...field}
      label="Order No"
      variant="outlined"
      fullWidth
      margin="normal"
      InputProps={{
        inputProps: {
          style: { textAlign: 'right' },
        },
      }}
      error={!!errors.OrderNo}
      helperText={errors.OrderNo?.message} // Show error message if any
    />
  )}
/>


      {/* Tax Percentage */}
      <Controller
        name="TaxPercentage"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Tax Percentage (%)" variant="outlined" fullWidth margin="normal" type="number" 
          InputProps={{                
            inputProps: {
              style: { textAlign: 'right' },
            },
          }} onBlur={(e) => {
            const formattedValue = formatCurrency(e.target.value);
            field.onChange(formattedValue);
          }}/>
        )}
      />

      {/* Image Upload */}
      <Controller
        name="Image"
        control={control}
        render={({ field }) => (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
            {imagePreview && (
              <Avatar alt="Image Preview" src={imagePreview} variant="rounded" sx={{ mt: 2, width: 100, height: 100 }} />
            )}
          </>
        )}
      />

      {/* Status */}
      <Controller
        name='Status'
        control={control}
        render={({ field }) => (
          <div className='status-container'>
            <Switch {...field} color='primary' checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />
            <label style={{ color: getColor(), marginLeft: 8 }}>
              <Typography sx={{ fontWeight: 600 }}>{field.value ? 'Active' : 'Inactive'}</Typography>
            </label>
          </div>
        )}
      />

      {/* Save Button */}
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
          '&:hover': { background: '#776cff', color: 'white' }
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
