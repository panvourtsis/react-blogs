import * as yaml from 'js-yaml';
import { FrontMatter } from 'types';

const matchOutsideStrings = (input: string, regex: RegExp): number[] => {
  let inSingleQuoteString = false;
  let inDoubleQuoteString = false;
  const matches: number[] = [];
  let match;

  if (matches && matches.length >= 2) {
    return matches;
  }

  const isInString = (index: number): boolean => {
    for (let i = 0; i < index; i += 1) {
      if (/\n/.test(input[i])) {
        inSingleQuoteString = false;
        inDoubleQuoteString = false;
      }

      if (input[i] === "'" && (i === 0 || input[i - 1] !== '\\')) {
        inSingleQuoteString = !inSingleQuoteString;
      } else if (input[i] === '"' && (i === 0 || input[i - 1] !== '\\')) {
        inDoubleQuoteString = !inDoubleQuoteString;
      }
    }
    return inSingleQuoteString || inDoubleQuoteString;
  };

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(input)) !== null) {
    if (!isInString(match.index)) {
      matches.push(match.index);
    }
    // Reset string state for next iteration
    inSingleQuoteString = false;
    inDoubleQuoteString = false;
  }

  return matches;
};

const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

type ReturnValue = {
  blog: string;
  frontMatter: FrontMatter;
};

type Props = {
  blog: string;
  delimiter?: string;
  showFrontMatter?: boolean;
  metadata?: Record<string, string>;
};

