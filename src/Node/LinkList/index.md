```js
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

  add(element, index) {
    if (index < 0 || index > this.szie) {
      throw new Error('越界');
    }

    if (arguments.length === 1) {
      index = this.szie;
    }

    if (index === 0) {
      this.head = new Node(element, this.head);
    } else {
      let prevNode = this.findNode(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }

    this.szie++;
  }

  remove(index) {
    if (index < 0 || index >= this.szie) {
      throw new Error('越界');
    }

    if (index === 0) {
      this.head = this.head.next;
    } else {
      const prevNode = this.findNode(index - 1);
      prevNode.next = prevNode.next.next;
    }

    this.szie--;
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
```

- 链表相对于数组来说 有更好的性能，数组有进栈出栈道损耗，链表只需要移动指针
- react hook 就是用链表实现的
