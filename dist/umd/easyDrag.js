/**!
* EasyDrag
* @version 0.8.5
* @author Huucat <https://github.com/Huucat>
* @license MIT
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.easyDrag = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function EasyDrag(_container, _options) {
        var container = _container;
        var dragElement = null;
        var cloneElement = null;
        var options = {
            time: 200,
        };
        var offset = {
            x: 0,
            y: 0,
        };
        if (_container instanceof HTMLElement) {
            container = _container;
        }
        else {
            throw new Error("Error in parameter 1: Please provide an Element");
        }
        if (typeof _options === "object" &&
            _options !== null &&
            _options.constructor === Object) {
            options = __assign(__assign({}, options), _options);
        }
        function init() {
            setDraggable();
            addListener();
        }
        function setDraggable() {
            Array.from(container.children).forEach(function (childrenElement) {
                childrenElement.setAttribute("draggable", "true");
            });
        }
        function addListener() {
            if (isMobileDevice()) {
                container.addEventListener("touchstart", onTouchStart, {
                    passive: false,
                });
                container.addEventListener("touchmove", onTouchMove, {
                    passive: false,
                });
                container.addEventListener("touchend", onTouchEnd);
            }
            else {
                container.addEventListener("dragstart", onDragStart);
                container.addEventListener("dragenter", onDragEnter);
                container.addEventListener("dragend", onDragend);
            }
        }
        function onDragStart(event) {
            var _dragElement = event.target;
            if (_dragElement === container)
                return;
            while (_dragElement &&
                _dragElement.parentElement &&
                _dragElement.getAttribute("draggable") !== "true") {
                _dragElement = _dragElement.parentElement;
            }
            if (event.dataTransfer && _dragElement) {
                event.dataTransfer.setData("content", _dragElement.innerText);
                event.dataTransfer.effectAllowed = "move";
            }
            dragElement = _dragElement;
        }
        function onDragEnter(event) {
            event.preventDefault();
            var targetElement = event.target;
            if (!container.contains(dragElement) ||
                !container.contains(targetElement) ||
                container === targetElement) {
                return;
            }
            while (targetElement &&
                targetElement.parentElement &&
                targetElement.parentElement !== container &&
                targetElement !== container) {
                targetElement = targetElement.parentElement;
            }
            if (dragElement === targetElement ||
                (targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute("move")) === "true")
                return;
            moveElement(targetElement);
        }
        function onDragend(event) {
            event.preventDefault();
            dragElement = null;
        }
        function onTouchStart(event) {
            var _dragElement = event.touches[0].target;
            if (_dragElement === container)
                return;
            while (_dragElement.getAttribute("draggable") !== "true" &&
                _dragElement.parentElement) {
                _dragElement = _dragElement.parentElement;
            }
            dragElement = _dragElement;
            cloneElement = _dragElement.cloneNode(true);
            cloneElement.removeAttribute("style");
            setCloneStyle(event);
        }
        function onTouchMove(event) {
            event.preventDefault();
            if (!cloneElement)
                return;
            var touch = event.touches[0];
            var x = touch.clientX;
            var y = touch.clientY;
            cloneElement.style.left = x - offset.x + "px";
            cloneElement.style.top = y - offset.y + "px";
            cloneElement.offsetLeft;
            var targetElement = document.elementFromPoint(x, y);
            if (!container.contains(dragElement) ||
                !container.contains(targetElement) ||
                container === targetElement) {
                return;
            }
            while (targetElement &&
                targetElement.parentElement &&
                targetElement.parentElement !== container &&
                targetElement !== container) {
                targetElement = targetElement.parentElement;
            }
            if (dragElement === targetElement ||
                targetElement.getAttribute("move") === "true")
                return;
            moveElement(targetElement);
        }
        function onTouchEnd() {
            dragElement = null;
            if (cloneElement) {
                cloneElement.remove();
                cloneElement = null;
                offset.x = 0;
                offset.y = 0;
            }
        }
        function moveElement(targetElement) {
            if (!dragElement)
                return;
            var minIndex = Math.min(getIndex(dragElement), getIndex(targetElement));
            var maxIndex = Math.max(getIndex(dragElement), getIndex(targetElement)) + 1;
            var oldElementList = Array.from(container.children)
                .slice(minIndex, maxIndex)
                .map(function (element) { return ({
                element: element,
                rect: element.getBoundingClientRect(),
            }); });
            if (getIndex(dragElement) < getIndex(targetElement)) {
                container.insertBefore(dragElement, targetElement.nextSibling);
            }
            else {
                container.insertBefore(dragElement, targetElement);
            }
            if (options.time > 0) {
                setTransition(oldElementList, minIndex, maxIndex);
            }
        }
        function setTransition(oldElementList, minIndex, maxIndex) {
            Array.from(container.children)
                .slice(minIndex, maxIndex)
                .forEach(function (_element) {
                var element = _element;
                var newElementRect = element.getBoundingClientRect();
                var oldElement = oldElementList.find(function (beforeElement) { return element === beforeElement.element; });
                if (oldElement) {
                    if (element === dragElement)
                        element.style.zIndex = "1";
                    element.style.transition = "none";
                    element.style.transform =
                        "translate3d(" +
                            (oldElement.rect.left - newElementRect.left) +
                            "px," +
                            (oldElement.rect.top - newElementRect.top) +
                            "px,0)";
                    element.offsetWidth;
                    element.style.transition = "all ".concat(options.time, "ms ease");
                    element.style.transform = "translate3d(0, 0, 0)";
                    element.setAttribute("move", "true");
                    element.addEventListener("transitionend", clearStyle);
                }
            });
        }
        function setCloneStyle(event) {
            if (!dragElement || !cloneElement)
                return;
            offset.x = event.touches[0].clientX - dragElement.offsetLeft;
            offset.y = event.touches[0].clientY - dragElement.offsetTop;
            cloneElement.style.position = "absolute";
            cloneElement.style.zIndex = "10000";
            cloneElement.style.pointerEvents = "none";
            cloneElement.style.opacity = "0.5";
            cloneElement.style.left = dragElement.offsetLeft + "px";
            cloneElement.style.top = dragElement.offsetTop + "px";
            container.appendChild(cloneElement);
        }
        function clearStyle(event) {
            var target = event.target;
            if (target) {
                target.removeAttribute("move");
                target.removeAttribute("style");
                target.removeEventListener("transitionend", clearStyle);
            }
        }
        function getIndex(targetElement) {
            if (!targetElement)
                return -1;
            var elementList = Array.from(container.children);
            var index = elementList.indexOf(targetElement);
            return index;
        }
        init();
    }

    return EasyDrag;

}));
