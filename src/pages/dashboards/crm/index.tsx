import Grid from '@mui/material/Grid'
import dynamic from 'next/dynamic'
import CrmLastTransaction from 'src/views/dashboards/crm/CrmLastTransaction'
import { useSettings } from 'src/@core/hooks/useSettings'
import EcommerceOrders from 'src/views/dashboards/ecommerce/EcommerceOrders'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'

const RechartsLineChart = dynamic(() => import('src/views/charts/recharts/RechartsLineChart'), { ssr: false })

const CrmDashboard = () => {
  const { settings } = useSettings()

  return (
    <Grid container spacing={6} sx={{ display: 'flex', marginTop: '20px', paddingLeft: '26px' }}>
      <Grid item xs={12} md={6} lg={6}>
        <CrmLastTransaction />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <ApexDonutChart />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <EcommerceOrders />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <RechartsLineChart direction={settings.direction} />
      </Grid>
    </Grid>
  )
}

export default CrmDashboard
