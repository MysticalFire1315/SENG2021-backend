import React from "react"
import Link from "next/link";
const Footer = () => {
    return (
        <footer className="footer">
            <nav class="navbar navbar-footer navbar-expand-md navbar-dark bg-dark">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav footer-items">
                        <li class="nav-item active">
                            <Link class="nav-link" href="https://www.google.com/">Google</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" href="/">Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" href="https://github.com/A-NZ-PEPPOL/A-NZ-PEPPOL-BIS-3.0">E-invoice Rules</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" href="/NeedHelp">Need Help?</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" href="https://github.com/cseteaching-unsw-edu-au/se2021-23t1-einvoicing-api-f12a-elegantbuilders-creation-api">Backend</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" href="https://github.com/cseteaching-unsw-edu-au/se2021-23t1-einvoicing-frontend-f12a-elegantbuilders-creation-api">Frontend</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <nav class="navbar navbar-footer navbar-expand-md navbar-dark bg-dark">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse footer-copyright" id="navbarNav">
                    <p>&copy; Elegant Builders 2023-2023</p>
                </div>
            </nav>
        </footer>
    );
}
export default Footer;