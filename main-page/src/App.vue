<template>
  <div class="grid-container">
    <!-- <div class="cursor rounded"></div> -->

    <div
      class="grid-item"
      v-for="(item, index) in gridItems"
      :key="index"
      @mouseenter="mouseenter($event)"
      @mouseleave="mouseleave($event)"
      v-on:click="handleClick(item)"
    >
      <div v-if="item.type === 'empty'" class="empty-box"></div>
      <div v-else class="project-item">
        <!-- <a :href="item.link" target="_blank" class="project-link">
          <span class="project-name">{{ item.name }}</span>
        </a> -->
        <div class="project-abbr">
          {{ item.abbr }}
        </div>
        <div class="project-name">
          {{ item.name }}
        </div>
        <div class="project-category">
          {{ item.category }}
        </div>
        <div class="project-year">
          {{ item.year }}
        </div>
      </div>
      <!-- <div>{{ item.type }}</div> -->
    </div>

    <div id="welcome">
      <span class="welcome-hi">Hi</span>
      <span class="welcome-desc">我是Minghao</span>
      <span class="welcome-desc">一名程序员</span>
      <span class="sub-emoji">👋</span>
    </div>
  </div>
</template>

<script>
import projects_json from "./projects.json"
import anime from "animejs/lib/anime.es.js"

