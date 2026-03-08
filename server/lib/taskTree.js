/**
 * Recursively build nested task tree from flat list
 * @param {Array} tasks - Flat array of tasks
 * @param {String|null} parentId - Parent task ID to filter by
 * @returns {Array} Nested task tree
 */
export function buildTree(tasks, parentId = null) {
  return tasks
    .filter((t) => t.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((task) => ({
      ...task,
      children: buildTree(tasks, task.id),
    }));
}

/**
 * Flatten a nested task tree into a flat array
 * @param {Array} tasks - Nested task tree
 * @returns {Array} Flat array of tasks
 */
export function flattenTree(tasks) {
  const result = [];
  
  function traverse(task) {
    const { children, ...taskData } = task;
    result.push(taskData);
    if (children && children.length > 0) {
      children.forEach(traverse);
    }
  }
  
  tasks.forEach(traverse);
  return result;
}

