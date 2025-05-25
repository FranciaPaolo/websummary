import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
//import * as IoIcons from "react-icons/io";
//import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        roles: []
    },
    {
        title: "Listen",
        path: "/listen",
        icon: <FaIcons.FaHeadphones />,
        roles: ["customer"]
    },
    {
        title: "Settings",
        path: "/settings",
        icon: <FaIcons.FaAdjust />,
        roles: ["customer"]
    },
    {
        title: "About Us",
        path: "/about",
        icon: <AiIcons.AiTwotoneInfoCircle/>,
        roles: []
    }
];
