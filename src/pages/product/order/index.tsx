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
import CutomerGroupEditForm from './editOrderForm'
import ProductHeader from 'src/pages/apps/invoice/list/orderHeader'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import { OpenInNew } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import InvoicePreview from 'src/pages/view/Preview'
import themeConfig from 'src/configs/themeConfig'

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
  const [showMessage, setShowMessage] = useState(false)
  const [view, setView] = useState(false)
  const [InId, setInId] = useState('')
      const [productData, setProductData] = useState([])
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  // const handleDeleteConfirm = () => {

  //   ApiClient.post(`/deleteorders?ID=${selectedRowId}`)
  //     .then((res: any) => {
  //       toast.success('Deleted successfully')
  //       setModalOpenDelete(false)
  //       fetchData()

  //     })
  //     .catch((err: any) => {
  //       console.error('Error deleting designation:', err)
  //       toast.error('Error deleting designation')

  //     })
  // }
  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }
  useEffect(() => {
    fetchData()
   // fetchProductData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName,activeStatus])
  const fetchProductData = async () => {
    try {
      //let res: any;

     const res = await ApiClient.post(`/orderdetailsgetall`);
      const totalRowCount = res.data.data;
      setTotalCount(totalRowCount);
      const response = res.data.data;
      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1,
      }));
      setProductData(dataWithSerialNumber);
    } catch (err) {
    //  console.error('Error fetching data:', err);
    }
  }
  const fetchData = async () => {
    try {

     const res = await ApiClient.post(`/api.php?eventtype=lob_createorder&viewtype=list&cusid=`);

      const totalRowCount = res.data;
      setTotalCount(totalRowCount);
      const response = res.data;
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
    const selectedRow = customergroupname.find((row: any) => row.ID === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
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
      field: 'cusname',
      headerName: 'Customer Name',
      flex: 0.2,
      renderCell: ({ row }: any) =>
      <Tooltip title={row.cusname}>

        <div>{row.cusname}</div>
      </Tooltip>
    },
    {
      field: 'orderid',
      headerName: 'Order ID',
      flex: 0.2,
      renderCell: ({ row }: any) =>
      <Tooltip title={row.orderid}>

        <div>{row.orderid}</div>
      </Tooltip>
    },
    {
      flex: 0.2,
      field: 'date',
      headerName: 'Order Date',
      sortable: false,
      renderCell: ({ row }: any) => {
        // Format the date here
        const formattedDate = row.date.split(' ')[0]; // Assuming row.date is in the format "28-11-2023 03:04:13 PM"

        return (
           <Tooltip title={formattedDate}>
            <div>{formattedDate}</div>
           </Tooltip>
        );
      },
    },

    {
      field: 'total',
      headerName: 'Total (₹)',
      flex: 0.2,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }: any) => (
        <Tooltip title={row.total}>
          <div>{formatCurrency(parseFloat(row.total))}</div>
        </Tooltip>
      ),
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 0.2,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Button
          sx={{
            padding: '5px 30px 5px 30px',
            borderRadius: '5px',
            width: '8px',
            cursor: 'initial',
            backgroundColor: row.status == 1 ? '#dff7e9 !important' : row.status == 0 ? '#f2f2f3 !important' : '',
            color: row.status == 1 ? '#28c76f !important' : row.status == 0 ? '#a8aaae !important' : '',
            fontWeight: '400',
            fontSize: row.status == 0 ? '0.81em' : '0.81em'
          }}
        >
          {row.status == 1 ? 'Active' : row.status == 0 ? 'Inactive' : ''}
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
          <Tooltip title='View'>
              <IconButton
                size='small'
                sx={{ color: 'text.secondary' }}
                onClick={() => {
                  //const temp: any = [row.ID]
                  setInId(row.ID)
                  setView(true)
                }}
              >
                <Icon icon='mdi:eye-outline' />
              </IconButton>
            </Tooltip>
          {/* <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setShowMessage(false)
                handleEdit(row.ID)
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]
  return (
    <>
    {!view ? (
      <DatePickerWrapper>
        <Head>
          <title>Order - {themeConfig.templateName}</title>
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
                getRowId={row => row.id}
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
      ) : (
        <>
          <Grid sx={{ position: 'relative' }}>
            <Box
              sx={{
                textAlign: 'right',
                transition: '.25s linear',
                position: 'absolute',
                right: '3%',
                top: '0.5%',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8.5px',
                border: '1px solid #978ef4',
                borderRadius: '50%',
                color: '#978ef4',
                '&:hover': {
                  color: 'White',
                  background: '#978ef4',
                  transition: '.25s linear'
                }
              }}
            >
              {' '}
              <Icon onClick={() => setView(false)} icon='ic:outline-close'></Icon>{' '}
            </Box>
            <InvoicePreview id={InId}  />
          </Grid>
        </>
      )}
      {/* <CustomModal
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
      </CustomModal> */}
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
            editid={selectedRowData?.ID}
            employeegroupName={selectedRowData?.ProductName}
            CustomerName={selectedRowData?.CustomerID}
            editStatus={selectedRowData?.Status}
            points={selectedRowData?.Points}
            price={selectedRowData?.Price}
            productData={selectedRowData}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
            customergroupname={customergroupname}
          />
        </CustomModal>
      )}

    </>
  )
}

export default Customergroup
