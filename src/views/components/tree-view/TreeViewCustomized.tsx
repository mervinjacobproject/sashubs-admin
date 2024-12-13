// ** MUI Imports
import TreeItem from '@mui/lab/TreeItem'
import { alpha, styled } from '@mui/material/styles'
import MuiTreeView, { TreeViewProps } from '@mui/lab/TreeView'
import { TreeItemProps } from '@mui/lab/TreeItem'
import { createTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import Icon from 'src/@core/components/icon'



// Styled TreeView component
const TreeView = styled(MuiTreeView)<{ theme: any } & TreeViewProps<TreeItemProps>>(({ theme }: any) => ({
  minHeight: 264,
  '& .MuiTreeItem-iconContainer .close': {
    opacity: 0.3
  },
  '& .MuiTreeItem-group': {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`
  }
}))
const emptyTheme: Theme = createTheme();
const TreeViewCustomized = () => {
  return (
    <TreeView
    theme={emptyTheme}
    sx={{
      '& .MuiTreeItem-iconContainer .close': {
        opacity: 0.3
      },
      '& .MuiTreeItem-group': {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: (theme: Theme) => `1px dashed ${theme.palette.text.primary}`
      }
    }}
    defaultExpanded={['1']}
    defaultExpandIcon={<Icon icon='tabler:square-plus' />}
    defaultCollapseIcon={<Icon icon='tabler:square-minus' />}
    defaultEndIcon={<Icon icon='tabler:square-x' className='close' />}
  >
  </TreeView>
  )
}

export default TreeViewCustomized
