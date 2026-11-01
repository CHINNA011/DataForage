// ============================================================
// DataForge – script.js  (v7: SVG icons, no emojis)
// ============================================================

// ---- SVG icon library (inline, aria-hidden) ----------------

const ICONS = {
    // To Base64: stacked layers / encode arrow
    toBase64: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="3" y="13" width="16" height="3" rx="1.5" fill="currentColor" opacity=".55"/>
        <rect x="3" y="8"  width="16" height="3" rx="1.5" fill="currentColor" opacity=".75"/>
        <rect x="3" y="3"  width="16" height="3" rx="1.5" fill="currentColor"/>
        <path d="M16 17l3-3-3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // From Base64: decode arrow pointing inward
    fromBase64: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="3" y="13" width="16" height="3" rx="1.5" fill="currentColor" opacity=".55"/>
        <rect x="3" y="8"  width="16" height="3" rx="1.5" fill="currentColor" opacity=".75"/>
        <rect x="3" y="3"  width="16" height="3" rx="1.5" fill="currentColor"/>
        <path d="M6 17l-3-3 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // URL Encode: chain link
    urlEncode: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M8.5 13.5a4.5 4.5 0 0 0 6.364 0l2.121-2.121a4.5 4.5 0 0 0-6.364-6.364l-1.06 1.06" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M13.5 8.5a4.5 4.5 0 0 0-6.364 0L5.015 10.621a4.5 4.5 0 0 0 6.364 6.364l1.06-1.06" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    // URL Decode: broken/open link
    urlDecode: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M8.5 13.5a4.5 4.5 0 0 0 6.364 0l2.121-2.121a4.5 4.5 0 0 0-6.364-6.364" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 2"/>
        <path d="M13.5 8.5a4.5 4.5 0 0 0-6.364 0L5.015 10.621a4.5 4.5 0 0 0 6.364 6.364" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 2"/>
    </svg>`,

    // ROT13: rotating arrows / cipher wheel
    rot13: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M4 11a7 7 0 0 1 7-7 7 7 0 0 1 5 2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M18 11a7 7 0 0 1-7 7 7 7 0 0 1-5-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 4l3 2-2 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 18l-3-2 2-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // SHA-256: fingerprint / hash
    sha256: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 3C7 3 4 6 4 9.5S7 18 11 19c4-1 7-6 7-9.5S15 3 11 3z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        <path d="M8 10h6M8 13h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M11 7v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    // Generic / unknown operation
    generic: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="M9 9a2 2 0 1 1 4 0c0 1.5-2 2-2 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="11" cy="16" r="1" fill="currentColor"/>
    </svg>`
};

// ---- Example SVG icons (one per example theme) ------------

