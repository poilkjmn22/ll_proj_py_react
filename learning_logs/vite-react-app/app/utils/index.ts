   const getCookie = (name: string): string => {
       const value = `; ${document.cookie}`;
       const parts = value.split(`; ${name}=`);
       if (parts.length > 1) {
           return parts.pop()?.split(';').shift() || '';
       }
       return '';
   };

   export {
    getCookie
   }