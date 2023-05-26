export class Message {
    content: string;
    timestamp: Date;
    avatar: string;
    userMessage: boolean;
    constructor(content: string, avatar: string, userMessage: boolean, timestamp?: Date) {
        this.content = content;
        this.timestamp = timestamp;
        this.avatar = avatar;
        this.userMessage = userMessage;
    }
}