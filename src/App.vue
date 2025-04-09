<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      <RouterView />
    </main>
    <HelloWorld msg="Hello World" />
  </SidebarProvider>
</template>
