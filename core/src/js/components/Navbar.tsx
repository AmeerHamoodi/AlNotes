import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

interface NavbarProps {
  backLink: string;
  username: string;
}

const Navbar = (props: NavbarProps) => {
  return (
    <Menu attached="top">
      <Menu.Item as={Link} to={props.backLink || "/"} icon>
        <Icon name="arrow left"></Icon>
      </Menu.Item>
      <Menu.Item as={Link} to={"/"}>
        <img src="./imgs/logo-plain-desktop_v2.png" alt="Logo" />
      </Menu.Item>
      <Menu.Item as={Link} to="/" icon>
        <Icon name="home"></Icon>
      </Menu.Item>
      <Menu.Item as={Link} to="/settings" icon>
        <Icon name="cog"></Icon>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
