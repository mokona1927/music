import originJsonp from 'jsonp'
/* 引入jsonp */

export default function jsonp(url, data, option) {
  /* 判断是否有？ */
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      /* 当成功的时候 */
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/* 把jsonp对象拼到url中 */
export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  /* 当url有数据的时候，第一个需要把&去掉 */
  return url ? url.substring(1) : ''
}
