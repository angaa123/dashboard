<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import HelloWorld from "@/components/HelloWorld.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      <RouterView />
    </main>
    <HelloWorld msg="Hello World" />
    <Sonner position="top-right" />
  </SidebarProvider>
</template>
