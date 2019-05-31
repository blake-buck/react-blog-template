import React from 'react';
import {Link} from 'react-router-dom';

import routes from './routes';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

function App() {
  return (
    <div>
      <AppBar position='relative'>
        <Toolbar>
          <Button component={Link} to='/'>Home</Button>
          <Button component={Link} to='/categories'>Categories</Button>
          <Button component={Link} to='/about'>About</Button>
          <Button component={Link} to='/newpost'>New Post</Button>
        </Toolbar>
      </AppBar>
      {routes}
    </div>
  );
}

export default App;
