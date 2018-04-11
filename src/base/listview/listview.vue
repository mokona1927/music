<template>
 <scroll class="listview" 
         :data="data" 
         ref="listview"
         :listenScroll="listenScroll"
         :probeType="probeType"
         @scroll="scroll">
   <ul>
     <li v-for="group in data" class="list-group" ref="listGroup">
       <h2 class="list-group-title">{{group.title}}</h2>
       <ul>
          <li @click="selecItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
       </ul>
     </li>
   </ul>

   <div class="list-shortcut" 
        @touchstart="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove">
     <ul>
       <li v-for="(item, index) in shortcutList" 
           class="item"
           :class="{'current': currentIndex == index }"
           :data-index="index">
         {{item}}
       </li>
     </ul>
   </div>

   <div class="list-fixed" v-show="fixedTitle" ref="fixed">
     <h1 class="fixed-title">{{fixedTitle}}</h1>
   </div>

   <div v-show="!data.length" class="loading-container">
     <loading></loading>
   </div>
 </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll"
import Loading from 'base/loading/loading'

import { getData } from "common/js/dom"

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    /* shortcutList 右侧快速入口 */
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      });
    },
    /* fixedTitle 每个group的头部 */
    fixedTitle() {
      if (screenY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ""
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
      this.touch = {},
      this.listenScroll = true,
      this.listenHeight = [],
      /* 用于scroll不节流 */
      this.probeType = 3
  },
  methods: {
    /* 派发点击事件 */
    selecItem(item) {
      this.$emit('select', item)
    },
    /* 右侧滑动 */
    onShortcutTouchStart(e) {
      /* anchorIndex 现在激活节点索引 */
      let anchorIndex = getData(e.target, 'index')
      /* firstTouch 滑动手势位置 */
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY
      /* delta Y轴上的偏移 */
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      /* 边界处理 */
      if (index !== 0 && !index) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listenHeight.length - 2) {
        index = this.listenHeight.length - 2
      }
      this.scrollY = -this.listenHeight[index]
      /* scrollToElement() 第二个参数是指需要多少动画时间 */
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    /* 计算listGroup的高度 */
    _calculateHeight() {
      this.listenHeight = [];
      const list = this.$refs.listGroup
      let height = 0

      this.listenHeight.push(height)

      for (let i = 0; i < list.length; i++) {
        /* item 为每个group元素 */
        let item = list[i]

        height += item.clientHeight

        this.listenHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listenHeight = this.listenHeight
      /* 
        *** 1、当滚动到顶部的时候，newY>0
        *** 2、在中间区域滚动的时候，因为添加了上下限，所以比列表多一个，长度需要-1
        *** 3、当滚动到底部，且-newY大于最后一个元素的上限
        */

      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listenHeight.length - 1; i++) {
        let heightB = listenHeight[i]
        let heightT = listenHeight[i + 1]

        /* newY前面加-是因为网上滚动后newY为负值*/
        if (-newY >= heightB && -newY < heightT) {
          this.currentIndex = i
          this.diff = heightT + newY
          return
        }

        this.currentIndex = listenHeight.length - 2
      }
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = "translate3d(0, ${fixed}px, 0)"
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
