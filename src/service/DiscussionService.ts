import Discussion from "../models/Discussion";
import PrefixTrie from "../utils/PrefixTrie";

class DiscussionService {
    private discussions: Map<string, Discussion> = new Map();
    private prefixTrie: PrefixTrie = new PrefixTrie();

    createDiscussion(reference: string, username: string, comment: string): string {
        if (!reference || !username || !comment) {
            throw new Error('Invalid parameters');
        }

        const discussion = new Discussion(reference, username, comment);
        this.discussions.set(discussion.getId(), discussion);
        this.prefixTrie.insert(reference, discussion.getId());
        return discussion.getId();
    }

    getDiscussionById(discussionId: string): Discussion | null {
        if (!discussionId) {
            throw new Error('Discussion ID is required');
        }

        return this.discussions.get(discussionId) || null;
    }

    getDiscussionsByReference(reference: string): Discussion[] {
        if (!reference) {
            throw new Error('Reference is required');
        }

        const ids = this.prefixTrie.search(reference);
        const discussions = ids.map(id => this.discussions.get(id)!);
        return discussions;
    }
}

export default DiscussionService;
