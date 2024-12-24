export function normalizeVNode(vNode) {
  // vNode가 null, undefined, false 인 경우
  if (vNode === null && vNode === undefined && typeof vNode === Boolean)
    return "";
  // vNode 숫자 또는 문자열인 경우 문자열로 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  //vNode타입이 함수인 경우 => 해당 함수 호출하여 반환된 결과를 재귀적으로 표준화
  if (typeof vNode.type === "function") {
    console.log(vNode);
    const props = {
      ...vNode.props,
      children: vNode.children,
    };
    return normalizeVNode(vNode.type(props));
  }
  // vNode타입이 배열인 경우 => 배열의 원소를 재귀적으로 표준화
  if (Array.isArray(vNode)) {
    return vNode
      .map((item) => normalizeVNode(item))
      .filter((item) => item !== null && item !== undefined && item);
  }
  // vNode타입이 객체가 아닌 경우
  if (typeof vNode !== "object") {
    return String(vNode);
  }

  // 그 외의 경우 -> vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined필터링하여 반환
  const normalizedNode = { ...vNode };

  if (Array.isArray(normalizedNode.children)) {
    normalizedNode.children = normalizedNode.children
      .map((item) => normalizeVNode(item))
      .filter((item) => item !== null && item !== undefined && item);
  }
  return normalizedNode;
}
