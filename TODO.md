# File Versioning Implementation TODO

## Backend Changes
- [x] Update backend/models/File.js: Add versions array and currentVersion field
- [x] Add updateFile function in backend/controllers/fileController.js
- [x] Add getVersions function in backend/controllers/fileController.js
- [x] Add restoreVersion function in backend/controllers/fileController.js
- [x] Update backend/routes/fileRoutes.js: Add PUT /:id, GET /:id/versions, POST /:id/restore/:version

## Frontend Changes
- [x] Update frontend/src/pages/FileView.jsx: Add versions list, restore button, update file functionality

## Testing
- [x] Test update file endpoint
- [x] Test get versions endpoint
- [x] Test restore version endpoint
- [x] Verify frontend displays versions correctly
