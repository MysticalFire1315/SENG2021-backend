import Head from 'next/head';
import NavHeader from '../components/NavbarElements';
import Header from '../components/Header/Header';
import Carousel from '../components/Carousel/Carousel';
import MainComponent from '../components/MainComponent/MainComponent';
import { BoxLeft, BoxRight } from '../components/ScrollBox/ScrollBox';
import Invoice from '../components/MainComponent/Invoice/Invoice';
import Footer from '../components/Footer/Footer';
export default function Home() {
  return (
    <div id="Home" className="app">
      <Head>
        <title>Elegant E-invoices</title>
      </Head>
      <div id="darker-section">
        <NavHeader />
        <Header />
        <Carousel />
      </div>
      <div id="info-section">
        <MainComponent />
        <BoxLeft />
        <BoxRight />
      </div>
      <Invoice />
      <Footer />
    </div>
  );
}
