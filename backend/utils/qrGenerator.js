const QRCode = require('qrcode');

const generateQrDataUrl = async (text) => {
  try {
    const url = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
    });
    return url; 
  } catch (err) {
    console.error('Failed to generate QR:', err);
    throw err;
  }
};

module.exports = { generateQrDataUrl };
