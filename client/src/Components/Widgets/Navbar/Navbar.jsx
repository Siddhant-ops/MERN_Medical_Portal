import { Menu, Grid, Button, Drawer } from "antd";
import { NavLink } from "react-router-dom";
import "./Navbar.scss";
import "antd/dist/antd.css";
import SubMenu from "antd/lib/menu/SubMenu";
import { useState } from "react";
import { useStateValue } from "../../Utilities/stateProvider/stateProvider";
import { parseJwt } from "../../Utilities/Helpers/Helper";

const Navbar = () => {
  const [{ user }] = useStateValue();

  const { md } = Grid.useBreakpoint();

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const NavMenu = ({ md }) => {
    return (
      <Menu mode={md ? "horizontal" : "inline"}>
        {user && parseJwt(user)["role"] === "doctor" ? (
          <Menu.Item key="dashboard">
            <NavLink
              to={`/${parseJwt(user)["role"]}/dashboard/`}
              activeClassName="navbarLink__Active"
            >
              Dashboard
            </NavLink>
          </Menu.Item>
        ) : (
          <SubMenu key="loginMenu" title="Login">
            <Menu.Item key="LoginDoctor">
              <NavLink to="/login/doctor">Login-Doctor</NavLink>
            </Menu.Item>
            <Menu.Item key="LoginPatient">
              <NavLink to="/login/patient">Login-Patient</NavLink>
            </Menu.Item>
          </SubMenu>
        )}
        <Menu.Item key="about">
          <NavLink to="/" activeClassName="navbarLink__Active">
            About
          </NavLink>
        </Menu.Item>
        <Menu.Item key="contact">
          <NavLink to="/" activeClassName="navbarLink__Active">
            Contact
          </NavLink>
        </Menu.Item>
        {user && (
          <Menu.Item key="profile">
            <NavLink
              to={`/${parseJwt(user)["role"]}/profile/`}
              activeClassName="navbarLink__Active"
            >
              Profile
            </NavLink>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  return (
    <div className="navbar__Container">
      <NavLink to="/" activeClassName="navbarLink__Active">
        <h3 className="navbarLink__Home">Medi-Touch</h3>
      </NavLink>
      {md ? (
        <NavMenu md={md} />
      ) : (
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
      )}
      <Drawer
        title="Menu"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <NavMenu md={md} />
      </Drawer>
    </div>
  );
};

export default Navbar;
