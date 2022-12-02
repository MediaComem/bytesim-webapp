const KEY = 'redux';
const browserStorage = {
    loadState: (projectKey: string) => {
        try {
          const serializedState = localStorage.getItem(KEY);
          if (!serializedState) return undefined;
          const projects = JSON.parse(serializedState);
          return projects[projectKey];
        } catch (e) {
          return undefined;
        }
    },
    saveState: (state: any, projectKey: string) => {
        try {
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