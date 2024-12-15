// ** React Imports
import { useState, useEffect } from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Grid from '@mui/material/Grid'
import { useDispatch } from 'react-redux'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import { fetchData } from 'src/store/apps/user'
import axios from 'axios'
import { AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
// import CrmDashboard from 'src/pages/dashboards/crm'
import Head from 'next/head'

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [role] = useState<string>('')
  const [plan] = useState<string>('')
  const [value] = useState<string>('')
  const [status] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <CardStatsHorizontalWithDetails />
        </Grid>
        {/* <CrmDashboard /> */}
      </Grid>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
