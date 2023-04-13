import React from "react";
import Link from "next/link";
const NavHeader = () => {
    return (
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <a class="navbar-brand" href="https://www.google.com/search?q=elegant&biw=2400&bih=1166&sxsrf=APwXEdeS44Y8U_hf51NB-N2vpX0rZMYDkg%3A1679812344919&ei=-OYfZPTcN-jg2roP2I2ryAk&ved=0ahUKEwj0uO7Q_Pj9AhVosFYBHdjGCpkQ4dUDCA8&uact=5&oq=elegant&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIECCMQJzIKCAAQigUQsQMQQzINCAAQigUQsQMQgwEQQzINCAAQigUQsQMQgwEQQzIHCAAQigUQQzIHCAAQigUQQzIHCAAQigUQQzIHCAAQigUQQzIHCAAQigUQQzIHCAAQigUQQ0oECEEYAFAAWABgsgJoAHABeACAAdgBiAHYAZIBAzItMZgBAKABAqABAcABAQ&sclient=gws-wiz-serp">Elegant E-invoices</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav nav-items">
                    <li class="nav-item active">
                        <Link class="nav-link" href="/">Home <span class="sr-only"></span></Link>
                    </li>
                    <li class="nav-item dropdown">
                        <Link class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Other Sites
                        </Link>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link class="dropdown-item" href="/">About Us</Link>
                            <Link class="dropdown-item" href="/">Check Stored Invoices</Link>
                            <Link class="dropdown-item" href="/">Create An Invoice!</Link>
                            <div class="dropdown-divider"></div>
                            <Link class="dropdown-item" href="/">See Examples</Link>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <Link class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Behind The Scenes
                        </Link>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link class="dropdown-item" href="https://github.com/cseteaching-unsw-edu-au/se2021-23t1-einvoicing-api-f12a-elegantbuilders-creation-api">Github Backend</Link>
                            <Link class="dropdown-item" href="https://github.com/cseteaching-unsw-edu-au/se2021-23t1-einvoicing-frontend-f12a-elegantbuilders-creation-api">Github Frontend</Link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" href="/Rendered">See Rendered Invoice</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" href="/NeedHelp">Need Help?</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavHeader;