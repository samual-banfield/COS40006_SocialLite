## Running

1. Start the backend on port 3000 (`node ./src/server.js` from `backend/`)
2. From `frontend/`: `npm i` then `npm run dev`

## Structure

- `src/App.jsx` - header, login state, mounts Home and LoginModal
- `src/components/Home.jsx` - the home screen, renders the Feed
- `src/components/Feed.jsx` - fetches `GET /api/feed` and renders a list of Posts
- `src/components/Post.jsx` - a single post: `content` string and optional `image` url
- `src/components/LoginModal.jsx` - login form in a native `<dialog>` (not wired to auth yet)
- `src/api.js` - backend fetch helpers
