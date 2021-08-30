import * as fdf from "utf8-fdf-generator";
import * as fs from "fs";

class FdfGenerator {
  constructor(nameSchema, delim) {
    this.fdfTemplatePath = "/tmp/convert_csv/fdf";
    this.nameSchema = nameSchema;
    this.delimiter = delim;
    this.nameTokens = this.nameSchema.split(delim);
    this.tokenMap = {};
  }

  getFdfFilePath(dataObj) {
    return `${this.fdfTemplatePath}/${this.getFileName(dataObj)}`;
  }

  getFileName(dataObj) {
    if (this.tokenMap.keys > 0) {
      return this.#fastGetFileName(dataObj);
    }

    const data = this.#rebuildObjectWithLowerCaseKeys(dataObj);

    let fileName = [];

    this.nameTokens.forEach((token, idx) => {
      const lcToken = token.toLowerCase();

      if (data[lcToken]) {
        this.tokenMap[token] = idx;
        fileName.push(data[lcToken]);
      } else {
        fileName.push(token);
      }
    });

    return fileName.join(this.delimiter);
  }

  async createFDF(dataObj) {
    await fs.promises
      .mkdir(this.fdfTemplatePath, { recursive: true })
      .catch(console.error);
    
    fdf.generator(dataObj, this.getFdfFilePath(dataObj));
  }

  #fastGetFileName(dataObj) {
    let fileNameArr = this.nameTokens;
    this.tokenMap.keys.forEach((token) => {
      fileNameArr[this.tokenMap[token]] = dataObj[token];
    });

    return fileNameArr.join(this.delimiter);
  }

  #rebuildObjectWithLowerCaseKeys(dataObj) {
    const keys = Object.keys(dataObj);
    let key;
    let n = keys.length;
    let newobj = {};

    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = dataObj[key];
    }

    return newobj;
  }
}

let a = new FdfGenerator("username_for_Name_PerformanceReview2021.pdf", "_");
console.log(
  await a.createFDF({
    Name: "Joe Shmoe",
    Position: "Marketing",
    Department: "",
    Date: "4/21/2021",
    Reviewer: "Harry Smith",
    Username: "HSmith",
  })
);
