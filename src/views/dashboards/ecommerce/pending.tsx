import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import CustomChip from 'src/@core/components/mui/chip'
import { Tooltip } from '@mui/material'
import AppSink from 'src/commonExports/AppSink'

const WaitingJob = () => {
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rideData, setRideData] = useState([])

  const fetchData = async () => {
    try {
      const query = `query MyQuery {
        listJobsNew5AABS(filter: {Status: {eq: 1},Deleted: {ne: true}}) {
          items {
            ID
            JobId
            Customer
            CreatedDate
            PickupDate
          }
        }
      }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setRideData(res.data.data.listJobsNew5AABS.items)
      setTotalCount(res.data.data.listJobsNew5AABS.items.length)
      setIsTableLoading(false)
    } catch (err) {
      setIsTableLoading(false)
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'Sl.no',
      minWidth: 50,
      headerName: 'S.No',
      flex: 0.1,
      editable: false,
      filterable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.3,
      field: 'JobId',
      headerName: 'Job Id',
    
    },
    {
      flex: 0.3,
      field: 'Customer',
      headerName: 'Customer',
   
    },
    {
      flex: 0.3,
      minWidth: 150,
      field: 'CreatedDate',
      headerName: 'Created Date',
    
    },
    {
      flex: 0.3,
      field: 'PickupDate',
      headerName: 'Date',
      renderCell: ({ row }) => (
        <Tooltip title={` ${row.PickupDate}`}>
          <span>{row.PickupDate}</span>
        </Tooltip>
      )
    }
  ]

  return (
    <>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <DataGrid
                autoHeight
                pagination
                rows={rideData}
                loading={isTableLoading}
                columns={columns}
                rowCount={totalCount}
                getRowId={row => row.ID || ''}
                disableRowSelectionOnClick
                pageSizeOptions={[10]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
              />
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  )
}
export default WaitingJob
