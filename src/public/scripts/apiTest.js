document.addEventListener('DOMContentLoaded', () => {
    const apiInput = document.getElementById('apiUserId');
    const jsonResponse = document.getElementById('jsonResponse');
    let timeoutId;

    function syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    apiInput.addEventListener('input', () => {
        clearTimeout(timeoutId);
        const userId = apiInput.value.trim();
        
        if (!userId) {
            jsonResponse.innerHTML = '';
            return;
        }

        timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${userId}`);
                const data = await response.json();
                jsonResponse.innerHTML = syntaxHighlight(data);
            } catch (error) {
                jsonResponse.innerHTML = 'Error fetching data from API';
            }
        }, 500);
    });
});
