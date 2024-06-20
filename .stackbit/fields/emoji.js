// Safely initialize the stackbit object
window.stackbit = window.stackbit || {};

window.stackbit.onUpdate = options => {
  // Helper function to get the current value of the field. This is most useful
  // when a document has nested content fields.
  function getCurrentValue() {
    try {
      return options.fieldPath.reduce((acc, curr) => {
        const newValue = acc[curr];
        if ("items" in newValue) return newValue.items;
        if ("fields" in newValue) return newValue.fields;
        return newValue;
      }, options.document.fields).value;
    } catch (err) {
      return;
    }
  }

  // Use the init option to attach event listeners to elements within the custom
  // field.
  if (options.init) {
    const currentValue = getCurrentValue();
    // Highlight the currently selected emoji
    if (currentValue) {
      document
        .querySelector(`button[data-value="${currentValue}"]`)
        .classList.add("active");
    }

    // Set the desired size of the control.
    options.setDesiredControlSize({ width: 350, height: 60 });

    // Attach click event listeners to each button
    document.querySelectorAll("button").forEach(button =>
      button.addEventListener("click", event => {
        const value = event.target.dataset.value;
        // Update the document in the content source with the selected value
        options
          .updateDocument({
            operations: [
              {
                opType: "set",
                fieldPath: options.fieldPath,
                modelField: options.modelField,
                field: { type: options.fieldModel?.type ?? "string", value }
              }
            ]
          })
          // Highlight the selected emoji after content has been updated
          .then(() => {
            document
              .querySelectorAll("button")
              .forEach(button => button.classList.remove("active"));
            document
              .querySelector(`button[data-value="${value}"]`)
              .classList.add("active");
          })
          .catch(err => {
            console.error("Could not update emoji field", err);
          });
      })
    );
  }
};