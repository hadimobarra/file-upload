import React, { useRef, useCallback, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box, Typography, Button, ButtonGroup, Paper } from '@mui/material';

function GraphVisualization({
  graphData,
  onNodeSelect,
  onEdgeSelect,
  onNodeHighlight,
  selectedNodes,
  selectedEdges,
  highlightedNodes,
  highlightedEdges
}) {
  const fgRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleNodeClick = useCallback((node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const handleEdgeClick = useCallback((edge) => {
    onEdgeSelect(edge);
  }, [onEdgeSelect]);

  const handleNodeHover = useCallback((node) => {
    onNodeHighlight(node);
  }, [onNodeHighlight]);

  const handleZoomIn = () => {
    if (fgRef.current) {
      fgRef.current.zoom(zoomLevel * 1.2, 1000);
      setZoomLevel(zoomLevel * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (fgRef.current) {
      fgRef.current.zoom(zoomLevel / 1.2, 1000);
      setZoomLevel(zoomLevel / 1.2);
    }
  };

  const handleFitView = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(1000);
      setZoomLevel(1);
    }
  };

  const ZoomInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  );

  const ZoomOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13H5v-2h14v2z"/>
    </svg>
  );

  const FitScreenIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v2H6zm0 10h2v2H6zM6 10h2v4H6zm10 0h2v4h-2zm0 6h2v2h-2zm0-10h2v2h-2z"/>
    </svg>
  );

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const label = String(node.id);
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    let fillColor = '#1f77b4'; 
    if (highlightedNodes.has(node.id)) {
      fillColor = '#ff7f0e'; 
    } else if (selectedNodes.has(node.id)) {
      fillColor = '#d62728'; 
    }


    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();

    if (globalScale > 0.5) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.fillText(label, node.x, node.y - 10);
    }
  }, [selectedNodes, highlightedNodes]);

  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const sourceId = link.source.id || link.source;
    const targetId = link.target.id || link.target;
    const edgeId = `${sourceId}-${targetId}`;
    
    let strokeColor = '#999';
    let lineWidth = 1;
    
    if (highlightedEdges.has(edgeId)) {
      strokeColor = '#ff7f0e';
      lineWidth = 3;
    } else if (selectedEdges.has(edgeId)) {
      strokeColor = '#d62728';
      lineWidth = 2;
    }

    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth / globalScale;
    ctx.stroke();
  }, [selectedEdges, highlightedEdges]);

  return (
    <Box sx={{ width: '100%', height: '70vh', position: 'relative' }}>
      {graphData ? (
        <>
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="id"
            nodeRelSize={6}
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onLinkClick={handleEdgeClick}
            onNodeHover={handleNodeHover}
            linkDirectionalArrowLength={3}
            linkDirectionalArrowRelPos={1}
            cooldownTime={3000}
            warmupTicks={100}
            d3AlphaDecay={0.01}
            d3VelocityDecay={0.3}
          />
          
          <Paper sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10,
            p: 1
          }}>
            <ButtonGroup orientation="vertical" size="small">
              <Button onClick={handleZoomIn} title="Zoom In">
                <ZoomInIcon />
              </Button>
              <Button onClick={handleZoomOut} title="Zoom Out">
                <ZoomOutIcon />
              </Button>
              <Button onClick={handleFitView} title="Fit View">
                <FitScreenIcon />
              </Button>
            </ButtonGroup>
            <Typography variant="caption" display="block" align="center">
              Zoom: {zoomLevel.toFixed(1)}x
            </Typography>
          </Paper>
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          flexDirection: 'column',
          color: 'text.secondary'
        }}>
          <Typography variant="h6" gutterBottom>
            No graph data loaded
          </Typography>
          <Typography variant="body2">
            Upload a CSV file to visualize the graph
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default GraphVisualization;