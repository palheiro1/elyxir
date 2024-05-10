import { QrReader } from '@cmdnio/react-qr-reader';

const QRReader = ({ handleInput }) => {
    return (
        <QrReader
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
            onResult={result => {
                if (result) {
                    handleInput(result?.text);
                }
            }}
        />
    );
};

export default QRReader;
