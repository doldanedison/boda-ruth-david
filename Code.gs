/**
 * Backend de la boda de Ruth & David — Google Apps Script + Google Sheets.
 * 1) Cambiá CLAVE_ORGANIZADOR y (si el script no está dentro de la planilla) SHEET_ID.
 * 2) Implementar > Nueva implementación > Aplicación web
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 * 3) Copiá la URL /exec en config.js (API_URL).
 */
const CLAVE_ORGANIZADOR = "CAMBIAR-ESTA-CLAVE";
const SHEET_ID = "";            // vacío = la planilla que contiene este script
const NOMBRE_PLANILLA = "Invitados Boda Ruth y David";
const HOJA = "Invitados";
const HOJA_CFG = "Config";
// Textos de la invitación que se pueden cambiar desde el panel del organizador
const TEXTOS_EDITABLES = ["frase", "mensaje", "invitacion", "lugar", "direccion", "ciudad", "mapa", "vestimenta", "regalos", "aliasMostrar", "aliasTitular", "confirmarAntes"];
const COLS = ["id", "nombre", "telefono", "acompanantes", "asistiran", "estado", "mensaje", "actualizado", "integrantes", "quienes"];
const TITULOS = ["ID", "Nombre", "Teléfono", "Acompañantes", "Asistirán", "Estado", "Mensaje", "Actualizado", "Integrantes (nombres)", "Quiénes asisten"];

