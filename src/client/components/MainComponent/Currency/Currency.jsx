import React, { useState } from 'react'

const Currency = (props) => {
    const [selectedCurrency, setSelectedCurrency] = useState("AUD");
    const selectCurrency = e => {
        setSelectedCurrency(e.target.value);
        props.onChange('invoicecurrency', e.target.value);
    }
    return (
        <div id="currency-box">
            <label class="form-label">Choose a currency</label>
            <div class="d-grid my-1 gap-2 d-md-block">
                <button type="button" onClick={e => selectCurrency(e, "value")} class="btn btn-secondary btn-sm my-1" value={"USD"}>USD ($)</button>
                <button type="button" onClick={e => selectCurrency(e, "value")} class="btn btn-secondary btn-sm my-1" value={"AUD"}>AUD ($)</button>
                <button type="button" onClick={e => selectCurrency(e, "value")} class="btn btn-secondary btn-sm my-1" value={"NZD"}>NZD ($)</button>
                <button type="button" onClick={e => selectCurrency(e, "value")} class="btn btn-secondary btn-sm my-1 mb-3" value={"EUR"}>EUR (&euro;)</button>
                <div>{selectedCurrency}</div>
            </div>
        </div>
    );
}

export default Currency;
