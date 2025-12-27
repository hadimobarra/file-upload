import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';

function EdgeInfoPanel({ selectedEdges, highlightedEdges, graphData }) {
  const getEdgeInfo = (edgeId) => {
    if (!graphData) return null;
    
    const [sourceId, targetId] = edgeId.split('-');
    const edge = graphData.links.find(
      link => {
        const linkSource = link.source.id || link.source;
        const linkTarget = link.target.id || link.target;
        return `${linkSource}-${linkTarget}` === edgeId;
      }
    );
    
    if (!edge) return null;
    
    return {
      id: edgeId,
      source: sourceId,
      target: targetId,
      value: edge.value || 1
    };
  };

  const displayEdges = Array.from(
    new Set([...selectedEdges, ...highlightedEdges])
  ).slice(0, 10); 


  const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LinkIcon />
        Edge Information
      </Typography>
      
      {displayEdges.length > 0 ? (
        <>
          <Typography variant="caption" color="textSecondary">
            Showing {displayEdges.length} edges (selected/highlighted)
          </Typography>
          <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
            {displayEdges.map(edgeId => {
              const edgeInfo = getEdgeInfo(edgeId);
              if (!edgeInfo) return null;
              
              return (
                <ListItem
                  key={edgeId}
                  sx={{
                    borderLeft: 4,
                    borderColor: highlightedEdges.has(edgeId) ? 'warning.main' : 
                                 selectedEdges.has(edgeId) ? 'error.main' : 'secondary.main',
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">
                          {String(edgeInfo.source)} → {String(edgeInfo.target)}
                        </Typography>
                        <Chip
                          label={`Weight: ${edgeInfo.value.toFixed(1)}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={`Edge ID: ${edgeInfo.id}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          No edges selected. Click on edges in the graph to select them.
        </Typography>
      )}
    </Paper>
  );
}

export default EdgeInfoPanel;