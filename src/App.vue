<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <div class="flex w-screen h-screen bg-amber-700">
    <div class="w-1/4">
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <RouterView />
        </main>
      </SidebarProvider>
    </div>
    <div class="w-full bg-blue-500">
      <HelloWorld msg="Hello World" />
    </div>
  </div>
</template>
