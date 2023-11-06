import * as net from 'net';

class NotificationService {
    private userSockets = new Map<string, net.Socket>();

    addUser(username: string, socket: net.Socket) {
        this.userSockets.set(username, socket);
    }

    removeUser(username: string) {
        this.userSockets.delete(username);
    }

    notifyUser(username: string, message: string) {
        const userSocket = this.userSockets.get(username);
        if (userSocket) {
            userSocket.write(message);
        } else {
            console.log(`No socket found for user ${username}`);
        }
    }
}

export default NotificationService;
