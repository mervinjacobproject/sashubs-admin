import React, { useState } from 'react';
import { Box, Grid, IconButton, TextField, Autocomplete, Tooltip } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { GridRowId } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import CustomTextField from 'src/@core/components/mui/text-field';
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer';
import Jobsteperform from 'src/pages/transactions/invoice/jobsteperform';
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal';
import JobsteperformJob from 'src/pages/transactions/job/jobsteperform';

interface TableHeaderProps {
  handleFilter: (val: string) => void;
  handleFocus: any;
  value: any;
  setAllEmpId: any;
  allEmployee: any;
}

const PayCalculationHeader = (props: TableHeaderProps) => {
  const { setAllEmpId, allEmployee } = props;
  const { handleFilter, value, handleFocus } = props;
  const [showMessage, setShowMessage] = useState(false);

  const handleIconButtonClick = () => {
    setShowMessage(!showMessage);
  };

  const {
    control,
    watch,
    formState: { }
  } = useForm<any>({}); // Using any here because FormData is not defined

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode');
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.68)';
    } else if (selectedMode === 'light') {
      return 'black';
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.68)';
    } else {
      return 'black';
    }
  };

  return (
    <>
      <Box
        sx={{
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Grid sx={{ display: 'flex', padding: '5px', cursor: 'pointer !important' }}>
            <Tooltip title="Filter">
              <div>
                <IconButton onClick={handleIconButtonClick}>
                  <Icon icon='mingcute:filter-line' />
                </IconButton>
              </div>
            </Tooltip>
          </Grid>

          <Grid sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '10px 9px 3px 0px' }}>
              {/* Additional content here if needed */}
            </Box>
          </Grid>
        </Box>
      </Box>
      {showMessage && (
        <div className={`message-container ${showMessage ? 'show' : ''}`}>
          <div className='message-content'>


            <label style={{ color: getColor(), padding: '5px' }}>Employee</label>
            <Grid sx={{ width: '200px' }}>


              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <>
                    <Autocomplete
                      {...field}
                      options={allEmployee}
                      getOptionLabel={(option) => option.FirstName + ' ' + option.LastName || ''}
                      value={allEmployee?.find((pricevalue: { DID: any; }) => pricevalue?.DID === watch('country')) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.DID || null);
                        setAllEmpId(newValue?.DID);
                      }}
                      isOptionEqualToValue={(option, value) => option?.DID === value?.DID}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </>
                )}
              />
            </Grid>


          </div>
        </div>
      )}
    </>
  );
};

export default PayCalculationHeader;
