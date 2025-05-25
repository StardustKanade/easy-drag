export type EasyDragOptions = {
  time: number;
};

export type ElementRectObject = {
  element: HTMLElement;
  rect: DOMRect;
};

export default class EasyDrag {
  constructor(container: HTMLElement, options?: EasyDragOptions);
  public destroy(): void;
}
