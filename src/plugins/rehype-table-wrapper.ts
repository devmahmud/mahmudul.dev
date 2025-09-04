import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

function rehypeTableWrapper() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const el = node as Element;
      if (el.tagName !== 'table') return;

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'table-wrapper',
            'overflow-x-auto',
            'max-w-full',
            'my-6',
            'rounded-lg',
            'border',
            'border-zinc-700',
          ],
        },
        children: [el],
      };

      (parent.children as Element[])[index] = wrapper;
    });
  };
}

export default rehypeTableWrapper;
