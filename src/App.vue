<script setup lang="ts">
import AppSidebar from "@/components/layout_comp/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Main from "@/components/layout_comp/main.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
import axios from "axios";
import { nextTick } from "vue";
import { toast } from "vue-sonner";
import Header from "@/components/layout_comp/header.vue";

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
      window.location.reload(); // Reload page after token verification
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
  <div class="bg-white">
    <Header />
    <SidebarProvider>
      <AppSidebar />
      <main class="lg:ml-10">
        <SidebarTrigger />
      </main>
      <Main />
      <Sonner position="top-right" />
    </SidebarProvider>
  </div>
</template>
