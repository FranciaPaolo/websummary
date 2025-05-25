import { useContext, createContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import config from '../../config';
import CustomError from './CustomError';
const AuthContext = createContext();

/**
 * This is a fake api call (used because the backend is not ready)
 * @param {*} msg
 * @param {*} shouldReject
 * @returns
 */

/**
 * The AuthProvider component is designed to wrap the application and provide the authentication context to its child components using the AuthContext.Provider
 * @param {*} param0
 * @returns
 */
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Get the initial state from localStorage, or set to a default value
        const savedState = localStorage.getItem('usr');
        return savedState ? JSON.parse(savedState) : { isLoggedin: false };
    });
    const [isLoading, setIsLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('');
    const initialized = useRef(false);

    const [modal, setModal] = useState({ show: false, title: "", message: "", resolve: () => { } });

    const modal_handleClose = (result) => {
        setModal((prev) => {
            prev.resolve(result);
            return { ...prev, show: false };
        });
    };
    const modal_handleShow = (title, body) => {

        return new Promise((resolve) => {
            setModal({ show: true, title: title, message: body, resolve });
        });
    };

    const navigate = useNavigate();

    const stripQuotes = (str) => {
        return str.replace(/^"|"$/g, '');
    };
    const loginAction = async (data) => {
        try {

            // 1) send the request to create the jwt
            const requestTokenOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'provider_name': data.provider,
                    'provider_accessCode': data.code
                })
            };
            let response = await fetch(`${config.API_USERS_BASEURL}/auth/accesstoken/`, requestTokenOptions);

            if (!response.ok) {
                let errorMessage = await response.json();
                throw new CustomError(errorMessage.message || 'Something went wrong', errorMessage);
            }
            let jwtToken = stripQuotes(await response.text());

            // 2) send the request to obtain the userinfo
            const requestInfoOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwtToken }
            };
            response = await fetch(`${config.API_USERS_BASEURL}/users/user`, requestInfoOptions);

            if (!response.ok) {
                let errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Something went wrong');
            }

            let user = await response.json();
            user.isLoggedin = true;
            user.provider = data.provider;

            // 3) save the user info
            setUser(user);
            localStorage.setItem("usr", JSON.stringify(user));
            localStorage.setItem("site", jwtToken);
            navigate("/");

        } catch (err) {
            console.error(err);
            throw err;//new Error(err.message || 'Something went wrong');
        }
    };

    const logOut = () => {
        setUser(null);
        localStorage.removeItem("site");
        localStorage.removeItem("usr");
        navigate("/login");
    };

    const setLoaderOn = () => {
        setIsLoading(true);
        setLoaderText('Loading...');
    };

    const setLoaderOff = () => {
        setIsLoading(false);
        setLoaderText('');
    };

    const getDefaultHeaders = () => {
        let defaultHeaders = { 'Content-Type': 'application/json' };
        let jwtToken = localStorage.getItem("site");

        if (user && user?.isLoggedin && jwtToken) {
            defaultHeaders.Authorization = 'Bearer ' + jwtToken;
        }
        return defaultHeaders;
    };

    const validateAuthentication = async () => {

        const stripQuotes = (str) => {
            return str.replace(/^"|"$/g, '');
        };

        try {
            let jwtToken = localStorage.getItem("site");

            if (jwtToken) {
                const requestInfoOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwtToken }
                };
                const response = await fetch(`${config.API_USERS_BASEURL}/auth/refreshtoken?token=${encodeURIComponent(jwtToken)}`, requestInfoOptions);

                if (response.ok) {
                    // aggiorno il jwt
                    jwtToken = stripQuotes(await response.text());
                    localStorage.setItem("site", jwtToken);
                }
                else {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }
            }

        } catch (err) {
            console.error(err);
            setUser(null);
            localStorage.removeItem("site");
            localStorage.removeItem("usr");
        }
    };

    useEffect(() => {
        if (initialized.current) {
            return;
        }
        initialized.current = true;

        // verifico se il token è ancora valido
        validateAuthentication(); // Validate initially on mount

        const intervalId = setInterval(() => {
            validateAuthentication(); // Run validation every 60 seconds
        }, 60000); // 60 seconds

        // Cleanup: Clear interval when the component is unmounted
        return () => {
            clearInterval(intervalId);
        };

    }, [isLoading]);

    return <AuthContext.Provider value={{ user, loginAction, logOut, isLoading, setLoaderOn, setLoaderOff, loaderText, getDefaultHeaders, modal_handleShow }}>
        {children}



        <Modal show={modal.show} onHide={modal_handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modal.message}</Modal.Body>
        </Modal>
    </AuthContext.Provider>;
};

export default AuthProvider;

/**
 * The useAuth custom hook utilizes useContext to access the authentication context from within components, allowing them to consume the authentication state and related functions stored in the context
 * @returns
 */
export const useAuth = () => {
    return useContext(AuthContext);
};


