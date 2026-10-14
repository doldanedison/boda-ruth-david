// Ilustraciones SVG propias para la invitación de boda (azul marino, dorado y orquídeas blancas)
window.ART = (function () {
  const defs = `<defs>
    <radialGradient id="petalo" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#fbf9f5"/><stop offset="1" stop-color="#e9e4da"/></radialGradient>
    <radialGradient id="lacre" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f1d79b"/><stop offset=".55" stop-color="#cfa659"/><stop offset="1" stop-color="#9c7230"/></radialGradient>
    <linearGradient id="oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6c988"/><stop offset=".5" stop-color="#c9a35c"/><stop offset="1" stop-color="#a8813e"/></linearGradient>
  </defs>`;

  // Orquídea (tipo phalaenopsis) vista de frente
  const orchid = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <ellipse cx="0" cy="-19" rx="8.5" ry="17" fill="url(#petalo)" stroke="#ded8cc" stroke-width=".6"/>
    <ellipse cx="0" cy="-19" rx="8.5" ry="17" fill="url(#petalo)" stroke="#ded8cc" stroke-width=".6" transform="rotate(128)"/>
    <ellipse cx="0" cy="-19" rx="8.5" ry="17" fill="url(#petalo)" stroke="#ded8cc" stroke-width=".6" transform="rotate(-128)"/>
    <path d="M-2 -3 C-14 -22 -38 -18 -36 -1 C-35 13 -14 12 -2 3Z" fill="url(#petalo)" stroke="#ded8cc" stroke-width=".6"/>
    <path d="M2 -3 C14 -22 38 -18 36 -1 C35 13 14 12 2 3Z" fill="url(#petalo)" stroke="#ded8cc" stroke-width=".6"/>
    <path d="M0 1 C-8 4 -8 13 -3 17 C0 19 0 19 3 17 C8 13 8 4 0 1Z" fill="#f4dfae" stroke="#d9b468" stroke-width=".6"/>
    <path d="M-5 3 Q0 9 5 3" stroke="#c98b4a" stroke-width="1" fill="none"/>
    <circle cx="0" cy="-1" r="3.4" fill="#e9bf55"/><circle cx="-1" cy="-2" r="1.1" fill="#fff3c9"/>
    <circle cx="-2.2" cy="9" r=".9" fill="#c0703a"/><circle cx="2.2" cy="9" r=".9" fill="#c0703a"/>
  </g>`;
  const bud = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <ellipse cx="0" cy="0" rx="5.5" ry="8" fill="#f3f1e6" stroke="#cfd3b6" stroke-width=".7"/><path d="M-3 5 Q0 -4 3 5" fill="#b9c79a" opacity=".7"/></g>`;
  const leaf = (x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M0 0 C10 -10 34 -12 48 0 C34 10 10 10 0 0Z" fill="#5f7d57"/><path d="M2 0 H44" stroke="#4a6645" stroke-width="1"/></g>`;

  // Rama de orquídeas (caja aprox. 0..230 x 0..190, cae de arriba-izquierda hacia la derecha)
  const spray = (x = 0, y = 0, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    ${leaf(18, 60, 1.1, 150)}${leaf(22, 66, .95, 205)}${leaf(30, 52, .8, 100)}
    <path d="M14 70 C40 20 110 8 160 40 C185 56 205 84 218 118" stroke="#6d8a5c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M150 34 q14 -14 26 -12 M190 66 q16 -8 24 0" stroke="#6d8a5c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${bud(178, 20, .9, 40)}${bud(216, 64, .8, 70)}${bud(222, 126, .9, 150)}${bud(210, 142, .7, 170)}
    ${orchid(46, 62, 1.02, -18)}${orchid(96, 34, .92, 8)}${orchid(146, 62, 1, 24)}${orchid(184, 104, .82, 40)}${orchid(88, 88, .74, -6)}
  </g>`;

  // Sello de lacre dorado con monograma
  const seal = (txt, size = 96) => {
    const pts = []; const n = 22;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = 47 + (i % 2 ? 2.6 : -1.2) + ((i * 7) % 5 - 2) * .5; pts.push((50 + Math.cos(a) * rr).toFixed(1) + " " + (50 + Math.sin(a) * rr).toFixed(1)); }
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${defs}
      <polygon points="${pts.join(",")}" fill="url(#lacre)" stroke="#8f6a2c" stroke-width=".8" stroke-linejoin="round"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#8f6a2c" stroke-width="1.2" opacity=".65"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#f6e3b4" stroke-width=".7" opacity=".7"/>
      <text x="50" y="59" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-size="25" font-weight="600" fill="#7a5822" letter-spacing="1">${txt}</text>
      <text x="50" y="58" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-size="25" font-weight="600" fill="#fbeecb" opacity=".55" letter-spacing="1">${txt}</text>
    </svg>`;
  };

  // Adorno separador dorado
  const divider = (w = 180) => `<svg viewBox="0 0 180 18" width="${w}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 9 H70 M110 9 H176" stroke="#c9a35c" stroke-width="1"/>
    <path d="M90 2 L97 9 L90 16 L83 9Z" fill="none" stroke="#c9a35c" stroke-width="1.2"/><circle cx="90" cy="9" r="1.8" fill="#c9a35c"/>
    <circle cx="74" cy="9" r="1.5" fill="#c9a35c"/><circle cx="106" cy="9" r="1.5" fill="#c9a35c"/></svg>`;

  // Cuerpo delantero del sobre (solapas laterales e inferior). viewBox 0 0 300 200
  const envFront = `<svg viewBox="0 0 300 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L150 108 L0 200Z" fill="#26355a"/><path d="M300 0 L150 108 L300 200Z" fill="#22304f"/>
    <path d="M0 200 L150 92 L300 200Z" fill="#2b3b63"/>
    <path d="M0 200 L150 92 L300 200" fill="none" stroke="#1a2440" stroke-width="1" opacity=".55"/></svg>`;
  const envFlap = `<svg viewBox="0 0 300 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 H300 L150 120Z" fill="#1f2c4c"/><path d="M0 0 L150 120 L300 0" fill="none" stroke="#141d36" stroke-width="1.2" opacity=".7"/></svg>`;

  // Ejemplo de vestimenta elegante para los invitados: vestido largo de fiesta y traje
  const vestimenta = `<svg viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ejemplo de vestimenta elegante: vestido largo de fiesta y traje">
    <defs><linearGradient id="gala" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6c988"/><stop offset="1" stop-color="#c9a35c"/></linearGradient></defs>
    <g fill="#1f2c4c"><ellipse cx="92" cy="18" rx="8.5" ry="9.5"/>
      <path d="M83 26c-1 3 0 6 2 8l14 0c2-2 3-5 2-8-5 2-13 2-18 0z"/>
      <path d="M76 36c6-4 26-4 32 0 3 3 4 8 3 14l-3 32c-1 6-2 10-4 13l-1 60h-8l-4-56-3 56h-8l-1-58c-3-4-5-10-5-16l-1-30c0-4 1-7 3-9z"/></g>
    <path d="M92 33l-6 8 6 22 6-22z" fill="#fffdf9"/><path d="M92 36l-2.2 3 1.4 14 .8 3 .8-3 1.4-14z" fill="#c9a35c"/>
    <path d="M53 20c-3 6-4 16-2 26l7-4c-1-7-1-14 1-20z" fill="#1f2c4c"/><ellipse cx="61" cy="22" rx="7.6" ry="8.6" fill="#1f2c4c"/>
    <path d="M57 38c3-2 9-2 12 0 2 1 2 4 1 8l-2 12c-1 3-1 5 0 7 5 14 9 38 11 72 1 6 4 10 8 12-12 4-36 5-52 1 4-3 7-7 8-12 4-30 10-56 15-73 1-3 1-5 0-8l-3-11c-1-3 0-6 2-8z" fill="url(#gala)" stroke="#1f2c4c" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M57 64c4 2 9 2 13 0" stroke="#1f2c4c" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M60 72c-3 24-8 48-12 74M66 72c2 24 5 50 8 74" stroke="#1f2c4c" stroke-width="1" fill="none" opacity=".3"/>
    <path d="M10 160c34 6 80 5 120-2" stroke="#c9a35c" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

  const svg = (inner, vb, extra = "") => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${extra}>${defs}${inner}</svg>`;

  return { defs, orchid, bud, leaf, spray, seal, divider, envFront, envFlap, vestimenta, svg };
})();
