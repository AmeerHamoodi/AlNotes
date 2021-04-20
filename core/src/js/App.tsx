import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

//PAGES
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Class from "./pages/Class";

//COMPONENTS
import FOF from "./components/404";

//INTERFACES
import { UserStoreInterface } from "./stores/interfaces";

//STORES
import UserStore from "./stores/userStore";
const userStore: UserStoreInterface = new UserStore();

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/home">
                    <Home userStore={userStore}></Home>
                </Route>
                <Route path="/signup">
                    <Signup userStore={userStore}></Signup>
                </Route>
                <Route path="/login">
                    <Login userStore={userStore}></Login>
                </Route>
                <Route path="/class/:id">
                    <Class userStore={userStore}></Class>
                </Route>
                <Route path="/404" component={FOF}></Route>
                <Redirect from="*" to="/404"></Redirect>
            </Switch>
        </HashRouter>
    )
};

export default App;