<script lang="ts">
  import { page } from '$app/stores';
  
  const navigationLinks = [
    {
      label: "MANA Governance",
      href: "/mana_gov",
    },
    {
      label: "VicTory Exchange",
      href: "/victory",
    },
  ];
</script>

<nav class="border-gray-200 bg-[#ce711e]">
  <div class="mx-auto flex w-full flex-wrap items-center justify-center space-y-4 p-4 px-3 md:px-12">
    <!-- Centered Navigation Links -->
    <div class="block w-full sm:order-last md:block md:w-auto lg:order-none" id="navbar-default">
      <ul class="my-2 flex flex-col items-center space-y-4 font-medium md:flex-row md:space-x-8 md:space-y-0 md:border-0 rtl:space-x-reverse">
        {#each navigationLinks as link}
          <li>
            <a 
              href={link.href}
              class="whitespace-nowrap rounded-md p-3 py-2 font-bold capitalize text-white hover:bg-yellow-800 {$page.url.pathname.startsWith(link.href) ? 'bg-yellow-800' : ''}"
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>
