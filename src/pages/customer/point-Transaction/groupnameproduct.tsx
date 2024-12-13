import { Alert, Button, Divider, Grid, Typography } from '@mui/material';
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
    reset,
  } = useForm<any>({});

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
      `/createproducts?ProductName=${data.OwnerName}&Status=1`
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

  return (
    <>
      <Grid container sx={{ width: '100%' }} spacing={4}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Select a Product</Typography>
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
          <Typography sx={{ color: '#776cff' }} onClick={handleAddNewgroupname}>
            Add a new Product name
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
                <React.Fragment key={i.ID}>
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
                    onClick={() => handleDesignationClick(i.ProductName, i.ID)}
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