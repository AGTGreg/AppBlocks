

# AppBlocks

> Una biblioteca de JavaScript pequeña, rápida y ligera para crear microaplicaciones

AppBlocks está diseñada para mejorar las páginas web con microaplicaciones autosuficientes. Con un enfoque en la simplicidad y una huella mínima, AppBlocks proporciona todo lo necesario para construir componentes interactivos, siendo increíblemente fácil de integrar en cualquier proyecto.

## ¿Por qué AppBlocks?

- **🪶 Ligera**: Tamaño de paquete mínimo sin dependencias pesadas
- **⚡ Rápida**: Renderizado eficiente con comparación inteligente del DOM (Idiomorph)
- **🎯 Enfocada**: Construida específicamente para microaplicaciones y widgets
- **📦 Cero Configuración**: Funciona inmediatamente con una simple etiqueta de script
- **🔧 Flexible**: Basada en plantillas con enlazado reactivo de datos

Lee más sobre el [caso de uso de AppBlocks](https://agtgreg.github.io/AppBlocks/#/whyappblocks).

## Inicio Rápido

Aquí tienes una aplicación completa "Hello World" en menos de 30 líneas:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My First AppBlock</title>
</head>
<body>
  <!-- Container where our app will render -->
  <div id="app"></div>

  <!-- Template with our app's markup -->
  <template id="appTemplate">
    <h1>{data.message}</h1>
    <button id="change-btn">Change Message</button>
  </template>

  <!-- Load AppBlocks from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.1/dist/appblocks.min.js"></script>

  <!-- Initialize the app -->
  <script>
    var app = new AppBlock({
      el: document.getElementById('app'),
      template: document.getElementById('appTemplate'),
      data: {
        message: "Hello, AppBlocks!"
      },
      events: {
        'click #change-btn': function() {
          this.Parent.setData({
            message: "You clicked the button!"
          });
        }
      }
    });
  </script>
</body>
</html>
```

## Instalación

### CDN (Recomendado para Inicio Rápido)

```html
<script src="https://cdn.jsdelivr.net/npm/appblocks@2.1.1/dist/appblocks.min.js"></script>
```

### NPM

```bash
npm install appblocks
```

Luego importa en tu JavaScript:

```javascript
import { AppBlock } from 'appblocks';
```

### Descarga Directa

Descarga la última versión e inclúyela en tu HTML:

```html
<script src="/path/to/appblocks.min.js"></script>
```

## Características Principales

### 📊 Enlazado Reactivo de Datos

```javascript
var app = new AppBlock({
  el: document.getElementById('app'),
  data: { count: 0 },
  // ...
});

// Update data and automatically re-render
app.setData({ count: 1 });
```

### 🎨 Directivas de Plantilla

```html
<!-- Conditional rendering -->
<p c-if="data.isVisible">Now you see me</p>
<p c-ifnot="data.isVisible">Now you don't</p>

<!-- Loop rendering -->
<ul>
  <li c-for="item in data.items">{item.name}</li>
</ul>
```

### 🔄 Filtros

```javascript
filters: {
  uppercase(app, value) {
    return value.toUpperCase();
  }
}
```

```html
<p>{data.name|uppercase}</p>
```

### 🎯 Manejo de Eventos

```javascript
events: {
  'click .btn': function(e, element) {
    this.Parent.setData({ clicked: true });
  },
  'submit form': function(e, element) {
    e.preventDefault();
    // Handle form submission
  }
}
```

### 🌐 Solicitudes HTTP Integradas

```javascript
app.fetchRequest('https://api.example.com/data',
  { method: 'GET' },
  {
    success: (data) => app.setData({ items: data }),
    error: (err) => console.error(err)
  }
);
```

## Documentación

**📚 [Documentación Completa](https://agtgreg.github.io/AppBlocks/#/)**

- [Guía de Inicio](https://agtgreg.github.io/AppBlocks/#/README)
- [Gestión de Datos](https://agtgreg.github.io/AppBlocks/#/data)
- [Directivas](https://agtgreg.github.io/AppBlocks/#/directives)
- [Filtros](https://agtgreg.github.io/AppBlocks/#/filters)
- [Métodos](https://agtgreg.github.io/AppBlocks/#/methods)
- [Manejo de Eventos](https://agtgreg.github.io/AppBlocks/#/README?id=event-handling)
- [Solicitudes HTTP](https://agtgreg.github.io/AppBlocks/#/requests)
- [Referencia de la API](https://agtgreg.github.io/AppBlocks/#/api)

## Compatibilidad con Navegadores

AppBlocks funciona en todos los navegadores modernos que soportan ES6:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

## Licencia

Licencia MIT - consulta el archivo LICENSE para más detalles
