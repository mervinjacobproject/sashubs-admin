// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import axios from 'axios'
// import Lamda_Base_Url from 'src/commonExports/lamdabaseUrl'
// import ApiClient from 'src/pages/components/apiClient 1/apiClient/apiClient/apiConfig'

// // const Superroute = [
// //   {
// //     title: 'Dashboards',
// //     icon: 'tabler:smart-home',
// //     // badgeContent: 'new',
// //     badgeColor: 'error',

// //     children: [
// //       {
// //         title: 'E-Commerce',
// //         icon: 'map:grocery-or-supermarket',
// //         path: '/dashboards/ecommerce'
// //       },
// //       {
// //         title: 'Food',
// //         icon: 'material-symbols-light:fastfood-rounded',
// //         path: '/dashboards/food'
// //       },
// //       {
// //         title: 'Logistics',
// //         icon: 'arcticons:joyride-superapp',
// //         path: '/dashboards/Logistics'
// //       },
// //       {
// //         title: 'Services',
// //         icon: 'arcticons:joyride-superapp',
// //         path: '/dashboards/services'
// //       },
// //       {
// //         title: 'Users',
// //         icon: 'arcticons:joyride-superapp',
// //         path: '/dashboards/users'
// //       }
// //     ]
// //   },
// //   {
// //     title: 'Roles and Permissions',
// //     icon: 'streamline:office-worker-solid',
// //     // badgeContent: 'new',
// //     badgeColor: 'error',

// //     children: [
// //       {
// //         title: 'Admin Users',
// //         icon: 'map:grocery-or-supermarket',
// //         path: '/rolesAndPermissions/adminUsers',
// //         children: [
// //           {
// //             title: 'Active Users',
// //             path: '/rolesAndPermissions/adminUsers/activeUsers',
// //             icon: 'raphael:customer'
// //           },
// //           {
// //             title: 'Deleted Users',
// //             path: '/rolesAndPermissions/adminUsers/deleteUsers',
// //             icon: 'raphael:customer'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Roles',
// //         icon: 'map:grocery-or-supermarket',
// //         path: '/rolesAndPermissions/roles'
// //       },
// //       {
// //         title: 'All Master',
// //         icon: 'arcticons:joyride-superapp',
// //         path: '/rolesAndPermissions/allMaster'
// //       },
// //       {
// //         title: 'Role Permissions',
// //         icon: 'arcticons:joyride-superapp',
// //         path: '/rolesAndPermissions/permissions'
// //       }
// //     ]
// //   },
// //   {
// //     sectionTitle: 'Verticles'
// //   },

// //   {
// //     title: 'E-Commerce',
// //     icon: 'fluent:cart-24-filled',
// //     // badgeContent: 'new',
// //     badgeColor: 'error',

// //     children: [
// //       {
// //         title: 'Products',
// //         icon: 'fluent-mdl2:product-variant',
// //         children: [
// //           {
// //             title: 'Category',
// //             path: '/ecommerce/products/category',
// //             icon: 'ic:outline-category'
// //           },
// //           {
// //             title: 'Attributes',
// //             path: '/ecommerce/products/attribute',
// //             icon: 'material-symbols:edit-attributes-outline'
// //           },

// //           {
// //             title: 'Brand',
// //             path: '/ecommerce/products/brand',
// //             icon: 'tabler:brand-nem'
// //           },
// //           {
// //             title: 'Brand Authenticate',
// //             path: '/ecommerce/products/brand-Authenticate',
// //             icon: 'tabler:brand-nem'
// //           },
// //           {
// //             title: 'Unit',
// //             path: '/ecommerce/products/unit',
// //             icon: 'fontisto:unity'
// //           },

// //           {
// //             title: 'HSN',
// //             path: '/ecommerce/products/hsn',
// //             icon: 'arcticons:any-icon'
// //           },
// //           {
// //             title: 'Items',
// //             path: '/ecommerce/products/items',
// //             icon: 'mdi:invoice-line-items-outline'
// //           },
// //           {
// //             title: ' Frequently Bought',
// //             path: '/ecommerce/products/bought',
// //             icon: 'mdi:frequently-asked-questions'
// //           },
// //           {
// //             title: 'Colour',
// //             path: '/ecommerce/products/colour',
// //             icon: 'mdi:color'
// //           },
// //           {
// //             title: 'Size',
// //             path: '/ecommerce/products/size',
// //             icon: 'gg:size'
// //           },
// //           {
// //             title: 'Material',
// //             path: '/ecommerce/products/material',
// //             icon: 'mdi:material'
// //           },
// //           {
// //             title: 'Order Status',
// //             path: '/ecommerce/products/order-status',
// //             icon: 'mdi:cart-heart'
// //           }
// //         ]
// //       },

