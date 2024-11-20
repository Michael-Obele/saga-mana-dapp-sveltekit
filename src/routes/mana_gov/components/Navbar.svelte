<script lang="ts">
    let show = false;

    const navigationLinks = [
        {
            label: "Proposal Management",
            href: "/proposal-management",
        },
        {
            label: "Project Planning",
            href: "/project-planning",
        },
        {
            label: "Task Tracking",
            href: "/task-tracking",
        },
        {
            label: "Voting",
            href: "/mana_gov/voting",
        },
        {
            label: "Reports",
            href: "/reports",
        },
    ];

    function toggleShow() {
        show = !show;
    }
</script>

<nav class="border-gray-200 bg-[#ce711e]">
    <div class="mx-auto flex w-full flex-wrap items-center justify-center space-y-0 p-2 md:px-12">
        <!-- Burger Menu Button for small screens -->
        <button
            data-collapse-toggle="navbar-default"
            type="button"
            on:click={toggleShow}
            class="order-3 mx-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-700 p-1 text-sm text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:order-none md:hidden"
        >
            <span class="sr-only">Open main menu</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </button>

        <!-- Centered Navigation Links -->
        <div
            class="{show ? 'order-last' : 'hidden'} w-full md:block sm:order-last lg:order-none md:w-auto"
            id="navbar-default"
        >
            <ul class="my-0 flex flex-col items-center font-medium md:flex-row md:space-x-8 md:border-0 rtl:space-x-reverse">
                {#each navigationLinks as link (link.label)}
                    <li>
                        <a
                            href={link.href}
                            class="whitespace-nowrap rounded-md px-2 py-1 font-bold capitalize text-white hover:bg-yellow-800"
                        >
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>
