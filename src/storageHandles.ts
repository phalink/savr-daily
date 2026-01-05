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



  /*
  export const handleGetAllCountValues = (count: number): string => {
    let valuesList = "";

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('expenseAmount')) {
        const value = localStorage.getItem(key);
        if (value) {
          valuesList += `${value}, `;
        }
      }
    }
    return valuesList;
  }*/