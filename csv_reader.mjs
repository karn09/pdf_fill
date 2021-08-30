import { parseStream } from "fast-csv";
import * as fs from "fs";

class CSVReader {
  constructor(pathToCSV) {
    this.csvStream = fs.createReadStream(pathToCSV);
  }

  async getHeaders() {
    await this.#initialize();
    return this.csvData.headers;
  }

  async getData() {
    await this.#initialize();
    return this.csvData.data;
  }

  async #doInitialize() {
    this.csvData = await this.#readCSV();
  }

  async #initialize() {
    if (!this.initializationPromise) {
      this.initializationPromise = this.#doInitialize();
    }
    return this.initializationPromise;
  }

  async #readCSV() {
    let headersBuffer = [];
    let dataBuffer = [];

    return new Promise((resolve, reject) => {
      parseStream(this.csvStream, { headers: true })
        .on("headers", (headers) => {
          headersBuffer = headers;
        })
        .on("error", (err) => {
          reject(err);
        })
        .on("data", (data) => {
          dataBuffer.push(data);
        })
        .on("end", () => {
          resolve({
            headers: headersBuffer,
            data: dataBuffer,
          });
        });
    });
  }
}

export default CSVReader;
