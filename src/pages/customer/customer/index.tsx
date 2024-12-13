import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomerHeader from 'src/pages/apps/invoice/list/CustomerHeader'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import DrawerComponent from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawer'
import CustomerSteperform from 'src/pages/customer/customer/CustomerSteperform'
import 'jspdf-autotable'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import { Avatar } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'

const renderName = (row: any) => {
  if (row.Photo) {
    return <CustomAvatar src={row.Photo} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {`${row.FirstName.charAt(0).toUpperCase()}`}
      </CustomAvatar>
    )
  }
}



const Customer = () => {
  const [customer, setCustomer] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [pageSize, setPageSize] = useState<any>(10)
  const [selectedRowData] = useState<any | null>(null)
  const [toEmail, setToEmail] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [firstNameID, setFirstNameID] = useState([])
  const [allCustomerName, setAllCustomerName] = useState('')
  const [emailName, setEmailName] = useState('')
  const [fisrstName, setFirstname] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [showMessage, setShowMessage] = useState(false)

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    ApiClient.post(`/deletecustomer?id=${selectedRowId}`)
      .then((res: any) => {
        // console.log('Designation deleted successfully:', res)
        toast.success('Deleted successfully')
        setModalOpenDelete(false)
        fetchData()
      })
      .catch((err: any) => {
      //  console.error('Error deleting designation:', err)
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }
  const capitalizeName = (name: string): string => {
    if (!name) {
      return ''
    }
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getAvatarInitials = (name: string): string => {
    if (!name) {
      return ''
    }
    const words = name.split(' ')
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
  const lightColors = [
    '#FFCDD2',
    '#F8BBD0',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B3E5FC',
    '#B2EBF2',
    '#B2DFDB',
    '#C8E6C9',
    '#DCEDC8',
    '#F0F4C3',
    '#FFF9C4',
    '#FFECB3',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8',
    '#F5F5F5',
    '#CFD8DC'
  ]

  const getAvatarColor = (name: string): string => {
    if (!name) {
      return ''
    }
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return lightColors[hash % lightColors.length]
  }

  const fetchData = async () => {
    try {

     const res = await ApiClient.post(`/api.php?eventtype=lob_Getprofile`)
      const response = res.data
      //response.map((item: any) => {

    //   if (response[0].proimage != '') {
    //     //alert(base64_decode(json[0].proimage))
    //       setProfileimage(base64_decode(json[0].proimage));
    //   }
    //   // setCountryval(json);
    //   setProfilelist(json);
    // });
      setCustomer(response)
      setTotalCount(response.length)
    } catch (err) {
     // console.error('Error fetching data:', err)
    }
  }

 // console.log("customer", customer)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenDrawer = () => {
    setShowMessage(false)
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
  const defaultColumns: GridColDef[] = [
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
      field: 'name',
      headerName: 'Name',
      flex: 0.3,
      renderCell: ({ row }) => {
        const formattedName = capitalizeName(row.name)
        const avatarInitials = getAvatarInitials(row.name)
        const avatarColor = getAvatarColor(row.name)

        // Check if ProfileImage exists and starts with the specific URL
        const hasProfileImage = row.proimage

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasProfileImage ? (
              <Avatar
                src={row.img}
                alt={formattedName}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Avatar style={{ backgroundColor: avatarColor, color: 'black', marginRight: 8 }}>
                {avatarInitials}
              </Avatar>
            )}
            <div>{formattedName}</div>
          </div>
        )
      }
    },
    // {
    //   flex: 0.3,
    //   field: 'name',
    //   headerName: 'Customer Name',
    //   renderCell: ({ row }: any) =>
    //     <Tooltip title={` ${row.name}`}>

    //   <span>{row.name}</span>
    //   </Tooltip>

    // },
    {
      flex: 0.3,
      field: 'referrer',
      headerName: 'Referrer Name',
      renderCell: ({ row }: any) =>
        <Tooltip title={` ${row.referrer}`}>

      <span>{row.referrer}</span>
      </Tooltip>

    },



    {
      flex: 0.3,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => (
        <Tooltip title={` ${row.email}`}>
          <span>{row.email}</span>
        </Tooltip>
      )
    },

    {
      flex: 0.2,
      field: 'phonewhat',
      headerName: 'Mobile',
      sortable: false,
      renderCell: ({ row }) => (
        <Tooltip title={` ${row.phonewhat}`}>
          <span>{row.phonewhat}</span>
        </Tooltip>
      )
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
            fontSize: row.status == false ? '0.81em' : '0.81em'
          }}
        >
          {row.status == 1 ? 'Active' : row.status == 0 ? 'Inactive' : ''}
        </Button>
      )
    }
  ]
  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.2,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      filterable: false,
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DrawerComponent anchor='right' onOpen={handleOpenDrawer} buttonLabel='EDit'>
            <CustomerSteperform editid={row.id} fetchData={fetchData} customer={customer} editStatus={row.Status}/>
          </DrawerComponent>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                setShowMessage(false)
                handleDelete(row.id)
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]
  const applyFilters = async(activeStatus: any, allCustomerName: any,phoneCode: any, emailName: any) => {
    try {
      let res: any;
      const queryParams: string[] = [];
      if (allCustomerName) {
        queryParams.push(`CustomerName=${allCustomerName}`);
      }
      if (emailName) {
        queryParams.push(`Email=${emailName}`);
      }
      if (phoneCode) {
        queryParams.push(`Phone=${phoneCode}`);
      }
      if (activeStatus && activeStatus !== 'all') {
        const status = activeStatus === 'active' ? 1 : 0;
        queryParams.push(`Status=${status}`);
      }
      if (queryParams.length) {
        const queryString = `?${queryParams.join('&')}`;
        //https://api.apurvarewardz.com/getcustomer?CustomerName=n&Email=o&Phone=9&Status=1
        res = await ApiClient.post(`/getcustomer${queryString}`);
      }
      const response = res.data.data
      setCustomer(response)
      setTotalCount(response.length)
    } catch (err) {
     // console.error('Error fetching data:', err)
    }
  }
  function resetFilters() {
    setActiveStatus('all')
    setPhoneCode('')
    setAllCustomerName('')
    setEmailName('')
    fetchData()
  }

  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Customer - {themeConfig.templateName}</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <CustomerHeader
                customer={customer}
                fetchData={fetchData}
                editid={selectedRowData?.id}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                firstNameID={firstNameID}
                emailName={emailName}
                setAllCustomerName={setAllCustomerName}
                allCustomerName={allCustomerName}
                setEmailName={setEmailName}
                setFirstname={setFirstname}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                setPhoneCode={setPhoneCode}
                phoneCode={phoneCode}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
                resetFilters={resetFilters}
                applyFilters={applyFilters}
                // printData={printData}
              />
              <DataGrid
                autoHeight
                pagination
                getRowId={(row: any) => row.id}
                rows={customer}
                // loading={isTableLoading}
                columns={columns}
                rowCount={totalCount}
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
    </>
  )
}

export default Customer
