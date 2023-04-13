import React, { useEffect, useState } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceDetails from "./InvoiceDetails";
import Currency from "../Currency/Currency";
import InvoiceOptions from './InvoiceOptions';
const Invoice = () => {
    const initialState = {
        buyercompany: "",
        buyername: "",
        buyeraddress: "",
        buyerelectronicaddress: "11111111111",
        buyerelectronicaddressscheme: "0151",
        buyercity: "",
        buyercountry: "",
        sellercompany: "",
        sellername: "",
        selleraddress: "",
        sellerelectronicaddress: "11111111111",
        sellerelectronicaddressscheme: "0151",
        sellercity: "",
        sellercountry: "",
        buyerreference: "",
        invoicecurrency: "AUD",
        duedate: "1970-01-01",
        issuedate: "1970-01-02",
        grossamount: "0",
        taxamount: "0",
        discount: "0",
        nettotal: "0"
    };
    const [itemIds, setItemIds] = useState([]);
    const [items, setItems] = useState([]);         // If there are no E-invoice items, the E-invoice validator must check there is at least 1 invoice line
    const [count, setCount] = useState(0);
    const [data, setData] = useState(initialState);

    const handleChange = (key, value) => {
        setData((data) => ({ ...data, [key]: value }));
    }

    // const handleChangeItem = (id, key, value) => {
    //     const temp = data[`line${id}`];
    //     // temp[key] = value;
    //     console.log("here" + temp + JSON.stringify(data));
    //     setData({ ...data, [`line${id}`]: temp });
    // }

    const handlePercentChange = (key, value) => {
        if (value > 100) {
            setData((data) => ({ ...data, [key]: data['discount'] }));
        } else {
            setData((data) => ({ ...data, [key]: value }));
        }
    }

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleAddItem = (e) => {
        e.preventDefault();
        const itemId = count;
        setCount(count + 1);
        setItemIds(itemIds => ([...itemIds, itemId]));
        setItems(items => ([...items, <InvoiceItem key={itemId} id={itemId} onRemove={handleRemoveItem} onChange={handleChange} onPaste={preventPasteNegative} onKeyDown={preventMinus} />]));
        setData(data => ({ ...data, [`name${itemId}`]: "item", [`quantity${itemId}`]: "0", [`unitcode${itemId}`]: "C62", [`description${itemId}`]: "item description", [`cost${itemId}`]: "0" }));
    };
    const handleRemoveItem = (id) => {
        if (itemIds.length == 0) {
            return;
        }
        const updatedItemIds = (itemIds) => itemIds.filter(itemId => itemId !== id);
        setItemIds(updatedItemIds);
        const updatedItems = (items) => items.filter(item => item.props.id !== id);
        setItems(updatedItems);

        setData(data => {
            const copy = { ...data };
            delete copy[`name${id}`];
            delete copy[`quantity${id}`];
            delete copy[`unitcode${id}`];
            delete copy[`description${id}`];
            delete copy[`cost${id}`];
            return copy;
        });
    }


    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    };

    const preventPasteNegative = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));

        if (pastedData < 0) {
            e.preventDefault();
        }
    };

    // const percentBounds = (e) => {
    //     console.log(e.target.value);
    //     console.log(parseInt(e.target.value));

    //     if (parseInt(e.target.value) > 100) {
    //         e.preventDefault();
    //     }
    // }

    // setItemIds(itemIds => ([...itemIds, 0]));
    // setItems(items => ([...items, <InvoiceItem key={0} id={0} onRemove={handleRemoveItem} onChange={handleChange} onPaste={preventPasteNegative} onKeyDown={preventMinus} />]));
    return (
        <div id="invoice-box">
            <InvoiceOptions data={data} />
            <div id="invoice-title">
                <h1>INVOICE</h1>
                <label for="invoiceid" class="col-sm-5 col-form-label">Invoice ID</label>
                <div class="col-sm-8">
                    <input type="number" class="form-control" onChange={(e) => handleChange('invoiceid', e.target.value)} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                </div>
                <label for="buyerref" class="col-sm-8 col-form-label">Buyer Reference</label>
                <div class="col-sm-8">
                    <input type="string" class="form-control" onChange={(e) => handleChange('buyerreference', e.target.value)} onPaste={preventPasteNegative} onKeyDown={preventMinus} />
                </div>
            </div>

            <InvoiceDetails onChange={handleChange} onPaste={preventPasteNegative} onKeyDown={preventMinus} />

            <div id="invoice-item-list">
                <div id="invoice-item-tab">
                    <ul className="invoice-elements">
                        <li>Item</li>
                        <li>Quantity</li>
                        <li>Unit</li>
                        <li>Description</li>
                        <li>Cost</li>
                    </ul>
                </div>
                <form name="item-details" id="item-form">
                    {items}
                </form>
                <div class="d-grid gap-2 col-6 ms-5">
                    <button onClick={handleAddItem} type="button" class="btn btn-sm" style={{
                        textAlign: "left", backgroundColor: "#DCDCDC"
                    }}>+ Add Invoice Line</button>
                </div>
            </div>

            <Currency onChange={handleChange} />

            <div id="invoice-final-details">
                <div id="invoice-gross-amount" class="row mb-1">
                    <label for="gross-amount" class="col-sm-4 col-form-label">Gross&nbsp;Total</label>
                    <div class="col-sm-5">
                        <input type="number" class="form-control" onChange={(e) => handleChange('grossamount', e.target.value)} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                    </div>
                </div>
                <div id="invoice-tax-amount" class="row mb-1">
                    <label for="tax-amount" class="col-sm-4 col-form-label">Tax&nbsp;Total</label>
                    <div class="col-sm-5">
                        <input type="number" class="form-control" onChange={(e) => handleChange('taxamount', e.target.value)} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                    </div>
                </div>
                <div id="invoice-discount" class="row mb-0">
                    <label for="discount-amount" class="col-sm-2 col-form-label">Discount:(%)</label>
                    <div class="col-sm-6 ms-5">
                        <input type="number" class="form-control" onChange={(e) => { handlePercentChange('discount', e.target.value) }} onPaste={preventPasteNegative} onKeyDown={(e) => { preventMinus(e) }} min={0} max={100} />
                    </div>
                </div>
                <div id="invoice-net-amount" class="row mb-1">
                    <label for="net-amount" class="col-sm-4 col-form-label">Net&nbsp;Total</label>
                    <div class="col-sm-5">
                        <input type="number" class="form-control" onChange={(e) => handleChange('nettotal', e.target.value)} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                    </div>
                </div>
            </div>
            <div id="invoice-note">
                <div class="input-group input-group-sm">
                    <span class="input-group-text">Notes</span>
                    <textarea class="form-control" rows={2} aria-label="With textarea" onChange={(e) => handleChange('notes', e.target.value)}></textarea>
                </div>
            </div>
            <div id="invoice-footer">Invoice formatted in accordance with A-NZ-PEPPOL-BIS-3.0 UBL XML rules</div>
        </div >
    );
}
export default Invoice;