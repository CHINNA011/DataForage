/* =========================================================
   DATAFORGE VISUALIZATION
   ---------------------------------------------------------
   - Uses the existing toBase64 card layout template.
   - Dynamic heading matching selected recipe operation.
   - Bake output is the SINGLE SOURCE OF TRUTH (step 05 output).
   - Only .conversion-scroll area scrolls table data.
========================================================= */

(function () {

    const VISUALIZATION_ID = "base64-visualization";
    const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /* =====================================================
       COMMON HELPERS
    ===================================================== */

    function getVisualization() {
        return document.getElementById(VISUALIZATION_ID);
    }

    function getInput() {
        const element = document.getElementById("input-box");
        return element ? element.value : "";
    }

    function getOutput() {
        const element = document.getElementById("output-box");
        return element ? element.value : "";
    }

    function clearVisualization() {
        const visualization = getVisualization();
        if (!visualization) return null;
        visualization.innerHTML = "";
        visualization.style.display = "block";
        return visualization;
    }

    function createTitle(operation) {
        const wrapper = document.createElement("div");
        wrapper.className = "visualization-title";

        const title = document.createElement("h2");
        title.textContent = operation;

        wrapper.appendChild(title);
        return wrapper;
    }

    function createSeries() {
        const series = document.createElement("div");
        series.className = "base64-series";
        return series;
    }

    function createStep(number, title) {
        const card = document.createElement("div");
        card.className = "base64-step";

        const numberElement = document.createElement("div");
        numberElement.className = "step-number";
        numberElement.textContent = String(number).padStart(2, "0");

        const heading = document.createElement("h3");
        heading.textContent = title;

        card.appendChild(numberElement);
        card.appendChild(heading);
        return card;
    }

    function createArrow() {
        const arrow = document.createElement("div");
        arrow.className = "series-arrow";
        arrow.textContent = "→";
        return arrow;
    }

    function createTable(headers, rows) {
        const scroll = document.createElement("div");
        scroll.className = "conversion-scroll";

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        rows.forEach(row => {
            const tr = document.createElement("tr");
            row.forEach(val => {
                const td = document.createElement("td");
                td.textContent = val;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        scroll.appendChild(table);

        return scroll;
    }

    function createOutputStep(number, output) {
        const card = createStep(number, "OUTPUT");
        card.classList.add("output-step");

        const result = document.createElement("div");
        result.id = "base64-result";
        const isValid = output !== undefined && output !== null && output !== "" && output !== "undefined";
        result.textContent = isValid ? output : "(no output yet)";

        card.appendChild(result);
        return card;
    }

    /* =====================================================
       1. TOBASE64 VISUALIZATION
    ===================================================== */

    function renderToBase64(container, input, output) {
        const series = createSeries();

        const encoder = new TextEncoder();
        const bytes = Array.from(encoder.encode(input || ""));

        // STEP 01: INPUT → BYTES
        const step1Rows = [];
        for (let i = 0; i < (input || "").length; i++) {
            const char = input[i];
            const charBytes = Array.from(encoder.encode(char));
            const hex = charBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(" ");
            const dec = charBytes.join(" ");
            step1Rows.push([char, dec, hex]);
        }
        const step1 = createStep(1, "INPUT → BYTES");
        step1.appendChild(createTable(["Character", "Byte(s)", "Hex"], step1Rows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: BYTES → BINARY
        const step2Rows = [];
        let bitStream = "";
        bytes.forEach(b => {
            const bin = b.toString(2).padStart(8, '0');
            step2Rows.push([b, bin]);
            bitStream += bin;
        });
        const step2 = createStep(2, "BYTES → BINARY");
        step2.appendChild(createTable(["Decimal", "8-bit Binary"], step2Rows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: 6-BIT GROUPING
        const step3Rows = [];
        const sixBitChunks = [];
        for (let i = 0; i < bitStream.length; i += 6) {
            let chunk = bitStream.substring(i, i + 6);
            if (chunk.length < 6) {
                chunk = chunk.padEnd(6, '0');
            }
            sixBitChunks.push(chunk);
            const index = parseInt(chunk, 2);
            step3Rows.push([chunk, index]);
        }
        const step3 = createStep(3, "6-BIT GROUPING");
        step3.appendChild(createTable(["6-bit Binary", "Index"], step3Rows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: BASE64 MAPPING
        const step4Rows = [];
        sixBitChunks.forEach(chunk => {
            const idx = parseInt(chunk, 2);
            const char = BASE64_ALPHABET[idx] || "=";
            step4Rows.push([chunk, idx, char]);
        });
        if (bytes.length % 3 === 1) {
            step4Rows.push(["Padding", "=", "="]);
            step4Rows.push(["Padding", "=", "="]);
        } else if (bytes.length % 3 === 2) {
            step4Rows.push(["Padding", "=", "="]);
        }
        const step4 = createStep(4, "BASE64 MAPPING");
        step4.appendChild(createTable(["6-bit", "Index", "Base64 Char"], step4Rows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT
        series.appendChild(createOutputStep(5, output));

        container.appendChild(series);
    }

    /* =====================================================
       2. FROMBASE64 VISUALIZATION
    ===================================================== */

    function renderFromBase64(container, input, output) {
        const series = createSeries();
        const cleaned = (input || "").replace(/\s/g, "");

        // STEP 01: BASE64 → INDEX
        const indexRows = [];
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            if (char === "=") {
                indexRows.push(["=", "Padding", "------"]);
                continue;
            }
            const idx = BASE64_ALPHABET.indexOf(char);
            if (idx === -1) continue;
            const bin = idx.toString(2).padStart(6, "0");
            indexRows.push([char, idx, bin]);
        }
        const step1 = createStep(1, "BASE64 → INDEX");
        step1.appendChild(createTable(["Character", "Index", "6-bit"], indexRows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: INDEX → 6-BIT
        const sixBitRows = [];
        let bitStream = "";
        indexRows.forEach(row => {
            if (row[2] !== "------") {
                sixBitRows.push([row[1], row[2]]);
                bitStream += row[2];
            }
        });
        const step2 = createStep(2, "INDEX → 6-BIT");
        step2.appendChild(createTable(["Index", "6-bit Binary"], sixBitRows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: 6-BIT → 8-BIT BYTES
        const byteRows = [];
        const bytes = [];
        const paddingMatch = cleaned.match(/=+$/);
        const paddingCount = paddingMatch ? paddingMatch[0].length : 0;
        let validBitsLen = bitStream.length - (paddingCount * 2);
        if (validBitsLen < 0) validBitsLen = 0;
        const validBits = bitStream.substring(0, validBitsLen);

        for (let i = 0; i + 8 <= validBits.length; i += 8) {
            const bin = validBits.substring(i, i + 8);
            const dec = parseInt(bin, 2);
            bytes.push(dec);
            byteRows.push([bin, dec]);
        }
        const step3 = createStep(3, "6-BIT → 8-BIT BYTES");
        step3.appendChild(createTable(["8-bit Binary", "Decimal Byte"], byteRows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: BYTES → TEXT
        let decodedText = "";
        try {
            decodedText = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
        } catch (e) {
            decodedText = bytes.map(b => String.fromCharCode(b)).join("");
        }
        const charRows = [];
        const encoder = new TextEncoder();
        for (let i = 0; i < decodedText.length; i++) {
            const ch = decodedText[i];
            const chBytes = Array.from(encoder.encode(ch));
            const decStr = chBytes.join(" ");
            let displayChar = ch;
            if (ch === "\n") displayChar = "\\n";
            else if (ch === "\r") displayChar = "\\r";
            else if (ch === "\t") displayChar = "\\t";
            charRows.push([decStr, displayChar]);
        }
        const step4 = createStep(4, "BYTES → TEXT");
        step4.appendChild(createTable(["Byte(s)", "Character"], charRows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT (Must equal Bake output, fallback to decodedText)
        const finalOutput = (output && output !== "undefined") ? output : decodedText;
        series.appendChild(createOutputStep(5, finalOutput));

        container.appendChild(series);
    }

    /* =====================================================
       3. ROT13 VISUALIZATION
    ===================================================== */

    function renderRot13(container, input, output) {
        const series = createSeries();
        const str = input || "";

        // STEP 01: INPUT CHARACTERS
        const step1Rows = [];
        for (let i = 0; i < str.length; i++) {
            step1Rows.push([i + 1, str[i]]);
        }
        const step1 = createStep(1, "INPUT CHARACTERS");
        step1.appendChild(createTable(["Position", "Character"], step1Rows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: ALPHABET POSITION
        const step2Rows = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            let pos = "Non-alpha";
            if (c >= 'a' && c <= 'z') pos = c.charCodeAt(0) - 97 + 1;
            else if (c >= 'A' && c <= 'Z') pos = c.charCodeAt(0) - 65 + 1;
            step2Rows.push([c, pos]);
        }
        const step2 = createStep(2, "ALPHABET POSITION");
        step2.appendChild(createTable(["Character", "Pos (1-26)"], step2Rows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: ROTATE BY 13
        const step3Rows = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c >= 'a' && c <= 'z') {
                const orig = c.charCodeAt(0) - 97 + 1;
                const newPos = (orig - 1 + 13) % 26 + 1;
                step3Rows.push([orig, "+13", newPos]);
            } else if (c >= 'A' && c <= 'Z') {
                const orig = c.charCodeAt(0) - 65 + 1;
                const newPos = (orig - 1 + 13) % 26 + 1;
                step3Rows.push([orig, "+13", newPos]);
            } else {
                step3Rows.push(["-", "No shift", "-"]);
            }
        }
        const step3 = createStep(3, "ROTATE BY 13");
        step3.appendChild(createTable(["Original Pos", "Shift", "New Pos"], step3Rows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: NEW CHARACTER
        const step4Rows = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            let rot = c;
            if (c >= 'a' && c <= 'z') rot = String.fromCharCode(97 + (c.charCodeAt(0) - 97 + 13) % 26);
            else if (c >= 'A' && c <= 'Z') rot = String.fromCharCode(65 + (c.charCodeAt(0) - 65 + 13) % 26);
            step4Rows.push([c, rot]);
        }
        const step4 = createStep(4, "NEW CHARACTER");
        step4.appendChild(createTable(["Original", "Rotated Char"], step4Rows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT
        series.appendChild(createOutputStep(5, output));

        container.appendChild(series);
    }

    /* =====================================================
       4. URL ENCODE VISUALIZATION
    ===================================================== */

    function renderUrlEncode(container, input, output) {
        const series = createSeries();
        const str = input || "";

        // STEP 01: INPUT TEXT
        const step1Rows = [];
        for (let i = 0; i < str.length; i++) {
            step1Rows.push([i + 1, str[i]]);
        }
        const step1 = createStep(1, "INPUT TEXT");
        step1.appendChild(createTable(["Index", "Character"], step1Rows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: CHARACTER ANALYSIS
        const step2Rows = [];
        const unreserved = /^[A-Za-z0-9\-_.~]$/;
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (unreserved.test(c)) {
                step2Rows.push([c, "Unreserved", "Keep literal"]);
            } else if (c === " ") {
                step2Rows.push(["Space", "Space", "Encode to + / %20"]);
            } else {
                step2Rows.push([c, "Special / Reserved", "Percent Encode"]);
            }
        }
        const step2 = createStep(2, "CHARACTER ANALYSIS");
        step2.appendChild(createTable(["Character", "Type", "Status"], step2Rows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: PERCENT ENCODING
        const step3Rows = [];
        const encoder = new TextEncoder();
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            const bytes = Array.from(encoder.encode(c));
            const hex = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(" ");
            let enc = encodeURIComponent(c);
            step3Rows.push([c, hex, enc]);
        }
        const step3 = createStep(3, "PERCENT ENCODING");
        step3.appendChild(createTable(["Character", "UTF-8 Bytes", "Encoded String"], step3Rows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: ENCODED REPRESENTATION
        const step4Rows = [];
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            step4Rows.push([c, encodeURIComponent(c)]);
        }
        const step4 = createStep(4, "ENCODED REPRESENTATION");
        step4.appendChild(createTable(["Original", "URL Encoded"], step4Rows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT
        series.appendChild(createOutputStep(5, output));

        container.appendChild(series);
    }

    /* =====================================================
       5. URL DECODE VISUALIZATION
    ===================================================== */

    function renderUrlDecode(container, input, output) {
        const series = createSeries();
        const str = input || "";

        // STEP 01: ENCODED INPUT
        const step1Rows = [];
        const tokens = str.match(/(%[0-9A-Fa-f]{2}|\+|[^%+]+)/g) || [];
        tokens.forEach((t, i) => {
            step1Rows.push([i + 1, t]);
        });
        const step1 = createStep(1, "ENCODED INPUT");
        step1.appendChild(createTable(["Index", "Segment"], step1Rows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: PERCENT SEQUENCES
        const step2Rows = [];
        tokens.forEach(t => {
            if (t.startsWith("%") && t.length === 3) {
                step2Rows.push([t, "Percent Encoded", t.substring(1).toUpperCase()]);
            } else if (t === "+") {
                step2Rows.push(["+", "Plus Space", "0x20"]);
            } else {
                step2Rows.push([t, "Literal Text", "ASCII / UTF-8"]);
            }
        });
        const step2 = createStep(2, "PERCENT SEQUENCES");
        step2.appendChild(createTable(["Token", "Type", "Hex Code"], step2Rows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: BYTE INTERPRETATION
        const step3Rows = [];
        tokens.forEach(t => {
            if (t.startsWith("%") && t.length === 3) {
                const dec = parseInt(t.substring(1), 16);
                let char = String.fromCharCode(dec);
                try { char = decodeURIComponent(t); } catch(e){}
                step3Rows.push([t, dec, char]);
            } else if (t === "+") {
                step3Rows.push(["+", 32, " "]);
            } else {
                step3Rows.push([t, "-", t]);
            }
        });
        const step3 = createStep(3, "BYTE INTERPRETATION");
        step3.appendChild(createTable(["Token", "Byte (Dec)", "Interpreted Char"], step3Rows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: DECODED TEXT
        const step4Rows = [];
        tokens.forEach(t => {
            let dec = t;
            try { dec = decodeURIComponent(t.replace(/\+/g, " ")); } catch(e){}
            step4Rows.push([t, dec]);
        });
        const step4 = createStep(4, "DECODED TEXT");
        step4.appendChild(createTable(["Encoded Part", "Decoded Part"], step4Rows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT
        series.appendChild(createOutputStep(5, output));

        container.appendChild(series);
    }

    /* =====================================================
       6. SHA256 VISUALIZATION
    ===================================================== */

    function renderSha256(container, input, output) {
        const series = createSeries();
        const str = input || "";

        // STEP 01: INPUT
        const step1Rows = [
            ["Input String", str],
            ["Character Length", str.length],
            ["Bit Length", str.length * 8]
        ];
        const step1 = createStep(1, "INPUT");
        step1.appendChild(createTable(["Property", "Value"], step1Rows));
        series.appendChild(step1);
        series.appendChild(createArrow());

        // STEP 02: MESSAGE PREPARATION
        const step2Rows = [
            ["Append '1' Bit", "Pad binary with 1 followed by zeros"],
            ["Pad to 448 Bits", "Length ≡ 448 (mod 512)"],
            ["Append 64-bit Length", "Original bit length as 64-bit big-endian"],
            ["Block Count", Math.ceil((str.length * 8 + 65) / 512) + " x 512-bit block(s)"]
        ];
        const step2 = createStep(2, "MESSAGE PREPARATION");
        step2.appendChild(createTable(["Phase", "Details"], step2Rows));
        series.appendChild(step2);
        series.appendChild(createArrow());

        // STEP 03: HASH PROCESSING
        const step3Rows = [
            ["Initial Hash H(0)", "8 32-bit words (fractional parts of square roots of first 8 primes)"],
            ["Message Schedule W", "Expand 16 words into 64 32-bit words"],
            ["64 Compression Rounds", "Functions Ch, Maj, Σ0, Σ1 with constants K[0..63]"]
        ];
        const step3 = createStep(3, "HASH PROCESSING");
        step3.appendChild(createTable(["Stage", "Operations"], step3Rows));
        series.appendChild(step3);
        series.appendChild(createArrow());

        // STEP 04: 256-BIT HASH
        const step4Rows = [
            ["Hash Bit Width", "256 bits"],
            ["Hex Output Length", "64 hex digits (32 bytes)"],
            ["Digest State", "Final H0..H7 concatenated in hex"]
        ];
        const step4 = createStep(4, "256-BIT HASH");
        step4.appendChild(createTable(["Format", "Value"], step4Rows));
        series.appendChild(step4);
        series.appendChild(createArrow());

        // STEP 05: OUTPUT
        series.appendChild(createOutputStep(5, output));

        container.appendChild(series);
    }

    /* =====================================================
       DISPATCHER & CURRENT OPERATION RESOLUTION
    ===================================================== */

    function getCurrentOperation() {
        if (typeof window.recipe !== "undefined" && Array.isArray(window.recipe) && window.recipe.length > 0) {
            return window.recipe[window.recipe.length - 1].name;
        }
        const steps = document.querySelectorAll("#recipe-list .recipe-step span");
        if (steps.length > 0) {
            return steps[steps.length - 1].textContent.trim();
        }
        return null;
    }

    function showOperationVisualization(opName) {
        const visualization = clearVisualization();
        if (!visualization) return;

        const operation = opName || getCurrentOperation();
        if (!operation) {
            console.log("No operation selected for visualization.");
            return;
        }

        const input = getInput();
        const output = getOutput();

        visualization.appendChild(createTitle(operation));

        switch (operation) {
            case "toBase64":
                renderToBase64(visualization, input, output);
                break;
            case "fromBase64":
                renderFromBase64(visualization, input, output);
                break;
            case "rot13":
                renderRot13(visualization, input, output);
                break;
            case "urlEncode":
                renderUrlEncode(visualization, input, output);
                break;
            case "urlDecode":
                renderUrlDecode(visualization, input, output);
                break;
            case "sha256":
                renderSha256(visualization, input, output);
                break;
            default:
                console.log("Unknown visualization operation:", operation);
                break;
        }
    }

    window.showOperationVisualization = showOperationVisualization;
    window.visualizeOperation = showOperationVisualization;
    window.renderToBase64 = renderToBase64;
    window.renderFromBase64 = renderFromBase64;
    window.renderRot13 = renderRot13;
    window.renderUrlEncode = renderUrlEncode;
    window.renderUrlDecode = renderUrlDecode;
    window.renderSha256 = renderSha256;

})();