export default {
  mounted() {
    this.initCustomizeCursor()
    this.initCustomizeScroll()
    this.initGridItems()

    if (!this.hasShownAnimation()) {
      this.expandFromCenter()
      this.aimAtCenter(true)
      this.setHasShownAnimation()
      //加提示
    } else {
      this.aimAtCenter(false)
    }
  },
  data() {
    return {
      gridItems: [],
      isScrolling: false
    }
  },
  methods: {
    handleClick(item) {
      if(this.isScrolling){
        console.log(1)
        return
      }
      if (item.type !== "empty" && item.href) {
        window.open(item.href, "_blank")
      }
    },
    initCustomizeCursor() {
      const cursor = document.createElement("div")

      const shouldDisplayHint = sessionStorage.getItem("shouldDisplayHint") !== "false"

      if (shouldDisplayHint) {
        const hintElement = document.createElement("span")
        hintElement.textContent = "按住以移动视角"
        hintElement.classList.add("hint")
        cursor.appendChild(hintElement)
        anime({
          targets: hintElement,
          opacity: [1, 0],
          delay: 5000,
        })
        sessionStorage.setItem("shouldDisplayHint", "false")
      }

      cursor.classList.add("custom-cursor")
      document.body.appendChild(cursor)

      document.addEventListener("mousemove", (event) => {
        cursor.style.left = `${event.clientX - 20}px`
        cursor.style.top = `${event.clientY - 20}px`
      })

      document.addEventListener("mousedown", () => {
        cursor.classList.add("click")
      })

      document.addEventListener("mouseup", () => {
        cursor.classList.remove("click")
      })
    },
    initCustomizeScroll() {
      // 禁用浏览器默认的滚动行为
      window.addEventListener(
        "wheel",
        (event) => {
          event.preventDefault()
          window.scrollBy({
            left: event.deltaX,
            top: event.deltaY,
            behavior: "smooth",
          })
        },
        { passive: false },
      )

      // 鼠标拖动滚动
      let startX = 0
      let startY = 0

      document.addEventListener("mousedown", (e) => {
        this.isScrolling = true
        startX = e.clientX
        startY = e.clientY
      })

      document.addEventListener("mousemove", (e) => {
        if (!this.isScrolling) return
        e.preventDefault()
        window.scrollBy(startX - e.clientX, startY - e.clientY)
        startX = e.clientX
        startY = e.clientY
      })

      document.addEventListener("mouseup", () => {
        this.isScrolling = false
      })
    },
    mouseenter(e) {
      anime({
        targets: e.currentTarget,
        scale: 0.95,
      })
    },
    mouseleave(e) {
      anime({
        targets: e.currentTarget,
        scale: 1,
      })
    },
    hasShownAnimation() {
      return sessionStorage.getItem("hasShownAnimation") === "true"
    },
    setHasShownAnimation() {
      sessionStorage.setItem("hasShownAnimation", "true")
    },
    initGridItems() {
      for (let y = 0; y < 31; y++) {
        for (let x = 0; x < 31; x++) {
          const project = projects_json.projects.find((p) => p.x === x + 1 && p.y === y + 1)
          if (project) {
            this.gridItems.push({
              type: "project",
              name: project.name,
              href: project.href,
              abbr: project.abbr,
              year: project.year,
              category: project.category,
            })
          } else {
            this.gridItems.push({
              type: "empty",
            })
          }
        }
      }
    },
    aimAtCenter(instant) {
      // aim at center tile
      const maxX = document.documentElement.scrollWidth - document.documentElement.clientWidth
      const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const centerX = maxX / 2
      const centerY = maxY / 2
      // window.scrollTo(centerX, centerY)
      window.scrollTo({
        top: centerY,
        left: centerX,
        // 移动端有bug
        behavior: instant ? "instant" : "smooth",
      })
    },
    expandFromCenter() {
      this.$nextTick(() => {
        const gridItems = this.$el.querySelectorAll(".grid-item")
        const center = this.$el.querySelectorAll("#welcome")
        anime({
          targets: center,
          opacity: [
            { value: 0, duration: 0 }, // 初始 opacity 为 0
            { value: 1, duration: 2000 }, // 1 秒内从 0 变到 1
          ],
          easing: "linear",
        })

        anime({
          targets: gridItems,
          scale: [{ value: 0, easing: "easeOutSine", duration: 0 }],
        })
        anime({
          targets: gridItems,
          scale: [
            { value: 0, easing: "easeOutSine", duration: 0 },
            { value: 1, easing: "easeInOutExpo", duration: 1000 },
          ],
          delay: anime.stagger(200, {
            grid: [31, 31],
            from: "center",
            start: 2000,
          }),
          easing: "easeInOutExpo",
        })
      })
    },
  },
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
body {
  /* touch-action: none; */
  margin: 0;
  background-color: #222831;
  /* width: 6600px;
  height: 6400px; */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  cursor: none;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(31, 1fr);
  grid-template-rows: repeat(31, 1fr);
  /* grid-gap: 1px; */
  width: 6510px;
  height: 6510px;
}

.grid-row {
  display: contents;
}

.grid-item {
  background-color: #31363f;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 5px;
}
.project-item {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 200px;
  color: #fbf4ea;
  font-family: "Avenir Black", sans-serif;
  background-color: #31363f;
  font-weight: bold;
}
.project-abbr {
  margin: 0;
  line-height: 1;
  padding: 8px;
  font-size: 100px;
  margin-bottom: 25px;
}
.project-name,
.project-category {
  padding: 0 16px;
}
.project-year {
  text-align: right;
  position: absolute;
  top: 148px;
  left: 146px;
  font-size: 35px;
}

#welcome {
  position: absolute;
  left: 3155px;
  top: 3155px;
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 200px;
  color: #fbf4ea;
  font-family: "Avenir Black", sans-serif;
  background-color: #31363f;
  font-weight: bold;
  border: 1px solid gray;
}
.welcome-hi {
  font-size: 100px;
  margin: 0;
  line-height: 1;
  height: 80%;
  padding: 8px 8px 34px 8px;
}
.welcome-desc {
  font-size: 16px;
  height: 20%;
  margin-left: 16px;
}
.sub-emoji {
  text-align: right;
  position: relative;
  top: -49px;
  left: -14px;
  font-size: 40px;
}

.custom-cursor {
  cursor: none;
  pointer-events: none;
  position: fixed;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  z-index: 9999;
  transition: transform 0.1s ease-in-out;
}

.custom-cursor.click {
  transform: scale(0.8);
}
.hint {
  position: relative;
  top: 8px;
  left: 50px;
  width: 200px;
  display: block;
  font-family: "Avenir Black", sans-serif;
  color: #fbf4ea;
  z-index: 999999;
}
/* 移动端隐藏 */
@media (max-width: 767px) {
  .rounded {
    display: none;
  }
}
</style>