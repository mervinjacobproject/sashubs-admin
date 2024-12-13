import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId, GridToolbar } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, CircularProgress } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomModal from 'src/pages/components/ReusableComponents/Modal/modal'
import Button from '@mui/material/Button'
import { toast } from 'react-hot-toast'
import { Typography } from '@mui/material'
import { GridExceljsProcessInput } from '@mui/x-data-grid-premium'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import PodTableHeader from 'src/pages/apps/invoice/list/podTableHeader'
import { styled } from '@mui/material/styles'
import { IconButtonProps } from '@mui/material/IconButton'
import Head from 'next/head'
import PrintUrl from 'src/commonExports/printUrl'
import AppSink from 'src/commonExports/AppSink'
import PodEditForm from './podEditform'
import PodViewTable from './podViewTable'

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit'
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit'
  } else {
    return '#fff'
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

const PODTab = () => {
  const [podName, setPodName] = useState<any>([])
  const [displaydesignation, setDisplaydesignation] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [value, setValue] = useState<any>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [editMode, setEditMode] = useState(false)
  const [showPodTable, setShowPodTable] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<any>(null)
  const [toEmail, setToEmail] = useState('')
  const [modalOpenDelete, setModalOpenDelete] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('')
  const handleModalOpenDelete = () => setModalOpenDelete(true)
  const handleModalCloseDelete = () => setModalOpenDelete(false)
  const [loading, setLoading] = useState(true)

  const handleView = (id: string) => {
    const selectedRow = podName.find((row: any) => row.id === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setShowPodTable(true)
    }
  }

  const handleDeleteConfirm = () => {
    const query = `mutation my {
      
      deletePODSettings5AAB(input: {UID: ${selectedRowId}}) {
        CreatedDate
        LastModified
        Order
        PODName
        Status
        UID
      }
    }
    `
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
        toast.error('Error deleting podName')
      })
  }
  const handleCancelDelete = () => {
    setModalOpenDelete(false)
  }

  const handleSendConfirm = async () => {
    const columns = [
      { header: 'S.No', dataKey: 'S.No' },
      { header: 'PodName', dataKey: 'podName' },
      { header: 'Order', dataKey: 'order' },
      { header: 'Status', dataKey: 'status' }
    ]
    const rows = podName.map((row: any) => ({
      'S.No': row['S.No'],
      podName: row.pod_name,
      order: row.order,
      status: row.status === 'Active' ? 'Active' : 'InActive'
    }))
    const pdf: any = new jsPDF()
    pdf.autoTable({ columns, body: rows })
    const pdfBlob = pdf.output('blob')
    const formData = new FormData()
    formData.append('file', pdfBlob, 'POD.pdf')
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
  const handleClosePodModal = () => {
    setShowPodTable(false)
    setSelectedRowData(null)
  }
  const fetchData = () => {
    const query = `query MyQuery {
      listPODSettings5AABS {
        totalCount
        items {
          CreatedDate
          LastModified
          Order
          PODName
          Status
          UID
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        const dataWithSerialNumber = res.data.data.listPODSettings5AABS.items.map((row: any, index: number) => ({
          ...row,
          S_No: index + 1
        }))
        setPodName(dataWithSerialNumber)
        setDisplaydesignation(dataWithSerialNumber)
      })
      .catch((err: any) => {
        console.error('Error fetching data:', err)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilter = (val: any) => {
    setValue(val)
    if (val.trim() === '') {
      fetchData()
    } else {
      const filteredDesignation = podName.filter((row: any) => {
        const statusValue = row.status == 'Active' ? 'Active' : 'InActive'
        const designationMatch = row.pod_name.toLowerCase().includes(val.toLowerCase())
        const orderMatch = typeof row.order === 'string' && row.order.toLowerCase().includes(val.toLowerCase())
        const statusMatch = statusValue.toLowerCase().substring(0, 3).includes(val.toLowerCase())
        return designationMatch || statusMatch || orderMatch
      })
      setPodName(filteredDesignation)
    }
  }

  const Filter = () => {
    const filteredDesignation = displaydesignation.filter((row: any) => {
      return row.status === 'Active'
    })
    setPodName(filteredDesignation)
  }
  const AllFilter = () => {
    setPodName(displaydesignation)
  }
  const InActiveFilter = () => {
    const filteredDesignation = displaydesignation.filter((row: any) => {
      return row.status === 'InActive'
    })
    setPodName(filteredDesignation)
  }

  const printData = async () => {
    try {
      const jsonData = JSON.stringify(
        podName.map((item: any) => ({
          PODName: item.PODName,
          Order: item.Order,
          Status: item.Status === 'Active' ? 'Active' : item.Status === 'Inactive' ? 'Inactive' : item.Status
        }))
      )

      const response = await fetch(`${PrintUrl}/POD/Get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })

      if (response.ok) {
        const data = await response.blob()
        const url = window.URL.createObjectURL(data)
        window.open(url, '_blank')
        setTimeout(() => {
          window.open(url, '_blank')
          window.URL.revokeObjectURL(url)
        }, 1000)
      } else {
        console.error('Error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCloseModal = () => {
    setEditMode(false)
    setSelectedRowData(null)
  }

  const handleEdit = (id: string) => {
    const selectedRow = podName.find((row: any) => row.UID === id)
    if (selectedRow) {
      setSelectedRowData(selectedRow)
      setEditMode(true)
    }
  }

  const handleDelete = (id: string) => {
    handleModalOpenDelete()
    setSelectedRowId(id)
  }
  const handleActiveButton = () => {
    Filter()
  }

  const handleInActiveButton = () => {
    InActiveFilter()
  }

  const handleAllButton = () => {
    AllFilter()
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
      sortable: false,
      filterable: false,
      headerName: 'ID',
      flex: 0.1,
      editable: false,
      renderCell: (params: any) =>
        params.api.getAllRowIds().indexOf(params.id) + 1 + paginationModel.page * paginationModel.pageSize
    },
    {
      field: 'PODName',
      flex: 0.1,
      headerName: 'POD Name',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{row.PODName}</Typography>
    },
    {
      field: 'Order',
      flex: 0.1,
      headerName: 'Order',
      renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{row.Order}</Typography>
    },
    {
      field: 'Status',
      flex: 0.1,
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
    },
    {
      field: 'actions',
      headerName: 'Actions',
      disableColumnMenu: true,
      filterable: false,
      flex: 0.1,
      sortable: false,
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary', cursor: 'pointer' }}
              onClick={() => handleView(row.UID)}
            >
              <Icon icon='raphael:view' />
            </IconButton>
          </Tooltip> */}
          <Tooltip title='Edit '>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary', cursor: 'pointer' }}
              onClick={() => handleEdit(row.UID)}
            >
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary', cursor: 'pointer' }}
              onClick={() => handleDelete(row.UID)}
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
          <title>Pod - 5aab</title>
          <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
        </Head>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <PodTableHeader
                setToEmail={setToEmail}
                toEmail={toEmail}
                value={value}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                handleFilter={handleFilter}
                printData={printData}
                onFetchData={fetchData}
                handleActiveButton={handleActiveButton}
                handleInActiveButton={handleInActiveButton}
                handleAllButton={handleAllButton}
                handleSendFile={handleSendConfirm}
                onRowSelectionModelChange={(rows: any) => setSelectedRows(rows)}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { excelOptions } }}
              />

              <DataGrid
                autoHeight
                pagination
                rows={podName}
                getRowId={row => row.UID}
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
      <CustomModal
        open={modalOpenDelete}
        onClose={handleModalCloseDelete}
        onOpen={handleModalOpenDelete}
        buttonText=''
        buttonOpenText=''
      >
        <p
          style={{
            color: getColor(),
            fontSize: '14px'
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
          buttonOpenText=''
          open={editMode}
          onClose={handleCloseModal}
          onOpen={() => setEditMode(true)}
          width={400}
        >
          <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleCloseModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <br></br>
          <PodEditForm
            onFetchData={fetchData}
            onCloseModal={handleCloseModal}
            editid={selectedRowData?.UID}
            designationName={selectedRowData?.pod_name}
            OrderName={selectedRowData?.order}
            editStatus={selectedRowData?.status}
          />
        </CustomModal>
      )}
      {showPodTable && (
        <CustomModal
          buttonText=''
          buttonOpenText=''
          open={showPodTable}
          onClose={handleClosePodModal}
          onOpen={() => setShowPodTable(true)}
          width={800}
        >
          <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <Typography style={{ color: getColor(), margin: '0px !important' }}>[esc]</Typography>
              <CustomCloseButton id='rightDrawerClose' color='inherit' onClick={handleClosePodModal}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
            </div>
          </div>
          <br></br>
          <PodViewTable
            editid={selectedRowData?.id}
            designationName={selectedRowData?.pod_name}
            OrderName={selectedRowData?.order}
            editStatus={selectedRowData?.status}
          />
        </CustomModal>
      )}
    </>
  )
}

export default PODTab
