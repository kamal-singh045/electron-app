interface IValues {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: FormData | Record<string, unknown>;
}

async function fetchApi<T>(values: IValues): Promise<T> {
  const accessToken = localStorage.getItem('accessToken');
  const response = await fetch(values.url, {
    method: values.method,
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : ''
    },
    ...(values.body ? { body: values.body instanceof FormData ? values.body : JSON.stringify(values.body) } : {})
  });
  const data = await response.json();
  return data;
}

export default fetchApi;
