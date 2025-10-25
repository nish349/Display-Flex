document.addEventListener("DOMContentLoaded", () => {
   // --- 1. Get DOM Elements ---
   const flexContainer = document.getElementById("flexContainer");
   const controls = document.querySelectorAll(".control");
   const itemControls = document.querySelectorAll(".item-control");
   const addItemBtn = document.getElementById("addItemBtn");
   const removeItemBtn = document.getElementById("removeItemBtn");
   const resetBtn = document.getElementById("resetBtn");
   const codeSnippetContainer = document.getElementById("codeSnippetContainer");
   const codeSnippetItem = document.getElementById("codeSnippetItem");
   const selectedItemLabel = document.getElementById("selected-item-label");
   const challengeToggles = document.querySelectorAll(".toggle-solution");

   let selectedItem = null;
   let itemCount = 3;

   const defaultContainerStyles = {
      "flex-direction": "row",
      "justify-content": "flex-start",
      "align-items": "stretch",
      "flex-wrap": "nowrap",
      "align-content": "stretch",
      gap: "10",
   };

   const defaultItemStyles = {
      order: "0",
      "flex-grow": "0",
      "flex-shrink": "1",
      "flex-basis": "auto",
      "align-self": "auto",
   };

   // --- 2. Core Functions ---

   /**
    * Applies all container styles from controls to the flex container.
    */
   function applyContainerStyles() {
      const styles = {};
      controls.forEach((control) => {
         styles[control.id] = control.value;
      });

      flexContainer.style.flexDirection = styles["flex-direction"];
      flexContainer.style.justifyContent = styles["justify-content"];
      flexContainer.style.alignItems = styles["align-items"];
      flexContainer.style.flexWrap = styles["flex-wrap"];
      flexContainer.style.alignContent = styles["align-content"];
      flexContainer.style.gap = `${styles["gap"]}px`;

      updateCodeSnippets();
   }

   /**
    * Applies all item styles from controls to the selected item.
    */
   function applyItemStyles() {
      if (!selectedItem) return;

      const styles = {};
      itemControls.forEach((control) => {
         styles[control.id] = control.value;
      });

      selectedItem.style.order = styles["order"];
      selectedItem.style.flexGrow = styles["flex-grow"];
      selectedItem.style.flexShrink = styles["flex-shrink"];
      selectedItem.style.flexBasis = styles["flex-basis"];
      selectedItem.style.alignSelf = styles["align-self"];

      updateCodeSnippets();
   }

   /**
    * Updates the code snippet blocks with current styles.
    */
   function updateCodeSnippets() {
      // Update Container Snippet
      codeSnippetContainer.innerHTML = `
<span class="comment">/* Container Styles */</span>
<span class="property">.container</span> {
  <span class="property">display</span>: <span class="value">flex</span>;
  <span class="property">flex-direction</span>: <span class="value">${
     flexContainer.style.flexDirection || "row"
  }</span>;
  <span class="property">justify-content</span>: <span class="value">${
     flexContainer.style.justifyContent || "flex-start"
  }</span>;
  <span class="property">align-items</span>: <span class="value">${flexContainer.style.alignItems || "stretch"}</span>;
  <span class="property">flex-wrap</span>: <span class="value">${flexContainer.style.flexWrap || "nowrap"}</span>;
  <span class="property">align-content</span>: <span class="value">${
     flexContainer.style.alignContent || "stretch"
  }</span>;
  <span class="property">gap</span>: <span class="value">${flexContainer.style.gap || "10px"}</span>;
}`;

      // Update Item Snippet
      if (selectedItem) {
         codeSnippetItem.style.display = "block";
         codeSnippetItem.innerHTML = `
<span class="comment">/* Styles for Item ${selectedItem.dataset.item} */</span>
<span class="property">.item-${selectedItem.dataset.item}</span> {
  <span class="property">order</span>: <span class="value">${selectedItem.style.order || "0"}</span>;
  <span class="property">flex-grow</span>: <span class="value">${selectedItem.style.flexGrow || "0"}</span>;
  <span class="property">flex-shrink</span>: <span class="value">${selectedItem.style.flexShrink || "1"}</span>;
  <span class="property">flex-basis</span>: <span class="value">${selectedItem.style.flexBasis || "auto"}</span>;
  <span class="property">align-self</span>: <span class="value">${selectedItem.style.alignSelf || "auto"}</span>;
}`;
      } else {
         codeSnippetItem.style.display = "none";
      }
   }

   /**
    * Handles clicking on a flex item to select it.
    */
   function selectItem(e) {
      // Check if the click is on an item, not the container
      if (!e.target.classList.contains("flex-item")) {
         deselectAllItems();
         return;
      }

      const newSelectedItem = e.target;

      // If clicking the already selected item, deselect it
      if (selectedItem === newSelectedItem) {
         deselectAllItems();
         return;
      }

      // Deselect previous
      deselectAllItems(false); // don't clear controls yet

      // Select new
      selectedItem = newSelectedItem;
      selectedItem.classList.add("selected");
      selectedItemLabel.textContent = `Editing Item ${selectedItem.dataset.item}`;

      // Populate controls with the item's current styles
      document.getElementById("order").value = selectedItem.style.order || "0";
      document.getElementById("flex-grow").value = selectedItem.style.flexGrow || "0";
      document.getElementById("flex-shrink").value = selectedItem.style.flexShrink || "1";
      document.getElementById("flex-basis").value = selectedItem.style.flexBasis || "auto";
      document.getElementById("align-self").value = selectedItem.style.alignSelf || "auto";

      // Enable item controls
      itemControls.forEach((control) => (control.disabled = false));
      updateCodeSnippets();
   }

   /**
    * Deselects any currently selected item.
    */
   function deselectAllItems(clearControls = true) {
      if (selectedItem) {
         selectedItem.classList.remove("selected");
      }
      selectedItem = null;
      selectedItemLabel.textContent = "No item selected";

      // Disable and reset item controls
      itemControls.forEach((control) => {
         control.disabled = true;
         if (clearControls) {
            control.value = defaultItemStyles[control.id];
         }
      });

      if (clearControls) {
         updateCodeSnippets();
      }
   }

   /**
    * Adds a new flex item to the container.
    */
   function addItem() {
      itemCount++;
      const newItem = document.createElement("div");
      newItem.classList.add("flex-item");
      newItem.dataset.item = itemCount;
      newItem.textContent = itemCount;
      flexContainer.appendChild(newItem);
   }

   /**
    * Removes the last flex item from the container.
    */
   function removeItem() {
      if (itemCount <= 0) return;

      const lastItem = flexContainer.lastElementChild;
      if (lastItem) {
         if (lastItem === selectedItem) {
            deselectAllItems();
         }
         flexContainer.removeChild(lastItem);
         itemCount--;
      }
   }

   /**
    * Resets the entire playground to its default state.
    */
   function resetPlayground() {
      // Reset container controls
      controls.forEach((control) => {
         control.value = defaultContainerStyles[control.id];
      });

      // Reset container styles
      applyContainerStyles();

      // Deselect and reset item controls
      deselectAllItems(true);

      // Reset all item styles
      flexContainer.querySelectorAll(".flex-item").forEach((item) => {
         item.style.order = defaultItemStyles["order"];
         item.style.flexGrow = defaultItemStyles["flex-grow"];
         item.style.flexShrink = defaultItemStyles["flex-shrink"];
         item.style.flexBasis = defaultItemStyles["flex-basis"];
         item.style.alignSelf = defaultItemStyles["align-self"];
      });

      updateCodeSnippets();
   }

   // --- 3. Event Listeners ---

   // Container controls
   controls.forEach((control) => {
      const eventType = control.type === "range" || control.type === "number" ? "input" : "change";
      control.addEventListener(eventType, applyContainerStyles);
   });

   // Item controls
   itemControls.forEach((control) => {
      const eventType =
         control.type === "range" || control.type === "number" || control.type === "text" ? "input" : "change";
      control.addEventListener(eventType, applyItemStyles);
   });

   // Item selection
   flexContainer.addEventListener("click", selectItem);

   // Item manager buttons
   addItemBtn.addEventListener("click", addItem);
   removeItemBtn.addEventListener("click", removeItem);
   resetBtn.addEventListener("click", resetPlayground);

   // Challenge toggles
   challengeToggles.forEach((button) => {
      button.addEventListener("click", () => {
         const solution = button.nextElementSibling;
         const isVisible = solution.style.display === "block";
         solution.style.display = isVisible ? "none" : "block";
         button.textContent = isVisible ? "Show Solution" : "Hide Solution";
      });
   });

   // --- 4. Initial Run ---
   resetPlayground(); // Set initial styles and code snippet
});
