import { IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Icon from 'src/@core/components/icon';
 
const FullscreenToggle: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
 
  useEffect(() => {
    localStorage.getItem('selectedmode');
  }, []);
 
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document as any).mozRequestFullScreen) {
        (document as any).mozRequestFullScreen();
      } else if ((document as any).webkitRequestFullscreen) {
        (document as any).webkitRequestFullscreen();
      } else if ((document as any).msRequestFullscreen) {
        (document as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
 
    setIsFullscreen(!isFullscreen);
  };
 
  const iconSrc = isFullscreen
    ? 'gridicons:fullscreen-exit'
    : 'tdesign:fullscreen-2';
 
  return (
    <IconButton onClick={toggleFullscreen}>
      <Icon fontSize="1.625rem" icon={iconSrc}  width={28} height={28} />
    </IconButton>
  );
};
 
export default FullscreenToggle;
 