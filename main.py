import os
import yaml

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Vikas Dhruw — Blog API",
    description="Simple API for Vikas Dhruw's personal blog.",
    version="1.0.0",
)


# Allow the React frontend to connect during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


CONTENT_DIR = "./content"


def parse_post(filename: str, include_content: bool = False):
    """Read a Markdown post and return its frontmatter + optional content."""

    path = os.path.join(CONTENT_DIR, filename)

    if not os.path.exists(path):
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    with open(path, "r", encoding="utf-8") as file:
        raw_text = file.read()

    if not raw_text.startswith("---"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid Markdown frontmatter in {filename}",
        )

    try:
        _, frontmatter, content = raw_text.split("---", 2)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid Markdown format in {filename}",
        )

    meta = yaml.safe_load(frontmatter) or {}

    if include_content:
        meta["content"] = content.strip()

    meta["slug"] = filename.removesuffix(".md")

    return meta


@app.get("/api/posts")
def get_all_posts():
    """
    Return metadata for all blog posts.
    Content is not included on the homepage.
    """

    if not os.path.exists(CONTENT_DIR):
        return []

    files = sorted(
        file
        for file in os.listdir(CONTENT_DIR)
        if file.endswith(".md")
    )

    return [
        parse_post(filename, include_content=False)
        for filename in files
    ]


@app.get("/api/posts/{slug}")
def get_single_post(slug: str):
    """
    Return a complete blog post.
    All posts are publicly available.
    """

    filename = f"{slug}.md"

    return parse_post(
        filename,
        include_content=True,
    )
