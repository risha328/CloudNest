# Implement User Plan Limits

## Tasks
- [x] Modify `uploadFile` in `backend/controllers/fileController.js` to limit free users to 3 files per folder
- [x] Modify `createFolder` in `backend/controllers/folderController.js` to limit free users to 5 folders total
- [ ] Test the implementation with free and pro users

## Details
- Free users: max 3 files per folder, max 5 folders
- Pro users: unlimited
- Checks should be added before creating file/folder
- Return appropriate error messages
