let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_1.set(idx, obj);
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedInt32ArrayMemory0 = null;

function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export function main(id) {
    const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.main(ptr0, len0);
    return ret;
}

function __wbg_adapter_32(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure101_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_35(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure103_externref_shim(arg0, arg1, arg2, arg3);
}

function __wbg_adapter_38(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure99_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_41(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure1304_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_44(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2667_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_47(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2663_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_50(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2661_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_53(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2665_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_56(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2659_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_59(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h95c47200d438bcac(arg0, arg1);
}

function __wbg_adapter_62(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2729_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_1122(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm.closure2754_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_GpuCompilationMessageType = ["error", "warning", "info"];

const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];

const __wbindgen_enum_GpuErrorFilter = ["validation", "out-of-memory", "internal"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

const __wbindgen_enum_VisibilityState = ["hidden", "visible"];

export function __wbg_Window_781446b33bfaba10() { return logError(function (arg0) {
    const ret = arg0.Window;
    return ret;
}, arguments) };

export function __wbg_Window_b27d9723d5e637c1() { return logError(function (arg0) {
    const ret = arg0.Window;
    return ret;
}, arguments) };

export function __wbg_WorkerGlobalScope_2a9376a44447f368() { return logError(function (arg0) {
    const ret = arg0.WorkerGlobalScope;
    return ret;
}, arguments) };

export function __wbg_abort_775ef1d17fc65868() { return logError(function (arg0) {
    arg0.abort();
}, arguments) };

export function __wbg_activeElement_367599fdfa7ad115() { return logError(function (arg0) {
    const ret = arg0.activeElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_activeTexture_0f19d8acfa0a14c2() { return logError(function (arg0, arg1) {
    arg0.activeTexture(arg1 >>> 0);
}, arguments) };

export function __wbg_activeTexture_460f2e367e813fb0() { return logError(function (arg0, arg1) {
    arg0.activeTexture(arg1 >>> 0);
}, arguments) };

export function __wbg_addEventListener_90e553fdce254421() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_addListener_2982bb811b6385c5() { return handleError(function (arg0, arg1) {
    arg0.addListener(arg1);
}, arguments) };

export function __wbg_altKey_c33c03aed82e4275() { return logError(function (arg0) {
    const ret = arg0.altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_altKey_d7495666df921121() { return logError(function (arg0) {
    const ret = arg0.altKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_appendChild_8204974b7328bf98() { return handleError(function (arg0, arg1) {
    const ret = arg0.appendChild(arg1);
    return ret;
}, arguments) };

export function __wbg_attachShader_3d4eb6af9e3e7bd1() { return logError(function (arg0, arg1, arg2) {
    arg0.attachShader(arg1, arg2);
}, arguments) };

export function __wbg_attachShader_94e758c8b5283eb2() { return logError(function (arg0, arg1, arg2) {
    arg0.attachShader(arg1, arg2);
}, arguments) };

export function __wbg_beginComputePass_709dc6cea061b6c7() { return logError(function (arg0, arg1) {
    const ret = arg0.beginComputePass(arg1);
    return ret;
}, arguments) };

export function __wbg_beginQuery_6af0b28414b16c07() { return logError(function (arg0, arg1, arg2) {
    arg0.beginQuery(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_beginRenderPass_2c6c0ec6686fd08b() { return logError(function (arg0, arg1) {
    const ret = arg0.beginRenderPass(arg1);
    return ret;
}, arguments) };

export function __wbg_bindAttribLocation_40da4b3e84cc7bd5() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_bindAttribLocation_ce2730e29976d230() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_bindBufferRange_454f90f2b1781982() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
}, arguments) };

export function __wbg_bindBuffer_309c9a6c21826cf5() { return logError(function (arg0, arg1, arg2) {
    arg0.bindBuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindBuffer_f32f587f1c2962a7() { return logError(function (arg0, arg1, arg2) {
    arg0.bindBuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindFramebuffer_bd02c8cc707d670f() { return logError(function (arg0, arg1, arg2) {
    arg0.bindFramebuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindFramebuffer_e48e83c0f973944d() { return logError(function (arg0, arg1, arg2) {
    arg0.bindFramebuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindRenderbuffer_53eedd88e52b4cb5() { return logError(function (arg0, arg1, arg2) {
    arg0.bindRenderbuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindRenderbuffer_55e205fecfddbb8c() { return logError(function (arg0, arg1, arg2) {
    arg0.bindRenderbuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindSampler_9f59cf2eaa22eee0() { return logError(function (arg0, arg1, arg2) {
    arg0.bindSampler(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindTexture_a6e795697f49ebd1() { return logError(function (arg0, arg1, arg2) {
    arg0.bindTexture(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindTexture_bc8eb316247f739d() { return logError(function (arg0, arg1, arg2) {
    arg0.bindTexture(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_bindVertexArrayOES_da8e7059b789629e() { return logError(function (arg0, arg1) {
    arg0.bindVertexArrayOES(arg1);
}, arguments) };

export function __wbg_bindVertexArray_6b4b88581064b71f() { return logError(function (arg0, arg1) {
    arg0.bindVertexArray(arg1);
}, arguments) };

export function __wbg_blendColor_15ba1eff44560932() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.blendColor(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_blendColor_6446fba673f64ff0() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.blendColor(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_blendEquationSeparate_c1aa26a9a5c5267e() { return logError(function (arg0, arg1, arg2) {
    arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_blendEquationSeparate_f3d422e981d86339() { return logError(function (arg0, arg1, arg2) {
    arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_blendEquation_c23d111ad6d268ff() { return logError(function (arg0, arg1) {
    arg0.blendEquation(arg1 >>> 0);
}, arguments) };

export function __wbg_blendEquation_cec7bc41f3e5704c() { return logError(function (arg0, arg1) {
    arg0.blendEquation(arg1 >>> 0);
}, arguments) };

export function __wbg_blendFuncSeparate_483be8d4dd635340() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_blendFuncSeparate_dafeabfc1680b2ee() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_blendFunc_9454884a3cfd2911() { return logError(function (arg0, arg1, arg2) {
    arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_blendFunc_c3b74be5a39c665f() { return logError(function (arg0, arg1, arg2) {
    arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_blitFramebuffer_7303bdff77cfe967() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
}, arguments) };

export function __wbg_blockSize_1490803190b57a34() { return logError(function (arg0) {
    const ret = arg0.blockSize;
    return ret;
}, arguments) };

export function __wbg_body_942ea927546a04ba() { return logError(function (arg0) {
    const ret = arg0.body;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_bufferData_3261d3e1dd6fc903() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
}, arguments) };

export function __wbg_bufferData_33c59bf909ea6fd3() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
}, arguments) };

export function __wbg_bufferData_463178757784fcac() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
}, arguments) };

export function __wbg_bufferData_d99b6b4eb5283f20() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
}, arguments) };

export function __wbg_bufferSubData_4e973eefe9236d04() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_bufferSubData_dcd4d16031a60345() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_buffer_09165b52af8c5237() { return logError(function (arg0) {
    const ret = arg0.buffer;
    return ret;
}, arguments) };

export function __wbg_buffer_609cc3eee51ed158() { return logError(function (arg0) {
    const ret = arg0.buffer;
    return ret;
}, arguments) };

export function __wbg_button_f75c56aec440ea04() { return logError(function (arg0) {
    const ret = arg0.button;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_buttons_b6346af6f04e4686() { return logError(function (arg0) {
    const ret = arg0.buttons;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_call_7cccdd69e0791ae2() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_cancelAnimationFrame_089b48301c362fde() { return handleError(function (arg0, arg1) {
    arg0.cancelAnimationFrame(arg1);
}, arguments) };

export function __wbg_cancelIdleCallback_669eb1ed294c8b8b() { return logError(function (arg0, arg1) {
    arg0.cancelIdleCallback(arg1 >>> 0);
}, arguments) };

export function __wbg_catch_a6e601879b2610e9() { return logError(function (arg0, arg1) {
    const ret = arg0.catch(arg1);
    return ret;
}, arguments) };

export function __wbg_clearBuffer_4a2a1267126c9b1e() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.clearBuffer(arg1, arg2, arg3);
}, arguments) };

export function __wbg_clearBuffer_b81a2d5d14c0c1cc() { return logError(function (arg0, arg1, arg2) {
    arg0.clearBuffer(arg1, arg2);
}, arguments) };

export function __wbg_clearBufferfv_65ea413f7f2554a2() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_clearBufferiv_c003c27b77a0245b() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_clearBufferuiv_8c285072f2026a37() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_clearDepth_17cfee5be8476fae() { return logError(function (arg0, arg1) {
    arg0.clearDepth(arg1);
}, arguments) };

export function __wbg_clearDepth_670d19914a501259() { return logError(function (arg0, arg1) {
    arg0.clearDepth(arg1);
}, arguments) };

export function __wbg_clearStencil_4323424f1acca0df() { return logError(function (arg0, arg1) {
    arg0.clearStencil(arg1);
}, arguments) };

export function __wbg_clearStencil_7addd3b330b56b27() { return logError(function (arg0, arg1) {
    arg0.clearStencil(arg1);
}, arguments) };

export function __wbg_clearTimeout_b2651b7485c58446() { return logError(function (arg0, arg1) {
    arg0.clearTimeout(arg1);
}, arguments) };

export function __wbg_clear_62b9037b892f6988() { return logError(function (arg0, arg1) {
    arg0.clear(arg1 >>> 0);
}, arguments) };

export function __wbg_clear_f8d5f3c348d37d95() { return logError(function (arg0, arg1) {
    arg0.clear(arg1 >>> 0);
}, arguments) };

export function __wbg_clientWaitSync_6930890a42bd44c0() { return logError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.clientWaitSync(arg1, arg2 >>> 0, arg3 >>> 0);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_close_414b379454494b29() { return logError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_code_459c120478e1ab6e() { return logError(function (arg0, arg1) {
    const ret = arg1.code;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_colorMask_5e7c60b9c7a57a2e() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
}, arguments) };

export function __wbg_colorMask_6dac12039c7145ae() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
}, arguments) };

export function __wbg_compileShader_0ad770bbdbb9de21() { return logError(function (arg0, arg1) {
    arg0.compileShader(arg1);
}, arguments) };

export function __wbg_compileShader_2307c9d370717dd5() { return logError(function (arg0, arg1) {
    arg0.compileShader(arg1);
}, arguments) };

export function __wbg_compressedTexSubImage2D_71877eec950ca069() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
}, arguments) };

export function __wbg_compressedTexSubImage2D_99abf4cfdb7c3fd8() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
}, arguments) };

export function __wbg_compressedTexSubImage2D_d66dcfcb2422e703() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
}, arguments) };

export function __wbg_compressedTexSubImage3D_58506392da46b927() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10);
}, arguments) };

export function __wbg_compressedTexSubImage3D_81477746675a4017() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
}, arguments) };

export function __wbg_configure_885d066191982c0c() { return logError(function (arg0, arg1) {
    arg0.configure(arg1);
}, arguments) };

export function __wbg_contains_3361c7eda6c95afd() { return logError(function (arg0, arg1) {
    const ret = arg0.contains(arg1);
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_contentRect_81407eb60e52248f() { return logError(function (arg0) {
    const ret = arg0.contentRect;
    return ret;
}, arguments) };

export function __wbg_copyBufferSubData_9469a965478e33b5() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
}, arguments) };

export function __wbg_copyBufferToBuffer_69dd2d62630147ce() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.copyBufferToBuffer(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_copyBufferToTexture_e666874e5ca1fde0() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.copyBufferToTexture(arg1, arg2, arg3);
}, arguments) };

export function __wbg_copyExternalImageToTexture_7cd0fc3ebe18d8de() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.copyExternalImageToTexture(arg1, arg2, arg3);
}, arguments) };

export function __wbg_copyTexSubImage2D_05e7e8df6814a705() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
}, arguments) };

export function __wbg_copyTexSubImage2D_607ad28606952982() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
}, arguments) };

export function __wbg_copyTexSubImage3D_32e92c94044e58ca() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
}, arguments) };

export function __wbg_copyTextureToBuffer_5b256e2e7af81464() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.copyTextureToBuffer(arg1, arg2, arg3);
}, arguments) };

export function __wbg_copyTextureToTexture_7b03c851103fa1c3() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.copyTextureToTexture(arg1, arg2, arg3);
}, arguments) };

export function __wbg_createBindGroupLayout_3fa1f991799a9b32() { return logError(function (arg0, arg1) {
    const ret = arg0.createBindGroupLayout(arg1);
    return ret;
}, arguments) };

export function __wbg_createBindGroup_7330123c360d14c6() { return logError(function (arg0, arg1) {
    const ret = arg0.createBindGroup(arg1);
    return ret;
}, arguments) };

export function __wbg_createBuffer_406ac423927f222d() { return logError(function (arg0, arg1) {
    const ret = arg0.createBuffer(arg1);
    return ret;
}, arguments) };

export function __wbg_createBuffer_7a9ec3d654073660() { return logError(function (arg0) {
    const ret = arg0.createBuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createBuffer_9886e84a67b68c89() { return logError(function (arg0) {
    const ret = arg0.createBuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createCommandEncoder_ed1b789900d13422() { return logError(function (arg0, arg1) {
    const ret = arg0.createCommandEncoder(arg1);
    return ret;
}, arguments) };

export function __wbg_createComputePipeline_e7fc1ba416e1f5e4() { return logError(function (arg0, arg1) {
    const ret = arg0.createComputePipeline(arg1);
    return ret;
}, arguments) };

export function __wbg_createElement_8c9931a732ee2fea() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_createFramebuffer_7824f69bba778885() { return logError(function (arg0) {
    const ret = arg0.createFramebuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createFramebuffer_c8d70ebc4858051e() { return logError(function (arg0) {
    const ret = arg0.createFramebuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createPipelineLayout_20710f4f4edf1bd0() { return logError(function (arg0, arg1) {
    const ret = arg0.createPipelineLayout(arg1);
    return ret;
}, arguments) };

export function __wbg_createProgram_8ff56c485f3233d0() { return logError(function (arg0) {
    const ret = arg0.createProgram();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createProgram_da203074cafb1038() { return logError(function (arg0) {
    const ret = arg0.createProgram();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createQuerySet_432cdc636a1fbbfd() { return logError(function (arg0, arg1) {
    const ret = arg0.createQuerySet(arg1);
    return ret;
}, arguments) };

export function __wbg_createQuery_5ed5e770ec1009c1() { return logError(function (arg0) {
    const ret = arg0.createQuery();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createRenderBundleEncoder_ef0ffb531dea861a() { return logError(function (arg0, arg1) {
    const ret = arg0.createRenderBundleEncoder(arg1);
    return ret;
}, arguments) };

export function __wbg_createRenderPipeline_779eaab40d3d339d() { return logError(function (arg0, arg1) {
    const ret = arg0.createRenderPipeline(arg1);
    return ret;
}, arguments) };

export function __wbg_createRenderbuffer_d88aa9403faa38ea() { return logError(function (arg0) {
    const ret = arg0.createRenderbuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createRenderbuffer_fd347ae14f262eaa() { return logError(function (arg0) {
    const ret = arg0.createRenderbuffer();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createSampler_d34eca20c88a051b() { return logError(function (arg0, arg1) {
    const ret = arg0.createSampler(arg1);
    return ret;
}, arguments) };

export function __wbg_createSampler_f76e29d7522bec9e() { return logError(function (arg0) {
    const ret = arg0.createSampler();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createShaderModule_5c5f5762f338d57a() { return logError(function (arg0, arg1) {
    const ret = arg0.createShaderModule(arg1);
    return ret;
}, arguments) };

export function __wbg_createShader_4a256a8cc9c1ce4f() { return logError(function (arg0, arg1) {
    const ret = arg0.createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createShader_983150fb1243ee56() { return logError(function (arg0, arg1) {
    const ret = arg0.createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createTexture_9c536c79b635fdef() { return logError(function (arg0) {
    const ret = arg0.createTexture();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createTexture_bfaa54c0cd22e367() { return logError(function (arg0) {
    const ret = arg0.createTexture();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createTexture_ddaa163dac15c571() { return logError(function (arg0, arg1) {
    const ret = arg0.createTexture(arg1);
    return ret;
}, arguments) };

export function __wbg_createVertexArrayOES_991b44f100f93329() { return logError(function (arg0) {
    const ret = arg0.createVertexArrayOES();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createVertexArray_e435029ae2660efd() { return logError(function (arg0) {
    const ret = arg0.createVertexArray();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_createView_81fea709eb3e22f0() { return logError(function (arg0, arg1) {
    const ret = arg0.createView(arg1);
    return ret;
}, arguments) };

export function __wbg_ctrlKey_1e826e468105ac11() { return logError(function (arg0) {
    const ret = arg0.ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_ctrlKey_cdbe8154dfb00d1f() { return logError(function (arg0) {
    const ret = arg0.ctrlKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_cullFace_187079e6e20a464d() { return logError(function (arg0, arg1) {
    arg0.cullFace(arg1 >>> 0);
}, arguments) };

export function __wbg_cullFace_fbae6dd4d5e61ba4() { return logError(function (arg0, arg1) {
    arg0.cullFace(arg1 >>> 0);
}, arguments) };

export function __wbg_debug_3cb59063b29f58c1() { return logError(function (arg0) {
    console.debug(arg0);
}, arguments) };

export function __wbg_deleteBuffer_7ed96e1bf7c02e87() { return logError(function (arg0, arg1) {
    arg0.deleteBuffer(arg1);
}, arguments) };

export function __wbg_deleteBuffer_a7822433fc95dfb8() { return logError(function (arg0, arg1) {
    arg0.deleteBuffer(arg1);
}, arguments) };

export function __wbg_deleteFramebuffer_66853fb7101488cb() { return logError(function (arg0, arg1) {
    arg0.deleteFramebuffer(arg1);
}, arguments) };

export function __wbg_deleteFramebuffer_cd3285ee5a702a7a() { return logError(function (arg0, arg1) {
    arg0.deleteFramebuffer(arg1);
}, arguments) };

export function __wbg_deleteProgram_3fa626bbc0001eb7() { return logError(function (arg0, arg1) {
    arg0.deleteProgram(arg1);
}, arguments) };

export function __wbg_deleteProgram_71a133c6d053e272() { return logError(function (arg0, arg1) {
    arg0.deleteProgram(arg1);
}, arguments) };

export function __wbg_deleteQuery_6a2b7cd30074b20b() { return logError(function (arg0, arg1) {
    arg0.deleteQuery(arg1);
}, arguments) };

export function __wbg_deleteRenderbuffer_59f4369653485031() { return logError(function (arg0, arg1) {
    arg0.deleteRenderbuffer(arg1);
}, arguments) };

export function __wbg_deleteRenderbuffer_8808192853211567() { return logError(function (arg0, arg1) {
    arg0.deleteRenderbuffer(arg1);
}, arguments) };

export function __wbg_deleteSampler_7f02bb003ba547f0() { return logError(function (arg0, arg1) {
    arg0.deleteSampler(arg1);
}, arguments) };

export function __wbg_deleteShader_8d42f169deda58ac() { return logError(function (arg0, arg1) {
    arg0.deleteShader(arg1);
}, arguments) };

export function __wbg_deleteShader_c65a44796c5004d8() { return logError(function (arg0, arg1) {
    arg0.deleteShader(arg1);
}, arguments) };

export function __wbg_deleteSync_5a3fbe5d6b742398() { return logError(function (arg0, arg1) {
    arg0.deleteSync(arg1);
}, arguments) };

export function __wbg_deleteTexture_a30f5ca0163c4110() { return logError(function (arg0, arg1) {
    arg0.deleteTexture(arg1);
}, arguments) };

export function __wbg_deleteTexture_bb82c9fec34372ba() { return logError(function (arg0, arg1) {
    arg0.deleteTexture(arg1);
}, arguments) };

export function __wbg_deleteVertexArrayOES_1ee7a06a4b23ec8c() { return logError(function (arg0, arg1) {
    arg0.deleteVertexArrayOES(arg1);
}, arguments) };

export function __wbg_deleteVertexArray_77fe73664a3332ae() { return logError(function (arg0, arg1) {
    arg0.deleteVertexArray(arg1);
}, arguments) };

export function __wbg_deltaMode_9bfd9fe3f6b4b240() { return logError(function (arg0) {
    const ret = arg0.deltaMode;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_deltaX_5c1121715746e4b7() { return logError(function (arg0) {
    const ret = arg0.deltaX;
    return ret;
}, arguments) };

export function __wbg_deltaY_f9318542caea0c36() { return logError(function (arg0) {
    const ret = arg0.deltaY;
    return ret;
}, arguments) };

export function __wbg_depthFunc_2906916f4536d5d7() { return logError(function (arg0, arg1) {
    arg0.depthFunc(arg1 >>> 0);
}, arguments) };

export function __wbg_depthFunc_f34449ae87cc4e3e() { return logError(function (arg0, arg1) {
    arg0.depthFunc(arg1 >>> 0);
}, arguments) };

export function __wbg_depthMask_5fe84e2801488eda() { return logError(function (arg0, arg1) {
    arg0.depthMask(arg1 !== 0);
}, arguments) };

export function __wbg_depthMask_76688a8638b2f321() { return logError(function (arg0, arg1) {
    arg0.depthMask(arg1 !== 0);
}, arguments) };

export function __wbg_depthRange_3cd6b4dc961d9116() { return logError(function (arg0, arg1, arg2) {
    arg0.depthRange(arg1, arg2);
}, arguments) };

export function __wbg_depthRange_f9c084ff3d81fd7b() { return logError(function (arg0, arg1, arg2) {
    arg0.depthRange(arg1, arg2);
}, arguments) };

export function __wbg_destroy_071d29ca29291f0b() { return logError(function (arg0) {
    arg0.destroy();
}, arguments) };

export function __wbg_destroy_09e1c001eb89d587() { return logError(function (arg0) {
    arg0.destroy();
}, arguments) };

export function __wbg_destroy_55468878864fb284() { return logError(function (arg0) {
    arg0.destroy();
}, arguments) };

export function __wbg_devicePixelContentBoxSize_a6de82cb30d70825() { return logError(function (arg0) {
    const ret = arg0.devicePixelContentBoxSize;
    return ret;
}, arguments) };

export function __wbg_devicePixelRatio_68c391265f05d093() { return logError(function (arg0) {
    const ret = arg0.devicePixelRatio;
    return ret;
}, arguments) };

export function __wbg_disableVertexAttribArray_452cc9815fced7e4() { return logError(function (arg0, arg1) {
    arg0.disableVertexAttribArray(arg1 >>> 0);
}, arguments) };

export function __wbg_disableVertexAttribArray_afd097fb465dc100() { return logError(function (arg0, arg1) {
    arg0.disableVertexAttribArray(arg1 >>> 0);
}, arguments) };

export function __wbg_disable_2702df5b5da5dd21() { return logError(function (arg0, arg1) {
    arg0.disable(arg1 >>> 0);
}, arguments) };

export function __wbg_disable_8b53998501a7a85b() { return logError(function (arg0, arg1) {
    arg0.disable(arg1 >>> 0);
}, arguments) };

export function __wbg_disconnect_2118016d75479985() { return logError(function (arg0) {
    arg0.disconnect();
}, arguments) };

export function __wbg_disconnect_ac3f4ba550970c76() { return logError(function (arg0) {
    arg0.disconnect();
}, arguments) };

export function __wbg_dispatchWorkgroupsIndirect_248a40eb421e602f() { return logError(function (arg0, arg1, arg2) {
    arg0.dispatchWorkgroupsIndirect(arg1, arg2);
}, arguments) };

export function __wbg_dispatchWorkgroups_d4225f09bdb1a2b8() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.dispatchWorkgroups(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
}, arguments) };

export function __wbg_document_d249400bd7bd996d() { return logError(function (arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_drawArraysInstancedANGLE_342ee6b5236d9702() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
}, arguments) };

export function __wbg_drawArraysInstanced_622ea9f149b0b80c() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
}, arguments) };

export function __wbg_drawArrays_6acaa2669c105f3a() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.drawArrays(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_drawArrays_6d29ea2ebc0c72a2() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.drawArrays(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_drawBuffersWEBGL_9fdbdf3d4cbd3aae() { return logError(function (arg0, arg1) {
    arg0.drawBuffersWEBGL(arg1);
}, arguments) };

export function __wbg_drawBuffers_e729b75c5a50d760() { return logError(function (arg0, arg1) {
    arg0.drawBuffers(arg1);
}, arguments) };

export function __wbg_drawElementsInstancedANGLE_096b48ab8686c5cf() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_drawElementsInstanced_f874e87d0b4e95e9() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_drawIndexedIndirect_31a886924e4d91c5() { return logError(function (arg0, arg1, arg2) {
    arg0.drawIndexedIndirect(arg1, arg2);
}, arguments) };

export function __wbg_drawIndexedIndirect_a91341ca1697732b() { return logError(function (arg0, arg1, arg2) {
    arg0.drawIndexedIndirect(arg1, arg2);
}, arguments) };

export function __wbg_drawIndexed_16f192623e504221() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
}, arguments) };

export function __wbg_drawIndexed_9863c3fc3b88662b() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
}, arguments) };

export function __wbg_drawIndirect_d11fd341fbe1d252() { return logError(function (arg0, arg1, arg2) {
    arg0.drawIndirect(arg1, arg2);
}, arguments) };

export function __wbg_drawIndirect_f310f950fb697939() { return logError(function (arg0, arg1, arg2) {
    arg0.drawIndirect(arg1, arg2);
}, arguments) };

export function __wbg_draw_378476fab6ddcb8a() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_draw_b09be351500cf4b3() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_enableVertexAttribArray_607be07574298e5e() { return logError(function (arg0, arg1) {
    arg0.enableVertexAttribArray(arg1 >>> 0);
}, arguments) };

export function __wbg_enableVertexAttribArray_93c3d406a41ad6c7() { return logError(function (arg0, arg1) {
    arg0.enableVertexAttribArray(arg1 >>> 0);
}, arguments) };

export function __wbg_enable_51114837e05ee280() { return logError(function (arg0, arg1) {
    arg0.enable(arg1 >>> 0);
}, arguments) };

export function __wbg_enable_d183fef39258803f() { return logError(function (arg0, arg1) {
    arg0.enable(arg1 >>> 0);
}, arguments) };

export function __wbg_endQuery_17aac36532ca7d47() { return logError(function (arg0, arg1) {
    arg0.endQuery(arg1 >>> 0);
}, arguments) };

export function __wbg_end_0b60345473910d78() { return logError(function (arg0) {
    arg0.end();
}, arguments) };

export function __wbg_end_625d1f0f7a69f3a8() { return logError(function (arg0) {
    arg0.end();
}, arguments) };

export function __wbg_error_1004b8c64097413f() { return logError(function (arg0, arg1) {
    console.error(arg0, arg1);
}, arguments) };

export function __wbg_error_524f506f44df1645() { return logError(function (arg0) {
    console.error(arg0);
}, arguments) };

export function __wbg_error_7534b8e9a36f1ab4() { return logError(function (arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
}, arguments) };

export function __wbg_error_bbab955d384cda8a() { return logError(function (arg0) {
    const ret = arg0.error;
    return ret;
}, arguments) };

export function __wbg_executeBundles_81c717eea5bb2637() { return logError(function (arg0, arg1) {
    arg0.executeBundles(arg1);
}, arguments) };

export function __wbg_exitFullscreen_909f35c20d9db949() { return logError(function (arg0) {
    arg0.exitFullscreen();
}, arguments) };

export function __wbg_features_52a947d3e610abdd() { return logError(function (arg0) {
    const ret = arg0.features;
    return ret;
}, arguments) };

export function __wbg_features_c00b0bf2b04ccd63() { return logError(function (arg0) {
    const ret = arg0.features;
    return ret;
}, arguments) };

export function __wbg_fenceSync_02d142d21e315da6() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.fenceSync(arg1 >>> 0, arg2 >>> 0);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_finish_63fc7fb280e47102() { return logError(function (arg0, arg1) {
    const ret = arg0.finish(arg1);
    return ret;
}, arguments) };

export function __wbg_finish_9efeb3f241fdae3b() { return logError(function (arg0) {
    const ret = arg0.finish();
    return ret;
}, arguments) };

export function __wbg_finish_b7dfeb96aa58bbe4() { return logError(function (arg0) {
    const ret = arg0.finish();
    return ret;
}, arguments) };

export function __wbg_finish_d888aab5410bcf28() { return logError(function (arg0, arg1) {
    const ret = arg0.finish(arg1);
    return ret;
}, arguments) };

export function __wbg_focus_7d08b55eba7b368d() { return handleError(function (arg0) {
    arg0.focus();
}, arguments) };

export function __wbg_framebufferRenderbuffer_2fdd12e89ad81eb9() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
}, arguments) };

export function __wbg_framebufferRenderbuffer_8b88592753b54715() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
}, arguments) };

export function __wbg_framebufferTexture2D_81a565732bd5d8fe() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_framebufferTexture2D_ed855d0b097c557a() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_framebufferTextureLayer_5e6bd1b0cb45d815() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
}, arguments) };

export function __wbg_framebufferTextureMultiviewOVR_e54f936c3cc382cb() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5, arg6);
}, arguments) };

export function __wbg_frontFace_289c9d7a8569c4f2() { return logError(function (arg0, arg1) {
    arg0.frontFace(arg1 >>> 0);
}, arguments) };

export function __wbg_frontFace_4d4936cfaeb8b7df() { return logError(function (arg0, arg1) {
    arg0.frontFace(arg1 >>> 0);
}, arguments) };

export function __wbg_fullscreenElement_a2f691b04c3b3de5() { return logError(function (arg0) {
    const ret = arg0.fullscreenElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getBindGroupLayout_a82945570028441f() { return logError(function (arg0, arg1) {
    const ret = arg0.getBindGroupLayout(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getBindGroupLayout_bc5678195dcb5d1a() { return logError(function (arg0, arg1) {
    const ret = arg0.getBindGroupLayout(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getBufferSubData_8ab2dcc5fcf5770f() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.getBufferSubData(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_getCoalescedEvents_a7d49de30111f6b8() { return logError(function (arg0) {
    const ret = arg0.getCoalescedEvents();
    return ret;
}, arguments) };

export function __wbg_getCoalescedEvents_c7e4ef019798f464() { return logError(function (arg0) {
    const ret = arg0.getCoalescedEvents;
    return ret;
}, arguments) };

export function __wbg_getCompilationInfo_329492eb7e573334() { return logError(function (arg0) {
    const ret = arg0.getCompilationInfo();
    return ret;
}, arguments) };

export function __wbg_getComputedStyle_046dd6472f8e7f1d() { return handleError(function (arg0, arg1) {
    const ret = arg0.getComputedStyle(arg1);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_3ae09aaa73194801() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_e9cf379449413580() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_f65a0debd1e8f8e8() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getContext_fc19859df6331073() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getCurrentTexture_f6f2d0e9fb9756aa() { return logError(function (arg0) {
    const ret = arg0.getCurrentTexture();
    return ret;
}, arguments) };

export function __wbg_getElementById_f827f0d6648718a8() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getExtension_ff0fb1398bcf28c3() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getIndexedParameter_f9211edc36533919() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getMappedRange_477801193e0d896e() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getMappedRange(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_getOwnPropertyDescriptor_9dd936a3c0cbd368() { return logError(function (arg0, arg1) {
    const ret = Object.getOwnPropertyDescriptor(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_getParameter_1f0887a2b88e6d19() { return handleError(function (arg0, arg1) {
    const ret = arg0.getParameter(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getParameter_e3429f024018310f() { return handleError(function (arg0, arg1) {
    const ret = arg0.getParameter(arg1 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getPreferredCanvasFormat_891f31d328e2adc3() { return logError(function (arg0) {
    const ret = arg0.getPreferredCanvasFormat();
    return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
}, arguments) };

export function __wbg_getProgramInfoLog_631c180b1b21c8ed() { return logError(function (arg0, arg1, arg2) {
    const ret = arg1.getProgramInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getProgramInfoLog_a998105a680059db() { return logError(function (arg0, arg1, arg2) {
    const ret = arg1.getProgramInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getProgramParameter_0c411f0cd4185c5b() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getProgramParameter_360f95ff07ac068d() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getPropertyValue_e623c23a05dfb30c() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getQueryParameter_8921497e1d1561c1() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getQueryParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getShaderInfoLog_7e7b38fb910ec534() { return logError(function (arg0, arg1, arg2) {
    const ret = arg1.getShaderInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getShaderInfoLog_f59c3112acc6e039() { return logError(function (arg0, arg1, arg2) {
    const ret = arg1.getShaderInfoLog(arg2);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_getShaderParameter_511b5f929074fa31() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getShaderParameter_6dbe0b8558dc41fd() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getSupportedExtensions_8c007dbb54905635() { return logError(function (arg0) {
    const ret = arg0.getSupportedExtensions();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getSupportedProfiles_10d2a4d32a128384() { return logError(function (arg0) {
    const ret = arg0.getSupportedProfiles();
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getSyncParameter_7cb8461f5891606c() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.getSyncParameter(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getUniformBlockIndex_288fdc31528171ca() { return logError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_getUniformLocation_657a2b6d102bd126() { return logError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_getUniformLocation_838363001c74dc21() { return logError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_get_b9b93047fe3cf45b() { return logError(function (arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}, arguments) };

export function __wbg_get_e27dfaeb6f46bd45() { return logError(function (arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_gpu_2185e4b2191bed1b() { return logError(function (arg0) {
    const ret = arg0.gpu;
    return ret;
}, arguments) };

export function __wbg_has_b65a327271986d3e() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.has(getStringFromWasm0(arg1, arg2));
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_height_1f8226c8f6875110() { return logError(function (arg0) {
    const ret = arg0.height;
    return ret;
}, arguments) };

export function __wbg_height_838cee19ba8597db() { return logError(function (arg0) {
    const ret = arg0.height;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_height_df1aa98dfbbe11ad() { return logError(function (arg0) {
    const ret = arg0.height;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_height_e3c322f23d99ad2f() { return logError(function (arg0) {
    const ret = arg0.height;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_includes_937486a108ec147b() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.includes(arg1, arg2);
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_info_3daf2e093e091b66() { return logError(function (arg0) {
    console.info(arg0);
}, arguments) };

export function __wbg_inlineSize_8ff96b3ec1b24423() { return logError(function (arg0) {
    const ret = arg0.inlineSize;
    return ret;
}, arguments) };

export function __wbg_innerHeight_05f4225d754a7929() { return handleError(function (arg0) {
    const ret = arg0.innerHeight;
    return ret;
}, arguments) };

export function __wbg_innerWidth_7e0498dbd876d498() { return handleError(function (arg0) {
    const ret = arg0.innerWidth;
    return ret;
}, arguments) };

export function __wbg_instanceof_GpuAdapter_8825bf3533b2dc81() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof GPUAdapter;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_GpuCanvasContext_8867fd6a49dfb80b() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof GPUCanvasContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_GpuDeviceLostInfo_9385c1b1d1700172() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof GPUDeviceLostInfo;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_GpuOutOfMemoryError_ad32cc08223bf570() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof GPUOutOfMemoryError;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_GpuValidationError_2828a9f6f4ea2c0b() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof GPUValidationError;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLCanvasElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_Object_7f2dcef8f78644a4() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof Object;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_WebGl2RenderingContext_2b6045efeb76568d() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof WebGL2RenderingContext;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_instanceof_Window_def73ea0955fc569() { return logError(function (arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_invalidateFramebuffer_83f643d2a4936456() { return handleError(function (arg0, arg1, arg2) {
    arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_isIntersecting_e68706dac9c5f2e9() { return logError(function (arg0) {
    const ret = arg0.isIntersecting;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_is_c7481c65e7e5df9e() { return logError(function (arg0, arg1) {
    const ret = Object.is(arg0, arg1);
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_key_7b5c6cb539be8e13() { return logError(function (arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_label_89028e7138bc55d8() { return logError(function (arg0, arg1) {
    const ret = arg1.label;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_length_a446193dc22c12f8() { return logError(function (arg0) {
    const ret = arg0.length;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_length_e2d2a49132c1b256() { return logError(function (arg0) {
    const ret = arg0.length;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_length_fb41d6fe7c522cee() { return logError(function (arg0) {
    const ret = arg0.length;
    return ret;
}, arguments) };

export function __wbg_limits_4827e3a9c9f74ac7() { return logError(function (arg0) {
    const ret = arg0.limits;
    return ret;
}, arguments) };

export function __wbg_limits_705c3a1e50353132() { return logError(function (arg0) {
    const ret = arg0.limits;
    return ret;
}, arguments) };

export function __wbg_lineNum_21558dfbe709a12e() { return logError(function (arg0) {
    const ret = arg0.lineNum;
    return ret;
}, arguments) };

export function __wbg_linkProgram_067ee06739bdde81() { return logError(function (arg0, arg1) {
    arg0.linkProgram(arg1);
}, arguments) };

export function __wbg_linkProgram_e002979fe36e5b2a() { return logError(function (arg0, arg1) {
    arg0.linkProgram(arg1);
}, arguments) };

export function __wbg_location_9b435486be8f98c2() { return logError(function (arg0) {
    const ret = arg0.location;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_log_c222819a41e063d3() { return logError(function (arg0) {
    console.log(arg0);
}, arguments) };

export function __wbg_lost_9321a8d07347e4ac() { return logError(function (arg0) {
    const ret = arg0.lost;
    return ret;
}, arguments) };

export function __wbg_mapAsync_743ed3aee3a10c75() { return logError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
    return ret;
}, arguments) };

export function __wbg_matchMedia_bf8807a841d930c1() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_matches_e9ca73fbf8a3a104() { return logError(function (arg0) {
    const ret = arg0.matches;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_maxBindGroups_a08c9acede444407() { return logError(function (arg0) {
    const ret = arg0.maxBindGroups;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxBindingsPerBindGroup_1708a7e853ce028d() { return logError(function (arg0) {
    const ret = arg0.maxBindingsPerBindGroup;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxBufferSize_e809d5a62c0e55a6() { return logError(function (arg0) {
    const ret = arg0.maxBufferSize;
    return ret;
}, arguments) };

export function __wbg_maxColorAttachmentBytesPerSample_314dcbb8e93dc786() { return logError(function (arg0) {
    const ret = arg0.maxColorAttachmentBytesPerSample;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxColorAttachments_8cd3db8af3af3fa5() { return logError(function (arg0) {
    const ret = arg0.maxColorAttachments;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeInvocationsPerWorkgroup_12d4f7aa8dfa572c() { return logError(function (arg0) {
    const ret = arg0.maxComputeInvocationsPerWorkgroup;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeWorkgroupSizeX_4568514c886f6dfa() { return logError(function (arg0) {
    const ret = arg0.maxComputeWorkgroupSizeX;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeWorkgroupSizeY_123105c484c5dccf() { return logError(function (arg0) {
    const ret = arg0.maxComputeWorkgroupSizeY;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeWorkgroupSizeZ_de7c4c7fc8af6336() { return logError(function (arg0) {
    const ret = arg0.maxComputeWorkgroupSizeZ;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeWorkgroupStorageSize_9d8b86acd9c4456e() { return logError(function (arg0) {
    const ret = arg0.maxComputeWorkgroupStorageSize;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxComputeWorkgroupsPerDimension_ea72668334d1f4bc() { return logError(function (arg0) {
    const ret = arg0.maxComputeWorkgroupsPerDimension;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxDynamicStorageBuffersPerPipelineLayout_944a4b9f549f1889() { return logError(function (arg0) {
    const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxDynamicUniformBuffersPerPipelineLayout_c13f3c953fb93de1() { return logError(function (arg0) {
    const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxInterStageShaderComponents_bc57064d5977c3b2() { return logError(function (arg0) {
    const ret = arg0.maxInterStageShaderComponents;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxSampledTexturesPerShaderStage_fab2ca30fcd613d8() { return logError(function (arg0) {
    const ret = arg0.maxSampledTexturesPerShaderStage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxSamplersPerShaderStage_f072be553a8cf1a4() { return logError(function (arg0) {
    const ret = arg0.maxSamplersPerShaderStage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxStorageBufferBindingSize_fdfa45c12339bddb() { return logError(function (arg0) {
    const ret = arg0.maxStorageBufferBindingSize;
    return ret;
}, arguments) };

export function __wbg_maxStorageBuffersPerShaderStage_d0eda562e20d8b03() { return logError(function (arg0) {
    const ret = arg0.maxStorageBuffersPerShaderStage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxStorageTexturesPerShaderStage_4cabd4f57624129e() { return logError(function (arg0) {
    const ret = arg0.maxStorageTexturesPerShaderStage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxTextureArrayLayers_f7181891dff8a73b() { return logError(function (arg0) {
    const ret = arg0.maxTextureArrayLayers;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxTextureDimension1D_cfdb8d7e4f0b5cfb() { return logError(function (arg0) {
    const ret = arg0.maxTextureDimension1D;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxTextureDimension2D_53fa334236b8c471() { return logError(function (arg0) {
    const ret = arg0.maxTextureDimension2D;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxTextureDimension3D_9d4e3a4020f8e905() { return logError(function (arg0) {
    const ret = arg0.maxTextureDimension3D;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxUniformBufferBindingSize_b915154aa9e7ab90() { return logError(function (arg0) {
    const ret = arg0.maxUniformBufferBindingSize;
    return ret;
}, arguments) };

export function __wbg_maxUniformBuffersPerShaderStage_d6a12c4a5d55e28f() { return logError(function (arg0) {
    const ret = arg0.maxUniformBuffersPerShaderStage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxVertexAttributes_e9bfc805badbff13() { return logError(function (arg0) {
    const ret = arg0.maxVertexAttributes;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxVertexBufferArrayStride_5a6903326b277b63() { return logError(function (arg0) {
    const ret = arg0.maxVertexBufferArrayStride;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_maxVertexBuffers_36ad3e2f2c671d1d() { return logError(function (arg0) {
    const ret = arg0.maxVertexBuffers;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_media_552eec81313ef78b() { return logError(function (arg0, arg1) {
    const ret = arg1.media;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_message_3d49aad63d33e324() { return logError(function (arg0, arg1) {
    const ret = arg1.message;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_message_8b4d86f21b314abd() { return logError(function (arg0, arg1) {
    const ret = arg1.message;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_message_b9c472af06c991ff() { return logError(function (arg0, arg1) {
    const ret = arg1.message;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_messages_dfffacffb9aa49d4() { return logError(function (arg0) {
    const ret = arg0.messages;
    return ret;
}, arguments) };

export function __wbg_metaKey_0b25f7848e014cc8() { return logError(function (arg0) {
    const ret = arg0.metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_metaKey_e1dd47d709a80ce5() { return logError(function (arg0) {
    const ret = arg0.metaKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_minStorageBufferOffsetAlignment_06cd221e6b4b3ced() { return logError(function (arg0) {
    const ret = arg0.minStorageBufferOffsetAlignment;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_minUniformBufferOffsetAlignment_089fef843f8a491d() { return logError(function (arg0) {
    const ret = arg0.minUniformBufferOffsetAlignment;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_movementX_1aa05f864931369b() { return logError(function (arg0) {
    const ret = arg0.movementX;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_movementY_8acfedb38a70e624() { return logError(function (arg0) {
    const ret = arg0.movementY;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_navigator_0a9bf1120e24fec2() { return logError(function (arg0) {
    const ret = arg0.navigator;
    return ret;
}, arguments) };

export function __wbg_navigator_1577371c070c8947() { return logError(function (arg0) {
    const ret = arg0.navigator;
    return ret;
}, arguments) };

export function __wbg_new_18b1151f3a6a9280() { return handleError(function (arg0) {
    const ret = new IntersectionObserver(arg0);
    return ret;
}, arguments) };

export function __wbg_new_23a2665fac83c611() { return logError(function (arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_1122(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
}, arguments) };

export function __wbg_new_24b2c5b645cded8d() { return handleError(function () {
    const ret = new MessageChannel();
    return ret;
}, arguments) };

export function __wbg_new_405e22f390576ce2() { return logError(function () {
    const ret = new Object();
    return ret;
}, arguments) };

export function __wbg_new_5f34cc0c99fcc488() { return handleError(function (arg0) {
    const ret = new ResizeObserver(arg0);
    return ret;
}, arguments) };

export function __wbg_new_78feb108b6472713() { return logError(function () {
    const ret = new Array();
    return ret;
}, arguments) };

export function __wbg_new_8a6f238a6ece86ea() { return logError(function () {
    const ret = new Error();
    return ret;
}, arguments) };

export function __wbg_new_a12002a7f91c75be() { return logError(function (arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
}, arguments) };

export function __wbg_new_e25e5aab09ff45db() { return handleError(function () {
    const ret = new AbortController();
    return ret;
}, arguments) };

export function __wbg_newnoargs_105ed471475aaf50() { return logError(function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_840f3c038856d4e9() { return logError(function (arg0, arg1, arg2) {
    const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_999332a180064b59() { return logError(function (arg0, arg1, arg2) {
    const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_d4a86622320ea258() { return logError(function (arg0, arg1, arg2) {
    const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a() { return logError(function (arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354() { return logError(function (arg0, arg1, arg2) {
    const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_f1dead44d1fc7212() { return logError(function (arg0, arg1, arg2) {
    const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_newwithbyteoffsetandlength_f254047f7e80e7ff() { return logError(function (arg0, arg1, arg2) {
    const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_now_2c95c9de01293173() { return logError(function (arg0) {
    const ret = arg0.now();
    return ret;
}, arguments) };

export function __wbg_now_6f91d421b96ea22a() { return logError(function (arg0) {
    const ret = arg0.now();
    return ret;
}, arguments) };

export function __wbg_observe_d2e7378f15f7ca72() { return logError(function (arg0, arg1) {
    arg0.observe(arg1);
}, arguments) };

export function __wbg_observe_eafddfc5a0c60e02() { return logError(function (arg0, arg1) {
    arg0.observe(arg1);
}, arguments) };

export function __wbg_observe_ed4adb1c245103c5() { return logError(function (arg0, arg1, arg2) {
    arg0.observe(arg1, arg2);
}, arguments) };

export function __wbg_of_2eaf5a02d443ef03() { return logError(function (arg0) {
    const ret = Array.of(arg0);
    return ret;
}, arguments) };

export function __wbg_offsetX_cca22992ada210f2() { return logError(function (arg0) {
    const ret = arg0.offsetX;
    return ret;
}, arguments) };

export function __wbg_offsetY_5e3fcf9de68b3a1e() { return logError(function (arg0) {
    const ret = arg0.offsetY;
    return ret;
}, arguments) };

export function __wbg_offset_07114c6c8713bfa1() { return logError(function (arg0) {
    const ret = arg0.offset;
    return ret;
}, arguments) };

export function __wbg_onpointerrawupdate_d7e65c280dee45ba() { return logError(function (arg0) {
    const ret = arg0.onpointerrawupdate;
    return ret;
}, arguments) };

export function __wbg_performance_7a3ffd0b17f663ad() { return logError(function (arg0) {
    const ret = arg0.performance;
    return ret;
}, arguments) };

export function __wbg_performance_f71bd4abe0370171() { return logError(function (arg0) {
    const ret = arg0.performance;
    return ret;
}, arguments) };

export function __wbg_persisted_d32ce73b8e522062() { return logError(function (arg0) {
    const ret = arg0.persisted;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_pixelStorei_6aba5d04cdcaeaf6() { return logError(function (arg0, arg1, arg2) {
    arg0.pixelStorei(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_pixelStorei_c8520e4b46f4a973() { return logError(function (arg0, arg1, arg2) {
    arg0.pixelStorei(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_pointerId_585e63ee80a49927() { return logError(function (arg0) {
    const ret = arg0.pointerId;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_pointerType_6bd934aa20d9db49() { return logError(function (arg0, arg1) {
    const ret = arg1.pointerType;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_polygonOffset_773fe0017b2c8f51() { return logError(function (arg0, arg1, arg2) {
    arg0.polygonOffset(arg1, arg2);
}, arguments) };

export function __wbg_polygonOffset_8c11c066486216c4() { return logError(function (arg0, arg1, arg2) {
    arg0.polygonOffset(arg1, arg2);
}, arguments) };

export function __wbg_popErrorScope_73ca275d36475299() { return logError(function (arg0) {
    const ret = arg0.popErrorScope();
    return ret;
}, arguments) };

export function __wbg_port1_70af0ea6e4a96f9d() { return logError(function (arg0) {
    const ret = arg0.port1;
    return ret;
}, arguments) };

export function __wbg_port2_0584c7f0938b6fe6() { return logError(function (arg0) {
    const ret = arg0.port2;
    return ret;
}, arguments) };

export function __wbg_postMessage_e55d059efb191dc5() { return handleError(function (arg0, arg1) {
    arg0.postMessage(arg1);
}, arguments) };

export function __wbg_postTask_076eee2dd6ca2f6c() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.postTask(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_pressure_adda5a83a9cec94d() { return logError(function (arg0) {
    const ret = arg0.pressure;
    return ret;
}, arguments) };

export function __wbg_preventDefault_c2314fd813c02b3c() { return logError(function (arg0) {
    arg0.preventDefault();
}, arguments) };

export function __wbg_prototype_cd41f5789d244756() { return logError(function () {
    const ret = ResizeObserverEntry.prototype;
    return ret;
}, arguments) };

export function __wbg_pushErrorScope_94f47ed40de21724() { return logError(function (arg0, arg1) {
    arg0.pushErrorScope(__wbindgen_enum_GpuErrorFilter[arg1]);
}, arguments) };

export function __wbg_push_737cfc8c1432c2c6() { return logError(function (arg0, arg1) {
    const ret = arg0.push(arg1);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_querySelectorAll_40998fd748f057ef() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_querySelector_c69f8b573958906b() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_queueMicrotask_97d92b4fcc8a61c5() { return logError(function (arg0) {
    queueMicrotask(arg0);
}, arguments) };

export function __wbg_queueMicrotask_d3219def82552485() { return logError(function (arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
}, arguments) };

export function __wbg_queue_aef896f8a9f54054() { return logError(function (arg0) {
    const ret = arg0.queue;
    return ret;
}, arguments) };

export function __wbg_readBuffer_1c35b1e4939f881d() { return logError(function (arg0, arg1) {
    arg0.readBuffer(arg1 >>> 0);
}, arguments) };

export function __wbg_readPixels_51a0c02cdee207a5() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_readPixels_a6cbb21794452142() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_readPixels_cd64c5a7b0343355() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
}, arguments) };

export function __wbg_reason_7d921985e4bed38d() { return logError(function (arg0) {
    const ret = arg0.reason;
    return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
}, arguments) };

export function __wbg_removeEventListener_056dfe8c3d6c58f9() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_removeListener_e55db581b73ccf65() { return handleError(function (arg0, arg1) {
    arg0.removeListener(arg1);
}, arguments) };

export function __wbg_removeProperty_0e85471f4dfc00ae() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg1.removeProperty(getStringFromWasm0(arg2, arg3));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_renderbufferStorageMultisample_13fbd5e58900c6fe() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_renderbufferStorage_73e01ea83b8afab4() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
}, arguments) };

export function __wbg_renderbufferStorage_f010012bd3566942() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
}, arguments) };

export function __wbg_repeat_1882aa0d0072c705() { return logError(function (arg0) {
    const ret = arg0.repeat;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_requestAdapter_99bb298ffa971710() { return logError(function (arg0, arg1) {
    const ret = arg0.requestAdapter(arg1);
    return ret;
}, arguments) };

export function __wbg_requestAnimationFrame_d7fd890aaefc3246() { return handleError(function (arg0, arg1) {
    const ret = arg0.requestAnimationFrame(arg1);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_requestDevice_25da66256442f99f() { return logError(function (arg0, arg1) {
    const ret = arg0.requestDevice(arg1);
    return ret;
}, arguments) };

export function __wbg_requestFullscreen_1c019906e2b813ce() { return logError(function (arg0) {
    const ret = arg0.requestFullscreen;
    return ret;
}, arguments) };

export function __wbg_requestFullscreen_84eb00d7fc5c44f7() { return logError(function (arg0) {
    const ret = arg0.requestFullscreen();
    return ret;
}, arguments) };

export function __wbg_requestIdleCallback_2d7168fc01a73f5c() { return logError(function (arg0) {
    const ret = arg0.requestIdleCallback;
    return ret;
}, arguments) };

export function __wbg_requestIdleCallback_e3eefd34962470e1() { return handleError(function (arg0, arg1) {
    const ret = arg0.requestIdleCallback(arg1);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_resolveQuerySet_518efaed400765ec() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.resolveQuerySet(arg1, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
}, arguments) };

export function __wbg_resolve_4851785c9c5f573d() { return logError(function (arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
}, arguments) };

export function __wbg_samplerParameterf_909baf50360c94d4() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.samplerParameterf(arg1, arg2 >>> 0, arg3);
}, arguments) };

export function __wbg_samplerParameteri_d5c292172718da63() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.samplerParameteri(arg1, arg2 >>> 0, arg3);
}, arguments) };

export function __wbg_scheduler_344ff4a7a89e57fa() { return logError(function (arg0) {
    const ret = arg0.scheduler;
    return ret;
}, arguments) };

export function __wbg_scheduler_dfc2a492974786a1() { return logError(function (arg0) {
    const ret = arg0.scheduler;
    return ret;
}, arguments) };

export function __wbg_scissor_e917a332f67a5d30() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.scissor(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_scissor_eb177ca33bf24a44() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.scissor(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_setAttribute_2704501201f15687() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setBindGroup_2ac6450315781d1e() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
}, arguments) };

export function __wbg_setBindGroup_4aaf752e483a5891() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
}, arguments) };

export function __wbg_setBindGroup_9592f36aa0d95492() { return logError(function (arg0, arg1, arg2) {
    arg0.setBindGroup(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_setBindGroup_bd02dbf57606b68a() { return logError(function (arg0, arg1, arg2) {
    arg0.setBindGroup(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_setBindGroup_d29535317ac43833() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
}, arguments) };

export function __wbg_setBindGroup_df9a3d37c79492bc() { return logError(function (arg0, arg1, arg2) {
    arg0.setBindGroup(arg1 >>> 0, arg2);
}, arguments) };

export function __wbg_setBlendConstant_d0046b392cfa3d75() { return logError(function (arg0, arg1) {
    arg0.setBlendConstant(arg1);
}, arguments) };

export function __wbg_setIndexBuffer_58ea997f53ad4c11() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
}, arguments) };

export function __wbg_setIndexBuffer_be70babd64ba4937() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
}, arguments) };

export function __wbg_setIndexBuffer_d4026378f61556e0() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
}, arguments) };

export function __wbg_setIndexBuffer_eee9f6350e2c4ddf() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
}, arguments) };

export function __wbg_setPipeline_260aa2ad6d0ca84a() { return logError(function (arg0, arg1) {
    arg0.setPipeline(arg1);
}, arguments) };

export function __wbg_setPipeline_7eebf7b7235cafc5() { return logError(function (arg0, arg1) {
    arg0.setPipeline(arg1);
}, arguments) };

export function __wbg_setPipeline_c13848e677f3f5b8() { return logError(function (arg0, arg1) {
    arg0.setPipeline(arg1);
}, arguments) };

export function __wbg_setPointerCapture_c04dafaf4d00ffad() { return handleError(function (arg0, arg1) {
    arg0.setPointerCapture(arg1);
}, arguments) };

export function __wbg_setProperty_f2cf326652b9a713() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_setScissorRect_a1f6486215fdc474() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_setStencilReference_cdff4b392f555b3a() { return logError(function (arg0, arg1) {
    arg0.setStencilReference(arg1 >>> 0);
}, arguments) };

export function __wbg_setTimeout_461fec76662b35ea() { return handleError(function (arg0, arg1) {
    const ret = arg0.setTimeout(arg1);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_setTimeout_f2fe5af8e3debeb3() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.setTimeout(arg1, arg2);
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_setVertexBuffer_95a2944ddfaf9d39() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
}, arguments) };

export function __wbg_setVertexBuffer_b3ea5739c5f1cc3f() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_setVertexBuffer_e762011452750daa() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
}, arguments) };

export function __wbg_setVertexBuffer_ef1966897a59ed53() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
}, arguments) };

export function __wbg_setViewport_6b44c0f6f85a14ea() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
}, arguments) };

export function __wbg_set_65595bdd868b3009() { return logError(function (arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
}, arguments) };

export function __wbg_set_bb8cecf6a62b9f46() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_setbox_2786f3ccea97cac4() { return logError(function (arg0, arg1) {
    arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
}, arguments) };

export function __wbg_setheight_433680330c9420c3() { return logError(function (arg0, arg1) {
    arg0.height = arg1 >>> 0;
}, arguments) };

export function __wbg_setheight_da683a33fa99843c() { return logError(function (arg0, arg1) {
    arg0.height = arg1 >>> 0;
}, arguments) };

export function __wbg_setonmessage_23d122da701b8ddb() { return logError(function (arg0, arg1) {
    arg0.onmessage = arg1;
}, arguments) };

export function __wbg_setonuncapturederror_4bf21b80e7093f48() { return logError(function (arg0, arg1) {
    arg0.onuncapturederror = arg1;
}, arguments) };

export function __wbg_setwidth_660ca581e3fbe279() { return logError(function (arg0, arg1) {
    arg0.width = arg1 >>> 0;
}, arguments) };

export function __wbg_setwidth_c5fed9f5e7f0b406() { return logError(function (arg0, arg1) {
    arg0.width = arg1 >>> 0;
}, arguments) };

export function __wbg_shaderSource_72d3e8597ef85b67() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_shaderSource_ad0087e637a35191() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_shiftKey_2bebb3b703254f47() { return logError(function (arg0) {
    const ret = arg0.shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_shiftKey_86e737105bab1a54() { return logError(function (arg0) {
    const ret = arg0.shiftKey;
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbg_signal_aaf9ad74119f20a4() { return logError(function (arg0) {
    const ret = arg0.signal;
    return ret;
}, arguments) };

export function __wbg_size_01a91593882ba94c() { return logError(function (arg0) {
    const ret = arg0.size;
    return ret;
}, arguments) };

export function __wbg_stack_0ed75d68575b0f3c() { return logError(function (arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}, arguments) };

export function __wbg_start_2c099369ce831bf1() { return logError(function (arg0) {
    arg0.start();
}, arguments) };

export function __wbg_static_accessor_GLOBAL_88a902d13a557d07() { return logError(function () {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() { return logError(function () {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_static_accessor_SELF_37c5d418e4bf5819() { return logError(function () {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_static_accessor_WINDOW_5de37043a91a9c40() { return logError(function () {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_stencilFuncSeparate_91700dcf367ae07e() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
}, arguments) };

export function __wbg_stencilFuncSeparate_c1a6fa2005ca0aaf() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
}, arguments) };

export function __wbg_stencilMaskSeparate_4f1a2defc8c10956() { return logError(function (arg0, arg1, arg2) {
    arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_stencilMaskSeparate_f8a0cfb5c2994d4a() { return logError(function (arg0, arg1, arg2) {
    arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_stencilMask_1e602ef63f5b4144() { return logError(function (arg0, arg1) {
    arg0.stencilMask(arg1 >>> 0);
}, arguments) };

export function __wbg_stencilMask_cd8ca0a55817e599() { return logError(function (arg0, arg1) {
    arg0.stencilMask(arg1 >>> 0);
}, arguments) };

export function __wbg_stencilOpSeparate_1fa08985e79e1627() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_stencilOpSeparate_ff6683bbe3838ae6() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
}, arguments) };

export function __wbg_style_fb30c14e5815805c() { return logError(function (arg0) {
    const ret = arg0.style;
    return ret;
}, arguments) };

export function __wbg_submit_d08bb5a654750f32() { return logError(function (arg0, arg1) {
    arg0.submit(arg1);
}, arguments) };

export function __wbg_texImage2D_5f2835f02b1d1077() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage2D_b8edcb5692f65f88() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texImage3D_921b54d09bf45af0() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    arg0.texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
}, arguments) };

export function __wbg_texParameteri_8112b26b3c360b7e() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
}, arguments) };

export function __wbg_texParameteri_ef50743cb94d507e() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
}, arguments) };

export function __wbg_texStorage2D_fbda848497f3674e() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_texStorage3D_fd7a7ca30e7981d1() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
}, arguments) };

export function __wbg_texSubImage2D_aa9a084093764796() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_c7951ed97252bdff() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_d52d1a0d3654c60b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_dd9cac68ad5fe0b6() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_e6d34f5bb062e404() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage2D_fbdf91268228c757() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
}, arguments) };

export function __wbg_texSubImage3D_04731251d7cecc83() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_37f0045d16871670() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_66acd67f56e3b214() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_a051de089266fa1b() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_texSubImage3D_b28c55f839bbec41() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
    arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
}, arguments) };

export function __wbg_then_44b73946d2fb3e7d() { return logError(function (arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
}, arguments) };

export function __wbg_then_48b406749878a531() { return logError(function (arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_type_7a829b34832137ac() { return logError(function (arg0) {
    const ret = arg0.type;
    return (__wbindgen_enum_GpuCompilationMessageType.indexOf(ret) + 1 || 4) - 1;
}, arguments) };

export function __wbg_uniform1f_21390b04609a9fa5() { return logError(function (arg0, arg1, arg2) {
    arg0.uniform1f(arg1, arg2);
}, arguments) };

export function __wbg_uniform1f_dc009a0e7f7e5977() { return logError(function (arg0, arg1, arg2) {
    arg0.uniform1f(arg1, arg2);
}, arguments) };

export function __wbg_uniform1i_5ddd9d8ccbd390bb() { return logError(function (arg0, arg1, arg2) {
    arg0.uniform1i(arg1, arg2);
}, arguments) };

export function __wbg_uniform1i_ed95b6129dce4d84() { return logError(function (arg0, arg1, arg2) {
    arg0.uniform1i(arg1, arg2);
}, arguments) };

export function __wbg_uniform1ui_66e092b67a21c84d() { return logError(function (arg0, arg1, arg2) {
    arg0.uniform1ui(arg1, arg2 >>> 0);
}, arguments) };

export function __wbg_uniform2fv_656fce9525420996() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform2fv_d8bd2a36da7ce440() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform2iv_4d39fc5a26f03f55() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform2iv_e967139a28017a99() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform2uiv_4c340c9e8477bb07() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform2uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform3fv_7d828b7c4c91138e() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform3fv_8153c834ce667125() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform3iv_58662d914661aa10() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform3iv_f30d27ec224b4b24() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform3uiv_38673b825dc755f6() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform3uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform4f_36b8f9be15064aa7() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_uniform4f_f7ea07febf8b5108() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_uniform4fv_8827081a7585145b() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform4fv_c01fbc6c022abac3() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform4iv_7fe05be291899f06() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform4iv_84fdf80745e7ff26() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniform4uiv_9de55998fbfef236() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniform4uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
}, arguments) };

export function __wbg_uniformBlockBinding_18117f4bda07115b() { return logError(function (arg0, arg1, arg2, arg3) {
    arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
}, arguments) };

export function __wbg_uniformMatrix2fv_98681e400347369c() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix2fv_bc019eb4784a3b8c() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix2x3fv_6421f8d6f7f4d144() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix2x4fv_27d807767d7aadc6() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix2x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix3fv_3d6ad3a1e0b0b5b6() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix3fv_3df529aab93cf902() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix3x2fv_79357317e9637d05() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix3x4fv_9d1a88b5abfbd64b() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix3x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix4fv_da94083874f202ad() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix4fv_e87383507ae75670() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix4x2fv_aa507d918a0b5a62() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_uniformMatrix4x3fv_6712c7a3b4276fb4() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.uniformMatrix4x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
}, arguments) };

export function __wbg_unmap_c9f759d16734073e() { return logError(function (arg0) {
    arg0.unmap();
}, arguments) };

export function __wbg_unobserve_02f53d1ca2d1d801() { return logError(function (arg0, arg1) {
    arg0.unobserve(arg1);
}, arguments) };

export function __wbg_usage_ed81c0a67549dac8() { return logError(function (arg0) {
    const ret = arg0.usage;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_useProgram_473bf913989b6089() { return logError(function (arg0, arg1) {
    arg0.useProgram(arg1);
}, arguments) };

export function __wbg_useProgram_9b2660f7bb210471() { return logError(function (arg0, arg1) {
    arg0.useProgram(arg1);
}, arguments) };

export function __wbg_valueOf_39a18758c25e8b95() { return logError(function (arg0) {
    const ret = arg0.valueOf();
    return ret;
}, arguments) };

export function __wbg_vertexAttribDivisorANGLE_11e909d332960413() { return logError(function (arg0, arg1, arg2) {
    arg0.vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_vertexAttribDivisor_4d361d77ffb6d3ff() { return logError(function (arg0, arg1, arg2) {
    arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
}, arguments) };

export function __wbg_vertexAttribIPointer_d0c67543348c90ce() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
}, arguments) };

export function __wbg_vertexAttribPointer_550dc34903e3d1ea() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
}, arguments) };

export function __wbg_vertexAttribPointer_7a2a506cdbe3aebc() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
}, arguments) };

export function __wbg_videoHeight_3a43327a766c1f03() { return logError(function (arg0) {
    const ret = arg0.videoHeight;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_videoWidth_4b400cf6f4744a4d() { return logError(function (arg0) {
    const ret = arg0.videoWidth;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_viewport_a1b4d71297ba89af() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.viewport(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_viewport_e615e98f676f2d39() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.viewport(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbg_visibilityState_f3cc18a6f3831137() { return logError(function (arg0) {
    const ret = arg0.visibilityState;
    return (__wbindgen_enum_VisibilityState.indexOf(ret) + 1 || 3) - 1;
}, arguments) };

export function __wbg_warn_4ca3906c248c47c4() { return logError(function (arg0) {
    console.warn(arg0);
}, arguments) };

export function __wbg_webkitExitFullscreen_ef5058d4597405b8() { return logError(function (arg0) {
    arg0.webkitExitFullscreen();
}, arguments) };

export function __wbg_webkitFullscreenElement_987e215aab12de46() { return logError(function (arg0) {
    const ret = arg0.webkitFullscreenElement;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_webkitRequestFullscreen_cdba2299c3040b25() { return logError(function (arg0) {
    arg0.webkitRequestFullscreen();
}, arguments) };

export function __wbg_width_5dde457d606ba683() { return logError(function (arg0) {
    const ret = arg0.width;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_width_8fe4e8f77479c2a6() { return logError(function (arg0) {
    const ret = arg0.width;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_width_cdaf02311c1621d1() { return logError(function (arg0) {
    const ret = arg0.width;
    return ret;
}, arguments) };

export function __wbg_width_f54c7178d3c78f16() { return logError(function (arg0) {
    const ret = arg0.width;
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_writeBuffer_152812595dea1205() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
}, arguments) };

export function __wbg_writeTexture_3f23b69900a195b2() { return logError(function (arg0, arg1, arg2, arg3, arg4) {
    arg0.writeTexture(arg1, arg2, arg3, arg4);
}, arguments) };

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    _assertNum(ret);
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_closure_wrapper2579() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 102, __wbg_adapter_32);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper2581() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 104, __wbg_adapter_35);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper2583() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 100, __wbg_adapter_38);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39650() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2668, __wbg_adapter_44);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39652() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2664, __wbg_adapter_47);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39654() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2662, __wbg_adapter_50);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39656() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2666, __wbg_adapter_53);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39658() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2660, __wbg_adapter_56);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper39660() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2658, __wbg_adapter_59);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper40577() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 2730, __wbg_adapter_62);
    return ret;
}, arguments) };

export function __wbindgen_closure_wrapper8356() { return logError(function (arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1305, __wbg_adapter_41);
    return ret;
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_1;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    _assertBoolean(ret);
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    if (!isLikeNone(ret)) {
        _assertNum(ret);
    }
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

