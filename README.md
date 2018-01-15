# Discogs Library Browser

![Discogs Library Browser](https://d.pr/i/VP5Hiy/81XBqo4XJS.gif)

This Collection browser pulls in data from Discogs using Webtask, then writes it to a Firestore Database, giving you a free replication (and an easier to browse) instance of your record collection.

It also generates a JSON download of your collection that you can drop into `dev/data`, which the app uses for visitors and circumvents the need for Firebase Authentication.

Check out my Collection at [jakealbaugh.github.io/discogs-library/](https://jakealbaugh.github.io/discogs-library/).

You will need:

- A free [Firebase](https://firebase.google.com) account with a Firestore database
- A free [Webtask](https://webtask.io/) account with the Github integration enabled
- A free [Discogs](https://www.discogs.com) account and user token
- A free [Spotify](https://beta.developer.spotify.com/dashboard/applications) developer account/app and a clientId/clientSecret

# Firebase

- Create a new Firebase web app and [set Firestore as your database](https://firebase.google.com/docs/firestore/quickstart)
- [Enable Google Sign-in](https://firebase.google.com/docs/auth/web/google-signin) in your app's Authentication settings
- Add your Firebase [web app settings](https://firebase.google.com/docs/web/setup#add_firebase_to_your_app) to `config/firebase-settings.js`
- Set your Firestore Database Rules to the following:

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth.token.email == '[YOU]@gmail.com';
      allow write: if request.auth.token.email == '[YOU]@gmail.com';
    }
  }
}
```

- Update `dev/src/App.js` `MASTER_EMAIL` to be whatever email address you will sign in with.

# Discogs

- Visit [discogs.com/settings/developers](https://www.discogs.com/settings/developers) and get a personal access token.
- Update `USER_TOKEN` in `functions/discogs-collection.js` and `functions/discogs-release.js`.
- Update `USER_USERNAME` with your Discogs username in `functions/discogs-collection.js`.
- Update `DISCOGS_USERNAME` with your Discogs username in `dev/src/components/store.js`.
- Commit and push these changes to your Github repository.

# Webtask

- Set up [Github integration](https://webtask.io/docs/editor/github) so that your server functions can be read from the repository.
- Create a new task called `discogs-collection`
  - Sync it with the Github repo's `functions/discogs-collection.js`.
  - Add your Discogs `userToken` and `userUsername` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `disconnect` npm module to `discogs-collection` via `Settings > NPM Modules`
- Create a new task called `discogs-releases`
  - Sync it with the Github repo's `functions/discogs-releases.js`.
  - Add your Discogs `userToken` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `disconnect` npm module to `discogs-releases` via `Settings > NPM Modules`
- Create a new task called `spotify-search`
  - Sync it with the Github repo's `functions/spotify-search.js`.
  - Add your Spotify `clientId` and `clientSecret` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `http` npm module to `spotify-search` via `Settings > NPM Modules`
- Open `dev/src/components/Webtask.js`
- Set `discogsCollection` to the url displayed at the bottom of your Webtask `discogs-collection`
- Set `discogsReleases` to the url displayed at the bottom of your Webtask `discogs-releases`
- Set `spotifySearch` to the url displayed at the bottom of your Webtask `spotify-search`


# Authorized Access
- To authorize yourself, visit `https://[APP_URL]?authorize=true` which will go through the Google authorization flow.
- Any subsequent visit does not need the `authorize` param until you are signed on.
- Any user that authorizes using Google will still have the limited experience using the JSON file.

# Guest Access
- The public view will show your Collection without having any Authentication/database actions. This keeps your Firestore activity to a minimum.
- All you need to do is sign into the app as your master user and download the JSON dump. Move this JSON file into `dev/data` then run `gulp publish` and deploy.
- Visiting users will read from the JSON file, which will be as up to date as you would like to keep it.

# Starting the App

- Run `gulp` from the app root
- Open [localhost:8000](http://localhost:8000)
- Authenticate with your Google account
- Click 'Update Collection'
- This will call the Webtask `discogs-collection` which loads your entire Collection, writes it to your Firestore database, then reloads the page.
- On page load, it will detect that it is missing all the full Release data for your Collection and call the Webtask `discogs-releases` which loads release information up to 60 per minute (Discogs API limit), and writes it to your Firestore database, then finally reloads the page.
  - Leave your browser open and it will pull in 10 releases every 15 seconds
  - If your collection is less than 60, it will do it all in a single call.
  - Every time it receives data, it will add it to your Firestore database
- After this initial load, the only time you need to call Webtask (Discogs) is if you want to update your Collection data. This will reload your entire Collection from Discogs, and pull in any new Releases.
- This data gets stored in your browser's `localStorage`, so you dont have to worry about hitting limits on Firestore.

# Navigating the App
- Up and down arrows will navigate through the search results
- Enter will open the full view of whatever the active Release is
- Escape or Enter will close the full view

# Deployment
- `gulp publish` will update the `/docs` directory (gh-pages convention), which you can host wherever you want.
- You will need to update your Firebase authentication settings to whitelist whatever domain you host on.
