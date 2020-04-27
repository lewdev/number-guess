var HtmlUtil = (function() {
  //var loadingAnimation = document.getElementById("loadingAnimation");
  function getDataByColumn(parentElem, colName, obj) {
    var input = parentElem.querySelector("." + colName);
    if (input) {
      if (input.getAttribute("type") === "checkbox") {
        obj[colName] = input.checked ? 'TRUE' : 'FALSE';
      }
      else {
        obj[colName] = input.value;
      }
    }
    else {
      obj[colName] = "";
    }
  }
  function populateByColumn(parentElem, colName, obj, leaveBlank) {
    if (!parentElem) {
      return;
    }
    var elemList = parentElem.querySelectorAll("." + colName);
    var value = obj[colName];
    value = value ? value : '';
    if (elemList) {
      var i, elem, size = elemList.length;
      for (i = 0; i < size; i++) {
        elem = elemList[i];
        if (elem.tagName === "I") {
          elem.className = colName + " " + (value === "TRUE" ? "far fa-check-square" : "far fa-square")
        }
        else if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
          if (elem.getAttribute("type") === "checkbox") {
            elem.checked = value === "TRUE";
          }
          else {
            elem.value = value;
          }
        }
        else if (elem.tagName === "SELECT") {
          var options = elem.querySelectorAll("option")
            , j, optionSize = options.length, selectedIndex = -1;
          for (j = 0; j < optionSize; j++) {
            if (value === options[j].value) {
              options[j].selected = true;
              selectedIndex = j;
              break;
            }
          }
          elem.value = value;
          elem.selectedIndex = selectedIndex;
          //$(elem).val(value);
          trigger(elem, "change");
        }
        else {
          if (value && (value + "").trim() !== "") {
            value = value
              .replace(/\n/g, '<br/>')
              .replace(/\s\s/g, '&nbsp;')
            ;
          }
          else {
            value = leaveBlank ? "" : 'N/A';
          } 
          elem.innerHTML = value;
        }
      }
    }
  }
  function isElement(obj) {
    try {
      return obj instanceof HTMLElement;
    }
    catch (e) {
      //Browsers not supporting W3 DOM2 don't have HTMLElement and 
      //an exception is thrown and we end up here. Testing some properties that all 
      //elements have (works on IE7)
      return (typeof obj === 'object')
        && (obj.nodeType === 1)
        && (typeof obj.style === 'object')
        && (typeof obj.ownerDocument === 'object')
      ;
    }
  }
  function createElem(elementName, content) {
    var elem = document.createElement(elementName);
    setContentToElem(elem, content);
    return elem;
  }
  function setContentToElem(elem, content) {
    if (elem) {
      if (isElement(content)) {
        elem.appendChild(content);
      }
      else {
        elem.innerHTML = content ? content : "";
      }
    }
  }
  function addArrToArr(addArr, arr) {
    for (var i = 0; i < addArr.length; i++) {
      arr.push(addArr[i]);
    }
  }
  function generateEmailLinkStr(email) {
    return '<a href="mailto:' + email + '">' + email + '</a>';;
  }
  function createLinkWithTitleStr(url, content, title) {
    return ['<a title="', title, '" href="', url, '">', content, '</a>'].join("");
  }
  function createLinkWithTitleTargetStr(url, content, title, target) {
    return ['<a title="', title, '" href="', url, '" target="', target, '">', content, '</a>'].join("");
  }
  function createLinkStr(url, content) {
    return ['<a href="', url, '">', content, '</a>'].join("");
  }
  function getUrlParam(param) {
    var urlArr = document.location.href.split("?");
    var queryParam = urlArr.length > 1 ? urlArr[1] : false;
    if (queryParam) {
      var paramArr = queryParam.split("&");
      for (var i = 0; i < paramArr.length; i++) {
        var paramItem = paramArr[i];
        if (paramItem.indexOf(param + "=") === 0) {
          return paramItem.split("=")[1].replace(/%20/g, " ");
        }
      }
    }
    return false;
  }
  function setUrlParam(param) {
    var url = document.location.href.split("?")[0];
    window.history.pushState({ param: param }, param, url + (param ? "?" + param : ""));
    return false;
  }
  /**
   * Triggers an eventName (i.e. 'change', 'submit', 'click', etc.) on given Element.
   */
  function trigger(elem, eventName) {
    if (!elem) { return; }
    var event;
    if (typeof(Event) === 'function') {
      event = new Event(eventName);
    }
    else {
      event = document.createEvent("Event");
      event.initEvent(eventName, true, true);
    }
    elem.dispatchEvent(event);
  }
  function scrollTo(elemId) {
    var div = document.querySelector("#" + elemId);
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  }
  /**
   * Creates the ScrollToTop feature and returns it
   */
  function createScrollToTop() {
    var iElem = '<i class="fas fa-angle-double-up"></i>';
    var div = createElem('div', iElem);
    var scrollToTopDiv = createElem('div', div);
    scrollToTopDiv.title = 'Scroll to top';
    scrollToTopDiv.className = 'scrollToTop';
    scrollToTopDiv.id = 'scrollToTop';
    scrollToTopDiv.onclick = function () { window.scrollTo(0, 0); };
    window.addEventListener('scroll', function () {
      scrollToTopDiv.style.display = window.pageYOffset > 200 ? 'block' : 'none';
    });
    return scrollToTopDiv;
  }
  function addModal(modalId) {
    if (document.getElementById(modalId)) {
      console.log("Modal already exists: " + modalId);
    }
    else {
      //$('body').append([
      document.body.appendChild(document.createTextNode([
  '<div class="modal-window" id="', modalId, '" role="dialog">\n'
    , '<div>\n'
      , '<a href="#" title="Close" class="modal-close">&#10006;</a>\n'
      , '<div class="modal-body">\n'
      , '</div>\n'
    , '</div>\n'
  , '</div>'
      ].join("")));
    }
  }
  function offsetY(el) {
    if (!el) {
      return 0;
    }
//    var rect = el.getBoundingClientRect();
//    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
//    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };

    //var pos = { top: el.offsetTop, left: el.offsetLeft };
    //if (el.offsetParent) {
    //  var parentPos = offset(el.offsetParent);
    //  pos.top += parentPos.top;
    //  pos.left += parentPos.left;
    //}
//    var rect = el.getBoundingClientRect();
//    var top = window.scrollY + rect.top;
//    var left = window.scrollX + rect.left;
//    return { top: top, left: left };
//    var pos = { top: 0, left: 0 };
//    do {
//      if (!isNaN(el.offsetLeft)) {
//        pos.top += el.offsetTop;
//        pos.left += el.offsetLeft;
//      }
//    }
//    while (el = el.offsetParent);
//    return pos;
    return false;//$(el).position().top;
  }
  // <div class="alert alert-success row"><div class="col-10"><i class="fas
  // fa-exclamation-circle"></i> Successfully saved BSP Report Cycle</div><div
  // <a href="#" class="ml-auto"
  // onclick="this.parentNode.parentNode.innerHTML = '';">x</a></div></div>
  function showAlert(elem, type, message) {
    if (elem) {
      //$(elem).hide();
      elem.style.display = "none";
      elem.innerHTML = [
        '<div class="alert alert-', type, ' row">'
        ,   '<div class="col-10"><i class="fas fa-exclamation-circle fa-fw"></i> ', message, '</div>'
        ,   '<div class="col-2 text-right">'
        ,     '<a href="#" class="ml-10" onclick="this.parentNode.parentNode.parentNode.innerHTML = \'\'; return false;">&times;</a>'
        ,   '</div>'
        , '</div>'
      ].join("");
      //$(elem).slideDown("fast");
      setTimeout(function() {
        //$(elem).slideUp("slow", function() { elem.innerHTML = ""; });
      }, 10000);
    }
  }
  function xmlSanitize(str) {
    return str
      .trim()
      //.replace(/<[^>]*>/g, '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\'/g, '&apos;')
//      .replace(/[^\x00-\x7F]/g, "")
    ;
  }
  function revertHtmlEntities(str) {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
    ;
  }
  return {
    populateByColumn: populateByColumn,
    createElem: createElem,
    generateEmailLinkStr: generateEmailLinkStr,
    getUrlParam: getUrlParam,
    setUrlParam: setUrlParam,
    addArrToArr: addArrToArr,
    createLinkStr: createLinkStr,
    createLinkWithTitleStr: createLinkWithTitleStr,
    createLinkWithTitleTargetStr: createLinkWithTitleTargetStr,
    trigger: trigger,
    scrollTo: scrollTo,
    createScrollToTop: createScrollToTop,
    addModal: addModal,
    offsetY: offsetY,
    xmlSanitize: xmlSanitize,
    revertHtmlEntities: revertHtmlEntities,
    getDataByColumn: getDataByColumn
  };
})();