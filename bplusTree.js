// bplusTree.js
class BPlusTree {
  constructor(order = 3) {
    this.order = order;
    this.store = new Map();
  }

  insert(key, value) {
    this.store.set(key, value);
  }

  search(key) {
    return this.store.get(key) || null;
  }

  // Extra: busca por prefixo (útil para auto completar)
  searchPrefix(prefix) {
    const results = [];
    for (let [key, value] of this.store.entries()) {
      if (key.startsWith(prefix)) {
        results.push(value);
      }
    }
    return results;
  }
}
