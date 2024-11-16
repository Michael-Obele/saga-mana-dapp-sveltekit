<!-- src/routes/mana_gov/components/Navbar.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  
  const navItems = [
    { href: '/mana_gov', label: 'Dashboard' },
    { href: '/mana_gov/create-proposal', label: 'Create Proposal' },
    { href: '/mana_gov/view-proposal', label: 'View Proposals' },
    { href: '/mana_gov/voting', label: 'Voting' },
    { href: '/mana_gov/create-project', label: 'Create Project' }
  ];
</script>

<nav class="bg-white shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="flex space-x-4">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-3 py-2 rounded-md text-sm font-medium
            {$page.url.pathname === item.href
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'}"
          >
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
