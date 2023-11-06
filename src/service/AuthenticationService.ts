class AuthenticationService {
    private sessions: Map<string, string> = new Map();

    signIn(sessionId: string, username: string): void {
        this.sessions.set(sessionId, username);
    }

    whoAmI(sessionId: string): string | null {
        return this.sessions.get(sessionId) || null;
    }

    signOut(sessionId: string): void {
        this.sessions.delete(sessionId);
    }
}

export default AuthenticationService;
