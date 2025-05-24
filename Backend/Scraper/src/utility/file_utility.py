import os

class FileUtility:

    @staticmethod
    def ensure_directory_exists(filepath: str):
        """
        Ensure that the directory exists, creating it if necessary.
        """
        directory = os.path.dirname(filepath) ## directory of file
        if not os.path.exists(directory):
            os.makedirs(directory)

    @staticmethod
    def get_speech_root_path() -> str:
        return "data/speech/" # TODO get from config
