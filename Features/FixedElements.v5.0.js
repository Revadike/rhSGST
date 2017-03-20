function fixFEElements() {
    if (ESGST.FE_H) {
        fixFEHeader();
    }
    if (ESGST.FE_HG) {
        fixFEHeading();
    }
    if (ESGST.SG && ESGST.FE_S) {
        fixFESidebar();
    }
    if (ESGST.FE_F) {
        fixFEFooter();
    }
}

function fixFEHeader() {
    var FEHeader, FeaturedContainer, OuterWrap, Element;
    addFEHeaderStyle();
    FEHeader = document.getElementsByTagName("header")[0];
    FEHeader.classList.add("FEHeader");
    FeaturedContainer = document.getElementsByClassName("featured__container")[0];
    OuterWrap = document.getElementsByClassName(ESGST.SG ? "page__outer-wrap" : "page_outer_wrap")[0];
    Element = (ESGST.FCH && ESGST.GiveawaysPath) ? OuterWrap : (FeaturedContainer || OuterWrap);
    Element.style.marginTop = FEHeader.offsetHeight + "px";
}

function addFEHeaderStyle() {
    GM_addStyle(
        ".FEHeader {" +
        "    height: auto !important;" +
        "    position: fixed;" +
        "    top: 0;" +
        "    width: 100%;" +
        "    z-index: 999 !important;" +
        "}"
    );
}

function fixFEHeading() {
    var Headings, FEHeading, Height, Width, Top, FEHeadingBackground;
    addFEHeadingStyle();
    Headings = document.getElementsByClassName(ESGST.SG ? "page__heading" : "page_heading");
    FEHeading = Headings[(ESGST.CommentsPath && Headings[1]) ? 1 : 0];
    FEHeading.classList.add("FEHeading");
    Height = document.getElementsByTagName("header")[0].offsetHeight + 25;
    Width = FEHeading.offsetWidth + "px";
    document.addEventListener("scroll", fixHeading);
    fixHeading();

    function fixHeading() {
        Top = FEHeading.offsetTop - Height;
        if (window.scrollY > Top) {
            document.removeEventListener("scroll", fixHeading);
            FEHeading.classList.add("FEHeadingFixed");
            FEHeading.style.top = Height + "px";
            FEHeading.style.width = Width;
            FEHeading.insertAdjacentHTML(
                "afterBegin",
                "<div class=\"" + (ESGST.SG ? "page__outer-wrap" : "page_outer_wrap") + " FEHeadingBackground\"></div>"
            );
            FEHeadingBackground = FEHeading.firstElementChild;
            FEHeadingBackground.style.height = (Height + FEHeading.offsetHeight + 5) + "px";
            FEHeadingBackground.style.width = Width;
            document.addEventListener("scroll", unfixHeading);
        }
    }

    function unfixHeading() {
        if (window.scrollY <= Top) {
            document.removeEventListener("scroll", unfixHeading);
            FEHeading.classList.remove("FEHeadingFixed");
            FEHeading.removeAttribute("style");
            FEHeadingBackground.remove();
            document.addEventListener("scroll", fixHeading);
        }
    }
}

function addFEHeadingStyle() {
    GM_addStyle(
        ".FEHeadingFixed {" +
        "    position: fixed;" +
        "    z-index: 998;" +
        "}" +
        ".FEHeadingBackground {" +
        "    background-image: none;" +
        "    border: 0;" +
        "    margin: 0 0 5px;" +
        "    padding: 0;" +
        "    position: fixed;" +
        "    top: 0;" +
        "    z-index: -1;" +
        "}"
    );
}

function fixFESidebar() {
    var FESidebar, Height, Container, Ad, Top;
    addFESidebarStyle();
    FESidebar = document.getElementsByClassName("sidebar")[0];
    Height = document.getElementsByTagName("header")[0].offsetHeight + 25;
    Container = FESidebar.nextElementSibling;
    Ad = ESGST.GiveawayCommentsPath ? FESidebar.getElementsByClassName("sidebar__search-container")[0].nextElementSibling :
        FESidebar.getElementsByClassName("sidebar__mpu")[0];
    document.addEventListener("scroll", fixSidebar);
    fixSidebar();

    function fixSidebar() {
        Top = FESidebar.offsetTop;
        if ((window.scrollY + Height) > Top) {
            document.removeEventListener("scroll", fixSidebar);
            FESidebar.classList.add("FESidebar");
            FESidebar.style.top = Height + "px";
            Container.style.marginLeft = (FESidebar.offsetWidth + 25) + "px";
            if (Ad) {
                Ad.classList.add("rhHidden");
            }
            document.addEventListener("scroll", unfixSidebar);
        }
    }

    function unfixSidebar() {
        if ((window.scrollY + Height) <= Top) {
            document.removeEventListener("scroll", unfixSidebar);
            FESidebar.classList.remove("FESidebar");
            Container.style.marginLeft = "25px";
            if (Ad) {
                Ad.classList.remove("rhHidden");
            }
            document.addEventListener("scroll", fixSidebar);
        }
    }
}

function addFESidebarStyle() {
    GM_addStyle(
        ".FESidebar {" +
        "    position: fixed;" +
        "}"
    );
}

function fixFEFooter() {
    var Footer, OuterWrap;
    addFEFooterStyle();
    Footer = ESGST.SG ? document.getElementsByClassName("footer__outer-wrap")[0] : document.getElementsByTagName("footer")[0];
    Footer.classList.add("FEFooter");
    OuterWrap = document.getElementsByClassName(ESGST.SG ? "page__outer-wrap" : "page_outer_wrap")[0];
    OuterWrap.style.marginBottom = Footer.offsetHeight + "px";
}

function addFEFooterStyle() {
    GM_addStyle(
        ".FEFooter {" +
        "    background-color: inherit;" +
        "    bottom: 0;" +
        "    padding: 0;" +
        "    position: fixed;" +
        "    width: 100%;" +
        "    z-index: 999;" +
        "}" +
        ".FEFooter >* {" +
        "    padding: 15px 25px;" +
        "}"
    );
}
