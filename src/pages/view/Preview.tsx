// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { SingleInvoiceType, InvoiceLayoutProps } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'
import PreviewActions from 'src/views/apps/invoice/preview/PreviewActions'
import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
import SendInvoiceDrawer from 'src/views/apps/invoice/shared-drawer/SendInvoiceDrawer'
import { DataGrid } from '@mui/x-data-grid'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

const InvoicePreview = ({ id }: InvoiceLayoutProps) => {
  // ** State
  const [error, setError] = useState<any>(false)
  const [data, setData] = useState<any>(null)
  const [order, setorder] = useState([])
  const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)
  const [oredrMaster, setordermaster] = useState([])
const [OrderData, setOrderData] = useState<any>(null)
  useEffect(() => {
    // alert(id)
    if (id) {
    fetchData()
    //fetchorder()
    }
  }, [id])
  
const fetchData = async () => {

  try {
    //let res: any;
    
    const res = await ApiClient.post(`/ordergetall?ID=${id}`);
    const response = res.data.data;
    response.map((row: any) => {
      setData(row)
      // setError(false)
    });
    // const dataWithSerialNumber = response.map((row: any, index: number) => ({
    //   ...row,
      
    // }));
    // setData(dataWithSerialNumber)
  } catch (err) {
  //  console.error('Error fetching data:', err);
  }
}
  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  if (data) {
    return (
      <>
        <Grid container>
          <Grid item sx={{ width: '720px', marginRight: '15px' }}>
            <PreviewCard data={data} />
          </Grid>
          <Grid item sx={{ width: 'calc(100% - 750px)' }}>
            <PreviewActions
              id={id}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
              data={data}
              //orderVal={order}
            />
          </Grid>
        </Grid>
        <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} data={data}/>
        {/* <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
      </>
    )
  } else if (!data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Invoice with the id: {id} does not exist. Please check the list of invoices:{' '}
            <Link href='/apps/invoice/list'>Invoice List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