// //       {
// //         title: 'Vendors',
// //         icon: 'icon-park-outline:delivery',
// //         children: [
// //           {
// //             title: 'Vendor',
// //             path: '/ecommerce/supply-chain/suppliers',
// //             icon: 'fluent-mdl2:group'
// //           },

// //           {
// //             title: 'Products',
// //             path: '/ecommerce/supply-chain/products',
// //             icon: 'fluent-mdl2:product-variant'
// //           },
// //           {
// //             title: 'Payouts',
// //             path: '/ecommerce/supply-chain/payouts',
// //             icon: 'game-icons:pay-money'
// //           },
// //           {
// //             title: 'Shiprocket Address',
// //             path: '/ecommerce/supply-chain/shipRocket_Address',
// //             icon: 'game-icons:pay-money'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Customers',
// //         icon: 'akar-icons:person',
// //         children: [
// //           {
// //             title: 'Customer Groups',
// //             path: '/ecommerce/crm/customer-group',
// //             icon: 'streamline:information-desk-customer'
// //           },
// //           {
// //             title: 'Customer',
// //             path: '/ecommerce/crm/customer',
// //             icon: 'raphael:customer'
// //           },

// //           {
// //             title: 'Newsletter Subscribers',
// //             path: '/ecommerce/crm/newsletters',
// //             icon: 'jam:newsletter'
// //           }
// //         ]
// //       },

// //       {
// //         title: 'Orders',
// //         path: '/ecommerce/orders',
// //         icon: 'fe:list-order'
// //       }
// //     ]
// //   },

// //   {
// //     title: 'Logistic',
// //     icon: 'fa-solid:car',
// //     children: [
// //       {
// //         title: 'Pilot',
// //         icon: 'fa-solid:car',
// //         path: '/logistics/pilot'
// //       },
// //       {
// //         title: 'Vehicle Type',
// //         path: '/logistics/vehicle-type',
// //         icon: 'mdi:merge-type'
// //       },
// //       {
// //         title: 'Events',
// //         icon: 'oui:calendar',
// //         path: '/logistics/scheduler'
// //       },
// //       {
// //         title: 'Ride',
// //         icon: 'fa-solid:car',
// //         path: '/logistics/ride'
// //       },

// //       {
// //         title: 'GPS',
// //         icon: 'solar:gps-outline',
// //         path: '/logistics/gps'
// //       }
// //     ]
// //   },
// //   {
// //     title: 'Food ',
// //     icon: 'ic:round-local-dining',
// //     children: [
// //       {
// //         title: 'General Food',
// //         icon: 'dashicons:food',
// //         children: [
// //           {
// //             icon: 'ph:cooking-pot',
// //             title: 'Cuisines',
// //             path: '/food/general-food/cuisines'
// //           },
// //           {
// //             icon: 'mingcute:dish-cover-line',
// //             title: 'Dishes',
// //             path: '/food/general-food/dishes'
// //           },
// //           {
// //             icon: 'ph:pix-logo-light',
// //             title: 'Brands ',
// //             path: '/food/general-food/brands'
// //           },
// //           {
// //             icon: 'ph:pix-logo-light',
// //             title: 'Courses ',
// //             path: '/food/general-food/courses'
// //           }
// //         ]
// //       },
// //       {
// //         icon: 'material-symbols:table-restaurant-outline',
// //         title: 'Users ',
// //         path: '/food/users'
// //       },
// //       {
// //         icon: 'material-symbols:table-restaurant-outline',
// //         title: 'Restaurant ',
// //         path: '/food/restaurants'
// //       },
// //       {
// //         title: 'Orders',
// //         path: '/food/orders',
// //         icon: 'fe:list-order'
// //       },
// //       {
// //         title: 'Orders Status',
// //         path: '/food/order-status',
// //         icon: 'fe:list-order'
// //       }
// //     ]
// //   },
// //   {
// //     title: 'Services',
// //     icon: 'vaadin:tools',
// //     children: [
// //       {
// //         title: 'Categories',
// //         icon: 'fluent-mdl2:product-variant',
// //         children: [
// //           {
// //             title: 'Parent Category',
// //             path: '/services/categorys/parentCategory',
// //             icon: 'ic:outline-category'
// //           },
// //           {
// //             title: 'Sub Category',
// //             path: '/services/categorys/subCategory',
// //             icon: 'ic:outline-category'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Listing',
// //         path: '/services/add_listing',
// //         icon: 'ic:outline-category'
// //       },

// //       {
// //         title: 'Amenities',
// //         path: '/services/Amenities',
// //         icon: 'ic:outline-category'
// //       },
// //       {
// //         title: 'Bookings',
// //         path: '/services/booking',
// //         icon: 'ic:outline-category'
// //       },
// //       {
// //         title: 'Booking Status',
// //         path: '/services/Bookingstatus',
// //         icon: 'ic:outline-category'
// //       }
// //     ]
// //   },
// //   {
// //     title: 'Groceries',
// //     icon: 'solar:cart-2-linear'
// //   },

