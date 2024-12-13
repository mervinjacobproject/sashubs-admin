import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Switch, TextField, Typography, Grid, IconButtonProps, IconButton } from '@mui/material';
import Icon from 'src/@core/components/icon';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface FormData {
  CustomerName: string;
  TotalQty: string;
  TaxableAmount: string;
  TaxAmount: string;
  NetAmount: string;
  Discount: string;
  TransactionID: string;
  TransactionStatus: string;
  OrderStatus: boolean;
  Notes: string;
}

const getColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  return selectedMode === 'dark' ? 'rgba(208, 212, 241, 0.68)' : 'black';
};

const EditOrderForm = ({ editid, onFetchData, onCloseModal }: any) => {
  const { handleSubmit, control, setValue, formState: { errors, isDirty } } = useForm<FormData>();

  const [orderData, setOrderData] = useState<FormData | null>(null);

  useEffect(() => {
    // Fetch existing order data
    const fetchOrderData = async () => {
      try {
        const response = await ApiClient.post(`/ordergetall?ID=${editid}`); // Adjust API endpoint as necessary
        const data = response.data;
        setOrderData(data);
        // Populate the form with existing order data
        setValue('CustomerName', data.CustomerName);
        setValue('TotalQty', data.TotalQty);
        setValue('TaxableAmount', data.TaxableAmount);
        setValue('TaxAmount', data.TaxAmount);
        setValue('NetAmount', data.NetAmount);
        setValue('Discount', data.Discount);
        setValue('TransactionID', data.TransactionID);
        setValue('TransactionStatus', data.TransactionStatus);
        setValue('OrderStatus', data.OrderStatus === 1);
        setValue('Notes', data.Notes);
      } catch (error) {
        toast.error('Error fetching order data');
      }
    };

    fetchOrderData();
  }, [editid, setValue]);

  const onSubmit = (data: FormData) => {
    const orderStatusValue = data.OrderStatus ? 1 : 0;

    ApiClient.post(`/updateorders?Id=${editid}`, {
      CustomerID: data.CustomerName,  // Assuming you store customer ID in CustomerName (modify if necessary)
      TotalQty: data.TotalQty,
      TaxableAmount: data.TaxableAmount,
      TaxAmount: data.TaxAmount,
      NetAmount: data.NetAmount,
      Discount: data.Discount,
      TransactionID: data.TransactionID,
      TransactionStatus: data.TransactionStatus,
      OrderStatus: orderStatusValue,
      Notes: data.Notes,
    }).then(() => {
      onFetchData();
      
      toast.success('Order updated successfully');
      onCloseModal();
    }).catch(() => {
      toast.error('Error updating order');
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ color: getColor(), textAlign: 'center', fontWeight: 600 }}>
        Edit Order
      </Typography>

      <Grid container spacing={2}>
        {/* Customer Name */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Customer Name</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="CustomerName"
            control={control}
            rules={{ required: 'Customer Name is required' }}
            render={({ field }) => (
              <TextField {...field} label="Customer Name" variant="outlined" fullWidth margin="normal" error={!!errors.CustomerName} />
            )}
          />
        </Grid>

        {/* Total Quantity */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Total Quantity</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="TotalQty"
            control={control}
            rules={{ required: 'Total Quantity is required' }}
            render={({ field }) => (
              <TextField {...field} label="Total Quantity" variant="outlined" fullWidth margin="normal" type="number" error={!!errors.TotalQty} />
            )}
          />
        </Grid>

        {/* Taxable Amount */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Taxable Amount (₹)</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="TaxableAmount"
            control={control}
            rules={{ required: 'Taxable Amount is required' }}
            render={({ field }) => (
              <TextField {...field} label="Taxable Amount (₹)" variant="outlined" fullWidth margin="normal" error={!!errors.TaxableAmount} />
            )}
          />
        </Grid>

        {/* Tax Amount */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Tax Amount (₹)</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="TaxAmount"
            control={control}
            rules={{ required: 'Tax Amount is required' }}
            render={({ field }) => (
              <TextField {...field} label="Tax Amount (₹)" variant="outlined" fullWidth margin="normal" error={!!errors.TaxAmount} />
            )}
          />
        </Grid>

        {/* Net Amount */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Net Amount (₹)</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="NetAmount"
            control={control}
            rules={{ required: 'Net Amount is required' }}
            render={({ field }) => (
              <TextField {...field} label="Net Amount (₹)" variant="outlined" fullWidth margin="normal" error={!!errors.NetAmount} />
            )}
          />
        </Grid>

        {/* Discount */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Discount (₹)</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="Discount"
            control={control}
            rules={{ required: 'Discount is required' }}
            render={({ field }) => (
              <TextField {...field} label="Discount (₹)" variant="outlined" fullWidth margin="normal" error={!!errors.Discount} />
            )}
          />
        </Grid>

        {/* Transaction ID */}
        {/* <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Transaction ID</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="TransactionID"
            control={control}
            rules={{ required: 'Transaction ID is required' }}
            render={({ field }) => (
              <TextField {...field} label="Transaction ID" variant="outlined" fullWidth margin="normal" error={!!errors.TransactionID} />
            )}
          />
        </Grid> */}

        {/* Transaction Status */}
        {/* <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Transaction Status</span>
          <Typography variant='caption' color='error'>*</Typography>
          <Controller
            name="TransactionStatus"
            control={control}
            render={({ field }) => (
              <Select {...field} variant="outlined" fullWidth>
                <MenuItem value="1">Success</MenuItem>
                <MenuItem value="0">Failed</MenuItem>
              </Select>
            )}
          />
        </Grid> */}

        {/* Order Status */}
        <Grid item xs={12} sm={6}>
          <span style={{ color: getColor(), fontSize: '14px' }}>Order Status</span>
          <Controller
            name='OrderStatus'
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
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <Controller
            name="Notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Notes" variant="outlined" fullWidth margin="normal" multiline rows={4} />
            )}
          />
        </Grid>
      </Grid>

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
        Update
      </Button>
    </form>
  );
};

export default EditOrderForm;
