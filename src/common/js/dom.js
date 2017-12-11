/* 添加class */
export function addClass(el, className) {

}

/* 判断DOM上是否有此class */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
