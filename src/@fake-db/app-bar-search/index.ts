// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Types
import { AppBarSearchType } from 'src/@fake-db/types'

const searchData: AppBarSearchType[] = [
  {
    id: 1,
    url: '/dashboards/',
    icon: 'material-symbols-light:order-approve-outline',
    title: 'Dashboard',
    category: 'dashboards'
  },
  {
    id: 2,
    url: '/customer/customer/',
    icon: 'carbon:customer',
    title: 'Customer List',
    category: 'Customer'
  },
  // {
  //   id: 3,
  //   url: '/product/product/',
  //   icon: 'fluent-mdl2:product-variant',
  //   title: 'Card List',
  //   category: 'Product'
  // },
  // {
  //   id: 4,
  //   url: '/product/order',
  //   icon: 'fluent-mdl2:product-variant',
  //   title: 'Order List',
  //   category: 'Product'
  // },

]

// ** GET Search Data
mock.onGet('/app-bar/search').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const exactData: { [k: string]: AppBarSearchType[] } = {
    dashboards: [],
    Employee: [],
    Customer: [],
    Pricing: [],
    chartsMisc: [],
    Common: [],
    Task: [],
    Transcations: [],
    Reports: [],
    Settings: [],

  }

  const includeData: { [k: string]: AppBarSearchType[] } = {
    dashboards: [],
    Employee: [],
    Customer: [],
    Pricing: [],
    Common: [],
    Task: [],
    Transcations: [],
    Reports: [],
    Settings: [],

  }

  searchData.forEach(obj => {
    const isMatched = obj.title.toLowerCase().startsWith(queryLowered)
    if (isMatched && exactData[obj.category]?.length < 5) {
      exactData[obj.category].push(obj)
    }
  })

  searchData.forEach(obj => {
    const isMatched =
      !obj.title.toLowerCase().startsWith(queryLowered) && obj.title.toLowerCase().includes(queryLowered)
    if (isMatched && includeData[obj.category]?.length < 5) {
      includeData[obj.category].push(obj)
    }
  })

  const categoriesCheck: string[] = []

  Object.keys(exactData).forEach(category => {
    if (exactData[category].length > 0) {
      categoriesCheck.push(category)
    }
  })
  if (categoriesCheck.length === 0) {
    Object.keys(includeData).forEach(category => {
      if (includeData[category].length > 0) {
        categoriesCheck.push(category)
      }
    })
  }

  const resultsLength = categoriesCheck.length === 1 ? 5 : 3

  return [
    200,
    [
      ...exactData.dashboards.concat(includeData.dashboards).slice(0, resultsLength),
      ...exactData.Employee.concat(includeData.appsPages).slice(0, resultsLength),
      ...exactData.Customer.concat(includeData.userInterface).slice(0, resultsLength),
      ...exactData.Pricing.concat(includeData.formsTables).slice(0, resultsLength),
      ...exactData.Common.concat(includeData.chartsMisc).slice(0, resultsLength),
      ...exactData.Task.concat(includeData.chartsMisc).slice(0, resultsLength),
      ...exactData.Transcations.concat(includeData.chartsMisc).slice(0, resultsLength),
      ...exactData.Reports.concat(includeData.chartsMisc).slice(0, resultsLength),
      ...exactData.Settings.concat(includeData.chartsMisc).slice(0, resultsLength),

    ]
  ]
})
