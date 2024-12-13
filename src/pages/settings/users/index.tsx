import { useState, forwardRef, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import 'jspdf-autotable'
import Button from '@mui/material/Button'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import UsersHeader from 'src/pages/apps/invoice/list/usersHeader'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import Head from 'next/head'
import AppSink from 'src/commonExports/AppSink'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
  editStatus: any
  resetEditid: () => void
  editId: number
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

interface CellType {
  row: InvoiceType
}

const renderName = (row: any) => {
  if (row.ProfileImage && row.ProfileImage !== 'null') {
    return <CustomAvatar src={row.ProfileImage} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    const initials = `${row.FirstName.charAt(0).toUpperCase()}${row.LastName.charAt(0).toUpperCase()}`
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {initials}
      </CustomAvatar>
    )
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
    flex: 0.3,
    field: 'FirstName',
    headerName: 'Employee',
    renderCell: ({ row }: any) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gridTemplateColumns: '1fr 1fr',
            justifyItems: 'center'
          }}
        >
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={`${row.FirstName}${row.LastName}`}>
              <Typography>
                {`${row.FirstName.charAt(0).toUpperCase() + row.FirstName?.slice(1)}
               ${row.LastName}`}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.3,
    field: 'UserName',
    headerName: 'Email',
    renderCell: ({ row }: any) => (
      <Typography sx={{ color: 'text.secondary' }}>
        <Tooltip title={row.UserName}>{row.UserName}</Tooltip>
      </Typography>
    )
  },
  {
    field: 'Status',
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
          backgroundColor:
            row.Status === true ? '#dff7e9 !important' : row.Status === false ? '#f2f2f3 !important' : '',
          color: row.Status === true ? '#28c76f !important' : row.Status === false ? '#a8aaae !important' : '',
          fontWeight: '400',
          fontSize: row.Status === false ? '0.81em' : '0.81em'
        }}
      >
        {row.Status === true ? 'Active' : row.Status === false ? 'Inactive' : ''}
      </Button>
    )
  }
]

const PricingCatagories = () => {
  const [priceCategoryList, setPriceCategoryList] = useState([])
  const [editId, setEditId] = useState<any>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const [deleteId, setDeleteId] = useState()
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [firstNameID, setFirstNameID] = useState([])
  const [emailName, setEmailName] = useState('')
  const [fisrstName, setFirstname] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [showMessage, setShowMessage] = useState(false)

  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)

  const deleteItem = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteUsers5AAB(input: {ID:${selectedRowId}}) {
        Date
        FirstName
        ID
        LastName
        Password
        ProfileImage
        RoleId
        Status
        UserId
        UserName
        UserType
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchData()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const fetchUsersName = async () => {
    const query = ` 
    query MyQuery {
      listUsers5AABS {
        totalCount
        items {
          FirstName
          ID
          LastName
        }
      }
    }`

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setFirstNameID(res.data.data.listUsers5AABS.items)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsersName()
  }, [])

  const fetchData = async () => {
    let filterString = `{FirstName: {contains: ""}`
    if (activeStatus === 'active') {
      filterString += `, Status: {eq: true}`
    } else if (activeStatus === 'inactive') {
      filterString += `, Status: {eq: false}`
    } else if (activeStatus === 'all') {
      filterString += `,`
    }
    if (fisrstName) {
      filterString += `, ID: {eq: ${fisrstName}}`
    }
    if (emailName) {
      filterString += `, UserName: {contains: "${emailName}"}`
    }

    filterString += '}'
    const query = `
   query MyQuery {
      listUsers5AABS(filter:${filterString}) {
        totalCount
        items {
          Date
          FirstName
          ID
          LastName
          Password
          ProfileImage
          RoleId
          Status
          UserId
          UserName
          UserType
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        setPriceCategoryList(res.data.data.listUsers5AABS.items)
        setTotalCount(res.data.data.listUsers5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch(error => {
        setIsTableLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel, activeStatus, emailName, fisrstName])

  const resetEditid = () => {
    setEditId(null)
  }

  function editItem(ID: number) {
    setEditId(ID)
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
    ...defaultColumns,
    {
      flex: 0.1,
      sortable: false,
      field: 'actions',
      disableColumnMenu: true,
      filterable: false,
      headerName: 'Actions',
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                editItem(row.id)
                setDeleteId(row.id)
                const btn = document.getElementById('NewChargeBtn')
                if (btn) {
                  const btnElement = btn as HTMLElement
                  btnElement.click()
                }
              }}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                deleteItem(row.id), setShowMessage(false)
              }}
            >
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
          <title>Users Details - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <UsersHeader
                setEmailName={setEmailName}
                emailName={emailName}
                firstNameID={firstNameID}
                fetchData={fetchData}
                deleteId={deleteId}
                setFirstname={setFirstname}
                setActiveStatus={setActiveStatus}
                activeStatus={activeStatus}
                resetEditid={resetEditid}
                editId={editId}
                setShowMessage={setShowMessage}
                showMessage={showMessage}
              />

              <DataGrid
                autoHeight
                pagination
                rowHeight={62}
                rows={priceCategoryList}
                columns={columns}
                getRowId={(row: any) => row.ID}
                rowCount={totalCount}
                loading={isTableLoading}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={e =>
                  setPaginationModel({
                    ...e
                  })
                }
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

export default PricingCatagories
