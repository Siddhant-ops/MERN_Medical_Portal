import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { actionTypes } from "../../Utilities/reducer/reducer";
import { useStateValue } from "../../Utilities/stateProvider/stateProvider";
import { parseJwt } from "../../Utilities/Helpers/Helper";
import { Menu, Grid, Button, Drawer } from "antd";
import "./Navbar.scss";
import "antd/dist/antd.css";
import SubMenu from "antd/lib/menu/SubMenu";

const Navbar = () => {
  // get user token and dispatch function to set user
  const [{ user }, dispatch] = useStateValue();

  // get router history
  const history = useHistory();

  // md is boolean for medium breakpoint
  const { md } = Grid.useBreakpoint();

  // Nav mobile drawer state
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  // Log out and remove user from localStrorage and redirect to home page
  function logOut() {
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
    });
    localStorage.removeItem("Ajackus_user");
    history.replace("/");
  }

  const NavMenu = ({ md }) => {
    return (
      <Menu mode={md ? "horizontal" : "inline"}>
        {user && parseJwt(user)["role"] === "doctor" && (
          <Menu.Item key="dashboard">
            <NavLink
              to={`/${parseJwt(user)["role"]}/dashboard/`}
              activeClassName="navbarLink__Active"
            >
              Dashboard
            </NavLink>
          </Menu.Item>
        )}
        {!user && (
          <SubMenu key="loginMenu" title="Login">
            <Menu.Item key="LoginDoctor">
              <NavLink to="/login/doctor">Login-Doctor</NavLink>
            </Menu.Item>
            <Menu.Item key="LoginPatient">
              <NavLink to="/login/patient">Login-Patient</NavLink>
            </Menu.Item>
          </SubMenu>
        )}
        {user && parseJwt(user)["role"] === "patient" && (
          <Menu.Item key="profile">
            <NavLink
              to="/patient/profile/Self"
              activeClassName="navbarLink__Active"
            >
              Profile
            </NavLink>
          </Menu.Item>
        )}
        {user && (
          <Menu.Item key="logOut">
            <Button
              onClick={() => {
                logOut();
              }}
              type="primary"
              size="middle"
            >
              Log Out
            </Button>
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
