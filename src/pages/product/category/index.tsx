import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import 'jspdf-autotable'
import { Typography } from '@mui/material'
import CategoryEditForm from './editCategoryForm'
import CustomergroupHeader from 'src/pages/apps/invoice/list/CustomergroupHeader'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import CategoryHeader from 'src/pages/apps/invoice/list/CategoryHeader'

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

const Category = () => {
  const [customergroupname, setCustomergroupname] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [editMode, setEditMode] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [allCountryName, setAllCountryName] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [categoryName, setCategoryName] = useState('')
  const [allCountry, setAllCountry] = useState([])
  const [showMessage, setShowMessage] = useState(false)
 // const [rowCount, setRowCount] = useState<number>(0)
  const [designation, setDesignation] = useState([])
  const rowCount = designation?.length;

  const calculateHeight = (rowCount: any, pageSize: any) => {
    const rowHeight = 59 // Default row height in Material-UI DataGrid
    const headerHeight = 59 // Default header height in Material-UI DataGrid
    const paginationHeight = 56 // Default pagination height in Material-UI DataGrid
   
    let visibleRows
    if (rowCount <= pageSize) {
      visibleRows = rowCount
    } else {
      visibleRows = pageSize
    }
   
    return headerHeight + paginationHeight + visibleRows * rowHeight
  }
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {

      // const apiEndpoint = 
      ApiClient.post(`/deletecategory?id=${selectedRowId}`) // Corrected line
      .then((res: any) => {
        toast.success('Deleted successfully');
        fetchData();
        setModalOpenDelete(false);
      })
      .catch((err: any) => {
      toast.error('Error deleting designation');
    })
  };
  
  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  const fetchData = async () => {
    try {
      
      const res = await ApiClient.post(`/getcategory`)
      const totalRowCount = res.data.data
     
      setTotalCount(totalRowCount)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))
      setDesignation(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, ])

  

  const handleEdit = (id: any) => {
    const selectedRow = designation.find((row: any) => row.id === id)
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

  const columns: GridColDef[] = [
    {
      field: 'Sl.no',
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'CategoryName',
      headerName: 'Category Name',
      flex: 0.3,
      renderCell: ({ row }: any) => 
        <Tooltip title={row.CategoryName}>
      <div>{row.CategoryName}</div>
      </Tooltip>
    },
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
      flex: 0.1,
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
                handleEdit(row.id)
              }}
            >
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDelete(row.id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]
  const applyFilters = async(activeStatus: any, categoryName: any,) => {
    try {
      let res: any;
      const queryParams: string[] = [];
      if (categoryName) {
        queryParams.push(`CategoryName=${categoryName}`);
      }
      if (activeStatus && activeStatus !== 'all') {
        const status = activeStatus === 'active' ? 1 : 0;
        queryParams.push(`Status=${status}`);
      }
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`;
        res = await ApiClient.post(`/getcategory${queryString}`);
      }
      const totalRowCount = res.data.data
     
      setTotalCount(totalRowCount)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))
      setDesignation(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  function resetFilters() {
    setActiveStatus('all')
    setCategoryName('')
    fetchData()
  }

  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Category - Apurva</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <CategoryHeader
                customergroupname={customergroupname}
                allCountry={allCountry}
                setAllCountryName={setAllCountryName}
                // printData={printData}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                onFetchData={fetchData}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
                resetFilters={resetFilters}
                applyFilters={applyFilters}
              />
              <DataGrid
                autoHeight
                pagination
                rows={designation}
                columns={columns}
               //loading={isTableLoading}
                rowCount={rowCount}
                getRowId={row => row.id}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
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
          <CategoryEditForm
            editid={selectedRowData?.id}
            employeegroupName={selectedRowData?.CategoryName}
            editStatus={selectedRowData?.Status}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
            customergroupname={customergroupname}
          />
        </CustomModal>
      )}
    </>
  )
}

export default Category
