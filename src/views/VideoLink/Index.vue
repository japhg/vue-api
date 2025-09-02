<script setup lang="ts">
import { ref } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const currentVideo = ref('http://localhost:8000/videos/demo-video-2.mov')
</script>

<template>
    <AppLayout>
        <div class="py-12">
            <div class="max-w-7xl mx-auto md:px-6">
                <div class="bg-white overflow-hidden shadow-md sm:rounded-lg p-5">
                    <h1 class="text-2xl my-5">Video Link</h1>
                    
                    <VideoPlayer :videoUrl="currentVideo" />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
