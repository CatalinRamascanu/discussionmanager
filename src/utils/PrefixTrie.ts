class TrieNode {
    children: Map<string, TrieNode> = new Map();
    discussionIds: string[] = [];
}

class PrefixTrie {
    root: TrieNode = new TrieNode();

    insert(reference: string, discussionId: string) {
        let node = this.root;
        for (const char of reference) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char)!;
        }
        node.discussionIds.push(discussionId);
    }

    collectIds(node: TrieNode): string[] {
        const ids: string[] = [];
        const stack: TrieNode[] = [node];

        while (stack.length > 0) {
            const currentNode = stack.pop()!;
            ids.push(...currentNode.discussionIds);  // Spread operator to push all ids

            for (const child of currentNode.children.values()) {
                stack.push(child);
            }
        }
        return ids.reverse();  // Reverse the array to get the correct order
    }


    search(prefix: string): string[] {
        let node = this.root;
        for (const char of prefix.toLowerCase()) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char)!;
        }
        const ids = this.collectIds(node);
        return ids;
    }

    print(node: TrieNode = this.root, prefix: string = ''): void {
        console.log(`Node: ${prefix}, IDs: [${node.discussionIds.join(', ')}], Children: ${Array.from(node.children.keys()).join(', ')}`);

        for (const [char, child] of node.children.entries()) {
            this.print(child, prefix + char);
        }
    }
}

export default PrefixTrie;
