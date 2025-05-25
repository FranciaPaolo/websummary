import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import RequestAccess from "./Components/RequestAccess"
import { useAuth } from "../../providers/auth/AuthProvider";
import { useTranslation } from 'react-i18next';
import config from '../../config';

const LoginGoogle = () => {

    const [searchParams] = useSearchParams();
    let code = searchParams.get("code");
    let error = searchParams.get("error");
    const [errorMessage, setErrorMessage] = useState(error);
    const [requestAccess, setRequestAccess] = useState(false);
    const [requestor, setRequestor] = useState({});
    const auth = useAuth();
    const { t } = useTranslation();
    const initialized = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (initialized.current) {
            return;
        }
        initialized.current = true;
        // setErrorMessage("Il tuo utente non è abilitato ad accedere.\nRichiedi l'accesso tramite la seguente form, ti risponderemo non appena possibile.");
        // setRequestAccess(true);

        try {
            // if the code is returned in queryString we can proceed
            if (code) {
                (async () => {
                    try {
                        await auth.loginAction({ 'code': code, 'provider': 'google' });
                    } catch (e) {
                        setErrorMessage(e.message);
                        if (e.message === "User not found" || e.message === "Invalid user or password") {
                            setErrorMessage("Your user is not registered.\nRequest access with the following form.");
                            setRequestor({ "email": e.data.email, "fullname": e.data.fullname });
                            setRequestAccess(true);
                        }
                    }
                })();
            } else {
                setErrorMessage(error);
            }

        } catch (err) {
            setErrorMessage(err.message);
        }


    }, [setErrorMessage, code, error, auth]);


    const onRequestAccess = (email, captchaToken) => {
        // TODO call the Api to request access
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'email': email,
                'fullname': requestor.fullname,
                'captchatoken': captchaToken
            })
        };
        fetch(`${config.API_USERS_BASEURL}/users/requestaccess/`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    setRequestAccess(false);
                    setErrorMessage("");
                    auth.modal_handleShow("Info", t("login_google_registration_completed"))
                        .then(() => {
                            navigate("/login");
                    });

                } else if (response.status === 400) {
                    auth.modal_handleShow("Invalid request. Please, check inserted data and retry.");
                } else {
                    auth.modal_handleShow("An unexpected error occured. Please, retry later.");
                }
            });
    };

    const replaceNewLines = (text) => { return text ? text.replace("\n", "<br />") : "" }

    return <>
        <h1>Login Google</h1>

        <div className="container">
            <div className="alert alert-warning alert-dismissible fade show" role="alert"
                style={{ display: errorMessage ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{ __html: replaceNewLines(errorMessage) }}>
            </div>

            <div className="row" style={{ display: requestAccess ? 'block' : 'none' }}>
                <RequestAccess onRequestAccess={onRequestAccess}></RequestAccess>
            </div>
        </div>
    </>;
};

export default LoginGoogle;
