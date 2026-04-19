import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadPdfFromElement(el, filename = "CV.pdf", options = {}) {
  if (!el) return;

  const {
    preferSinglePage = true,
    singlePageThreshold = 1.18,
    pageBreakSelectors = [".cv-hero-shell", ".cv-section-card"],
    minPageFill = 0.72,
  } = options;

  const scale = 2;

  const canvas = await html2canvas(el, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pagesNeeded = imgHeight / pageHeight;

  if (preferSinglePage && pagesNeeded > 1 && pagesNeeded <= singlePageThreshold) {
    const fittedWidth = (canvas.width * pageHeight) / canvas.height;
    const x = Math.max(0, (pageWidth - fittedWidth) / 2);
    pdf.addImage(imgData, "PNG", x, 0, fittedWidth, pageHeight);
    pdf.save(filename);
    return;
  }

  const sourcePageHeight = canvas.width * (pageHeight / pageWidth);
  const pageRanges = getPageRanges(el, canvas, sourcePageHeight, pageBreakSelectors, scale, minPageFill);

  pageRanges.forEach((range, index) => {
    if (index > 0) pdf.addPage();

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = range.height;
    const ctx = pageCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      range.start,
      canvas.width,
      range.height,
      0,
      0,
      canvas.width,
      range.height
    );

    const pageData = pageCanvas.toDataURL("image/png");
    const pageImgHeight = (range.height * imgWidth) / canvas.width;
    pdf.addImage(pageData, "PNG", 0, 0, imgWidth, pageImgHeight);
  });

  pdf.save(filename);
}

function getPageRanges(root, canvas, sourcePageHeight, selectors, scale, minPageFill) {
  const rootRect = root.getBoundingClientRect();
  const boundaries = selectors
    .flatMap((selector) => Array.from(root.querySelectorAll(selector)))
    .map((node) => Math.round((node.getBoundingClientRect().top - rootRect.top) * scale))
    .filter((value) => value > 0 && value < canvas.height)
    .sort((a, b) => a - b);

  const ranges = [];
  let start = 0;

  while (start < canvas.height) {
    const idealEnd = Math.min(canvas.height, start + sourcePageHeight);
    const minAcceptableEnd = start + sourcePageHeight * minPageFill;
    const candidate = [...boundaries]
      .reverse()
      .find((value) => value <= idealEnd && value >= minAcceptableEnd);

    const end = candidate && candidate > start ? candidate : idealEnd;
    ranges.push({
      start,
      height: Math.max(1, Math.round(end - start)),
    });
    start = Math.round(end);
  }

  return ranges;
}
