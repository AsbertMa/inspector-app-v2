<template>
  <div @mousemove="onMousemove" ref="container" class="draggable-container">
    <div ref="side" class="side"></div>
    <div
      @mousedown="onMousedown(true)"
      @mouseup="onMouseup(true)"
      class="drag-bar-v"
    ></div>
    <div class="other-side">
      <div class="top"></div>
      <div
        @mousedown="onMousedown(false)"
        @mouseup="onMouseup(false)"
        class="drag-bar-h"
      ></div>
      <div class="bottom"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const container = ref()
const side = ref()
let colResize = ref(false)
let rowResize = ref(false)
const onMousedown = (isCol: boolean) => {
  if (isCol) {
    colResize.value = true
  } else {
    rowResize.value = true
  }
}
const onMouseup = (isCol: boolean) => {
  if (isCol) {
    colResize.value = false
  } else {
    rowResize.value = false
  }
}

const onMousemove = (e: MouseEvent) => {
  const containerEl = container.value as HTMLDivElement
  if (colResize.value) {
    containerEl.style.setProperty('--side_width', e.clientX + 'px')
  }

  if (rowResize.value) {
    containerEl.style.setProperty('--top_height', e.clientY + 'px')
  }
}
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
  width: var(--side_width);
}

.draggable-container .other-side {
  height: 100%;
  width: calc(100% - var(--drag_bar_size) - var(--side_width));
}

.draggable-container .top {
  height: var(--top_height);
}

.draggable-container .bottom {
  height: calc(100% - var(--top_height) - var(--drag_bar_size));
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
