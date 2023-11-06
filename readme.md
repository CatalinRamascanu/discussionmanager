# Discussion Manager

Discussion Manager is a TCP server designed to manage and facilitate discussions through comments. 
The project is designed to efficiently handle discussion threads and user operations.

## Table of Contents

1. [Solution Overview](#solution-overview)
2. [Project Structure](#project-structure)
3. [Server Commands](#server-commands)
4. [Setup and Running](#setup-and-running)

## Solution Overview

The solution is divided into two primary components:
1. A Trie-based efficient lookup for discussions by their references.
2. Services that manage different aspects like authentication, discussion, and notifications.

The `PrefixTrie` is a utility that allows efficient search for discussions by their references. The system also uses services such as `AuthenticationService`, `DiscussionService`, and `NotificationService` to modularly handle respective operations.

## Project Structure

- `src/`: Source code directory.
    - `service/`: Contains business logic services like `AuthenticationService`, `DiscussionService` and `NotificationService`.
    - `models/`: Contains models like `Discussion`.
    - `utils/`: Utility classes and functions. E.g. Trie
    - `server.ts`: Main server file.

## Server Commands

1. **SIGN_IN**: Authenticate a user to the system.
2. **WHOAMI**: Retrieve the authenticated user's username.
3. **SIGN_OUT**: Log out the authenticated user.
4. **CREATE_DISCUSSION**: Create a new discussion thread.
5. **CREATE_REPLY**: Reply to an existing discussion thread.
6. **GET_DISCUSSION**: Retrieve a discussion by its ID.
7. **LIST_DISCUSSIONS**: List all discussions by a reference prefix.

## Setup and Running

**Setup**:

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Navigate to the project directory.
3. Run `npm install` to install the project dependencies.

**Running the Server**:

In the project directory, simply run:

```bash
npm start
```
This will start the TCP server on port 3000 by default.

