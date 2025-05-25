import { useState } from "react";
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../../../providers/auth/AuthProvider";
import config from "../../../config";

const RequestAccess = ({ onRequestAccess }) => {

    const [captchaToken, setCaptchaToken] = useState("");
    const [formValidated, setFormValidated] = useState(false);
    const auth = useAuth();

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const btnRequestAccess = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let isValid = form.checkValidity();
        setFormValidated(true);
        if (isValid === false) {
            return;
        }

        if (!captchaToken) {
            auth.modal_handleShow("Errore", "Conferma il captcha per poter proseguire.");
            return;
        }

        const email = form.querySelector('input[type="email"]').value;
        onRequestAccess(email, captchaToken);
    };

    return <>
        <Form noValidate validated={formValidated} onSubmit={btnRequestAccess}>
            <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" required />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                </Form.Control.Feedback>
            </Form.Group>
            <ReCAPTCHA sitekey={config.RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange} />
            <Button className='btn success mt-3' type="submit">Richiedi accesso</Button>
        </Form>
    </>;
}

export default RequestAccess;