export function getDefaultRequestInit(bypassingCache?: boolean | RegExp): RequestInit {
  return {
    cache: bypassingCache ? 'no-cache' : 'force-cache',
  }
}