// //   {
// //     title: 'Property ',
// //     icon: 'typcn:home'
// //   },

// //   {
// //     title: 'General ',
// //     icon: 'streamline:office-worker-solid',
// //     children: [
// //       {
// //         title: 'Users',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Active Users',
// //             path: '/general/allUsers/activeUsers',
// //             icon: 'raphael:customer'
// //           },
// //           {
// //             title: 'Deleted Users',
// //             path: '/general/allUsers/deleteUsers',
// //             icon: 'raphael:customer'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'UnAuthorised Access',
// //         path: '/general/unAuthorisedAccess',
// //         icon: 'ant-design:calculator-outlined'
// //       },
// //       {
// //         title: 'Invoice',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Ecommerce',
// //             path: '/general/invoice/ecommerceinvoice',
// //             icon: 'raphael:customer'
// //           },

// //           {
// //             title: 'Services',
// //             path: '/general/invoice/service_invoice',
// //             icon: 'bi:table'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Accounts',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Razorpay Transaction',
// //             path: '/general/transaction/razorpay'
// //           },
// //           {
// //             title: 'DayBook',
// //             path: '/general/transaction/transaction-master'
// //           },
// //           {
// //             title: 'Tax Master',
// //             path: '/general/transaction/tax'
// //           },
// //           {
// //             title: 'Supplier Payouts',
// //             path: '/general/transaction/supplierpayouts'
// //           },
// //           {
// //             title: 'Pilot Payouts',
// //             path: '/general/transaction/pilotPayout'
// //           },
// //           {
// //             title: 'Food Payouts',
// //             path: '/general/transaction/restaurantPayout'
// //           }
// //         ]
// //       },

// //       {
// //         title: 'Referrals',
// //         icon: 'healthicons:referral-negative',
// //         children: [
// //           {
// //             title: 'Point value',
// //             path: '/general/referrals/point-value',
// //             icon: 'mdi:star-three-points-outline'
// //           },

// //           {
// //             title: 'Points-Table',
// //             path: '/general/referrals/points-table',
// //             icon: 'bi:table'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Coupon',
// //         icon: 'streamline:discount-percent-coupon',
// //         children: [
// //           {
// //             title: ' Coupons',
// //             path: '/general/coupon/coupon-value',
// //             icon: 'tdesign:coupon'
// //           },
// //           {
// //             title: 'Coupon-Transaction ',
// //             path: '/general/coupon/coupon-transaction',
// //             icon: 'ant-design:transaction-outlined'
// //           }
// //         ]
// //       },

// //       {
// //         title: 'Banner',
// //         icon: 'game-icons:tattered-banner',
// //         children: [
// //           {
// //             title: 'E-commmerce Banner',
// //             path: '/general/banner/ecommerce-banner/',
// //             icon: 'ph:flag-banner-fill'
// //           },

// //           {
// //             title: 'Food Banner',
// //             path: '/general/banner/food-banner/',
// //             icon: 'map:food'
// //           },
// //           {
// //             title: 'Logistics Banner',
// //             path: '/general/banner/logistics-banner',
// //             icon: 'healthicons:truck-driver-negative'
// //           },
// //           {
// //             title: 'Services Banner',
// //             path: '/general/banner/services-banner',
// //             icon: 'healthicons:truck-driver-negative'
// //           },
// //           {
// //             title: ' Banner Master',
// //             path: '/general/banner/bannermaster',
// //             icon: 'icon-park-outline:master'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Location',
// //         icon: 'carbon:location-save',
// //         children: [
// //           {
// //             title: ' Country ',
// //             path: '/general/location/country',
// //             icon: 'gis:search-country'
// //           },
// //           {
// //             title: ' State ',
// //             path: '/general/location/state',
// //             icon: 'mdi:estate'
// //           },
// //           {
// //             title: ' City ',
// //             path: '/general/location/city',
// //             icon: 'material-symbols-light:location-city'
// //           },
// //           {
// //             title: ' Zone ',
// //             path: '/general/location/area',
// //             icon: 'carbon:area'
// //           },
// //           {
// //             title: ' Sub-Zone ',
// //             path: '/general/location/subzone',
// //             icon: 'carbon:area'
// //           },

// //           {
// //             title: 'Tiers',
// //             path: '/general/location/tiers',
// //             icon: 'arcticons:tier'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Avaliability Location',
// //         path: '/general/avaliabilitylocation',
// //         icon: 'material-symbols-light:location-city'
// //       },
// //       {
// //         title: 'Appversion',
// //         path: '/general/appversion',
// //         icon: 'material-symbols:groups-2'
// //       },
// //       {
// //         title: 'Groups',
// //         path: '/general/groups',
// //         icon: 'material-symbols:groups-2'
// //       },
// //       {
// //         title: 'Email-Template',
// //         path: '/general/mailFormat',
// //         icon: 'tdesign:coupon'
// //       }
// //     ]
// //   },
// //   {
// //     title: 'Subscriptions ',
// //     icon: 'streamline:office-worker-solid',
// //     children: [
// //       {
// //         title: 'E-commerce',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Pricing',
// //             path: '/subscriptions/e-commerce/pricing'
// //           },
// //           {
// //             title: 'VIZHIL-Fee',
// //             path: '/subscriptions/e-commerce/platform-fee'
// //           },
// //           {
// //             title: 'Delivery-Fee',
// //             path: '/subscriptions/e-commerce/delivery-fee'
// //           },

