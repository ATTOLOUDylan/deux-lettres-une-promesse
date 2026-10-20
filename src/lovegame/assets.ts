// Chemin vers /public/assets (fonctionne en dev et en production)
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
