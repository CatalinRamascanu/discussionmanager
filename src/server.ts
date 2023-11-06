import * as net from 'net';
import AuthenticationService from "./service/AuthenticationService";
import { v4 as uuidv4 } from 'uuid';
import DiscussionService from "./service/DiscussionService";
import NotificationService from "./service/NotificationService";
import Discussion from "./models/Discussion";

const PORT = 3000;
const discussionService : DiscussionService = new DiscussionService();
const authenticationService : AuthenticationService = new AuthenticationService();
const notificationService: NotificationService = new NotificationService();

const server = net.createServer((socket: net.Socket) => {
    console.log('Client connected');
    const sessionId = uuidv4();

    socket.on('data', (data: Buffer) => {
        const message = data.toString().trim();
        const [requestId, command, arg1, arg2] = message.split('|');

        let username: string | null = null;
        let discussion: Discussion | null = null;
        let response = requestId;

        switch (command) {
            case 'SIGN_IN':
                authenticationService.signIn(sessionId, arg1);
                notificationService.addUser(arg1, socket);
                break;
            case 'WHOAMI':
                username = authenticationService.whoAmI(sessionId);
                if (!username){
                    response += '| Error: Unknown User';
                    break;
                }
                response += `|${username}`;
                break;
            case 'SIGN_OUT':
                username = authenticationService.whoAmI(sessionId);
                authenticationService.signOut(sessionId);
                if (username) {
                    notificationService.removeUser(username);
                }
                break;
            case 'CREATE_DISCUSSION':
                username = authenticationService.whoAmI(sessionId);
                if (!username){
                    response += '| Error: Unknown User';
                    break;
                }
                const discussionId = discussionService.createDiscussion(
                    arg1,
                    username,
                    arg2);
                response += `|${discussionId}`;
                break;
            case 'CREATE_REPLY':
                username = authenticationService.whoAmI(sessionId);
                if (!username) {
                    response += '| Error: Unknown User';
                    socket.write(`${response}\n`);
                    return;
                }

                discussion = discussionService.getDiscussionById(arg1);
                if (discussion) {
                    discussion.createReply(username, arg2);

                    // Step 1: Send Acknowledgement
                    socket.write(`${response}\n`);  // Acknowledge the reply creation

                    // Step 2: Notify All Participants
                    const participants = discussion.getParticipants();
                    participants.forEach((participant: string) => {
                        notificationService.notifyUser(participant, `DISCUSSION_UPDATED|${arg1}\n`);
                    });
                } else {
                    response += '| Error: Discussion Not Found';
                    socket.write(`${response}\n`);
                }
                return;
            case 'GET_DISCUSSION':
                discussion = discussionService.getDiscussionById(arg1);
                if (discussion) {
                    const comments = discussion.formatComments();
                    response += `|${discussion.getId()}|${discussion.getReference()}|(${comments})`;
                } else {
                    response += '| DISCUSSION_NOT_FOUND';
                }
                break;
            case 'LIST_DISCUSSIONS':
                const discussions = discussionService.getDiscussionsByReference(arg1);
                if (discussions.length > 0) {
                    const discussionsList = discussions.map(d => {
                        const comments = d.formatComments();
                        return `${d.getId()}|${d.getReference()}|(${comments})`;
                    }).join(',');
                    response += `|(${discussionsList})`;
                } else {
                    response += '| DISCUSSION_LISTS_NOT_FOUND';
                }
                break;
            default:
                socket.write(`${response}\n`);
                return;
        }

        socket.write(`${response}\n`);
        return
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


