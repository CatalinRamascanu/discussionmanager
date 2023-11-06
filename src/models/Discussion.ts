import { v4 as uuidv4 } from 'uuid';

interface Comment {
    username: string;
    content: string;
}

class Discussion {
    private id: string;
    private reference: string;
    private comments: Comment[] = [];
    private createdTs: Date;
    private participants: Set<string> = new Set();

    constructor(reference: string, username: string, comment: string) {
        this.id = uuidv4();
        this.reference = reference;
        this.comments.push({ username, content: comment });
        this.createdTs = new Date();
        this.participants.add(username);
        this.addMentions(comment);
    }

    formatComments(): string {
        return this.comments.map((c: Comment )=>
            `${c.username}|${c.content.includes(',') || c.content.includes('"') ?
                `"${c.content.replace(/"/g, '""')}"` : c.content}`
        ).join(',');
    }


    private addMentions(comment: string) {
        const mentions = comment.match(/@[a-z0-9_]+/gi) || [];
        mentions.forEach(mention => this.participants.add(mention.slice(1)));
    }

    createReply(username: string, comment: string) {
        this.comments.push({ username, content: comment });
        this.participants.add(username);
        this.addMentions(comment);
    }

    getParticipants() {
        return Array.from(this.participants);
    }

    getReference(): string {
        return this.reference;
    }

    getId(): string {
        return this.id;
    }
}

export default Discussion;