const EXAMPLE_ICONS = {
    fingerprint: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M7.5 2C4.5 2 2 4.5 2 7.5S4.5 13 7.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M5 7.5a2.5 2.5 0 0 1 5 0c0 2-2 3-2.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10 5.5a3.5 3.5 0 0 1 1 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    web: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M2 7.5h11M7.5 2c-2 2-2 8 0 11M7.5 2c2 2 2 8 0 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    encode: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <rect x="2" y="9" width="11" height="2" rx="1" fill="currentColor" opacity=".5"/>
        <rect x="2" y="5.5" width="11" height="2" rx="1" fill="currentColor" opacity=".75"/>
        <rect x="2" y="2" width="11" height="2" rx="1" fill="currentColor"/>
    </svg>`,
    cipher: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M3 7.5a4.5 4.5 0 0 1 4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 7.5a4.5 4.5 0 0 1-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M11 3l2 1.5-1.5 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 12l-2-1.5 1.5-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
};

// ---- Operation metadata ------------------------------------

const OPERATIONS = {
    toBase64:   { label: "To Base64",   iconKey: "toBase64",   group: "Encoding", tone: "teal",   blurb: "Rewrite text using only safe letters and digits." },
    fromBase64: { label: "From Base64", iconKey: "fromBase64", group: "Encoding", tone: "teal",   blurb: "Turn Base64 text back into normal text." },
    urlEncode:  { label: "URL encode",  iconKey: "urlEncode",  group: "Web",      tone: "blue",   blurb: "Make text safe to put in a web address." },
    urlDecode:  { label: "URL decode",  iconKey: "urlDecode",  group: "Web",      tone: "blue",   blurb: "Read web-address text as normal text again." },
    rot13:      { label: "ROT13",       iconKey: "rot13",      group: "Cipher",   tone: "pink",   blurb: "Swap every letter with the one 13 places later." },
    sha256:     { label: "SHA-256",     iconKey: "sha256",     group: "Hashing",  tone: "orange", blurb: "Turn any text into a unique 64-character fingerprint." }
};

const availableOperations = Object.keys(OPERATIONS);

// ---- Example recipes ---------------------------------------

const EXAMPLES = [
    { iconKey: "fingerprint", title: "Fingerprint, then Base64, then ROT13", input: "hello",            steps: ["sha256", "toBase64", "rot13"] },
    { iconKey: "web",         title: "Make text web-safe",                   input: "fish & chips?",    steps: ["urlEncode"] },
    { iconKey: "encode",      title: "Hide text with Base64",                input: "Hello, DataForge!", steps: ["toBase64"] },
    { iconKey: "cipher",      title: "Secret letters",                       input: "Meet me at noon",  steps: ["rot13"] }
];

let recipe = [];

// Make the current recipe available to visualization.js
window.recipe = recipe;

// Stores the last bake result so the Visualization button can use it
// without triggering another server round-trip.
let lastBakeSteps = null;

// ---- Helper: create SVG element from string ----------------

function svgEl(svgString) {
    const template = document.createElement("template");
    template.innerHTML = svgString.trim();
    return template.content.firstChild;
}

// ---- Output empty-state management -------------------------

function setOutputEmpty(isEmpty) {
    const emptyState = document.getElementById("output-empty-state");
    const outputBox  = document.getElementById("output-box");
    if (!emptyState) return;
    if (isEmpty) {
        emptyState.removeAttribute("aria-hidden");
        emptyState.classList.remove("fade-out");
        outputBox.classList.remove("has-content");
    } else {
        emptyState.setAttribute("aria-hidden", "true");
        emptyState.classList.add("fade-out");
        outputBox.classList.add("has-content");
    }
}

// ---- Render operations list --------------------------------

function renderOperationList() {
    const container = document.getElementById("operation-list");
    container.replaceChildren();

    for (const opName of availableOperations) {
        const op = OPERATIONS[opName];

        const button = document.createElement("button");
        button.type = "button";
        button.className = "op-card tone-" + op.tone;
        button.title = "Add " + op.label + " to your recipe";
        button.onclick = () => addToRecipe(opName);

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "op-icon";
        iconWrapper.setAttribute("aria-hidden", "true");
        iconWrapper.appendChild(svgEl(ICONS[op.iconKey] || ICONS.generic));

        const text = document.createElement("span");
        text.className = "op-text";

        const name = document.createElement("b");
        name.textContent = op.label;

        const blurb = document.createElement("small");
        blurb.textContent = op.blurb;

        text.append(name, blurb);

        const tag = document.createElement("span");
        tag.className = "op-tag";
        tag.textContent = op.group;

        const plus = document.createElement("span");
        plus.className = "op-plus";
        plus.setAttribute("aria-hidden", "true");
        plus.textContent = "+";

        button.append(iconWrapper, text, tag, plus);
        container.appendChild(button);
    }
}

// ---- Render example chips ----------------------------------

function renderExamples() {
    const container = document.getElementById("example-list");
    container.replaceChildren();

    for (const example of EXAMPLES) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "example-chip";

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "example-chip-icon";
        iconWrapper.setAttribute("aria-hidden", "true");
        iconWrapper.appendChild(svgEl(EXAMPLE_ICONS[example.iconKey] || EXAMPLE_ICONS.encode));

        const labelSpan = document.createElement("span");
        labelSpan.textContent = example.title;

        button.append(iconWrapper, labelSpan);
        button.onclick = () => loadExample(example);
        container.appendChild(button);
    }
}

// ---- Load an example into the recipe -----------------------

function loadExample(example) {
    recipe = example.steps.map((name) => ({ name: name, params: {} }));

    // Keep visualization.js synchronized with the new recipe array.
    window.recipe = recipe;

    document.getElementById("input-box").value = example.input;

    renderRecipeList(false);
    bake();
}

// ---- Add / remove steps ------------------------------------

// Helper to completely clear and reset the visualization & explanation section.
function clearVisualizationState() {
    lastBakeSteps = null;
    const explanation = document.getElementById("explanation");
    if (explanation) {
        explanation.hidden = true;
    }
    const story = document.getElementById("recipe-story");
    if (story) {
        story.replaceChildren();
    }
    const lesson = document.getElementById("lesson");
    if (lesson) {
        lesson.hidden = true;
    }
    const body = document.getElementById("explanation-body");
    if (body) {
        body.replaceChildren();
    }
}

function addToRecipe(opName) {
    recipe.push({ name: opName, params: {} });

    // Keep global recipe synchronized.
    window.recipe = recipe;

    renderRecipeList(true);
}

function removeFromRecipe(index) {
    recipe.splice(index, 1);

    // Keep global recipe synchronized.
    window.recipe = recipe;

    // Immediately clear all visualization and stale input/output text
    clearVisualizationState();

    if (recipe.length === 0) {
        // Recipe is now empty: clear input box, output box, and reset empty state
        const inputBox = document.getElementById("input-box");
        if (inputBox) {
            inputBox.value = "";
        }
        const outputBox = document.getElementById("output-box");
        if (outputBox) {
            outputBox.value = "";
        }
        setOutputEmpty(true);
    } else {
        // Automatically re-bake with remaining operations so output stays accurate
        bake();
    }

    renderRecipeList(true);
}

// ---- Render the recipe list --------------------------------
// resetLesson: the lesson shown below belongs to the old recipe,
// so hide it when the recipe changes.

function renderRecipeList(resetLesson) {
    const container = document.getElementById("recipe-list");
    container.replaceChildren();

    if (resetLesson) {
        clearVisualizationState();
    }

    const visualizeButton = document.getElementById("visualize-button");

    if (recipe.length === 0) {
        const empty = document.createElement("div");
        empty.className = "recipe-empty";
        empty.textContent = "Your recipe is empty. Pick an operation on the left, or try an example above.";
        container.appendChild(empty);

        clearVisualizationState();
        return;
    }

    recipe.forEach((step, index) => {
        const op = OPERATIONS[step.name] || {
            label: step.name,
            iconKey: "generic",
            tone: "blue"
        };

        const row = document.createElement("div");
        row.className = "recipe-step tone-" + op.tone;
        // Trigger CSS entrance animation
        row.style.animationDelay = (index * 40) + "ms";

        const number = document.createElement("span");
        number.className = "recipe-num";
        number.textContent = String(index + 1);

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "recipe-icon";
        iconWrapper.setAttribute("aria-hidden", "true");
        iconWrapper.appendChild(svgEl(ICONS[op.iconKey] || ICONS.generic));

        const label = document.createElement("span");
        label.className = "recipe-label";
        label.textContent = op.label;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-btn";
        removeButton.title = "Remove this step";
        removeButton.setAttribute("aria-label", "Remove " + op.label);
        // Use an × SVG instead of a text character
        removeButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
        removeButton.onclick = () => removeFromRecipe(index);

        row.append(number, iconWrapper, label, removeButton);
        container.appendChild(row);
    });
}

// ---- Bake --------------------------------------------------

async function bake() {
    const input      = document.getElementById("input-box").value;
    const outputBox  = document.getElementById("output-box");
    const bakeButton = document.getElementById("bake-button");

    bakeButton.disabled = true;
    bakeButton.innerHTML = `
        <svg class="btn-icon spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" stroke-dasharray="30 14" stroke-linecap="round"/>
        </svg>
        Baking…`;

    try {
        const response = await fetch("/api/bake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: input, recipe: recipe })
        });

        if (!response.ok) {
            outputBox.value = "Something went wrong on the server (" + response.status + "). "
                + "Check that the input suits the recipe, for example From Base64 needs real Base64 text.";
            setOutputEmpty(false);
            document.getElementById("explanation").hidden = true;
            return;
        }

        const data = await response.json();

        // The server remains the single source of truth for the real result.
        outputBox.value = data.output;
        setOutputEmpty(false);

        // Strictly hide any explanation or visualization when baking:
        // Baking shows the output text only.
        clearVisualizationState();

        // Store steps for when the user clicks Visualize.
        lastBakeSteps = data.steps;
    } catch (error) {
        outputBox.value = "Could not reach the server. Is the app running at http://localhost:8080 ?";
        setOutputEmpty(false);
    } finally {
        bakeButton.disabled = false;
        bakeButton.innerHTML = `
            <svg class="btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Bake it`;
    }
}

