// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  open: boolean
  toggle: () => void
  data:any
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SendInvoiceDrawer = ({ open, toggle,data }: Props) => {
  const formatOrderDate = (orderdate: any) => {
    const Orderdate = new Date(orderdate)
          const formattedDate = `${Orderdate.getDate()}-${Orderdate.getMonth() + 1}-${Orderdate.getFullYear()}`
          return formattedDate
  }
  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header>
        <Typography variant='h5'>Send Invoice</Typography>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{
            p: '0.375rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <CustomTextField
          fullWidth
          type='email'
          label='From'
          sx={{ mb: 5 }}
          variant='outlined'
          placeholder='company@email.com'
          defaultValue='admin@Growseb.com'
          disabled = {true}
        />
        <CustomTextField
          fullWidth
          label='To'
          type='email'
          sx={{ mb: 5 }}
          variant='outlined'
          placeholder='company@email.com'
          defaultValue={data.CustomerDetails[0].EmailId}
          disabled = {true}
        />
        <CustomTextField
          fullWidth
          label='Subject'
          sx={{ mb: 5 }}
          variant='outlined'
          placeholder='Invoice regarding goods'
          defaultValue='Invoice of purchased Products'
        />
        <CustomTextField
          rows={10}
          fullWidth
          multiline
          sx={{ mb: 5 }}
          label='Message'
          type='textarea'
          variant='outlined'
          defaultValue={`Dear ${data.CustomerName},

Thank you for your recent purchase from Apurva Marketing Pvt. Ltd!

We have generated a new invoice in the amount of ${data.NetAmount}

We would appreciate payment of this invoice by${formatOrderDate(data.OrderDate)}`}
        />
        <Box sx={{ mb: 6 }}>
          <CustomChip
            rounded
            size='small'
            skin='light'
            color='primary'
            label='Invoice Attached'
            icon={<Icon icon='tabler:link' fontSize='1.25rem' />}
          />
        </Box>
        <div>
          <Button variant='contained' onClick={toggle} sx={{ mr: 4 }}>
            Send
          </Button>
          <Button variant='tonal' color='secondary' onClick={toggle}>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default SendInvoiceDrawer
