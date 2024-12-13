import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { AuthContext } from 'src/context/AuthContext'
import EcommerceRevenueReport from '../ecommercePage/EcommerceRevenueReport'
import SeoPerformance from '../ecommercePage/SeoPerformance'

const EcommerceDashboard = () => {
  const { seoScoreData }: any = useContext(AuthContext)
  const router = useRouter()

  const handleRouter = (data: any) => {
    router.push(`${data}`)
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={3}>
          <EcommerceRevenueReport />
        </Grid>
        <Grid item xs={12} md={7} lg={9}>
          <Grid container spacing={6}>
            <Grid
              className='cursor_pointer'
              onClick={() => handleRouter('/tech-seo/dashboard/')}
              item
              xs={6}
              md={3}
              lg={4}
              xl={4}
            >
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['SEO Performance']?.percentage,
                  score: seoScoreData?.Details?.['SEO Performance']?.score,
                  total_tests: 30,
                  label: 'SEO Performance'
                }}
              />
            </Grid>
            <Grid item xs={6} md={3} lg={4} xl={4}>
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['Content Quality']?.percentage,
                  score: seoScoreData?.Details?.['Content Quality']?.score,
                  total_tests: 20,
                  label: 'Content Quality'
                }}
              />
            </Grid>
            <Grid item xs={6} md={3} lg={4} xl={4}>
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['User Experience']?.percentage,
                  score: seoScoreData?.Details?.['User Experience']?.score,
                  total_tests: 20,
                  label: 'User Experience'
                }}
              />
            </Grid>
            <Grid item xs={6} md={3} lg={4} xl={4}>
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['Site Performance']?.percentage,
                  score: seoScoreData?.Details?.['Site Performance']?.score,
                  total_tests: 15,
                  label: 'Site Performance'
                }}
              />
            </Grid>
            <Grid item xs={6} md={3} lg={4} xl={4}>
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['Brand Presence and Trust']?.percentage,
                  score: seoScoreData?.Details?.['Brand Presence and Trust']?.score,
                  total_tests: 10,
                  label: 'Brand Presence and Trust'
                }}
              />
            </Grid>
            <Grid item xs={6} md={3} lg={4} xl={4}>
              <SeoPerformance
                seoScoreData={{
                  percentage: seoScoreData?.Details?.['Analytics and Data Tracking']?.percentage,
                  score: seoScoreData?.Details?.['Analytics and Data Tracking']?.score,
                  total_tests: 5,
                  label: 'Analytics and Data Tracking'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default EcommerceDashboard
