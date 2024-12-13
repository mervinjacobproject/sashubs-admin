import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import { AuthContext } from 'src/context/AuthContext'
import Popup from './Popup'

const ManageProject = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<'edit' | 'delete' | null>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)
  const [showNoData, setShowNoData] = useState(false)
  const theme = useTheme()
  const { projectData }: any = useContext(AuthContext)
  const getRowClassName = (params: any) => {
    const isDarkMode = theme.palette.mode === 'dark'
    return params.indexRelativeToCurrentPage % 2 === 0
      ? isDarkMode
        ? 'even-row-dark'
        : 'even-row-light'
      : isDarkMode
      ? 'odd-row-dark'
      : 'odd-row-light'
  }

  const handleClick = (data: any, status: string) => {
    setCurrentRow(data)
    setCurrentAction(status === 'edit' ? 'edit' : 'delete')
    setIsModalOpen(true)
  }

  const handleClickUrl = (url: any) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const renderClient = (row: any) => {
    return (
      <CustomAvatar
        className='custom_avatar_logo'
        src={row?.icon}
        sx={{
          mr: 2.5,
          width: 38,
          height: 38,
          fontWeight: row?.avatar ? undefined : 500,
          fontSize: row?.avatar ? undefined : theme => theme.typography.body1.fontSize
        }}
        skin={!row?.avatar ? 'light' : undefined}
        color={!row?.avatar ? (row.avatarColor as ThemeColor) || 'primary' : undefined}
      >
        {row?.icon ? undefined : getInitials(row?.domainname)}
      </CustomAvatar>
    )
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentRow(null)
    setCurrentAction(null)
  }

  const defaultColumns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'sno',
      minWidth: 100,
      maxWidth: 100,
      headerName: 'SNo',
      renderCell: ({ row }: any) => {
        return <Typography>{row.sno}</Typography>
      }
    },
    {
      flex: 0.25,
      field: 'url',
      minWidth: 320,
      headerName: 'Project Name',
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  textTransform: 'uppercase'
                }}
              >
                {row?.domainname}
              </Typography>
              <Typography
                className='link_url_text'
                onClick={() => handleClickUrl(row?.domainurl)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                {row?.domainurl}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color='primary' onClick={() => handleClick(row, 'edit')}>
              <EditIcon />
            </IconButton>
            <IconButton color='error' onClick={() => handleClick(row, 'delete')}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const addSnoAndValue = (data: any) => {
    return data.map((item: any, index: any) => {
      item.sno = index + 1
      return item
    })
  }

  useEffect(() => {
    if (projectData?.length == 0 || projectData == undefined) {
      const timer = setTimeout(() => {
        setShowNoData(true)
      }, 10000)

      return () => clearTimeout(timer)
    } else {
      setShowNoData(false)
    }
  }, [projectData])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Head>
              <title>Admin Company Settings</title>
              <meta name='our-blogs' content='Growseb' key='desc' />
            </Head>

            <Grid item xs={12}>
              <Card>
                {projectData?.length == 0 && !showNoData ? (
                  <div style={{ padding: '20px' }}>
                    <Skeleton variant='rectangular' width='100%' height={62} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                    <Skeleton variant='rectangular' width='100%' height={62} style={{ marginTop: '10px' }} />
                  </div>
                ) : showNoData ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>No data available</div>
                ) : (
                  <>
                    {projectData && (
                      <DataGrid
                        autoHeight
                        pagination
                        rowHeight={62}
                        rows={addSnoAndValue(projectData.filter((row: any) => row.id != undefined))}
                        columns={defaultColumns}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        onRowSelectionModelChange={rows => setSelectedRows(rows)}
                        getRowClassName={getRowClassName}
                      />
                    )}
                  </>
                )}
              </Card>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {isModalOpen && (
        <Popup open={isModalOpen} action={currentAction} rowData={currentRow} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default ManageProject
