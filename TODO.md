# TODO: Implement Frontend UI for Comments in FileView Page

## Tasks
- [x] Extend frontend/src/utils/api.js with comment API functions (getComments, addComment, deleteComment) - Already implemented
- [x] Update frontend/src/pages/FileView.jsx to add comments state and UI
  - [x] Add state for comments array and newComment string
  - [x] Add fetchComments function and call it after successful file access
  - [x] Add comments section in JSX: list comments with user, content, date, delete button
  - [x] Add form to add new comment with textarea and submit button
  - [x] Implement handleAddComment and handleDeleteComment functions
  - [x] Improve file display to show images properly (conditional img vs iframe)
- [ ] Test the implementation by running the frontend and verifying comment functionality

## Notes
- Comments require viewer permission, so fetch after access is granted.
- Handle API errors gracefully (e.g., if no permission, don't show comments section).
- Use Tailwind CSS for styling to match existing UI.
