import type { Context } from "../src/context";
import { Window } from "happy-dom";
import { describe, expect, it } from "vitest";
import { domToForeignObjectSvg } from "../src";
import { embedSvgUse } from "../src/embed-svg-use";

describe("use happy-dom in nodejs", async () => {
  it("dom to svg", async () => {
    const window = new Window();
    const document = window.document;
    document.write(`
<html>
  <body>
    <div style="display: flex; justify-content: center; align-items: center;">
      <span>test1</span>
      <span>test2</span>
    </div>
  </body>
</html>
`);
    const svg = await domToForeignObjectSvg(document.body as unknown as Node);
    expect(svg.toString()).not.toBeNull();
  });

  it("embed svg use with id starting with digit", () => {
    const window = new Window();
    const document = window.document;
    document.write(`
<html>
  <body>
    <svg style="display: none">
      <symbol id="55180b_kitten" viewBox="0 0 24 24">
        <path d="M5 12h14"></path>
      </symbol>
    </svg>
    <svg>
      <use href="#55180b_kitten"></use>
    </svg>
  </body>
</html>
`);

    const useElement = document.querySelector(
      "use",
    ) as unknown as SVGUseElement;
    const svgDefsElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "defs",
    );
    const context = {
      ownerDocument: document,
      svgDefsElement,
      shadowRoots: [],
    } as unknown as Context;

    const tasks = embedSvgUse(useElement, context);

    expect(tasks).toHaveLength(0);
    expect(svgDefsElement.querySelector('[id="55180b_kitten"]')).not.toBeNull();
  });
});
