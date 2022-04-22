// 双向链表
class Node {
  constructor(element, prev, next) {
    this.element = element;
    this.next = next;
    this.prev = prev;
  }
}
class LinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }
  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('越界');
    }
    let current;
    if (index < this.size >> 1) {
      current = this.head;
      for (let i = 0; i < index; i++) {
        current = current.next;
      }
    } else {
      current = this.tail;
      for (let i = this.size - 1; i > index; i--) {
        current = current.prev;
      }
    }
    return current;
  }
  add(index, element) {
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) throw new Error('越界');
    // 向后添加的情况
    if (index == this.size) {
      let oldLast = this.tail;
      this.tail = new Node(element, oldLast, null);
      if (oldLast == null) {
        // 第一个添加的
        this.head = this.tail;
      } else {
        oldLast.next = this.tail;
      }
    } else {
      let nextNode = this._node(index);
      let prevNode = nextNode.prev;
      let node = new Node(element, prevNode, nextNode);
      nextNode.prev = node; // 添加当前的节点
      if (prevNode == null) {
        this.head = node;
      } else {
        prevNode.next = node;
      }
    }
    this.size++;
  }
  remove(index) {
    if (index < 0 || index >= this.size) throw new Error('越界');
    let node = this._node(index);
    prev = node.prev;
    next = node.next;
    if (prev === null) {
      this.head = next;
    } else {
      prev.next = next;
    }
    if (next == null) {
      this.tail = prev;
    } else {
      next.prev = prev;
    }
    this.size--;
  }
  clear() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }
}
