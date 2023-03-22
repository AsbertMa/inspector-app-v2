<template>
  <div @mousemove="onMousemove" ref="container" @mouseup="setActive(false)" @mouseleave="setActive(false)" class="draggable-container">
    <div ref="side" class="side">
        <slot name="side"> </slot>
    </div>
    <div @mousedown="onMousedown(true)" @mouseup="onBarMouseup(true)" class="drag-bar-v"></div>
    <div class="other-side">
      <div class="top">
        <slot name="right-top"></slot>
      </div>
      <div @mousedown="onMousedown(false)" @mouseup="onBarMouseup(false)" class="drag-bar-h"></div>
      <div class="bottom">
        <slot name="right-bottom" ></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const minWidth = 250
const minHeight = 150

const container = ref()
const side = ref()
let colResize = ref(false)
let rowResize = ref(false)
let isActive = ref(false)

const onMousedown = (isCol: boolean) => {
  isActive.value = true
  if (isCol) {
    colResize.value = true
  } else {
    rowResize.value = true
  }
}
const setActive = (ok: boolean) => {
    isActive.value = ok
}
const onBarMouseup = (isCol: boolean) => {
  if (isCol) {
    colResize.value = false
  } else {
    rowResize.value = false
  }
}

const onMousemove = (e: MouseEvent) => {
  if(!isActive.value) {
    return
  }
  const containerEl = container.value as HTMLDivElement
  const containerHeight = containerEl.clientHeight
  const containerWidth = containerEl.clientWidth
  const viewPortWidth = window.innerWidth
  const viewPortHeight = window.innerHeight
  if (colResize.value) {
    let width
    const temp = containerWidth - (viewPortWidth - e.clientX)
    if ( temp > minWidth/2 && temp < minWidth ) {
        width = minWidth
    } else if (temp < minWidth/2) {
        width = 0
    } else {
        width = temp
    }
    
    containerEl.style.setProperty('--side_width', width + 'px')
  }

  if (rowResize.value) {
    let height
    const temp = containerHeight - (viewPortHeight - e.clientY)
    if (temp > minHeight/2 && temp < minHeight) {
        height = minHeight
    } else if (temp < minHeight/2) {
        height = 0
    } else if (temp < containerHeight - minHeight/2 && temp > containerHeight - minHeight) {
        height = containerHeight - minHeight
    } else if (temp > containerHeight - minHeight/2){
        height = containerHeight - 5
    } else {
        height = temp
    }
    containerEl.style.setProperty('--top_height', height + 'px')
  }
}

window.addEventListener('resize', () => {
  const containerEl = container.value as HTMLDivElement
  containerEl.style.setProperty('--side_width', '20%')
  containerEl.style.setProperty('--top_height', '50%')
})
</script>

<style>
.draggable-container {
  --side_width: 20%;
  --top_height: 50%;
  --drag_bar_size: 5px;
  display: flex;
  height: 100%;
  width: 100%;
}

.draggable-container .side {
  height: 100%;
  overflow: auto;
  width: var(--side_width);
}

.draggable-container .other-side {
  height: 100%;
  width: calc(100% - var(--drag_bar_size) - var(--side_width));
}

.draggable-container .top {
  height: var(--top_height);
  overflow: auto;
}

.draggable-container .bottom {
  height: calc(100% - var(--top_height) - var(--drag_bar_size));
  overflow: auto;
}

/* drag bar style */
.draggable-container .drag-bar-v,
.draggable-container .drag-bar-h {
  justify-content: center;
  align-items: center;
  align-content: center;
  display: flex;
  position: relative;
  background-color: #ededed;
  transition-duration: 300ms;
  transition-property: background-color;
}

.draggable-container .drag-bar-v {
  writing-mode: tb-rl;
  width: var(--drag_bar_size);
}

.draggable-container .drag-bar-h {
  height: var(--drag_bar_size);
}

.draggable-container .drag-bar-v:hover,
.draggable-container .drag-bar-h:hover {
  cursor: col-resize;
  background-color: rgb(165, 187, 235);
}

.draggable-container .drag-bar-h:hover {
  cursor: row-resize;
}

.draggable-container .drag-bar-v:active,
.draggable-container .drag-bar-h:active {
  background-color: rgb(107, 148, 237);
}

.draggable-container .drag-bar-v:after,
.draggable-container .drag-bar-h:after {
  content: "…";
  position: absolute;
  color: dimgray;
  font-size: 12px;
}

.draggable-container .drag-bar-v:after {
  width: var(--drag_bar_size);
  left: 9px;
}

.draggable-container .drag-bar-h:after {
  height: var(--drag_bar_size);
  bottom: 9px;
}
</style>
