export function generateLargeGraphData(numNodes = 1000, numEdges = 100000) {
  const nodes = [];
  const links = [];

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      id: `Node_${i}`,
      group: Math.floor(Math.random() * 10),
      size: Math.random() * 10 + 5
    });
  }

  const edgeSet = new Set();
  for (let i = 0; i < numEdges; i++) {
    const source = `Node_${Math.floor(Math.random() * numNodes)}`;
    const target = `Node_${Math.floor(Math.random() * numNodes)}`;
    
    if (source !== target && !edgeSet.has(`${source}-${target}`)) {
      links.push({
        source,
        target,
        value: Math.random() * 5 + 1
      });
      edgeSet.add(`${source}-${target}`);
    }
  }

  return { nodes, links };
}

export function generateSampleCSVData(numRows = 100000) {
  const rows = ['Source,Target'];
  for (let i = 0; i < numRows; i++) {
    const source = Math.floor(Math.random() * 1000);
    const target = Math.floor(Math.random() * 1000);
    rows.push(`${source},${target}`);
  }
  return rows.join('\n');
}