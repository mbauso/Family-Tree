const add_button = document.getElementById("add-box")
const add_form = document.getElementById("add-form");
const add_submit = document.getElementById("add-submit");
const rename_button = document.getElementById("rename-button");
const delete_button = document.getElementById("delete-button")

function create(key) {
    let treeID = null;
    let treeName = "New Box";
    if (key) {
        treeID = key[0];
        treeName = key[1];
    }

    const name = document.createTextNode(treeName);
    const nameHolder = document.createElement("div");
    nameHolder.setAttribute('class', 'tree-name');
    nameHolder.setAttribute("onclick", `redirect("${treeID}")`)
    nameHolder.appendChild(name);

    // Create three-dots button
    const nav_img = document.createElement("img");
    nav_img.setAttribute("class", "nav-img");
    nav_img.setAttribute("src", "/static/images/three-dots.png");

    const nav_link = document.createElement("a");
    nav_link.setAttribute("class", "nav-link");
    nav_link.setAttribute("href", "#");
    nav_link.setAttribute("id", "navbarDropdown");
    nav_link.setAttribute("role", "button");
    nav_link.setAttribute("data-toggle", "dropdown");
    nav_link.setAttribute("aria-haspopup", "true");
    nav_link.setAttribute("aria-expanded", "false");
    nav_link.appendChild(nav_img)

    // Add rename option
    const pen = document.createElement("img");
    pen.setAttribute("src", "/static/images/rename.png")
    pen.setAttribute("class", "nav-img")
    const rename = document.createTextNode("Rename");
    const option1 = document.createElement("a");
    option1.setAttribute("class", "dropdown-item");
    option1.setAttribute("onclick", `renameConfirm("${treeID}")`)
    option1.appendChild(pen);
    option1.appendChild(rename);

    const line1 = document.createElement("div");
    line1.setAttribute("class", "dropdown-divider");

    // Add collaboration option
    const group = document.createElement("img");
    group.setAttribute("src", "/static/images/group.png")
    group.setAttribute("class", "nav-img")
    const collaboration = document.createTextNode("Collaboration");
    const option2 = document.createElement("a");
    option2.setAttribute("class", "dropdown-item");
    option2.appendChild(group);
    option2.appendChild(collaboration);

    const line2 = document.createElement("div");
    line2.setAttribute("class", "dropdown-divider");

    // Add remove tree option
    const trash = document.createElement("img");
    trash.setAttribute("src", "/static/images/trash.png")
    trash.setAttribute("class", "nav-img")
    const remove = document.createTextNode("Delete this tree");
    const option3 = document.createElement("a");
    option3.setAttribute("class", "dropdown-item");
    option3.setAttribute("style", "color: #FF0000")
    option3.setAttribute("onclick", `deleteConfirm("${treeID}")`)
    option3.appendChild(trash);
    option3.appendChild(remove);

    // Add these 3 options above to dropdown menu
    const dropdown_menu = document.createElement("div");
    dropdown_menu.setAttribute("class", "dropdown-menu dropdown-left-manual");
    dropdown_menu.setAttribute("aria-labelledby", "navbarDropdown");
    dropdown_menu.appendChild(option1);
    dropdown_menu.appendChild(line1);
    dropdown_menu.appendChild(option2);
    dropdown_menu.appendChild(line2);
    dropdown_menu.appendChild(option3);

    const nav_item = document.createElement("div");
    nav_item.setAttribute("class", "nav-item");
    nav_item.appendChild(nav_link);
    nav_item.appendChild(dropdown_menu);

    const box = document.createElement("div");
    box.setAttribute('class', 'menu-box tree-box');
    box.setAttribute('id', `${treeID}`);
    box.appendChild(nameHolder);
    box.appendChild(nav_item);

    $(box).insertBefore("#add-box");
}

function redirect(tree_id){
    const location = `${window.location.protocol}//${window.location.host}/`;
    window.location.href = location + `editTree/${tree_id}`;
}

add_button.onclick = function () {
    $("#add-modal").modal("show");
}

add_submit.onmousemove = function () {
    if (add_form.checkValidity() === true) {
        document.getElementById("add-submit").setAttribute("data-bs-dismiss", "modal");
    } else {
        document.getElementById("add-submit").removeAttribute("data-bs-dismiss");
    }
}

add_form.onsubmit = function (event) {
    event.preventDefault();
    const text = Array.from(document.querySelectorAll("#add-form input")).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    const id = Math.random().toString(36).substr(2, 9)
    const key = [id, text['message']]

    fetch(`${window.origin}/profile/add`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(key),
        cache: "no-cache",
        headers: new Headers({
        "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            if (data['message'] === "OK") {
                create(key)
            }
        });
    }).catch(function (error) {
        console.log("Fetch error: " + error);
    });
}

function deleteConfirm(element) {
    delete_button.setAttribute("onclick", `deleteTree("${element}")`)
    $("#delete-modal").modal("show");
}

function deleteTree(element) {
    fetch(`${window.origin}/profile/delete`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(element),
        cache: "no-cache",
        headers: new Headers({
        "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            if (data['message'] === "OK") {
                const box = document.getElementById(element)
                box.remove()
            }
        });
    }).catch(function (error) {
        console.log("Fetch error:" + error);
    });
}

function renameConfirm(element) {
    rename_button.setAttribute("onclick", `renameTree("${element}")`)
    $("#rename-modal").modal("show");
}

rename_button.onmousemove = function () {
    if (add_form.checkValidity() === true) {
        document.getElementById("rename-button").setAttribute("data-bs-dismiss", "modal");
    } else {
        document.getElementById("rename-button").removeAttribute("data-bs-dismiss");
    }
}

function renameTree (element) {
    const text = Array.from(document.querySelectorAll("#rename-form input")).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    const key = [element, text['message']]

    fetch(`${window.origin}/profile/rename`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(key),
        cache: "no-cache",
        headers: new Headers({
        "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            if (data['message'] === "OK") {
                const box = document.getElementById(element)
                const name = box.childNodes[0]
                name.innerHTML = text['message']
            }
        });
    }).catch(function (error) {
        console.log("Fetch error: " + error);
    });
}