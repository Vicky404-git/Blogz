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
        "https://blogz.dhruwv499.workers.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


CONTENT_DIR = os.path.realpath("./content")


def safe_resolve(relative_path: str) -> str:
    """Resolve a path under CONTENT_DIR and prevent directory traversal."""
    resolved = os.path.realpath(os.path.join(CONTENT_DIR, relative_path))
    if not resolved.startswith(CONTENT_DIR + os.sep) and resolved != CONTENT_DIR:
        raise HTTPException(status_code=400, detail="Invalid path")
    return resolved


def parse_post(filename: str, include_content: bool = False):
    """Read a Markdown post and return its frontmatter + optional content."""

    path = safe_resolve(filename)

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
    Recursively scans content/ for .md files.
    """

    if not os.path.exists(CONTENT_DIR):
        return []

    md_files = []
    for root, _, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith(".md"):
                full_path = os.path.join(root, file)
                relative = os.path.relpath(full_path, CONTENT_DIR)
                md_files.append(relative)

    md_files.sort()

    results = []
    for filename in md_files:
        try:
            results.append(parse_post(filename, include_content=False))
        except HTTPException:
            continue

    return results


@app.get("/api/posts/{slug:path}")
def get_single_post(slug: str):
    """
    Return a complete blog post.
    All posts are publicly available.
    Supports slugs with / for category paths.
    """

    filename = f"{slug}.md"

    return parse_post(
        filename,
        include_content=True,
    )
