export const getProductImage = (url: string) => {
  if (url.startsWith('https://storage.googleapis.com')) {
    return url
  } else {
    return process.env.NEXT_PUBLIC_URL + url
  }
}