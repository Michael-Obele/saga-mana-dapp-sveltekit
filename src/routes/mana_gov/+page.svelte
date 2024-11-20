<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ProposalList from './components/ProposalList.svelte';
	import ProjectList from './components/ProjectList.svelte';
	import Modal from './components/Modal.svelte';
	import AssignedTasks from './components/AssignedTasks.svelte';

	let proposals: any[] = [];
	let projects: any[] = [];
	let tasks: any[] = [];
	let loading = true;
	let error: string | null = null;
	let isProjectPlanModalOpen = false;
	let isProjectExecutionModalOpen = false;

	onMount(async () => {
		try {
			loading = true;
			// Add your data fetching logic here
			// For example:
			// projects = await fetchProjects();
			// proposals = await fetchProposals();
			// tasks = await fetchTasks();
			console.log('fetching data');
		} catch (err) {
			// Handle the error
			if (err instanceof Error) {
				error = err.message;
				console.warn(error);
			}
		} finally {
			loading = false;
		}
	});

	function handleCreateProjectExecutionClick() {
		if (projects.length === 0) {
			isProjectExecutionModalOpen = true;
			setTimeout(() => {
				isProjectExecutionModalOpen = false;
			}, 2000);
		} else {
			goto('/mana_gov/create-project-execution');
		}
	}

	function closeProjectPlanModal() {
		isProjectPlanModalOpen = false;
	}

	function closeProjectExecutionModal() {
		isProjectExecutionModalOpen = false;
	}
</script>

<section class="min-h-screen bg-[#270927] py-20 text-white">
	<section class="container mx-auto px-4" id="proposals">
		<div class="mb-8 flex flex-row items-center justify-between">
			<h2 class="text-3xl font-bold text-[#ce711e]">Proposals</h2>
			<a
				href="/mana_gov/create-proposal"
				class="rounded-md bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
			>
				Create New Proposal
			</a>
		</div>
		<ProposalList />
	</section>

	<section class="container mx-auto my-16 px-4" id="projects">
		<div class="mb-8 flex flex-row items-center justify-between">
			<h2 class="text-3xl font-bold text-[#ce711e]">Projects</h2>
			<a
				href="/mana_gov/create-project"
				class="rounded-md bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
			>
				Develop a Project Plan
			</a>
		</div>
		<ProjectList />
	</section>

	<section class="tasks container mx-auto px-4" id="tasks">
		<div class="mb-8 flex flex-row items-center justify-between">
			<h2 class="text-3xl font-bold text-[#ce711e]">Assigned Tasks</h2>
			<button
				class="rounded-md bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
				on:click={handleCreateProjectExecutionClick}
			>
				Execute Project Tasks
			</button>
		</div>
		<!-- {#if tasks.length === 0}
                <p>No tasks assigned to you. Check back later for new tasks!</p>
            {:else}
                <AssignedTasks {tasks} />
            {/if} -->
	</section>

	<!-- {#if isProjectPlanModalOpen}
            <Modal 
                closeModal={closeProjectPlanModal}
                message="No approved and active proposals available. You cannot create a project plan without an approved proposal."
            />
        {/if} -->

	<!-- {#if isProjectExecutionModalOpen}
            <Modal 
                closeModal={closeProjectExecutionModal}
                message="No project plans available. You cannot create a project execution without an active project plan."
            />
        {/if} -->
</section>

<style>
	:global(body) {
		background-color: #270927;
	}
</style>
