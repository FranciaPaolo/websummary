import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { SidebarData } from "./SidebarData.js";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import './Sidebar.css';
import uITheme from "../../providers/UITheme";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useAuth } from "../../providers/auth/AuthProvider";
import { Link } from 'react-router-dom';

const SidebarNav = styled.nav`
    left: ${(props) => (props.$sidebar === 1 ? "0" : "-100%")};
`;

const SidebarWrap = styled.div`width: 100%;`;

const Sidebar = () => {

    const [sidebar, setSidebar] = useState(false);
    const showSidebar = useCallback(() => { setSidebar(!sidebar) }, [sidebar]);
    const { theme } = uITheme();
    const ref = useRef(null);
    const auth = useAuth();

    const linkOnClick = () => {
        showSidebar();
    };

    const recursiveContains = useCallback((parentNode, childNode) => {
        // Base case: If the parentNode is the same as the childNode
        if (parentNode === childNode) {
            return true;
        }

        // Check all child nodes recursively
        for (let i = 0; i < parentNode.childNodes.length; i++) {
            if (recursiveContains(parentNode.childNodes[i], childNode)) {
                return true;
            }
        }

        return false;
    }, []);

    const logout = () => {
        auth.logOut();
    };

    // sinchronize a component with an external system
    // in this case we sync with "uITheme" that loads the theme from the local storage
    useEffect(() => {

        // manage the click ouside the navbar to automatically close the navbar
        const handleClickOutside = (event) => {

            if (ref.current && !recursiveContains(ref.current, event.target) && sidebar) {
                // close the nav bar
                showSidebar();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [theme, sidebar, showSidebar, recursiveContains]); // theme is the dependency (when it change then React will re-execute the use effect)

    return (
        <div ref={ref}>
            <IconContext.Provider value={{ color: "#fff" }}>
                <nav className="navbar appnav justify-content-start">
                    <button className="navbar-toggler" type="button" id="sidebarToggle" onClick={showSidebar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <span className="navbar-brand nav-app-title">Web Summarizer</span>
                    <img src="/logo_app_icon.png" className="appLogo" alt="logo" />
                    <div className="ms-auto">
                        <img src={auth?.user?.picture}
                            title={auth?.user?.isLoggedin ? auth?.user?.fullname : 'empty'}
                            alt={auth?.user?.isLoggedin ? auth?.user?.fullname : 'empty'}
                            height={30} className="rounded-circle"
                            referrerPolicy="no-referrer"
                            style={{ display: auth && auth?.user?.isLoggedin ? 'inline-block' : 'none' }}
                        />
                        <DropdownButton
                            key="info"
                            id="ddinfo"
                            variant="btn btn-link bg-transparent text-white"
                            title={auth?.user?.isLoggedin ? auth?.user?.fullname : 'empty'}
                            style={{ display: auth && auth?.user?.isLoggedin ? 'inline-block' : 'none' }}
                        >
                            <Dropdown.Item eventKey="1" as={Link} to="/userinfo">Info</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="2" onClick={() => logout()}>Logout</Dropdown.Item>
                        </DropdownButton>
                        <a href="/login" className="text-white p-2" style={{ display: auth && auth?.user?.isLoggedin ? 'none' : 'inline-block' }}>Signin</a>
                    </div>
                </nav>
                <SidebarNav $sidebar={sidebar === false ? 0 : 1} className="sidebarnav">
                    <SidebarWrap>
                        <div>&nbsp;</div>
                        {SidebarData
                            .filter((item) => (item.roles.length === 0 || item.roles.includes(auth?.user?.role)))
                            .map((item, index) => {
                                return (
                                    <SubMenu
                                        item={item}
                                        key={index}
                                        onLinkClick={linkOnClick}
                                    />
                                );
                            })}
                    </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </div>
    );
};

export default Sidebar;