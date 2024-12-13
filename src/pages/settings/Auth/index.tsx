// ** React Imports
import { useState, forwardRef, useEffect } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, CircularProgress, Typography } from '@mui/material'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import { GridExceljsProcessInput } from '@mui/x-data-grid-premium'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import AuthHeader from 'src/pages/apps/invoice/list/AuthHeader'

import Head from 'next/head'
import AppSink from 'src/commonExports/AppSink'
import EditRole from './editRole'



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
    field: 'RoleName',
    flex: 0.3,
    minWidth: 320,
    headerName: 'Title',
    renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>
      {row.RoleName?.charAt(0).toUpperCase() + row.RoleName?.slice(1)}
    </Typography>
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.4,
    renderCell: ({ row }: any) => {
      return (
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
  }
]

const AuthTable = () => {
  const [value, setValue] = useState<string>('')
  const [additionalcharge] = useState<any>('')
  const [displayadditional, setDisplayadditional] = useState([])
  const [chargeList, setChargeList] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [editId, setEditId] = useState<number | null>(null)
  const [toEmail, setToEmail] = useState('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  const deletItem = (id: string) => {

    handleModalOpenDelete()
    setSelectedRowId(id)
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      deleteUserRoles5AAB(input: {ID: ${selectedRowId}}) {
        ID
        RoleName
        Status
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        toast.success('Deleted successfully')
        fetchData()
        setModalOpenDelete(false)
      })
      .catch((err: any) => {
        console.error('Error deleting designation:', err)
        toast.error('Error deleting designation')
      })
  }

  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const handleFilter = (val: any) => {
    setValue(val)
    if (val.trim() === '') {
      fetchData()
    } else {
      const filteredDesignation = chargeList.filter((row: any) => {
        const statusValue = row.status == 'Active' ? 'Active' : 'InActive'
        const designationMatch = row.name.toLowerCase().includes(val.toLowerCase())
        const descriptionMatch = row.description.toLowerCase().includes(val.toLowerCase())
        const chargeMatch = row.charge.toLowerCase().includes(val.toLowerCase())
        const statusMatch = statusValue.toLowerCase().substring(0, 3).includes(val.toLowerCase())
        return designationMatch || statusMatch || descriptionMatch || chargeMatch
      })
      setChargeList(filteredDesignation)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const handleEmail = (e: any) => {
    setToEmail(e.target.value)
  }

  function fetchData() {

    const query = `query MyQuery {
      listUserRoles5AABS {
        totalCount
        items {
          ID
          RoleName
          Status
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        setChargeList(res.data.data.listUserRoles5AABS.items)
        setTotalCount(res.data.data.listUserRoles5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch(err => {
        setIsTableLoading(false)
        console.error('something went wrong', err)
      })
  }

  const handleCompletedBulkDelete = async () => {
    try {
      const idsToDelete = selectedRows.join(',');
      const res = await ApiClient.delete(`/api.php?moduletype=userroles&apitype=delete&id=${idsToDelete}`);
      setSelectedRows([]);
      fetchData();
      toast.success(res.data[0]?.status);
    } catch (error) {
      toast.error('Error during bulk delete');
    }
  };

  const handleSendConfirm = async () => {
    const columns = [
      { header: 'S.No', dataKey: 'S_No' },
      { header: 'Title', dataKey: 'name' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Additional Charges', dataKey: 'charge' },
      { header: 'Status', dataKey: 'status' }
    ]

    const rows = chargeList.map((row: any) => ({
      S_No: row['S_No'],
      name: row.name,
      description: row.description,
      charge: row.charge,
      status: row.status === 'Active' ? 'Active' : 'InActive'
    }))

    const pdf: any = new jsPDF()
    pdf.autoTable({ columns, body: rows })
    const pdfBlob = pdf.output('blob')
    const formData = new FormData()
    formData.append('file', pdfBlob, 'employee_designations.pdf')
    const apiUrl = `https://api.5aabtransport.com.au/api.php?moduletype=send_file&email=${encodeURIComponent(toEmail)}`

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      })
      toast.success('Mail sent Successfully')
      setToEmail('')
    } catch (error) {
      // console.error('Error:', error)
    }
  }

  const printData = () => {
    const tableHeader =
      '<tr style="text-align: center;"><th>S.No</th><th>Tittle</th><th>Description</th><th>Additional Charges</th><th>Status</th></tr>'
    const tableRows = chargeList
      .map((row: any, index) => {
        const statusClass = row.status == 'Active' ? 'Active' : 'InActive'

        return `<tr><td style="text-align: center;">${index + 1}</td><td style="text-align: center;">${row.name}</td>
        
        <td style="text-align: center;">${row.description}</td>
        <td style="text-align: center;">${row.charge}</td>
        <td  style="text-align: center;" class="${statusClass}">${row.status == 'Active' ? 'Active' : 'InActive'}</td></tr>`
      })
      .join('')
    const printableData = `
        <style>
            .custom-table {
                border-collapse: collapse;
                width: 50%;
                margin: auto;
            }
            .custom-table, th, td {
                border: 1px solid black;
            }
        </style>
        <table class="custom-table">${tableHeader}${tableRows}</table>
    `
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.write(`
            <html>
                <head>
                    <title>Printable Data</title>
                </head>
                <body>
                    ${printableData}
                </body>
            </html>
        `)
      printWindow.document.close()
      printWindow.print()
    } else {
      console.error('Unable to open a new window. Please check your popup blocker settings.')
    }
  }

  const Filter = () => {
    const filteredDesignation = displayadditional.filter((row: any) => {
      return row.status === 'Active'
    })

    setChargeList(filteredDesignation)
  }

  const AllFilter = () => {
    setChargeList(displayadditional)
  }

  const InActiveFilter = () => {
    const filteredDesignation = displayadditional.filter((row: any) => {
      return row.status === 'InActive'
    })
    setChargeList(filteredDesignation)
  }

  const exceljsPreProcess = ({ workbook, worksheet }: GridExceljsProcessInput) => {
    workbook.creator = 'MUI-X team'
    workbook.created = new Date()
    worksheet.properties.defaultRowHeight = 30
    worksheet.mergeCells('A1:C2')
    worksheet.getCell('A1').value =
      'This is an helping document for the MUI-X team.\nPlease refer to the doc for up to date data.'
    worksheet.getCell('A1').border = {
      bottom: { style: 'medium', color: { argb: 'FF007FFF' } }
    }
    worksheet.getCell('A1').font = {
      name: 'Arial Black',
      size: 14
    }
    worksheet.getCell('A1').alignment = {
      vertical: 'top',
      horizontal: 'center',
      wrapText: true
    }
    worksheet.addRow([])
  }
  const exceljsPostProcess = ({ worksheet }: GridExceljsProcessInput) => {
    worksheet.addRow({})
    worksheet.addRow(['Those data are for internal use only'])
  }

  const excelOptions = { exceljsPreProcess, exceljsPostProcess }
  const handleActiveButton = () => {
    Filter()
  }

  const handleInActiveButton = () => {
    InActiveFilter()
  }

  const handleAllButton = () => {
    AllFilter()
  }

  function editItem(id: number) {
    setEditId(id)
  }

  const resetEditid = (val: string) => {
    setEditId(null)
  }

  const handleEdit = (id: string) => {

    const selectedRow = chargeList.find((row: any) => row.ID === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }

  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 140,
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
              onClick={() => handleEdit(row.id)}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => deletItem(row.id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          <CustomModal
            open={modalOpenDelete}
            onClose={handleModalCloseDelete}
            onOpen={handleModalOpenDelete}
            buttonText=''
            buttonOpenText=''
          >
            <Typography sx={{ color: getColor() }}>Are you sure you want to delete?</Typography>
            <div
              className='delete-popup'
              style={{ padding: '4px', display: 'flex', justifyContent: 'end', gap: '4px' }}
            >
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
        </Box>
      )
    }
  ]
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

  return (
    <>
      <DatePickerWrapper>
        <Head>
          <title>Role Permission - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <AuthHeader
                handleActiveButton={handleActiveButton}
                handleInActiveButton={handleInActiveButton}
                handleAllButton={handleAllButton}
                bulkDelete={handleCompletedBulkDelete}
                toEmail={toEmail}
                handleSendFile={handleSendConfirm}
                setToEmail={setToEmail}
                printData={printData}
                fetchData={fetchData}
                editItem={editItem}
                editStatus={selectedRowData?.status}
                resetEditid={resetEditid}
                setEditId={setEditId}
                editId={editId}
                value={value}
                selectedRows={selectedRows}
                handleFilter={handleFilter}
              />
              <DataGrid
                autoHeight
                pagination
                rowHeight={62}
                rows={chargeList}
                getRowId={row => row.ID}
                loading={isTableLoading}
                rowCount={totalCount}
                columns={columns}
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
      {editMode && (
        <CustomModal
          buttonText=''
          buttonOpenText=''
          open={editMode}
          onClose={handleCloseModal}
          onOpen={() => setEditMode(true)}
          width={400}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <Typography style={{ color: getColor() }}>[esc]</Typography>

              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <EditRole
            editid={selectedRowData?.ID}
            designationName={selectedRowData?.rolename}
            editStatus={selectedRowData?.status}
            onCloseModal={handleCloseModal}
            onFetchData={fetchData}
          />
        </CustomModal>
      )}
    </>
  )
}

export default AuthTable
