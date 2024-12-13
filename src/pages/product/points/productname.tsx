import { Alert, Button, Divider, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CustomTextField from 'src/@core/components/mui/text-field';
import Icon from 'src/@core/components/icon';
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal';
import { Controller, useForm } from 'react-hook-form';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import toast from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import PhoneInput from 'react-phone-input-2';

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode');
  if (selectedMode === 'dark') {
    return 'rgb(47, 51, 73)';
  } else if (selectedMode === 'light') {
    return 'white';
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'rgb(47, 51, 73)';
  } else {
    return 'white';
  }
};

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

const CustomerGroupName = ({
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
    reset,
  } = useForm<any>({});

  const handleDesignationClick = (GroupName: any, id: any) => {
    setSelectedgroupName({ ProductName: GroupName, id: id });
    handleEmployeeGroupClose();
    fetchEmployeeGroup();
    setgroupNameSearch('');
  };

  const handleAddNewGroupname = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset(); // Reset form when closing modal
  };

  const onSubmitForm = (data: any) => {
    const empGroupExists = getEmployeeGroup?.some(
      (item: any) => item.ProductName.toLowerCase() === data.productName.toLowerCase()
    );
    if (empGroupExists) {
      toast.error('Product Name already exists');
      return;
    }

    ApiClient.post(
      `/createproduct?ProductName=${data.productName}&Price=${data.price}&Points=${data.points}&Status=1`
    )
      .then(res => {
       
          toast.success('Product added successfully');
          handleCloseModal();
         // onFetchData();
          fetchEmployeeGroup();
       
      })
      .catch((err: any) => {
        toast.error('Error saving data');
      });
  };

  return (
    <>
      <Grid container sx={{ width: '100%' }} spacing={4}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Select a Product Name</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            sx={{ width: '100%' }}
            placeholder='Search'
            autoFocus
            id="search-input"
            value={groupNameSearch}
            onChange={e => {
              const modifiedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
              setgroupNameSearch(modifiedValue);
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', gap: '5px' }}>
          <Icon icon='gala:add' />
          <Typography sx={{ color: '#776cff' }} onClick={handleAddNewGroupname}>
            Add a new product name
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <div style={{ height: '300px', overflow: 'auto' }}>
            {getEmployeeGroup?.length === 0 ? (
              <Alert severity='error'>No Product Name available</Alert>
            ) : (
              getEmployeeGroup?.map((i: any) => (
                <React.Fragment key={i.Id}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      padding: '10px 5px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#776cff',
                      },
                    }}
                    onClick={() => handleDesignationClick(i.ProductName, i.Id)}
                  >
                    <Typography>{i.ProductName}</Typography>
                  </Grid>
                  <Grid>
                    <Divider />
                  </Grid>
                </React.Fragment>
              ))
            )}
          </div>
        </Grid>
      </Grid>

      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        height={300}
      >
        <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Typography sx={{ fontWeight: 600, fontSize: '16px', paddingY: 3 }}>Add a Product</Typography>
        <Divider />
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Controller
            name='productName'
            control={control}
            rules={{ required: 'Product Name is required' }}
            render={({ field }) => (
              <CustomTextField
                sx={{ width: '100%', mb: 2 }}
                fullWidth
                id="product-name-input"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errors.productName)}
              //  helperText={errors.productName ? errors.productName.message : ''}
              />
            )}
          />
          <Controller
            name='price'
            control={control}
            rules={{ required: 'Price is required' }}
            render={({ field }) => (
              <CustomTextField
                sx={{ width: '100%', mb: 2 }}
                fullWidth
                type='number'
                id="price-input"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errors.price)}
               // helperText={errors.price ? errors.price.message : ''}
                placeholder='Enter Price'
              />
            )}
          />
          <Controller
            name='points'
            control={control}
            rules={{
              required: 'Points is required', // Rule for required input
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/, // Pattern to allow positive numbers (including floats)
                message: 'Only positive numbers are allowed', // Error message
              },
              validate: {
                // Custom validation for positive values
                isPositive: (value:any) => {
                  if (parseFloat(value) < 0) return 'Only positive values are allowed';
                  return true;
                },
              },
            }}
            render={({ field }) => (
              <CustomTextField
                sx={{ width: '100%', mb: 2 }}
                fullWidth
                // type='number'
                id="points-input"
                value={field.value}
                onChange={(e) => {
                  // Get the input value
                  const value = e.target.value;
                  // Allow only positive numeric values (including float)
                  const numericValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-decimal characters
                  field.onChange(numericValue); // Update value in the controller
                }}
                error={Boolean(errors.points)}
               // helperText={errors.points ? errors.points.message : ''}
                placeholder='Enter Points'
              />
            )}
          />
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

export default CustomerGroupName;
