const KEY = 'redux';
const browserStorage = {
    loadState: () => {
        try {
          const url = window.location.href;
          const projectKey = url.match(/key=([^&]*)/)?.[1];
          if (!projectKey) {
            return;
          }
          const serializedState = localStorage.getItem(KEY);
          if (!serializedState) return undefined;
          const projects = JSON.parse(serializedState);
          return projects[projectKey];
        } catch (e) {
          return undefined;
        }
    },
    saveState: (state: any) => {
        try {
          const url = window.location.href;
          const projectKey = url.match(/key=([^&]*)/)?.[1];
          if (!projectKey) {
            return;
          }
          let bytesimProjects = {} as any;
          const serializedState = localStorage.getItem(KEY);
          if (serializedState) {
            bytesimProjects = JSON.parse(serializedState);
          };
          bytesimProjects[projectKey] = state;
          localStorage.setItem(KEY, JSON.stringify(bytesimProjects));
        } catch (e) {
          // Ignore
          console.error('Failed to save redux store');
        }
    }
}

export default browserStorage;