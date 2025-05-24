from typing import List
from repository.filter import FilterJson


class FilterArticles(FilterJson):
    site_urls:List[str]