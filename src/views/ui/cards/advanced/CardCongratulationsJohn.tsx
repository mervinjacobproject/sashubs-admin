// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110
  }
}))

const CardCongratulationsJohn = () => {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5' sx={{ mb: 0.5 }}>
        Best Employee on! 🎉
        </Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>Best seller of the month</Typography>
        <Typography variant='h4' sx={{ mb: 0.5, color: 'primary.main' }}>
          $48.9k
        </Typography>
        <Button variant='contained'>View Sales</Button>
        <Illustration width={116} alt='congratulations john' src='/images/cards/congratulations-john.png' />
      </CardContent>
    </Card>
  )
}

export default CardCongratulationsJohn
