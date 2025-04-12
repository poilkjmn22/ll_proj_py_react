const useReq = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const getCsrfToken = () => {
    return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  return async (url: string, options: RequestInit = {}) => {
    const csrfToken = getCsrfToken();
    const token = sessionStorage.getItem('token');

    if (!token && !url.includes('/login')) {
      console.warn('No token found in sessionStorage');
    }
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
      ...(token ? { 'Authorization': `Token ${token}` } : {})
    };

    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

    console.log('Making request to:', fullUrl);
    console.log('With headers:', defaultHeaders);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          token: token ? 'Present' : 'Missing',
        });
      }

      return response;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  };
};

export default useReq;
