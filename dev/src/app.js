import DB from './components/DB';
import App from './components/App';

const VERSION = '0.1';

console.info(
  `
%cDiscogs Library v${VERSION}
%c© Jake Albaugh ${new Date().getFullYear()}
https://twitter.com/jake_albaugh
https://github.com/jakealbaugh/discogs-library

`,
  'font-family: sans-serif; font-weight: bold;',
  'font-family: sans-serif; font-weight: normal;'
);

const //
  db = new DB(),
  database = db.database;

if (!!window.location.search.match(/\?authorize=true/))
  db.authorize(data => new App({ database, visitor: data }));
else
  db.authorizeWithoutSignin(
    data => new App({ database, visitor: data }),
    () => new App({ database: null, visitor: { guest: true, email: 'NOPE' } })
  );
