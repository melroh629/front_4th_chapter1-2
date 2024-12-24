export function createVNode(type, props, ...children) {
  const flatChildren = children
    .flat(Infinity)
    .filter((child) => child === 0 || Boolean(child));
  //props 안에 children을 포함시키는게 좋지 않을까?!
  return { type, props, children: flatChildren };
}
