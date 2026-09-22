import pymupdf


def extract_pdf_text(file_path: str) -> str:
    """
    Extract text from a PDF screenplay.
    """

    document = pymupdf.open(file_path)
    
    pages = []

    for page in document:
        text = page.get_text()
        pages.append(text)

    document.close()

    screenplay_text = "\n".join(pages).strip()

    if not screenplay_text:
        raise ValueError(
            "No text could be extracted from the PDF."
        )

    return screenplay_text