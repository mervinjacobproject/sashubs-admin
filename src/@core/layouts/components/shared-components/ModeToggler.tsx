import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { Mode } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'

interface ModeTogglerProps {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const ModeToggler: React.FC<ModeTogglerProps> = props => {
  const { settings, saveSettings } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleModeChange = (mode: Mode) => {
    localStorage.setItem('selectedMode', mode);
    document.cookie = `selectedMode=${mode}; expires=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    saveSettings({ ...settings, mode: mode });
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleModeSelect = (mode: Mode) => {
    if (mode === 'light' || mode === 'dark') {
      localStorage.removeItem('systemMode')
    }
    handleModeChange(mode)
    handleMenuClose()
  }

  const themeSetter = () => {
    const updateAppTheme = (matches: any) => {
      const systemMode = matches ? 'dark' : 'light'

      handleModeChange(systemMode as Mode)
      handleMenuClose()
    }

    const initialTheme =
      localStorage.getItem('selectedMode') || window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'


    updateAppTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
    localStorage.setItem('systemMode', initialTheme)
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQueryList.addEventListener('change', updateAppTheme)

    return () => mediaQueryList.removeEventListener('change', updateAppTheme)
  }
  useEffect(() => {
    const systemModeInLocalStorage = localStorage.getItem('systemMode');
    const selectedModeFromCookie = document.cookie.replace(/(?:(?:^|.*;\s*)selectedMode\s*=\s*([^;]*).*$)|^.*$/, "$1");
    let initialMode;
    if (systemModeInLocalStorage) {
      initialMode = systemModeInLocalStorage;
    } else if (selectedModeFromCookie) {
      initialMode = selectedModeFromCookie;
    } else {
      initialMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('systemMode', initialMode);
    }
    handleModeChange(initialMode as Mode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleMenuOpen}>
        {localStorage.getItem('systemMode') ? (
          <Icon fontSize='1rem' icon='cil:laptop' width={25} height={25} />
        ) : (
          <>
            {settings.mode === 'dark' ? (

              <Icon fontSize='1.625rem' icon='tabler:moon-stars' width={25} height={22} />
            ) : (
              <Icon fontSize='1.625rem' icon='tabler:sun' width={25} height={22} />
            )}
          </>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px' }}
          onClick={() => handleModeSelect('light' as Mode)}
        >

          <Icon fontSize='1rem' icon='tabler:sun' width={25} height={25} />
          <Typography>Light</Typography>
        </MenuItem>
        <MenuItem
          sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px' }}
          onClick={() => handleModeSelect('dark' as Mode)}
        >
          <Icon fontSize='1rem' icon='tabler:moon-stars' width={20} height={20} />
          <Typography>Dark</Typography>
        </MenuItem>
        <MenuItem sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px' }} onClick={() => themeSetter()}>
          <Icon fontSize='1rem' icon='cil:laptop' width={25} height={25} />
          <Typography>System</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ModeToggler
