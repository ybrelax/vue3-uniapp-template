import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => {
    return {
      name: 'yb'
    };
  },
  getters: {
    getUserInfo(): string {
      return this.name;
    }
  },
  actions: {
    // updateName(name: string) {
    //   this.name = name;
    // }
  }
});
