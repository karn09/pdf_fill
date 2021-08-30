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

    let fileNameArr = [];

    this.nameTokens.forEach((token, idx) => {
      const lcToken = token.toLowerCase();

      if (data[lcToken]) {
        this.tokenMap[token] = idx;
        fileNameArr.push(data[lcToken]);
      } else {
        fileNameArr.push(token);
      }
    });

    return this.#joinNameTokens(fileNameArr);
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

    return this.#joinNameTokens(fileNameArr)
  }

  #joinNameTokens(fileNameArr) {
    let fileName = fileNameArr.join(this.delimiter);
    return fileName.replace('pdf', 'fdf')
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

export default FdfGenerator;
