// import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 이전 속성들 제거
  Object.keys(oldProps).forEach((key) => {
    if (key === "className") {
      if (!(key in newProps)) {
        target.removeAttribute("class");
      }
    } else if (key === "htmlFor") {
      if (!(key in newProps)) {
        target.removeAttribute("for");
      }
    } else if (!key.startsWith("on") && !(key in newProps)) {
      target.removeAttribute(key);
    }
  });

  // 새로운 속성들 설정
  Object.keys(newProps).forEach((key) => {
    if (key === "className") {
      target.setAttribute("class", newProps[key]);
    } else if (key === "htmlFor") {
      target.setAttribute("for", newProps[key]);
    } else if (!key.startsWith("on")) {
      target.setAttribute(key, newProps[key]);
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 이전 노드가 없는 경우 (새로운 노드 추가)
  if (oldNode == null) {
    parentElement.appendChild(createElement(newNode));
    return;
  }
  // 2. 새로운 노드가 없는 경우 (기존 노드 제거)
  if (newNode == null) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }
  // 3. 두 노드가 텍스트이고 다른 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      const oldChild = parentElement.childNodes[index];
      const newChild = createElement(newNode);
      parentElement.replaceChild(newChild, oldChild);
    }
    return;
  }
  // 4. 노드 타입이 다른 경우 (전체 교체)
  if (oldNode.type !== newNode.type) {
    const oldChild = parentElement.childNodes[index];
    const newChild = createElement(newNode);
    parentElement.replaceChild(newChild, oldChild);
    return;
  }

  // 5. 같은 타입의 엘리먼트인 경우
  // 5.1. 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 5.2. 자식 노드들 재귀적으로 업데이트
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children?.[i],
      oldNode.children?.[i],
      i,
    );
  }
}
