# Bug Identifier App

This repository contains a small demonstration project for identifying bugs from uploaded images using AI.

## Client

The React client is located in the `client` directory.

Install dependencies and start the development server:

```bash
cd client
npm install
npm start
```

The landing page is available at `http://localhost:3000/` and allows navigation to the bug identification page.

## Server

The Express server lives in the `server` directory.

Install dependencies and run the server:

```bash
cd server
npm install
node app.js
```

The server exposes `/api/bug/identify` for uploading images.


