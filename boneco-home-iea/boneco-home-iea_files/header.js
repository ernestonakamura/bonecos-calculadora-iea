function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eventosDocumentosGoverno(doc) {
    var links = doc.getElementById("linksGoverno");
    if (links !== null) {
        links.addEventListener("change", function () {
            if (this.value)
                window.open(this.value, '_blank');
        });
    }
}

function eventosContraste(doc) {
    var setHighContrastInBody = function (highContrast) {
        var el = doc.getElementsByTagName("body")[0];
        if (highContrast)
            el.classList.add('highcontrast');
        else
            el.classList.remove('highcontrast');
    };
    var getHighContrastCookie = function () { return getCookie('highcontrast'); };

    // Mant�m contraste no load.
    if (getHighContrastCookie() === 'yes')
        setHighContrastInBody(true);

    // Contraste alto.
    var btnsHighContrast = doc.getElementsByClassName('button-toggle-highcontrast');
    if (btnsHighContrast.length > 0) {
        btnsHighContrast[0].addEventListener("click", function () {
            if (getHighContrastCookie() !== 'yes') {
                createCookie('highcontrast', 'yes', 7);
                setHighContrastInBody(true);
            }
        });
    }

    // Contraste normal.
    var btnsRemoveContrast = doc.getElementsByClassName('button-toggle-remove');
    if (btnsRemoveContrast.length > 0) {
        btnsRemoveContrast[0].addEventListener("click", function () {
            setHighContrastInBody(false);
            if (getHighContrastCookie() === 'yes')
                createCookie('highcontrast', null, 7);
        });
    }
}

function eventosTamanhoFonte(doc) {

    var getContentElement = function () { return doc.getElementsByClassName('content')[0]; };
    var setFontSize = function (fontSize) {
        getContentElement().style.fontSize = isNaN(fontSize) ? '' : fontSize + '%';
    };
    var getCurrentFontSize = function () {
        var currentFontSize = getContentElement().style.fontSize;
        var currentFontSizeNum = parseFloat(currentFontSize);
        return isNaN(currentFontSizeNum) ? 100 : currentFontSizeNum;
    };

    // Mant�m tamanho no load.
    var fontSizeCookie = parseFloat(getCookie('font_percent'));
    if (!isNaN(fontSizeCookie))
        setFontSize(fontSizeCookie);

    // Retorna tamanho da fonte ao original
    var btnsResetFont = doc.getElementsByClassName('reset');
    if (btnsResetFont.length > 0) {
        btnsResetFont[0].addEventListener('click', function () {
            setFontSize(isNaN);
            createCookie('font_percent', null, 365);
        });
    }

    // Aumenta tamanho
    var btnsIncreaseFont = doc.getElementsByClassName('mais');
    if (btnsIncreaseFont.length > 0) {
        btnsIncreaseFont[0].addEventListener('click', function () {
            var newFontSize = getCurrentFontSize() + 10;
            if (newFontSize < 200) {
                setFontSize(newFontSize);
                createCookie('font_percent', newFontSize, 365);
            }
        });
    }

    // Diminui tamanho
    var btnsDecreaseFont = doc.getElementsByClassName('menos');
    if (btnsDecreaseFont.length > 0) {
        btnsDecreaseFont[0].addEventListener('click', function () {
            var newFontSize = getCurrentFontSize() - 10;
            if (newFontSize > 50) {
                setFontSize(newFontSize);
                createCookie('font_percent', newFontSize, 365);
            }
        });
    }
}

// https://github.com/jfriend00/docReady
(function (funcName, baseObj) {
    "use strict";
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of 
    // window.docReady(...)
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () { callback(context); }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" ||
            !document.attachEvent && document.readyState === "interactive") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    };
})("docReady", window);
// modify this previous line to pass in your own method name 
// and object for the method to be attached to

docReady(eventosDocumentosGoverno, document);
docReady(eventosContraste, document);
docReady(eventosTamanhoFonte, document);