// //           {
// //             title: 'Cost Estimation',
// //             path: '/subscriptions/e-commerce/cost-estimation'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Logistics',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Pricing',
// //             path: '/subscriptions/rides/pricing'
// //           },
// //           {
// //             title: 'Estimation',
// //             path: '/subscriptions/rides/estimation'
// //           },
// //           {
// //             title: 'Rental Pricing',
// //             path: '/subscriptions/rides/rentalpackagepricing'
// //           },
// //           {
// //             title: 'Outstation Pricing',
// //             path: '/subscriptions/rides/rideoutstation'
// //           },
// //           {
// //             title: 'Pilot Subscription',
// //             path: '/subscriptions/rides/cost-estimation'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Food',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Cost Estimation',
// //             path: '/subscriptions/food/cost-estimation'
// //           }
// //         ]
// //       },
// //       {
// //         title: 'Service',
// //         icon: 'ant-design:calculator-outlined',
// //         children: [
// //           {
// //             title: 'Subscription Ratio',
// //             path: '/subscriptions/services/ServicesSubscription',
// //             icon: 'ic:outline-category'
// //           },
// //           {
// //             title: 'Location Cost',
// //             path: '/subscriptions/services/locationCost',
// //             icon: 'ic:outline-category'
// //           }
// //         ]
// //       }
// //     ]
// //   },

