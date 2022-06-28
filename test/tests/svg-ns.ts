export const svgNs = {
  name: 'should render svg ns',
  style: `<style>
#app {
  width: 100px;
  overflow: hidden;
}

#root {
  border: 1px solid red;
  position: relative;
  height: 100px;
}

svg {
  position: absolute;
  left: 5px;
  top: 5px;
}
</style>`,
  node: `<div id="root">
  <svg xmlns="http://www.w3.org/1999/xhtml" height="94px" width="94px">
    <path
      d="M10 10 H 90 V 90 H 10 L 10 10"
      transform="translate(1,1)"
      pointer-events="visibleStroke"
      version="1.1"
      xmlns="http://www.w3.org/1999/xhtml"
      fill="none"
      stroke="#456"
      stroke-width="4"
      shape-rendering="crispEdges"
    />
  </svg>
</div>`,
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAipJREFUeF7tnbFtQkEYxu7tlhWyQoZiBUYIuxEFKSnSgc/SrzxT81mHzVFAwXFf6756jDFwfAc51jrGnOjEB3m0KMicd0BB5rR4nKQgBRlmYNhxuiEFGWZg2HG6IQUZZmDYcbohBRlmYNhxuiEFGWZg2HG6If81yNv7R1/hb4j7eb2sLd/2FmRDjbUWDlKIPSF+KAXZ6xPTtge5XS/98vhElr+fMAV5Qp7x1IIYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMS2IYRUwCwLkGdOCGFYBsyBAnjEtiGEVMAsC5BnTghhWAbMgQJ4xLYhhFTALAuQZ04IYVgGzIECeMdWDGIc+E3P7f+GeSZ7xWgtiWAXMggB5xvQ3iAGP+ZqBL6cNY8qpfgubAAAAAElFTkSuQmCC',
}
