import { Alert, Button, Divider, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CustomTextField from 'src/@core/components/mui/text-field';
import Icon from 'src/@core/components/icon';
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal';
import { Controller, useForm } from 'react-hook-form';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import AppSink from 'src/commonExports/AppSink';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import PhoneInput from 'react-phone-input-2';

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)'
  } else if (selectedMode === 'light') {
    return 'white'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)'
  } else {
    return 'white'
  }
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

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: -3,
  right: -3,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)',
  },
}));
interface FormData {
    ProductName: string;
    Description: string;
    MRP: string;
    Price: string;
    SpecialPrice: string;
    OrderNo: string;
    TaxPercentage: string;
  }
const ProductGroupName = ({
  getEmployeeGroup,
  setSelectedgroupName,
  handleEmployeeGroupClose,
  fetchEmployeeGroup,
  setgroupNameSearch,
  groupNameSearch,
  onFetchData,
}: any) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<any>({
    defaultValues: {
        ProductName: '',
        Description: '',
        MRP: '',
        Price: '',
        SpecialPrice: '',
        TaxPercentage:'',
        OrderNo: '',
      }
  });
  const MRP = watch('MRP');
  const Price = watch('Price');
  const SpecialPrice = watch('SpecialPrice');
  const handleDesignationClick = (GroupName: any, id: any) => {
    setSelectedgroupName({ ProductName: GroupName, ID: id });
  
    handleEmployeeGroupClose();
    fetchEmployeeGroup();
    setgroupNameSearch('');
  }

  const handleAddNewgroupname = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset(); // Reset form when closing modal
  };

  const onSubmitForm = (data: any) => {
    const empGroupExists = getEmployeeGroup?.some(
      (item: any) => item.ProductName.toLowerCase() == data.OwnerName.toLowerCase()
    );
    if (empGroupExists) {
      toast.error('Product Name already exists');
      return;
    }


    ApiClient.post(
      `/createproducts?ProductName=${data.ProductName}&Description=${data.Description}&MRP=${data.MRP}&Price=${data.Price}&SpecialPrice=${data.SpecialPrice}&OrderNo=${data.OrderNo}&TaxPercentage=0&Status=1`
    )
      .then(res => {
        
        
        toast.success('Product Name Added Successfully');
        handleCloseModal();
        onFetchData();
        fetchEmployeeGroup();
        
      })
      .catch((err: any) => {
        toast.error('Error saving data');
      });
  }
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '' : num.toFixed(2);
  };

  return (
    <>
     <Grid 
  container 
  sx={{ 
    width: '100%', 
    height: '100%', 
    padding: '20px', // Add padding to the container
    maxHeight: '500px', // Set a fixed height for the popup
    overflow: 'auto' // Enable scrolling if content overflows
  }} 
  spacing={2} // Reduce spacing between grid items
>
    <form onSubmit={handleSubmit(onSubmitForm)}>
  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Add a Product Name</Typography>
  </Grid>
  <br/>
  <Grid item xs={12}>
    <Divider />
  </Grid>
  <br/>
  <Controller
    name="ProductName"
    control={control}
    rules={{ required: 'Product Name is required' }}
    render={({ field }) => (
      <TextField {...field} label="Product Name" variant="outlined" fullWidth sx={{ marginBottom: 2 }} error={!!errors.ProductName} />
    )}
  />

  {/* Description */}
  <Controller
    name="Description"
    control={control}
    render={({ field }) => (
      <TextField {...field} label="Description" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
    )}
  />

  {/* MRP */}
  <Controller
    name="MRP"
    control={control}
    rules={{ required: 'MRP is required', pattern: { value: /^[0-9]+(\.\d{1,2})?$/, message: 'Invalid MRP format' } }}
    render={({ field }) => (
      <TextField {...field} label="MRP (₹)" variant="outlined" fullWidth sx={{ marginBottom: 2 }} type="number" error={!!errors.MRP} 
        InputProps={{                
          inputProps: { style: { textAlign: 'right' } }
        }} 
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
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
          const priceValue = parseFloat(value);
          const mrpValue = parseFloat(MRP);
          return priceValue <= mrpValue || 'Price must be equal to or less than MRP';
        },
        isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid price format'
      }
    }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Price (₹)"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        type="number"
        error={!!errors.Price}
        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
    )}
  />

  {/* Special Price */}
  <Controller
    name="SpecialPrice"
    control={control}
    rules={{
      required: 'Special Price is required',
      validate: {
        isLessThanPrice: value => {
          const specialPriceValue = parseFloat(value);
          const priceValue = parseFloat(Price);
          return specialPriceValue <= priceValue || 'Special Price may be 0 or less than Price';
        },
        isValidFormat: value => /^[0-9]+(\.\d{1,2})?$/.test(value) || 'Invalid Special Price format'
      }
    }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Special Price (₹)"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        type="number"
        error={!!errors.SpecialPrice}
        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
        onBlur={(e) => {
          const formattedValue = formatCurrency(e.target.value);
          field.onChange(formattedValue);
        }}
      />
    )}
  />
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
  {/* Order No */}
  <Controller
    name="OrderNo"
    control={control}
    rules={{
      required: 'Order Number is required',
      pattern: {
        value: /^[1-9]\d*$/,
        message: 'Order Number must be a positive integer without decimal or negative values',
      }
    }}
    render={({ field }) => (
      <TextField
        {...field}
        label="Order No"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
        error={!!errors.OrderNo}
      />
    )}
  />
  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
    <Button
      type='submit'
      sx={{
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
          color: 'white',
        }
      }}
      variant='contained'
    >
      <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
      Save
    </Button>
  </Grid>
  </form>
</Grid>


      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        height={300}
      >
        <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Typography sx={{ fontWeight: 600, fontSize: '16px', paddingY: 3 }}>Add a Product Name</Typography>
        <Divider />
        <br/>
        <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid item xs={12}>
              <Controller
                name='OwnerName'
                control={control}
                rules={{ required: 'Product Name is required' }}
                render={({ field: { value, onChange },fieldState: { error } }) => (
                  <>
                    <CustomTextField
                    sx={{ width: '100%', mb: 3 }}
                      id='OwnerName'
                      fullWidth
                      value={value || ''}
                      label={<div>Product Name <Typography variant='caption' color='error'>*</Typography></div>}
                      placeholder='Product Name'
                      onChange={e => {
                        let inputValue = e.target.value
                        inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '')
                        inputValue = inputValue.replace(/\b\w/g, char => char.toUpperCase())
                        onChange(inputValue)
                      }}
                    //   onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //       shopNameRef.current?.focus(); // Move to Shop Name input on Enter
                    //     }
                    //   }}
                      error={Boolean(error)}
                    //   inputRef={ownerNameRef} // Set ref
                      helperText={error ? error.message : ' '}
                    />
                    {/* <FormHelperText>{accountErrors.OwnerName ? accountErrors.OwnerName.message : ''}</FormHelperText> */}
                  </>
                )}
              />
            </Grid>
        
          
          <Button
            type='submit'
            sx={{
              float: 'right',
              marginRight: '2px',
              marginTop: '20px',
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
                color: 'white',
              }
            }}
            variant='contained'
          >
            <Icon style={{ marginRight: '5px' }} icon='material-symbols-light:save-outline' width={25} height={25} />
            Save
          </Button>
        </form>
      </CustomModal>
    </>
  );
}

export default ProductGroupName;