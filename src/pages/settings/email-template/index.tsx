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
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box, CircularProgress, Typography } from '@mui/material'
import PricingCatagoriesHeader from 'src/pages/apps/invoice/list/PricingCatagoriesHeader'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { toast } from 'react-hot-toast'
import SendGridHeader from 'src/pages/apps/invoice/list/SenGridTableHeader'
import BillSettingHeader from 'src/pages/apps/invoice/list/BillSettingTableHeader'
import EmailTemplateHeader from 'src/pages/apps/invoice/list/EmailTemplateHeader'
import EmailTemplateForm from './editEmailTemplate'
import RightDrawerEmailCatageory from 'src/pages/components/ReusableComponents/rightDrawer/rightDrawerEmail'

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
interface CellType {
  row: InvoiceType
}

// const LinkStyled = styled(Link)(({ theme }) => ({
//   textDecoration: 'none',
//   fontSize: theme.typography.body1.fontSize,
//   color: `${theme.palette.primary.main} !important`
// }))
const defaultColumns: GridColDef[] = [
  {
    field: 'S.No',
    headerName: 'S.No',
    flex: 0.1,
    renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{`${row.S_No}`}</Typography>
  },
  {
    flex: 0.1,
    field: 'Subject',
    headerName: 'Subject',
    renderCell: ({ row }: any) => <Typography sx={{ color: 'text.secondary' }}>{row.Subject}</Typography>
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */
const EmailTemplate = () => {
  // ** State
  // const [dates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [priceCategoryList, setPriceCategoryList] = useState([])

  // const [statusValue] = useState<string>('')
  // const [pricecatageory] = useState<any>('')
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null)
  const [displayPricing, setDisplayPricing] = useState([])
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState(true)
  const [rowId, setRowId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilter = (val: any) => {
    setValue(val)

    if (val.trim() === '') {
      fetchData()
    } else {
      const filteredDesignation = priceCategoryList.filter((row: any) => {
        const titleMatch = row.subject.toLowerCase().includes(val.toLowerCase())

        return titleMatch
      })

      setPriceCategoryList(filteredDesignation)
    }
  }

  function fetchData() {
    const query = `query MyQuery {
      listEmailTemplate5AABS {
        totalCount
        items {
          Description
          EId
          Order
          Status
          Subject
          IP
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
        const dataWithSerialNumber = res.data.data.listEmailTemplate5AABS.items.map((row: any, index: number) => ({
          ...row,
          S_No: index + 1
        }))
        setPriceCategoryList(dataWithSerialNumber)
        setDisplayPricing(dataWithSerialNumber)
      })
      .catch(err => {
        console.error("something went wrong", err);
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
      flex: 0,
      minWidth: 140,
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
                editItem(row.id)
                setRowId(row.id)
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
        <title>Email Template - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <Grid container spacing={6}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <Card>
            <EmailTemplateHeader
              fetchData={fetchData}
              editStatus={selectedRowData?.status}
              resetEditid={resetEditid}
              editId={editId}
              rowId={rowId}
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
            />
            <DataGrid
              autoHeight
              pagination
              rowHeight={62}
              getRowId={row => row.EId || ''}
              rows={priceCategoryList.filter((row: any) => row.id !== '')}
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
  )
}
export default EmailTemplate
