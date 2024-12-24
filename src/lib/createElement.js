import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  // console.log("createElement vNode:", {
  //   type: vNode.type,
  //   props: vNode.props,
  //   children: vNode.children,
  // });
  if (vNode && typeof vNode === "object" && typeof vNode.type === "function") {
    throw new Error("vNode의 정규화를 먼저 진행해야 합니다.");
  }
  vNode = normalizeVNode(vNode);

  if (vNode === null || vNode === undefined || typeof vNode === Boolean) {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((item) => {
      fragment.appendChild(createElement(item));
    });
    return fragment;
  }

  const $element = document.createElement(vNode.type);
  updateAttributes($element, vNode.props);

  // 이후에 자식 노드 처리
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      if (childElement) {
        $element.appendChild(childElement);
      }
    });
  }

  return $element;
}

function updateAttributes($el, props = {}) {
  // props가 없거나 객체가 아닌 경우 early return
  if (!props || typeof props !== "object") {
    return;
  }
  // 이벤트 핸들러와 일반 속성을 구분하여 처리
  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 핸들러 처리 (on으로 시작하는 prop)
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
      return;
    }
    // className 특별 처리
    if (key === "className") {
      $el.className = value;
      return;
    }
    // style 객체 처리
    if (key === "style" && typeof value === "object") {
      Object.entries(value).forEach(([cssKey, cssValue]) => {
        $el.style[cssKey] = cssValue;
      });
      return;
    }
    // 일반 속성 처리
    if (value !== false && value !== null && value !== undefined) {
      $el.setAttribute(key, value);
    }
  });
}
