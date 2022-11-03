import { FigmaTreeEl } from "../../app/types/types";
import { colorTheme } from "../../theme";

// simple hash function, do not use for sensitive data
export const hashCode = (str: string) =>
  str.split("").reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0);

const KEYS = {
  dataStroke: "data-stroke",
  dataStrokeWidth: "data-stroke-width",
};

const HIGHLIGHT_STYLE = {
  color: colorTheme[500],
  strokeWidth: 5,
};

export const registerHoverEventsOnFigmaEls = (ids: string[]) => {
  // find all svg element with id included in idsRefs.current array and add on hover event a red solid border
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("mouseover", (e) => {
        e?.stopPropagation();

        const strokeWidth = parseInt(
          window.getComputedStyle(element)[
            //@ts-ignore
            "stroke-width"
          ].replace("px", "") ?? "0"
        );

        // save the original border stroke and width
        element.setAttribute(KEYS.dataStroke, element.style.stroke);
        element.setAttribute(KEYS.dataStrokeWidth, `${strokeWidth}`);
        element.style.stroke = HIGHLIGHT_STYLE.color;

        if (strokeWidth < HIGHLIGHT_STYLE.strokeWidth) {
          element.style.strokeWidth = `${HIGHLIGHT_STYLE.strokeWidth}`;
        }
      });
      element.addEventListener("mouseout", () => {
        //restore the dataset attributes
        element.style.stroke = element.dataset[KEYS.dataStroke] ?? "";
        element.style.strokeWidth = element.dataset[KEYS.dataStrokeWidth] ?? "";
      });
    }
  });
};

export const highlightFigmaZone = (elementId: string, highlight?: boolean) => {
  document.getElementById(elementId)?.dispatchEvent(
    new MouseEvent(highlight !== false ? "mouseover" : "mouseout", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );
};

export function getTreeHierarchyFromDOM(idsToIndex: string[]) {
  const rootId = idsToIndex?.[0];
  const resultTree: FigmaTreeEl[] = [
    {
      id: rootId,
      children: [],
    },
  ];

  findChildrenWithIdsOfParentInDOM(resultTree[0], idsToIndex, rootId);
  return resultTree;
}

const findChildrenWithIdsOfParentInDOM = (
  resultTreeEl: FigmaTreeEl,
  idsToIndex: string | string[],
  parent: string
) => {
  const children = document?.getElementById(parent)?.children;
  if (!children) return;
  const chidrenIds = Array.from(children).map((child) => child.id);
  // if no childrenIds is included in idsToIndex, return
  if (!chidrenIds.some((id) => idsToIndex.includes(id))) return;
  // else add parent to id and recurse over
  chidrenIds?.forEach((id) => {
    if (id) {
      const newTreeEl = {
        id,
        children: [],
      };
      resultTreeEl.children?.push(newTreeEl);
      findChildrenWithIdsOfParentInDOM(newTreeEl, idsToIndex, id);
    }
  });
};

export const getNodeSubTree = (
  id: string,
  tree: FigmaTreeEl
): FigmaTreeEl | null => {
  if (tree.id === id) return tree;
  if (!tree.children || tree.children?.length === 0) return null;
  for (const child of tree.children) {
    const result = getNodeSubTree(id, child);
    if (result) return result;
  }
  return null;
};

export const getChildrenIdsOfTree = (
  id: string,
  tree: FigmaTreeEl
): string[] => {
  const subTree = getNodeSubTree(id, tree);
  // crawl through all chilfren
  return (
    subTree?.children?.flatMap((child) => {
      return [child.id, ...getChildrenIdsOfTree(child.id, tree)];
    }) ?? []
  );
};

export const removeSubTree = (
  id: string,
  tree: FigmaTreeEl,
  parentTree: FigmaTreeEl,
  isNested?: boolean // first call
): FigmaTreeEl | undefined => {
  // return something if the id to remove is found
  if (tree.id === id) {
    if (!isNested) {
      if (tree.children?.length) tree.children.length = 0;
      return;
    }
    // remove id from parentTree
    parentTree.children = parentTree.children?.filter(
      (child) => child.id !== id
    );
    return parentTree;
  }
  if (!tree.children || tree.children?.length === 0) return;
  for (const child of tree.children) {
    const newTree = removeSubTree(id, child, tree, true);
    if (newTree) return newTree;
  }
};
