// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Masters',
      icon: 'carbon:dashboard'
    },
    {
      icon: 'carbon:dashboard',
      title: 'Dashboard',
      children: [
        {
          title: 'CRM Dashboard',
          icon: 'fluent-mdl2:b-i-dashboard',
          path: '/dashboards/analytics'
        }
      ]
    },
    {
      title: 'Categories',
      icon: 'tabler:category',
      children: [
        {
          title: 'Parent Category',
          icon: 'carbon:parent-child',
          path: '/category/ParentCategory'
        },
        {
          title: 'Sub Category',
          icon: 'carbon:category',
          path: '/category/SubCategory'
        }
      ]
    },
    {
      title: 'User Permission',
      icon: 'solar:shield-user-outline',
      children: [
        {
          title: 'URL Master',
          icon: 'line-md:link',
          path: '/userpermission/urlMaster'
        },
        {
          title: 'Roles',
          icon: 'oui:app-users-roles',
          path: '/userpermission/roles'
        },
        {
          title: 'Role Permissions',
          icon: 'icon-park-outline:permissions',
          path: '/userpermission/rolePermission'
        },
        {
          title: 'Admin Users',
          icon: 'ri:admin-line',
          path: '/dashboards/analytics'
        }
      ]
    }
  ]
}

export default navigation
