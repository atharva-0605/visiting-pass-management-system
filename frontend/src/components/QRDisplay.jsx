import { useState, useEffect } from 'react';
import { getPassQr } from '../services/api';

const QRDisplay = ({ passId }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (passId) {
      fetchQR();
    }
  }, [passId]);

  const fetchQR = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getPassQr(passId);     
      setQrImage(response.data.qrImage);           
    } catch (err) {
      console.error(err);
      setError('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="qr-loading">Loading QR code...</div>;
  }

  if (error) {
    return <div className="qr-error">{error}</div>;
  }

  if (!qrImage) {
    return <div className="qr-error">No QR code available</div>;
  }

  return (
    <div className="qr-display">
      <img src={qrImage} alt="Visitor Pass QR Code" className="qr-image" />
      <p className="qr-instruction">Scan this QR code at the gate</p>
    </div>
  );
};

export default QRDisplay;
