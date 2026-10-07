const availableOperations = ["toBase64", "fromBase64", "rot13", "urlEncode", "urlDecode", "sha256"];

let recipe = [];
window.recipe = recipe;

function renderOperationList() {
    const container = document.getElementById("operation-list");
    container.innerHTML = "";

    for (const opName of availableOperations) {
        const button = document.createElement("button");
        button.textContent = opName;
        button.onclick = () => addToRecipe(opName);
        container.appendChild(button);
    }
}

function addToRecipe(opName) {
    recipe.push({ name: opName, params: {} });
    window.recipe = recipe;
    renderRecipeList();
}

function removeFromRecipe(index) {
    recipe.splice(index, 1);
    window.recipe = recipe;
    renderRecipeList();
}

function renderRecipeList() {
    const container = document.getElementById("recipe-list");
    container.innerHTML = "";

    recipe.forEach((step, index) => {
        const row = document.createElement("div");
        row.className = "recipe-step";

        const label = document.createElement("span");
        label.textContent = step.name;

        const removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.className = "remove-btn";
        removeButton.onclick = () => removeFromRecipe(index);

        row.appendChild(label);
        row.appendChild(removeButton);
        container.appendChild(row);
    });

    const vizBtn = document.getElementById("visualize-button");
    if (vizBtn) {
        if (recipe.length > 0) {
            vizBtn.style.display = "block";
        } else {
            vizBtn.style.display = "none";
            const vizBox = document.getElementById("base64-visualization");
            if (vizBox) vizBox.style.display = "none";
        }
    }
}

async function bake() {
    const input = document.getElementById("input-box").value;

    try {
        const response = await fetch("/api/bake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: input, recipe: recipe })
        });

        const data = await response.json();
        document.getElementById("output-box").value = (data && data.output !== undefined && data.output !== null) ? data.output : "";
    } catch (e) {
        console.error("Bake error:", e);
        document.getElementById("output-box").value = "";
    }
}

document.getElementById("bake-button").onclick = bake;

const vizBtn = document.getElementById("visualize-button");
if (vizBtn) {
    vizBtn.onclick = async () => {
        await bake();
        const selectedOp = recipe.length > 0 ? recipe[recipe.length - 1].name : null;
        if (typeof window.showOperationVisualization === "function") {
            window.showOperationVisualization(selectedOp);
        }
    };
}

renderOperationList();