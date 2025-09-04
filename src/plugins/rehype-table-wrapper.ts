import type { Plugin } from 'unified';
import type { Element } from 'hast';

const rehypeTableWrapper: Plugin = () => {
  return (tree) => {
    const visit = (node: any) => {
      if (node.type === 'element' && node.tagName === 'table') {
        // Create wrapper div
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className:
              'table-wrapper overflow-x-auto max-w-full my-6 rounded-lg border border-zinc-700',
          },
          children: [node],
        };

        // Replace the table with the wrapper
        return wrapper;
      }

      if (node.children) {
        node.children = node.children.map(visit);
      }

      return node;
    };

    visit(tree);
  };
};

export default rehypeTableWrapper;
