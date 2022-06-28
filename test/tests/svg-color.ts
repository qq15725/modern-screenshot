export const svgColor = {
  name: 'should render svg color',
  style: `<style>
#app {
  width: 120px;
  overflow: hidden;
}

.rect {
  fill: black;
}
</style>`,
  node: `<svg
  width="120"
  height="120"
  viewBox="0 0 120 120"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect class="rect" x="10" y="10" fill="red" width="100" height="100" />
  <foreignObject
    x="20"
    y="20"
    width="120"
    height="120"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <span
      style="display: inline-block; width: 32px; height: 32px; background: red;"
    />
  </foreignObject>
</svg>`,
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB8CAYAAACi9XTEAAAAAXNSR0IArs4c6QAAAyhJREFUeF7t2DFuA1EMxFD7/odOGiP120ZRFLom8KWhxsW+X/1OJ/A+vV3LvRJ8/AgSnODjCRxfrwYn+HgCx9erwQk+nsDx9Wpwgn8S+DqexV9bj8pJ0GfzBO86AXJHUIJ3mf1MQ+4ISnCCVyZwfCgqJ0E1eOWpkDuCEpzglQkcH4rKSVANXnkq5I6gBCd4zeeuJxe7UpsPRasS9KTBv/2568lCnuVKklYlKMEJ7i96/gaonATV4Hl78CK5IyjBEPc8Qu4ISvC8PXiR3BGUYIh7HiF3BCV43h68SO4ISjDEPY+QO4ISPG8PXiR3BCUY4p5HyB1BCZ63By+SO4ISDHHPI+SOoATP24MXyR1BCYa45xFyR1CC5+3Bi+SOoARD3PMIuSMowfP24EVyR1CCIe55hNwRlOB5e/AiuSMowRD3PELuCErwvD14kdwRlGCIex4hdwQleN4evEjuCEowxD2PkDuCEjxvD14kdwQlGOKeR8gdQQmetwcvkjuCEgxxzyPkjqAEz9uDF8kdQQmGuOcRckfQE8Hze/7bF8kdQQleeUTkjqAEJ3hlAseHonISVINXngq5IyjBCV6ZwPGhqJwE1eCVp0LuCEpwglcmcHwoKidBNXjlqZA7ghKc4JUJHB+KyklQDV55KuSOoAQneGUCx4eichJUg1eeCrkjKMEJXpnA8aGonATV4JWnQu4ISnCCVyZwfCgqJ0E1eOWpkDuCEpzglQkcH4rKSVANXnkq5I6gBCd4ZQLHh6JyElSDV54KuSMowQlemcDxoaicBNXgladC7ghKcIJXJnB8KConQTV45amQO4ISnOCVCRwfispJUA1eeSrkjqAEJ3hlAseHonISVINXngq5IyjBCV6ZwPGhqJwE1eCVp0LuCEpwglcmcHwoKidBNXjlqZA7ghKc4JUJHB+KyklQDV55KuSOoAQneGUCx4eichJUg1eeCrkjKMEJXpnA8aGonATV4JWnQu4ISnCCVyZwfCgqJ0HHgzq9XoJP6329Epzg4wkcX68GJ/h4AsfXq8EJPp7A8fVqcIKPJ3B8vRqc4OMJHF+vBif4eALH1/sG0BGEff+aTPwAAAAASUVORK5CYII=',
}
