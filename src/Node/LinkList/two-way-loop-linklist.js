// 双向循环链表
class Node {
  constructor(element, prev, next) {
    this.element = element;
    this.next = next;
    this.prev = prev;
  }
}
class LinkList {
  add(index, element) {
    if (arguments.length == 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) {
      throw new Error('越界');
    }
    if (index == this.size) {
      // 向后添加
      let oldLast = this.tail;
      //  新增连头
      this.tail = new Node(element, oldLast, this.head);
      if (oldLast == null) {
        this.head = this.tail;
        // 尾巴 自己指向自己
        this.tail.next = this.tail;
        this.tail.prev = this.tail;
      } else {
        oldLast.next = this.tail;
        // 头指向尾巴
        this.head.prev = this.tail;
      }
    } else {
      let nextNode = this._node(index);
      let prevNode = nextNode.prev;
      let node = new Node(element, prevNode, nextNode);
      nextNode.prev = node;
      prevNode.next = node;
      if (index == 0) {
        this.head = node;
      }
    }
    this.size++;
  }
  remove(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('越界');
    }
    if (this.size == 1) {
      this.tail = null;
      this.head = null;
    } else {
      let node = this.get(index);
      let prevNode = node.prev;
      let nextNode = node.next;
      prevNode.next = nextNode;
      nextNode.prev = prevNode;
      if (index == 0) {
        this.head = nextNode;
      }
      if (index == this.size - 1) {
        this.tail = prevNode;
      }
      this.size--;
    }
  }
}
