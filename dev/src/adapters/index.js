import Folders from './Folders';
import Releases from './Releases';
import Spotify from './Spotify';
import Users from './Users';

const Adapters = {
  Folders: new Folders(),
  Releases: new Releases(),
  Spotify: new Spotify(),
  Users: new Users()
};

export default Adapters;
