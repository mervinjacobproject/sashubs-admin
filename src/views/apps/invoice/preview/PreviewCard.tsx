// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { SingleInvoiceType } from 'src/types/apps/invoiceTypes'

interface Props {
  data: SingleInvoiceType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
const formatOrderDate = (orderdate: any) => {
  const Orderdate = new Date(orderdate)
        const formattedDate = `${Orderdate.getDate()}-${Orderdate.getMonth() + 1}-${Orderdate.getFullYear()}`
        return formattedDate
}
  
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <img src='\images\icons\project-icons\Groesen-logo.png'  style={{width:"72px",height:"72px"}} alt="logo"/>
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <div>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>Apurva Marketing Pvt. Ltd</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>3H, C2 C2  Road,Balarengapuram,</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}> Madurai, Tamil Nadu, India</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+91 99523 18427</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '210px' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h4'>Invoice</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h4'>{data.ID}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Date Issued:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{formatOrderDate(data.OrderDate)}</Typography>
                      </MUITableCell>
                    </TableRow>
                    
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 6 }}>
                Invoice To:
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.CustomerName}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.CustomerDetails[0].DoorNo + ',' + data.CustomerDetails[0].Street}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.CustomerDetails[0].Area}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.CustomerDetails[0].CityName + ','+ data.CustomerDetails[0].StateName + ','+ data.CustomerDetails[0].CountryName}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{`91${data.CustomerDetails[0].PhoneNo}`}</Typography>
            </Grid>
           
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate (₹)</TableCell>
                <TableCell>Taxable Amt (₹)</TableCell>
                <TableCell>Discount Amt (₹)</TableCell>
                <TableCell>Tax Amt (₹)</TableCell>
                <TableCell>Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              {data.OrderDetails.map((item:any, index:any) => (
      <TableRow key={index}>
        <TableCell>{item.ProductName}</TableCell>
        <TableCell>{item.Qty}</TableCell>
        <TableCell>{`₹${item.Rate}`}</TableCell>
        <TableCell>{`₹${item.TaxableAmount}`}</TableCell>
        <TableCell>{`₹${item.DiscountAmount}`}</TableCell>
        <TableCell>{`₹${item.TaxAmount}`}</TableCell>
        <TableCell>{`₹${item.NetAmount}`}</TableCell>
      </TableRow>
    ))}
              {/* <TableRow>
                <TableCell>Social Media</TableCell>
                <TableCell>Social media templates</TableCell>
                <TableCell>42</TableCell>
                <TableCell>1</TableCell>
                <TableCell>$28</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Web Design</TableCell>
                <TableCell>Web designing package</TableCell>
                <TableCell>46</TableCell>
                <TableCell>1</TableCell>
                <TableCell>$24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>SEO</TableCell>
                <TableCell>Search engine optimization</TableCell>
                <TableCell>40</TableCell>
                <TableCell>1</TableCell>
                <TableCell>$22</TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              {/* <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Salesperson:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Tommy Shelby</Typography>
              </Box> */}

              <Typography sx={{ color: 'text.secondary' }}>Thanks for your Purchase</Typography>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{`₹${data.TaxableAmount}`}</Typography>
              </CalcWrapper>
              {/* <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Discount</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{`₹${data.DiscountAmount}`}</Typography>
              </CalcWrapper> */}
              <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Tax Amt</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{`₹${data.TaxAmount}`}</Typography>
              </CalcWrapper>
              {/* <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Tax %</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{data.TaxPercentage}</Typography>
              </CalcWrapper> */}
             
              <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{`₹${data.NetAmount}`}</Typography>
              </CalcWrapper>
              <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <Typography sx={{ color: 'text.secondary' }}>
            <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
              Note:
            </Typography>
            Thank you for your purchase from Apurva Marketing Pvt. Ltd! We're thrilled that you chose us and hope you’re excited about our new Product's
          </Typography>
        </CardContent>
      </Card>
    )
  
}

export default PreviewCard
