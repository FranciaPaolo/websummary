app_settings = dict(
    service_name = "srv1",
    environment="prod", # dev, prod
    api_port=5501,

    #database_url="postgresql+psycopg2://pguser:pg3OB!@incentive-db:5432/incentive", # docker
    database_url="postgresql+psycopg2://pguser:pg3OB!@localhost:5435/websummary", # debug

    summary_task_max_articles=5,
)