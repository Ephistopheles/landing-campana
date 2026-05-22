import { useRef, useCallback } from "preact/hooks";

type ShuffleBags = Record<string, string[]>;

export function useShuffleBag() {
  const bags = useRef<ShuffleBags>({});

  const getFromBag = useCallback((key: string, sourceArray: string[]): string => {
    if (!bags.current[key] || bags.current[key].length === 0) {
      bags.current[key] = [...sourceArray].sort(() => Math.random() - 0.5);
    }
    return bags.current[key].pop()!;
  }, []);

  const resetBag = useCallback((key: string) => {
    delete bags.current[key];
  }, []);

  const resetAll = useCallback(() => {
    bags.current = {};
  }, []);

  return { getFromBag, resetBag, resetAll };
}
