export const EventService = {
    getEvents() {
        return fetch('/demo/data/events.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
};
