/*!
 * easy-drag v1.0.0
 * Author: StardustKanade
 * License: MIT
 * Website: https://github.com/StardustKanade/easy-drag#readme
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EasyDrag = factory());
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
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


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

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function EasyDrag(_container, _options) {
        var _this = this;
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
        if (typeof _options === "object" && _options !== null && _options.constructor === Object) {
            options = __assign(__assign({}, options), _options);
        }
        var init = function () {
            setDraggable();
            addListener();
        };
        var setDraggable = function () {
            Array.from(container.children).forEach(function (childrenElement) {
                childrenElement.setAttribute("draggable", "true");
            });
        };
        var addListener = function () {
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
        };
        var onDragStart = function (event) {
            var _dragElement = event.target;
            if (_dragElement === container)
                return;
            while (_dragElement &&
                _dragElement.parentElement &&
                _dragElement.getAttribute("draggable") !== "true") {
                _dragElement = _dragElement.parentElement;
            }
            // firefox设置setData后元素才能拖动，名称不能为text，否则会打开新tab
            if (event.dataTransfer && _dragElement) {
                event.dataTransfer.setData("content", _dragElement.innerText);
                event.dataTransfer.effectAllowed = "move";
            }
            dragElement = _dragElement;
        };
        var onDragEnter = function (event) {
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
            if (dragElement === targetElement || (targetElement === null || targetElement === void 0 ? void 0 : targetElement.getAttribute("move")) === "true")
                return;
            moveElement(targetElement);
        };
        var onDragend = function (event) {
            event.preventDefault();
            dragElement = null;
        };
        var onTouchStart = function (event) {
            var _dragElement = event.touches[0].target;
            if (_dragElement === container)
                return;
            while (_dragElement.getAttribute("draggable") !== "true" && _dragElement.parentElement) {
                _dragElement = _dragElement.parentElement;
            }
            dragElement = _dragElement;
            cloneElement = _dragElement.cloneNode(true);
            cloneElement.removeAttribute("style");
            setCloneStyle(event);
        };
        var onTouchMove = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var touch, x, y, targetElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        if (!cloneElement)
                            return [2 /*return*/];
                        touch = event.touches[0];
                        x = touch.clientX;
                        y = touch.clientY;
                        cloneElement.style.left = x - offset.x + "px";
                        cloneElement.style.top = y - offset.y + "px";
                        return [4 /*yield*/, reRender()];
                    case 1:
                        _a.sent();
                        targetElement = document.elementFromPoint(x, y);
                        if (!container.contains(dragElement) ||
                            !container.contains(targetElement) ||
                            container === targetElement) {
                            return [2 /*return*/];
                        }
                        while (targetElement &&
                            targetElement.parentElement &&
                            targetElement.parentElement !== container &&
                            targetElement !== container) {
                            targetElement = targetElement.parentElement;
                        }
                        if (dragElement === targetElement || targetElement.getAttribute("move") === "true")
                            return [2 /*return*/];
                        moveElement(targetElement);
                        return [2 /*return*/];
                }
            });
        }); };
        var onTouchEnd = function () {
            dragElement = null;
            if (cloneElement) {
                cloneElement.remove();
                cloneElement = null;
                offset.x = 0;
                offset.y = 0;
            }
        };
        var moveElement = function (targetElement) {
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
        };
        var setTransition = function (oldElementList, minIndex, maxIndex) {
            Array.from(container.children)
                .slice(minIndex, maxIndex)
                .forEach(function (_element) { return __awaiter(_this, void 0, void 0, function () {
                var element, newElementRect, oldElement;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            element = _element;
                            newElementRect = element.getBoundingClientRect();
                            oldElement = oldElementList.find(function (beforeElement) { return element === beforeElement.element; });
                            if (!oldElement) return [3 /*break*/, 2];
                            if (element === dragElement)
                                element.style.zIndex = "1";
                            element.style.transition = "none";
                            element.style.transform =
                                "translate3d(" +
                                    (oldElement.rect.left - newElementRect.left) +
                                    "px," +
                                    (oldElement.rect.top - newElementRect.top) +
                                    "px,0)";
                            return [4 /*yield*/, reRender()];
                        case 1:
                            _a.sent();
                            element.style.transition = "all ".concat(options.time, "ms ease");
                            element.style.transform = "translate3d(0, 0, 0)";
                            element.setAttribute("move", "true");
                            element.addEventListener("transitionend", clearStyle);
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        };
        var setCloneStyle = function (event) {
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
        };
        var clearStyle = function (event) {
            var target = event.target;
            if (target) {
                target.removeAttribute("move");
                target.removeAttribute("style");
                target.removeEventListener("transitionend", clearStyle);
            }
        };
        var getIndex = function (targetElement) {
            if (!targetElement)
                return -1;
            var elementList = Array.from(container.children);
            var index = elementList.indexOf(targetElement);
            return index;
        };
        var reRender = function () {
            return new Promise(function (resolve) {
                requestAnimationFrame(resolve);
            });
        };
        init();
    }

    return EasyDrag;

}));
