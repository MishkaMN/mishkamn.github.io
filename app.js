/* --- NAVBAR FUNCTIONS ---*/

function getNavbarElements() {
    var navbar, navbar_btn, body_pad;
    navbar = document.querySelector(".navbar");
    navbar_btn = document.querySelector(".navbar_collapse_button button");
    body_pad = document.querySelector(".body-padding");
    return [navbar, navbar_btn, body_pad];
}

function foldNavbar(navbarStyle = "display:none") {
    var navbar, navbar_btn, body_pad;
    [navbar, navbar_btn, body_pad] = getNavbarElements();
    navbar_btn.textContent = ">";
    navbar_btn.style = "margin-left:0px";
    navbar_btn.style = "display:inline-block";
    navbar.style = navbarStyle;
}

function unfoldNavbar(navbarStyle = "display:block") {
    var navbar, navbar_btn, body_pad;
    [navbar, navbar_btn, body_pad] = getNavbarElements();
    navbar_btn.textContent = "<";
    navbar_btn.style = "margin-left:250px";
    navbar.style = navbarStyle;
}

function adjustScreen(orientation = "") {
    // REVIEW  Feel like there would be better way to handle the logic
    var navbar, navbar_btn, body_pad;
    [navbar, navbar_btn, body_pad] = getNavbarElements();

    // Portrait mode with nav_bar clicks
    if (orientation === "") {
        body_pad.style = "padding-left: 5%";
        navbar_btn.style = "display:inline-block";

        // Unfold navigation bar
        if (navbar_btn.textContent === ">") {
            ("unfold in side no orient");
            unfoldNavbar();
        }
        // Fold navigation bar
        else {
            ("fold in side no orient");
            foldNavbar();
        }
    }
    // Portrait mode just by resizing
    else if (orientation === "Port") {
        ("Port");
        body_pad.style = "padding-left: 5%";
        foldNavbar();
    }
    // Landscape mode just by resizing
    else {
        ("Land");
        body_pad.style = "padding-left: 23%";
        foldNavbar("display:block");
    }
}

// Get orientation of the screen

function getOrientation() {
    var orientation = window.innerWidth >= window.innerHeight ? "Land" : "Port";
    if (window.innerHeight <= 600 && window.innerWidth <= 800) {
        orientation = "Port";
    }
    return orientation;
}

/* --- LISTENERS ---- */

// Listener resizing
window.onresize = function() {
    var orientation;
    orientation = getOrientation();
    adjustScreen(orientation);
};

// Listener: button to fold/unfold navbar
document
    .querySelector(".navbar_collapse_button button")
    .addEventListener("click", function() {
        adjustScreen();
    });

// Listener: navbar content
document.querySelector(".navbar_content").addEventListener("click", function() {
    var orient, navbar, navbar_btn, body_pad;
    [navbar, navbar_btn, body_pad] = getNavbarElements();
    orient = getOrientation();

    if (orient === "Port") {
        foldNavbar();
    }
});
