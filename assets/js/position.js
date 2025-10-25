document.addEventListener("DOMContentLoaded", () => {
   // --- 1. Get DOM Elements ---
   const parentContainer = document.getElementById("parentContainer");
   const childItem = document.getElementById("childItem");
   const controls = document.querySelectorAll(".control");
   const codeSnippetParent = document.getElementById("codeSnippetParent");
   const codeSnippetChild = document.getElementById("codeSnippetChild");
   const resetBtn = document.getElementById("resetBtn");

   const defaultStyles = {
      parentPosition: false,
      position: "static",
      top: "auto",
      left: "auto",
      bottom: "auto",
      right: "auto",
   };

   // --- 2. Core Functions ---

   function applyStyles() {
      const styles = {};
      controls.forEach((control) => {
         const id = control.id.replace(/-/g, "_"); // e.g., parent-position -> parent_position
         styles[id] = control.type === "checkbox" ? control.checked : control.value;
      });

      // Apply Parent Style
      if (styles.parent_position) {
         parentContainer.classList.add("relative");
      } else {
         parentContainer.classList.remove("relative");
      }

      // Apply Child Styles
      childItem.className = "positioned-item"; // Reset classes
      childItem.classList.add(styles.position); // Add current position class

      childItem.style.position = styles.position;
      childItem.style.top = styles.top || "auto";
      childItem.style.left = styles.left || "auto";
      childItem.style.bottom = styles.bottom || "auto";
      childItem.style.right = styles.right || "auto";

      updateCodeSnippets(styles);
   }

   function updateCodeSnippets(styles) {
      const parentPos = styles.parent_position ? "relative" : "static";

      // We need to get the computed style for the code snippet colors
      const computedStyle = getComputedStyle(document.body);
      const commentColor = computedStyle.getPropertyValue("--code-comment");
      const propColor = computedStyle.getPropertyValue("--code-property");
      const valColor = computedStyle.getPropertyValue("--code-value");

      codeSnippetParent.innerHTML = `
<span class="comment" style="color: ${commentColor}">/* Parent Styles */</span>
<span class="property" style="color: ${propColor}">.parent</span> {
  <span class="property" style="color: ${propColor}">position</span>: <span class="value" style="color: ${valColor}">${parentPos}</span>;
}`;

      codeSnippetChild.innerHTML = `
<span class="comment" style="color: ${commentColor}">/* Child Styles */</span>
<span class="property" style="color: ${propColor}">.child</span> {
  <span class="property" style="color: ${propColor}">position</span>: <span class="value" style="color: ${valColor}">${
         styles.position
      }</span>;
  <span class="property" style="color: ${propColor}">top</span>: <span class="value" style="color: ${valColor}">${
         styles.top || "auto"
      }</span>;
  <span class="property" style="color: ${propColor}">left</span>: <span class="value" style="color: ${valColor}">${
         styles.left || "auto"
      }</span>;
  <span class="property" style="color: ${propColor}">bottom</span>: <span class="value" style="color: ${valColor}">${
         styles.bottom || "auto"
      }</span>;
  <span class="property" style="color: ${propColor}">right</span>: <span class="value" style="color: ${valColor}">${
         styles.right || "auto"
      }</span>;
}`;
   }

   function resetAll() {
      document.getElementById("parent-position").checked = defaultStyles.parentPosition;
      document.getElementById("position").value = defaultStyles.position;
      document.getElementById("top").value = defaultStyles.top;
      document.getElementById("left").value = defaultStyles.left;
      document.getElementById("bottom").value = defaultStyles.bottom;
      document.getElementById("right").value = defaultStyles.right;
      applyStyles();
   }

   /*
    * Update code snippets if the color scheme changes,
    * otherwise they will show the old theme's colors.
    */
   window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      applyStyles(); // Re-apply to get new colors
   });

   // --- 3. Event Listeners ---
   controls.forEach((control) => {
      const eventType = control.type === "range" || control.type === "text" ? "input" : "change";
      control.addEventListener(eventType, applyStyles);
   });

   resetBtn.addEventListener("click", resetAll);

   // --- 4. Initial Run ---
   resetAll();
});
