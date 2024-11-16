<!-- src/routes/mana_gov/+layout.svelte -->
<script lang="ts">
  import './globals.css';
  import Navbar from './components/Navbar.svelte';
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>
