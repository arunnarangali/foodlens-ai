"""Check a deployed static frontend/API without making any AI inference calls."""
import argparse
import json
import re
import time
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


def fetch(base, path):
    try:
        response = urlopen(base + path, timeout=5)
    except HTTPError as error:
        response = error
    with response:
        body = response.read(2 * 1024 * 1024 + 1)
        if len(body) > 2 * 1024 * 1024:
            raise AssertionError("Smoke response exceeded limit")
        return response.code, response.headers, body


def smoke(base, timeout):
    deadline = time.monotonic() + timeout
    while True:
        try:
            status, headers, body = fetch(base, "/api/health")
            assert status == 200 and json.loads(body) == {"status": "ok"}
            assert "application/json" in headers.get("Content-Type", "")
            break
        except (URLError, TimeoutError, AssertionError, ValueError):
            if time.monotonic() >= deadline:
                raise SystemExit("Health endpoint did not become ready")
            time.sleep(1)
    status, headers, body = fetch(base, "/")
    assert status == 200 and "text/html" in headers.get("Content-Type", "")
    assets = re.findall(r'(?:src|href)="(/assets/[^"?]+)"', body.decode())
    assert assets, "Built homepage did not reference frontend assets"
    for asset in assets:
        status, headers, _ = fetch(base, asset)
        assert status == 200, "Built asset was not served"
        if asset.endswith(".js"):
            assert "javascript" in headers.get("Content-Type", "")
        if asset.endswith(".css"):
            assert "text/css" in headers.get("Content-Type", "")
    for path, expected_status, expected_code in [
        ("/api/not-found", 404, "NOT_FOUND"),
        ("/api/analyze", 405, "METHOD_NOT_ALLOWED"),
    ]:
        status, headers, body = fetch(base, path)
        assert status == expected_status and json.loads(body)["error"]["code"] == expected_code
        assert "application/json" in headers.get("Content-Type", "")
    for path in ["/.env", "/backend/.env", "/assets/missing.js", "/assets/"]:
        status, _, _ = fetch(base, path)
        assert status == 404, "Private/missing path unexpectedly served"
    print("PASS: homepage, built assets, process health, API errors and private-file checks; no AI calls.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url")
    parser.add_argument("--timeout", type=int, default=60)
    args = parser.parse_args()
    smoke(args.url.rstrip("/"), args.timeout)
