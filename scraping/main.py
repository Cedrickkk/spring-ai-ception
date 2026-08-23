import io
import json
import re
import tarfile
from pathlib import Path
from typing import Iterator, TypedDict

import requests

ARCHIVE_URL = "https://github.com/spring-projects/spring-ai/archive/refs/tags/v2.0.0.tar.gz"
PAGES_SUBPATH = "spring-ai-docs/src/main/antora/modules/ROOT/pages/"
OUTPUT_PATH = Path("../data/docs.jsonl")

INCLUDE_LINE_RE = re.compile(r"^include::.*$\n?", re.MULTILINE)
ATTRIBUTE_RE = re.compile(r"\{[\w-]+\}")


class DocPage(TypedDict):
    path: str
    title: str | None
    content: str


def download_archive(url: str) -> bytes:
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    return response.content


def clean_adoc(text: str) -> str:
    text = INCLUDE_LINE_RE.sub("", text)
    text = ATTRIBUTE_RE.sub("", text)
    return text.strip()


def extract_title(text: str) -> str | None:
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("= "):
            return line[2:].strip()
    return None


def iter_pages(archive_bytes: bytes) -> Iterator[tuple[str, str]]:
    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as tar:
        for member in tar.getmembers():
            if not member.isfile() or not member.name.endswith(".adoc"):
                continue
            if PAGES_SUBPATH not in member.name:
                continue
            fileobj = tar.extractfile(member)
            if fileobj is None:
                continue
            raw = fileobj.read().decode("utf-8", errors="replace")
            relative_path = member.name.split(PAGES_SUBPATH, 1)[1]
            yield relative_path, raw


def main() -> None:
    print(f"Downloading {ARCHIVE_URL} ...")
    archive_bytes = download_archive(ARCHIVE_URL)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    count = 0
    with OUTPUT_PATH.open("w", encoding="utf-8") as out:
        for relative_path, raw in iter_pages(archive_bytes):
            content = clean_adoc(raw)
            if not content:
                continue
            record: DocPage = {
                "path": relative_path,
                "title": extract_title(content),
                "content": content,
            }
            out.write(json.dumps(record, ensure_ascii=False) + "\n")
            count += 1

    print(f"Wrote {count} pages to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
