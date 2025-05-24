import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document
load_dotenv()

class LLMService:
    def __init__(self, model: str = "Gemma2-9b-It"):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set.")
        self.llm = ChatGroq(groq_api_key=api_key, model=model)

    def summarize_documents(self, docs) -> str:
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "Write a very short summary of the following, stick to the summary no preamble:\n\n{context}")
        ])
        self.chain = create_stuff_documents_chain(self.llm, self.prompt)
        return self.chain.invoke({"context": docs})

    def get_title(self, text) -> str:
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "Provide a title for the following text, response only with the title:\n\n{context}")
        ])
        docs = [Document(page_content=text)]
        self.chain = create_stuff_documents_chain(self.llm, self.prompt)
        return self.chain.invoke({"context": docs})
