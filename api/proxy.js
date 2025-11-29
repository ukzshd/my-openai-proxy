export const config = {
  runtime: 'edge', // 必须使用 edge runtime 以支持流式传输
};

export default async function handler(req) {
  // 解析请求的 URL
  const url = new URL(req.url);

  // 如果访问的是根目录，简单返回一个提示，防止报错
  if (url.pathname === '/') {
    return new Response('Proxy is running.', { status: 200 });
  }

  // 将目标主机名改为 OpenAI 的 API 地址
  url.host = 'api.openai.com';
  url.protocol = 'https:';
  // Vercel 有时会使用 http，这里强制指定 https
  
  // 创建新的请求，并复用原始请求的 method, headers, body
  const newRequest = new Request(url, {
    headers: req.headers,
    method: req.method,
    body: req.body,
    redirect: 'follow',
  });

  // 发起请求并直接返回 OpenAI 的响应
  try {
    const response = await fetch(newRequest);
    return response;
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}