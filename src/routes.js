import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './components/Home/Home';
import Categories from './components/Categories/Categories';
import About from './components/About/About';
import NewPost from './components/NewPost/NewPost';

export default(
    <Switch>
        <Route path='/newpost' component={NewPost} />
        <Route path='/about' component={About} />
        <Route path='/categories' component={Categories} />
        <Route exact path='/' component={Home} />
    </Switch>
)