import re
from typing import List
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from gtts import gTTS
import requests
from langchain_community.document_loaders import WebBaseLoader
from summarizer.llm_service import LLMService
import pygame

from utility.file_utility import FileUtility

class WebSummarizer:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self.mixer_inizialized = False

    def get_title(self, text: str) -> str:
        return self.llm_service.get_title(text)

    def summarize_url(self, url: str, css_selector:str=None) -> str:
        loader = WebBaseLoader(url)
        docs = loader.load()

        # Truncate the document to 5000 characters if necessary TODO need to be more flexible
        # This is a workaround to avoid issues with long texts in the LLM
        if docs and hasattr(docs[0], "page_content"):
            docs[0].page_content = docs[0].page_content[:5000]

        # Extract only the div with class "article main-content"
        # print(docs[0].page_content[:1000])  # Preview beginning
        # if css_selector!= None:
        #     soup = BeautifulSoup(docs[0].page_content, "html.parser")
        #     article_div = soup.find("div", class_=css_selector)
        #     if article_div:
        #         print("found!!")
        #         docs[0].page_content = article_div.get_text(separator="\n", strip=True)

        return self.llm_service.summarize_documents(docs)

    def summarize_urls(self, urls: List[str]) -> List[str]:
        return [self.summarize_url(url) for url in urls]

    def get_article_links_from_page(self, url: str, article_prefix:str="") -> List[str]:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        base_netloc = urlparse(url).netloc

        links = []

        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            full_url = urljoin(url, href)
            parsed = urlparse(full_url)

            # Filter for same-domain, article-like URLs
            if parsed.netloc == base_netloc \
                and ((not article_prefix) or (article_prefix and article_prefix in parsed.path)) \
                and full_url not in links:
                links.append(full_url)

        # with open("/home/paul/github/websummary/Backend/Scraper/demofile.txt", "a") as f:
        #     f.write(response.text)
        # docs=[Document(page_content=response.text, metadata={"source": url})]
        # splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
        # docs = splitter.create_documents([text], metadata_list=[metadata])
        #return self.llm_service.get_article_links_from_documents(docs, url)
        return links

    def save_speech(self, text:str, filename:str):
        # https://www.geeksforgeeks.org/convert-text-speech-python/
        clean_text = re.sub(r"[\*\•\-\–\—]", ", ", text)
        speech_obj = gTTS(text=clean_text, lang="en", slow=False)

        # Create the directory if it doesn't exist
        FileUtility.ensure_directory_exists(filename)

        # Saving the converted audio in a mp3 file named
        speech_obj.save(filename)

    def run_mp3(self, filename:str):

        # Initialize the mixer module
        if not self.mixer_inizialized:
            pygame.mixer.init()
            self.mixer_inizialized = True

        # Load the mp3 file
        pygame.mixer.music.load(filename)

        # Play the loaded mp3 file
        pygame.mixer.music.play()