"use strict";
(() => {
var exports = {};
exports.id = 338;
exports.ids = [338];
exports.modules = {

/***/ 9648:
/***/ ((module) => {

module.exports = import("axios");;

/***/ }),

/***/ 7222:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invoiceCreate": () => (/* binding */ invoiceCreate),
/* harmony export */   "invoiceRender": () => (/* binding */ invoiceRender)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);
axios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

const axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    baseURL: // 'http://seng2021-f12a-api-env.eba-pymctycp.ap-southeast-2.elasticbeanstalk.com/',
    "http://localhost:3000/"
});
// Returns an object of structure `{ token: string; violations: string[] }`
const invoiceCreate = async (data)=>{
    console.log(data);
    const axiosResponse = await axiosInstance.post("frontend/invoice/create", data);
    return axiosResponse.data;
};
const invoiceRender = async (token)=>{
    const axiosResponse = await axiosInstance.get("frontend/invoice/render", {
        params: {
            token
        }
    });
    return axiosResponse.data;
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(7222));
module.exports = __webpack_exports__;

})();