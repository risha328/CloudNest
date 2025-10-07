# TODO: Implement Favorite/Pin Folders

## Backend
- [x] Create Favorite model (backend/models/Favorite.js)
- [x] Add toggleFavorite method to folderController.js
- [x] Add getFavorites method to folderController.js
- [x] Modify getFolders to include isFavorite flag
- [x] Add favorite routes to folderRoutes.js (POST /:id/favorite, DELETE /:id/favorite, GET /favorites)

## Frontend
- [ ] Add favorite API calls to api.js
- [ ] Add star icon and toggle to folder items in Dashboard.jsx
- [ ] Add "Favorites" section to sidebar in Dashboard.jsx
- [ ] Update folder display to show favorite status

## Testing
- [ ] Test backend endpoints
- [ ] Test frontend favorite toggling
- [ ] Verify permissions
