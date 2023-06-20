# Project Name: Amitsserver

## Server Configuration

- The server runs on port 8181 on localhost.
- The server utilizes MongoDB as the database.

## Server's Characteristics

- The server is logging in the console for every request is sent through the server, it is written in a way you should be able to read and understand.
- the server is made for managing the Database with business cards and serve a few commands that will be detailed and explained at the API DOCS.

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

### **proxy:http://localhost:8181/**

### **Default URL for proxy: /api**

### GET ALL USERS

#### USAGE: get all users info on the DB

- REST Method: [GET]
- URL End Point Request: [/users/users]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]

### GET A USER

#### USAGE: get user info from the DB

- REST Method: [GET]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### GET USER THEMSELVES

#### USAGE: get user info from the DB using token info for themselves

- REST Method: [GET]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### REGISTER USER

#### USAGE: Register a user into the DB

- REST Method: [POST]
- URL End Point Request: [/users/users]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
  Requirements for body:
  -object:{
  -name{
  --first: string, min length 2, required
  --middle: string, min length 2
  --last: string, min length 2, required
  }
  -email: string, email regex (example@email.com), required
  -phone: string, phone (05X-123456789), required
  -password: string, min length 8, must contain: 1 capital letter, 1 small letter, 1 digit and one
  of the following chars {#?!@$%^&\*-}, required
  -image{
  --url: string, must be url, required
  --alt: string, min length 2, max length 256, required
  }
  -address{
  --state: string, min length 2, max length 256
  --country: string, min length 2, max length 256, required
  --city: string, min length 2, max length 256, required
  --street: string, min length 2, max length 256, required
  --houseNumber: string, min length 2, max length 256, required
  --zip: number, required
  }
  -isBusiness: boolean, required}

### LOGIN USER

#### USAGE: Recieve a token from the server for a user

- REST Method: [POST]
- URL End Point Request: [/users/login]
- Authentication Needed (token): [No]
- Authorizations Needed: [none]
  Requirements for body:
  -object:{
  -email: string, email regex (example@email.com), required
  -password: string, min length 8, must contain: 1 capital letter, 1 small letter, 1 digit and one
  of the following chars {\*#?!@$%^&-}, required
  }

### EDIT USER

#### USAGE:Edit the user's own details

- REST Method: [PUT]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
  -Params: -- [id]: [the id of the user the api should ask the info for]
  Requirements for body:
  -object:{
  -name{
  --first: string, min length 2, required
  --middle: string, min length 2
  --last: string, min length 2, required
  }
  -phone: string, phone (05X-123456789), required
  -image{
  --url: string, must be url, required
  --alt: string, min length 2, max length 256, required
  }
  -address{
  --state: string, min length 2, max length 256
  --country: string, min length 2, max length 256, required
  --city: string, min length 2, max length 256, required
  --street: string, min length 2, max length 256, required
  --houseNumber: string, min length 2, max length 256, required
  --zip: number, required
  }
  -isBusiness: boolean, required}

### EDIT BUSINESS STATUS

#### USAGE: Invoke/revoke isBusiness boolean value

- REST Method: [PATCH]
- URL End Point Request: [users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### DELETE USER THEMSELVES

#### USAGE: Delete the user of the given token from the DB

- REST Method: [DELETE]
- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [none]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### DELETE A USER

#### USAGE: Delete a user from the DB

-- REST Method: [DELETE]

- URL End Point Request: [/users/users/:id]
- Authentication Needed (token): [Yes]
- Authorizations Needed: [ADMIN]
- Params:
  - [id]: [the id of the user the api should ask the info for]

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...

### GET ALL USERS

#### USAGE:

- REST Method: [GET/POST/PUT/DELETE]
- URL End Point Request: [URL]
- Authentication Needed (token): [Yes/No]
- Authorizations Needed: [ADMIN/BUSINESS]
- Parameters:
  - [Parameter 1]: [Description of the parameter]
  - [Parameter 2]: [Description of the parameter]
  - [Parameter 3]: [Description of the parameter]
  - ...
