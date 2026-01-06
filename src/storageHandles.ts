  export const handleSetStoredValue = (key: string, value: number) => {
    localStorage.setItem(key, value.toString());
  }

  export const handleSetStoredCategory = (key: string, value: string) => {
    localStorage.setItem(key, value);
  }

  export const handleGetStoredCategory = (key: string): string => {
    const storedCategory = localStorage.getItem(key);
    if(!storedCategory) return "";
    return storedCategory ? storedCategory : "";
  }

  export const handleGetStoredValue = (key: string): number => {
    const storedValue = localStorage.getItem(key);
    //if(!storedValue) return 0;
    return storedValue ? Number(storedValue) : 0;
  }

  export const handleRemoveStoredValue = (key: string) => {
    
    localStorage.removeItem(key);
  }

  export const handleRemoveStoredCategory = (key: string) => {
    localStorage.removeItem(key);
  }