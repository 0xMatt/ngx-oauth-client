"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ngx_oauth_client_1 = require("./ngx-oauth-client");
var core_1 = require("@angular/core");
var NgxTestClientTwo = (function (_super) {
    __extends(NgxTestClientTwo, _super);
    function NgxTestClientTwo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgxTestClientTwo.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    NgxTestClientTwo.ctorParameters = function () { return []; };
    NgxTestClientTwo = __decorate([
        ngx_oauth_client_1.Configuration({
            host: 'http://127.0.0.1',
            token: 'oauth/token',
            key: 'my_key',
            storage_prefix: 'two_'
        })
    ], NgxTestClientTwo);
    return NgxTestClientTwo;
}(ngx_oauth_client_1.NgxOAuthClient));
exports.NgxTestClientTwo = NgxTestClientTwo;
//# sourceMappingURL=ngx-test-client-two.js.map