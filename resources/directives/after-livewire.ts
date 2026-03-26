function inferActionName(el: Element): string {
  for (const { name, value } of Array.from(el.attributes)) {
    if (/^wire:(click|submit|keydown|keyup|change|input)/.test(name)) {
      return value.replace(/\(.*$/, "").trim();
    }
  }
  return "";
}

export function registerAfterLivewire(Livewire: any, Alpine: any) {
  Livewire.directive("after", ({ el, directive, component, cleanup }: any) => {
    const useFinish = directive.modifiers.includes("finish");
    const raw = directive.expression.trim();

    const commaIndex = raw.indexOf(",");
    const actionName = commaIndex !== -1
      ? raw.slice(0, commaIndex).trim()
      : inferActionName(el);
    const expression = commaIndex !== -1
      ? raw.slice(commaIndex + 1).trim()
      : raw;

    if (!actionName || !expression) return;

    const unsubscribe = component.$wire.intercept(actionName, ({ onSuccess, onFinish }: any) => {
      const hook = useFinish ? onFinish : onSuccess;
      hook(() => Alpine.evaluate(el, expression));
    });

    cleanup(unsubscribe);
  });
}
