import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import 'react-phone-input-2/lib/style.css';
import Grid from '@mui/material/Grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import Icon from 'src/@core/components/icon';
import DatePicker from 'react-multi-date-picker';
import { useEffect, useState } from 'react';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import AppSink from 'src/commonExports/AppSink';

interface Props {
  direction: 'ltr' | 'rtl';
}

const RechartsLineChart = ({ direction }: Props) => {
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const [noDataRowView, setNoDataRowView] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);


  const handleDateChange = (dates: any) => {
    setSelectedDates(dates);
    fetchData(dates);
  };

  const CustomTooltip = (props: TooltipProps<any, any>) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      return (
        <div className='recharts-custom-tooltip'>
          <Typography sx={{ fontSize: 'body2.fontSize' }}>
            ${`${payload[0].value}`}
          </Typography>
        </div>
      );
    }

    return null;
  };

  const fetchData = (dates: any) => {
    const fromDate = new Date(dates[0]);
    const toDate = new Date(dates[1]);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return;
    }

    const fromDateStr = fromDate.toISOString().slice(0, 10);
    const toDateStr = toDate.toISOString().slice(0, 10);
    const query = `query MyQuery {
      listJobInvoice5AABS(filter: {DateTime: {ge: "${fromDateStr}", le: "${toDateStr}"}}) {
        totalAmount
        totalCount
        items {
          AdditionalCharge
          ID
          FinalNetTotal
          DateTime
        }
      }
    }`;

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    ApiClient.post(`${AppSink}`, { query }, { headers })
      .then((res: any) => {
        const items = res.data.data.listJobInvoice5AABS.items;

        // Prepare data for rendering
        const datesData: any = {};
        items.forEach((item: any) => {
          const dateStr = item.DateTime.slice(0, 10);
          if (!datesData[dateStr]) {
            datesData[dateStr] = 0;
          }
          if (item.FinalNetTotal !== "") {
            datesData[dateStr] += parseFloat(item.FinalNetTotal);
          }
        });

        // Generate data for the last 10 days
        const currentDate = new Date();
        const lastTenDays = Array.from({ length: 10 }, (_, i) => {
          const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
          return date.toISOString().slice(0, 10);
        }).reverse();

        const chartData = lastTenDays.map(date => ({
          date,
          invoice_amount: datesData[date] || 0
        }));

        setData(chartData);
        setNoDataRowView(chartData.length === 0);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const currentDate = new Date();
    const toDate = currentDate.toISOString().slice(0, 10);
    const fromDate = new Date(currentDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setSelectedDates([fromDate, toDate]);
    fetchData([fromDate, toDate]);
  }, []);

  const getColor = () => {
    const selectedMode = localStorage.getItem('selectedMode')
    if (selectedMode === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else if (selectedMode === 'light') {
      return 'black'
    } else if (localStorage.getItem('systemMode') === 'dark') {
      return 'rgba(208, 212, 241, 0.68)'
    } else {
      return 'black'
    }
  }

  return (
    <>
      <Card>
        <Grid container>
          <Grid sx={{ width: '100%' }} item xs={6}>
            <CardHeader
              title='Invoice'
              subheader={noDataRowView ? 'Last 10 Days Invoice' : 'Last 10 Days Invoice'}
              subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
              sx={{
                flexDirection: ['column', 'row'],
                alignItems: ['flex-start', 'center'],
                '& .MuiCardHeader-action': { mb: 0 },
                '& .MuiCardHeader-content': { mb: [2, 0] }
              }}
              action={<Box sx={{ display: 'flex', alignItems: 'center' }}></Box>}
            />
          </Grid>
          <Grid item xs={4}>
            <div>
              <Typography variant='caption' color='error' sx={{ fontSize: '17px', marginLeft: '2px' }}></Typography>
            </div>
            <div style={{ position: 'relative' }}></div>
            <DatePicker
              name="selectedDates"
              inputClass='custom-input'
              range
              dateSeparator=' to '
              value={selectedDates}
              onChange={handleDateChange}
              style={{ color: getColor() }}
            />
            <div style={{ position: 'absolute', top: '6%', right: '3%' }}>
              <Icon fontSize='1.725rem' icon='solar:calendar-outline' />
            </div>
          </Grid>
        </Grid>

        <CardContent>
          <Box sx={{ height: 400, padding: '20px' }}>
            <ResponsiveContainer>
              <LineChart height={350} data={data} style={{marginleft:"0px"}}>
                <CartesianGrid />
                <XAxis
                  dataKey='date'
                  type="category"
                  allowDuplicatedCategory={false}
                  orientation={direction === 'rtl' ? 'top' : 'bottom'}
                />
                <YAxis
                  orientation={direction === 'rtl' ? 'right' : 'left'}
                />
                <Tooltip content={CustomTooltip} />
                <Line dataKey='invoice_amount' stroke='#776cff' strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default RechartsLineChart;
