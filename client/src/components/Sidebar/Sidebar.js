
import React,{useState,useEffect} from "react";
import {Collapse} from "reactstrap";
import { NavLink, useLocation } from "react-router-dom";
import { getUserInf } from "../../utils/APIRoutes";
import { Nav } from "reactstrap";
import Logout from "../../views/Logout";
import { useSocket } from "../../views/SocketProvider";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "logo.svg";

var ps;

function Sidebar(props) {
  const socket = useSocket();
  const [role, setrole] = useState("")
  const token=localStorage.getItem("token");
  const location = useLocation();
  const sidebar = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  function handleLogOut() {
    socket.emit("log-out");
    
    // Clear localStorage and set isLoggedIn state to false
    localStorage.clear();
    props.setIsLogged(false);
  }
useEffect(() => {
  fetch(getUserInf, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Initialize 'token' before using it
    },
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      setrole(data.userinf.role)
     })
    .catch((error) => {
      console.log("Error:", error);
    });
}, [])
const renderSubmenu = (submenuRoutes, parentLayout, parentIndex) => {
  return (
    <Collapse isOpen={openSubmenu === parentIndex}>
      <ul className="nav">
        {submenuRoutes.map((submenuProp, submenuKey) => {
          if (submenuProp.roles.includes(`${role}`)) {
            return (
              <li
                className={
                  activeRoute(submenuProp.layout + submenuProp.path) +
                  (submenuProp.pro ? " active-pro" : "")
                }
                key={submenuKey}
              >
                <NavLink
                  to={submenuProp.layout + submenuProp.path}
                  className="nav-link ml-4"
                >
                  <i className={submenuProp.icon} />
                  {submenuProp.name}
                </NavLink>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </Collapse>
  );
};

const [openSubmenu, setOpenSubmenu] = useState(null);

  // Function to handle submenu toggle
  const toggleSubmenu = (index) => {
    setOpenSubmenu((prevOpenSubmenu) =>
      prevOpenSubmenu === index ? null : index
    );
  };
  return (
    <div
    className="sidebar"
    data-color={props.bgColor}
    data-active-color={props.activeColor}
  >
    <div className="logo">



<a

  href="https://dgl.bneder.dz/"

  className="simple-text logo-normal"

  style={{fontSize:"15px"}}

>

  &nbsp;<i className="nc-icon nc-chart-bar-32" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Barrage VERT

</a>

</div>
    {/* ... (previous code) */}
    <div className="sidebar-wrapper" ref={sidebar}>
      <Nav>
        {props.routes.map((prop, key) => {
          if(prop.display){
            
          if (prop.roles.includes(`${role}`)) {
            if (prop.submenu) {
              // If the route has a submenu, render a dropdown menu
              return (
                <li
                className={`nav-item has-submenu ${
                  openSubmenu === key ? "open" : ""
                }`}
                key={key}
              >
                <NavLink
                
                  className="nav-link"
                  onClick={() => toggleSubmenu(key)}
                >
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
                {renderSubmenu(prop.submenu, prop.layout, key)}
              </li>
              );
            } else {
              // If the route does not have a submenu, render a regular menu item
              return (
                <li
                  className={
                    activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                  key={key}
                >
                  <NavLink to={prop.layout + prop.path} className="nav-link">
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
          }}
          return null;
        })}
        <li onClick={handleLogOut}>
          <NavLink>
            <i className={"nc-icon nc-button-power"} />
            <p>{"déconnexion"}</p>
          </NavLink>
        </li>
      </Nav>
    </div>
  </div>
  );
}

export default Sidebar;
