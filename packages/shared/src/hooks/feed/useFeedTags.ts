import { useMemo } from 'react';

interface UseFeedTags {
  tags: string[];
  width: number;
  base?: number;
  offset?: number;
}

const basePadding = 25;
const char = 8;
const gap = 8;

export const useFeedTags = ({
  base = basePadding,
  tags,
  width,
  offset = 0,
}: UseFeedTags): string[] => {
  return useMemo(() => {
    if (!tags?.length || width === 0) {
      return [];
    }

    let totalLength = offset;

    return tags.reduce((items, tag, index) => {
      const baseWidth = base + gap;
      const minWidth = index === 0 ? base : baseWidth;
      const addition = tag.length * char + minWidth;
      const remaining = tags.length - (items.length + 1); // the value 1 is for the tag we are about to add here

      totalLength += addition;

      if (remaining === 0) {
        if (totalLength <= width) {
          items.push(tag);
        }

        return items;
      }

      const remainingChars = remaining.toString().length * char;
      const remainingWidth = baseWidth + remainingChars;

      if (totalLength + remainingWidth > width) {
        return items;
      }

      items.push(tag);

      return items;
    }, []);
  }, [base, tags, width, offset]);
};
