import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

//PAGES
import Home from "./pages/Home";
import Class from "./pages/Class";
import Unit from "./pages/Unit";
import Note from "./pages/Unit";

//COMPONENTS
import FOF from "./components/404";

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact render={params => <Home {...params}></Home>} />
                <Route path="/class/:name" exact render={params => <Class {...params}></Class>} />
                <Route path="/class/:className/unit/:unitName" exact component={Unit}></Route>
                <Route path="/class/:className/unit/:unitName/note/:id" exact component={Note}></Route>
                <Route path="/404" component={FOF}></Route>
                <Redirect from="*" to="/404"></Redirect>
            </Switch>
        </HashRouter>
    )
};

export default App;