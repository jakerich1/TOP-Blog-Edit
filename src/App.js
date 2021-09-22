import { Switch, Route, Redirect } from "react-router-dom";
import './style.scss'
import Dash from "./Dash/Dash";
import Login from "./Login/Login";
import Edit from './Edit/Edit';
import Create from "./Create/Create";
import { useAuth } from "./use-auth.js";

function App() {

  const auth = useAuth();

  return (
    
      <div className="App">
        <Switch>

            <Route path="/login">
              <Login />
            </Route>

            <Route exact path='/create'>
            { !auth.user ? <Redirect to="/login" /> : <Create />}
            </Route>

            <Route path="/dashboard">
              { !auth.user ? <Redirect to="/login" /> : <Dash />}
            </Route>

            <Route path="/edit/:id" children={<Edit />} />

            <Route exact path="/">
              { auth.user ? <Redirect to="/dashboard" /> : <Login />}
            </Route>
            
          </Switch>
      </div>

  );
}

export default App;


