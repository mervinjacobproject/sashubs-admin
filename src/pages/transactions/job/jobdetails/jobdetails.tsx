import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import JobsteperformJob from 'src/pages/transactions/job/jobsteperform'

const Jobdetails = () => {
  const router = useRouter()
  const [fetchListdata, setFetchListdata] = useState<any>([])
  const convertTo24HourFormat = (time12Hour: any) => {
    const [time, modifier] = time12Hour.split(' ')
    const [hours, minutes] = time.split(':')
    let updatedHours = hours
    if (modifier === 'PM' && hours !== '12') {
      updatedHours = String(Number(hours) + 12)
    }
    if (modifier === 'AM' && hours === '12') {
      updatedHours = '00'
    }

    return `${hours}:${minutes}`
  }

  const FetchData_job = async(id:any) => {

  await  ApiClient.get(`/api.php?moduletype=job&apitype=list&id=${id}`)
      .then((res: any) => {
        setFetchListdata(res.data)
        const pickupTimeFromApi = res.data[0].pickup_time
        const convertedTime = convertTo24HourFormat(pickupTimeFromApi)
        const statusFromApi = res.data[0]?.status
        const mappedStatus = statusFromApi === 'completed' ? 2 : statusFromApi === 'waiting' ? 1 : 5
      
      })
      .catch((err: any) => {
        // console.error('Error fetching data:', err)
      })
  }

  useEffect(() => {
    const { id } = router.query
    if (id && typeof id === 'string') {
      FetchData_job(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id])
  return (
    <div>
      <JobsteperformJob/>
    </div>
  )
}

export default Jobdetails