const processBlog = ({
  blog,
  delimiter = '---',
  showFrontMatter = false,
  metadata,
}: Props): ReturnValue => {
  // Encode the delimiter to ensure it doesn't mess up in the regex search.
  const encodedDelimiter = escapeRegExp(delimiter);

  // ! https://jsbenchmark.com/#eyJjYXNlcyI6W3siaWQiOiJ0dHNwS19hY29RQWhZZlZFczhWSmgiLCJjb2RlIjoiWy4uLkRBVEEubWF0Y2hBbGwoLz0geWFtbCA9fC0tLS9naSldLm1hcChtYXRjaCA9PiBtYXRjaC5pbmRleCk7XG4iLCJuYW1lIjoiRmluZCA0OTkifSx7ImlkIjoiaHZqbWd3MmJ6TTJhdUUyNzFpd1ZZIiwiY29kZSI6IkRBVEEuc3BsaXQoJ1xcbicpLm1hcCgobGluZSwgaSkgPT4gKGxpbmUgPT09IC89IHlhbWwgPXwtLS0vZ2kgPyBpIDogdW5kZWZpbmVkKSkuZmlsdGVyKGkgPT4gaSAhPT0gdW5kZWZpbmVkKTsiLCJkZXBlbmRlbmNpZXMiOltdfSx7ImlkIjoiZlcxYzFQNGdEdlR5WGVBdkM3cjc3IiwiY29kZSI6IlsuLi5EQVRBLm1hdGNoQWxsKC89IHlhbWwgPXwtLS0vZ2kpXS5tYXAobWF0Y2ggPT4gKHtcbiAgbWF0Y2g6IG1hdGNoWzBdLFxuICBpbmRleDogbWF0Y2guaW5kZXhcbn0pKTtcbiIsImRlcGVuZGVuY2llcyI6W119LHsiaWQiOiJYLWlVS3JHSEYzX2IxeTBZei0yVVciLCJjb2RlIjoiREFUQS5zcGxpdCgnXFxuJykuZmxhdE1hcCgobGluZSwgaSkgPT4gKGxpbmUgPT09IC89IHlhbWwgPXwtLS0vZ2kgPyBpIDogW10pKS5maWx0ZXIoaSA9PiBpICE9PSB1bmRlZmluZWQpOyIsImRlcGVuZGVuY2llcyI6W119LHsiaWQiOiJGa2pqRjNvOFB1V3EySG5aYmtHOTQiLCJjb2RlIjoiREFUQS5zcGxpdCgnXFxuJykucmVkdWNlKChhY2MsIGxpbmUsIGkpID0+IHtcbiAgaWYgKC89IHlhbWwgPXwtLS0vZ2kudGVzdChsaW5lKSkge1xuICAgIGFjYy5wdXNoKGkpO1xuICB9XG4gIHJldHVybiBhY2M7XG59LCBbXSk7IiwiZGVwZW5kZW5jaWVzIjpbXX0seyJpZCI6Ik14NGtnUG52amZJblFybWVwMnZaZyIsImNvZGUiOiJjb25zdCBsaW5lcyA9IERBVEEuc3BsaXQoJ1xcbicpO1xuY29uc3QgaW5kaWNlcyA9IFtdO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gIGlmICgvPSB5YW1sID18LS0tL2dpLnRlc3QobGluZXNbaV0pKSB7XG4gICAgaW5kaWNlcy5wdXNoKGkpO1xuICB9XG59IiwiZGVwZW5kZW5jaWVzIjpbXX1dLCJjb25maWciOnsibmFtZSI6IlNpbXBsZSBleGFtcGxlIHRlc3QiLCJwYXJhbGxlbCI6dHJ1ZSwiZ2xvYmFsVGVzdENvbmZpZyI6eyJkZXBlbmRlbmNpZXMiOltdfSwiZGF0YUNvZGUiOiJyZXR1cm4gYFxuICAtLS1cbiAgYWJjZGVmZ2hpamtsbW5vcXByc3R1dnd4eXpcbiAgMTIzNDU2Nzg5MFxuICAgIC0tLVxuICBhYmNkZWZnaGlqa2xtbm9xcHJzdHV2d3h5elxuICAxMjM0NTY3ODkwXG4gICAgLS0tXG4gIGFiY2RlZmdoaWprbG1ub3FwcnN0dXZ3eHl6XG4gIDEyMzQ1Njc4OTBcbiAgICAtLS1cbiAgYWJjZGVmZ2hpamtsbW5vcXByc3R1dnd4eXpcbiAgMTIzNDU2Nzg5MFxuICAgIC0tLVxuICBhYmNkZWZnaGlqa2xtbm9xcHJzdHV2d3h5elxuICAxMjM0NTY3ODkwXG4gICAgLS0tXG4gIGFiY2RlZmdoaWprbG1ub3FwcnN0dXZ3eHl6XG4gIDEyMzQ1Njc4OTBcbiAgICAtLS1cbiAgYWJjZGVmZ2hpamtsbW5vcXByc3R1dnd4eXpcbiAgMTIzNDU2Nzg5MFxuICAgIC0tLVxuICBhYmNkZWZnaGlqa2xtbm9xcHJzdHV2d3h5elxuICAxMjM0NTY3ODkwXG4gICAgLS0tXG4gIGFiY2RlZmdoaWprbG1ub3FwcnN0dXZ3eHl6XG4gIDEyMzQ1Njc4OTBcbiAgICAtLS1cbiAgYWJjZGVmZ2hpamtsbW5vcXByc3R1dnd4eXpcbiAgMTIzNDU2Nzg5MFxuICAgIC0tLVxuICBhYmNkZWZnaGlqa2xtbm9xcHJzdHV2d3h5elxuICAxMjM0NTY3ODkwXG5gOyJ9fQ==
  // Could be refactored using above benchmarks to speed up process.

  // Used to only match delimiters that are not inside strings.
  const frontMatterIndexes = matchOutsideStrings(blog, new RegExp(encodedDelimiter, 'g'));

  // Contains no front matter, fall back to metadata
  if (frontMatterIndexes.length < 2) {
    return {
      blog,
      frontMatter: metadata ?? null,
    };
  }

  const frontMatter = blog.slice(0, (frontMatterIndexes[1] || 0) + delimiter.length);
  const processedBlog = blog.slice((frontMatterIndexes[1] || 0) + delimiter.length).trim();

  if (frontMatter.length <= delimiter.length * 2) {
    return {
      blog,
      frontMatter: metadata ?? null,
    };
  }

  if (!showFrontMatter) {
    return {
      blog: processedBlog,
      frontMatter: null,
    };
  }

  let processedFrontMatter: FrontMatter;
  try {
    processedFrontMatter = yaml.load(
      frontMatter.trim().slice(delimiter.length, -delimiter.length)
    ) as FrontMatter;
  } catch (error) {
    processedFrontMatter = { error: 'Incorrectly formatted Front Matter' } as FrontMatter;
  }

  return { blog: processedBlog, frontMatter: processedFrontMatter };
};

export default processBlog;
