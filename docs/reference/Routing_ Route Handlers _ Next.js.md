---
title: Routing: Route Handlers | Next.js
source: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
---


Route Handlers
==============

Route Handlers allow you to create custom request handlers for a given route using the Web [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs.

![Image 15: Route.js Special File](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Froute-special-file.png&w=3840&q=75)![Image 16: Route.js Special File](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Froute-special-file.png&w=3840&q=75)

> **Good to know**: Route Handlers are only available inside the `app` directory. They are the equivalent of [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) inside the `pages` directory meaning you **do not** need to use API Routes and Route Handlers together.

[Convention](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#convention)
-----------------------------------------------------------------------------------------------------

Route Handlers are defined in a [`route.js|ts` file](https://nextjs.org/docs/app/api-reference/file-conventions/route) inside the `app` directory:

app/api/route.ts

TypeScript

```
export async function GET(request: Request) {}
```

Route Handlers can be nested anywhere inside the `app` directory, similar to `page.js` and `layout.js`. But there **cannot** be a `route.js` file at the same route segment level as `page.js`.

### [Supported HTTP Methods](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods)

The following [HTTP methods](https://developer.mozilla.org/docs/Web/HTTP/Methods) are supported: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. If an unsupported method is called, Next.js will return a `405 Method Not Allowed` response.

### [Extended `NextRequest` and `NextResponse` APIs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#extended-nextrequest-and-nextresponse-apis)

In addition to supporting the native [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs, Next.js extends them with [`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request) and [`NextResponse`](https://nextjs.org/docs/app/api-reference/functions/next-response) to provide convenient helpers for advanced use cases.

[Behavior](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#behavior)
-------------------------------------------------------------------------------------------------

### [Caching](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#caching)

Route Handlers are not cached by default. You can, however, opt into caching for `GET` methods. Other supported HTTP methods are **not** cached. To cache a `GET` method, use a [route config option](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic) such as `export const dynamic = 'force-static'` in your Route Handler file.

app/items/route.ts

TypeScript

```
export const dynamic = 'force-static'
 
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
```

> **Good to know**: Other supported HTTP methods are **not** cached, even if they are placed alongside a `GET` method that is cached, in the same file.

### [Special Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#special-route-handlers)

Special Route Handlers like [`sitemap.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [`opengraph-image.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), and [`icon.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons), and other [metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) remain static by default unless they use Dynamic APIs or dynamic config options.

### [Route Resolution](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#route-resolution)

You can consider a `route` the lowest level routing primitive.

*   They **do not** participate in layouts or client-side navigations like `page`.
*   There **cannot** be a `route.js` file at the same route as `page.js`.

| Page | Route | Result |
| --- | --- | --- |
| `app/page.js` | `app/route.js` | Conflict |
| `app/page.js` | `app/api/route.js` | Valid |
| `app/[user]/page.js` | `app/api/route.js` | Valid |

Each `route.js` or `page.js` file takes over all HTTP verbs for that route.

app/page.ts

TypeScript

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
 
// ❌ Conflict
// `app/route.ts`
export async function POST(request: Request) {}
```

[Examples](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#examples)
-------------------------------------------------------------------------------------------------

The following examples show how to combine Route Handlers with other Next.js APIs and features.

### [Revalidating Cached Data](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#revalidating-cached-data)

You can [revalidate cached data](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) using Incremental Static Regeneration (ISR):

app/posts/route.ts

TypeScript

```
export const revalidate = 60
 
export async function GET() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
 
  return Response.json(posts)
}
```

### [Cookies](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies)

You can read or set cookies with [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) from `next/headers`. This server function can be called directly in a Route Handler, or nested inside of another function.

Alternatively, you can return a new `Response` using the [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header.

app/api/route.ts

TypeScript

```
import { cookies } from 'next/headers'
 
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

You can also use the underlying Web APIs to read cookies from the request ([`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request)):

app/api/route.ts

TypeScript

```
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```

### [Headers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#headers)

You can read headers with [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers) from `next/headers`. This server function can be called directly in a Route Handler, or nested inside of another function.

This `headers` instance is read-only. To set headers, you need to return a new `Response` with new `headers`.

app/api/route.ts

TypeScript

```
import { headers } from 'next/headers'
 
export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

You can also use the underlying Web APIs to read headers from the request ([`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request)):

app/api/route.ts

TypeScript

```
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
}
```

### [Redirects](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#redirects)

app/api/route.ts

TypeScript

```
import { redirect } from 'next/navigation'
 
export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

### [Dynamic Route Segments](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments)

Route Handlers can use [Dynamic Segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) to create request handlers from dynamic data.

app/items/\[slug\]/route.ts

TypeScript

```
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug // 'a', 'b', or 'c'
}
```

| Route | Example URL | `params` |
| --- | --- | --- |
| `app/items/[slug]/route.js` | `/items/a` | `Promise<{ slug: 'a' }>` |
| `app/items/[slug]/route.js` | `/items/b` | `Promise<{ slug: 'b' }>` |
| `app/items/[slug]/route.js` | `/items/c` | `Promise<{ slug: 'c' }>` |

### [URL Query Parameters](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters)

The request object passed to the Route Handler is a `NextRequest` instance, which has [some additional convenience methods](https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl), including for more easily handling query parameters.

app/api/search/route.ts

TypeScript

```
import { type NextRequest } from 'next/server'
 
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```

### [Streaming](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)

Streaming is commonly used in combination with Large Language Models (LLMs), such as OpenAI, for AI-generated content. Learn more about the [AI SDK](https://sdk.vercel.ai/docs/introduction).

app/api/chat/route.ts

TypeScript

```
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'
 
export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })
 
  return new StreamingTextResponse(result.toAIStream())
}
```

These abstractions use the Web APIs to create a stream. You can also use the underlying Web APIs directly.

app/api/route.ts

TypeScript

```
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
 
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
 
const encoder = new TextEncoder()
 
async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}
 
export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
 
  return new Response(stream)
}
```

### [Request Body](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body)

You can read the `Request` body using the standard Web API methods:

app/items/route.ts

TypeScript

```
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

### [Request Body FormData](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body-formdata)

You can read the `FormData` using the `request.formData()` function:

app/items/route.ts

TypeScript

```
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

Since `formData` data are all strings, you may want to use [`zod-form-data`](https://www.npmjs.com/zod-form-data) to validate the request and retrieve data in the format you prefer (e.g. `number`).

### [CORS](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors)

You can set CORS headers for a specific Route Handler using the standard Web API methods:

app/api/route.ts

TypeScript

```
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

> **Good to know**:
> 
> *   To add CORS headers to multiple Route Handlers, you can use [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware#cors) or the [`next.config.js` file](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#cors).
> *   Alternatively, see our [CORS example](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts) package.

### [Webhooks](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#webhooks)

You can use a Route Handler to receive webhooks from third-party services:

app/api/route.ts

TypeScript

```
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }
 
  return new Response('Success!', {
    status: 200,
  })
}
```

Notably, unlike API Routes with the Pages Router, you do not need to use `bodyParser` to use any additional configuration.

### [Non-UI Responses](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#non-ui-responses)

You can use Route Handlers to return non-UI content. Note that [`sitemap.xml`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts), [`robots.txt`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file), [`app icons`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx), and [open graph images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) all have built-in support.

app/rss.xml/route.ts

TypeScript

```
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

### [Segment Config Options](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#segment-config-options)

Route Handlers use the same [route segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) as pages and layouts.

app/items/route.ts

TypeScript 

```
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

See the [API reference](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) for more details.

API Reference
-------------

Learn more about the route.js file.

[### route.js API reference for the route.js special file.](https://nextjs.org/docs/app/api-reference/file-conventions/route)

[Previous Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)

[Next Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

Was this helpful?

supported.

Send

[](https://vercel.com/home?utm_source=next-site&utm_medium=footer&utm_campaign=next-website "Go to the Vercel website")

[![Image 17: GitHub Logo](https://nextjs.org/icons/github.svg)](https://github.com/vercel/next.js)

* * *

[![Image 18: X Logo](https://nextjs.org/icons/x.svg)](https://twitter.com/nextjs)

* * *

[![Image 19: Bluesky Logo](https://nextjs.org/icons/bluesky.svg)](https://bsky.app/profile/nextjs.org)

#### Resources

[Docs](https://nextjs.org/docs)[Learn](https://nextjs.org/learn)[Showcase](https://nextjs.org/showcase)[Blog](https://nextjs.org/blog)[Team](https://nextjs.org/team)[Analytics](https://vercel.com/analytics?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)[Next.js Conf](https://nextjs.org/conf)[Previews](https://vercel.com/products/previews?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)

#### More

[Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)[Contact Sales](https://vercel.com/contact/sales?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)[GitHub](https://github.com/vercel/next.js)[Releases](https://github.com/vercel/next.js/releases)[Telemetry](https://nextjs.org/telemetry)[Governance](https://nextjs.org/governance)

#### About Vercel

[Next.js + Vercel](https://vercel.com/solutions/nextjs?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)[Open Source Software](https://vercel.com/oss?utm_source=next-site&utm_medium=footer&utm_campaign=docs_app_building-your-application_routing_route-handlers)[GitHub](https://github.com/vercel)[Bluesky](https://bsky.app/profile/vercel.com)[X](https://twitter.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)Cookie Preferences

#### Subscribe to our newsletter

Stay updated on new releases and features, guides, and case studies.

Subscribe

© 2025 Vercel, Inc.

[![Image 20: GitHub Logo](https://nextjs.org/icons/github.svg)](https://github.com/vercel/next.js)

* * *

[![Image 21: X Logo](https://nextjs.org/icons/x.svg)](https://x.com/nextjs)

* * *

[![Image 22: Bluesky Logo](https://nextjs.org/icons/bluesky.svg)](https://bsky.app/profile/nextjs.org)
