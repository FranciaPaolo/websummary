import { useEffect, useRef } from "react";
import { useAuth } from "../../providers/auth/AuthProvider";
import config from '../../config';
//import { useTranslation } from 'react-i18next';

const UserInfo = () => {

    const auth = useAuth();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) {
            return;
        }
        initialized.current = true;

        const requestOptions = {
            method: 'GET', headers: auth.getDefaultHeaders()
        };
        fetch(`${config.API_USERS_BASEURL}/users/user`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);

            })
            .catch(error => console.error(error));
    });

    return <>
        <h1>User Info</h1>

        <div className="container">
            <div className="row">
                <div className="col-4">

                    <img src={auth?.user?.picture}
                        title={auth?.user?.isLoggedin ? auth?.user?.fullname : 'empty'}
                        alt={auth?.user?.isLoggedin ? auth?.user?.fullname : 'empty'}
                        className="rounded-circle"
                        referrerPolicy="no-referrer"
                        style={{ display: auth && auth?.user?.isLoggedin ? 'inline-block' : 'none' }}
                    />

                    <div className="form-group">
                        <label>Name:</label>
                        <div className="form-control bg-transparent border-0">
                            {auth.user?.fullname}
                        </div>
                    </div>

                    <div className="form-group mt-2">
                        <label>Email:</label>
                        <div className="form-control bg-transparent border-0">
                            {auth.user?.email}
                        </div>
                    </div>

                    <div className="form-group mt-2">
                        <label>Authentication type:</label>
                        <div className="form-control bg-transparent border-0">
                            {auth.user?.provider}
                        </div>
                    </div>

                    <br /><br /><br /><br />

                </div>
            </div>
        </div>

    </>;
};

export default UserInfo;
