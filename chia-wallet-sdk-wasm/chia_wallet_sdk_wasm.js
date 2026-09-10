import * as wasm from "./chia_wallet_sdk_wasm_bg.wasm";
export * from "./chia_wallet_sdk_wasm_bg.js";
import { __wbg_set_wasm } from "./chia_wallet_sdk_wasm_bg.js";
__wbg_set_wasm(wasm);