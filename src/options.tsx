import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { useChromeStorageSync } from "./utils/useChromeStorageSync";
import { ALWAYS_CANONICALIZE_OPTION_NAME, Options } from "./utils/optionsSchema";

const Options = () => {
  const [savedOptions, saveOptions] = useChromeStorageSync<Options>([ALWAYS_CANONICALIZE_OPTION_NAME]);

  const status = useMemo(() => {
    switch (savedOptions._tag) {
      case 'Loading': return 'Loading...';
      case 'Saving': return 'Saving...';
      case 'Persisted': return 'Saved';
    }
  }, [savedOptions]);

  return (
    <>
      <div>
        <label>
          <input
            type="checkbox"
            disabled={savedOptions._tag !== 'Persisted'}
            checked={savedOptions._tag === 'Persisted' ? savedOptions.value[ALWAYS_CANONICALIZE_OPTION_NAME] : undefined}
            onChange={(event) => {
              saveOptions({
                [ALWAYS_CANONICALIZE_OPTION_NAME]: event.target.checked,
              });
            }}
          />

          Automatically canonlicalize
        </label>
      </div>

      <div>{status}</div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
