import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, InputAdornment, TextField } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import 'jspdf-autotable'
import { Typography } from '@mui/material'
import CutomerGroupEditForm from './editPointProductForm'
import ProductHeader from 'src/pages/apps/invoice/list/point_productHeader'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import { OpenInNew } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

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
type LevelKeys = 'Level1' | 'Level2' | 'Level3' | 'Level4' | 'Level5' | 'Level6';

// Define the state structure for levels
const initialLevels: Record<LevelKeys, string> = {
  Level1: '0',
  Level2: '0',
  Level3: '0',
  Level4: '0',
  Level5: '0',
  Level6: '0',
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
    transform: 'translate(7px, -5px)'
  }
}))

const Customergroup = () => {
  const [customergroupname, setCustomergroupname] = useState([])
  const rowData=customergroupname.length;
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [editMode, setEditMode] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [allCountryName, setAllCountryName] = useState('')
  const [productName, setProductName] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [allCountry, setAllCountry] = useState([])
  const [levelData, setLevelData] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [mlmModalOpen, setMlmModalOpen] = useState(false);
  const [levels, setLevels] = useState(initialLevels);
  const [editid, seteditid] = useState(0);
  //const baseAmount = 90;
  // const baseAmount = selectedRowData ? 
  // (selectedRowData.ProductName == 'General' ? 90 :
  // (selectedRowData.ProductName == 'Deluxe' ? 180 :
  // (selectedRowData.ProductName == 'Super Deluxe' ? 360 : 90))) : 
  // 90; // Default if selectedRowData is not defined

  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [baseAmount, setBaseAmount] = useState(90);  // Initialize baseAmount

  useEffect(() => {
    if (selectedRowData) {
      setBaseAmount(selectedRowData.Points); // Update baseAmount when selectedRowData changes
    }
  }, [selectedRowData]);
 
  const total = Object.values(levels).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
      //setIsSaveDisabled((total > 100) ? true : false);
      const getTotalColor = () => {
        if (total < 100) return 'green';
        if (total === 100) return 'orange';
        return 'red';
      };
      const totalAmount = Object.keys(levels).reduce((acc, level) => {
        const percentage = parseFloat(levels[level as LevelKeys]) || 0;
        return acc + (baseAmount * percentage) / 100;
      }, 0);
  const handleSave = () => {
    
   if (selectedRowData ) {
    if(levelData.length === 0){
      ApiClient.post(`/createlevel?ProductID=${selectedRowData.Id}&L1=${levels.Level1}&L2=${levels.Level2}&L3=${levels.Level3}&L4=${levels.Level4}&L5=${levels.Level5}&L6=${levels.Level6}&Amount=${totalAmount}`)
       .then((res: any) => {
          toast.success('Levels added successfully')
          //const amount = totalAmount;
         
          //setSelectedRowData(selectedRowData)
          handleMlmModalClose()
          
        })
       .catch((err: any) => {
          console.error('Error adding Levels:', err)
          toast.error('Error adding Levels')
        })
      }
      else{
        ApiClient.post(`/updatelevel?Id=${editid}&ProductID=${selectedRowData.Id}&L1=${levels.Level1}&L2=${levels.Level2}&L3=${levels.Level3}&L4=${levels.Level4}&L5=${levels.Level5}&L6=${levels.Level6}&Amount=${totalAmount}`)
       .then((res: any) => {
          toast.success('Levels Updated successfully')
          // const amount = totalAmount;        
          // selectedRowData.Price = amount.toFixed(2);
          // selectedRowData.Points = Math.round(amount);
          // setSelectedRowData(selectedRowData)
          handleMlmModalClose()
          
        })
       .catch((err: any) => {
          console.error('Error adding Levels:', err)
          toast.error('Error adding Levels')
        })
      }
      }
      else{
        toast.error('Please enter valid levels')
      }
      }
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        // Use type assertion
        if (name in levels) {
          if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
            setLevels((prevLevels) => ({
              ...prevLevels,
              [name as LevelKeys]: value,
            }));
          }
        }
      };
    
      
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {

    ApiClient.post(`/deleteproduct?Id=${selectedRowId}`)
      .then((res: any) => {
        toast.success('Deleted successfully')
        setModalOpenDelete(false)
        fetchData()

      })
      .catch((err: any) => {
        console.error('Error deleting designation:', err)
        toast.error('Error deleting designation')

      })
  }
  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName,activeStatus])

  const fetchData = async () => {
    try {
      let res: any;
      const queryParams: string[] = [];
      if (productName) {
        queryParams.push(`ProductName=${productName}`);
      }
      if (activeStatus && activeStatus !== 'all') {
        const status = activeStatus === 'active' ? 1 : 0;
        queryParams.push(`Status=${status}`);
      }
      
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`;
        res = await ApiClient.post(`/getproduct${queryString}`);
      } else {
      res = await ApiClient.post(`/getproduct`);
      }
      const totalRowCount = res.data.data;
      setTotalCount(totalRowCount);
      const response = res.data.data;
      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1,
      }));
      setCustomergroupname(dataWithSerialNumber);
    } catch (err) {
    //  console.error('Error fetching data:', err);
    }
  }
  const handleEdit = (id: any) => {
    const selectedRow = customergroupname.find((row: any) => row.Id === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }
  const 
  fetchLevels = async (data: any) => {
    try {
      const res = await ApiClient.post(`/getleveldetails?ProductID=${data.Id}`);
      const response = res.data.data;
  
      // Assuming response returns an array with a single object, adjust as needed
      if (response.length > 0) {
        const levelDetails = response[0]; // Adjust based on the actual structure of your response
        setLevels({
          Level1: levelDetails.L1.toString(),
          Level2: levelDetails.L2.toString(),
          Level3: levelDetails.L3.toString(),
          Level4: levelDetails.L4.toString(),
          Level5: levelDetails.L5.toString(),
          Level6: levelDetails.L6.toString(),
        });
      } else {
        // Handle the case where no level details are returned
        setLevels(initialLevels); // Reset to initial levels if no data is available
      }
      
      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1,
      }));
  seteditid(dataWithSerialNumber[0].Id)
      setLevelData(dataWithSerialNumber);
    } catch (err) {
     // toast.error('Error fetching data:');
    }
  };
  const handleMlmModalOpen = (rowData: any) => {
    fetchLevels(rowData);
    setSelectedRowData(rowData);
    setMlmModalOpen(true);
  };

  const handleMlmModalClose = () => {
    setMlmModalOpen(false);
    setSelectedRowData(null);
  };
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
  const getBgColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
     if (selectedMode === 'light') {
      return '#f5f5f5'
    } 
  }
  const formatCurrency = (amount:any) =>
    amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  // const formatCurrency = (value: number | null) => {
  //   if (value === null) return '₹ 0.00';
  //   return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  // };
  const columns: GridColDef[] = [
    {
      field: 'S.no',
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'ProductName',
      headerName: 'Product Name',
      flex: 0.3,
      renderCell: ({ row }: any) => 
      <Tooltip title={row.ProductName}>

        <div>{row.ProductName}</div>
      </Tooltip>
    },
    
    {
      field: 'Points',
      headerName: 'Points',
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      flex: 0.2,
      renderCell: ({ row }: any) => (
        <Tooltip title={row.Points}>
          <div>{(parseFloat(row.Points))}</div>
        </Tooltip>
      ),
    },
    {
      field: 'Price',
      headerName: 'Price (₹)',
      flex: 0.2,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.Price}>
          <div>{formatCurrency(parseFloat(row.Price))}</div>
        </Tooltip>
      ),
    },
    
    
    {
      field: 'MLM',
      headerName: 'MLM',
      flex: 0.1,
      renderCell: ({ row }: any) => (
        <IconButton
          size='small'
          onClick={() => handleMlmModalOpen(row)}
        >
          <OpenInNew />
        </IconButton>
      )
    },

    // {
    //   field: 'Id',
    //   headerName: 'Id',
    //   flex: 0.3,
    //   renderCell: ({ row }: any) => <div>{row.Id}</div>
    // },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 0.3,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Button
          sx={{
            padding: '5px 30px 5px 30px',
            borderRadius: '5px',
            width: '8px',
            cursor: 'initial',
            backgroundColor:
              row.Status == 1 ? '#dff7e9 !important' : row.Status == 0 ? '#f2f2f3 !important' : '',
            color: row.Status == 1 ? '#28c76f !important' : row.Status == 0 ? '#a8aaae !important' : '',
            fontWeight: '400',
            fontSize: row.Status == 0 ? '0.81em' : '0.81em'
          }}
        >
          {row.Status == 1 ? 'Active' : row.Status == 0 ? 'Inactive' : ''}
        </Button>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setShowMessage(false)
                handleEdit(row.Id)
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.Id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]
  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Points Product - Apurva</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <ProductHeader
              
                customergroupname={customergroupname}
                allCountry={allCountry}
                setAllCountryName={setAllCountryName}
                // printData={printData}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                onFetchData={fetchData}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
                productName={productName}
                setProductName={setProductName}
              />
              <DataGrid
                autoHeight
                pagination
                rows={customergroupname}
                columns={columns}
                // loading={isTableLoading}
                rowCount={rowData}
                getRowId={row => row.Id}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={e =>
                  setPaginationModel({
                    ...e
                  })
                }
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
              />
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p
          style={{
            color: getColor()
          }}
        >
          Are you sure you want to delete?
        </p>
        <div className='delete-popup' style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#808080',
              '&:hover': {
                background: '#808080',
                color: 'white'
              }
            }}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              '&:hover': {
                background: '#776cff',
                color: 'white'
              }
            }}
            onClick={handleDeleteConfirm}
          >
            <Icon icon='ic:baseline-delete' />
            Delete
          </Button>
        </div>
      </CustomModal>
      {editMode && (
        <CustomModal
          buttonText=''
          open={editMode}
          onClose={handleCloseModal}
          buttonOpenText=''
          onOpen={() => setEditMode(true)}
          width={400}
        >
          <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <CutomerGroupEditForm
            editid={selectedRowData?.Id}
            employeegroupName={selectedRowData?.ProductName}
            CustomerName={selectedRowData?.CustomerID}
            editStatus={selectedRowData?.Status}
            points={selectedRowData?.Points}
            price={selectedRowData?.Price}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
            customergroupname={customergroupname}
          />
        </CustomModal>
      )}
       <CustomModal width={500} open={mlmModalOpen} onClose={handleMlmModalClose} >
  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: getColor(), }}>MLM Structure</Typography>
    <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleMlmModalClose}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
  </Box>

  {/* Header Row */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, padding: '12px 0', borderBottom: '2px solid #e0e0e0',backgroundColor: getBgColor()  }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: getColor(), flex: 1 ,marginLeft: 2,textAlign: 'Left'}}>Levels</Typography>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: getColor(), flex: 1, textAlign: 'Right',marginRight:2 }}>Amount</Typography>
  </Box>

  {Object.keys(levels).map((level: any) => {
    const percentage = parseFloat(levels[level as LevelKeys]) || 0;
    const amount = (baseAmount * percentage) / 100;

    return (
      <Box key={level} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1.5, padding: 2, border: '1px solid #e0e0e0', borderRadius: 1,  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', justifyContent: 'space-between' }}>
        <Box sx={{ fontWeight: '600', color: getColor(), flex: 0.7 }}>
          <Typography>{level} :</Typography>
        </Box>
        <TextField
          type="number"
          name={level}
          id="percentage"
          value={levels[level as LevelKeys]}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ maxWidth: '130px', marginRight: 2, }}
          inputProps={{ min: 0, max: 100, step: 0.01, style: { fontWeight: '500' } }}

          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{fontWeight: '500',color: getColor(), borderLeft: '1px solid rgba(0, 0, 0, 0.23)', pl: 1 }}>
                %
              </InputAdornment>
            ),
            sx: { fontWeight: '500',color: getColor(), }
          }}
        />
        <Box sx={{ fontWeight: '500', color: getColor(), textAlign: 'right', flex: 1 }}>
          ₹ {amount.toFixed(2)}
        </Box>
      </Box>
    );
  })}

  {/* Total Percentage and Amount */}
  {/* Total Percentage and Amount */}
<Box sx={{ marginBottom: 3, padding: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#e8f5e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Typography variant="h6" style={{ color: getTotalColor(), fontWeight: 'bold', flex: 1 }}>
    Total Percentage: 
    <span style={{ marginLeft: '8px' }}>{total.toFixed(2)}</span>
    <span style={{ marginLeft: '4px' }}>%</span> {/* Add a small margin for space */}
  </Typography>

  <Typography variant="h6" style={{ color: getTotalColor(), fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
    Total Amount:  ₹ {totalAmount.toFixed(2)}
  </Typography>
</Box>

  
  {total > 100 && <Typography style={{ color: 'red', textAlign: 'center', marginTop: 1 }}>Total exceeds 100%</Typography>}

  <Button
    variant="contained"
    onClick={handleSave}
    disabled={total > 100}
    sx={{
      marginTop: 2,
      backgroundColor: '#776cff',
      '&:hover': { backgroundColor: '#F69A29' },
      width: '100%',
      fontWeight: 'bold',
      padding: '10px 0',
    }}
  >
    Save Changes
  </Button>
</CustomModal>




    </>
  )
}

export default Customergroup
