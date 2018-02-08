<template>
  <div class="singer">
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'

  import Singer from 'common/js/singer'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data () {
      return {
        singers: [] /* 歌手 */ 
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      /* 获取数据 */
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
          }
        })
      },
      /* 处理singers */
      _normalizeSinger(list) {
        /*map 用来装处理的数据 */
        let map = {
          /* 热门数据 */
          hot: {
            title: HOT_NAME,
            item: []
          }
        }

        list.forEach((item, index) => {
          /* 如果index小于10的时候，则是热门数据 */
          if (index < HOT_SINGER_LEN) {
            map.hot.item.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          /* key 右侧索引 */
          const key =item.Findex
          
          /* 判断map中是否有key值 */
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
        })

        /* 为了得到有序列表，需要处理map，把对象转化为有序数组 */
        let hot = [] /* 热门 */
        let ret = [] /* 其他 */

        for (let key in map) {
          let val = map[key]
          /* 判断val.title是否为字母 */
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        /* 对字母类数据做升序排序 */
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        return hot.concat(ret)
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
