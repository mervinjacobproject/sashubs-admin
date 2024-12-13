'use client'

// React Imports
import { useRef, useState, ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
// import { useSettings } from '@core/hooks/useSettings'

// TooltipProps interface for tooltip options
interface TooltipProps {
  title?: string
  [key: string]: any
}

// Option interface for menu options
interface Option {
  href?: string
  linkProps?: Record<string, any>
  text: string
  icon?: string | ReactNode
  menuItemProps?: Record<string, any>
  divider?: boolean
  dividerProps?: Record<string, any>
}

// IconButtonWrapper component props
interface IconButtonWrapperProps {
  tooltipProps?: TooltipProps
  children: ReactNode
}

// MenuItemWrapper component props
interface MenuItemWrapperProps {
  children: ReactNode
  option: Option
}

const IconButtonWrapper = ({ tooltipProps, children }: any) => {
  return tooltipProps?.title ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>
}

const MenuItemWrapper = ({ children, option }: MenuItemWrapperProps) => {
  if (option.href) {
    return (
      <Box component={Link} href={option.href} {...option.linkProps}>
        {children}
      </Box>
    )
  } else {
    return <>{children}</>
  }
}

interface OptionMenuProps {
  tooltipProps?: TooltipProps
  icon?: string | ReactNode
  iconClassName?: string
  options: Option[]
  leftAlignMenu?: boolean
  iconButtonProps?: Record<string, any>
}

const OptionMenu1 = ({
  tooltipProps,
  icon,
  iconClassName,
  options,
  leftAlignMenu,
  iconButtonProps,
}: any) => {
  // States
  const [open, setOpen] = useState<boolean>(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  // Hooks
  // const { settings } = useSettings()

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: any | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <IconButtonWrapper tooltipProps={tooltipProps}>
        <IconButton ref={anchorRef} size="small" onClick={handleToggle} {...iconButtonProps}>
          {typeof icon === 'string' ? (
            <i className={classnames(icon, iconClassName)} />
          ) : icon ? (
            icon
          ) : (
            <i className={classnames('tabler-dots-vertical', iconClassName)} />
          )}
        </IconButton>
      </IconButtonWrapper>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement={leftAlignMenu ? 'bottom-start' : 'bottom-end'}
        transition
        disablePortal
        sx={{ zIndex: 1 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper className={false ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open}>
                  {options.map((option:any, index:any) => {
                    if (typeof option === 'string') {
                      return (
                        <MenuItem key={index} onClick={handleClose}>
                          {option}
                        </MenuItem>
                      )
                    } else if ('divider' in option) {
                      return option.divider && <Divider key={index} {...option.dividerProps} />
                    } else {
                      return (
                        <MenuItem
                          key={index}
                          {...option.menuItemProps}
                          {...(option.href && { className: 'p-0' })}
                          onClick={e => {
                            handleClose(e)
                            option.menuItemProps?.onClick?.(e)
                          }}
                        >
                          <MenuItemWrapper option={option}>
                            {(typeof option.icon === 'string' ? <i className={option.icon} /> : option.icon) || null}
                            {option.text}
                          </MenuItemWrapper>
                        </MenuItem>
                      )
                    }
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default OptionMenu1
