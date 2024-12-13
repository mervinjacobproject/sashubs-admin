// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { responsiveFontSizes, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import toast from 'react-hot-toast'


// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useEffect, useState } from 'react'
import { GridItem } from '@chakra-ui/react'

interface CustomerData {
  total_points: number; // Adjust this based on your actual data structure
}

//const series = [{ data: [0, 19, 7, 27, 15, 40] }]


const EcommerceProfit = () => {
  const [customerlist, setcustomerlist] = useState<number>(0) // Initialize state
  const [weeklyData, setWeeklyData] = useState([]);
  const series = [{
    name: 'Points',
    data: weeklyData.map((week:any) => week?.total_points),
  }];
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    stroke: { width: 2 },
    tooltip: { enabled: true },
    colors: [hexToRGBA(theme.palette.info.main, 1)],
    markers: {
      size: 3.5,
      strokeWidth: 3,
      strokeColors: 'transparent',
      colors: [theme.palette.info.main],
      discrete: [
        {
          size: 5,
          seriesIndex: 0,
          strokeColor: theme.palette.info.main,
          fillColor: theme.palette.background.paper,
          dataPointIndex: series[0].data.length - 1 // Change this to the index you want to highlight, or loop through the data to set multiple markers
        },
      ],
    },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
      padding: {
        top: -13,
        left: -4,
        right: 8,
        bottom: 2,
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          chart: { height: 113 },
        },
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 118 },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { height: 98 },
        },
      },
      {
        breakpoint: 650,
        options: {
          chart: { height: 118 },
        },
      },
      {
        breakpoint: 430,
        options: {
          chart: { height: 94 },
        },
      },
      {
        breakpoint: 401,
        options: {
          chart: { height: 114 },
        },
      },
    ],
  };

  useEffect(() => {
    // fetchCustomerData()
    // fetchWeeklyReports()
  }, [])
  const fetchCustomerData = async () => {
    try {
      const res = await ApiClient.post(`/gettotalpoints`)
      const response = res.data
      setcustomerlist(response.total_points)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }
  const fetchWeeklyReports = async () => {
    try {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const weekReports:any = [];

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);

        if (weekEnd > endDate) {
          weekEnd.setTime(endDate.getTime());
        }
        const res = await ApiClient.post(`/monthtotalpoints?FromDate=${weekStart.toISOString().split('T')[0]}&ToDate=${weekEnd.toISOString().split('T')[0]}`);
        const response = res.data.data;
        weekReports.push({
          week: `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`,
          total_points: response.total_points // Adjust based on your actual response structure
        });
      }
      setWeeklyData(weekReports);
    } catch (err) {
      toast.error('Error fetching weekly reports:');
      console.error(err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'></Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          This Month
        </Typography>
        <ReactApexcharts type='line' height={93} series={series} options={options} />
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>{customerlist}</Typography>

        </Box>
      </CardContent>
    </Card>
  )
}

export default EcommerceProfit
