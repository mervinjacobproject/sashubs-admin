import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'
import { useRouter } from 'next/router'
import AppSink from 'src/commonExports/AppSink'
import AnimatedNumber from 'src/pages/components/ReusableComponents/animatedNumber'

const CardStatsHorizontalWithDetails = () => {
  const [designation, setDesignation] = useState<any>('')

  const fetchData = async () => {
    const query = `query MyQuery {
listCustomers {
    totalCount
  }
  listProducts {
    totalCount
  }
  listOrderDetails {
    totalCount
  }
    }`

    const headers = {
      'x-api-key': 'da2-ayrlrqjwu5dazeu6zzoaz3notu',
      'Content-Type': 'application/json'
    }
    const endPoint = 'https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql'

    try {
      const res = await ApiClient.post(endPoint, { query }, { headers })
      setDesignation(res.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCardClick = (field: any) => {
    let url
    switch (field) {
      case 'listCustomers':
        url = '/customer/customer/'
        break
      case 'listProducts':
        url = '/products'
        break
      case 'listOrderDetails':
        url = '/orderdetails'
        break
      case 'listJobsNew5AABS':
        url = '/transactions/job/'
        break
      default:
        return
    }
    window.open(url, '_blank')
  }

  return (
    <Grid item sx={{ display: 'flex', gap: '10px' }} xs={12}>
      {['listCustomers', 'listProducts', 'listOrderDetails'].map((item, index) => (
        <Grid key={index} sx={{ width: '40%', cursor: 'pointer' }}>
          <Card onClick={() => handleCardClick(item)}>
            <CardContent sx={{ gap: 3 }}>
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ width: '24px', height: '24px' }}>
                  <Icon icon={`clarity:${index === 1 ? 'employee-line' : 'employee-group-line'}`} fontSize='24' />
                </CustomAvatar>
                <Typography variant='h4'>
                  {/* <AnimatedNumber
                    value={isNaN(designation[item]?.totalCount) ? 0 : designation[item]?.totalCount}
                    duration={1200}
                  /> */}
                  {designation[item]?.totalCount}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ mb: 1, color: 'text.secondary', marginTop: '10px' }}>
                    {index === 0 ? 'Customer' : index === 1 ? 'Products' : index === 2 ? 'Appointments' : 'Job'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default CardStatsHorizontalWithDetails