import React from "react";
import Head from "next/head";

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div>
            <Head>
                <title>Pin-it App</title>
            </Head>
            <header>
                <Navbar />
            </header>
            <main className="p-2.5">
                {children}
            </main>
            <footer className="p-2.5">
                <Footer />
            </footer>
        </div>
    );
}

export default Layout;
