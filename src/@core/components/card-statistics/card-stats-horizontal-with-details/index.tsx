import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Icon from 'src/@core/components/icon';
import CustomAvatar from 'src/@core/components/mui/avatar';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import { AnyAction } from '@reduxjs/toolkit';

interface DesignationCounts {
  customerCount: number;
  merchantCount: number;
  productCount: number;
}

const CardStatsHorizontalWithDetails = () => {
  const [designation, setDesignation] = useState<DesignationCounts | null>(null);

  const fetchData = async () => {
    try {
      const res = await ApiClient.post(`/dashboardcount`);
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        const data = res.data.data[0];
        setDesignation(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // fetchData();
  }, []);

  const cards = [
    { key: 'customercount', label: 'Customer', url: '/customer/customer/' },
    { key: 'merchantcount', label: 'Merchant', url: '/merchant/merchant/' },
    { key: 'productcount', label: 'Product', url: '/product/product/' },
  ];

  const handleCardClick = (url: any) => {
    window.open(url?.url, '_blank');
  };

  if (!designation) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid item sx={{ display: 'flex', gap: '10px' }} xs={12}>
      {cards.map((card:any, index) => (
        <Grid key={index} sx={{ width: '40%', cursor: 'pointer' }}>
        <Card onClick={() => handleCardClick(card)}
          sx={{
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {

              transform: 'scale(1.05)',
              boxShadow: '0px 4px 20px rgb(249,184,105)',
            },
          }}
          >
          <CardContent sx={{ gap: 4 }}>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <CustomAvatar skin="light" variant="rounded" color="primary" sx={{ width: '35px', height: '35px' }}>
  <Icon
    icon={`carbon:${index === 1 ? 'business-processes' : index === 2 ? 'product' : 'user-multiple'}`}
    fontSize="24" // Adjust font size here
    style={{ fontWeight: 'bold', color: 'primary.main' }} // Apply bold and color here
  />
</CustomAvatar>


                <Typography variant="h4">
                  {designation[card.key as keyof DesignationCounts]}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography sx={{ mb: 1, color: 'text.secondary', marginTop: '10px' }}>
                  {card.label}
                </Typography>
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardStatsHorizontalWithDetails;
