import urllib.request
import json
import re

def extract_icons(app_store_url):
    match = re.search(r'id(\d+)', app_store_url)
    if not match:
        return "Invalid URL"
    app_id = match.group(1)
    api_url = f"https://itunes.apple.com/lookup?id={app_id}"
    try:
        with urllib.request.urlopen(api_url) as response:
            data = json.loads(response.read().decode())
            if not data['results']:
                return "App not found"
            base_url = data['results'][0].get('artworkUrl512')
            return [base_url.replace('512x512bb', f'{s}x{s}bb') for s in [60, 100, 180, 512, 1024]]
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    print(extract_icons("https://apps.apple.com/us/app/instagram/id389801252"))
