class Node {
  constructor(isLeaf = false) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.values = isLeaf ? [] : null;
    this.children = isLeaf ? null : [];
    this.next = null; 
  }
}

class BPlusTree {
      constructor(order = 3) {
        this.order = order;
        this.nodes = new Map();
      }
      insert(key, value) {
        this.nodes.set(key, value);
      }
      search(key) {
        return this.nodes.get(key) || null;
      }
    }
