function isValidEdge(edge) {
    
  const regex = /^[A-Z]->[A-Z]$/;

  if (!regex.test(edge)) {
    return false;
  }

  const [parent, child] = edge.split("->");

  return parent !== child;
}
module.exports = { isValidEdge };