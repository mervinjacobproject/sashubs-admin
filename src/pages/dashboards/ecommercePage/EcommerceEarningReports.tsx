// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Type Import
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Hook Import
import UseBgColor from 'src/@core/hooks/useBgColor'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface DataType {
  OwnerName: string
  PurchaseAmount: string
  ShopName: string
  avatarIcon: string
  trendNumber: number
  avatarColor: ThemeColor
  trend?: 'positive' | 'negative'
}



const EcommerceEarningReports = () => {
  // ** Hooks
  const theme = useTheme()
  const bgColors = UseBgColor()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '52%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      bgColors.primaryLight.backgroundColor,
      bgColors.primaryLight.backgroundColor,
      bgColors.primaryLight.backgroundColor,
      bgColors.primaryLight.backgroundColor,
      hexToRGBA(theme.palette.primary.main, 1),
      bgColors.primaryLight.backgroundColor,
      bgColors.primaryLight.backgroundColor
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: { show: false },
    grid: {
      show: false,
      padding: {
        left: -14,
        right: -16,
        bottom: -14
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          chart: { height: 260 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 213 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '40%' }
          }
        }
      }
    ]
  }

  const [allMerchant, setAllMerchant] = useState([])

  const fetchMerchantName = async () => {
    try {
      const res = await ApiClient.post(`/gettopmerchant`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setAllMerchant(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }


  useEffect(() => {
    // fetchMerchantName()

  }, [])

  return (
    <Card>
      <CardHeader
        title='Merchant Reports'
        subheader='Top Five Merchants'
        action={
          <OptionsMenu
            options={['Refresh', 'Update', 'Share']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
      {allMerchant.slice(0, 5).map((item: DataType, index: number) => (
  <Box
    key={item.OwnerName}
    sx={{
      display: 'flex',
      '& img': { mr: 4 },
      alignItems: 'center',
      mb: index !== allMerchant.length - 1 ? 4 : undefined
    }}
  >
    <CustomAvatar
      skin='light'
      variant='rounded'
      color={item.avatarColor}
      sx={{ mr: 4, width: 34, height: 34 }}
    >
      {item.OwnerName.charAt(0).toUpperCase()} {/* Display the first letter of OwnerName */}
    </CustomAvatar>

    <Box
      sx={{
        rowGap: 1,
        columnGap: 4,
        width: '100%',
        height: '58px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='h6'>{item.OwnerName}</Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          {item.ShopName}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 1, color: item.trend === 'negative' ? 'error.main' : 'success.main' }
          }}
        >
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {`₹ ${item.PurchaseAmount}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
))}

        {/* <ReactApexcharts type='bar' height={213} options={options} series={[{ data: [32, 98, 61, 41, 88, 47, 71] }]} /> */}
      </CardContent>
    </Card>
  )
}

export default EcommerceEarningReports
