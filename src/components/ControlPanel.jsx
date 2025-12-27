import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Slider,
  Box,
  Grid,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FilterListIcon from '@mui/icons-material/FilterList';

function ControlPanel({
  onPruneSelected,
  onResetPruning,
  onClearSelection,
  onFilterNodes,
  selectedNodesCount,
  selectedEdgesCount,
  prunedNodesCount,
  prunedEdgesCount,
  hasData
}) {
  const [minConnections, setMinConnections] = useState(1);

  const handleFilterChange = (event, newValue) => {
    setMinConnections(newValue);
    onFilterNodes(newValue);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Graph Controls
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          Selection Stats
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Chip
              label={`${selectedNodesCount} nodes selected`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`${selectedEdgesCount} edges selected`}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`${prunedNodesCount} nodes pruned`}
              color="error"
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              label={`${prunedEdgesCount} edges pruned`}
              color="warning"
              variant="outlined"
              size="small"
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          Selection Actions
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onPruneSelected}
              disabled={!hasData || (selectedNodesCount === 0 && selectedEdgesCount === 0)}
              fullWidth
              size="small"
            >
              Prune Selected
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ClearAllIcon />}
              onClick={onClearSelection}
              disabled={!hasData || (selectedNodesCount === 0 && selectedEdgesCount === 0)}
              fullWidth
              size="small"
            >
              Clear Selection
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={onResetPruning}
              disabled={!hasData || (prunedNodesCount === 0 && prunedEdgesCount === 0)}
              fullWidth
              size="small"
            >
              Reset All Pruning
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" gutterBottom color="textSecondary">
          Filter by Node Degree
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={minConnections}
            onChange={handleFilterChange}
            aria-labelledby="connections-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={50}
            disabled={!hasData}
          />
          <Typography variant="caption" color="textSecondary">
            Minimum connections: {minConnections}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => onFilterNodes(minConnections)}
          disabled={!hasData}
          fullWidth
          size="small"
          sx={{ mt: 2 }}
        >
          Apply Filter
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="caption">
          <strong>Tips:</strong> Click nodes/edges to select. Use Ctrl+Click for multiple selection. 
          Drag to pan, scroll to zoom.
        </Typography>
      </Alert>
    </Paper>
  );
}

export default ControlPanel;