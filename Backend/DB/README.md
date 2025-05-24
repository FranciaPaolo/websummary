# Getting Started

This project is for the Database Postgresql,
the database contains:
* schema "public"
  * purpose: data that are ready for the end-user
  * table "articles" core table that holds all the article texts
  * table "sites"

(for now database is shared between services)

## How to start and debug

Run:
```
docker compose -p websummary up -d
```
Then restore the data already processed, see next chapter.

## Backup and Restore

**> Restore** plain text using psql command through docker:
```
docker exec -i websummary-db psql -U pguser -d websummary < websummary.sql
```
The file to be restored is available in Drive in the project directory.

**> Backup** plain text using PgAdmin4:
* right click the database and select backup
* select "data" (in data option tab)

Backup plain text using pg_dump command:
```
docker exec websummary-db pg_dump -U pguser -F p -b -v websummary > websummary.sql
```

## Configuration

The tables are automatically created/altered by the services.





