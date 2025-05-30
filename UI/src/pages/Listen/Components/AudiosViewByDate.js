import './AudiosViewByDate.css';
import { useRef, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../../providers/auth/AuthProvider";
import ApiSummary from '../../../providers/api/ApiSummary';

const AudiosView = forwardRef(({ articleItems, hasMoreArticles, loadMore, openDetail, audioCopmleted }, ref) => {

    // from parent: articleItems, hasNewArticles
    // to parent: openDetail, loadMore

    const auth = useAuth();
    const { t } = useTranslation();
    const selected_article = useRef(null);
    const apiSummary = new ApiSummary(auth);
    const pageNumber = useRef(0);
    const itemsPerPage = 5;
    const itemsLimit = useRef(itemsPerPage);
    const audioContainerRef = useRef(null);

    const btnOpenDetail = (article) => {
        selected_article.current = article;
        if (openDetail) {
            openDetail(article);
            getCurrentAudio(article).pause();
        }
    };

    const btnLoadMore = async () => {
        itemsLimit.current = itemsLimit.current + itemsPerPage;

        if (loadMore) {
            loadMore(pageNumber.current, itemsLimit.current); // TODO then?
        }
    };

    const resetPageNumber = () => {
        pageNumber.current = 0;
        itemsLimit.current = itemsPerPage;
    };

    const getCurrentAudio = (article) => {
        // find the next article in the list and play its audio
        const audios = audioContainerRef.current.querySelectorAll('audio');
        if (audios.length > 0) {
            for (let i = 0; i < audios.length; i++) {
                if (audios[i].src === apiSummary.getAudioUrl(article.id)) {
                    return audios[i];
                }
            }
        }
        return null;
    }

    const getNextAudio = (article) => {
        // find the next article in the list and play its audio
        const audios = audioContainerRef.current.querySelectorAll('audio');
        if (audios.length > 0) {
            let nextAudio = null;
            for (let i = 0; i < audios.length; i++) {
                if (audios[i].src === apiSummary.getAudioUrl(article.id)) {
                    nextAudio = audios[i + 1];
                    break;
                }
            }
            return nextAudio;
        }
        return null;
    }

    const onAudioEnded = (article) => {
        if (audioCopmleted) {
            const nextAudio = getNextAudio(article);

            if (nextAudio) {
                setTimeout(() => {
                    nextAudio.play();
                }, 2000);
            }
            audioCopmleted(article);
        }
    }

    useImperativeHandle(ref, () => ({
        resetPageNumber,
    }));

    return <>
        <div ref={audioContainerRef}>
            {Object.entries(articleItems).map(([date, items]) => (
                <div key={date} className="my-3">
                    <span>{date}</span>
                    <div className="d-flex justify-content-start flex-wrap gap-3">
                        {items.map((article) => (
                            <div key={article.id} className="card flex-row" style={{ minWidth: "330px", maxWidth: "330px" }}>
                                <div className="card-body d-flex flex-column" style={{ height: "100%", position: "relative" }}>
                                    {/* 3 dots menu icon */}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 position-absolute"
                                        style={{ top: "-0.2rem", right: "0.5rem" }}
                                        aria-label="Open menu"
                                        onClick={() => btnOpenDetail(article)}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="12" r="2" fill="currentColor" />
                                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                                            <circle cx="19" cy="12" r="2" fill="currentColor" />
                                        </svg>
                                    </button>
                                    <span className="card-title">{article.title}</span>
                                    <p className="card-text"><a href={article.url} target='_blank' rel="noreferrer"><small>{article.site_url}</small></a></p>
                                    <div className="mt-auto">
                                        <audio src={apiSummary.getAudioUrl(article.id)} controls onEnded={() => onAudioEnded(article)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-start my-4">
                <button
                    type="button"
                    style={{ display: hasMoreArticles ? 'block' : 'none' }}
                    className="btn btn-secondary"
                    onClick={btnLoadMore}>
                    {t('listen_loadmore')}
                </button>
            </div>
        </div>
    </>;
});

export default AudiosView;