function detectCycle( node, graph, visited, recursionStack ){

  visited.add(node);
  recursionStack.add(node);

  if (graph[node]) {

    for (const child of graph[node]) {

      if (!visited.has(child)) {

        if (
          detectCycle(
            child,
            graph,
            visited,
            recursionStack
          )
        ) {
          return true;
        }

      } else if (
        recursionStack.has(child)
      ) {
        return true;
      }
    }
  }

  recursionStack.delete(node);

  return false;
}

module.exports = { detectCycle };