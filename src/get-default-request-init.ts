export function getDefaultRequestInit(bypassingCache?: boolean): RequestInit {
  return {
    cache: bypassingCache ? 'no-cache' : 'force-cache',
  }
}
