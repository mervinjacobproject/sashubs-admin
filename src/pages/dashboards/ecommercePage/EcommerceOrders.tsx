// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'


// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

interface DataType {
  CustomerName: string
  imgSrc: string
  TotalEarnings: string
  subtitle: string
}








const EcommercePopularProducts = () => {
  const [allProduct, setAllProduct] = useState<DataType[]>([]); // Correctly initialize state inside the component
  const fetchProductName = async () => {
    try {
      const res = await ApiClient.post(`/getearningscustomer`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setAllProduct(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }


  useEffect(() => {
    // fetchProductName()
  }, [])


  return (
    <Card style={{ height: '100%' }}>
      <CardHeader
        title='Popular Earning Customer'
        subheader='Top 5 Customers with highest earnings'
        // action={
        //   <OptionsMenu
        //     iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
        //     options={['Price - low to high', 'Price - high to low', 'Best seller']}
        //   />
        // }
      />
      <CardContent>
        {allProduct.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.CustomerName}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== allProduct.length - 1 ? 4.75 : undefined
              }}
            >
              {/* <img width={46} src={item.imgSrc} alt={item.ProductName} /> */}
              {item.imgSrc ? (
    <img width={46} src={item.imgSrc} alt={item.CustomerName} style={{ marginRight: '16px' }} />
  ) : (
    <div
      style={{
        width: '46px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        marginRight: '16px',
        borderRadius: '50%',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000'
      }}
    >
      {item.CustomerName.charAt(0)}
    </div>
  )}

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.CustomerName}</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.disabled' }}>
                    {item.CustomerName}
                  </Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>{item.TotalEarnings}</Typography>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default EcommercePopularProducts
