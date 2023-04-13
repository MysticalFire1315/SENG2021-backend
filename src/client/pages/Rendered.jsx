import React from 'react';
import NavHeader from '../components/NavbarElements';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
export default function Rendered() {
  return (
    <div id="Rendered" className="app">
      <Head>
        <title>Elegant Invoice</title>
      </Head>
      <NavHeader />
      <h1 style={{ textAlign: "center" }}>Rendered invoice will only be shown below if E-invoice is created</h1>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* This sets the html directly */}
      <div dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? localStorage.getItem('rawHtml') : null }}></div>
      <Footer />
    </div>
  );
};
