import originJsonp from 'jsonp'
/* 引入jsonp */

/* u */
export default function jsonp(url, data, option) {
  return new Promise((resolve, reject) => {
    originJsonp(url, option, () => {
      
    })
  })
}
