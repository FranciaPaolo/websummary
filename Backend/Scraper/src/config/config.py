app_settings = dict(
    service_name = "srv1",
    environment="prod", # dev, prod
    api_port=5501,

    #database_url="postgresql+psycopg2://pguser:pg3OB!@websummary-db:5432/websummary", # docker
    database_url="postgresql+psycopg2://pguser:pg3OB!@localhost:5435/websummary", # debug

    # SummaryTask
    summary_task_max_articles=5,

    # Jwt
    auth_jwt_key="QsvUdnN3rx`GQF,'#'V;;3Ld>q^sHtk~9lMq*-1fUXI}\"g_Goz2ixAx*POQR{oD",
    auth_jwt_durationHours=6,
    auth_jwt_renewMinutesBeforeExpiration=60,

    # Google Auth https://console.cloud.google.com/
    auth_provider_google_client_id="",
    auth_provider_google_client_secret="",
    auth_provider_google_redirect_uri="http://localhost:3000/logingoogle", # debug

    # Recaptcha
    recaptcha_secret_key="",
)