// //   {
// //     title: 'Settings',
// //     icon: 'lets-icons:setting-line',
// //     children: [
// //       {
// //         title: 'Auth',
// //         icon: 'akar-icons:person',
// //         children: [
// //           {
// //             title: 'Roles',
// //             path: '/apps/settings/users/roles'
// //           },
// //           {
// //             title: 'Users',
// //             path: '/apps/settings/users/user'
// //           }
// //         ]
// //       }
// //     ]
// //   }
// // ]
// const data1 = {
//   data: [
//     {
//       UserRoleId: 2,
//       UserRoleName: 'Super Admin',
//       RolePermissionDetails: [
//         {
//           Id: 24,
//           title: 'Dashboards',
//           icon: 'tabler:smart-home',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: false,
//           badgeColor: 'error',
//           children: [
//             {
//               Id: 25,
//               RoleId: 2,
//               title: 'S-Dashboards',
//               icon: 'map:grocery-or-supermarket',
//               path: '/dashboards/ecommerce',
//               IsRead: false,
//               IsWrite: false,
//               IsDelete: false,
//               IsExemption: false
//             },
//             {
//               Id: 26,
//               RoleId: 2,
//               title: 'E-Dashboards',
//               icon: 'material-symbols-light:fastfood-rounded',
//               path: '/dashboards/food',
//               IsRead: false,
//               IsWrite: false,
//               IsDelete: false,
//               IsExemption: false
//             },
//             {
//               Id: 27,
//               RoleId: 2,
//               title: 'R-Dashboards',
//               icon: 'arcticons:joyride-superapp',
//               path: '/dashboards/Logistics',
//               IsRead: false,
//               IsWrite: false,
//               IsDelete: false,
//               IsExemption: false
//             },
//             {
//               Id: 28,
//               RoleId: 2,
//               title: 'Ser-Dashboards',
//               icon: 'arcticons:joyride-superapp',
//               path: '/dashboards/services',
//               IsRead: false,
//               IsWrite: false,
//               IsDelete: false,
//               IsExemption: false
//             },
//             {
//               Id: 29,
//               RoleId: 2,
//               title: 'Users Dashboards',
//               icon: 'arcticons:joyride-superapp',
//               path: '/dashboards/users',
//               IsRead: false,
//               IsWrite: false,
//               IsDelete: false,
//               IsExemption: false
//             }
//           ]
//         },
//         {
//           Id: 30,
//           title: 'Roles and Permissions',
//           icon: 'streamline:office-worker-solid',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: false,
//           children: [
//             {
//               Id: 31,
//               RoleId: 2,
//               title: 'Admin Users',
//               icon: 'map:grocery-or-supermarket',
//               path: '/rolesAndPermissions/adminUsers',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false,
//               children: [
//                 {
//                   Id: 32,
//                   RoleId: 2,
//                   title: 'Active Admin Users',
//                   icon: 'raphael:customer',
//                   path: '/rolesAndPermissions/adminUsers/activeUsers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 33,
//                   RoleId: 2,
//                   title: 'Deleted Admin Users',
//                   icon: 'raphael:customer',
//                   path: '/rolesAndPermissions/adminUsers/deleteUsers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 }
//               ]
//             },
//             {
//               Id: 34,
//               RoleId: 2,
//               title: 'Roles',
//               icon: 'map:grocery-or-supermarket',
//               path: '/rolesAndPermissions/roles',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 35,
//               RoleId: 2,
//               title: 'All Master',
//               icon: 'arcticons:joyride-superapp',
//               path: '/rolesAndPermissions/allMaster',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 36,
//               RoleId: 2,
//               title: 'Role Permissions',
//               icon: 'arcticons:joyride-superapp',
//               path: '/rolesAndPermissions/permissions',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             }
//           ]
//         },
//         {
//           Id: 37,
//           title: 'Shop',
//           icon: 'fluent:cart-24-filled',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: false,
//           children: [
//             {
//               Id: 38,
//               RoleId: 2,
//               title: 'S-Products',
//               icon: 'fluent-mdl2:product-variant',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: false,
//               IsExemption: false,
//               children: [
//                 {
//                   Id: 39,
//                   RoleId: 2,
//                   title: 'S-Category',
//                   icon: 'material-symbols:edit-attributes-outline',
//                   path: '/ecommerce/products/category',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 40,
//                   RoleId: 2,
//                   title: 'S-Attributes',
//                   icon: 'material-symbols:edit-attributes-outline',
//                   path: '/ecommerce/products/attribute',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 41,
//                   RoleId: 2,
//                   title: 'S-Brand',
//                   icon: 'tabler:brand-nem',
//                   path: '/ecommerce/products/brand',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 42,
//                   RoleId: 2,
//                   title: 'S-Brand Authenticate',
//                   icon: 'tabler:brand-nem',
//                   path: '/ecommerce/products/brand-Authenticate',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 43,
//                   RoleId: 2,
//                   title: 'S-Unit',
//                   icon: 'fontisto:unity',
//                   path: '/ecommerce/products/unit',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 44,
//                   RoleId: 2,
//                   title: 'S-HSN',
//                   icon: 'arcticons:any-icon',
//                   path: '/ecommerce/products/hsn',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 45,
//                   RoleId: 2,
//                   title: 'S-Items',
//                   icon: 'mdi:invoice-line-items-outline',
//                   path: '/ecommerce/products/items',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 46,
//                   RoleId: 2,
//                   title: 'S-Frequently Bought',
//                   icon: 'mdi:frequently-asked-questions',
//                   path: '/ecommerce/products/bought',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 47,
//                   RoleId: 2,
//                   title: 'S-Colour',
//                   icon: 'mdi:color',
//                   path: '/ecommerce/products/colour',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 48,
//                   RoleId: 2,
//                   title: 'S-Size',
//                   icon: 'mdi:color',
//                   path: '/ecommerce/products/size',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 49,
//                   RoleId: 2,
//                   title: 'S-Material',
//                   icon: 'mdi:material',
//                   path: '/ecommerce/products/material',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 50,
//                   RoleId: 2,
//                   title: 'S-Order Status',
//                   icon: 'mdi:cart-heart',
//                   path: '/ecommerce/products/order-status',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 }
//               ]
//             },
//             {
//               Id: 56,
//               RoleId: 2,
//               title: 'S-Vendors',
//               icon: 'icon-park-outline:delivery',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false,
//               children: [
//                 {
//                   Id: 57,
//                   RoleId: 2,
//                   title: 'S-Vendor',
//                   icon: 'fluent-mdl2:group',
//                   path: '/ecommerce/supply-chain/suppliers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 58,
//                   RoleId: 2,
//                   title: 'S-Vendor Products',
//                   icon: 'fluent-mdl2:product-variant',
//                   path: '/ecommerce/supply-chain/products',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 59,
//                   RoleId: 2,
//                   title: 'S-Payouts',
//                   icon: 'game-icons:pay-money',
//                   path: '/ecommerce/supply-chain/payouts',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 60,
//                   RoleId: 2,
//                   title: 'S-Shiprocket Address',
//                   icon: 'game-icons:pay-money',
//                   path: '/ecommerce/supply-chain/shipRocket_Address',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 }
//               ]
//             },
//             {
//               Id: 61,
//               RoleId: 2,
//               title: 'S-Customers',
//               icon: 'akar-icons:person',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false,
//               children: [
//                 {
//                   Id: 62,
//                   RoleId: 2,
//                   title: 'S-Customer Groups',
//                   icon: 'streamline:information-desk-customer',
//                   path: '/ecommerce/crm/customer-group',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 63,
//                   RoleId: 2,
//                   title: 'S-Customer',
//                   icon: 'raphael:customer',
//                   path: '/ecommerce/crm/customer',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 64,
//                   RoleId: 2,
//                   title: 'S-Newsletter Subscribers',
//                   icon: 'jam:newsletter',
//                   path: '/ecommerce/crm/newsletters',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 }
//               ]
//             },
//             {
//               Id: 65,
//               RoleId: 2,
//               title: 'S-Orders',
//               icon: 'fe:list-order',
//               path: '/ecommerce/orders',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             }
//           ]
//         },
//         {
//           Id: 66,
//           title: 'Ride',
//           icon: 'fa-solid:car',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: false,
//           children: [
//             {
//               Id: 67,
//               RoleId: 2,
//               title: 'R-Pilot',
//               icon: 'fa-solid:car',
//               path: '/logistics/pilot',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 68,
//               RoleId: 2,
//               title: 'R-Vehicle Type',
//               icon: 'mdi:merge-type',
//               path: '/logistics/vehicle-type',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 69,
//               RoleId: 2,
//               title: 'R-Events',
//               icon: 'oui:calendar',
//               path: '/logistics/scheduler',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 70,
//               RoleId: 2,
//               title: 'R-Ride',
//               icon: 'fa-solid:car',
//               path: '/logistics/ride',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             },
//             {
//               Id: 71,
//               RoleId: 2,
//               title: 'R-GPS',
//               icon: 'solar:gps-outline',
//               path: '/logistics/gps',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false
//             }
//           ]
//         },
//         {
//           Id: 72,
//           title: 'Eat',
//           icon: 'ic:round-local-dining',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: false,
//           children: [
//             {
//               Id: 73,
//               RoleId: 2,
//               title: 'E-General Food',
//               icon: 'dashicons:food',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: false,
//               children: [
//                 {
//                   Id: 74,
//                   RoleId: 2,
//                   title: 'E-Cuisines',
//                   icon: 'ph:cooking-pot',
//                   path: '/food/general-food/cuisines',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: false
//                 },
//                 {
//                   Id: 75,
//                   RoleId: 2,
//                   title: 'E-Dishes',
//                   icon: 'mingcute:dish-cover-line',
//                   path: '/food/general-food/dishes',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 76,
//                   RoleId: 2,
//                   title: 'E-Brands',
//                   icon: 'ph:pix-logo-light',
//                   path: '/food/general-food/brands',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 77,
//                   RoleId: 2,
//                   title: 'E-Courses',
//                   icon: 'ph:pix-logo-light',
//                   path: '/food/general-food/courses',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 78,
//               RoleId: 2,
//               title: 'E-Users',
//               icon: 'material-symbols:table-restaurant-outline',
//               path: '/food/users',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 79,
//               RoleId: 2,
//               title: 'E-Restaurant',
//               icon: 'material-symbols:table-restaurant-outline',
//               path: '/food/restaurants',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 80,
//               RoleId: 2,
//               title: 'E-Orders',
//               icon: 'fe:list-order',
//               path: '/food/orders',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             }
//           ]
//         },
//         {
//           Id: 81,
//           title: 'Services',
//           icon: 'vaadin:tools',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: true,
//           children: [
//             {
//               Id: 82,
//               RoleId: 2,
//               title: 'Ser-Categories',
//               icon: 'fluent-mdl2:product-variant',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 83,
//                   RoleId: 2,
//                   title: 'Ser-Parent Category',
//                   icon: 'ic:outline-category',
//                   path: '/services/categorys/parentCategory',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 84,
//                   RoleId: 2,
//                   title: 'Ser-Sub Category',
//                   icon: 'ic:outline-category',
//                   path: '/services/categorys/subCategory',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 85,
//               RoleId: 2,
//               title: 'Ser-Listing',
//               icon: 'ic:outline-category',
//               path: '/services/add_listing',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 86,
//               RoleId: 2,
//               title: 'Ser-Amenities ',
//               icon: 'ic:outline-category',
//               path: '/services/Amenities',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 87,
//               RoleId: 2,
//               title: 'Ser-Bookings',
//               icon: 'ic:outline-category',
//               path: '/services/booking',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 88,
//               RoleId: 2,
//               title: 'Ser-Booking Status',
//               icon: 'ic:outline-category',
//               path: '/services/Bookingstatus',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             }
//           ]
//         },
//         {
//           Id: 89,
//           title: 'General',
//           icon: 'streamline:office-worker-solid',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: true,
//           children: [
//             {
//               Id: 90,
//               RoleId: 2,
//               title: 'General Users',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 91,
//                   RoleId: 2,
//                   title: 'Active Users',
//                   icon: 'raphael:customer',
//                   path: '/general/allUsers/activeUsers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 92,
//                   RoleId: 2,
//                   title: 'Deleted Users',
//                   icon: 'raphael:customer',
//                   path: '/general/allUsers/deleteUsers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 93,
//               RoleId: 2,
//               title: 'UnAuthorised Access',
//               icon: 'ant-design:calculator-outlined',
//               path: '/general/unAuthorisedAccess',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 94,
//               RoleId: 2,
//               title: 'All Invoices ',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 95,
//                   RoleId: 2,
//                   title: 'Shop Invoices ',
//                   icon: 'raphael:customer',
//                   path: '/general/invoice/ecommerceinvoice',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 96,
//                   RoleId: 2,
//                   title: 'Service Invoices ',
//                   icon: 'bi:table',
//                   path: '/general/invoice/service_invoice',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 97,
//               RoleId: 2,
//               title: 'Accounts',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 98,
//                   RoleId: 2,
//                   title: 'Razorpay Transaction',
//                   icon: '',
//                   path: '/general/transaction/razorpay',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 99,
//                   RoleId: 2,
//                   title: 'DayBook',
//                   icon: '',
//                   path: '/general/transaction/transaction-master',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 100,
//                   RoleId: 2,
//                   title: 'Tax Master',
//                   icon: '',
//                   path: '/general/transaction/tax',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 101,
//                   RoleId: 2,
//                   title: 'Supplier Payouts',
//                   icon: '',
//                   path: '/general/transaction/supplierpayouts',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 102,
//                   RoleId: 2,
//                   title: 'Pilot Payouts',
//                   icon: '',
//                   path: '/general/transaction/pilotPayout',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 103,
//                   RoleId: 2,
//                   title: 'Food Payouts',
//                   icon: '',
//                   path: '/general/transaction/restaurantPayout',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 104,
//               RoleId: 2,
//               title: 'Referrals',
//               icon: 'healthicons:referral-negative',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 105,
//                   RoleId: 2,
//                   title: 'Point value',
//                   icon: 'mdi:star-three-points-outline',
//                   path: '/general/referrals/point-value',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 106,
//                   RoleId: 2,
//                   title: 'Points-Table',
//                   icon: 'bi:table',
//                   path: '/general/referrals/points-table',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 116,
//               RoleId: 2,
//               title: 'Location',
//               icon: 'carbon:location-save',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 117,
//                   RoleId: 2,
//                   title: 'Country',
//                   icon: 'gis:search-country',
//                   path: '/general/location/country',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 118,
//                   RoleId: 2,
//                   title: 'State',
//                   icon: 'mdi:estate',
//                   path: '/general/location/state',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 119,
//                   RoleId: 2,
//                   title: 'City',
//                   icon: 'material-symbols-light:location-city',
//                   path: '/general/location/city',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 120,
//                   RoleId: 2,
//                   title: 'Zone',
//                   icon: 'carbon:area',
//                   path: '/general/location/area',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 121,
//                   RoleId: 2,
//                   title: 'Sub-Zone',
//                   icon: 'carbon:area',
//                   path: '/general/location/subzone',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 122,
//                   RoleId: 2,
//                   title: 'Tiers',
//                   icon: 'arcticons:tier',
//                   path: '/general/location/tiers',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 123,
//               RoleId: 2,
//               title: 'Avaliability Location',
//               icon: 'material-symbols-light:location-city',
//               path: '/general/avaliabilitylocation',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 124,
//               RoleId: 2,
//               title: 'Appversion',
//               icon: 'material-symbols:groups-2',
//               path: '/general/appversion',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 125,
//               RoleId: 2,
//               title: 'Groups',
//               icon: 'material-symbols:groups-2',
//               path: '/general/groups',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 126,
//               RoleId: 2,
//               title: 'Email-Template',
//               icon: 'tdesign:coupon',
//               path: '/general/mailFormat',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             }
//           ]
//         },
//         {
//           Id: 107,
//           title: 'Coupon',
//           icon: 'streamline:discount-percent-coupon',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: true,
//           children: [
//             {
//               Id: 108,
//               RoleId: 2,
//               title: 'New Coupons',
//               icon: 'tdesign:coupon',
//               path: '/general/newcoupon',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 108,
//               RoleId: 2,
//               title: 'Coupons',
//               icon: 'tdesign:coupon',
//               path: '/general/coupon/coupon-value',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 109,
//               RoleId: 2,
//               title: 'Coupon-Transaction',
//               icon: 'ant-design:transaction-outlined',
//               path: '/general/coupon/coupon-transaction',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             }
//           ]
//         },
//         {
//           Id: 110,
//           title: 'Banner',
//           icon: 'game-icons:tattered-banner',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: true,
//           children: [
//             {
//               Id: 111,
//               RoleId: 2,
//               title: 'Shop Banner',
//               icon: 'ph:flag-banner-fill',
//               path: '/general/banner/ecommerce-banner',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 112,
//               RoleId: 2,
//               title: 'Eat Banner',
//               icon: 'map:food',
//               path: '/general/banner/food-banner',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 113,
//               RoleId: 2,
//               title: 'Ride Banner',
//               icon: 'healthicons:truck-driver-negative',
//               path: '/general/banner/logistics-banner',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 114,
//               RoleId: 2,
//               title: 'Services Banner',
//               icon: 'healthicons:truck-driver-negative',
//               path: '/general/banner/services-banner',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 115,
//               RoleId: 2,
//               title: 'Banner Master',
//               icon: 'icon-park-outline:master',
//               path: '/general/banner/bannermaster',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             },
//             {
//               Id: 582,
//               RoleId: 2,
//               title: 'App Banner',
//               icon: 'ph:flag-banner-fill',
//               path: '/general/banner/app-banner',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true
//             }
//           ]
//         },
//         {
//           Id: 127,
//           title: 'Subscriptions',
//           icon: 'streamline:office-worker-solid',
//           path: '',
//           IsRead: true,
//           IsWrite: true,
//           IsDelete: true,
//           IsExemption: true,
//           children: [
//             {
//               Id: 128,
//               RoleId: 2,
//               title: 'Shop Subscriptions',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 129,
//                   RoleId: 2,
//                   title: 'Shop Pricing',
//                   icon: '',
//                   path: '/subscriptions/e-commerce/pricing',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 130,
//                   RoleId: 2,
//                   title: 'VIZHIL-Fee',
//                   icon: '',
//                   path: '/subscriptions/e-commerce/platform-fee',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 131,
//                   RoleId: 2,
//                   title: 'Delivery-Fee',
//                   icon: '',
//                   path: '/subscriptions/e-commerce/delivery-fee',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 132,
//                   RoleId: 2,
//                   title: 'Cost Estimation',
//                   icon: '',
//                   path: '/subscriptions/e-commerce/cost-estimation',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 133,
//               RoleId: 2,
//               title: 'Ride Subscriptions',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 134,
//                   RoleId: 2,
//                   title: 'Ride Pricing',
//                   icon: '',
//                   path: '/subscriptions/rides/pricing',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 135,
//                   RoleId: 2,
//                   title: 'Ride Estimation',
//                   icon: '',
//                   path: '/subscriptions/rides/estimation',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 136,
//                   RoleId: 2,
//                   title: 'Rental Pricing',
//                   icon: '',
//                   path: '/subscriptions/rides/rentalpackagepricing',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 137,
//                   RoleId: 2,
//                   title: 'Outstation Pricing',
//                   icon: '',
//                   path: '/subscriptions/rides/rideoutstation',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 138,
//                   RoleId: 2,
//                   title: 'Pilot Subscription',
//                   icon: '',
//                   path: '/subscriptions/rides/cost-estimation',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 139,
//               RoleId: 2,
//               title: 'Eat Subscriptions',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 140,
//                   RoleId: 2,
//                   title: 'Eat Cost Estimation',
//                   icon: '',
//                   path: '/subscriptions/food/cost-estimation',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             },
//             {
//               Id: 141,
//               RoleId: 2,
//               title: 'Service Subscriptions',
//               icon: 'ant-design:calculator-outlined',
//               path: '',
//               IsRead: true,
//               IsWrite: true,
//               IsDelete: true,
//               IsExemption: true,
//               children: [
//                 {
//                   Id: 142,
//                   RoleId: 2,
//                   title: 'Subscription Ratio',
//                   icon: 'ic:outline-category',
//                   path: '/subscriptions/services/ServicesSubscription',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 },
//                 {
//                   Id: 143,
//                   RoleId: 2,
//                   title: 'Location Cost',
//                   icon: '',
//                   path: '/subscriptions/services/locationCost',
//                   IsRead: true,
//                   IsWrite: true,
//                   IsDelete: true,
//                   IsExemption: true
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

