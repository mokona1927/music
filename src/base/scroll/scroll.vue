<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";

const DIRECTION_H = "horizontal";
const DIRECTION_V = "vertical";

export default {
  props: {
    /* 监听组件 */
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: false
    },
    /*  */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /* 用于实时更新数据 */
    data: {
      type: Array,
      default: null
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    direction: {
      type: String,
      default: DIRECTION_V
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    /* _initScroll 初始化scroll */
    _initScroll() {
      /* 如果没有调用的时候，直接return */
      if (!this.$refs.wrapper) {
        return;
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
    },
    /* 下列为better-scroll方法代理 */
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {},
    scrollToElement() {}
  },
  watch: {
    /* 当data刷新时，调用refresh()刷新 */
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
