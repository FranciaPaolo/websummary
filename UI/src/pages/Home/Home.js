import './Home.css';
import CookieConsent from "../../components/CookieConsent/CookieConsent";
import { useTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { useAuth } from "../../providers/auth/AuthProvider";

const Home = () => {

  const { t } = useTranslation();
  const auth = useAuth();

  const btnStart = (e) => {
    if(!(auth.user && auth.user.email)){
      auth.modal_handleShow("Signin",t('home_login_required'));
      e.preventDefault();
      return;
    }
  };

  return <>
    <section className="hero">
      <div className="hero-content">
        <h1>{t('home_welcome')}</h1>
        <p>{t('home_welcome_subtitle')}</p>

        <div className="flow-container">
          <div className="step" onClick={btnStart}>
            <i><FaIcons.FaNewspaper /></i>
            <div className="label">Text Articles</div>
          </div>

          <div className="arrow-container">
            <FaIcons.FaArrowRight className="arrow" />
          </div>

          <div className="step" onClick={btnStart}>
            <i><FaIcons.FaRobot /></i>
            <div className="label">AI Summary</div>
          </div>

          <div className="arrow-container">
            <FaIcons.FaArrowRight className="arrow" />
          </div>

          <div className="step" onClick={btnStart}>
            <i><FaIcons.FaHeadphonesAlt /></i>
            <div className="label">Audio Output</div>
          </div>
        </div>
        <div className="mt-5">
          <a href='/listen' className='btn btn-primary btn-sm btn-start' onClick={btnStart}>
            {t('home_start')}
          </a>
          <br /><br />
        </div>

      </div>
    </section>

    <CookieConsent />
  </>;
};

export default Home;