function doGet(e) {
  const p = e.parameter || {};
  try {
    switch (p.action) {
      case "buscar": return out({ ok: true, flex: true, invitados: buscar(p.nombre) });
      case "confirmar": return out(confirmar(p.id, p.asistiran, p.mensaje, p.quienes));
      case "config": return out({ ok: true, config: leerConfig() });
      case "listar": auth(p); return out({ ok: true, invitados: leer().map(r => r.obj) });
      case "guardar": auth(p); return out(guardar(p));
      case "importar": auth(p); return out(importar(p.datos));
      case "borrar": auth(p); return out(borrar(p.id));
      case "reiniciar": auth(p); return out(reiniciar(p.id));
      case "guardarconfig": auth(p); return out(guardarConfig(p));
      case "preparar": auth(p); return out(preparar());
      default: return out({ ok: false, error: "Acción inválida" });
    }
  } catch (err) {
    return out({ ok: false, error: String(err.message || err) });
  }
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function auth(p) { if (p.clave !== CLAVE_ORGANIZADOR) throw new Error("Clave incorrecta"); }
function libro() { return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }

// Deja la planilla lista: le pone nombre, crea las hojas y quita la hoja vacía inicial.
function preparar() {
  const ss = libro();
  ss.rename(NOMBRE_PLANILLA);
  hoja(); hojaCfg();
  ss.getSheets().forEach(s => { if (["Hoja 1", "Sheet1"].indexOf(s.getName()) >= 0) ss.deleteSheet(s); });
  return { ok: true, nombre: ss.getName(), hojas: ss.getSheets().map(s => s.getName()) };
}

function hoja() {
  const ss = libro();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) {
    sh = ss.insertSheet(HOJA);
    sh.getRange("A:A").setNumberFormat("@"); sh.getRange("C:C").setNumberFormat("@");
    sh.appendRow(TITULOS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function leer() {
  const sh = hoja(), v = sh.getDataRange().getValues();
  return v.slice(1).map((r, i) => {
    const o = {}; COLS.forEach((c, k) => o[c] = r[k] === undefined ? "" : r[k]);
    o.id = String(o.id); o.nombre = String(o.nombre || "");
    o.acompanantes = +o.acompanantes || 0; o.asistiran = +o.asistiran || 0;
    o.estado = o.estado || "PENDIENTE"; o.telefono = String(o.telefono || "");
    o.integrantes = String(o.integrantes || ""); o.quienes = String(o.quienes || ""); o.mensaje = String(o.mensaje || "");
    o.actualizado = o.actualizado instanceof Date ? o.actualizado.toISOString() : String(o.actualizado || "");
    return { fila: i + 2, obj: o };
  }).filter(r => r.obj.id && r.obj.nombre);
}

function limpiarNombres(s) {
  return String(s || "").split(",").map(x => x.trim().replace(/\s+/g, " ")).filter(Boolean).slice(0, 20).join(", ");
}

// Búsqueda tolerante: errores de tipeo, acentos, solo el nombre, y también por el nombre de un acompañante.
function buscar(nombre) {
  if (!bqNorm(nombre)) throw new Error("Escribí tu nombre");
  const todos = leer().map(r => r.obj);
  return bqInvitados(nombre, todos).slice(0, 8).map(m => {
    const o = todos[m.i];
    return { id: o.id, nombre: o.nombre, integrantes: o.integrantes, acompanantes: o.acompanantes, asistiran: o.asistiran, estado: o.estado, quienes: o.quienes, exacto: m.exacto };
  });
}

// ==== BUSQUEDA APROXIMADA (identica en api.js y Code.gs) ====
function bqNorm(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
}
// clave fonetica del castellano: "Giulianna" y "Juliana" dan la misma clave
function bqFon(w, alt) {
  w = bqNorm(w).replace(/ñ/g, "n").replace(/[^a-z]/g, "");
  w = w.replace(/ph/g, "f").replace(/ch/g, "x").replace(/sh/g, "x").replace(/ll/g, alt ? "l" : "j")
    .replace(/qu/g, "k").replace(/gu([ei])/g, "G$1").replace(/g([ei])/g, "j$1").replace(/G/g, "g")
    .replace(/c([ei])/g, "s$1").replace(/z/g, "s").replace(/[cq]/g, "k")
    .replace(/v/g, "b").replace(/w/g, "u").replace(/h/g, "")
    .replace(/y(?=[aeiou])/g, "j").replace(/y/g, "i")
    .replace(/j[iy]([aeiou])/g, "j$1")
    .replace(/(.)\1+/g, "$1");
  return w;
}
function bqDist(a, b) {
  if (a === b) return 0;
  var m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  var prev = [], cur = [], i, j;
  for (j = 0; j <= n; j++) prev[j] = j;
  for (i = 1; i <= m; i++) {
    cur[0] = i;
    for (j = 1; j <= n; j++) {
      var c = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
      if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1))
        cur[j] = Math.min(cur[j], prev[j - 2] + 1);
    }
    var t = prev; prev = cur; cur = t;
  }
  return prev[n];
}
// parecido entre dos palabras: 1 = igual, 0 = nada que ver
function bqPalabra(q, p) {
  if (q === p) return 1;
  if (q.length >= 3 && p.length >= 3 && (p.indexOf(q) === 0 || q.indexOf(p) === 0)) return 0.9;
  var fq = bqFon(q), fp = bqFon(p);
  if (fq && fq === fp) return 0.92;
  if (q.length < 4 || p.length < 4) return 0;
  var d = bqDist(fq, fp), mx = Math.max(fq.length, fp.length);
  // segunda lectura: "ll" como "l" ("Gulliana" ~ "Giuliana")
  var aq = bqFon(q, true), ap = bqFon(p, true);
  if (aq !== fq || ap !== fp) {
    var d2 = bqDist(aq, ap), mx2 = Math.max(aq.length, ap.length);
    if (d2 / mx2 < d / mx) { d = d2; mx = mx2; }
  }
  var s = 1 - d / mx;
  // tolerancia: 1 letra en palabras cortas, 2 en largas
  return (d <= (mx >= 7 ? 2 : 1) && s >= 0.6) ? Math.min(0.85, s) : 0;
}
// devuelve [{i, puntos, exacto}] ordenado de mejor a peor
function bqBuscar(consulta, nombres) {
  var qs = bqNorm(consulta).split(" ").filter(Boolean);
  if (!qs.length) return [];
  var res = [];
  nombres.forEach(function (nom, i) {
    var ps = bqNorm(nom).split(" ").filter(Boolean);
    if (!ps.length) return;
    var total = 0, exactas = 0, hit = 0;
    qs.forEach(function (q) {
      var mejor = 0;
      ps.forEach(function (p) { var s = bqPalabra(q, p); if (s > mejor) mejor = s; });
      if (mejor > 0) { hit++; total += mejor; }
      if (mejor === 1) exactas++;
    });
    if (!hit) return;
    // cobertura del nombre de la lista (para preferir "Hebert" a "Christian Veron" al buscar "Hebert Veron")
    var cob = hit / Math.max(ps.length, 1);
    var puntos = total / qs.length * 0.65 + cob * 0.35;
    // exacto: todo lo que escribió está tal cual en el nombre de la lista
    var exacto = exactas === qs.length;
    res.push({ i: i, puntos: puntos, exacto: exacto });
  });
  res.sort(function (a, b) { return b.puntos - a.puntos; });
  return res;
}
// personas de una invitación: titular + integrantes con nombre ("Ana, Luis")
function bqPersonas(g) {
  return [g.nombre].concat(String(g.integrantes || "").split(",")).map(function (x) { return String(x || "").trim(); }).filter(Boolean);
}
// busca en una lista de invitaciones mirando a cada persona; devuelve [{i, puntos, exacto}]
function bqInvitados(consulta, lista) {
  var res = [];
  lista.forEach(function (g, i) {
    var r = bqBuscar(consulta, bqPersonas(g));
    if (r.length) res.push({ i: i, puntos: r[0].puntos, exacto: r[0].exacto });
  });
  res.sort(function (a, b) { return b.puntos - a.puntos; });
  return res;
}
// ==== FIN ====

function conLock(fn) {
  const lock = LockService.getScriptLock(); lock.waitLock(15000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function confirmar(id, asistiran, mensaje, quienes) {
  return conLock(() => {
    const r = leer().find(x => x.obj.id === String(id));
    if (!r) throw new Error("Invitado no encontrado");
    const n = Math.max(0, Math.min(parseInt(asistiran, 10) || 0, r.obj.acompanantes + 1));
    const sh = hoja();
    sh.getRange(r.fila, 5, 1, 4).setValues([[n, n > 0 ? "CONFIRMADO" : "NO ASISTE", String(mensaje || "").slice(0, 300), new Date()]]);
    sh.getRange(r.fila, 10).setValue(n > 0 ? String(quienes || "").slice(0, 400) : "");
    return { ok: true, asistiran: n };
  });
}

function guardar(p) {
  const nombre = String(p.nombre || "").trim().replace(/\s+/g, " ");
  if (!nombre) throw new Error("Falta el nombre");
  const integrantes = limpiarNombres(p.integrantes);
  const cuantos = integrantes ? integrantes.split(", ").length : 0;
  const acomp = Math.max(cuantos, Math.max(0, parseInt(p.acompanantes, 10) || 0));
  return conLock(() => {
    const sh = hoja();
    if (p.id) {
      const r = leer().find(x => x.obj.id === String(p.id));
      if (!r) throw new Error("Invitado no encontrado");
      sh.getRange(r.fila, 2, 1, 3).setValues([[nombre, String(p.telefono || ""), acomp]]);
      sh.getRange(r.fila, 9).setValue(integrantes);
      if (r.obj.asistiran > acomp + 1) sh.getRange(r.fila, 5).setValue(acomp + 1);
    } else {
      sh.appendRow([nuevoId(), nombre, String(p.telefono || ""), acomp, 0, "PENDIENTE", "", "", integrantes, ""]);
    }
    return { ok: true };
  });
}

function nuevoId() { return "g" + Utilities.getUuid().replace(/-/g, "").slice(0, 7); }

// Alta de varias invitaciones en un solo pedido. datos = JSON [{nombre, acompanantes, integrantes}]
function importar(datos) {
  const lista = JSON.parse(datos || "[]");
  if (!Array.isArray(lista) || !lista.length) throw new Error("No hay datos para importar");
  if (lista.length > 60) throw new Error("Demasiadas filas en un pedido");
  const filas = lista.map(g => {
    const nombre = String(g.nombre || "").trim().replace(/\s+/g, " ");
    if (!nombre) throw new Error("Hay una fila sin nombre");
    const integrantes = limpiarNombres(g.integrantes);
    const cuantos = integrantes ? integrantes.split(", ").length : 0;
    return [nuevoId(), nombre, "", Math.max(cuantos, parseInt(g.acompanantes, 10) || 0), 0, "PENDIENTE", "", "", integrantes, ""];
  });
  return conLock(() => {
    const sh = hoja();
    sh.getRange(sh.getLastRow() + 1, 1, filas.length, COLS.length).setValues(filas);
    return { ok: true, agregados: filas.length };
  });
}

function borrar(id) {
  return conLock(() => {
    const r = leer().find(x => x.obj.id === String(id));
    if (r) hoja().deleteRow(r.fila);
    return { ok: true };
  });
}

function reiniciar(id) {
  return conLock(() => {
    const r = leer().find(x => x.obj.id === String(id));
    if (r) { const sh = hoja(); sh.getRange(r.fila, 5, 1, 4).setValues([[0, "PENDIENTE", "", ""]]); sh.getRange(r.fila, 10).setValue(""); }
    return { ok: true };
  });
}

// ---- configuración editable (itinerario) ----
function hojaCfg() {
  const ss = libro();
  let sh = ss.getSheetByName(HOJA_CFG);
  if (!sh) { sh = ss.insertSheet(HOJA_CFG); sh.getRange("B:B").setNumberFormat("@"); sh.appendRow(["Clave", "Valor"]); sh.setFrozenRows(1); }
  return sh;
}

function leerConfig() {
  const v = hojaCfg().getDataRange().getValues().slice(1);
  const cfg = { itinerario: null, textos: null };
  v.forEach(r => { if (r[0] in cfg) { try { cfg[r[0]] = JSON.parse(r[1]); } catch (e) { } } });
  return cfg;
}

// Guarda solo lo que viene en el pedido: itinerario, textos, o los dos.
function guardarConfig(p) {
  const res = { ok: true }, cambios = [];
  if (p.itinerario !== undefined) {
    let it = JSON.parse(p.itinerario || "[]");
    if (!Array.isArray(it)) throw new Error("Itinerario inválido");
    it = it.slice(0, 30).map(x => ({
      hora: String(x.hora || "").trim().slice(0, 10),
      titulo: String(x.titulo || "").trim().slice(0, 80),
      detalle: String(x.detalle || "").trim().slice(0, 140)
    })).filter(x => x.titulo);
    cambios.push(["itinerario", it]); res.itinerario = it;
  }
  if (p.textos !== undefined) {
    const o = JSON.parse(p.textos || "{}");
    if (!o || typeof o !== "object" || Array.isArray(o)) throw new Error("Textos inválidos");
    const t = {};
    TEXTOS_EDITABLES.forEach(k => {
      if (o[k] === undefined) return;
      const v = String(o[k]).trim().slice(0, 600);
      if (k === "mapa" && v && !/^https:\/\//.test(v)) throw new Error("El enlace del mapa tiene que empezar con https://");
      t[k] = v;
    });
    cambios.push(["textos", t]); res.textos = t;
  }
  if (!cambios.length) throw new Error("No hay nada para guardar");
  return conLock(() => {
    const sh = hojaCfg(), v = sh.getDataRange().getValues();
    cambios.forEach(([clave, valor]) => {
      const i = v.findIndex(r => r[0] === clave), txt = JSON.stringify(valor);
      if (i >= 0) sh.getRange(i + 1, 2).setValue(txt); else { sh.appendRow([clave, txt]); v.push([clave, txt]); }
    });
    return res;
  });
}
