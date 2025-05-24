import logging
from typing import Any, List, Optional, Union
from pydantic import BaseModel
from sqlalchemy.orm import Query
from sqlalchemy import and_, between, func, or_
from sqlalchemy.dialects.postgresql.operators import OVERLAP
from model.article import Article

logger = logging.getLogger('MainLogger')

class FilterItem(BaseModel):
    id:Optional[str] = "1" # Unique identifier for debugging
    field_name: str
    operator: str  # operator like '=', 'in', '>', '<', 'like', etc.
    value: Any  # The value to compare the field with

class FilterGroup(BaseModel):
    id:Optional[str] = "1" # Unique identifier for debugging
    logical_operator: str = "AND"  # "AND" or "OR"
    filters: List[Union["FilterGroup", FilterItem]]  # Allow nested groups

class FilterJson(BaseModel):
    filters:FilterGroup
    page:int=0
    itemsPerPage:int=10

class QueryFilterBuilder:

    @staticmethod
    def build_condition(filter_item: Union[FilterItem, FilterGroup]):
        if isinstance(filter_item, FilterItem):
            field = getattr(Article, filter_item.field_name, None)
            if not field:
                logger.error("Invalid field name:", filter_item.field_name)
                return None

            operator_map = {
                "=": lambda field, value: field == value,
                "in": lambda field, value: field.in_(value) if isinstance(value, list) else None,
                ">": lambda field, value: field > value,
                "<": lambda field, value: field < value,
                ">=": lambda field, value: field >= value,
                "< =": lambda field, value: field <= value,
                "like": lambda field, value: field.like(f"%{value}%"),
                #"@@": lambda field, value: field.op('@@')(func.to_tsquery('italian', value)),
                "&&": lambda field, value: OVERLAP(field, value),
                "between": lambda field, value: between(field, value[0], value[1]) if isinstance(value, list) and len(value) == 2 else None,
            }

            return operator_map.get(filter_item.operator, lambda f, v: None)(field, filter_item.value)

        elif isinstance(filter_item, FilterGroup):
            conditions = [QueryFilterBuilder.build_condition(f) for f in filter_item.filters]
            conditions = [c for c in conditions if c is not None]  # Remove None values
            if filter_item.logical_operator.upper() == "OR":
                return or_(*conditions) if conditions else None

            return and_(*conditions) if conditions else None

    @staticmethod
    def build_query(dbType: type, query: Query, filters: FilterGroup, limit: int = 100, offset: int = 0) -> Query:
        condition = QueryFilterBuilder.build_condition(filters)
        if condition is not None:
            query = query.filter(condition)

        # Apply paging
        if limit > 0:
            query = query.limit(limit)
        return query.offset(offset)
