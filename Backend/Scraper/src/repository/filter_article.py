from typing import List
from repository.filter import FilterJson


class FilterArticles(FilterJson):
    site_urls:List[str]
    last_days:int = 5