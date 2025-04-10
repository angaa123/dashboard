<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Main from "@/components/main.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
    </main>

    <Main />
    <Sonner position="top-right" />
  </SidebarProvider>
</template>
