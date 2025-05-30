import config from '../../config';

class ApiSummary {

    constructor(authProvider) {
        if (authProvider == null) {
            throw new Error("AuthProvider is mandatory");
        }
        this.baseURL = config.API_SCRAPER_BASEURL;
        this.auth = authProvider;
        this.articles_page = 0;
        this.articles_itemsPerPage = 5;
    }

    _getHeaders() {
        return {
            method: 'GET',
            headers: this.auth.getDefaultHeaders()
        };
    }

    async getSitesUrl() {
        try {
            // call the api
            let apiResponse = await fetch(`${this.baseURL}/summary/sitesurl`, this._getHeaders())
            let responseJson = await apiResponse.json();
            return responseJson;

        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async getLatestArticles(sitesurl, page = 0, limit = 5) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: this.auth.getDefaultHeaders(),
                body: JSON.stringify({
                    filters: {
                        filters: []
                    },
                    site_urls: sitesurl,
                    page: page,
                    itemsPerPage: limit
                })
            };
            let apiResponse = await fetch(`${this.baseURL}/summary/articleslatest/`, requestOptions) // ?q=${encodeURIComponent(requestText)}
            if (!apiResponse.ok) {
                let errorMessage = await apiResponse.text();
                throw new Error(errorMessage || 'Something went wrong');
            }
            let responseJson = await apiResponse.json();

            // call the api
            return responseJson;

        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    getGroupArticlesByDate(articles) {
        const groupedItems = articles.reduce((groups, item) => {
            const date = new Date(item.update_date).toDateString(); // Group by readable date
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
            return groups;
        }, {});
        return groupedItems;
    }

    getAudioUrl(id) {
        return `${this.baseURL}/summary/audio?id=${id}`;
    }

    async markAsRead(ids) {
        try {
            const requestOptions = {
                method: 'POST',
                headers: this.auth.getDefaultHeaders(),
                body: JSON.stringify({
                    id_articles: ids
                })
            };
            let apiResponse = await fetch(`${this.baseURL}/summary/articlesread/`, requestOptions) // ?q=${encodeURIComponent(requestText)}
            if (!apiResponse.ok) {
                let errorMessage = await apiResponse.text();
                throw new Error(errorMessage || 'Something went wrong');
            }
            let responseJson = await apiResponse.json();

            // call the api
            return responseJson;

        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default ApiSummary;