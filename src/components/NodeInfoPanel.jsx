import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';

function NodeInfoPanel({ selectedNodes, highlightedNodes, graphData }) {
  const getNodeInfo = (nodeId) => {
    if (!graphData) return null;
    
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    const connections = graphData.links.filter(
      link => (link.source.id === nodeId || link.source === nodeId) || 
              (link.target.id === nodeId || link.target === nodeId)
    ).length;
    
    return {
      id: nodeId,
      connections,
      group: node.group || 0,
      size: node.size || 5
    };
  };

  const displayNodes = Array.from(
    new Set([...selectedNodes, ...highlightedNodes])
  ).slice(0, 10); 

  const PersonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <PersonIcon />
        Node Information
      </Typography>
      
      {displayNodes.length > 0 ? (
        <>
          <Typography variant="caption" color="textSecondary">
            Showing {displayNodes.length} nodes (selected/highlighted)
          </Typography>
          <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
            {displayNodes.map(nodeId => {
              const nodeInfo = getNodeInfo(nodeId);
              if (!nodeInfo) return null;
              
              return (
                <ListItem
                  key={nodeId}
                  sx={{
                    borderLeft: 4,
                    borderColor: highlightedNodes.has(nodeId) ? 'warning.main' : 
                                 selectedNodes.has(nodeId) ? 'error.main' : 'primary.main',
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">
                          {String(nodeInfo.id)}
                        </Typography>
                        <Chip
                          label={`${nodeInfo.connections} connections`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={`Group: ${nodeInfo.group} | Size: ${nodeInfo.size.toFixed(1)}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          No nodes selected. Click on nodes in the graph to select them.
        </Typography>
      )}
    </Paper>
  );
}

export default NodeInfoPanel;