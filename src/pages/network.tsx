
import Link from 'next/link'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import Icon from 'src/@core/components/icon'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))



const Network = () => {
  return (
    <Box className='content-center'>
  <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <BoxWrapper>
      <Typography variant='h2' sx={{ mb: 1.5, color: 'error.main' }}>
        No Internet Connection :(
      </Typography>
      <Typography variant='h4' sx={{ mb: 6, color: 'text.secondary' }}>
        Oops! It seems like your internet connection is slow or not available.
      </Typography>
      <Typography variant='h5' sx={{ mb: 6, color: 'black' }}>
        Please check your internet settings and try again.
      </Typography>
    </BoxWrapper>
    {/* <Img height='500' alt='error-illustration' src='/images/pages/404.png' /> */}
    <Icon icon='svg-spinners:wifi' style={{ color: 'red' , width : '200px', height : '150px'}} />
  </Box>
  <FooterIllustrations />
</Box>
  )
}



export default Network
