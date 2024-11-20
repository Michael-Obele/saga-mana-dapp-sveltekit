import { writable } from 'svelte/store';

interface AuthState {
  session: boolean;
  username: string;
}

export const authStore = writable<AuthState>({
  session: false,
  username: ''
});
