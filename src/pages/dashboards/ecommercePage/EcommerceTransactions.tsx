// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import { useEffect, useState } from 'react'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import toast from 'react-hot-toast'

interface DataType {
  CustomerName: string
  amount: number
  subtitle: string
  avatarIcon: string
  avatarColor: ThemeColor
  EarnedPoints: string
  ProductName: string


  amountDiff?: 'positive' | 'negative'
}



const EcommerceTransactions = () => {
  const [transaction, setTransaction] = useState([])

  const fetchTransaction = async () => {
    try {
      const res = await ApiClient.post(`/gettransaction`)
      const response = res.data.data

      const dataWithSerialNumber = response.map((row: any, index: number) => ({
        ...row,
        'S.No': index + 1
      }))

      setTransaction(dataWithSerialNumber)
    } catch (err) {
      toast.error('Error fetching data:')
    }
  }


  useEffect(() => {
    // fetchTransaction()

  }, [])



  return (
    <Card>
      <CardHeader
        title='Transactions'
        subheader='Recent Transaction done in month'

        // subheader='Total 58 transaction done in month'
        action={
          <OptionsMenu
            options={['Refresh', 'Show all entries', 'Make payment']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
      {transaction.slice(0, 5).map((item: DataType, index: number) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== transaction.length - 1 ? [4.75, 4.75, 3.375, 4.75] : undefined
              }}
            >
              {/* <CustomAvatar
                skin='light'
                variant='rounded'
                color={item.avatarColor}
                sx={{ mr: 4, width: 34, height: 34 }}
              >
                <Icon icon={item.avatarIcon} />
              </CustomAvatar> */}

<CustomAvatar
      skin='light'
      variant='rounded'
      color={item.avatarColor}
      sx={{ mr: 4, width: 34, height: 34 }}
    >
      {item.CustomerName.charAt(0).toUpperCase()} {/* Display the first letter of OwnerName */}
    </CustomAvatar>

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
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {item.ProductName}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, color: item.amountDiff === 'negative' ? 'error.main' : 'success.main' }}
                >
                  {/* {`${item.amountDiff === 'negative' ? '-' : '+'}$${item.PointTransaction}`} */}
                  {item.EarnedPoints}
                </Typography>
              </Box>
            </Box>

        ))}
      </CardContent>
    </Card>
  )
}

export default EcommerceTransactions
