from setuptools import setup, find_packages

setup(
    name="package_auth",
    version="0.1",
    description="Shared utility functions for api",
    author="Paolo",
    packages=["package_auth"], #find_packages(),
    python_requires=">=3.10",
    install_requires=[
        "fastapi>=0.115.0"
    ],
)