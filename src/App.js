import React, { useState, useCallback, useMemo } from 'react';
import { Box, CssBaseline, Container, Typography, Alert, CircularProgress } from '@mui/material';
import FileUploader from './components/FileUploader';
import ControlPanel from './components/ControlPanel';
import GraphVisualization from './components/GraphVisualization';
import NodeInfoPanel from './components/NodeInfoPanel';
import EdgeInfoPanel from './components/EdgeInfoPanel';
import { parseCSV } from './utils/csvParser';
import { processGraphData } from './utils/graphUtils';
import './styles/App.css';

function App() {
  const [graphData, setGraphData] = useState(null);
  const [filteredGraphData, setFilteredGraphData] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectedEdges, setSelectedEdges] = useState(new Set());
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState(new Set());
  const [prunedNodes, setPrunedNodes] = useState(new Set());
  const [prunedEdges, setPrunedEdges] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphStats, setGraphStats] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const parsedData = await parseCSV(file);
      const processedData = processGraphData(parsedData);
      
      setGraphData(processedData);
      setFilteredGraphData(processedData);
      setSelectedNodes(new Set());
      setSelectedEdges(new Set());
      setPrunedNodes(new Set());
      setPrunedEdges(new Set());

      setGraphStats({
        nodes: processedData.nodes.length,
        edges: processedData.links.length,
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      setError(`Error loading file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNodeSelect = useCallback((node) => {
    if (!node || !node.id) return;
    
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(node.id)) {
      newSelected.delete(node.id);
    } else {
      newSelected.add(node.id);
    }
    setSelectedNodes(newSelected);
  }, [selectedNodes]);

  const handleEdgeSelect = useCallback((edge) => {
    if (!edge || !edge.source || !edge.target) return;
    
    const sourceId = edge.source.id || edge.source;
    const targetId = edge.target.id || edge.target;
    const edgeId = `${sourceId}-${targetId}`;
    
    const newSelected = new Set(selectedEdges);
    if (newSelected.has(edgeId)) {
      newSelected.delete(edgeId);
    } else {
      newSelected.add(edgeId);
    }
    setSelectedEdges(newSelected);
  }, [selectedEdges]);

  const handleNodeHighlight = useCallback((node) => {
    if (node && node.id) {
      setHighlightedNodes(new Set([node.id]));
      const connectedEdges = new Set();
      filteredGraphData?.links.forEach(link => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        if (sourceId === node.id || targetId === node.id) {
          connectedEdges.add(`${sourceId}-${targetId}`);
        }
      });
      setHighlightedEdges(connectedEdges);
    } else {
      setHighlightedNodes(new Set());
      setHighlightedEdges(new Set());
    }
  }, [filteredGraphData]);

  const handlePruneSelected = useCallback(() => {
    if (!filteredGraphData) return;

    const newPrunedNodes = new Set(prunedNodes);
    const newPrunedEdges = new Set(prunedEdges);
    selectedNodes.forEach(nodeId => newPrunedNodes.add(nodeId));
    
    selectedEdges.forEach(edgeId => newPrunedEdges.add(edgeId));

    setPrunedNodes(newPrunedNodes);
    setPrunedEdges(newPrunedEdges);

    const filteredNodes = filteredGraphData.nodes.filter(
      node => !newPrunedNodes.has(node.id)
    );
    
    const filteredLinks = filteredGraphData.links.filter(
      link => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        const edgeId = `${sourceId}-${targetId}`;
        return !newPrunedEdges.has(edgeId);
      }
    );

    setFilteredGraphData({
      nodes: filteredNodes,
      links: filteredLinks
    });

    setSelectedNodes(new Set());
    setSelectedEdges(new Set());
  }, [filteredGraphData, selectedNodes, selectedEdges, prunedNodes, prunedEdges]);

  const handleResetPruning = useCallback(() => {
    setPrunedNodes(new Set());
    setPrunedEdges(new Set());
    setFilteredGraphData(graphData);
    setSelectedNodes(new Set());
    setSelectedEdges(new Set());
  }, [graphData]);

  const handleClearSelection = useCallback(() => {
    setSelectedNodes(new Set());
    setSelectedEdges(new Set());
  }, []);

  const handleFilterNodes = useCallback((minConnections) => {
    if (!graphData) return;

    const nodeConnections = {};
    graphData.links.forEach(link => {
      const sourceId = link.source.id || link.source;
      const targetId = link.target.id || link.target;
      nodeConnections[sourceId] = (nodeConnections[sourceId] || 0) + 1;
      nodeConnections[targetId] = (nodeConnections[targetId] || 0) + 1;
    });

    const filteredNodes = graphData.nodes.filter(
      node => (nodeConnections[node.id] || 0) >= minConnections
    );

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(
      link => {
        const sourceId = link.source.id || link.source;
        const targetId = link.target.id || link.target;
        return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
      }
    );

    setFilteredGraphData({
      nodes: filteredNodes,
      links: filteredLinks
    });
  }, [graphData]);

  const displayGraphData = useMemo(() => {
    return filteredGraphData || graphData;
  }, [filteredGraphData, graphData]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          CSV Graph Visualizer
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
          Upload a CSV file with two columns (source, target) to visualize graph data
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FileUploader onFileUpload={handleFileUpload} disabled={loading} />
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Processing data (100K - 1M edges)...
              </Typography>
            </Box>
          )}
        </Box>

        {graphStats && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Loaded {graphStats.nodes} nodes and {graphStats.edges} edges | {graphStats.timestamp}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <ControlPanel
              onPruneSelected={handlePruneSelected}
              onResetPruning={handleResetPruning}
              onClearSelection={handleClearSelection}
              onFilterNodes={handleFilterNodes}
              selectedNodesCount={selectedNodes.size}
              selectedEdgesCount={selectedEdges.size}
              prunedNodesCount={prunedNodes.size}
              prunedEdgesCount={prunedEdges.size}
              hasData={!!graphData}
            />
            
            <Box sx={{ mt: 3 }}>
              <NodeInfoPanel
                selectedNodes={selectedNodes}
                highlightedNodes={highlightedNodes}
                graphData={displayGraphData}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <EdgeInfoPanel
                selectedEdges={selectedEdges}
                highlightedEdges={highlightedEdges}
                graphData={displayGraphData}
              />
            </Box>
          </Box>

          <Box sx={{ flex: 3, minHeight: '70vh', border: '1px solid #ddd', borderRadius: 1 }}>
            <GraphVisualization
              graphData={displayGraphData}
              onNodeSelect={handleNodeSelect}
              onEdgeSelect={handleEdgeSelect}
              onNodeHighlight={handleNodeHighlight}
              selectedNodes={selectedNodes}
              selectedEdges={selectedEdges}
              highlightedNodes={highlightedNodes}
              highlightedEdges={highlightedEdges}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;