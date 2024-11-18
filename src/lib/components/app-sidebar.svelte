<script lang="ts">
  import Calendar from "lucide-svelte/icons/calendar";
  import Book from "lucide-svelte/icons/book";
  import BookOpen from "lucide-svelte/icons/book-open";
  import History from "lucide-svelte/icons/history";
  import Network from "lucide-svelte/icons/network";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { page } from "$app/stores";
  
  // Menu items.
  const items = [
    {
      title: "Project Overview",
      url: "/victory/project-overview",
      icon: Network,
    },
    {
      title: "Norse Allegories",
      url: "/victory/norse-allegories",
      icon: Book,
    },
    {
      title: "Token Runes",
      url: "/victory/token-runes",
      icon: Book,
    },
    {
      title: "Proof of Utility",
      url: "/victory/proof-of-utility",
      icon: BookOpen,
    },
    {
      title: "1551 Renaissance",
      url: "/victory/1551-renaissance",
      icon: History,
    },
  ];
</script>

<style>
  .active {
    color: #ffffff;
    background-color: #ce711e;
    font-weight: 500;
    transition: all 0.3s ease;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  a {
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  a:hover {
    color: #ffffff;
    background-color: #8c450e;
  }
</style>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Pages</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={$page.url.pathname === item.url}>
                {#snippet child({ props })}
                  <a 
                    href={item.url} 
                    class:active={$page.url.pathname === item.url}
                    {...props}
                  >
                    <svelte:component this={item.icon} />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>