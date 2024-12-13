// ** React Imports
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import PayRollTable from './payRollTable'

const PayCalculations = () => {
  const router = useRouter()
  const { id } = router.query
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [payId, setPayId] = useState([])
  const [allEmployee, setAllEmployee] = useState<any>([])

  const fetchEmp = async () => {
    const query = `
    query MyQuery {
      listDriver5AABS(filter: {DID: {eq: ${id}}}) {
        items {
          DID
          Email
          FirstName
          LastName
          Mobile
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
    if (id) {
      fetchEmp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pb: 4 }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Employee Details
            </Typography>
            <Divider sx={{ my: '0 !important' }} />
            <Box sx={{ pt: 4 }}>
              <div>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Employee Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {allEmployee[0]?.FirstName &&
                      allEmployee[0]?.LastName &&
                      `${allEmployee[0]?.FirstName} ${allEmployee[0]?.LastName}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Phone:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {(allEmployee as { Mobile: string }[])[0]?.Mobile}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {(allEmployee as { Email: any }[])[0]?.Email}
                  </Typography>
                </Box>
              </div>
            </Box>
          </CardContent>
          <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
        </Card>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card sx={{ p: 4 }}>
          <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
            Employee Details
          </Typography>
          <Divider sx={{ my: '0 !important' }} />
          <PayRollTable payId={payId} id={id} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default PayCalculations
