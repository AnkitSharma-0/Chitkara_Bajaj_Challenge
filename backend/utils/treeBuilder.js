function generateHierarchyTree(node, graph) {

  const result = {};

  if (!graph[node]) {
    return result;
  }

  for (const child of graph[node]) {
    result[child] = generateHierarchyTree(child, graph);
  }

  return result;
}

function calculateTreeDepth(node, graph) {

  if (!graph[node] || graph[node].length === 0) {
    return 1;
  }

  let maxDepth = 0;

  for (const child of graph[node]) {

    maxDepth = Math.max(
      maxDepth,
      calculateTreeDepth(child, graph)
    );
  }

  return maxDepth + 1;
}

module.exports = { generateHierarchyTree, calculateTreeDepth };