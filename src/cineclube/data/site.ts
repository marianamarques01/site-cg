/**
 * Informações gerais do site — edite aqui e tudo se atualiza.
 */
export const site = {
  name: "Cineclube Méliès",
  tagline: "cinema de autor, arte & experimentação",
  university: "Universidade FUMEC",
  address: "Rua Cobre, 200 — Cruzeiro, Belo Horizonte/MG",
  building: "FACE — Sala Google",
  email: "cineclubemelies@fumec.br",
  instagram: "@cineclubemelies",
  instagramUrl: "https://instagram.com/cineclubemelies",
  letterboxdUrl: "https://letterboxd.com/cineclubemelies",
  whatsapp: "+55 31 99999-0000",
  whatsappUrl: "https://wa.me/5531999990000",
  /** Query usada no Google Maps (embed + rota) */
  mapsQuery: "Universidade FUMEC FACE, Rua Cobre 200, Cruzeiro, Belo Horizonte",
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  site.mapsQuery
)}&output=embed`;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  site.mapsQuery
)}`;
