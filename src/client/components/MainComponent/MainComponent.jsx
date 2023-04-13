import React from "react";
import Image from "next/image";
const MainComponent = () => {
    return (
        <main className="main-component">
            <Image src="/invoice.png" alt="invoice.png" width={200} height={200} style={{ marginBottom: "40px" }} />
            <div id="main-text">
                <h3 >The Simple Solution for SMP Business & Clients Invoice Generation</h3>
                <br></br>
                <p>With an easy-to-use, interactive and adjustable E-invoice formatter, small to medium enterprises as well as ordinary clients are able to quickly and efficiently save and store transactions. Tailor your transaction details according to your needs!</p>
                <br></br>
                <br></br>
                <h3>A Diverse Range of E-Invoice Features</h3>
                <br></br>
                <p>With a wide variety of different E-invoice features, Elegant Builders offers user friendly access to E-invoice creation, generation, validation and storage. We aim to ensure that you are able to have the smoothest experience possible when it comes to the all too complex realm of invoice handling every step of the way.</p>
                <br></br>
                <br></br>
                <h3>Free, Convenient, Fit For The Eyes</h3>
                <br></br>
                <p>Those of us at Elegant Builders understand that what people are looking for in an E-invoice tool isn&apos;t the wide assortment of features that so many find online, but a return to the basics, displaying only the necessary information. So we developed a tool that could be easily understood without having to worry about the semantics. And not a dime needs to be spent!</p>
                <br></br>
                <br></br>
                <h3>Have Any Questions?</h3>
                <br></br>
                <p>Contact us via our email z5420277@ad.unsw.edu.au, or get in touch with our team directly at UNSW!</p>
            </div>
        </main>
    );
}
export default MainComponent;