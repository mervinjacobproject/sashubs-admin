import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { useState, useEffect } from 'react'
import AppSink from 'src/commonExports/AppSink'
import toast from 'react-hot-toast'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#ffa2a1',
  series5: '#ffa1a1'
}

const ApexDonutChart = () => {
  const theme = useTheme()
  const [jobData, setJobData] = useState<any>({
    jobOne: null,
    jobTwo: null,
    jobThree: null,
    total: null
  })

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: ['complete_job_count', 'invoice_count', 'ongoing_job_count'],

    colors: [donutColors.series1, donutColors.series5, donutColors.series3],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  value: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  total: {
                    fontSize: theme.typography.body1.fontSize
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
          'Content-Type': 'application/json'
        }

        const fetchAndSetData = async (query: any, setter: any) => {
          const res = await ApiClient.post(`${AppSink}`, { query }, { headers })
          setter(res.data.data.listJobsNew5AABS)
        }

        await Promise.all([
          // fetchAndSetData(`query MyQuery { listJobsNew5AABS(filter: {Status: {eq: 1}}) { totalCount } }`, setJobOne),
          // fetchAndSetData(`query MyQuery { listJobsNew5AABS(filter: {Status: {eq: 2}}) { totalCount } }`, setJobTwo),
          // fetchAndSetData(`query MyQuery { listJobsNew5AABS(filter: {Status: {eq: 5}}) { totalCount } }`, setJobThree),
          // fetchAndSetData(`query MyQuery { listJobsNew5AABS { totalCount } }`, setTotal)
        ])
      } catch (error:any) {
        toast.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const setJobOne = (data:any) => {
    setJobData((prevData:any) => ({
      ...prevData,
      jobOne: data
    }))
  }

  const setJobTwo = (data:any) => {
    setJobData((prevData:any) => ({
      ...prevData,
      jobTwo: data
    }))
  }

  const setJobThree = (data:any) => {
    setJobData((prevData:any) => ({
      ...prevData,
      jobThree: data
    }))
  }

  const setTotal = (data:any) => {
    setJobData((prevData:any) => ({
      ...prevData,
      total: data
    }))
  }
 const valOne:any= (jobData.jobOne?.totalCount/jobData?.total?.totalCount)*100
 const valTwo:any= (jobData.jobTwo?.totalCount/jobData?.total?.totalCount)*100
 const valThree:any= (jobData.jobThree?.totalCount/jobData?.total?.totalCount)*100

  const series = [parseFloat(valOne), parseFloat(valTwo), parseFloat(valThree)];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Job Ratio'
        subheader='Spending on various categories'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <ReactApexcharts type='donut' height={600} options={options} series={series} />
      </CardContent>
      <style>
        {`
          .apexcharts-legend {
            gap: 40px; // Adjust gap as needed

          }
          .apexcharts-legend-text{
            font-size:14px !important
          }
        `}
      </style>
    </Card>
  )
}

export default ApexDonutChart
