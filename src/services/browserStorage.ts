const KEY = 'redux';
const browserStorage = {
    loadState: () => {
        try {
          const serializedState = localStorage.getItem(KEY);
          if (!serializedState) return undefined;
          return JSON.parse(serializedState);
        } catch (e) {
          return undefined;
        }
    },
    saveState: (state: any) => {
        try {
          const serializedState = JSON.stringify(state);
          localStorage.setItem(KEY, serializedState);
        } catch (e) {
          // Ignore
          console.error('Failed to save redux store');
        }
    }
}

export default browserStorage;