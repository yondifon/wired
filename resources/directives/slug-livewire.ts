export function registerSlugLivewire(Livewire: any) {
  Livewire.directive("slug", ({ el, directive, component, cleanup }: any) => {
    const separator =
      directive.modifiers.length > 0 ? directive.modifiers[0] : "-";
    const sourceFields = directive.expression
      .trim()
      .split(",")
      .map((f: string) => f.trim());
    const inputEl = el as HTMLInputElement;

    const toSlug = (text: string): string =>
      text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, separator)
        .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "")
        .replace(new RegExp(`${separator}{2,}`, "g"), separator);

    let lastExpectedSlug = "";

    const getCurrentSlug = () =>
      toSlug(
        sourceFields
          .map((f: string) => component.$wire.get(f))
          .filter(Boolean)
          .join(" "),
      );

    const initialSlug = getCurrentSlug();
    if (!inputEl.value && initialSlug) {
      lastExpectedSlug = initialSlug;
      inputEl.value = lastExpectedSlug;
      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const stopWatches = sourceFields.map((field: string) =>
      component.$wire.$watch(field, () => {
        const shouldUpdate =
          !inputEl.value || inputEl.value === lastExpectedSlug;
        if (!shouldUpdate) return;
        lastExpectedSlug = getCurrentSlug();
        inputEl.value = lastExpectedSlug;
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
      }),
    );

    const handleManualInput = () => {
      const cursorPos = inputEl.selectionStart ?? 0;
      const currentValue = inputEl.value;
      const slugified = toSlug(currentValue);

      if (currentValue !== slugified) {
        inputEl.value = slugified;
        const newPos = Math.min(cursorPos, slugified.length);
        inputEl.setSelectionRange(newPos, newPos);
      }
    };

    inputEl.addEventListener("blur", handleManualInput);

    cleanup(() => {
      stopWatches.forEach((stop: Function) => stop());
      inputEl.removeEventListener("blur", handleManualInput);
    });
  });
}
