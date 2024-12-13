import React, { useCallback, useEffect, forwardRef, useRef } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { margin } from '@mui/system';

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any, edges: any, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

// Create nodes based on form values
// const createNodesFromFormValues = (formValues: any) => {
//   const nodes = [];
//   if (formValues?.L1Name) {
//     nodes.push({ id: '1', position: { x: 0, y: 0 }, data: { label: formValues.L1Name } });
//   }
//   else
//   {
//     nodes.push({ id: '1', position: { x: 0, y: 0 }, data: { label: 'L1' } });
//   }
//   if (formValues?.L2Name) {
//     nodes.push({ id: '2', position: { x: 0, y: 0 }, data: { label: formValues.L2Name } });
//   }
//   else
//   {
//     nodes.push({ id: '2', position: { x: 0, y: 0 }, data: { label: 'L2' } });
//   }
//   if (formValues?.L3Name) {
//     nodes.push({ id: '3', position: { x: 0, y: 0 }, data: { label: formValues.L3Name } });
//   }
//   else
//   {
//     nodes.push({ id: '3', position: { x: 0, y: 0 }, data: { label: 'L3' } });
//   }
//   if (formValues?.L4Name) {
//     nodes.push({ id: '4', position: { x: 0, y: 0 }, data: { label: formValues.L4Name } });
//   }
//   else
//   {
//     nodes.push({ id: '4', position: { x: 0, y: 0 }, data: { label: 'L4' } });
//   }
//   if (formValues?.L5Name) {
//     nodes.push({ id: '5', position: { x: 0, y: 0 }, data: { label: formValues.L5Name } });
//   }
//   else
//   {
//     nodes.push({ id: '5', position: { x: 0, y: 0 }, data: { label: 'L5' } });
//   }
//   if (formValues?.L6Name) {
//     nodes.push({ id: '6', position: { x: 0, y: 0 }, data: { label: formValues.L6Name  } });
//   }
//   else
//   {
//     nodes.push({ id: '6', position: { x: 0, y: 0 }, data: { label: 'L6' } });
//   }

//   return nodes;
// };
const createNodesFromFormValues = (formValues: any) => {
  const nodes: any = [];

  // Conditionally add nodes with colors based on formValues
  const levelColors: any = {
    L1: '#ff9999', // Light red
    L2: '#99ff99', // Light green
    L3: '#9999ff', // Light blue
    L4: '#ffff99', // Light yellow
    L5: '#ffcc99', // Light orange
    L6: '#cc99ff', // Light purple
  };
  const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

  levels.forEach((level, index) => {
    const nameKey = `${level}Name`;
    const nodeId = (index + 1).toString();
    const nodeName = `${formValues?.[nameKey]} (${level})` || ''; 
    if (nodeName && formValues?.[nameKey]) {
      nodes.push({
        id: nodeId,
        position: { x: 0, y: 0 }, // Adjust position as needed
        data: { label: nodeName },
      });
    }
  });

  return nodes;
};

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }, // Connect L1 to L2
  { id: 'e2-3', source: '2', target: '3' }, // Connect L2 to L3
  { id: 'e3-4', source: '3', target: '4' }, // Connect L3 to L4
  { id: 'e4-5', source: '4', target: '5' }, // Connect L4 to L5
  { id: 'e5-6', source: '5', target: '6' }, // Connect L5 to L6
];

interface customerProps {
  handleNext: () => void;
  ref: any;
  editid: any;
  onFetchData: any;
  createId: any;
  customer: any;
}

export interface CustomerReferenceMethods {
  childMethod: (id: any) => void;
  triggerValidation: () => Promise<boolean>;
  editid: any;
}

const TreeLayout: React.FC<customerProps> = forwardRef<CustomerReferenceMethods, customerProps>(
  ({ handleNext, editid, createId, customer, onFetchData }, ref) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [formValues, setFormValues] = React.useState<any>({});
const [id, setId] = React.useState<any>();
    const updateLayout = useCallback(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    }, [nodes, edges]);

    // Automatically update the layout whenever nodes or edges change
    useEffect(() => {
      updateLayout();
    }, [nodes, edges, updateLayout]);

    // Fetch the form data based on editid
    const getFormDetails = useCallback(
      async (id: any) => {
        try {
          if (customer !== undefined) {
            const selectedRow = customer.find((row: any) => row.Id === id);
            //console.log('selectedRow', selectedRow);
            setFormValues(selectedRow);
          }
        } catch (err) {
          console.error(err); // Log the error
        }
      },
      [customer]
    );

    // Update the nodes when formValues change
    useEffect(() => {
      if (formValues) {
        const dynamicNodes = createNodesFromFormValues(formValues);
        setNodes(dynamicNodes);
      }
    }, [formValues]);

    // Fetch the form values when editid changes
    useEffect(() => {
      if (editid) {
        getFormDetails(editid);
      }
    }, [editid, getFormDetails]);
    const onNodeClick = (event: React.MouseEvent, node: any) => {
      const label = node.data.label.split(' (')[0].trim();
      try {
        if (customer !== undefined) {
          const selectedRow = customer.find((row: any) => row.CustomerName == label);
          //console.log('selectedRow', selectedRow.Id);
          window.open(`/view/CustomerDetails?customerID=${selectedRow.Id}`, '_blank');
          //setId(selectedRow);
        }
      } catch (err) {
        console.error(err); // Log the error
      }
    };
    
    
    

    return (
      <div style={{  height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ReactFlow   nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={onNodeClick}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
    );
  }
);

export default TreeLayout;
