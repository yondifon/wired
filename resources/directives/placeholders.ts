const resolveInputElement = (el: HTMLElement): HTMLElement => {
  const tag = el.tagName?.toUpperCase();

  if (tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable) {
    return el;
  }

  return (
    el.querySelector("input, textarea, [contenteditable]") ||
    el.parentElement?.querySelector("input, textarea, [contenteditable]") ||
    el
  );
};

const parsePlaceholders = (expression: string): string[] =>
  expression
    .split(",")
    .map((placeholder) => placeholder.trim())
    .filter(Boolean);

export function registerPlaceholders(Alpine: any) {
  Alpine.directive(
    "placeholders",
    (el: HTMLElement, { expression }: any, { effect }: any) => {
      const placeholders = parsePlaceholders(expression);
      let menuEl: HTMLDivElement | null = null;
      let isOpen = false;
      let searchText = "";

      const getInputEl = () =>
        resolveInputElement(el) as HTMLInputElement | HTMLTextAreaElement;

      const getNativeValue = (input: HTMLTextAreaElement): string => {
        const descriptor = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        );
        return descriptor?.get?.call(input) ?? "";
      };

      const setNativeValue = (input: HTMLTextAreaElement, value: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        );
        descriptor?.set?.call(input, value);
      };

      const getValue = (): string => {
        const input = getInputEl();
        const tag = input.tagName?.toUpperCase();

        if (tag === "TEXTAREA") {
          return getNativeValue(input as HTMLTextAreaElement);
        }

        return (input as HTMLInputElement).isContentEditable
          ? input.innerText
          : (input as HTMLInputElement).value;
      };

      const setValue = (value: string) => {
        const input = getInputEl();
        const tag = input.tagName?.toUpperCase();

        if (tag === "TEXTAREA") {
          setNativeValue(input as HTMLTextAreaElement, value);
        } else if (input.isContentEditable) {
          input.innerText = value;
        } else {
          (input as HTMLInputElement).value = value;
        }
      };

      const getCursorPosition = (): number =>
        (getInputEl() as HTMLInputElement).selectionStart ?? 0;

      const setCursorPosition = (position: number) => {
        const input = getInputEl() as HTMLInputElement;
        input.setSelectionRange?.(position, position);
      };

      const getMatchingItems = (): string[] => {
        if (!searchText) return placeholders;
        return placeholders.filter((p) =>
          p.toLowerCase().includes(searchText.toLowerCase()),
        );
      };

      const showMenu = () => {
        if (menuEl) menuEl.style.display = "block";
      };

      const hideMenu = () => {
        if (menuEl) menuEl.style.display = "none";
      };

      const buildMenu = () => {
        if (!menuEl) return;
        menuEl.innerHTML = "";
        const items = getMatchingItems();

        if (!items.length) {
          hideMenu();
          return;
        }

        items.forEach((name) => {
          const item = document.createElement("div");
          item.textContent = `{${name}}`;
          item.className =
            "px-2 py-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700";
          item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            insertPlaceholder(name);
          });
          menuEl!.appendChild(item);
        });

        showMenu();
      };

      const closeMenu = () => {
        isOpen = false;
        searchText = "";
        hideMenu();
      };

      const openMenu = () => {
        isOpen = true;
        buildMenu();
      };

      const updateMenuState = () => {
        const value = getValue();
        const cursorPos = getCursorPosition();
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastOpenBrace = textBeforeCursor.lastIndexOf("{");
        const lastCloseBrace = textBeforeCursor.lastIndexOf("}");

        if (lastOpenBrace === -1 || lastCloseBrace > lastOpenBrace) {
          closeMenu();
          return;
        }

        searchText = textBeforeCursor.slice(lastOpenBrace + 1);
        openMenu();
      };

      const insertPlaceholder = (name: string) => {
        const input = getInputEl() as HTMLInputElement;
        const cursorPos = input.selectionStart ?? 0;
        const value = getValue();
        const textBeforeCursor = value.slice(0, cursorPos);
        const lastOpenBrace = textBeforeCursor.lastIndexOf("{");

        if (lastOpenBrace === -1) return;

        const before = value.slice(0, lastOpenBrace);
        const after = value.slice(cursorPos);
        const newValue = `${before}{${name}}${after}`;

        setValue(newValue);
        setCursorPosition(before.length + name.length + 2);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        closeMenu();
      };

      const handleKeydown = (e: KeyboardEvent) => {
        if (isOpen && e.key === "Escape") {
          e.preventDefault();
          closeMenu();
        }
      };

      const handleInput = () => updateMenuState();
      const handleClick = () => updateMenuState();
      const handleBlur = () => closeMenu();

      const initMenu = () => {
        menuEl = document.createElement("div");
        menuEl.className =
          "absolute z-50 mt-1 border bg-white dark:bg-zinc-800 text-sm shadow w-40";
        menuEl.style.display = "none";

        const input = getInputEl();
        input.parentElement!.style.position = "relative";
        input.parentElement!.appendChild(menuEl);
      };

      const cleanup = () => {
        const input = getInputEl();
        input.removeEventListener("input", handleInput);
        input.removeEventListener("click", handleClick);
        input.removeEventListener("keydown", handleKeydown);
        input.removeEventListener("blur", handleBlur);
        menuEl?.remove();
      };

      initMenu();
      const inputEl = getInputEl();
      inputEl.addEventListener("input", handleInput);
      inputEl.addEventListener("click", handleClick);
      inputEl.addEventListener("keydown", handleKeydown);
      inputEl.addEventListener("blur", handleBlur);

      effect(() => cleanup);
    },
  );
}
