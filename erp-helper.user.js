
// ==UserScript==
// @name         GH-ERP 助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       You
// @match        http://183.134.208.28:46483/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://github.com/Vincentliudl/erp-userscript/raw/refs/heads/main/erp-helper.user.js
// @downloadURL  https://github.com/Vincentliudl/erp-userscript/raw/refs/heads/main/erp-helper.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

  function setVueInputValue(input, value) {
        input.value = value;
        // 触发 v-model 更新
        input.dispatchEvent(new Event('input', { bubbles: true }));
        // 触发校验/失焦逻辑
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function demo() {
        const input = document.querySelector('#form_item_pickingCode');
        if (!input || input.dataset._done) return;
        input.dataset._done = '1';
        setVueInputValue(input, 'TEST123');
        console.log('已回显 →', input.value);
        console.log('已回显 →', 222222222);
    }

    new MutationObserver(demo).observe(document.body, { childList: true, subtree: true });
    demo();
})();
