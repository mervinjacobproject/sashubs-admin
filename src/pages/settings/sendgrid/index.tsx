// ** React Imports
import { useState, forwardRef, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import format from 'date-fns/format'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, CircularProgress, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import SendGridHeader from 'src/pages/apps/invoice/list/SenGridTableHeader'
import Button from '@mui/material/Button'
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
  editId: number | null
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

const defaultColumns: GridColDef[] = [
  {
    field: 'S.No',
    headerName: 'S.No',
    flex: 0.1,
    renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${1}`}</Typography>
  },

  {
    flex: 0.2,
    field: 'Username',

    headerName: 'UserName',
    renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{row.Username}</Typography>
  },

  {
    field: 'Status',
    headerName: 'Status',
    flex: 0.3,
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

const SendGridTab = () => {
 

  const [value, setValue] = useState<string>('')
  const [priceCategoryList, setPriceCategoryList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rowData, setRowData] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [displayPricing, setDisplayPricing] = useState([])
  const [rowId, setRowId] = useState('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilter = (val: any) => {
    setValue(val)

    if (val.trim() === '') {
      fetchData()
    } else {
      const filteredDesignation = priceCategoryList.filter((row: any) => {
        const statusValue = row.status == 1 ? 'Active' : 'Inactive'
        const titleMatch = row.username.toLowerCase().includes(val.toLowerCase())
        const statusMatch = statusValue.toLowerCase().substring(0, 3).includes(val.toLowerCase())

        return titleMatch || statusMatch
      })

      setPriceCategoryList(filteredDesignation)
    }
  }

  function fetchData() {
    const query = `query MyQuery {
      listSendGrid5AABS {
        totalCount
        items {
          APIKey
          IP
          Password
          SAddress
          SEmail
          SGID
          Status
          Username
        }
      }
    }
    `
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', 
      'Content-Type': 'application/json'
    }

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then(res => {
        setPriceCategoryList(res.data.data.listSendGrid5AABS.items)
        setTotalCount(res.data.data.listSendGrid5AABS.items.length)
        setIsTableLoading(false)
      })
      .catch(err => {
        console.error(err);
      })
  }

  const resetEditid = () => {
    setEditId(null)
  }

  function editItem(id: number) {
    setEditId(id)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton
              size='small'
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                editItem(row)
                setRowId(row.id)
                setRowData(row)
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
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Head>
        <title>Send Grid - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Card>
            <SendGridHeader
              fetchData={fetchData}
              rowData={rowData}
              rowId={rowId}
              editStatus={selectedRowData?.status}
              resetEditid={resetEditid}
              editId={editId}
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
            />
              <DataGrid
                autoHeight
                pagination
                rowHeight={62}
                rows={priceCategoryList}
                columns={columns}
                getRowId={row => row.SGID}
                rowCount={totalCount}
                loading={isTableLoading}
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
  )
}

export default SendGridTab
