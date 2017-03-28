function addUHStyle() {
    GM_addStyle(
        ".UHBox {" +
        "   background-position: center;" +
        "   margin: 5px 0 0;" +
        "   padding: 15px;" +
        "   position: absolute;" +
        "   text-align: center;" +
        "   width: auto;" +
        "}" +
        ".UHTitle {" +
        "   margin: 0 0 15px;" +
        "}"
    );
}

function addUHContainer(Context, User) {
    var UHContainer, UHButton, UHBox, UHList;

    Context.insertAdjacentHTML(
        "beforeEnd",
        "<div class=\"UHContainer\">" +
        "   <a class=\"UHButton\">" +
        "       <i class=\"fa fa-caret-down\"></i>" +
        "   </a>" +
        "   <div class=\"UHBox featured__outer-wrap is-hidden\">" +
        "       <div class=\"UHTitle featured__table__row__left\">" +
        "           <span>Username History</span>" +
        "           <a href=\"https://goo.gl/C2wjUh\" target=\"_blank\" title=\"Expand the database.\">" +
        "               <i class=\"fa fa-expand\"></i>" +
        "           </a>" +
        "       </div>" +
        "       <ul class=\"UHList featured__table__row__right\"></ul>" +
        "   </div>" +
        "</div>"
    );

    UHContainer = Context.lastElementChild;
    UHButton = UHContainer.firstElementChild;
    UHBox = UHButton.nextElementSibling;
    UHList = UHBox.lastElementChild;

    function setUHList(Response) {
        UHList.innerHTML = "<li>" + parseJSON(Response.responseText).Usernames.join("</li><li>") + "</li>";
    }

    function getUHList() {
        var URL;
        UHList.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Getting list...</span>";
        URL = "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec" +
            "?Action=1&SteamID64=" + User.SteamID64 + "&Username=" + User.Username;
        makeRequest(null, URL, UHList, setUHList);
    }

    function toggleUHBox() {
        UHBox.classList.toggle("is-hidden");
        if (!UHList.innerHTML) {
            getUHList();
        }
    }

    function closeUHBox(Event) {
        if (!UHBox.classList.contains("is-hidden") && !UHContainer.contains(Event.target)) {
            UHBox.classList.add("is-hidden");
        }
    }    

    UHButton.addEventListener("click", toggleUHBox);
    document.addEventListener("click", closeUHBox);
}
