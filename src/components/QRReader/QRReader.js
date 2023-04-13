import { QrReader } from 'react-qr-reader';

const QRReader = ({ handleInput }) => {
    return (
        <QrReader
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
            onResult={(result, error) => {
                if (result) {
                    handleInput(result?.text);
                }

                if (error) {
                    console.log('🚀 ~ file: QRReader.js:23 ~ QRReader ~ error:', error);
                }
            }}
        />
    );
};

export default QRReader;
