export default `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Puppeteer Vitest Test Page</title>
  <script type="module">
    import * as egami from 'http://localhost:3000/index.mjs'
    window.egami = egami
  </script>
  <style>
    * {
      box-sizing: border-box;
    }
  </style>
  <style id="style"></style>
</head>
<body>
<div id="app"></div>
</body>
</html>`
