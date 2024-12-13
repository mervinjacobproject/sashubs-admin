import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomerHeader from 'src/pages/apps/invoice/list/CustomerHeader'
import Link from 'next/link'
import { CircularProgress, Tooltip, Typography } from '@mui/material'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import PayCalculationHeader from 'src/pages/apps/invoice/list/payCalculationHeader'
import Head from 'next/head'
import axios from 'axios'
import AppSink from 'src/commonExports/AppSink'
import PayCalculations from './[id]/payCalculationsView'

interface CellType {
  row: any
}

const PayCalculation: React.FC = () => {
  const [value, setValue] = useState<any>('')
  const [employee, setEmployee] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const store = useSelector((state: RootState) => state.invoice)
  const [currentPageSize, setCurrentPageSize] = useState<any>(10)
  const [totalCount, setTotalCount] = useState(0)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [rideData, setRideData] = useState([])
  const [loading, setLoading] = useState(true)
  const [allEmployee, setAllEmployee] = useState([])
  const [allEmpId, setAllEmpId] = useState('')

  const fetchEmp = async () => {
    const query = `query MyQuery {
      listDriver5AABS(filter: {Status: {eq: true}}) {
        items {
          DID
          DriverID
          FirstName
          LastName
          Photo
        }
      }
    }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    try {
      const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setAllEmployee(res.data.data.listDriver5AABS.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchEmp()
  }, [])

  const fetchData = async () => {
    try {
      let filterString = `{DriverID: {contains: ""}`

      if (allEmpId) {
        filterString += `, DID: {eq: ${allEmpId}}`
      }

      filterString += '}'

      const query = `       
        query MyQuery {
          listDriver5AABS(filter: ${filterString}) {
            items {
              DID
              DriverID
              FirstName
              LastName
              Photo
            }
          }
        }`

      const headers = {
        'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
        'Content-Type': 'application/json'
      }

      const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
      setRideData(response.data.data.listDriver5AABS.items)
      setTotalCount(response.data.data.listDriver5AABS.items.length)
      setIsTableLoading(false)
    } catch (error) {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEmpId])

  const defaultColumns: GridColDef[] = [
    {
      field: 'Sl.no',
      minWidth: 50,
      headerName: 'S.No',
      flex: 0.2,
      editable: false,
      filterable: false,
      sortable: false,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      flex: 0.3,
      field: 'Employee',
      minWidth: 100,
      headerName: 'Employee',
      valueGetter: params => {
        const { FirstName, LastName } = params.row
        return `${FirstName} ${LastName}`
      }
    }
  ]

  const handleFocus = () => {
    fetchData()
    setPaginationModel({ page: 0, pageSize: 10 })
  }

  const handleFilter = (val: any) => {
    setValue(val)
    if (val.trim() === '') {
      setPaginationModel({ page: 0, pageSize: 10 })
      fetchData()
    } else {
      const filteredDesignation = employee.filter((row: any) => {
        const fullName = `${row.firstname} ${row.lastname}`.toLowerCase()
        const designationMatch = fullName.includes(val.toLowerCase())
        return designationMatch
      })
      setEmployee(filteredDesignation)
    }
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title='View'>
            <Link href={`/transactions/paycalculation/details?id=${row.DID}`}>
              <IconButton sx={{ color: '#8e8c96' }}>
                <Icon icon='raphael:view' width={20} height={20} />
              </IconButton>
            </Link>
          </Tooltip>
        </>
      )
    }
  ]

  return (
    <>
      <Head>
        <title>Pay Calculation - 5aab</title>
        <meta name='our-blogs' content='GPS-Vizhil' key='desc' />
      </Head>
      <DatePickerWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Card>
              <PayCalculationHeader value={value} handleFilter={handleFilter} handleFocus={handleFocus} setAllEmpId={setAllEmpId} allEmployee={allEmployee}/>
              <DataGrid
                autoHeight
                pagination
                getRowId={(row: any) => row.DID}
                loading={isTableLoading}
                rowHeight={62}
                rows={rideData}
                rowCount={totalCount}
                columns={columns}
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
    </>
  )
}

export default PayCalculation
