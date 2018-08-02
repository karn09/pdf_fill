const csv = require('fast-csv');
const generator = require('utf8-fdf-generator').generator;
const fdfRoot = 'temp';
const pdfRoot = 'filled';
const _ = require('lodash');
// var childPrc = require("child_process");
const execa = require('execa');
const CSVINPUT = process.argv[2];
const PDF_FILE = process.argv[3];
const PASSWORD = process.argv[4];
const PDFTEMPLATE = PDF_FILE;

csv.fromPath(CSVINPUT, {
    objectMode: true,
    headers: true,
    quote: null,
    strictColumnHandling: false,
    discardUnmappedColumns: true
})
    .on('data', async function(data) {
        try {
            const fdfName = `${data.Username}_for_${
                data.Name
            }_PerformanceReview2018.fdf`;
            // Username_for_Name_PerformanceReview2018
            const pdfName = `${data.Username}_for_${
                data.Name
            }_PerformanceReview2018.pdf`;
            await generator(
                {
                    Name: _.get(data, 'Name', '').trim(),
                    Position: _.get(data, 'Position', '').trim(),
                    Date: _.get(data, 'Date', '').trim(),
                    Reviewer: _.get(data, 'Reviewer', '').trim()
                },
                `${fdfRoot}/${fdfName}`
            );
            await fillPdf(pdfName, fdfName);
            console.log(pdfName);
        } catch (err) {
            console.log(err);
        }
    })
    .on('end', function(numRecords) {
        console.log(numRecords + ' forms created.');
    });

function fillPdf(pdfPath, fdfPath) {
    var pdfFileName = `${pdfRoot}/${pdfPath}`;
    var tempFdfFile = `${fdfRoot}/${fdfPath}`;

    return execa('pdftk', [
        PDFTEMPLATE,
        'fill_form',
        tempFdfFile,
        'output',
        pdfFileName,
        "user_pw",
        PASSWORD,
        'allow',
        'AllFeatures'
        // "verbose"
    ]);
}
