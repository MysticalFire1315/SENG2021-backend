import React from "react";
import { invoiceCreate, invoiceRender } from "../../../pages/api/backend";

const InvoiceOptions = (props) => {
    const data = props.data;

    const makeInvoice = async () => {
        console.log(data);
        const obj = await invoiceCreate(data);
        console.log(obj);
        if (obj.violations.length !== 0) {
            for (const violation of obj.violations) {
                console.log(violation);
            }
        } else {
            const renderedHtml = await invoiceRender(obj.token);
            console.log(renderedHtml);
            // Redirect users to /rendered endpoint and show html
            // localStorage.setItem('rawHtml', renderedHtml);
            // window.open(`${window.location.origin}/rendered`)
        }
    };

    return (
        <div id="invoice-options">
            <button type="button" class="btn btn-secondary btn-sm">Download My Invoice</button>
            <button type="button" onClick={makeInvoice} class="btn btn-secondary btn-sm">Render My Invoice</button>
            <button type="button" class="btn btn-secondary btn-sm">Save My Invoice</button>
            {/* <div class="row" className="fileInput">
                <label for="formFileSm" class="form-label">Upload a file (.JSON, .YAML, .XML)</label>
                <input class="form-control form-control-sm" id="formFileSm" type="file" />
            </div> */}
        </div>
    );
}

export default InvoiceOptions;