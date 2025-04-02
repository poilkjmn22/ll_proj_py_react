const useReq = (origin = import.meta.env.VITE_API_URL || '') => {
    return (url: string, ...args: any[]) => fetch(`${origin}${url}`, ...args)
}

export default useReq;
