# Discogs Library Browser

![Discogs Library Browser](https://d.pr/i/VP5Hiy/81XBqo4XJS.gif)

Try it out at [jakealbaugh.github.io/discogs-library](https://jakealbaugh.github.io/discogs-library/).

This Collection browser pulls in data from Discogs using Webtask, then writes it to a Firestore Database, giving you a free replication (and an easier to browse) instance of your record collection.

It also generates a JSON download of your collection that you can drop into `dev/data`, which the app uses for visitors and circumvents the need for Firebase Authentication.

Check out my Collection at [jakealbaugh.github.io/discogs-library/](https://jakealbaugh.github.io/discogs-library/).

You will need:

- A free [Firebase](https://firebase.google.com) account with a Firestore database
- A free [Webtask](https://webtask.io/) account with the Github integration enabled
- A free [Discogs](https://www.discogs.com) account and `userToken`
- A free [Spotify](https://beta.developer.spotify.com/dashboard/applications) developer account/app, `clientId` and `clientSecret`.

# Data Structure

- `user`: Your Discogs User information
- `username/folders`: Your Discogs folder information (id, name)
- `username/releases`: Limited Release information for your Discogs collection (id, folderId, added)
- `releases`: Full Discogs Release data, by `releaseId`.

## You
When authenticated through Firebase, you have the ability to maintain your data. You authenticate using Google by visiting `YOURAPP.com?auth=true`

On first load or whenever you want to update your Collection, you will hit "Update All" which will go through the following flow:

  1. Calls the Webtask `discogs-collection` function, which returns your User, Folders, and the limited Release data
  1. Overwrites `user`, `username/*` in your Firestore database (leaves `releases` untouched)
  1. Checks to see if it has `releases` data for each Release in your Collection.
    - If it does
      1. It reloads the app
    - If it doesn't
      1. It calls the Webtask `discogs-releases` function, which returns Releases for arrays of `releaseIds`.
        - This is throttled 60 per minute because of Discogs API limitations.
        - If you need less than 60 Releases it will load all in one request,
        - If you need more than 60 Releases it runs for 10 Releases every 15 seconds
      1. It takes the Releases returned by Webtask and writes to Firestore.
      1. It clears your `localStorage`
      1. Upon completion, it reloads the app

You can also do a quick update of the latest 20 releases you added to your collection (new Releases might change often on Discogs).

  1. Hit "Sync Recent" button
  1. It calls the Webtask `discogs-collection-recent` function
  1. It takes the 20 recent Releases from Webtask and writes them to Firestore
  1. It clears your `localStorage`, next page load will come from Firestore.
  1. It updates your app view.

On app load, it will check to see if it has the data it needs in `localStorage`.

  1. If data is saved to `localStorage`, it loads your data from there.
  1. If data is not saved to `localStorage`, it loads your data from Firestore then saves it to `localStorage`.

You can update a single Release at any time (new Releases might change often on Discogs).

  1. Hit "Update Release" button for the current Release in app
  1. It calls the Webtask `discogs-releases` function for the single `releaseId`
  1. It takes that Release from Webtask and writes it to Firestore
  1. It clears your `localStorage`, next page load will come from Firestore.
  1. It updates your app view.


## Visitors
All visitors have zero access to Webtask or Firebase. They simply load the latest JSON file of your Collection from `dev/data`. You can export your `localStorage` to JSON so that any other user can view your Collection.

  1. Hit "JSON" button in app
  1. Move the file to `dev/data/`
  1. Run `gulp publish`
  1. Commit your changes and push to Github.


# Setup

## Firebase

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

- Update `dev/src/App.js` `MASTER_EMAIL` to be whatever email address you will sign in with. This will allow your user to manage the app.

## Discogs

- Visit [discogs.com/settings/developers](https://www.discogs.com/settings/developers) and get a personal access token.
- Update `DISCOGS_USERNAME` with your Discogs username in `dev/src/components/store.js`.

## Webtask

- Set up [Github integration](https://webtask.io/docs/editor/github) so that your server functions can be read from the repository.
- Create a new task called `discogs-collection`
  - Sync it with the Github repo's `functions/discogs-collection.js`.
  - Add your Discogs `userToken` and `userUsername` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `disconnect` npm module to `discogs-collection` via `Settings > NPM Modules`
  - Set `dev/src/components/Webtask.js` `discogsCollection` to the url displayed at the bottom of this Webtask
- Create a new task called `discogs-collection-recent`
  - Sync it with the Github repo's `functions/discogs-collection-recent.js`.
  - Add your Discogs `userToken` and `userUsername` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `disconnect` npm module to `discogs-collection` via `Settings > NPM Modules`
  - Set `dev/src/components/Webtask.js` `discogsCollectionRecent` to the url displayed at the bottom of this Webtask
- Create a new task called `discogs-releases`
  - Sync it with the Github repo's `functions/discogs-releases.js`.
  - Add your Discogs `userToken` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `disconnect` npm module to `discogs-releases` via `Settings > NPM Modules`
  - Set `dev/src/components/Webtask.js` `discogsReleases` to the url displayed at the bottom of your Webtask `discogs-releases`
- Create a new task called `spotify-search`
  - Sync it with the Github repo's `functions/spotify-search.js`.
  - Add your Spotify `clientId` and `clientSecret` to the [Webtask secrets](https://webtask.io/docs/editor/secrets)
  - Add the `http` npm module to `spotify-search` via `Settings > NPM Modules`
  - Set `dev/src/components/Webtask.js` `spotifySearch` to the url displayed at the bottom of your Webtask `spotify-search`


# Authenticated Access
- To authenticate yourself, visit `https://[APP_URL]?auth=true` which will go through the Google authentication flow.
- Any subsequent visit does not need the `auth` param until you are signed out.
- Any user that is not you and authenticates using Google will still have the limited experience using the JSON file.

# Public Access
The public view will show your Collection via the JSON file without having any Authentication/database actions. This keeps your Firestore activity to a minimum.

# Starting the App
- Run `gulp` from the app root
- Open [localhost:8000?auth=true](http://localhost:8000?auth=true)
- Authenticate with your Google account
- Click 'Update All' and leave your browser open while it goes through the flow described above in [Data Structure](#data-structure).

# Navigating the App
- Up and down arrows will navigate through the search results
- `return` will open the full view of whatever the active Release is
- `escape` or `return` will close the full view

# Deployment
- `gulp publish` will update the `/docs` directory (gh-pages convention), which you can host wherever you want.
- You will need to update your Firebase authentication settings to whitelist whatever domain you host on.
