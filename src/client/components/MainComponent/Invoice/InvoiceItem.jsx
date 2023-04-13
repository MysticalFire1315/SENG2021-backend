import React from "react";
const InvoiceItem = (props) => {
    const id = props.id;

    const name = `name${id}`;
    const quantity = `quantity${id}`;
    const description = `description${id}`;
    const cost = `cost${id}`;
    const unitcode = `unitcode${id}`;

    const handleRemoveItem = () => {
        props.onRemove(id);
    }
    const handleChangeItem = (event) => {
        props.onChange(event.target.name, event.target.value);
    }
    const preventPasteNegative = (event) => {
        props.onPaste(event);
    }
    const preventMinus = (event) => {
        props.onKeyDown(event);
    }

    return (
        <div className="invoice-item">
            <ul className="invoice-element-value">
                <li className="item-name">
                    <input type="text" className="txtbgcolor" name={name} placeholder="item" style={{ width: "255px" }} onChange={handleChangeItem} />
                </li>
                <li className="item-quantity">
                    <input type="number" className="txtbgcolor" name={quantity} placeholder="quantity" style={{ width: "80px" }} onChange={handleChangeItem} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                </li>
                <li className="item-code">
                    <select style={{ width: "70px" }} name={unitcode} onChange={handleChangeItem} defaultValue={"C62"}>
                        <option value="28">kg/m&sup2;</option>
                        <option value="2N">Db</option>
                        <option value="4H">&micro;m</option>
                        <option value="4P">N/m</option>
                        <option value="A94">g/mol</option>
                        <option value="C45">nm</option>
                        <option value="C62">unit</option>
                        <option value="CMQ">cm&sup3;</option>
                        <option value="CMT">cm</option>
                        <option value="D74">kg/mol</option>
                        <option value="GM">g/m&sup2;</option>
                        <option value="GRM">g</option>
                        <option value="HUR">h</option>
                        <option value="KGM">kg</option>
                        <option value="KL">kg/m</option>
                        <option value="KMQ">kg/m&sup2;</option>
                        <option value="KWT">kW</option>
                        <option value="L2">L/min</option>
                        <option value="LTR">L</option>
                        <option value="MIN">min</option>
                        <option value="MMK">mm&sup2;</option>
                        <option value="MMQ">mm&sup3;</option>
                        <option value="MMT">mm</option>
                        <option value="MTK">m&sup2;</option>
                        <option value="MTQ">m&sup3;</option>
                        <option value="MTR">m</option>
                        <option value="MTS">m/s</option>
                        <option value="OHM">&#8486;</option>
                        <option value="PAL">Pa</option>
                        <option value="SEC">s</option>
                        <option value="VLT">V</option>
                        <option value="WTT">W</option>
                    </select>
                </li>
                <li className="item-description">
                    <input type="text" className="txtbgcolor" name={description} placeholder="description" style={{ width: "230px" }} onChange={handleChangeItem} />
                </li>
                <li className="item-cost">
                    <input type="number" className="txtbgcolor" name={cost} placeholder="cost" style={{ width: "70px" }} onChange={handleChangeItem} onPaste={preventPasteNegative} onKeyDown={preventMinus} min={0} />
                </li>
                <li>
                    <button type="button" className="button-delete" onClick={handleRemoveItem}>x</button>
                </li>
            </ul>
        </div>
    );
}

export default InvoiceItem;