import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  return (<>
      {showBanner && (
        <div className="alert alert-info fixed-bottom m-0 rounded-0 d-flex justify-content-between align-items-center px-4 py-3">
          <div>
            {t('privacy_alert')}{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => setShowPolicy(true)}
            >
              Privacy Policy
            </button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAccept}>
            OK
          </button>
        </div>
      )}

      <Modal show={showPolicy} onHide={() => setShowPolicy(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t('privacy_text')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPolicy(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
};

export default CookieConsent;