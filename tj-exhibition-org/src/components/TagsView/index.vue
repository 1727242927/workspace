<template>
  <div class="tagView-wrapper relative white">
    <a-icon type="left" class="absolute pointer tag_btn" style="left:0" @click="handleScroll(240)" v-show="hanldeBtn" />
    <div class="scroll-outer" ref="scrollOuter" :style="outerWidth">
      <div class="scroll-body absolute" ref="scrollBody" :style="{ left: tagBodyLeft + 'px'}">
        <router-link
          class="tag-item pointer inline-block"
          :to="{path: item.path, query: {...item.query}}"
          v-for="(item, index) in tagsList"
          :key="item.path"
          :class="isActive(item.path) ? 'activeTag' : ''"
          ref="tagWrapper"
        >
          <span class="tag-title">{{ item.meta.title }}</span>
          <a-icon
            type="close"
            v-if="index != 0"
            class="verticalMiddle tag-icon"
            :size="14"
            @click.prevent.stop.native="closeTag(item.path)"
          />
        </router-link>
      </div>
    </div>

    <a-icon
      type="right"
      class="absolute pointer tag_btn"
      style="right:0"
      @click="handleScroll(-240)"
      v-show="hanldeBtn"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'tagsView',
  data() {
    return {
      tagBodyLeft: 0,
      hanldeBtn: false
    }
  },
  computed: {
    ...mapGetters(['tagsList']),
    outerWidth() {
      if (this.hanldeBtn) {
        return {
          left: '0px',
          right: '0px'
        }
      }
      return {
        left: '0px',
        right: '15px'
      }
    }
  },
  mounted() {
    this.addTag()
    this.changeTagWidth()
  },
  methods: {
    isActive(path) {
      return path === this.$route.path
    },
    addTag() {
      const { path, meta, query } = this.$route
      this.$store.dispatch('tagsView/addTags', { path, meta, query })
    },
    closeTag(path) {
      this.$store.dispatch('tagsView/removeTags', path).then(data => {
        if (this.isActive(path)) {
          this.$router.push({
            path: data[data.length - 1].path
          })
        }
        this.changeTagWidth()
        this.moveToTag()
      })
    },
    handleScroll(val) {
      const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth
      const scrollBodyWidth = this.$refs.scrollBody.offsetWidth
      if (val > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + val)
      } else {
        this.tagBodyLeft = Math.max(this.tagBodyLeft + val, scrollOuterWidth - scrollBodyWidth)
      }
    },
    changeTagWidth() {
      const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth
      const scrollBodyWidth = this.$refs.scrollBody.offsetWidth
      if (scrollBodyWidth >= scrollOuterWidth - 50) {
        this.hanldeBtn = true
      } else {
        this.hanldeBtn = false
      }
    },
    moveToTag() {
      this.$nextTick(() => {
        const index = this.tagsList.findIndex(item => item.path === this.$route.path)
        const eleWidth = this.$refs.tagWrapper[index].$el.offsetWidth
        const eleLeft = this.$refs.tagWrapper[index].$el.offsetLeft
        const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth

        // 标签在左边
        if (eleLeft === 0 && index === 0) {
          return
        }
        if (eleLeft < -this.tagBodyLeft) {
          this.tagBodyLeft = -eleLeft + 4
        } else if (eleLeft > -this.tagBodyLeft && eleLeft + eleWidth < -this.tagBodyLeft + scrollOuterWidth) {
          this.tagBodyLeft = Math.min(0, scrollOuterWidth - eleWidth - eleLeft - 4)
        } else {
          this.tagBodyLeft = -(eleLeft - (scrollOuterWidth - 4 - eleWidth))
        }
      })
    }
  },
  watch: {
    $route(nl) {
      this.changeTagWidth()
      this.addTag()
      this.moveToTag()
    }
  }
}
</script>
<style lang="less" scoped>
@height: 50px;

.tagView-wrapper {
  position: relative;
  height: @height;
  padding: 0 25px;
  user-select: none;
  .tag_btn {
    position: absolute;
    width: 26px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
  }
  .scroll-outer {
    height: 50px;
    overflow: hidden;
    z-index: 1;
    padding: 8px 0;
    position: relative;
    .scroll-body {
      position: absolute;
      height: 100%;
      transition: left 0.3s ease;
      z-index: 1;
      display: inline-block;
      white-space: nowrap;
      .tag-item {
        display: inline-block;
        height: 34px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        padding: 0 8px;
        margin-right: 10px;

        .tag-title {
          vertical-align: middle;
          margin-right: 7px;
          color: #666;
        }
        .tag-icon {
          font-size: 12px;
          transform: scale(0.8);
          transition: all .3s cubic-bezier(.645,.045,.355,1);
          &:hover {
            color: #fff;
            background: #c0c4cc;
            border-radius: 50%;
          }
        }
      }
      .activeTag {
        border: 1px solid#1890ff;
        .tag-title {
          margin-right: 0 !important;
          line-height: 32px;
          color:#1890ff;
        }
        .tag-icon {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
