import os
import yaml
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow your React open-source frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

CONTENT_DIR = "./content"
UPI_ID = "yourfampayid@fam"  # Replace with your actual FamPay UPI ID
NAME = "Vikas Dhruw"

def parse_post(filename: str, include_content: bool = False):
    path = os.path.join(CONTENT_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Post not found")
    
    with open(path, "r", encoding="utf-8") as f:
        raw_text = f.read()
        
    if raw_text.startswith("---"):
        _, frontmatter, content = raw_text.split("---", 2)
        meta = yaml.safe_load(frontmatter)
        if include_content:
            meta["content"] = content.strip()
        meta["slug"] = filename.replace(".md", "")
        return meta
    return {"error": "Invalid Markdown format"}

@app.get("/api/posts")
def get_all_posts():
    """Returns a list of all blogs (metadata only) for the frontend homepage"""
    files = [f for f in os.listdir(CONTENT_DIR) if f.endswith(".md")]
    return [parse_post(f, include_content=False) for f in files]

@app.get("/api/posts/{slug}")
def get_single_post(slug: str, has_paid: bool = False):
    """Serves the post content, masking it if premium and unpaid"""
    post = parse_post(f"{slug}.md", include_content=True)
    
    if post.get("premium") and not has_paid:
        # Paywall: Cut content to first 300 characters
        post["content"] = post["content"][:300] + "\n\n... [REDACTED - PREMIUM CONTENT] ..."
        # Generate UPI Deep Link
        price = post.get("price", 29)
        upi_url = f"upi://pay?pa={UPI_ID}&pn={NAME}&am={price}&cu=INR&tn=Unlock-{slug}"
        post["payment_link"] = upi_url
        post["locked"] = True
    else:
        post["locked"] = False
        
    return post
