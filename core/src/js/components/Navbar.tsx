import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
    backLink: string,
    username: string
}

const Navbar = (props: NavbarProps) => {
    return (
        <nav className="ui top attached menu">
            <Link className="ui icon item" to={props.backLink}>
                <i className="icon arrow left"></i>
            </Link>
            <Link to="/home" className="ui item">
                <img src="/imgs/logo-plain-desktop_v2.png" alt="Logo" />
            </Link>
            <Link className="ui icon item" to="/home">
                <i className="home icon"></i>
            </Link>
            <Link className="ui icon item" to="/settings">
                <i className="cog icon"></i>
            </Link>
            <div className="right menu">
                <div className="ui item">
                    <i className="icon user"></i>
                    {props.username}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;