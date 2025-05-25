import { useState, useEffect } from "react";

export const themes_enum = {
    dark: 'dark',
    light: 'light'
};

const UITheme = () => {
    const [theme, setTheme] = useState(themes_enum.light); // add the "theme" state variable to the component

    const toggleTheme = () => {
        if (theme !== "dark") {
            changeTheme(themes_enum.dark);
        } else {
            changeTheme(themes_enum.light);
        }
    };

    const changeTheme = (theme_name) => {
        if (themes_enum[theme_name]) {
            localStorage.setItem("theme", themes_enum[theme_name]);
            setTheme(theme_name);

            //update the body with the selected theme
            document.body.setAttribute("data-bs-theme", "");
            Object.keys(themes_enum).forEach(theme_name_enum => {
                if (theme_name_enum === theme_name) {
                    // add the custom class to the body
                    document.body.classList.add(theme_name_enum);

                    // add the Bootstrap theme attribute
                    if (theme_name_enum === themes_enum.dark) {
                        document.body.setAttribute("data-bs-theme", "dark");
                    }
                }
                else {
                    document.body.classList.remove(theme_name_enum);
                }
            });

        } else {
            console.error("theme not found in themes_enum: " + theme_name);
        }
    };


    // sinchronize a component with an external system
    useEffect(() => {
        const localTheme = localStorage.getItem("theme");
        if (themes_enum[localTheme]) {
            changeTheme(themes_enum[localTheme]);
        }
        else {
            // detect if browser theme is dark
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                changeTheme(themes_enum.dark);
            }
            else {
                changeTheme(themes_enum.light);
            }
        }
    }, []);

    return {
        theme,
        toggleTheme,
        changeTheme
    };
};

export default UITheme;