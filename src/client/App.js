import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './container/Home'

import store from './store'

class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
      </Provider>
    )
  }
}

export default App
