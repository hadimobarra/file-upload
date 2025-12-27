import _ from 'lodash';

export function processGraphData(parsedData) {
  if (!parsedData || parsedData.length === 0) {
    return { nodes: [], links: [] };
  }

  const nodeSet = new Set();
  parsedData.forEach(edge => {
    nodeSet.add(edge.source);
    nodeSet.add(edge.target);
  });


  const nodes = Array.from(nodeSet).map(id => ({
    id,
    group: Math.floor(Math.random() * 10), 
    size: Math.random() * 10 + 5
  }));


  const links = parsedData.map(edge => ({
    source: edge.source,
    target: edge.target,
    value: Math.random() * 5 + 1 
  }));

  return {
    nodes,
    links: _.uniqWith(links, (a, b) => 
      a.source === b.source && a.target === b.target
    )
  };
}

export function calculateGraphStats(graphData) {
  if (!graphData) return null;

  const nodeDegrees = {};
  graphData.links.forEach(link => {
    nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
    nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
  });

  const degrees = Object.values(nodeDegrees);
  
  return {
    totalNodes: graphData.nodes.length,
    totalEdges: graphData.links.length,
    avgDegree: degrees.reduce((a, b) => a + b, 0) / degrees.length,
    maxDegree: Math.max(...degrees),
    minDegree: Math.min(...degrees),
    density: (2 * graphData.links.length) / (graphData.nodes.length * (graphData.nodes.length - 1))
  };
}

export function filterGraphByDegree(graphData, minDegree) {
  if (!graphData) return null;

  const nodeDegrees = {};
  graphData.links.forEach(link => {
    nodeDegrees[link.source] = (nodeDegrees[link.source] || 0) + 1;
    nodeDegrees[link.target] = (nodeDegrees[link.target] || 0) + 1;
  });

  const filteredNodes = graphData.nodes.filter(node => 
    (nodeDegrees[node.id] || 0) >= minDegree
  );

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = graphData.links.filter(link => 
    filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
  );

  return {
    nodes: filteredNodes,
    links: filteredLinks
  };
}