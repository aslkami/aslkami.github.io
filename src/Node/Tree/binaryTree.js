class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  add(element) {
    if (this.root == null) {
      this.root = new Node(element, null);
      this.size++;
      return;
    }
    let currentNode = this.root; // 默认从根节点开始查找
    let parent = null;
    let compare = null;
    while (currentNode) {
      compare = element - currentNode.element;
      parent = currentNode; // 记住父节点
      if (compare > 0) {
        // 大于当前节点放到右边
        currentNode = currentNode.right;
      } else if (compare < 0) {
        currentNode = currentNode.left;
      } else {
        currentNode.element = element;
        return;
      }
    }
    let newNode = new Node(element, parent);
    if (compare > 0) {
      parent.right = newNode;
    } else {
      parent.left = newNode;
    }
    this.size++;
  }
}
let bst = new BST();
let arr = [10, 8, 19, 6, 15, 22];
arr.forEach((item) => {
  bst.add(item);
});
console.dir(bst.root);
