import { Alert, Box, Button, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import { get } from 'jquery';
import CustomerGroupName1 from '../../apps/invoice/list/CustomerGroup'

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
const modalDesign = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#cacaca'
  } else if (selectedMode === 'light') {
    return '#f2f2f7'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#cacaca'
  } else {
    return '#f2f2f7'
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
  const [fetchedgroupName1, setFetchedgroupName1] = useState('')
    const [selectedgroupName1, setSelectedgroupName1] = useState({ CustomerName: '', id: '' })
    const [groupNameSearch1, setgroupNameSearch1] = useState('');
    const [openPopupcustomerGroup1, setOpenPopupcustomerGroup1] = useState(false)
    const [getEmployeeGroup1, setGetEmployeeGroup1] = useState<any>([])
    const [errorMessage, setErrorMessage] = useState('');
    const [customerName, setCustomer] = useState(''); 
    
    const handleEmployeeGroupOpen1 = () => {
      setOpenPopupcustomerGroup1(true)
    }
    const handleEmployeeGroupClose1 = () => {
      setOpenPopupcustomerGroup1(false)
    }
    const handlegroupnameclick1 = () => {
        clearSelectedgroupname1()
        }
        const clearSelectedgroupname1 = () => {
          setSelectedgroupName1({ CustomerName: '', id: '' })
          setFetchedgroupName1('')
        }
  const [refererError, setRefererError] = useState(false);
  
  const handleDesignationClick = (GroupName: any, id: any) => {
    setSelectedgroupName({ CustomerName: GroupName, id: id });
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


  const onSubmitForm = async (data: any) => {
    // console.log(data);
    // console.log(getEmployeeGroup)
    try{
      //let res;
    const empGroupExists = getEmployeeGroup?.some(
      (item: any) => item.CustomerName.toLowerCase() == data.customer.toLowerCase()
    );
    if (empGroupExists) {
      toast.error('Customer Name already exists');
      return;
    }
    const referrerId = selectedgroupName1?.id || fetchedgroupName1;
  
    if (!referrerId) {
      setRefererError(true);
      setErrorMessage('The referrer field is required')
      toast.error('The referrer field is required');
      return;
    }
    const MobileNumber = data.mobileNumber.startsWith('91') ? data.mobileNumber.slice(2) : data.mobileNumber;
    const res=await ApiClient.post(
      `/createcustomer?CustomerName=${data.customer}&PhoneNo=${data.mobileNumber}&EmailId=${data.emailId}&Referrer=${referrerId}&Status=1`
    )
    //console.log(res)
      
        // console.log(res.data)
        if (res.data.message == 'Email ID Already Exists') {
          toast.error(res.data.message)
        }
        else if (res.data.message == 'Phone Number Already Exists') {
          toast.error(res.data.message)
        }
        else if(res.data.message == 'You Are Already Referred to Another Customer') {
          toast.error('Referrer is Already Referred to Another Customer! Pls Change Referrer.')
        }
        else {
        toast.success('Customer Name Added Successfully');
        handleCloseModal();
        onFetchData();
        fetchEmployeeGroup();
        }
      }
      catch(err: any)  {
        toast.error('Error saving data');
      }
  }
  useEffect(() => {
     fetchEmployeeGroup1()
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [groupNameSearch1])
  const fetchEmployeeGroup1 = async () => {
    try

    {
    let filterString = ''
    if (groupNameSearch) {
      filterString += `GroupName: {contains: "${groupNameSearch}"}`
    }
  const res = await ApiClient.post(`/getcustomer?Customer=${groupNameSearch}`);

        setGetEmployeeGroup1(res.data.data)
  }
    catch (err) {
        console.error(err)
      }
  }

  return (
    <>
      <Grid container sx={{ width: '100%' }} spacing={4}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '17px' }}>Select a Customer</Typography>
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
            Add a new Customer name
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <div style={{ height: '300px', overflow: 'auto' }}>
            {getEmployeeGroup?.length === 0 ? (
              <Alert severity='error'>No Customer Name available</Alert>
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
                    onClick={() => handleDesignationClick(i.CustomerName, i.Id)}
                  >
                    <Typography>{i.CustomerName}</Typography>
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
        <CustomCloseButton id='rightDrawerClose'  color='inherit' onClick={handleCloseModal}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <Typography sx={{ fontWeight: 600, fontSize: '16px', paddingY: 3 }}>Add a Customer Name</Typography>
        <Divider />
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Controller
            name='customer'
            control={control}
            rules={{ required: 'Customer Name is required' }}
            render={({ field }) => (
              <CustomTextField
                sx={{ width: '100%', mb: 3 }}
                fullWidth
                id="customer-input"
                value={field.value}
                onChange={e => {
                  const modifiedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                  field.onChange(modifiedValue);
                }}
                error={Boolean(errors.customer)}
               // helperText={errors.customer ? errors.customer.message : ''}
              />
            )}
          />
          <Controller
            name='emailId'
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                sx={{ width: '100%', mb: 3 }}
                fullWidth
                type='email'
                id="email-input"
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errors.emailId)}
               // helperText={errors.emailId ? errors.emailId.message : ''}
                placeholder='Enter your Email'
              />
            )}
          />
          <Controller
            name='mobileNumber'
            control={control}
            rules={{ required: 'Mobile Number is required' }}
            render={({ field }) => (
              <PhoneInput
                country={'in'}
                inputStyle={{
                  background: 'none',
                  height: '2.25rem',
                  width: '100%',
                  fontSize: '12px',
                  color: getColor(),
                  padding: '7.5px 13px 7.5px 2.7rem'
                }}
                value={field.value || ''}
                onChange={(value: string) => field.onChange(value)}
              />
            )}
          />
          <Grid item xs={12} sm={4} sx={{ marginTop: !selectedgroupName1.id || !fetchedgroupName1 ? '' : '' }}>
              <span
                style={{
                  color: getColor(),
                  fontSize: '14px'
                }}
              >
                Referrer
              </span>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}>
                *
              </Typography>

                <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',

                }}
              >
                {selectedgroupName1.CustomerName !== '' || fetchedgroupName1 != '' ? (
                  <Typography sx={{ width: '90%' }} onClick={handleEmployeeGroupOpen1}>
                    {selectedgroupName1.CustomerName !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',
                          justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        <Typography sx={{ color: '#222' }}>{selectedgroupName1.CustomerName}</Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          backgroundColor: modalDesign(),
                          padding: '10px',


                       justifyContent: 'space-between',
                          borderRadius: '5px',
                          cursor: 'pointer'

                        }}
                      >
                        <Typography sx={{ color: '#222' }}>
                          {
                            getEmployeeGroup1
                              ?.sort((a: any, b: any) => a.CustomerName.localeCompare(b.CustomerName))
                              .map((item: any) => {
                                 if (Number(item.Id) === Number(fetchedgroupName1)) {
                                  return item.CustomerName
                                 }
                                return null
                              })
                              .filter((CustomerName: any) => CustomerName !== null)[0]
                          }
                        </Typography>
                        <Typography sx={{ color: '#776cff', cursor: 'pointer' }}>EDIT</Typography>
                      </Box>
                    )}
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: '#776cff', fontWeight: 600, cursor: 'pointer', backgroundColor: '#f2f2f7', padding: '10px', borderRadius: '5px' }}
                    onClick={handleEmployeeGroupOpen1}
                  >
                    Select a Referrer
                  </Typography>
                )}
{(selectedgroupName1.id || fetchedgroupName1) && (
                  <Icon
                    icon='material-symbols-light:delete-outline'
                    style={{ cursor: 'pointer' }}
                    onClick={handlegroupnameclick1}
                  />
                )}
              </Box>
              {errorMessage && (
                <Typography variant='caption' color='error' sx={{ marginTop: '5px' }}>
                    {errorMessage}
                </Typography>
            )}
             {refererError && (
      <Typography variant='caption' color='error'>
        Please select a Referrer.
      </Typography>
    )}
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
      <CustomModal
          open={openPopupcustomerGroup1}
          onClose={() => {
            handleEmployeeGroupClose1()
            setgroupNameSearch1('')
          }}
          onOpen={handleEmployeeGroupOpen1}
          buttonText=''
          buttonOpenText=''
          height={500}
        >
          <CustomCloseButton id='rightDrawerClose' color='inherit'  onClick={handleEmployeeGroupClose}>
            <Icon icon='tabler:x' fontSize='1.25rem'></Icon>
          </CustomCloseButton>
          <CustomerGroupName1
            getEmployeeGroup={getEmployeeGroup1}
            setSelectedgroupName={setSelectedgroupName1}
            handleEmployeeGroupClose={handleEmployeeGroupClose1}
            fetchEmployeeGroup={fetchEmployeeGroup1}
            setgroupNameSearch={setgroupNameSearch1}
            onFetchData={onFetchData}
            groupNameSearch={groupNameSearch1}
             setCustomer={setCustomer}
          />
        </CustomModal>
    </>
  );
}

export default CustomerGroupName;
