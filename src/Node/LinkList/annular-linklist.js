class Linklist {
  hasCycle() {
    let head = this.head;
    if (head == null || this.head == null) return false;
    let slow = head;
    let fast = head.next;
    while (fast !== null && fast.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) return true;
    }
    return false;
  }
  cycle(index) {
    let node = this.node(this.size - 1);
    let nextNode = this.node(index);
    node.next = nextNode;
  }
}
