
'use client'

import IconButton from '@mui/material/IconButton';


import Icon from 'src/@core/components/icon';


import { Mode } from 'src/@core/layouts/types';
import { Settings } from 'src/@core/context/settingsContext';
import React, { useEffect } from 'react';

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
}

const ModeToggler = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props;

  // ** Handle mode change
  const handleModeChange = (mode: Mode) => {
    document.documentElement.classList.toggle('dark-mode', mode === 'dark');
    saveSettings({ ...settings, mode });
  };

  // ** Handle mode toggle
  const handleModeToggle = () => {
    const newMode = settings.mode === 'light' ? 'dark' : 'light';
    handleModeChange(newMode);
  };

  
  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const initialMode = mediaQueryList.matches ? 'dark' : 'light';
    saveSettings({ ...settings, mode: initialMode });

    const handleChange = ({ matches }: { matches: boolean }) => {
      if (matches) {
        handleModeChange('dark' as Mode);
      } else {
        handleModeChange('light' as Mode);
      }
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, []); 
  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      <Icon fontSize='1.625rem' icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
    </IconButton>
  );
};

export default ModeToggler;
