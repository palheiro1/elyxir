import React, { useState } from 'react';
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
import { cleanInfoAccount } from './data/DefaultInfo/cleanInfoAccount';
import Exchange from './pages/Exchange/Exchange';
import Welcome from './components/Pages/WelcomePage/Welcome';

function App() {
    const [infoAccount, setInfoAccount] = useState(cleanInfoAccount);
    const isLogged = infoAccount.token !== null && infoAccount.accountRs !== null;
    const [marketFlag, setMarketFlag] = useState(false);

    const goToMarket = () => {
        setMarketFlag(true);
        setTimeout(() => {
            setMarketFlag(false);
        }, 10);
    };

    return (
        <ChakraProvider theme={theme}>
            <Header
                isLogged={isLogged}
                IGNISBalance={infoAccount.IGNISBalance}
                GIFTZBalance={infoAccount.GIFTZBalance}
                GEMSBalance={infoAccount.GEMSBalance}
                username={infoAccount.name}
                goToMarket={goToMarket}
            />
            <Routes>
                {/* LOGING PAGE / CREATE WALLET / RESTORE WALLET */}
                <Route path="/" element={<Navigate replace to="/login" />} />

                <Route path="/login" element={<Login setInfoAccount={setInfoAccount} />} />

                <Route path="/register" element={<Register />} />

                <Route path="/restore" element={<Restore />} />

                {/* HOME PAGE */}
                <Route
                    path="/home"
                    element={<Home infoAccount={infoAccount} setInfoAccount={setInfoAccount} marketFlag={marketFlag} />}
                />

                <Route path="/welcome" element={<Welcome />} />

                {/* EXCHANGE PAGE */}
                <Route path="/exchange" element={<Exchange infoAccount={infoAccount} />} />

                {/* 404 - NOT FOUND */}
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
            <Footer isLogged={isLogged} />
        </ChakraProvider>
    );
}

export default App;
