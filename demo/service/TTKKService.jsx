export const TTKKService = {
  getTTKKs() {
    return fetch('/demo/data/ttkks.json', {
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((res) => res.json())
      .then((d) => d.data)
  },
}
