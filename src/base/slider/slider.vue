<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="{item, index} in dots"
      :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      /* loop 是否循环轮播 */
      loop:{
        type: Boolean,
        default: true
      },
      /* autoPlay 是否自动轮播 */
      autoPlay: {
        type: Boolean,
        default: true
      },
      /* interval 轮播间隔时长 */
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        /* 开启自动轮播 */
        if (this.autoPlay) {
          this._paly()
        }
      }, 20);  /* 一般浏览器刷新在17毫秒左右 */

      window.addEventListener('resize', () => {
        /* 监听视口改变事件，如果没有改变则return */
        if (!this.slider) {
          return
        }
        this.sliderWidth(true)
        this.slider.refresh() /* 使用better-scroll提供的refresh()重新计算*/
      })
    },
    methods: {
      /* _setSliderWidth 计算并设置宽度 */
      _setSliderWidth(isResize) {      
        this.children = this.$refs.sliderGroup.children/* children  sliderGroup子元素 */
        let width = 0/* width  sliderGroup所有元素的宽度*/
        let sliderWidth = this.$refs.slider.clientWidth/* sliderWidth slider容器的宽度 */

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        /* 循环会多出2个child,所以相应总宽度需要*2,当视口改变的时候则不再执行 */
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      /* _initDots slider下方指示 */
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      /* _initSlider 初始化slider */
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,/* 惯性 */
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })


        this.slider.on('scrollEnd', () => {
          /* 当滚动完成后会派发一个scrollEnd事件，使用better-scroll提供的getCurrentPage()方法获取当前的位置 */
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._paly()
          }
        })
      },
      /* _paly() 开启自动轮播 */
      _paly() {
        let pageIndex = this.currentPageIndex +1
        if(this.loop) {
          pageIndex += 1
        }
        this.timer =setTimeout(() => {
          /* better-scroll提供的goToPage()移动 */
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed () {
      /* 当组件中有定时器的时候， 销毁时清除掉释放内存 */
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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