// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useContext, useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'

const SitePerformance = ({ seoScoreData }: any) => {
  const [customerlist, setCustomerList] = useState<any>({ balancepoints: 42, usedPoints: 21, TotalPoints: 42 })
  const { getColorByPercentage }: any = useContext(AuthContext)

  useEffect(() => {
    if (!customerlist?.usedPoints && !customerlist?.TotalPoints) {
      // fetchCustomerData()
    }
  }, [customerlist])

  const fetchCustomerData = async () => {
    try {
      const res = await ApiClient.post(`/calcpointstransaction`)
      const response = res.data
      setCustomerList(response)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }

  const validatedPercentage = () => {
    // const percentage = Math.floor((seoScoreData?.score?.fail_count  / seoScoreData?.score?.total_tests ) * 100)
    const percentage = seoScoreData?.percentage
    return percentage >= 0 && percentage <= 100 ? percentage : 0
  }

  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
      width: '100%',  // Adjust width here
    },
    stroke: { lineCap: 'round' },
    colors: [getColorByPercentage(validatedPercentage())],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 90,
        startAngle: -90,
        hollow: { size: '64%' },
        track: {
          strokeWidth: '40%',
          background: hexToRGBA(theme.palette.customColors.trackBg, 1)
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -3,
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h4.fontSize as string
          }
        }
      }
    },
    grid: {
      padding: {
        bottom: 15
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 199, width: '80%' }  // Adjust for larger screens
        }
      },
      {
        breakpoint: 430,
        options: {
          chart: { height: 150, width: '90%' }  // Adjust for smaller screens
        }
      }
    ]
  }
  const isDataAvailable = seoScoreData?.score != undefined

  return (
    <Card>
      <CardContent style={{ textAlign: 'center' }} className='score-card'>
        <Typography variant='h6'>Site Performance</Typography>
        <ReactApexcharts type='radialBar' height={149} series={[validatedPercentage()]} options={options} />
        <Typography variant='body2' sx={{ textAlign: 'center', color: 'text.disabled' }}>
          {/* {seoScoreData?.score || 0} out of {seoScoreData?.score?.total_tests || 15} */}
          {isDataAvailable
            ? `${seoScoreData?.score || 0} out of ${seoScoreData?.score?.total_tests || 15}`
            : 'Analyzing...'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SitePerformance
