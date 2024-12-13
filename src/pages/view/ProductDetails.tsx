import { useForm, Controller } from 'react-hook-form';
import { Autocomplete, Box, Button, Grid, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface FormData {
  ProductName: string;
  Points: string;
  Price: string;
  Status: any;
}

const getColor = ():any => {
  const selectedMode = localStorage.getItem('selectedMode');

  if (selectedMode === 'dark') {
    return {
      textColor: 'rgba(208, 212, 241, 0.68)', // Light text color for dark mode
      backgroundColor: '#2f3349' // Dark background color
    };
  } else {
    return {
      textColor: 'black', // Dark text color for light mode
      backgroundColor: 'rgba(255, 255, 255, 1)' // Light background color
    };
  }
};

const formatCurrency = (value: string) => {
  const num = parseFloat(value);
  return isNaN(num) ? '' : num.toFixed(2);
};
const formatCurrencyValue = (amount:any) =>
  amount?.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CutomerGroupEditForm = () => {
  const { handleSubmit, control, setValue, getValues,watch, formState: { errors, isDirty } } = useForm<FormData>({
    defaultValues: {
      ProductName: '',
      Points: '',
      Price: '',
      Status: '',
    }
  });
  const router = useRouter();
  const { ProductId } = router.query;
  const [productData, setProductData] = React.useState<any>();

  const onSubmit = (data: FormData) => {
    const statusValue = data.Status ? 1 : 0;
    ApiClient.post(`/updateproduct?Id=${ProductId}&ProductName=${data.ProductName}&Points=${data.Points}&Price=${data.Price}&Status=${statusValue}`)
      .then(() => {
        toast.success('Product updated successfully');
        // onCloseModal();
        // onFetchData();
      })
      .catch(() => {
        toast.error('Error updating product');
      });
  };

  useEffect(() => {

    setValue('Status', getValues('Status'));
  }, [getValues('Status'), setValue]);
  useEffect(() => {
    {
     fetchProductName()
    }
   }, [ProductId,productData])
   const fetchProductName = async () => {
      //alert("fetching")
    try {
      const res = await ApiClient.post(`/getproduct`);
      const response = res.data.data;
      const filteredData = response.filter((row: any) => row.Id == ProductId);
      const dataWithSerialNumber = filteredData.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }));
      dataWithSerialNumber.map((data: any) => {
      setProductData(data);
      setValue('ProductName', data.ProductName);
      setValue('Points', data.Points);
      setValue('Price', data.Price);
      setValue('Status', data.Status);
      })
    } catch (err) {
      toast.error('Error fetching data:');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        color: getColor().textColor,
        backgroundColor: getColor().backgroundColor,
        padding: '50px',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: getColor(), textAlign: 'center', fontWeight: 'bold' }}
      >
        Edit Product
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Box sx={{ marginBottom: '1em' }}>
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ marginBottom: '1em' }}>
            <Controller
              name="Points"
              control={control}
              rules={{
                required: 'Points are required',
                pattern: {
                  value: /^[0-9]+(\.\d{1,2})?$/,
                  message: 'Format should be like 0.00, Should not exceed 2 digits after decimal',
                },
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
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ marginBottom: '1em' }}>
            <Controller
              name="Price"
              control={control}
              rules={{
                required: 'Price is required',
                pattern: {
                  value: /^[0-9]+(\.\d{1,2})?$/,
                  message: 'Invalid price format',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price (₹)"
                  id="price"
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
        </Grid>

        <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
          <div className="status-container">
            <Controller
              name="Status"
              control={control}
              render={({ field }) => (
                <>
                  <Switch
                    {...field}
                    id="Status"
                    checked={field.value == 1} // Convert number to boolean
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setValue('Status', isChecked ? 1 : 0, { shouldDirty: true }); // Update status and mark as dirty
                    }}
                    color="primary"
                  />
                  <label style={{ color: getColor() }}>
                    {field.value == 1 ? 'Active' : 'Inactive'} {/* Show label based on status */}
                  </label>
                </>
              )}
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            sx={{
              float: 'right',
              marginRight: '10px',
              marginTop: '-75px',
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
            variant="contained"
          >
            <Icon style={{ marginRight: '1px' }} icon="material-symbols-light:save-outline" width={25} height={25} />
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CutomerGroupEditForm;