// ---- Wire up buttons ---------------------------------------

// Main Bake button
document.getElementById("bake-button").onclick = bake;

// Visualization button:
// Shows the plain-English explanation panel for the current recipe.
const visualizeButton = document.getElementById("visualize-button");

if (visualizeButton) {
    visualizeButton.onclick = async () => {
        if (recipe.length === 0) {
            clearVisualizationState();
            const outputBox = document.getElementById("output-box");
            if (outputBox) {
                outputBox.value = "Your recipe is empty. Pick an operation first.";
                setOutputEmpty(false);
            }
            return;
        }

        // If we don't have fresh bake results, run bake first.
        if (!lastBakeSteps) {
            await bake();
        }

        // Show the plain-English explanation panel.
        if (lastBakeSteps && lastBakeSteps.length > 0) {
            renderExplanation(lastBakeSteps);
            const explanation = document.getElementById("explanation");
            if (explanation) {
                explanation.hidden = false;
                explanation.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    };
}

// Clear visualization when user modifies the input text so old text is never shown
const inputBox = document.getElementById("input-box");
if (inputBox) {
    inputBox.addEventListener("input", () => {
        clearVisualizationState();
        if (!inputBox.value.trim()) {
            const outputBox = document.getElementById("output-box");
            if (outputBox) {
                outputBox.value = "";
            }
            setOutputEmpty(true);
        }
    });
}

// ---- Initial render ----------------------------------------

renderOperationList();
renderExamples();
renderRecipeList(false);
setOutputEmpty(true);
