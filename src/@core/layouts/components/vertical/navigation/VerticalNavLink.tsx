import { ElementType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'
import themeConfig from 'src/configs/themeConfig'
import { NavLink, NavGroup } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { handleURLQueries } from 'src/@core/layouts/utils'
import { useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'

interface Props {
  parent?: boolean
  item: NavLink
  navHover?: boolean
  settings: Settings
  navVisible?: boolean
  collapsedNavWidth: number
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  isSubToSub?: NavGroup | undefined
}

const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  marginLeft: theme.spacing(3.5),
  marginRight: theme.spacing(3.5),
  borderRadius: theme.shape.borderRadius,
  transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&.active': {
    '&, &:hover': {
      boxShadow: `0px 2px 6px ${hexToRGBA(theme.palette.primary.main, 0.48)}`,
      background: `linear-gradient(72.47deg, ${
        theme.direction === 'ltr' ? theme.palette.primary.main : hexToRGBA(theme.palette.primary.main, 0.7)
      } 22.16%, ${
        theme.direction === 'ltr' ? hexToRGBA(theme.palette.primary.main, 0.7) : theme.palette.primary.main
      } 76.47%)`,
      '&.Mui-focusVisible': {
        background: `linear-gradient(72.47deg, ${theme.palette.primary.dark} 22.16%, ${hexToRGBA(
          theme.palette.primary.dark,
          0.7
        )} 76.47%)`
      }
    },
    '& .MuiTypography-root, & svg': {
      color: `${theme.palette.common.white} !important`
    }
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavLink = ({ item, parent, navHover, settings, navVisible, isSubToSub, toggleNavVisibility }: Props) => {
  const router = useRouter()
  const { navCollapsed } = settings
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }
  // const pageNames = useSelector((state: any) => state.role.pageNames);
  // const pageMaster = useSelector((state: any) => state.pageMaster.pageMaster);

  // const mappedPermissions = pageNames
  //   .map((pageName:any) => {
  //     const matchingPage = pageMaster.find((page:any) => page.ID === pageName.PageId);

  //     if (matchingPage) {
  //       return {
  //         GroupName: matchingPage.GroupName,
  //         PageName: matchingPage.PageName,
  //         CreatePermission: pageName.CreatePermission,
  //         ViewPermission: pageName.ViewPermission,
  //         WritePermission: pageName.WritePermission,
  //       };
  //     }

  //     return null;
  //   })
  //   .filter(Boolean);

  // const isPermissionGranted = (pageName: string) => {
  //   const matchingPermission = mappedPermissions.find(
  //     (permission: any) => permission.PageName === pageName
  //   );

  //   if (matchingPermission) {
  //     return (
  //       matchingPermission.CreatePermission ||
  //       matchingPermission.ViewPermission ||
  //       matchingPermission.WritePermission
  //     );
  //   }
  //   return false;
  // };

  // const isItemGranted = () => {
  //   return isPermissionGranted(item.title);
  // };

  // if (!isItemGranted()) {
  //   return null;
  // }

  return (
    <CanViewNavLink navLink={item}>
      <Tooltip title={item.title == 'Growseb AIe' ? 'Score Card' : item.title} placement='right'>
        <ListItem disablePadding className='nav-link' sx={{ mt: 1, px: '0 !important' }}>
          <MenuNavLink
            component={Link}
            {...(item.disabled && { tabIndex: -1, disabled: true })} // Set disabled here
            className={isNavLinkActive() ? 'active' : ''}
            href={item.path === undefined ? '/' : `${item.path}`}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
          >
            <ListItemIcon
              sx={{
                transition: 'margin .25s ease-in-out',
                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2 }),
                ...(parent ? { ml: 1.5, mr: 3.5 } : {}),
                '& svg': {
                  fontSize: '0.625rem',
                  ...(!parent ? { fontSize: '1.375rem' } : {}),
                  ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                }
              }}
            >
              <UserIcon icon={icon as string} />
            </ListItemIcon>

            <MenuItemTextMetaWrapper
              sx={{
                ...(isSubToSub ? { ml: 2 } : {}),
                ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
              }}
            >
              <Typography
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
              >
                <Translations text={item.title} />
              </Typography>
              {item.badgeContent ? (
                <Chip
                  size='small'
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{ height: 22, minWidth: 22, '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' } }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </ListItem>
      </Tooltip>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
