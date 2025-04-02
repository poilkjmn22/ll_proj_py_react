const useReq = (origin = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') => {
    return (url: string, ...args: any[]) => fetch(`${origin}${url}`, ...args)
}

export default useReq;
