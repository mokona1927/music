<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index }"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {addClass} from "common/js/dom"
import BScroll from "better-scroll"
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    /* 是否循环 */
    loop: {
      type: Boolean,
      default: true
    },
    /* 是否自动 */
    autoPlay: {
      type: Boolean,
      default: true
    },
    /* 轮播间隔时间 */
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20);

    /* 处理视口变化，slide宽度出现问题的情况 */
    window.addEventListener('resize', () => {
      if (!this.slider) {
       return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, "slider-item")
        /* 每个小滑块的宽度等于每个子元素的宽度 */
        child.style.width = sliderWidth + 'px'
        /* 总宽度等于每个小滑块的叠加 */
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    /* 初始化dots */
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    /* 初始化BScroll */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        /* 是否横向滚动 */
        scrollX: true,
        /* 是否纵向滚动 */
        scrollY: false,
        /* 惯性 */
        momentum: false,
        snap: {
          loop:this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        /* 判断是否循环，因为插件自身复制了两个DOM */
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    /* 自动播放 */
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed () {
    /* 当方法中有定时器的时候，在实例销毁的时候最好进行清除，有利于内存释放 */
    clearTimeout(this.timer)
  }
};
</script>


<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable'

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
