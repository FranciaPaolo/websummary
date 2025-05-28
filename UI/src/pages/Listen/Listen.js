import './Listen.css';
import { Modal } from 'react-bootstrap';
import { useRef, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
//import Paging from '../../components/Paging/Paging';
import { useAuth } from "../../providers/auth/AuthProvider";
import ApiSummary from '../../providers/api/ApiSummary';
import AudiosViewByDate from './Components/AudiosViewByDate';


const Listen = () => {
    const initialized = useRef(false);
    const auth = useAuth();
    const { t } = useTranslation();
    const sites = useRef([]);
    const articles = useRef([]);
    const [articlesByDate, setArticlesByDate] = useState([]);
    const [audio_modal_show, setAudioModalShow] = useState(false);
    const [audio_modal_title, setAudioModalTitle] = useState("");
    const selected_article = useRef(null);
    const [selected_site,setSelectedSite] = useState(null);
    const apiSummary = new ApiSummary(auth);
    const [hasMoreArticles, setHasMoreArticles] = useState(true);
    const audioViewByDate = useRef();


    useEffect(() => {
        // execute only once at the beginning
        if (initialized.current) {
            return;
        }
        initialized.current = true;

        const fetchData = async () => {

            let api = new ApiSummary(auth);
            sites.current = await api.getSitesUrl();
            let articles_data = await api.getLatestArticles(sites.current);
            setArticlesByDate(api.getGroupArticlesByDate(articles_data));
            articles.current = articles_data;
        }
        fetchData();

    }, [auth]);

    const btnAudioModalShow = (article) => {
        selected_article.current = article;
        setAudioModalTitle(article.title);
        setAudioModalShow(true);
    };
    const onAudioEnded = async (articleSelected) => {
        await btnMarkAsRead(articleSelected)
    };
    const audio_modal_handleClose = () => {
        setAudioModalShow(false);
    };
    const btnMarkAsRead = async (btnMarkAsRead) => {
        await apiSummary.markAsRead([btnMarkAsRead.id]);
        articles.current = articles.current.filter(a => a.id !== btnMarkAsRead.id);
        // need to reload articles?
        setArticlesByDate(apiSummary.getGroupArticlesByDate(articles.current));
        setAudioModalShow(false);
    };
    const btnLoadMore = async (page) => {
        let articles_data = await apiSummary.getLatestArticles(selected_site ? [selected_site]: sites.current, page);
        articles.current = [...articles.current, ...articles_data];
        setArticlesByDate(apiSummary.getGroupArticlesByDate(articles.current));
        setHasMoreArticles(articles_data.length !== 0);
    };
    const btnSelectSite = async (site) => {
        let site_url = site;
        if (selected_site && selected_site === site) {
            site_url = null;
        }
        setSelectedSite(site_url);

        // reload articles for the selected site
        audioViewByDate.current.resetPageNumber();
        let articles_data = await apiSummary.getLatestArticles(site_url ? [site_url]: sites.current);
        setArticlesByDate(apiSummary.getGroupArticlesByDate(articles_data));
        articles.current = articles_data;
        setHasMoreArticles(true);
    };
    return <>
        <h1>Listen</h1>
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-sm-1 col-lg-12">
                    {t('listen_title')}
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-start my-3">
                {sites.current.map((site) => (
                    <button
                        key={site}
                        type="button"
                        className={`btn btn-outline-primary me-2 h-35px${selected_site && selected_site === site ? ' active' : ''}`}
                        onClick={() => btnSelectSite(site)}>
                        {site}
                    </button>
                ))}
            </div>

            <div>

                Latest {selected_site ? `articles from ${selected_site}` : 'articles'}:
                <AudiosViewByDate ref={audioViewByDate}
                    articleItems={articlesByDate}
                    openDetail={btnAudioModalShow}
                    audioCopmleted={onAudioEnded}
                    loadMore={btnLoadMore}
                    hasMoreArticles={hasMoreArticles}>
                </AudiosViewByDate>
            </div>

            <Modal show={audio_modal_show} onHide={audio_modal_handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{audio_modal_title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button type="button" className="btn btn-primary"
                        onClick={() => btnMarkAsRead(selected_article.current)}>
                        Mark as read
                    </button>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    </>;
};

export default Listen;