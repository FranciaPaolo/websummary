import './AboutUs.css';
import { useTranslation } from 'react-i18next';

import * as FaIcons from "react-icons/fa";

const AboutUs = () => {
    const { t } = useTranslation();

    return <>
        <h1>{t('aboutus_title')}</h1>
        <div className="container">
            <div className="info-box">
                <p><i><FaIcons.FaGhost /></i>
                {t('aboutus_description').split('\n').map((line, index) => (
                    <span key={index}>
                    {line}
                    <br />
                    </span>
                ))}
                </p>

                <img src="/about/team.jpeg" alt="teamwork" className='team-img' />
            </div>

            <div className="info-box">
                <p><i><FaIcons.FaGithub /></i>This is an Open Source Project &nbsp;
                <a rel="noreferrer" target='_blank' href='https://github.com/FranciaPaolo/websummary'>show on Github</a></p>
            </div>


        </div>

    </>;
}

export default AboutUs;
