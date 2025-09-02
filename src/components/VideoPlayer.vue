<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps<{
    videoUrl: String
}>()

const videoRef = ref('')
let player = null

const initPlayer = () => {
    if (player) {
        player.src({ type: 'video/mp4', src: props.videoUrl })
        player.load()
        player.play()
    } else {
        player = videojs(videoRef.value, {
            autoplay: false,
            controls: true,
            sources: [{ src: props.videoUrl, type: 'video/mp4' }],
        })
    }
}

onMounted(() => {
    initPlayer()
})

watch(
    () => props.videoUrl,
    () => {
        initPlayer()
    },
)

onBeforeUnmount(() => {
    if (player) {
        player.dispose()
    }
})
</script>

<template>
    <video
        ref="videoRef"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        width="640"
        height="360"
    ></video>
</template>
