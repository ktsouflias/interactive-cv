import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadPdfFromElement(el, filename = "CV.pdf") {
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let remaining = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  remaining -= pageHeight;

  while (remaining > 0) {
    pdf.addPage();
    position = position - pageHeight;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    remaining -= pageHeight;
  }

  pdf.save(filename);
}
