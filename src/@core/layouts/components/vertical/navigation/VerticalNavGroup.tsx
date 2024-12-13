// ** React Imports
import { useEffect, Fragment, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import Chip from '@mui/material/Chip'
// ** MUI Imports
// import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

// ** Third Party Imports
import clsx from 'clsx'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Utils
import { hasActiveChild, removeChildren } from 'src/@core/layouts/utils'

// ** Type Import
import { NavGroup, LayoutProps } from 'src/@core/layouts/types'

// ** Custom Components Imports
import VerticalNavItems from './VerticalNavItems'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'
import { useSelector } from 'react-redux'

interface Props {
  item: NavGroup
  navHover: boolean
  parent?: NavGroup
  navVisible?: boolean
  groupActive: string[]
  collapsedNavWidth: number
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  isSubToSub?: NavGroup | undefined
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (values: string[]) => void
  setCurrentActiveGroup: (items: string[]) => void
}

const MenuItemTextWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavGroup = (props: Props) => {
  // ** Props
  const {
    item,
    parent,
    settings,
    navHover,
    navVisible,
    isSubToSub,
    groupActive,
    setGroupActive,
    collapsedNavWidth,
    currentActiveGroup,
    setCurrentActiveGroup,
    navigationBorderWidth
  } = props

  // ** Hooks & Vars
  const router = useRouter()
  const currentURL = router.asPath
  const { direction, navCollapsed, verticalNavToggleType } = settings


  const toggleActiveGroup = (item: NavGroup, parent: NavGroup | undefined) => {
    let openGroup = groupActive

    // ** If Group is already open and clicked, close the group
    if (openGroup.includes(item.title)) {
      openGroup.splice(openGroup.indexOf(item.title), 1)

      // If clicked Group has open group children, Also remove those children to close those groups
      if (item.children) {
        removeChildren(item.children, openGroup, currentActiveGroup)
      }
    } else if (parent) {
      // ** If Group clicked is the child of an open group, first remove all the open groups under that parent
      if (parent.children) {
        removeChildren(parent.children, openGroup, currentActiveGroup)
      }

      // ** After removing all the open groups under that parent, add the clicked group to open group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    } else {
      openGroup = []

      // ** push Current Active Group To Open Group array
      if (currentActiveGroup.every(elem => groupActive.includes(elem))) {
        openGroup.push(...currentActiveGroup)
      }

      // ** Push current clicked group item to Open Group array
      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    }
    setGroupActive([...openGroup])
  }

  // ** Menu Group Click
  const handleGroupClick = () => {
    const openGroup = groupActive
    if (verticalNavToggleType === 'collapse') {
      if (openGroup.includes(item.title)) {
        openGroup.splice(openGroup.indexOf(item.title), 1)
      } else {
        openGroup.push(item.title)
      }
      setGroupActive([...openGroup])
    } else {
      toggleActiveGroup(item, parent)
    }
  }

  useEffect(() => {
    if (hasActiveChild(item, currentURL)) {
      if (!groupActive.includes(item.title)) groupActive.push(item.title)
    } else {
      const index = groupActive.indexOf(item.title)
      if (index > -1) groupActive.splice(index, 1)
    }
    setGroupActive([...groupActive])
    setCurrentActiveGroup([...groupActive])

    // Empty Active Group When Menu is collapsed and not hovered, to fix issue route change
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  useEffect(() => {
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }

    if ((navCollapsed && navHover) || (groupActive.length === 0 && !navCollapsed)) {
      setGroupActive([...currentActiveGroup])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navCollapsed, navHover])

  useEffect(() => {
    if (groupActive.length === 0 && !navCollapsed) {
      setGroupActive([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navHover])

  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon

  const menuGroupCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const pageNames = useSelector((state: any) => state.role.pageNames)

  const mappedPageNames = pageNames.map((page:any) => ({
    pagename: page.pagegroup === 'Deleted' ? page.pagename.replace(/^Deleted /, '') : page.pagename,
    createpermission: page.createpermission,
    viewpermission: page.viewpermission,
    writepermission: page.writepermission,
    pagegroup: page.pagegroup
}));

const filteredPages = mappedPageNames.filter((page:any) => page.pagegroup === item.title);
let hideItemTitle = false;

if (filteredPages.length > 0) {
    hideItemTitle = filteredPages.every((page:any) => (
        page.createpermission === 0 && page.viewpermission === 0 && page.writepermission === 0
    ));
}

  return (
    <CanViewNavGroup navGroup={item}>
      <Fragment>
        <ListItem
          disablePadding
          className='nav-group'
          onClick={handleGroupClick}
          sx={{ mt: 1, px: '0 !important', flexDirection: 'column' }}
        >
          <ListItemButton
            className={clsx({
              'Mui-selected': groupActive.includes(item.title) || currentActiveGroup.includes(item.title)
            })}
            sx={{
              py: 2,
              mx: 3.5,
              borderRadius: 1,
              width: theme => `calc(100% - ${theme.spacing(3.5 * 2)})`,
              transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
              px: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : 4,
              '&:hover': {
                backgroundColor: 'action.hover'
              },
              '& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
                color: 'text.secondary'
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected'
                },
                '& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
                  color: 'text.primary'
                },
                '& .menu-item-meta > svg': {
                  color: 'text.secondary'
                },
                '&.Mui-focusVisible': {
                  backgroundColor: 'action.focus',
                  '&:hover': {
                    backgroundColor: 'action.focus'
                  }
                }
              }
            }}
          >
         {!hideItemTitle &&    <ListItemIcon
              sx={{
                transition: 'margin .25s ease-in-out',
                ...(parent && navCollapsed && !navHover ? {} : { mr: 2 }),
                ...(navCollapsed && !navHover ? { mr: 0 } : {}),
                ...(parent && item.children ? { ml: 1.5, mr: 3.5 } : {})
              }}
            >
              <UserIcon icon={icon as string} {...(parent && { fontSize: '0.625rem' })} />
            </ListItemIcon>}
            <MenuItemTextWrapper sx={{ ...menuGroupCollapsedStyles, ...(isSubToSub ? { ml: 2 } : {}) }}>
            <Typography
        {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
            noWrap: true
        })}
    >
        {!hideItemTitle && <Translations text={item.title} />}
    </Typography>
              <Box
                className='menu-item-meta'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    color: 'text.disabled',
                    transition: 'transform .25s ease-in-out',
                    ...(groupActive.includes(item.title) && {
                      transform: direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)'
                    })
                  }
                }}
              >
                {item.badgeContent ? (
                  <Chip
                    size='small'
                    label={item.badgeContent}
                    color={item.badgeColor || 'primary'}
                    sx={{
                      mr: 2,
                      height: 22,
                      minWidth: 22,
                      '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                    }}
                  />
                ) : null}
             {!hideItemTitle  && <Icon fontSize='1.125rem' icon={direction === 'ltr' ? 'tabler:chevron-right' : 'tabler:chevron-left'} />}
              </Box>
            </MenuItemTextWrapper>
          </ListItemButton>
          <Collapse
            component='ul'
            onClick={e => e.stopPropagation()}
            in={groupActive.includes(item.title)}
            sx={{
              pl: 0,
              width: '100%',
              ...menuGroupCollapsedStyles,
              transition: 'all 0.25s ease-in-out'
            }}
          >
             {!hideItemTitle && (
            <VerticalNavItems
              {...props}
              parent={item}
              navVisible={navVisible}
              verticalNavItems={item.children}
              isSubToSub={parent && item.children ? item : undefined}
            />
             )}
          </Collapse>
        </ListItem>
      </Fragment>
    </CanViewNavGroup>
  )
}

export default VerticalNavGroup