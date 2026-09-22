const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function fetchWithRetry(
   url: string,
   options = {},
   retries = 3,
   backoffMs = 1000
) {
   try {
      const response = await fetch(url, options);

      // If the server returns a 429 Too Many Requests error
      if (response.status === 429) {
         if (retries === 0) {
            throw new Error('Max retries reached. API rate limit exceeded.');
         }

         // 1. Check for the standard 'Retry-After' header
         const retryAfter = response.headers.get('retry-after');
         let waitTime = backoffMs;

         if (retryAfter) {
            // If it's a number (seconds), convert to milliseconds.
            // If it's an HTTP date string, calculate the delta.
            // @ts-expect-error: that's why it checks...
            waitTime = isNaN(retryAfter)
               ? //@ts-expect-error: pretty sure this is valid but we'll see
                 Math.max(0, new Date(retryAfter) - new Date())
               : parseFloat(retryAfter) * 1000;
         } else {
            // 2. Fallback to exponential backoff if no header is present
            backoffMs *= 2;
         }

         console.warn(
            `Rate limited (429). Retrying in ${waitTime}ms... (${retries} retries left)`
         );

         await delay(waitTime);
         return fetchWithRetry(url, options, retries - 1, backoffMs);
      }

      return response;
   } catch (error) {
      if (retries > 0) {
         console.warn(
            `Network error encountered. Retrying in ${backoffMs}ms...`,
            error
         );
         await delay(backoffMs);
         return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
      }
      throw error;
   }
}

export default fetchWithRetry;
