<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Main from "@/components/main.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
import axios from "axios";
import { nextTick } from "vue";
import { toast } from "vue-sonner";

// Check for token in localStorage as fallback
const token = localStorage.getItem("token");

const verifyToken = async () => {
  try {
    if (!token) {
      // alert("No token found");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
        key: "Y_yVXF1dE0_hrt_U_zEpSw",
      });

      toast.success("Token verified", {
        duration: 2000,
        position: "top-right",
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
    } else if (token) {
      // alert("Token found");
      await nextTick();
      toast.info("Token found", {
        duration: 2000,
        position: "top-right",
      });
    }
  } catch (error) {
    toast.error("Token verification failed", {
      duration: 2000,
      position: "top-right",
    });
    console.error("Token verification failed:", error);
  }
};

verifyToken();
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
    </main>
    <div class="flex flex-col gap-4"></div>
    <Main />
    <Sonner position="top-right" />
  </SidebarProvider>
</template>
