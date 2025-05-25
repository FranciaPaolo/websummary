import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import config from '../../config';
import * as FaIcons from "react-icons/fa";
import "./Login.css";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    let nonce = (Math.random() + 1).toString(36).substring(7);

    useEffect(() => {
        let queryCode = searchParams.get("msg")
        if (queryCode === "unauthorized") {
            setErrorMessage("Unable to access the requested resource");
        }
    }, [searchParams]);

    const btnCloseAlert = () => {
        setErrorMessage("");
    };

    return <>
        <h1>Login</h1>

        <div className="container">
            <div className="row">
                <div className="col-md-4 col-sm-12 col-xs-12 offset-md-4">

                    <div className="alert alert-warning alert-dismissible fade show" role="alert"
                        style={{ display: errorMessage ? 'block' : 'none' }}>
                        {errorMessage}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={btnCloseAlert}></button>
                    </div>
                    <div className="d-flex justify-content-center">
                        <img src="/logo_app_icon.png" alt="Logo" className="logo"/>
                    </div>
                    <div className="rhombus"></div>

                    <div>{t('login_access')}: <br /><br /></div>
                    <a href={`${config.LOGIN_GOOGLE_URL}${nonce}`} className="btn btn-primary d-flex justify-content-center align-items-center">
                        <i><FaIcons.FaGoogle /></i>&nbsp; {t('login_with_google')}
                    </a>
                    <div><br />
                    {t('login_description')}
                    <br />
                    </div>
                </div>
            </div>
        </div>

    </>;
};

export default Login;
