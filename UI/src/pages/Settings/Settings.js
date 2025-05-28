import { useState, useEffect, useRef } from "react";
import uITheme, { themes_enum } from "../../providers/UITheme";
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import ApiSummary from '../../providers/api/ApiSummary';
import { useAuth } from "../../providers/auth/AuthProvider";

const Settings = () => {
  const initialized = useRef(false);
  const { theme, changeTheme } = uITheme();
  const [theme_radioValue, theme_setRadioValue] = useState(themes_enum.light);
  const { t, i18n } = useTranslation();
  const auth = useAuth();

  const [selectOptions_sites, setSelectOptions_sites] = useState([]);

  const action_changeTheme = (value) => {
    theme_setRadioValue(value);
    changeTheme(value);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const saveSettings = () => {
    auth.modal_handleShow("Ok", "Impostazioni salvate con successo!");
  };

  // sinchronize a component with an external system
  // in this case we sync with "uITheme" that loads the theme from the local storage
  useEffect(() => {
    // execute only once at the beginning
    if (initialized.current) return;

    initialized.current = true;

    // preselected values

    const fetchData = async () => {
      setSelectOptions_sites(await new ApiSummary(auth).getSitesUrl());
    }

    fetchData();

    theme_setRadioValue(theme);
  }, [theme, auth]); // theme is the dependency (when it change then React will re-execute the use effect)

  return <>
    <h1>Settings</h1>
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-sm-1 col-lg-12">

          <h3 className="mt-5">{t('settings_preferences')}</h3>
          <div className="form-group mt-2">
            <label>{t('settings_sites')}:</label>
            <p className="text-danger bg-white">
              <span role="img" aria-label="Work in progress" title="Work in progress">🚧</span>&nbsp;
              {t('settings_wip_sites')}&nbsp;
              <span role="img" aria-label="Work in progress" title="Work in progress">🚧</span>
            </p>

            {selectOptions_sites.map((site, idx) => (
              <div className="form-check" key={idx}>
                <input className="form-check-input" type="checkbox" value={site.value || site} id={`siteCheck${idx}`} checked readOnly/>
                <label className="form-check-label" htmlFor={`siteCheck${idx}`}>
                  {site.label || site}
                </label>
              </div>
            ))}

          </div>

          <h3 className="mt-5">{t('settings_system')}</h3>
          <div className="form-group">
            <label>{t('settings_theme')}:</label>
            <div className="form-control">
              <button className={"btn " + (theme_radioValue === themes_enum.light ? "btn-secondary" : "")} onClick={() => action_changeTheme(themes_enum.light)}>
                {themes_enum.light}
                <FaIcons.FaSun />
              </button>
              <button className={"btn " + (theme_radioValue === themes_enum.dark ? "btn-secondary" : "")} onClick={() => action_changeTheme(themes_enum.dark)}>
                {themes_enum.dark}
                <FaIcons.FaMoon />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t('settings_language')}:</label>
            <div className="form-control">
              <button className={"btn " + (i18n.language === "en" ? "btn-secondary" : "")} onClick={() => changeLanguage('en')}>English</button>
              <button className={"btn " + (i18n.language === "it" ? "btn-secondary" : "")} onClick={() => changeLanguage('it')}>Italian</button>
            </div>
          </div>
          <div className="form-group mt-5">
            <Button className='btn success' onClick={saveSettings}>Salva</Button>
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default Settings;
