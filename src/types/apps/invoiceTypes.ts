export type InvoiceStatus = 'Paid' | string

export type InvoiceLayoutProps = {
  id: string | undefined
}

export type InvoiceClientType = {
  name: string
  address: string
  company: string
  country: string
  contact: string
  companyEmail: string
}

export type InvoiceType = {
  mobile:any
  firstname:string
  lastname:string
  id: number
  name:string
  total: number
  avatar: string
  service: string
  dueDate: string
  address: string
  company: string
  country: string
  contact: string
  avatarColor?: string
  issuedDate: string
  companyEmail: string
  balance: string | number
  invoiceStatus: InvoiceStatus
  email:any
  title:any
  additionalcharge:any
  type:any
  subject:any
}

export type InvoicePaymentType = {
  iban: string
  totalDue: string
  bankName: string
  country: string
  swiftCode: string
}

export type SingleInvoiceType = {
  ID:any
  OrderID:any
  CustomerName:any
  OrderDate:any
  ProductName:any
  TaxableAmount:any
  Rate:any
  Qty:any
  TaxAmount:any
  NetAmount:any
  EmailId:any
  TaxPercentage:any
  DiscountAmount:any
  CustomerDetails:any
  OrderDetails:any
  invoice: InvoiceType
  paymentDetails: InvoicePaymentType
}
