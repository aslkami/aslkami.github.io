// 单向循环链表

class Node {
  constructor(node, next) {
    this.node = node;
    this.next = next;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.szie = 0;
  }

  findNode(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  add(index, element) {
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) throw new Error('越界');
    if (index === 0) {
      let head = this.head;
      let newHead = new Node(element, head);
      let last = this.size === 0 ? newHead : this._node(this.size - 1);
      this.head = newHead;
      last.next = newHead;
    } else {
      let prevNode = this._node(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }
    this.size++;
  }
  remove(index) {
    if (index < 0 || index >= this.size) throw new Error('越界');
    if (index === 0) {
      if (this.size === 1) {
        // 删除一个时特殊处理
        this.head = null;
      } else {
        let last = this._node(this.size - 1);
        this.head = this.head.next;
        last.next = this.head;
      }
    } else {
      let prevNode = this._node(index - 1);
      prevNode.next = prevNode.next.next;
    }
    this.size--;
  }

  update(index, element) {
    const current = this.findNode(index);
    current.node = element;
    return current;
  }

  get(index) {
    return this.findNode(index);
  }

  reverse() {
    let head = this.head;
    let newHead = null;

    // 假设是 1234null
    while (head !== null) {
      this.head = head.next; // 头先指向下一个 2
      head.next = newHead; // 1的 下一个 指向 null
      newHead = head; // 新的头 =》 1null
      head = this.head; // 把 2 取出来
    }

    return newHead;
  }

  // 递归  1234null
  reverseList() {
    function reverse(head) {
      if (head == null || head.next == null) return head;
      let newHead = reverse(head.next);
      head.next.next = head; // 3 4 null， 3 的下一个的下一个是 原本是 null， 然后改成 3
      head.next = null; // 上面得到的结果是 343，值执行完这一行后 就是 4 3 null， 这样就反转过来了
      return newHead; // 434 =》 4 3 null
    }

    // 3-4-null
    // head.next.next = head； =》 3-4-3
    // head.next = null； =》 分别是 Head 3-null 和  newHead 4-3-null
    // 出栈 Head 2-3-null
    // head.next.next = head； =》 2-3-2
    // head.next = null； =》 2-null 和 4-3-2-null
    this.head = reverse(this.head);
    return this.head;
  }
}

const ll = new LinkList();

ll.add(1);
ll.add(2);
ll.add(3);
ll.add(4);

// ll.remove(0);
// ll.update(2, 333333);
// console.dir(ll.get(2), { depth: 100 });
// console.dir(ll.reverse(), { depth: 100 });
console.dir(ll.reverseList(), { depth: 100 });
