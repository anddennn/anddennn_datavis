// Helper for embedding Vega / Vega-Lite specs using vegaEmbed.
// Usage (from your vegavis.js):
//   window.embedSpec('#view1', spec1)
//   window.embedAll([{id:'#view1', spec:spec1}, {id:'#view2', spec:spec2}, ...])

(function () {
    // ensure vegaEmbed and vl are available
    function ready() {
        if (typeof vegaEmbed === 'undefined') {
            console.error('vegaEmbed not found. Add <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script> to your HTML.');
            return false;
        }
        if (typeof vl !== 'undefined' && typeof vega !== 'undefined' && typeof vegaLite !== 'undefined') {
            // register vl so vl.*() specs work correctly (safe to call repeatedly)
            try { vl.register(vega, vegaLite); } catch (e) { /* ignore */ }
        }
        return true;
    }

    // default embed options
    const DEFAULT_OPTS = {
        actions: false,
        renderer: 'svg',
        tooltip: true
    };

    async function embedSpec(target, spec, opts = {}) {
        if (!ready()) return Promise.reject(new Error('vegaEmbed or vl/vega/vegaLite missing'));
        const options = Object.assign({}, DEFAULT_OPTS, opts);
        try {
            return await vegaEmbed(target, spec, options);
        } catch (err) {
            console.error('vegaEmbed error for', target, err);
            throw err;
        }
    }

    // accepts array of { id: '#view1', spec: {...}, opts: {...} }
    async function embedAll(specs = []) {
        if (!Array.isArray(specs)) return Promise.reject(new Error('embedAll expects an array'));
        const promises = specs.map(s => embedSpec(s.id, s.spec, s.opts || {}));
        return Promise.all(promises);
    }

    // expose globally for your other scripts to call
    window.embedSpec = embedSpec;
    window.embedAll = embedAll;
})();