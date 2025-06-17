async function loadDataset() {
    try {
        const response = await fetch("filmes.json");
        if (!response.ok) {
            throw new Error("Erro ao carregar dataset");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar o dataset:", error);
        return [];
    }
}

class Node {
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];
        this.children = [];
        this.values = isLeaf ? [] : null;
    }
}

class BPlusTree {
    constructor(order) {
        this.root = new Node(true);
        this.order = order;
    }

    findLeafNode(key, node = this.root) {
        if (node.isLeaf) {
            return node;
        }

        for (let i = 0; i < node.keys.length; i++) {
            if (key < node.keys[i]) {
                return this.findLeafNode(key, node.children[i]);
            }
        }
        return this.findLeafNode(key, node.children[node.children.length - 1]);
    }

    insert(key, value) {
        let leaf = this.findLeafNode(key);
        let index = leaf.keys.findIndex(k => k > key);

        if (index === -1) {
            leaf.keys.push(key);
            leaf.values.push(value);
        } else {
            leaf.keys.splice(index, 0, key);
            leaf.values.splice(index, 0, value);
        }

        if (leaf.keys.length > this.order) {
            this.splitLeafNode(leaf);
        }
    }

    search(key) {
        let leaf = this.findLeafNode(key);
        let index = leaf.keys.indexOf(key);
        return index !== -1 ? leaf.values[index] : null;
    }
}

async function initializeTree() {
    const tree = new BPlusTree(3);
    const movies = await loadDataset();

    movies.forEach(movie => tree.insert(movie.name.toLowerCase(), movie));
    console.log("Filmes inseridos na Árvore B+!");

    return tree;
}

async function searchMovie(name) {
    const tree = await initializeTree();
    const movie = tree.search(name.toLowerCase());

    return movie 
        ? `Filme encontrado: ${movie.name}`
        : "Filme não encontrado.";
}
