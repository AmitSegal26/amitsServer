# Project Name: Amitsserver

## Server Configuration

- The server runs on port 8181 on localhost.
- The server utilizes MongoDB as the database.

## Google API Integration

To use the Google API, follow these steps:

1. Open the server's front page.
2. Click on the login button to initiate the Google API integration.

## Server Connection

When connecting to the server, you will encounter the following messages:

- Connection to MongoDB => [LOCAL or ATLAS]
- Server running on http://localhost:8181/
- Connected to MongoDB

## Environment Setup

The server can be run in two environments: production and development.

- To start the server in production mode, use the command: [npm start]:(atlas MongoDB)
- To start the server in development mode, use the command: [npm run dev]:(localhost mongoDB)

## Input Requirements

Certain API endpoints may require specific inputs from the client. Please refer to the documentation for each API for the required inputs.

## Authorization and Authentication

To access certain endpoints, [AUTHORIZATION known as TOKEN] and [AUTHENTICATION such as ADMIN or Business User] may be required. Please refer to the documentation for each API to understand the authorization and authentication process.

## BONUSES INCLUDED

### You may change bizNumber for a card for as long as its not already occupied by another bizCard

### You may login or register using the google API using the front page (expanded explanation at the paragraph above)

### For every error hapenning on the server - there will be a document log (.log) including all the errors happened during using the session, each document is made for each date on the calendar

### For every 3rd time a user has failed logging into an account using wrong password but for the same email - the email will be blocked from logging in thus email for the duration of 24 hours. this block is saved on the mongoDB, that way the server will block the failed logging user even if the app has crashed and re-established

## API Documentation

#### proxy:http://localhost:8181/

#### Default URL for proxy: /api

### GET ALL USERS

#### usage: get all users on the DB

- REST Method: [GET]
- URL End Point Request: [/users/users]
- Authentication Needed: [Yes]
- Authorizations Needed: [ADMIN]

### [Title 1]

[Explanation of the API endpoint]

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed: [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...
