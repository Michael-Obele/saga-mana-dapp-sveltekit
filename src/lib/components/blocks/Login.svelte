<script lang="ts">
  import { signUp, logIn } from '$lib/actions';
  import { LogIn } from 'lucide-svelte';
  
  let showDialog = false;
  let activeTab = 'login';
  let errorMessage = '';
  let password = '';
  let confirmPassword = '';
  
  function validatePasswords() {
    return password === confirmPassword && password !== '';
  }
  
  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await logIn(formData);
    
    if (result.success) {
      password = '';
      errorMessage = 'Logged in successfully! Holding on...';
      setTimeout(() => {
        errorMessage = '...refreshing!';
        window.location.reload();
      }, 3000);
    } else if (result.message) {
      errorMessage = result.message;
      setTimeout(() => {
        errorMessage = '';
      }, 8000);
    }
  }
  
  async function handleRegister(event: SubmitEvent) {
    event.preventDefault();
    if (!validatePasswords()) {
      errorMessage = "Passwords don't match!";
      return;
    }
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const result = await signUp(formData);
    
    if (result.success) {
      confirmPassword = '';
      password = '';
      errorMessage = 'User registered successfully!';
      setTimeout(() => {
        errorMessage = '';
      }, 3000);
    } else if (result.message) {
      errorMessage = result.message;
      setTimeout(() => {
        errorMessage = '';
      }, 8000);
    }
  }
</script>

<div>
  <!-- Dialog Trigger -->
  <button 
    on:click={() => showDialog = true}
    class="flex items-center bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
  >
    Login
    <LogIn class="ml-2 h-5 w-5" />
  </button>
  
  <!-- Dialog Content -->
  {#if showDialog}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-fit rounded-md border border-yellow-400 bg-[#270927] p-6 text-white shadow-lg">
        <div class="mb-4 text-center">
          <h2 class="text-xl font-bold">Login / Register</h2>
          
          <!-- Tabs -->
          <div class="mt-4">
            <div class="grid w-[400px] grid-cols-2 gap-2 rounded-lg bg-gray-800 p-1">
              <button
                class="rounded-md px-4 py-2 {activeTab === 'login' ? 'bg-[#ce711e]' : ''}"
                on:click={() => activeTab = 'login'}
              >
                Login
              </button>
              <button
                class="rounded-md px-4 py-2 {activeTab === 'register' ? 'bg-[#ce711e]' : ''}"
                on:click={() => activeTab = 'register'}
              >
                Register
              </button>
            </div>
            
            <!-- Login Tab -->
            {#if activeTab === 'login'}
              <div class="mt-4">
                <h3 class="text-lg font-bold">Login</h3>
                <p class="text-sm text-gray-400">Login to your account here.</p>
                
                <form on:submit|preventDefault={handleLogin} class="mt-4 space-y-4">
                  <div class="space-y-1">
                    <label for="username">Username</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="username"
                      id="username"
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="password">Password</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="password"
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  {#if errorMessage}
                    <p class="text-yellow-900">{errorMessage}</p>
                  {/if}
                  <button
                    type="submit"
                    class="w-full rounded-md bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
                  >
                    Login
                  </button>
                </form>
              </div>
            {/if}
            
            <!-- Register Tab -->
            {#if activeTab === 'register'}
              <div class="mt-4">
                <h3 class="text-lg font-bold">Register</h3>
                <p class="text-sm text-gray-400">Register your account here. After saving, you can log in on the other tab.</p>
                
                <form on:submit|preventDefault={handleRegister} class="mt-4 space-y-4">
                  <div class="space-y-1">
                    <label for="email">Email</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="username">Username</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="username"
                      id="username"
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="password">Password</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="password"
                      id="password"
                      type="password"
                      bind:value={password}
                      required
                    />
                  </div>
                  <div class="space-y-1">
                    <label for="confirm-password">Confirm Password</label>
                    <input
                      class="w-full rounded-md bg-white px-3 py-2 text-black"
                      name="confirm-password"
                      id="confirm-password"
                      type="password"
                      bind:value={confirmPassword}
                      required
                    />
                  </div>
                  {#if errorMessage}
                    <p class="text-yellow-900">{errorMessage}</p>
                  {/if}
                  <button
                    type="submit"
                    class="w-full rounded-md bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]"
                    disabled={!validatePasswords()}
                  >
                    Register
                  </button>
                </form>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Close Button -->
        <button
          class="absolute right-4 top-4 text-gray-400 hover:text-white"
          on:click={() => showDialog = false}
        >
          ✕
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Add any component-specific styles here */
</style>
