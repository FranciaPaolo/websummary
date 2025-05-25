import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SidebarLink = styled(Link)`
    
`;

const SidebarLabel = styled.span`
`;

const DropdownLink = styled(Link)`
`;

const SubMenu = ({ item, onLinkClick }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);
    const linkOnClick = () => {

        if (item.subNav) {
            showSubnav();
        }
        else {
            onLinkClick();
        }
    };

    const dropdownlinkOnClick = () => {
        onLinkClick();
    };

    return (
        <>
            <SidebarLink
                className="sidebarLink"
                to={item.path}
                onClick={linkOnClick}
            >
                <div>
                    {item.icon}
                    <SidebarLabel className="sidebarLabel">
                        {item.title}
                    </SidebarLabel>
                </div>
                <div>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                            ? item.iconClosed
                            : null}
                </div>
            </SidebarLink>
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <DropdownLink
                            className="dropdownLink"
                            to={item.path}
                            key={index}
                            onClick={dropdownlinkOnClick}
                        >
                            {item.icon}
                            <SidebarLabel>
                                {item.title}
                            </SidebarLabel>
                        </DropdownLink>
                    );
                })}
        </>
    );
};

export default SubMenu;
