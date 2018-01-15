import Folders from './Folders';
import Releases from './Releases';
import Users from './Users';

const Adapters = {
  Folders: new Folders(),
  Releases: new Releases(),
  Users: new Users()
};

export default Adapters;
