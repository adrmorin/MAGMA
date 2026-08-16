# MAGMA · Mapa global de Joint Ventures — paquete de integración

Contenido:

- `magma-jv-map.html` — la sección completa, autocontenida (un solo archivo: HTML + CSS + JS).

Sin dependencias que instalar. Carga desde CDN, con integridad verificada (SRI):

- d3 7.9.0 y topojson-client 3.1.0 → dibujo del mapa
- world-atlas 2.0.2 (`countries-110m.json`) → geometría real de países (Natural Earth, dominio público)
- Google Fonts: Archivo, IBM Plex Sans, IBM Plex Mono

Requiere conexión a internet en el navegador del visitante. Si la web de MAGMA debe funcionar
sin CDN externos, descarga esos cuatro recursos al servidor y cambia las rutas de los
`<script>`, el `<link>` de fuentes y la URL del `d3.json(...)`.

---

## Opción A · Embed por iframe (la más rápida y segura)

Sube `magma-jv-map.html` a, p. ej. `/mapa/magma-jv-map.html` y pega en la página:

```html
<div style="position:relative;width:100%">
  <iframe
    src="/mapa/magma-jv-map.html"
    title="Mapa global de Joint Ventures MAGMA"
    loading="lazy"
    style="width:100%;height:1180px;border:0;display:block"
    id="magma-map-frame"></iframe>
</div>
```

Altura automática (opcional). Añade en la página contenedora:

```html
<script>
  addEventListener("message", e => {
    if (e.data && e.data.magmaMapHeight) {
      document.getElementById("magma-map-frame").style.height = e.data.magmaMapHeight + "px";
    }
  });
</script>
```

Y al final de `magma-jv-map.html`, antes de `</body>`:

```html
<script>
  const post = () => parent.postMessage({ magmaMapHeight: document.body.scrollHeight }, "*");
  addEventListener("load", post);
  new ResizeObserver(post).observe(document.body);
</script>
```

Sin ese script, usa alturas por breakpoint: ~1180 px en escritorio, ~1500 px en tablet, ~1750 px en móvil.

## Opción B · Insertar el código en una plantilla existente

1. Copia del `<head>`: los dos `<script>` de d3/topojson (con sus atributos `integrity` y `crossorigin`, sin modificar) y los `<link>` de fuentes.
2. Copia el bloque `<style>` completo. Todos los selectores están dentro de `.wrap`, `.grid`, `.side`, etc.; si la web ya usa esos nombres, prefija el CSS y el marcado con `.magma-map` para evitar colisiones.
3. Copia el marcado desde `<div class="wrap">` hasta su `</div>`.
4. Copia el `<script>` final tal cual, al final del `<body>`.
5. El tema se controla con el atributo `data-theme` en `<body>` (`magma`, `claro`, `tinta`). Para fijar un solo estilo, pon el valor definitivo y borra los botones `.tbtn` y su bloque de JS. Si el CSS pasa a un contenedor, mueve `data-theme` a ese contenedor y cambia `document.body` por él en el JS.

---

## Comportamiento responsive

| Ancho | Disposición |
|---|---|
| ≥ 1180 px | Mapa + ficha lateral fija (360 px), sticky al hacer scroll |
| 980–1180 px | Igual, ficha de 320 px |
| < 980 px | Una columna: mapa arriba, directorio debajo con scroll propio |
| < 640 px | Cifras en 2 columnas, filtros en carrusel horizontal, leyenda compacta, etiquetas de coordenadas ocultas |

- El SVG escala con `viewBox` (960×500): nítido en cualquier densidad de pantalla.
- En pantallas táctiles el área de pulsación de cada sede crece y el popup de hover se desactiva: el toque abre directamente la ficha.
- `prefers-reduced-motion` desactiva los arcos animados y el pulso de los marcadores.

## Dónde editar el contenido

Todo el contenido vive en el array `REGIONS` al inicio del `<script>`: nombre de la JV, clasificación (A/B/C), países, tipo y nombre de la sede, lista de enfoque y coordenadas `[lon, lat]` del marcador. Los países de cada región se agrupan en `LISTS` (nombres en inglés de Natural Earth); lo no listado se asigna por posición geográfica. El botón "Contactar con esta JV" está en la plantilla `select()`: cambia el `href="#"` por la URL o el `mailto:` real.

## Accesibilidad y SEO

El mapa es una capa visual: el directorio lateral contiene la misma información en texto y es navegable con teclado (los elementos son `<button>`). Para SEO, conviene que la página que embebe incluya también las seis JVs en texto plano, ya que el contenido de un iframe no se indexa como parte de la página anfitriona.
