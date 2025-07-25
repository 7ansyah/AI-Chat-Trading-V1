import requests

def smart_web_search(query: str) -> str:
    api_key = "YOUR_SERPAPI_KEY"
    params = {
        "q": query,
        "api_key": api_key,
        "engine": "google",
    }
    response = requests.get("https://serpapi.com/search", params=params)
    results = response.json()
    return results["organic_results"][0]["snippet"]
