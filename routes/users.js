var express = require('express');
const PDFDocument = require('pdfkit')
const moment = require('moment')
var qr = require('qr-image');
var base64 = require('base64-stream');
var router = express.Router();

var ROOT_IMAGES_QR = './public/images';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/report-pdf', function (req, res, next) {

  /**
   * Id User belong to here after select of get from params 
   */
  let idUser = '22323';

  /**
   * Timestamp generate for pdf in order for unique name 
   */
  let currentDate = moment().format('YYYY-MM-DD');
  let filename = `report-${currentDate}`;

  const doc = new PDFDocument()
  let stringRandomNameQr = Math.random().toString(36).substring(2);

  /**
   * Generate QR Name By String Random as PNG
   */
  let getUniXStimeStamp =moment().unix();
  let prepareNameQr = `${ROOT_IMAGES_QR}/${stringRandomNameQr}-${getUniXStimeStamp}-qr.png`;
  let qr_svg = qr.image(idUser, { type: 'png' });

  /**
   * Write QR to Image Folder if write is finish we create the pdf read from file
   */
  let stream = qr_svg.pipe(require('fs').createWriteStream(prepareNameQr));
  stream.on('finish', () => {


    filename = encodeURIComponent(filename) + '.pdf'

    // Setting response to 'attachment' (download).
    // If you use 'inline' here it will automatically open the PDF
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    const content = 'asasasas'
    doc.y = 300
    doc.text(content, 50, 50);

    /**
     * Insert the QR Code to pdf 
     */
    doc.image(prepareNameQr, {
      fit: [250, 300],
      align: 'center',
      valign: 'center'
    });

    doc.pipe(res)
    doc.end()
  });
});

module.exports = router;
