import React from 'react';
const InvoiceDetails = (props) => {

    const handleChange = (event) => {
        props.onChange(event.target.name, event.target.value);
    }
    const keep11DigitBound = (event) => {
        if (event.code >= 100000000000) {
            event.preventDefault();
        }
    };
    const keep11DigitPasteBounds = (event) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));

        if (pastedData >= 100000000000) {
            event.preventDefault();
        }
    }
    const preventPasteNegative = (event) => {
        props.onPaste(event);
    }
    const preventMinus = (event) => {
        props.onKeyDown(event);
    }

    return (
        <>
            <div id="invoice-buyer" className="invoice-init-values">
                <h4 className="invoice-headers">Buyer details</h4>
                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">Company</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="company" name="buyercompany" onChange={handleChange} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">Name</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="name" name="buyername" onChange={handleChange} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">Address</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="address" name="buyeraddress" onChange={handleChange} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">Electronic&nbsp;Address</label>
                    <div class="col-sm-5 ms-5">
                        <input type="number" class="form-control-sm" placeholder="123456789" name="buyerelectronicaddress" onChange={handleChange} onPaste={(e) => { preventPasteNegative(e); keep11DigitPasteBounds(e) }} onKeyDown={(e) => { preventMinus(e); keep11DigitBound(e) }} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-buyer-details">Electronic&nbsp;Address&nbsp;Scheme</label>
                    <div class="col-sm-5">
                        <select style={{ width: "90px" }} name="buyerelectronicaddressscheme" onChange={handleChange}>
                            <option value="0151">0151</option>
                            <option value="0002">0002</option>
                            <option value="0009">0009</option>
                            <option value="0060">0060</option>
                            <option value="0130">0130</option>
                            <option value="0188">0188</option>
                            <option value="0199">0199</option>
                            <option value="9932">9932</option>
                            <option value="9959">9959</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">City</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="city" name="buyercity" onChange={handleChange} />
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="invoice-buyer-details" class="col-sm-2 col-form-label-sm">Country</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="country" name="buyercountry" onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div id="invoice-seller" className="invoice-init-values">
                <h4 className="invoice-headers">Seller details</h4>
                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">Company</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="company" name="sellercompany" onChange={handleChange} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">Name</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="name" name="sellername" onChange={handleChange} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">Address</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="address" name="selleraddress" onChange={handleChange} />
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">Electronic&nbsp;Address</label>
                    <div class="col-sm-6 ms-5">
                        <input type="number" class="form-control-sm" placeholder="123456789" name="sellerelectronicaddress" onChange={handleChange} onPaste={(e) => { preventPasteNegative(e); keep11DigitPasteBounds(e) }} onKeyDown={(e) => { preventMinus(e); keep11DigitBound(e) }} />
                    </div>
                </div>

                <div class="row mb-2">
                    <label for="invoice-seller-details">Electronic&nbsp;Address&nbsp;Scheme</label>
                    <div class="col-sm-5">
                        <select style={{ width: "90px" }} name="sellerelectronicaddressscheme" onChange={handleChange}>
                            <option value="0151">0151</option>
                            <option value="0002">0002</option>
                            <option value="0009">0009</option>
                            <option value="0060">0060</option>
                            <option value="0130">0130</option>
                            <option value="0188">0188</option>
                            <option value="0199">0199</option>
                            <option value="9932">9932</option>
                            <option value="9959">9959</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">City</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="city" name="sellercity" onChange={handleChange} />
                    </div>
                </div>
                <div class="row mb-2">
                    <label for="invoice-seller-details" class="col-sm-2 col-form-label-sm">Country</label>
                    <div class="col-sm-6">
                        <input type="text" class="form-control-sm" placeholder="country" name="sellercountry" onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div id="invoice-date" className="invoice-init-values">
                <h4 className="invoice-headers">Other details</h4>
                <div class="row mb-3">
                    <label for="invoice-date-details">Issue&nbsp;Date</label>
                    <div class="col-sm-7 mt-2">
                        <input type="date" class="form-control-sm" name="issuedate" onChange={handleChange} />
                    </div>
                </div>


                <div class="row mb-3">
                    <label for="invoice-date-details">Due&nbsp;Date</label>
                    <div class="col-sm-7 mt-2">
                        <input type="date" class="form-control-sm" name="duedate" onChange={handleChange} />
                    </div>
                </div>


            </div>
        </>
    );
}

export default InvoiceDetails;