// export const getuserRoles = createAsyncThunk('users/userRoles', async () => {
//   const Data: any = localStorage.getItem('userData1')
//   const Auth = JSON.parse(Data)
//   const endPoint = Lamda_Base_Url + '/sp_ViewUserRoleDetails'
//   console.log(Auth, 'Auth')

//   const apiParams = {
//     emailId: `${Auth.emailId}`
//   }

//   const paramString = new URLSearchParams(apiParams).toString()

//   return ApiClient.get(endPoint + '?' + paramString).then(res => {
//     //
//     return res?.data?.data[0]?.UserRoleName == 'Super Admin' ? data1 : res?.data
//     // return res?.data
//   })
// })

// export const userRolesSlice = createSlice({
//   name: 'appUsers',
//   initialState: {
//     userAccess: [],
//     loading: true,
//     tableaccess: {}
//   },
//   reducers: {
//     getTableAccess: (state, action) => {
//       state.tableaccess = {}
//       state.tableaccess = [...action.payload]
//     }
//   },
//   extraReducers: builder => {
//     builder.addCase(getuserRoles.fulfilled, (state, action) => {
//       state.userAccess = action.payload
//       state.loading = false
//     })
//   }
// })
// export const { getTableAccess } = userRolesSlice.actions
// export default userRolesSlice.reducer
