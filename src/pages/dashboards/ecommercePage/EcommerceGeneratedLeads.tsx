import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

const EcommerceGeneratedLeads = ({seoScoreData}:any) => {
  const [series, setSeries] = useState<number[]>([]) // Ensure the series array is of type number[]
  const theme = useTheme()

  const options: ApexOptions = {
    colors: [
      theme.palette.success.main,
      hexToRGBA(theme.palette.success.main, 0.7),
      hexToRGBA(theme.palette.success.main, 0.5),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { enabled: true },
    dataLabels: { enabled: false },
    labels: ['Paid Subscriptions', 'Not Paid Subscriptions', 'Other', 'Miscellaneous'], // Adjust labels accordingly
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -22,
        bottom: -18
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        expandOnClick: false,
        donut: {
          size: '73%',
          labels: {
            show: true,
            name: {
              offsetY: 22,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: -17,
              fontWeight: 500,
              formatter: val => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize as string
            },
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize as string
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { width: 200, height: 249 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { width: 150, height: 199 }
        }
      }
    ]
  }
const [totalCount, setTotalCount] = useState<number>(0)
  const fetchProductName = async () => {
    try {
      const res = await ApiClient.post(`/Monthlysubscriptioncount?FromDate=2024-09-26&ToDate=2024-10-18`)
      const response = res.data
const totalCount = response.PaidsubscritiponsMerchantCount + response.NotPaidsubscritiponsMerchantCount;
setTotalCount(totalCount);
      // Adjust values according to your API response structure
      const newSeries = [
        response.PaidsubscritiponsMerchantCount || 0,  // Use 0 as fallback if undefined
        response.NotPaidsubscritiponsMerchantCount || 0, // Use 0 as fallback if undefined
        0, // Placeholder for additional data if needed
       0  // Placeholder for additional data if needed
      ]
      setSeries(newSeries)
    } catch (err) {
      toast.error('Error fetching data:')
      console.error(err)
    }
  }

  useEffect(() => {
    if(!series.length){
    // fetchProductName()
    }
  }, [series])

  // Render the chart only if series data is available
  return (
    <Card>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h5' sx={{ mb: 0.5 }}>
                Total Percentage
              </Typography>
              {/* <Typography variant='body2'>Yearly Report</Typography> */}
            </div>
            <div>
              <Typography variant='h3'>{seoScoreData?.score?.score_percentage || 0} %</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'success.main' } }}>
                <Icon icon='tabler:chevron-up' fontSize='1.25rem' />
                <Typography variant='h6' sx={{ color: 'success.main' }}>
                {seoScoreData?.score?.total_tests || 0}  Total Count
                </Typography>
              </Box>
            </div>
          </Box>
          {series.length > 0 && <ReactApexcharts type='donut' width={150} height={165} series={series} options={options} />}
        </Box>
      </CardContent>
    </Card>
  )
}

export default EcommerceGeneratedLeads
