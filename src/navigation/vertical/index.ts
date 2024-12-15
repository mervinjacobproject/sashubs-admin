// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Masters',
      icon: 'radix-icons:dashboard'
    },
    {
      icon: 'mingcute:ai-line',
      title: 'SASHUBS',
      path: '/dashboards/analytics'
    },
    {
      title: 'Category',
      icon: 'material-symbols-light:military-tech-outline',
      children: [
        {
          title: 'Parent Category',
          icon: 'hugeicons:dashboard-square-02',
          path: '/category/ParentCategory'
        },
        {
          title: 'Sub Category',
          icon: 'oui:pages-select',
          path: '/category/SubCategory'
        }
      ]
    }
  ]
}

export default navigation
