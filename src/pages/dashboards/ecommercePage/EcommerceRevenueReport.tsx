import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import toast from 'react-hot-toast';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import SpeedometerExample from './EcommerceStatistics';
import { AuthContext } from 'src/context/AuthContext';

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const EcommerceRevenueReport = () => {
  // State to store data fetched from the API
  const [urlData, setUrlData] = useState<any>([]); // Stores the URL and meta data
  const theme = useTheme();
  const { seoScoreData }: any = useContext(AuthContext)



  // Fetch the URL-related data
  const fetchUrlData = async () => {
    try {
      const res = await ApiClient.get('/meta-url-data'); // Replace with your API endpoint
      const response = res.data.data;
      setUrlData(response);
    } catch (err) {
      toast.error('Error fetching URL data');
    }
  };

  useEffect(() => {
    // fetchUrlData(); // Fetch the URL data when the component mounts
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <Grid container>
        <StyledGrid item sm={12} xs={12}>
          <CardHeader title="Overall Score" />
          <CardContent>
            {/* Render URL-related data */}
              <Box key={1} mb={3}>
                {/* <Typography variant="h6">URL: {seoScoreData?.url}</Typography> */}
                <SpeedometerExample seoScoreData={seoScoreData?.TotalScore} />
              </Box>
          </CardContent>
        </StyledGrid>
      </Grid>
    </Card>
  );
};

export default EcommerceRevenueReport;
