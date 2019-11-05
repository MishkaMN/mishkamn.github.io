function adjustScreen(orientation = ""){
    // REVIEW Feel like there would be better way to handle the logic
    var navbar, navbar_btn, body_pad;
    navbar = navbar = document.querySelector('.navbar');
    navbar_btn = document.querySelector('.navbar_collapse_button button');
    body_pad = document.querySelector('.body-padding');
    // Portrait mode with nav_bar clicks
    if (orientation === ""){
        console.log("Port, btn");
        body_pad.style = 'padding-left: 5%';
        navbar_btn.style = 'display:inline-block';
        // Unfold navigation bar
        if (navbar_btn.textContent === '>'){
            navbar_btn.textContent = '<';
            navbar_btn.style = 'margin-left:250px';
            navbar.style = 'display:block';
        }
        // Fold navigation bar
        else{
            navbar_btn.textContent = '>';
            navbar_btn.style = 'margin-left:0px';
            navbar.style = 'display:none';
        }
    }
    // Portrait mode just by resizing
    else if (orientation ==="Port"){
        body_pad.style = 'padding-left: 5%';
        navbar_btn.textContent = '>';
        navbar_btn.style = 'margin-left:0px';
        navbar_btn.style = 'display:inline-block';
        navbar.style = 'display:none';
    }
    // Landscape mode just by resizing
    else{
        body_pad.style = 'padding-left: 23%';
        navbar_btn.textContent = '>';
        navbar_btn.style = 'margin-left:0px';
        navbar_btn.style = 'display:none';
        navbar.style = 'display:block';
    }
}

// Listener resizing
window.onresize = function(){ 
    var orientation = window.innerWidth >= window.innerHeight ? "Land" : "Port";
    adjustScreen(orientation);
}

// Listener: button to fold/unfold navbar
document.querySelector('.navbar_collapse_button button').addEventListener('click', function() {
    adjustScreen();
});