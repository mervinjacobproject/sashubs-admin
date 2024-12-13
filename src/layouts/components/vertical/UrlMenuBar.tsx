import { Avatar, Box } from '@mui/material'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface Project {
  id: string
  domainurl: string
}

interface SimpleListMenuProps {
  projectData: Project[]
  handleDomainChange: (domain: string) => void
}

export default function SimpleListMenu({ projectData, handleDomainChange,DomainID }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const open = Boolean(anchorEl)
  const { setIsPopupOpen, setTechSeoDashBoardData, setSeoPageAnalysisData }: any = useContext(AuthContext)

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  React.useEffect(()=>{
    if(DomainID && projectData && projectData.length > 0){
      const index = projectData.findIndex((item : any) => item.id == DomainID);
      setSelectedIndex(index)
    }
    
  },[projectData])
  

  const handleMenuItemClick = (val: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index)
    setAnchorEl(null)
    handleDomainChange(val)
    setTechSeoDashBoardData([])
    setSeoPageAnalysisData([])
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const selectedMode = localStorage.getItem('selectedMode') || 'light'
  const borderColor = selectedMode === 'dark' ? '#D0D4F141' : '#2F2B3D29'


  if (!projectData || projectData.length == '0') return <></>

  return (
    <Box sx={{ display: 'flex' }}>
      <Box className='project_list'>
        <List
          component='nav'
          aria-label='Domain selection'
          sx={{ bgcolor: 'background.paper', border: `1px solid ${borderColor}`, borderRadius: '5px', padding: '0' }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '0',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ListItemButton
              id='domain-button'
              aria-haspopup='listbox'
              aria-controls='domain-menu'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickListItem}
              style={{ width: '200px', paddingTop: '0', paddingBottom: '0', paddingLeft: '9px', paddingRight: '4px' }}
            >
              <ListItemText
                primary={
                  <span
                    style={{
                      maxWidth: '190px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      textTransform: 'uppercase',
                      fontSize: '17px'
                    }}
                  >
                    <Avatar
                      className='avatar_logo'
                      alt='Remy Sharp'
                      src={projectData[selectedIndex]?.icon}
                      style={{
                        marginRight: '6px',
                        objectFit: 'scale-down',
                        width: '20px',
                        height: '20px'
                      }}
                    />
                    {projectData[selectedIndex]?.domainname || 'No domain name'}
                  </span>
                }
                secondary={
                  <span
                    style={{
                      maxWidth: '190px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'inline-block'
                    }}
                  >
                    {projectData[selectedIndex]?.domainurl || 'No domains available'}
                  </span>
                }
              />
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </ListItemButton>
          </Box>
        </List>
        <Menu
          id='domain-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'domain-button',
            role: 'listbox'
          }}
        >
          {projectData.map((project: any, index: any) => (
            <MenuItem
              key={project.id}
              value={project.domainurl}
              selected={index === selectedIndex}
              sx={{ width: '330px' }}
              onClick={() => handleMenuItemClick(project.id, index)}
              // onClick={() => handleMenuItemClick(project.domainurl, index)}
            >
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
                <Avatar
                  className='avatar_logo'
                  alt='Remy Sharp'
                  src={project.icon}
                  style={{ marginRight: '6px', borderRadius: '50%', border: '1px solid #a5a9c4' }}
                />
                <div>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textTransform: 'uppercase'
                    }}
                  >
                    {project.domainname}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {project.domainurl}
                  </p>
                </div>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box
        className='project-add-btn'
        style={{
          cursor: 'pointer',
          alignSelf: 'center',
          border: `1px solid ${borderColor}`,
          textTransform: 'uppercase'
        }}
        onClick={() => setIsPopupOpen('add')}
      >
        Add Project
      </Box>
    </Box>
  )
}
