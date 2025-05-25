import React from 'react';

const Paging = ({ itemsPerPage, page, total, onPageSelect }) => {
    const pages_displayed = 10;
    const pages = Math.ceil(total ? total / itemsPerPage : 0);

    const min_page = Math.floor(page / pages_displayed) * pages_displayed;
    const max_page = min_page + pages_displayed > pages ? pages : min_page + pages_displayed;
    const pages_rage = [];
    for (let i = min_page; i < max_page; i++) {
        pages_rage.push(i);
    }

    const prevPage = () => {
        const prevPageNum = Math.max(page - 1, 0);
        onPageSelect(prevPageNum);
    };
    const nextPage = () => {
        const nextPageNum = Math.min(page + 1, pages - 1);
        onPageSelect(nextPageNum);
    };
    const goToPage = (pageNumber) => {
        onPageSelect(pageNumber);
    };
    const firstPage = () => {
        onPageSelect(0);
    };
    const lastPage = () => {
        onPageSelect(pages - 1);
    };

    return <>
        <div style={{ display: total ? 'block' : 'none' }}>
            <span title='first page' onClick={firstPage} style={{ cursor: 'pointer', textDecoration: "underline" }}>&lt;</span> &nbsp;
            <span title='previous page' onClick={prevPage} style={{ cursor: 'pointer' }}>&lt;</span> &nbsp;
            <span style={{ display: page < pages_displayed ? 'none' : 'inline-block' }}>...</span> &nbsp;
            {pages_rage.map(item => <span key={item} style={{ cursor: 'pointer', fontWeight: item === page ? "bold" : "normal" }} onClick={() => goToPage(item)}>{item + 1}&nbsp;</span>)}
            <span style={{ display: page >= Math.floor(pages / pages_displayed) * pages_displayed ? 'none' : 'inline-block' }}>...</span> &nbsp;
            <span title='next page' onClick={nextPage} style={{ cursor: 'pointer' }}>&gt;</span> &nbsp;
            <span title='last page' onClick={lastPage} style={{ cursor: 'pointer', textDecoration: "underline" }}>&gt;</span>
        </div>
        <div style={{ display: total ? 'block' : 'none' }}>
            <small>elementi totali: {total}</small>
        </div>
    </>;
};

export default Paging;