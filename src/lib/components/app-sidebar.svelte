<script lang="ts">
  import Calendar from "lucide-svelte/icons/calendar";
  import Book from "lucide-svelte/icons/book";
  import BookOpen from "lucide-svelte/icons/book-open";
  import History from "lucide-svelte/icons/history";
  import Network from "lucide-svelte/icons/network";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  
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

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
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