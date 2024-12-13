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
      title: 'GROWSEB AI',
      path: '/dashboards/crm'
    },
    {
      title: 'Tech Seo',
      icon: 'material-symbols-light:military-tech-outline',
      children: [
        {
          title: 'Dashboard',
          icon: 'hugeicons:dashboard-square-02',
          path: '/tech-seo/dashboard'
        },
        {
          title: 'Pages',
          icon: 'oui:pages-select',
          path: '/tech-seo/pages'
        }
      ]
    },
    // {
    //   title: 'SEO',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'Domain Overview',
    //       icon: 'game-icons:shop',
    //       path: '/merchant'
    //     },
    {
      title: 'Ranking Monitor',
      icon: 'mdi-light:chart-line'
    },
    {
      title: 'Web Audit',
      icon: 'fluent:clipboard-checkmark-20-regular'
    },
    {
      title: 'Web Analytics',
      icon: 'mdi-light:chart-bar'
    },
    {
      title: 'Link Profiler',
      icon: 'solar:link-bold'
    },
    // {
    //   title: 'Link Building',
    //   icon: 'solar:link-bold',
    // },
    {
      title: 'Social Media',
      icon: 'tabler:social'
    },
    {
      title: 'Page Optimization',
      icon: 'iconoir:page-star'
    },
    {
      title: 'Keywords',
      icon: 'solar:key-broken'
    },
    {
      title: 'Competitor Spy',
      icon: 'mdi:spy'
    },
    {
      title: 'Website Submission',
      icon: 'teenyicons:send-outline'
    },
    {
      title: 'Client Reports',
      icon: 'icon-park-outline:table-report'
    }
    // {
    //   title: 'SEO',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'Domain Overview',
    //       icon: 'game-icons:shop',
    //       path: '/merchant'
    //     },
    //     {
    //       title: 'Keyword Research Tool',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/mercha'
    //     },
    //     {
    //       title: 'Site Audit Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merc'
    //     },
    //     {
    //       title: 'Backlink Analysis Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-prchase'
    //     },
    //     {
    //       title: 'Rank Tracking Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/pois-purchase'
    //     },
    //     {
    //       title: 'Competitor Analysis Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/pointurchase'
    //     },
    //     {
    //       title: 'On-Page SEO Checker',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/pots-purchase'
    //     },
    //     {
    //       title: 'Log File Analyzer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/pointsrchase'
    //     },
    //     {
    //       title: 'Listing Management',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Enterprise SEO Software',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //   ]
    // },
    // {
    //   title: 'Content',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'GROWSEB Content Scorer',
    //       icon: 'game-icons:shop',
    //       path: '/merchant/merchant'
    //     },
    //     {
    //       title: 'Topic Modeling Tool',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/merchant/merchant-Subscription'
    //     },
    //     {
    //       title: 'Content Similarity Checker',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Keyword Density Analyzer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'SERP Snippet Preview Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Content Idea Generator',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Sentiment Analysis for SEO Content',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Readability Optimizer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Image Analyzer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'SEO Content Template',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Blog Idea Generator',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //   ]
    // },
    // {
    //   title: 'Social Media',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'Social Dashboard',
    //       icon: 'game-icons:shop',
    //       path: '/merchant/merchant'
    //     },
    //     {
    //       title: 'Engagement Metric Tracker',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/merchant/merchant-Subscription'
    //     },
    //     {
    //       title: 'Social Media Content Scheduler with SEO Insights',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Social Media Keyword Analyzer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Competitor Social Media Analysis Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Social Media Sentiment Analysis for SEO Content Planning',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Influencer Identification Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Social Media Backlink Tracker',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'YouTube Video SEO Optimizer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Social Media Share Prediction Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Social Listening Tool for Content Strategy',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //   ]
    // },
    // {
    //   title: 'Market Research',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'Keyword Trend Analysis',
    //       icon: 'game-icons:shop',
    //       path: '/merchant/merchant'
    //     },
    //     {
    //       title: 'Competitor Analysis',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/merchant/merchant-Subscription'
    //     },
    //     {
    //       title: 'Audience Interest Analysis',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Content Gap Analysis',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Backlink Opportunity Finder',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'SERP Feature Analysis',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Competitor Content Quality and Engagement Analysis',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Market Opportunity Analysis',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //   ]
    // },
    // {
    //   title: 'Advertising',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'Keyword Research for Ads',
    //       icon: 'game-icons:shop',
    //       path: '/merchant/merchant'
    //     },
    //     {
    //       title: 'Ad Copy Analysis and Optimization',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/merchant/merchant-Subscription'
    //     },
    //     {
    //       title: 'Competitor Ad Tracking',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Ad Position and Rank Tracker',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Ad Performance Analytics',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Advertising Research',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Landing Page Optimization for Ads',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Ad Budget Allocation Optimizer',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Click Fraud Detection',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Dynamic Ad Campaign Generation',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Cost-Per-Click (CPC) Estimator for Keywords',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //   ]
    // },
    // {
    //   title: 'Growseb AI',
    //   icon: 'game-icons:shop',
    //   children: [
    //     {
    //       title: 'AI-Powered Keyword Research Tool',
    //       icon: 'game-icons:shop',
    //       path: '/merchant/merchant'
    //     },
    //     {
    //       title: 'AI-Enhanced Content Optimization Tool',
    //       icon: 'streamline:subscription-cashflow',
    //       path: '/merchant/merchant-Subscription'
    //     },
    //     {
    //       title: 'AI-Based Content Generation Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Automated Meta Tag Generator',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Automated Link-Building Suggestions',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'SERP Analysis and Position Prediction',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'Image ALT Text Generator',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },
    //     {
    //       title: 'AI-Powered Content Audit Tool',
    //       icon: 'fluent:book-coins-20-regular',
    //       path: '/merchant/points-purchase'
    //     },

    //   ]
    // },

    // {
    //   title: 'Card List',
    //   icon: 'fluent-mdl2:product-variant',
    //   path: '/product/product'
    // },
    // {
    //   title: 'Order List',
    //   icon: 'fluent-mdl2:product-variant',
    //   path: '/product/order'
    // },
  ]
}

export default navigation
