window.onload = function() {
    var ft_list = document.getElementById('ft_list');
    var newBtn = document.getElementById('newBtn');

    // --- Cookie Helpers ---
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    // --- Core Logic ---

    function saveTodoList() {
        var todos = [];
        var items = ft_list.children;
        // We collect the text from each div to save
        for (var i = 0; i < items.length; i++) {
            todos.push(items[i].innerText);
        }
        setCookie("ft_list", JSON.stringify(todos), 7);
    }

    function addTodo(text) {
        var div = document.createElement("div");
        div.className = "todo-item";
        div.innerText = text; // Safe from XSS/HTML injection

        div.addEventListener("click", function() {
            if (confirm("Do you want to remove this TO DO?")) {
                this.remove(); 
                saveTodoList(); 
            }
        });

        ft_list.prepend(div);
    }

    // --- Initialization ---

    // Load existing todos from cookies
    var savedList = getCookie("ft_list");
    if (savedList) {
        try {
            var todos = JSON.parse(savedList);
            // Reverse loop because we use .prepend()
            for (var i = todos.length - 1; i >= 0; i--) {
                addTodo(todos[i]);
            }
        } catch (e) {
            console.error("Error parsing saved list:", e);
        }
    }

    // Event listener for the "New" button
    newBtn.addEventListener("click", function() {
        var text = prompt("Enter new TO DO:");
        if (text && text.trim() !== "") {
            addTodo(text);
            saveTodoList(); 
        }
    });
};