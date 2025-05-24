# Backend.Scraper

## Run it

Setup environment variable creating a `.env` file in the root folder (in the same folder of this readme):
```
LANG_SMITH=""
GROQ_API_KEY=""
USER_AGENT="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1"
```

(Optional but recommended) Create a virtual environment:
```
conda create -p venv python=3.10
conda activate ./venv
pip install -r requirements.txt
```

Start the Api:
```
python ./src/main.py
```
