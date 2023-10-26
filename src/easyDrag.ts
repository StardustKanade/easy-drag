import { EasyDragOptions, ElementRectObject } from "./EasyDrag.d";
import { isMobileDevice } from "./utils/index";

export default function EasyDrag(
  _container: HTMLElement,
  _options?: EasyDragOptions
) {
  let container: HTMLElement = _container;
  let dragElement: HTMLElement | null = null;
  let cloneElement: HTMLElement | null = null;
  let options: EasyDragOptions = {
    time: 200,
  };
  let offset = {
    x: 0,
    y: 0,
  };

  if (_container instanceof HTMLElement) {
    container = _container;
  } else {
    throw new Error("Error in parameter 1: Please provide an Element");
  }

  if (
    typeof _options === "object" &&
    _options !== null &&
    _options.constructor === Object
  ) {
    options = {
      ...options,
      ..._options,
    };
  }

  function init() {
    setDraggable();
    addListener();
  }

  function setDraggable() {
    Array.from(container.children).forEach((childrenElement) => {
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
    } else {
      container.addEventListener("dragstart", onDragStart);
      container.addEventListener("dragenter", onDragEnter);
      container.addEventListener("dragend", onDragend);
    }
  }

  function onDragStart(event: DragEvent) {
    let _dragElement = event.target as HTMLElement | null;

    if (_dragElement === container) return;

    while (
      _dragElement &&
      _dragElement.parentElement &&
      _dragElement.getAttribute("draggable") !== "true"
    ) {
      _dragElement = _dragElement.parentElement;
    }

    // firefox设置setData后元素才能拖动，名称不能为text，否则会打开新tab
    if (event.dataTransfer && _dragElement) {
      event.dataTransfer.setData("content", _dragElement.innerText);
      event.dataTransfer.effectAllowed = "move";
    }

    dragElement = _dragElement;
  }

  function onDragEnter(event: DragEvent) {
    event.preventDefault();
    let targetElement = event.target as HTMLElement;

    if (
      !container.contains(dragElement) ||
      !container.contains(targetElement) ||
      container === targetElement
    ) {
      return;
    }

    while (
      targetElement &&
      targetElement.parentElement &&
      targetElement.parentElement !== container &&
      targetElement !== container
    ) {
      targetElement = targetElement.parentElement;
    }

    if (
      dragElement === targetElement ||
      targetElement?.getAttribute("move") === "true"
    )
      return;

    moveElement(targetElement);
  }

  function onDragend(event: DragEvent) {
    event.preventDefault();
    dragElement = null;
  }

  function onTouchStart(event: TouchEvent) {
    let _dragElement = event.touches[0].target as HTMLElement;

    if (_dragElement === container) return;

    while (
      _dragElement.getAttribute("draggable") !== "true" &&
      _dragElement.parentElement
    ) {
      _dragElement = _dragElement.parentElement;
    }

    dragElement = _dragElement;
    cloneElement = _dragElement.cloneNode(true) as HTMLElement;

    cloneElement.removeAttribute("style");

    setCloneStyle(event);
  }

  function onTouchMove(event: TouchEvent) {
    event.preventDefault();
    if (!cloneElement) return;

    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    cloneElement.style.left = x - offset.x + "px";
    cloneElement.style.top = y - offset.y + "px";
    cloneElement.offsetLeft;

    let targetElement = document.elementFromPoint(x, y) as HTMLElement;

    if (
      !container.contains(dragElement) ||
      !container.contains(targetElement) ||
      container === targetElement
    ) {
      return;
    }

    while (
      targetElement &&
      targetElement.parentElement &&
      targetElement.parentElement !== container &&
      targetElement !== container
    ) {
      targetElement = targetElement.parentElement;
    }

    if (
      dragElement === targetElement ||
      targetElement.getAttribute("move") === "true"
    )
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

  function moveElement(targetElement: HTMLElement) {
    if (!dragElement) return;

    const minIndex = Math.min(getIndex(dragElement), getIndex(targetElement));
    const maxIndex =
      Math.max(getIndex(dragElement), getIndex(targetElement)) + 1;

    const oldElementList: ElementRectObject[] = Array.from(container.children)
      .slice(minIndex, maxIndex)
      .map((element) => ({
        element: element as HTMLElement,
        rect: element.getBoundingClientRect(),
      }));

    if (getIndex(dragElement) < getIndex(targetElement)) {
      container.insertBefore(dragElement, targetElement.nextSibling);
    } else {
      container.insertBefore(dragElement, targetElement);
    }

    if (options.time > 0) {
      setTransition(oldElementList, minIndex, maxIndex);
    }
  }

  function setTransition(
    oldElementList: ElementRectObject[],
    minIndex: number,
    maxIndex: number
  ) {
    Array.from(container.children)
      .slice(minIndex, maxIndex)
      .forEach((_element) => {
        const element = _element as HTMLElement;
        const newElementRect = element.getBoundingClientRect();
        const oldElement = oldElementList.find(
          (beforeElement) => element === beforeElement.element
        );

        if (oldElement) {
          if (element === dragElement) element.style.zIndex = "1";
          element.style.transition = "none";
          element.style.transform =
            "translate3d(" +
            (oldElement.rect.left - newElementRect.left) +
            "px," +
            (oldElement.rect.top - newElementRect.top) +
            "px,0)";

          element.offsetWidth;

          element.style.transition = `all ${options.time}ms ease`;
          element.style.transform = "translate3d(0, 0, 0)";
          element.setAttribute("move", "true");

          element.addEventListener("transitionend", clearStyle);
        }
      });
  }

  function setCloneStyle(event: TouchEvent) {
    if (!dragElement || !cloneElement) return;

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

  function clearStyle(event: TransitionEvent) {
    const target = event.target as HTMLElement;
    if (target) {
      target.removeAttribute("move");
      target.removeAttribute("style");
      target.removeEventListener("transitionend", clearStyle);
    }
  }

  function getIndex(targetElement: HTMLElement) {
    if (!targetElement) return -1;

    const elementList = Array.from(container.children);
    const index = elementList.indexOf(targetElement);

    return index;
  }

  init();
}
