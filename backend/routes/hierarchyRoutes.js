const express = require("express");
const { isValidEdge } = require("../utils/validator");

const {
  generateHierarchyTree,
  calculateTreeDepth
} = require("../utils/treeBuilder");

const { detectCycle } = require("../utils/cycleDetector");
const router = express.Router();

router.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: "Input data must be an array"
      });
    }

    const invalidEntries = [];
    const duplicateEdges = [];

    const graph = {};
    const parentMap = {};

    const uniqueEdges = new Set();
    const duplicateTracker = new Set();

    const validConnections = [];

    for (let edge of data) {

      edge = edge.trim();

      if (!isValidEdge(edge)) {
        invalidEntries.push(edge);
        continue;
      }

      if (uniqueEdges.has(edge)) {

        if (!duplicateTracker.has(edge)) {
          duplicateEdges.push(edge);
          duplicateTracker.add(edge);
        }

        continue;
      }

      uniqueEdges.add(edge);

      const [parent, child] = edge.split("->");

      if (parentMap[child]) {
        continue;
      }

      parentMap[child] = parent;

      if (!graph[parent]) {
        graph[parent] = [];
      }

      graph[parent].push(child);

      validConnections.push([parent, child]);
    }

    const allNodes = new Set();

    for (const [parent, child] of validConnections) {
      allNodes.add(parent);
      allNodes.add(child);
    }

    const childNodes = new Set(Object.keys(parentMap));

    const roots = [];

    for (const node of allNodes) {

      if (!childNodes.has(node)) {
        roots.push(node);
      }
    }

    if (roots.length === 0 && allNodes.size > 0) {
      roots.push([...allNodes].sort()[0]);
    }

    const hierarchyResults = [];

    let totalTrees = 0;
    let totalCycles = 0;

    let largestTreeRoot = "";
    let maximumDepth = 0;

    const processedNodes = new Set();

    for (const root of roots) {

      if (processedNodes.has(root)) {
        continue;
      }

      const visited = new Set();
      const recursionStack = new Set();

      const hasCycle = detectCycle(
        root,
        graph,
        visited,
        recursionStack
      );

      visited.forEach(node =>
        processedNodes.add(node)
      );

      if (hasCycle) {

        totalCycles++;

        hierarchyResults.push({
          root,
          hasCycle: true,
          tree: {}
        });

        continue;
      }

      const tree = {
        [root]: generateHierarchyTree(root, graph)
      };

      const depth = calculateTreeDepth(root, graph);

      totalTrees++;

      if (
        depth > maximumDepth ||
        (
          depth === maximumDepth &&
          root < largestTreeRoot
        )
      ) {
        maximumDepth = depth;
        largestTreeRoot = root;
      }

      hierarchyResults.push({
        root,
        depth,
        hasCycle: false,
        tree
      });
    }

    return res.status(200).json({

      success: true,

      user_id: "yourname_ddmmyyyy",

      email_id: "yourcollegeemail",

      college_roll_number: "yourrollnumber",

      hierarchies: hierarchyResults,

      invalid_entries: invalidEntries,

      duplicate_edges: duplicateEdges,

      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;