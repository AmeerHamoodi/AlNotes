import React from "react";
import {
    HashRouter,
    Route,
    Switch,
    Redirect,
    withRouter
} from "react-router-dom";

//PAGES
import Home from "./pages/Home";
import Class from "./pages/Class";
import Unit from "./pages/Unit";
import Note from "./pages/Note";
import Settings from "./pages/Settings";

//COMPONENTS
import FOF from "./components/404";

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={withRouter(Home)} />
                <Route
                    path="/class/:name"
                    exact
                    component={withRouter(Class)}
                />
                <Route
                    path="/class/:className/unit/:unitName"
                    exact
                    component={withRouter(Unit)}
                ></Route>
                <Route
                    path="/class/:className/unit/:unitName/note/:id"
                    exact
                    component={withRouter(Note)}
                ></Route>
                {/* <Route path="/settings" exact component={withRouter(Settings)}></Route> */}
                <Route path="/404" component={FOF}></Route>
                <Redirect from="*" to="/404"></Redirect>
            </Switch>
        </HashRouter>
    );
};

export default App;
