import execa from "execa";

class PDFGenerator {
  constructor(pdfTemplatePath, pdfOutputRootPath, password) {
    this.pdfTemplatePath = pdfTemplatePath;
    this.pdfOutputRootPath = pdfOutputRootPath;
    this.password = password;
  }

  pdfOutputFileNamePath(fileName) {
      return `${this.pdfOutputRootPath}/${fileName.replace('fdf', 'pdf')}`
  }

  createPDF(fdf, fdfObject) {
    return execa("pdftk", [
      this.pdfTemplatePath,
      "fill_form",
      fdf.getFdfFilePath(fdfObject),
      "output",
      this.pdfOutputFileNamePath(fdf.getFileName(fdfObject)),
      "user_pw",
      this.password,
      "allow",
      "AllFeatures",
      // "verbose"
    ]);
  }
}

export default PDFGenerator;
