// ==UserScript==
// @name         GH-ERP 助手
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  体积框置灰，新增长宽高，自动算体积(cm³)回填
// @author       You
// @match        http://183.134.208.28:46483/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://github.com/Vincentliudl/erp-userscript/raw/refs/heads/main/erp-helper.user.js
// @downloadURL  https://github.com/Vincentliudl/erp-userscript/raw/refs/heads/main/erp-helper.user.js
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  // 体积框（要置灰并回填的目标框）
  const VOLUME_SELECTOR = '#form_item_pickingCode'
  // cm³：长×宽×高，不除
  const calcVolume = (l, w, h) => l * w * h

  // 兼容 Vue/ant-design 的写值方式（直接改 value 不生效，必须走原生 setter + 派发事件）
  function setInputValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  function enhance() {
    const vol = document.querySelector(VOLUME_SELECTOR)
    if (!vol || vol.dataset._lwhDone) return // 没找到 / 已处理过
    vol.dataset._lwhDone = '1'

    // 置灰（用 readonly，值仍能正常提交）
    vol.readOnly = true
    vol.style.background = '#f0f0f0'
    vol.style.color = '#999'

    // 在体积框「下面」插入 长/宽/高 三个框
    const box = document.createElement('div')
    box.style.marginTop = '6px'
    box.innerHTML =
      '长<input type="number" style="width:60px;margin:0 4px" data-k="l">' +
      '宽<input type="number" style="width:60px;margin:0 4px" data-k="w">' +
      '高<input type="number" style="width:60px;margin:0 4px" data-k="h">'
    vol.parentNode.appendChild(box)

    const get = (k) =>
      parseFloat(box.querySelector('[data-k="' + k + '"]').value) || 0
    const recalc = () => {
      const v = calcVolume(get('l'), get('w'), get('h'))
      setInputValue(vol, v ? String(+v.toFixed(3)) : '')
    }
    box
      .querySelectorAll('input')
      .forEach((i) => i.addEventListener('input', recalc))
  }

  // 单页应用内容动态渲染，持续监听
  new MutationObserver(enhance).observe(document.body, {
    childList: true,
    subtree: true,
  })
  enhance()
})()
