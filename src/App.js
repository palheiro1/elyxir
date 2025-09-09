import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { theme } from './themes/theme';

// General components
import Header from './components/Navigation/Header/Header';
import Footer from './components/Navigation/Footer/Footer';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Restore from './pages/Restore/Restore';
import Home from './pages/Home/Home';
import Account from './components/Pages/AccountPage/Account';

// Data
import { cleanInfoAccount } from './data/DefaultInfo/cleanInfoAccount';

// Styles
import './App.css';
import Redeem from './pages/Redeem/Redeem';
import { clearCacheData, getVersion, setVersion } from './utils/storage';

function App() {
    const [infoAccount, setInfoAccount] = useState(cleanInfoAccount);
    const isLogged = infoAccount.token !== null && infoAccount.accountRs !== null;
    const showHeaderAndFooter = true;

    useEffect(() => {
        const cachedVersion = getVersion();
        const currentVersion = process.env.REACT_APP_GIT_SHA;

        if (cachedVersion !== currentVersion) {
            clearCacheData();
            // localStorage.clear();
            setVersion(currentVersion);
            window.location.reload();
        }
    }, []);

    return (
        <ChakraProvider theme={theme}>
            {showHeaderAndFooter && <Header isLogged={isLogged} />}
            <Routes>
                {/* LOGING PAGE / CREATE WALLET / RESTORE WALLET */}
                <Route path="/" element={<Navigate replace to="/login" />} />

                <Route path="/login" element={<Login setInfoAccount={setInfoAccount} />} />

                <Route path="/register" element={<Register />} />

                <Route path="/restore" element={<Restore />} />

                <Route path="/redeem" element={<Redeem />} />

                {/* HOME PAGE */}
                <Route path="/" element={<Home infoAccount={infoAccount} setInfoAccount={setInfoAccount} />} />
                <Route path="/home" element={<Home infoAccount={infoAccount} setInfoAccount={setInfoAccount} />} />
                <Route path="/account" element={<Account />} />                

                {/* 404 - NOT FOUND */}
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
            {showHeaderAndFooter && <Footer isLogged={isLogged} />}
        </ChakraProvider>
    );
}

export default App;
