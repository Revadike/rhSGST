// ==UserScript==
// @name rhSGST
// @namespace revilheart
// @author revilheart
// @description Adds some cool features to SteamGifts.
// @version 4.14
// @downloadURL https://github.com/revilheart/rhSGST/raw/master/rhSGST.user.js
// @updateURL https://github.com/revilheart/rhSGST/raw/master/rhSGST.meta.js
// @match https://www.steamgifts.com/*
// @match https://www.steamtrades.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @connect steamgifts.com
// @connect script.google.com
// @connect script.googleusercontent.com
// @connect sgtools.info
// @connect steamcommunity.com
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require https://greasyfork.org/scripts/26575-bpopup/code/bPopup.js?version=169515
// @run-at document-end
// ==/UserScript==

(function() {
    "use strict";
    var SG, Path, Location, Hash, XSRFToken, Features, Users, Games, APBoxes;
    SG = window.location.hostname.match(/steamgifts/);
    Path = window.location.pathname;
    Location = window.location.href;
    Hash = window.location.hash;
    XSRFToken = document.querySelector("[name='xsrf_token']");
    XSRFToken = XSRFToken ? XSRFToken.value : "";
    Features = {
        FCH: {
            Name: "Featured Container Hider"
        },
        FE: {
            Name: "Fixed Elements",
            FE_H: {
                Name: "Header"
            },
            FE_HI: {
                Name: "Heading"
            },
            FE_S: {
                Name: "Sidebar"
            },
            FE_F: {
                Name: "Footer"
            }
        },
        ES: {
            Name: "Endless Scrolling",
            ES_G: {
                Name: "Enable in main / giveaways pages."
            },
            ES_GC: {
                Name: "Enable in giveaway comments pages."
            },
            ES_D: {
                Name: "Enable in discussions / support / trades pages."
            },
            ES_DC: {
                Name: "Enable in dicussion / support / trade comments pages."
            },
            ES_R: {
                Name: "Enable in the rest of the pages."
            },
            ES_RD: {
                Name: "Show recent discussions at the top."
            },
            ES_RS: {
                Name: "Disable reverse scrolling."
            }
        },
        GV: {
            Name: "Grid View"
        },
        SGPB: {
            Name: "SteamGifts Profile Button"
        },
        STPB: {
            Name: "SteamTrades Profile Button"
        },
        CH: {
            Name: "Comment History"
        },
        UH: {
            Name: "Username History"
        },
        PUN: {
            Name: "Permanent User Notes"
        },
        PUT: {
            Name: "Permanent User Tags"
        },
        MT: {
            Name: "Multi-Tag"
        },
        WBH: {
            Name: "Whitelist / Blacklist Highlighter"
        },
        WBC: {
            Name: "Whitelist / Blacklist Checker",
            WBC_B: {
                Name: "Show blacklist information."
            },
            WBC_H: {
                Name: "Highlight users who have whitelisted / blacklisted you."
            }
        },
        RWSCVL: {
            Name: "Real Won / Sent CV Links",
            RWSCVL_RO: {
                Name: "Reverse order (from new to old)."
            }
        },
        NAMWC: {
            Name: "Not Activated / Multiple Wins Checker",
            NAMWC_H: {
                Name: "Highlight users."
            }
        },
        NRF: {
            Name: "Not Received Finder"
        },
        AP: {
            Name: "Avatar Popout"
        },
        UGS: {
            Name: "Unsent Gifts Sender"
        },
        GTS: {
            Name: "Giveaway Templates"
        },
        SGG: {
            Name: "Stickied Giveaway Groups"
        },
        HIR: {
            Name: "Header Icons Refresher",
            HIR_B: {
                Name: "Run in the background and change the icon of the tab if new messages are found."
            }
        },
        AGS: {
            Name: "Advanced Giveaway Search"
        },
        PR: {
            Name: "Points Refresher",
            PR_B: {
                Name: "Run in the background and display the points in the title of the tab upon refreshing."
            }
        },
        EGH: {
            Name: "Entered Games Highlighter"
        },
        EGF: {
            Name: "Entered Giveaways Filter"
        },
        ELGB: {
            Name: "Enter / Leave Giveaway Button"
        },
        GDCBP: {
            Name: "Giveaway Description / Comment Box Popup",
            GDCBP_EG: {
                Name: "Pop up when entering a giveaway if Enter / Leave Giveaway Button is enabled."
            }
        },
        GWC: {
            Name: "Giveaway Winning Chance"
        },
        GH: {
            Name: "Groups Highlighter"
        },
        GGP: {
            Name: "Giveaway Groups Popout"
        },
        DH: {
            Name: "Discussions Highlighter"
        },
        CT: {
            Name: "Comment Tracker",
            CT_G: {
                Name: "Fade out visited giveaways."
            },
            CT_LU: {
                Name: "Go to the last unread comment of a discussion instead of the first one from the discussions page."
            }
        },
        AT: {
            Name: "Accurate Timestamp",
            AT_G: {
                Name: "Enable in the main giveaways pages."
            }
        },
        CFH: {
            Name: "Comment Formatting Helper",
            CFH_I: {
                Name: "Italic"
            },
            CFH_B: {
                Name: "Bold"
            },
            CFH_S: {
                Name: "Spoiler"
            },
            CFH_ST: {
                Name: "Strikethrough"
            },
            CFH_H1: {
                Name: "Heading 1"
            },
            CFH_H2: {
                Name: "Heading 2"
            },
            CFH_H3: {
                Name: "Heading 3"
            },
            CFH_BQ: {
                Name: "Blockquote"
            },
            CFH_LB: {
                Name: "Line Break"
            },
            CFH_OL: {
                Name: "Ordered List"
            },
            CFH_UL: {
                Name: "Unordered List"
            },
            CFH_IC: {
                Name: "Inline Code"
            },
            CFH_LC: {
                Name: "Line Code"
            },
            CFH_PC: {
                Name: "Paragraph Code"
            },
            CFH_L: {
                Name: "Link"
            },
            CFH_IMG: {
                Name: "Image"
            },
            CFH_T: {
                Name: "Table"
            },
            CFH_E: {
                Name: "Emojis"
            }
        },
        MCBP: {
            Name: "Main Comment Box Popup"
        },
        MR: {
            Name: "Multi-Reply"
        },
        RFI: {
            Name: "Reply From Inbox"
        },
        GT: {
            Name: "Game Tags"
        },
        GWL: {
            Name: "Giveaway Winners Link"
        },
        MPP: {
            Name: "Main Post Popup"
        },
        DED: {
            Name: "Discussion Edit Detector"
        },
        RML: {
            Name: "Reply Mention Link"
        },
        AS: {
            Name: "Archive Searcher"
        },
        SM_D: {
            Name: "Enable new features by default."
        }
    };
    if (window.Element && !window.Element.prototype.closest) {
        window.Element.prototype.closest = function(Query) {
            var Matches, Element, I;
            Matches = (this.document || this.ownerDocument).querySelectorAll(Query);
            Element = this;
            do {
                I = Matches.length - 1;
                while ((I >= 0) && (Matches[I] != Element)) {
                    --I;
                }
            } while ((I < 0) && (Element = Element.parentElement));
            return Element;
        };
    }
    setDefaultValues();
    addStyles();
    loadFeatures();
    if (SG) {
        checkSync();
    }
    window.addEventListener("beforeunload", function(Event) {
        if (document.getElementsByClassName("rhBusy")[0]) {
            Event.returnValue = true;
            return true;
        }
    });
    window.addEventListener("hashchange", function() {
        goToComment();
    });

    // Helper Functions

    function setDefaultValues() {
        var DefaultValues, rhSGST, Key;
        DefaultValues = {
            Avatar: "",
            Username: "",
            SteamID64: "",
            Users: [],
            Games: {},
            Groups: [],
            LastRequest: 0,
            LastSave: 0,
            LastSync: 0,
            SyncFrequency: 7,
            Comments: {},
            Comments_ST: {},
            Emojis: "",
            Rerolls: [],
            CommentHistory: "",
            StickiedGroups: [],
            Templates: []
        };
        rhSGST = GM_getValue("rhSGST");
        for (Key in DefaultValues) {
            if (typeof GM_getValue(Key) == "undefined") {
                if (rhSGST && rhSGST[Key]) {
                    GM_setValue(Key, rhSGST[Key]);
                } else {
                    GM_setValue(Key, DefaultValues[Key]);
                }
            }
        }
        for (Key in Features) {
            transferSettings(Key, rhSGST, Features[Key]);
        }
    }

    function transferSettings(Key, rhSGST, Feature) {
        if (typeof GM_getValue(Key) == "undefined") {
            if (rhSGST && (typeof rhSGST[Key] != "undefined")) {
                GM_setValue(Key, rhSGST[Key]);
            } else {
                GM_setValue(Key, GM_getValue("SM_D") ? true : false);
            }
        }
        for (Key in Feature) {
            if (Key != "Name") {
                transferSettings(Key, rhSGST, Feature[Key]);
            }
        }
    }

    function loadFeatures() {
        var CommentBox;
        if (GM_getValue("FCH") && Path.match(/^\/($|giveaways(?!\/(wishlist|created|entered|won|new)))/)) {
            hideFCHContainer();
        }
        if (GM_getValue("FE")) {
            fixFEElements();
        }
        if (Path.match(/^\/account/)) {
            addSMButton();
        } else if (Path.match(/^\/user\//)) {
            loadProfileFeatures(document);
        } else if (Path.match(/^\/support\/tickets\/new/)) {
            setUGSObserver();
        } else if (GM_getValue("DED") && Path.match(/^\/(giveaway|discussion|support\/ticket)\//)) {
            CommentBox = document.getElementsByClassName(SG ? "comment--submit" : "reply_form")[0];
            if (CommentBox) {
                addDEDButton(CommentBox);
            }
        } else if (GM_getValue("AGS") && SG && Path.match(/^\/($|giveaways(?!\/(wishlist|created|entered|won|new)))/)) {
            addAGSPanel();
        } else if (GM_getValue("GWC") && Path.match(/^\/giveaways\/entered/)) {
            addGWCHeading();
        }
        if (Path.match(/^\/giveaway\//)) {
            if (GM_getValue("GWC")) {
                addGWCChance();
            }
            if (GM_getValue("EGH")) {
                setEGHHighlighter();
            }
        }
        if (SG) {
            if (GM_getValue("HIR")) {
                setHIRRefresher();
            }
            if (GM_getValue("PR")) {
                setPRRefresher();
            }
            if (Path.match(/^\/giveaways\/new/) && !document.getElementsByClassName("table--summary")[0]) {
                if (GM_getValue("GTS")) {
                    addGTSButtons();
                }
                if (GM_getValue("SGG")) {
                    setSGGGroups();
                }
            }
        }
        Users = {};
        Games = {};
        APBoxes = {};
        loadEndlessFeatures(document);
        setTimeout(goToComment, 1000);
    }

    function loadProfileFeatures(Context) {
        var Heading, Username, ID, SteamButton, SteamID64;
        Heading = Context.getElementsByClassName(SG ? "featured__heading" : "page_heading")[0];
        Username = SG ? Heading.textContent : "";
        ID = Context.querySelector("[name='child_user_id']");
        ID = ID ? ID.value : "";
        SteamButton = Context.querySelector("a[href*='/profiles/']");
        SteamID64 = SteamButton.getAttribute("href").match(/\d+/)[0];
        if (SG) {
            if (GM_getValue("STPB")) {
                addSTPBButton(Context, SteamID64);
            }
            if (GM_getValue("UH")) {
                addUHContainer(Heading, SteamID64, Username);
            }
            if (GM_getValue("RWSCVL")) {
                addRWSCVLLinks(Context, Username);
            }
            if (GM_getValue("NAMWC")) {
                addNAMWCProfileButton(Context, Username, ID, SteamID64);
            }
            if (GM_getValue("NRF")) {
                addNRFButton(Context, Username, ID, SteamID64);
            }
        } else if (GM_getValue("SGPB")) {
            addSGPBButton(SteamID64, SteamButton);
        }
        if (GM_getValue("PUN")) {
            addPUNButton(Heading, Username, ID, SteamID64);
        }
    }

    function loadEndlessFeatures(Context) {
        var Matches, CurrentUsers, I, N, UserID, Match, SteamLink, Game, Title, CurrentGames, SavedUsers, SavedGames;
        Matches = Context.querySelectorAll("a[href*='/user/']");
        CurrentUsers = {};
        for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
            if (Match) {
                UserID = Match[1];
                if (((SG && Matches[I].textContent == UserID) || (!SG && Matches[I].textContent && !Matches[I].children.length)) && !Matches[I].closest(".markdown")) {
                    if (!Users[UserID]) {
                        Users[UserID] = [];
                    }
                    if (!CurrentUsers[UserID]) {
                        CurrentUsers[UserID] = [];
                    }
                    Users[UserID].push(Matches[I]);
                    CurrentUsers[UserID].push(Matches[I]);
                    if (GM_getValue("PUT")) {
                        addPUTButton(Matches[I], UserID);
                    }
                }
            }
        }
        Matches = Context.querySelectorAll(Path.match(/^\/giveaway\//) ? ".featured__heading" : ".giveaway__heading, .table__column__heading");
        CurrentGames = {};
        for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I];
            SteamLink = Match.querySelector("a[href*='store.steampowered.com']");
            if (SteamLink) {
                Game = SteamLink.getAttribute("href").match(/\d+/)[0];
                Title = Match.firstElementChild.textContent;
            } else if (!Match.classList.contains("giveaway__heading")) {
                Title = Match.textContent;
                Game = Match.closest(".table__row-outer-wrap").getElementsByClassName("global__image-inner-wrap")[0];
                if (Game) {
                    Game = Game.getAttribute("style").match(/\/(apps|subs)\/(.+)\//);
                    if (Game) {
                        Game = Game[2];
                    }
                }
                Match = Match.parentElement;
            }
            if (Game) {
                if (!Games[Game]) {
                    Games[Game] = [];
                }
                if (!CurrentGames[Game]) {
                    CurrentGames[Game] = [];
                }
                Games[Game].push(Match);
                CurrentGames[Game].push(Match);
                if (GM_getValue("GT")) {
                    addGTButton(Match, Game, Title);
                }
            }
        }
        SavedUsers = GM_getValue("Users");
        for (I = 0, N = SavedUsers.length; I < N; ++I) {
            UserID = SG ? SavedUsers[I].Username : SavedUsers[I].SteamID64;
            if (CurrentUsers[UserID]) {
                if (GM_getValue("WBH") && !Path.match(/^\/account\//)) {
                    addWBHIcon(SavedUsers[I], CurrentUsers[UserID]);
                }
                if (GM_getValue("WBC") && GM_getValue("WBC_H")) {
                    addWBCIcon(SavedUsers[I], CurrentUsers[UserID]);
                }
                if (GM_getValue("NAMWC") && GM_getValue("NAMWC_H")) {
                    highlightNAMWCUser(SavedUsers[I], CurrentUsers[UserID]);
                }
                if (GM_getValue("PUT") && SavedUsers[I].Tags) {
                    addPUTTags(UserID, SavedUsers[I].Tags);
                }
            }
        }
        SavedGames = GM_getValue("Games");
        for (Game in SavedGames) {
            if (CurrentGames[Game]) {
                if (GM_getValue("GT")) {
                    addGTTags(Game, SavedGames[Game].Tags);
                }
                if (GM_getValue("EGH") && SavedGames[Game].Entered) {
                    highlightEGHGame(SavedGames, Game, CurrentGames[Game]);
                }
            }
        }
        loadHeadingFeatures([{
            Check: GM_getValue("ES"),
            Name: "ESPanel",
            Callback: addESPanel
        }, {
            Check: GM_getValue("MT") && (GM_getValue("PUT") || GM_getValue("GT")) && Object.keys(CurrentUsers).length,
            Name: "MTContainer",
            Callback: addMTContainer
        }, {
            Check: GM_getValue("UGS") && Path.match(/\/giveaways\/created/),
            Name: "UGSButton",
            Callback: addUGSButton
        }, {
            Check: GM_getValue("NAMWC") && SG && Object.keys(CurrentUsers).length && Path.match(/\/winners/),
            Name: "NAMWCButton",
            Callback: addNAMWCButton
        }, {
            Check: GM_getValue("WBC") && SG && Object.keys(CurrentUsers).length,
            Name: "WBCButton",
            Callback: addWBCButton
        }, {
            Check: GM_getValue("CT") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
            Name: "CTPanel",
            Callback: addCTPanel
        }, {
            Check: GM_getValue("MCBP") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
            Name: "MCBPButton",
            Callback: addMCBPButton
        }, {
            Check: GM_getValue("MPP") && Path.match(/^\/discussion\//),
            Name: "MPPButton",
            Callback: addMPPButton
        }, {
            Check: GM_getValue("AS") && Path.match(/^\/archive/),
            Name: "ASButton",
            Callback: addASButton
        }]);
        loadMatchesFeatures(Context, [{
            Check: GM_getValue("AP"),
            Query: ".global__image-outer-wrap--avatar-small",
            Callback: addAPBox
        }, {
            Check: GM_getValue("EGF") && Path.match(/^\/($|giveaways)/),
            Query: ".giveaway__row-inner-wrap.is-faded",
            Callback: hideEGFGiveaway
        }, {
            Check: GM_getValue("GV") && Path.match(/^\/($|giveaways)/),
            Query: ".giveaway__row-outer-wrap",
            Callback: setGVContainer
        }, {
            Check: GM_getValue("GH") && !Path.match(/^\/account/),
            Query: ".table__column__heading[href*='/group/']",
            Callback: highlightGHGroups,
            All: true
        }, {
            Check: GM_getValue("GGP"),
            Query: ".giveaway__column--group",
            Callback: addGGPBox
        }, {
            Check: (GM_getValue("ELGB") || GM_getValue("GDCBP") || GM_getValue("GWC")) && Path.match(/^\/($|giveaways|(user|group)\/)/),
            Query: ".giveaway__row-inner-wrap",
            Callback: addGPPanel
        }, {
            Check: GM_getValue("GWC") && Path.match(/^\/giveaways\/entered/),
            Query: ".table__row-inner-wrap",
            Callback: addGWCChance
        }, {
            Check: true,
            Query: ".giveaway__row-inner-wrap.is-faded",
            Callback: setFadedGiveaway
        }, {
            Check: GM_getValue("DH") && Path.match(/^\/discussions/),
            Query: ".table__row-outer-wrap",
            Callback: highlightDHDiscussions,
            All: true
        }, {
            Check: GM_getValue("CT"),
            Query: ".table__column__heading, .giveaway__heading__name, .column_flex h3 a",
            Callback: checkCTVisited,
            All: true
        }, {
            Check: GM_getValue("AT") && ((GM_getValue("AT_G") && Path.match(/^\/($|giveaways)/)) || (!Path.match(/^\/($|giveaways)/))),
            Query: "[data-timestamp]",
            Callback: setATTimestamp
        }, {
            Check: GM_getValue("CFH"),
            Query: "textarea[name='description']",
            Callback: addCFHPanel
        }, {
            Check: GM_getValue("MR") || (GM_getValue("RFI") && Path.match(/^\/messages/)),
            Query: SG ? ".comment__actions" : ".action_list",
            Callback: addMRButton
        }, {
            Check: GM_getValue("GWL"),
            Query: ".giveaway__summary",
            Callback: addGWLLink
        }, {
            Check: GM_getValue("RML"),
            Query: SG ? ".comment__children" : ".comment_children",
            Callback: setRMLLink
        }, {
            Check: GM_getValue("CT") && Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//),
            Query: ".comment__summary, .comment_inner",
            Callback: setCTComment,
            All: true
        }]);
    }

    function loadHeadingFeatures(Items) {
        var Headings, Heading, I, N;
        Headings = document.getElementsByClassName(SG ? "page__heading" : "page_heading");
        Heading = Headings[Path.match(/^\/(giveaway(?!.+(winners|entries))|discussion|support\/ticket|trade)\//) ? 1 : 0];
        if (!Heading) {
            Heading = Headings[0];
        }
        for (I = 0, N = Items.length; I < N; ++I) {
            if (Items[I].Check && !document.getElementsByClassName(Items[I].Name)[0]) {
                Items[I].Callback(Heading);
            }
        }
    }

    function loadMatchesFeatures(Context, Items) {
        var I, N, Matches, NumMatches, J;
        for (I = 0, N = Items.length; I < N; ++I) {
            if (Items[I].Check) {
                Matches = Context.querySelectorAll(Items[I].Query);
                NumMatches = Matches.length;
                if (NumMatches) {
                    if (Items[I].All) {
                        Items[I].Callback(Matches);
                    } else {
                        for (J = 0; J < NumMatches; ++J) {
                            Items[I].Callback(Matches[J]);
                        }
                    }
                }
            }
        }
    }

    function goToComment() {
        var Match, Element, Heading;
        Match = window.location.href.match(/#(.+)/);
        if (Match && !Path.match(/^\/account/)) {
            Element = document.getElementById(Match[1]);
            if (Element) {
                Heading = document.getElementsByClassName("FEHeading")[0];
                window.scrollTo(0, Element.offsetTop - (Heading ? 0 : 39));
                window.scrollBy(0, -(document.getElementsByTagName("header")[0].offsetHeight + 64));
            }
        }
    }

    function queueRequest(Element, Data, URL, Callback) {
        var CurrentDate;
        Element.Request = setInterval(function() {
            CurrentDate = new Date().getTime();
            if ((CurrentDate - GM_getValue("LastRequest")) > 300000) {
                clearInterval(Element.Request);
                GM_setValue("LastRequest", CurrentDate);
                makeRequest(Data, URL, Element.Progress, function(Response) {
                    GM_setValue("LastRequest", 0);
                    Callback(Response);
                });
            } else if (Element.Progress) {
                Element.Progress.innerHTML =
                    "<i class=\"fa fa-clock-o\"></i> " +
                    "<span>Waiting for a free request slot...</span>";
            }
        }, 500);
    }

    function makeRequest(Data, URL, Context, Callback) {
        GM_xmlhttpRequest({
            data: Data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: (Data ? "POST" : "GET"),
            timeout: 300000,
            url: URL,
            onerror: function() {
                displayMessage(Context, "An error has ocurred.");
            },
            ontimeout: function() {
                displayMessage(Context, "The connection has timed out.");
            },
            onload: Callback
        });
    }

    function displayMessage(Context, Message) {
        if (Context) {
            Context.innerHTML =
                "<i class=\"fa fa-times-circle\"></i> " +
                "<span>" + Message + "</span>";
        } else {
            console.log(Message);
        }
    }

    function queueSave(Element, User, Callback) {
        var CurrentDate;
        CurrentDate = new Date().getTime();
        if ((CurrentDate - GM_getValue("LastSave")) > 300000) {
            GM_setValue("LastSave", CurrentDate);
            setUser(User, Element, function() {
                GM_setValue("LastSave", 0);
                Callback();
            });
        } else {
            Element.Save = setInterval(function() {
                CurrentDate = new Date().getTime();
                if ((CurrentDate - GM_getValue("LastSave")) > 300000) {
                    clearInterval(Element.Save);
                    GM_setValue("LastSave", CurrentDate);
                    setUser(User, Element, function() {
                        GM_setValue("LastSave", 0);
                        Callback();
                    });
                } else {
                    Element.Progress.innerHTML =
                        "<i class=\"fa fa-clock-o\"></i> " +
                        "<span>Waiting for a free save slot...</span>";
                }
            }, 100);
        }
    }

    function setUser(User, Element, Callback) {
        var SavedUsers, I;
        SavedUsers = GM_getValue("Users");
        I = getUserIndex(User, SavedUsers);
        if (I >= 0) {
            checkUsernameChange(User, SavedUsers[I]);
            GM_setValue("Users", SavedUsers);
            Callback();
        } else if (User.Username && User.SteamID64) {
            SavedUsers.push(User);
            GM_setValue("Users", SavedUsers);
            Callback();
        } else {
            queueRequest(Element, null, "https://www.steamgifts.com" + (SG ? "" : "/go") + "/user/" + (SG ? User.Username : User.SteamID64), function(Response) {
                var ResponseHTML;
                ResponseHTML = parseHTML(Response.responseText);
                if (SG) {
                    User.SteamID64 = ResponseHTML.querySelector("a[href*='/profiles/']").getAttribute("href").match(/\d+/)[0];
                    I = getUserIndex(User, SavedUsers);
                    if (I >= 0) {
                        checkUsernameChange(User, SavedUsers[I]);
                    } else {
                        SavedUsers.push(User);
                    }
                } else {
                    User.Username = Response.finalUrl.match(/\/user\/(.+)/)[1];
                    SavedUsers.push(User);
                }
                User.ID = ResponseHTML.querySelector("input[name='child_user_id']");
                User.ID = User.ID ? User.ID.value : "";
                GM_setValue("Users", SavedUsers);
                Callback();
            });
        }
    }

    function getUserID(User, Element, Callback) {
        var SavedUser;
        SavedUser = getUser(User);
        if (SavedUser.ID) {
            User.ID = SavedUser.ID;
            Callback();
        } else {
            queueRequest(Element, null, "/user/" + User.Username, function(Response) {
                User.ID = parseHTML(Response.responseText).querySelector("[name='child_user_id']").value;
                Callback();
            });
        }
    }

    function getUser(User) {
        var SavedUsers, I;
        SavedUsers = GM_getValue("Users");
        I = getUserIndex(User, SavedUsers);
        return ((I >= 0) ? SavedUsers[I] : null);
    }

    function getUserIndex(User, SavedUsers) {
        var Query, Key, I;
        if (User.SteamID64) {
            Query = User.SteamID64;
            Key = "SteamID64";
        } else {
            Query = User.Username;
            Key = "Username";
        }
        for (I = SavedUsers.length - 1; (I >= 0) && (SavedUsers[I][Key] != Query); --I);
        return I;
    }

    function checkUsernameChange(User, SavedUser) {
        var Key;
        for (Key in User) {
            if (User.Username && (User.Username != SavedUser.Username) && (Key == "Tags")) {
                if (SavedUser.Tags) {
                    if (User.Tags) {
                        SavedUser.Tags += ", " + User.Tags;
                    }
                } else if (User.Tags) {
                    SavedUser.Tags = User.Tags;
                }
            } else {
                SavedUser[Key] = User[Key];
            }
        }
    }

    function saveComment(TradeCode, ParentID, Description, URL, DEDStatus, Callback, DEDCallback) {
        var Data;
        Data = "xsrf_token=" + XSRFToken + "&do=" + (SG ? "comment_new" : "comment_insert") + "&trade_code=" + TradeCode + "&parent_id=" + ParentID + "&description=" +
            encodeURIComponent(Description);
        makeRequest(Data, URL, DEDStatus, function(Response) {
            var Match, ResponseJSON;
            if (SG) {
                Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
                if (Match[3]) {
                    Callback();
                    if (GM_getValue("CH")) {
                        saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                    }
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        window.location.href = "/go/comment/" + Match[3];
                    }
                } else if (URL != Match[1]) {
                    makeRequest(Data, Match[1], DEDStatus, function(Response) {
                        Callback();
                        Match = Response.finalUrl.match(/(.+?)(#(.+))?$/);
                        if (GM_getValue("CH")) {
                            saveCHComment(DEDStatus.closest(".comment__children"), Match[1], parseHTML(Response.responseText).getElementsByTagName("title")[0].textContent, Match[3]);
                        }
                        if (DEDCallback) {
                            DEDCallback(Response, DEDStatus);
                        } else {
                            window.location.href = "/go/comment/" + Match[3];
                        }
                    });
                } else {
                    Callback();
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        DEDStatus.innerHTML =
                            "<i class=\"fa fa-times-circle\"></i> " +
                            "<span>Failed!</span>";
                    }
                }
            } else {
                ResponseJSON = parseJSON(Response.responseText);
                if (ResponseJSON.success) {
                    Callback();
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        window.location.href = "/go/comment/" + parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0].id;
                    }
                } else {
                    Callback();
                    if (DEDCallback) {
                        DEDCallback(Response, DEDStatus);
                    } else {
                        DEDStatus.innerHTML =
                            "<i class=\"fa fa-times-circle\"></i> " +
                            "<span>Failed!</span>";
                    }
                }
            }
        });
    }

    function checkSync(Update, Callback) {
        var SyncFrequency, CurrentDate;
        SyncFrequency = GM_getValue("SyncFrequency");
        CurrentDate = new Date().getTime();
        if (Update) {
            document.getElementsByClassName("SMSync")[0].addEventListener("click", function() {
                setSync(CurrentDate, Update, Callback);
            });
        } else if (SyncFrequency && ((CurrentDate - GM_getValue("LastSync")) > (SyncFrequency * 86400000))) {
            setSync(CurrentDate, Update, Callback);
        }
    }

    function setSync(CurrentDate, Update, Callback) {
        var Popup, Sync;
        GM_setValue("LastSync", CurrentDate);
        Popup = createPopup(Update ? false : true);
        Popup.Icon.classList.add("fa-refresh");
        Popup.Title.textContent = Update ? "Syncing..." : "rhSGST is performing the automatic sync. Please do not close the popup or reload / close the tab until it has finished.";
        Sync = {};
        createButton(Popup.Button, "fa-times-circle", "Cancel", "", "", function() {
            Sync.Canceled = true;
            Popup.Close.click();
        }, null, true);
        Sync.Progress = Popup.Progress;
        Sync.OverallProgress = Popup.OverallProgress;
        Popup.popUp().reposition();
        sync(Sync, function(CurrentDate) {
            Popup.Icon.classList.remove("fa-refresh");
            Popup.Icon.classList.add("fa-check");
            Popup.Title.textContent = Update ? "Synced!" : "Automatic sync finished. You can now close the popup or reload / close the tab.";
            Popup.Button.innerHTML = "";
            Sync.Progress.innerHTML = Sync.OverallProgress.innerHTML = "";
            if (Update) {
                Popup.Close.click();
                Callback(CurrentDate);
            }
        });
    }

    function sync(Sync, Callback) {
        Sync.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Syncing your username / avatar...</span>";
        if (SG) {
            GM_setValue("Username", document.getElementsByClassName("nav__avatar-outer-wrap")[0].href.match(/\/user\/(.+)/)[1]);
        }
        GM_setValue("Avatar", document.getElementsByClassName(SG ? "nav__avatar-inner-wrap" : "nav_avatar")[0].style.backgroundImage.match(/\("(.+)"\)/)[1]);
        Sync.OverallProgress.innerHTML =
            "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
            "<span>Syncing your Steam groups...</span>";
        syncGroups(Sync, "/account/steam/groups/search?page=", 1, [], function(Groups) {
            GM_setValue("Groups", Groups);
            Sync.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Syncing your whitelist / blacklist...</span>";
            syncWhitelistBlacklist(Sync, function() {
                var CurrentDate;
                CurrentDate = new Date();
                GM_setValue("LastSync", CurrentDate.getTime());
                Callback(CurrentDate);
            });
        });
    }

    function syncGroups(Sync, URL, NextPage, Groups, Callback) {
        if (!Sync.Canceled) {
            queueRequest(Sync, null, URL + NextPage, function(Response) {
                var ResponseHTML, Matches, I, N, Pagination;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__column__heading");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Groups.push(Matches[I].getAttribute("href").match(/group\/(.+)\//)[1]);
                }
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    syncGroups(Sync, URL, ++NextPage, Groups, Callback);
                } else {
                    Callback(Groups);
                }
            });
        }
    }

    function syncWhitelistBlacklist(Sync, Callback) {
        var SavedUsers;
        if (!Sync.Canceled) {
            SavedUsers = GM_getValue("Users");
            clearWhitelistBlacklist(Sync, 0, SavedUsers.length, SavedUsers, function() {
                getWhitelistBlacklist(Sync, "/account/manage/whitelist/search?page=", 1, "Whitelisted", function() {
                    getWhitelistBlacklist(Sync, "/account/manage/blacklist/search?page=", 1, "Blacklisted", Callback);
                });
            });
        }
    }

    function clearWhitelistBlacklist(Sync, I, N, Users, Callback) {
        var User;
        if (!Sync.Canceled) {
            if (I < N) {
                if (Users[I].Whitelisted || Users[I].Blacklisted) {
                    User = {
                        Username: Users[I].Username,
                        ID: Users[I].ID,
                        SteamID64: Users[I].SteamID64,
                        Whitelisted: false,
                        Blacklisted: false
                    };
                    queueSave(Sync, User, function() {
                        setTimeout(clearWhitelistBlacklist, 0, Sync, ++I, N, Users, Callback);
                    });
                } else {
                    setTimeout(clearWhitelistBlacklist, 0, Sync, ++I, N, Users, Callback);
                }
            } else {
                Callback();
            }
        }
    }

    function getWhitelistBlacklist(Sync, URL, NextPage, Key, Callback) {
        if (!Sync.Canceled) {
            queueRequest(Sync, null, URL + NextPage, function(Response) {
                var ResponseHTML, Matches;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__column__heading");
                getWhitelistBlacklistUsers(Sync, 0, Matches.length, Matches, Key, function() {
                    var Pagination;
                    Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                    if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                        setTimeout(getWhitelistBlacklist, 0, Sync, URL, ++NextPage, Key, Callback);
                    } else {
                        Callback();
                    }
                });
            });
        }
    }

    function getWhitelistBlacklistUsers(Sync, I, N, Matches, Key, Callback) {
        var User;
        if (!Sync.Canceled) {
            if (I < N) {
                User = {
                    Username: Matches[I].textContent
                };
                User[Key] = true;
                queueSave(Sync, User, function() {
                    setTimeout(getWhitelistBlacklistUsers, 0, Sync, ++I, N, Matches, Key, Callback);
                });
            } else {
                Callback();
            }
        }
    }

    function parseJSON(String) {
        return JSON.parse(String);
    }

    function parseHTML(String) {
        return (new DOMParser()).parseFromString(String, "text/html");
    }

    function sortArray(Array) {
        return Array.sort(function (A, B) {
            return A.localeCompare(B, {
                sensitivity: "base"
            });
        });
    }

    function setSiblingsOpacity(Element, Opacity) {
        var Siblings, I, N;
        Siblings = Element.parentElement.children;
        for (I = 0, N = Siblings.length; I < N; ++I) {
            if (Siblings[I] != Element) {
                Siblings[I].style.opacity = Opacity;
            }
        }
    }

    function setHoverOpacity(Element, EnterOpacity, LeaveOpacity) {
        Element.addEventListener("mouseenter", function() {
            Element.style.opacity = EnterOpacity;
        });
        Element.addEventListener("mouseleave", function() {
            Element.style.opacity = LeaveOpacity;
        });
    }

    function setFadedGiveaway(Context) {
        Context.classList.remove("is-faded");
        Context.classList.add("rhFaded");
    }

    function formatDate(EntryDate) {
        var Hours, Minutes;
        Hours = EntryDate.getHours();
        Minutes = EntryDate.getMinutes();
        Minutes = (Minutes > 9) ? Minutes : ("0" + Minutes);
        return (["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][EntryDate.getMonth()] + " " + EntryDate.getDate() + ", " + EntryDate.getFullYear() + " " +
                ((Hours > 12) ? ((Hours - 12) + ":" + Minutes + " pm") : ((!Hours ? 12 : Hours) + ":" + Minutes + " am")));
    }

    function createPopup(Temp) {
        var Popup;
        document.body.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"popup page__outer-wrap page_outer_wrap rhPopup\">" +
            "    <div class=\"popup_summary\">" +
            "        <div class=\"popup_icon\">" +
            "            <i class=\"fa popup__icon rhPopupIcon\"></i>" +
            "        </div>" +
            "        <div class=\"popup_heading popup__heading\">" +
            "            <div class=\"popup_heading_h2 rhPopupTitle\"></div>" +
            "        </div>" +
            "    </div>" +
            "    <div class=\"rhPopupDescription\">" +
            "        <textarea class=\"rhPopupTextArea rhHidden\"></textarea>" +
            "        <input class=\"rhPopupTextInput rhHidden\"/>" +
            "        <ul class=\"rhPopupOptions\"></ul>" +
            "        <div class=\"rhPopupButton\"></div>" +
            "        <div class=\"rhPopupStatus\">" +
            "            <div class=\"rhPopupProgress\"></div>" +
            "            <div class=\"rhPopupOverallProgress\"></div>" +
            "        </div>" +
            "        <ul class=\"rhPopupResults\"></ul>" +
            "    </div>" +
            "    <div class=\"popup__actions popup_actions\">" +
            "        <a href=\"https://www.steamgifts.com/account#rhSGST\">Manage</a>" +
            "        <span class=\"b-close rhPopupClose\">Close</span>" +
            "    </div>" +
            "</div>"
        );
        Popup = {};
        Popup.Popup = document.body.lastElementChild;
        Popup.Icon = Popup.Popup.getElementsByClassName("rhPopupIcon")[0];
        Popup.Title = Popup.Popup.getElementsByClassName("rhPopupTitle")[0];
        Popup.Description = Popup.Popup.getElementsByClassName("rhPopupDescription")[0];
        Popup.TextArea = Popup.Popup.getElementsByClassName("rhPopupTextArea")[0];
        Popup.TextInput = Popup.Popup.getElementsByClassName("rhPopupTextInput")[0];
        Popup.Options = Popup.Popup.getElementsByClassName("rhPopupOptions")[0];
        Popup.Button = Popup.Popup.getElementsByClassName("rhPopupButton")[0];
        Popup.Status = Popup.Popup.getElementsByClassName("rhPopupStatus")[0];
        Popup.Progress = Popup.Popup.getElementsByClassName("rhPopupProgress")[0];
        Popup.OverallProgress = Popup.Popup.getElementsByClassName("rhPopupOverallProgress")[0];
        Popup.Results = Popup.Popup.getElementsByClassName("rhPopupResults")[0];
        Popup.Close = Popup.Popup.getElementsByClassName("rhPopupClose")[0];
        Popup.popUp = function(Callback) {
            return $(Popup.Popup).bPopup({
                amsl: [0],
                fadeSpeed: 200,
                followSpeed: 500,
                modalColor: "#3c424d",
                opacity: 0.85,
                onClose: function() {
                    if (Temp) {
                        Popup.Popup.remove();
                    }
                }
            }, Callback);
        };
        return Popup;
    }

    function createPopout(Context) {
        var Popout;
        Context.insertAdjacentHTML("beforeEnd", "<div class=\"page__outer-wrap page_outer_wrap rhPopout rhHidden\"></div>");
        Popout = {
            Popout: Context.lastElementChild,
            CustomRule: function(Target) {
                return true;
            },
            popOut: function(Context, Callback) {
                if (Callback) {
                    Callback(Popout.Popout);
                }
                Popout.Popout.classList.remove("rhHidden");
                Popout.Popout.removeAttribute("style");
                repositionPopout(Popout.Popout, Context);
            },
            reposition: function(Context) {
                repositionPopout(Popout.Popout, Context);
            }
        };
        document.addEventListener("click", function(Event) {
            if (!Popout.Popout.classList.contains("rhHidden") && document.body.contains(Event.target) && !Popout.Popout.parentElement.contains(Event.target) && Popout.CustomRule(Event.target)) {
                Popout.Popout.classList.add("rhHidden");
            }
        });
        return Popout;
    }

    function repositionPopout(Popout, Context) {
        var Width, Height;
        Width = Popout.offsetWidth;
        Height = Popout.offsetHeight;
        if ((Popout.offsetLeft + Width) > window.innerWidth) {
            Popout.style.marginLeft = "-" + (Width - Context.offsetWidth) + "px";
        }
        if ((Popout.offsetTop + Height + 44) > (window.scrollY + window.innerHeight)) {
            Popout.style.marginTop = "-" + (Height + Context.offsetHeight) + "px";
        }
    }

    function createButton(Context, DefaultIcon, DefaultName, OnClickIcon, OnClickName, DefaultCallback, OnClickCallback, White, Yellow) {
        var DefaultButton, OnClickButton;
        Context.innerHTML =
            "<div class=\"" + (White ? "form__saving-button white" : (Yellow ? "sidebar__entry-delete" : "form__submit-button green")) + " btn_action rhDefaultButton\">" +
            "    <i class=\"fa " + DefaultIcon + "\"></i>" +
            "    <span>" + DefaultName + "</span>" +
            "</div>" +
            "<div class=\"form__saving-button btn_action grey is-disabled is_disabled rhOnClickButton rhHidden\">" +
            "    <i class=\"fa " + OnClickIcon + "\"></i>" +
            "    <span>" + OnClickName + "</span>" +
            "</div>";
        DefaultButton = Context.firstElementChild;
        OnClickButton = Context.lastElementChild;
        DefaultButton.addEventListener("click", function() {
            DefaultButton.classList.add("rhHidden");
            OnClickButton.classList.remove("rhHidden");
            DefaultCallback(function() {
                OnClickButton.classList.add("rhHidden");
                DefaultButton.classList.remove("rhHidden");
            });
        });
        if (OnClickCallback) {
            OnClickButton.classList.remove("is-disabled", "is_disabled");
            OnClickButton.addEventListener("click", function() {
                OnClickButton.classList.add("rhHidden");
                DefaultButton.classList.remove("rhHidden");
                OnClickCallback();
            });
        }
    }

    function createCheckbox(Context, Default) {
        var Checkbox, Input, Disabled, Hover, Enabled;
        Context.innerHTML =
            "<span class=\"rhCheckbox\">" +
            "    <input class=\"rhHidden\" type=\"checkbox\">" +
            "    <i class=\"fa fa-circle-o\"></i>" +
            "    <i class=\"fa fa-circle rhHidden\"></i>" +
            "    <i class=\"fa fa-check-circle rhHidden\"></i>" +
            "</span>";
        Checkbox = Context.firstElementChild;
        Input = Checkbox.firstElementChild;
        Disabled = Input.nextElementSibling;
        Hover = Disabled.nextElementSibling;
        Enabled = Hover.nextElementSibling;
        Input.checked = Default;
        Checkbox.addEventListener("mouseenter", setCheckboxHover);
        Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
        Checkbox.addEventListener("click", function() {
            Input.checked = Input.checked ? false : true;
            setCheckboxEnabled();
        });
        setCheckboxEnabled();

        function setCheckboxHover() {
            Disabled.classList.add("rhHidden");
            Enabled.classList.add("rhHidden");
            Hover.classList.remove("rhHidden");
        }

        function setCheckboxDisabled() {
            Hover.classList.add("rhHidden");
            Enabled.classList.add("rhHidden");
            Disabled.classList.remove("rhHidden");
        }

        function setCheckboxEnabled() {
            if (Input.checked) {
                Disabled.classList.add("rhHidden");
                Hover.classList.add("rhHidden");
                Enabled.classList.remove("rhHidden");
                Checkbox.removeEventListener("mouseenter", setCheckboxHover);
                Checkbox.removeEventListener("mouseleave", setCheckboxDisabled);
            } else {
                Enabled.classList.add("rhHidden");
                Disabled.classList.remove("rhHidden");
                Checkbox.addEventListener("mouseenter", setCheckboxHover);
                Checkbox.addEventListener("mouseleave", setCheckboxDisabled);
            }
        }

        return {
            Checkbox: Input,
            check: function() {
                Input.checked = true;
                setCheckboxEnabled();
            },
            uncheck: function() {
                Input.checked = false;
                setCheckboxEnabled();
            },
            toggle: function() {
                Input.checked = Input.checked ? false : true;
                setCheckboxEnabled();
            }
        };
    }

    function createOptions(Context, Element, Options) {
        var I, N;
        for (I = 0, N = Options.length; I < N; ++I) {
            createOption(Context, Options[I], Element);
        }
    }

    function createOption(Context, Option, Element) {
        var Name, Checkbox, Key, ID, Dependency;
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<li" + (Option.Check() ? "" : " class=\"rhHidden\"") + ">" +
            "    <span></span>" +
            "    <span>" + Option.Description + "</span>" +
            "    <i class=\"fa fa-question-circle\" title=\"" + Option.Title + "\"></i>" +
            "</li>"
        );
        Name = Option.Name;
        Element[Name] = Context.lastElementChild;
        Checkbox = Element[Name].firstElementChild;
        Key = Option.Key;
        ID = Option.ID;
        Element[Key] = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
        Dependency = Option.Dependency;
        Checkbox.addEventListener("click", function() {
            GM_setValue(ID, Element[Key].checked);
            if (Dependency) {
                Element[Dependency].classList.toggle("rhHidden");
            }
        });
    }

    function createResults(Context, Element, Results) {
        var I, N, Key;
        for (I = 0, N = Results.length; I < N; ++I) {
            Context.insertAdjacentHTML(
                "beforeEnd",
                "<li class=\"rhHidden\">" + Results[I].Icon +
                "    <span class=\"rhBold\">" + Results[I].Description + " (<span>0</span>):</span>" +
                "    <span class=\"popup__actions\"></span>" +
                "</li>"
            );
            Key = Results[I].Key;
            Element[Key] = Context.lastElementChild;
            Element[Key + "Count"] = Element[Key].firstElementChild.nextElementSibling.firstElementChild;
            Element[Key + "Users"] = Element[Key].lastElementChild;
        }
    }

    function createDescription(Description) {
        return (
            "<form>" +
            "    <div class=\"form__input-description rhDescription\">" +
            "        <div class=\"input_description\">" + Description + "</div>" +
            "    </div>" +
            "</form>"
        );
    }

    function createNavigationSection(Name, Items) {
        var Section, I, N;
        Section =
            "<h3 class=\"sidebar__heading\">" + Name + "</h3>" +
            "<ul class=\"sidebar__navigation\">";
        for (I = 0, N = Items.length; I < N; ++I) {
            Section += createNavigationItem(Items[I].Name, Items[I].URL, Items[I].Title);
        }
        Section += "</ul>";
        return Section;
    }

    function createNavigationItem(Name, URL, Title) {
        return (
            "<li class=\"sidebar__navigation__item" + (Name ? (" " + Name) : "") + "\">" +
            "    <a class=\"sidebar__navigation__item__link\" href=\"" + URL + "\">" +
            "        <div class=\"sidebar__navigation__item__name\">" + Title + "</div>" +
            "        <div class=\"sidebar__navigation__item__underline\"></div>" +
            "    </a>" +
            "</li>"
        );
    }

    // Settings Menu

    function addSMButton() {
        var Sidebar, SMButton;
        Sidebar = document.getElementsByClassName("sidebar")[0];
        Sidebar.insertAdjacentHTML("beforeEnd", createNavigationSection("rhSGST", [{
            Name: "SMButton",
            Title: "Settings",
            URL: "#rhSGST"
        }, {
            Title: "Discussion",
            URL: "/discussion/TDyzv/"
        }, {
            Title: "GitHub",
            URL: "https://github.com/revilheart/rhSGST"
        }, {
            Title: "Update",
            URL: "https://github.com/revilheart/rhSGST/raw/master/rhSGST.user.js"
        }]));
        SMButton = Sidebar.getElementsByClassName("SMButton")[0];
        SMButton.addEventListener("click", function() {
            window.location.hash = "rhSGST";
            loadSMMenu(Sidebar, SMButton);
        });
        if (Hash.match(/rhSGST/)) {
            loadSMMenu(Sidebar, SMButton);
        }
    }

    function loadSMMenu(Sidebar, SMButton) {
        var Selected, Item, SMSyncFrequency, I, Container, SMFeatures, ID, SMImport, SMExport, SMRecentUsernameChanges, SMCommentHistory, SMManageTags, SMLastSync, LastSync;
        Selected = Sidebar.getElementsByClassName("is-selected")[0];
        Selected.classList.remove("is-selected");
        SMButton.classList.add("is-selected");
        Item = SMButton.getElementsByClassName("sidebar__navigation__item__link")[0];
        Item.insertBefore(Selected.getElementsByClassName("fa")[0], Item.firstElementChild);
        SMSyncFrequency = "<select class=\"SMSyncFrequency\">";
        for (I = 0; I <= 30; ++I) {
            SMSyncFrequency += "<option>" + I + "</option>";
        }
        SMSyncFrequency += "</select>";
        Container = Sidebar.nextElementSibling;
        Container.innerHTML =
            "<div class=\"page__heading\">" +
            "    <div class=\"page__heading__breadcrumbs\">" +
            "        <a href=\"/account\">Account</a>" +
            "        <i class=\"fa fa-angle-right\"></i>" +
            "        <a href=\"#rhSGST\">rhSGST</a>" +
            "    </div>" +
            "</div>" +
            "<div class=\"form__rows SMMenu\">" + createSMSections([{
                Title: "Features",
                Name: "SMFeatures"
            }, {
                Title: "Manage Data",
                HTML: (
                    "<div class=\"form__submit-button SMImport\">" +
                    "    <i class=\"fa fa-arrow-circle-up\"></i> Import" +
                    "</div>" +
                    "<div class=\"form__submit-button SMExport\">" +
                    "    <i class=\"fa fa-arrow-circle-down\"></i> Export" +
                    "</div>"
                )
            }, {
                Title: "Recent Username Changes",
                HTML: (
                    "<div class=\"form__submit-button SMRecentUsernameChanges\">" +
                    "    <i class=\"fa fa-user\"></i> " +
                    "    <span>Open</span>" +
                    "</div>"
                )
            }, {
                Title: "Comment History",
                HTML: (
                    "<div class=\"form__submit-button SMCommentHistory\">" +
                    "    <i class=\"fa fa-comments\"></i> " +
                    "    <span>Open</span>" +
                    "</div>"
                )
            }, {
                Title: "Manage Tags",
                HTML: (
                    "<div class=\"form__submit-button SMManageTags\">" +
                    "    <i class=\"fa fa-cog\"></i> " +
                    "    <span>Manage</span>" +
                    "</div>"
                )
            }, {
                Title: "Manage Whitelist / Blacklist Checker Caches",
                HTML: (
                    "<div class=\"form__submit-button WBCButton\">" +
                    "    <i class=\"fa fa-cog\"></i> " +
                    "    <span>Manage</span>" +
                    "</div>"
                )
            }, {
                Title: "Manage Not Activated / Multiple Wins Checker Caches",
                HTML: (
                    "<div class=\"form__submit-button NAMWCButton\">" +
                    "    <i class=\"fa fa-cog\"></i> " +
                    "    <span>Manage</span>" +
                    "</div>"
                )
            }, {
                Title: "Sync Whitelist / Blacklist",
                HTML: SMSyncFrequency + createDescription("Select from how many days to how many days you want the automatic sync to run (0 to disable it).") + (
                    "<div class=\"form__sync\">" +
                    "    <div class=\"form__sync-data\">" +
                    "        <div class=\"notification notification--warning SMLastSync\">" +
                    "            <i class=\"fa fa-question-circle\"></i> Never synced." +
                    "        </div>" +
                    "    </div>" +
                    "    <div class=\"form__submit-button SMSync\">" +
                    "        <i class=\"fa fa-refresh\"></i> Sync" +
                    "    </div>" +
                    "</div>"
                )
            }]) +
            "</div>";
        SMFeatures = Container.getElementsByClassName("SMFeatures")[0];
        for (ID in Features) {
            SMFeatures.appendChild(getSMFeature(Features[ID], ID));
        }
        SMImport = Container.getElementsByClassName("SMImport")[0];
        SMExport = Container.getElementsByClassName("SMExport")[0];
        SMRecentUsernameChanges = Container.getElementsByClassName("SMRecentUsernameChanges")[0];
        SMCommentHistory = Container.getElementsByClassName("SMCommentHistory")[0];
        SMManageTags = Container.getElementsByClassName("SMManageTags")[0];
        SMSyncFrequency = Container.getElementsByClassName("SMSyncFrequency")[0];
        SMSyncFrequency.selectedIndex = GM_getValue("SyncFrequency");
        SMLastSync = Container.getElementsByClassName("SMLastSync")[0];
        LastSync = GM_getValue("LastSync");
        if (LastSync) {
            SMLastSync.classList.remove("notification--warning");
            SMLastSync.classList.add("notification--success");
            SMLastSync.innerHTML = "<i class=\"fa fa-check-circle\"></i> Last synced " + (new Date(LastSync).toLocaleString()) + ".";
        }
        checkSync(true, function(CurrentDate) {
            SMLastSync.classList.remove("notification--warning");
            SMLastSync.classList.add("notification--success");
            SMLastSync.innerHTML =
                "<i class=\"fa fa-check-circle\"></i> Last synced " + CurrentDate.toLocaleString() + ".";
        });
        addWBCButton();
        addNAMWCButton();
        SMSyncFrequency.addEventListener("change", function() {
            GM_setValue("SyncFrequency", SMSyncFrequency.selectedIndex);
        });
        SMImport.addEventListener("click", function() {
            var File, Reader;
            File = document.createElement("input");
            File.type = "file";
            File.click();
            File.addEventListener("change", function() {
                File = File.files[0];
                if (File.name.match(/\.json/)) {
                    Reader = new FileReader();
                    Reader.readAsText(File);
                    Reader.onload = function() {
                        var Key;
                        File = parseJSON(Reader.result);
                        if (File.rhSGST && (File.rhSGST == "Data")) {
                            if (window.confirm("Are you sure you want to import this data? Your entire current data will be overwritten. A copy will be downloaded as precaution.")) {
                                SMExport.click();
                                for (Key in File.Data) {
                                    GM_setValue(Key, File.Data[Key]);
                                }
                                window.alert("Imported!");
                            }
                        } else {
                            window.alert("Wrong file!");
                        }
                    };
                } else {
                    window.alert("File should be in the .json format.");
                }
            });
        });
        SMExport.addEventListener("click", function() {
            var File, Values, Data, URL, N, Key;
            File = document.createElement("a");
            File.download = "rhSGST.json";
            Values = GM_listValues();
            Data = {};
            for (I = 0, N = Values.length; I < N; ++I) {
                Key = Values[I];
                Data[Key] = GM_getValue(Key);
            }
            Data = new Blob([JSON.stringify({
                rhSGST: "Data",
                Data: Data
            })]);
            URL = window.URL.createObjectURL(Data);
            File.href = URL;
            document.body.appendChild(File);
            File.click();
            File.remove();
            window.URL.revokeObjectURL(URL);
            window.alert("Exported!");
        });
        SMManageTags.addEventListener("click", function() {
            var Popup, MT, SMManageTagsPopup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-cog");
            Popup.Title.textContent = "Manage tags:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading\"></div>");
            MT = {};
            addMTContainer(Popup.TextInput.previousElementSibling, MT, {
                Popup: Popup
            });
            Popup.TextInput.insertAdjacentHTML(
                "afterEnd",
                createDescription("Filter users by tag (use commas to separate filters, for example: Filter1, Filter2, ...). Filters are not case sensitive.")
            );
            SMManageTagsPopup = Popup.popUp(function() {
                var SavedUsers, MTUsers, Tags, I, N, Context, Username, SavedTags, J, NumTags, Key;
                SavedUsers = GM_getValue("Users");
                MTUsers = {};
                Tags = {};
                for (I = 0, N = SavedUsers.length; I < N; ++I) {
                    if (SavedUsers[I].Tags) {
                        Popup.Results.insertAdjacentHTML(
                            "beforeEnd",
                            "<div>" +
                            "    <a href=\"/user/" + SavedUsers[I].Username + "\">" + SavedUsers[I].Username + "</a>" +
                            "</div>"
                        );
                        Context = Popup.Results.lastElementChild.firstElementChild;
                        Username = SavedUsers[I].Username;
                        if (!MTUsers[Username]) {
                            MTUsers[Username] = [];
                        }
                        MTUsers[Username].push(Context);
                        SMManageTagsPopup.reposition();
                        SavedTags = SavedUsers[I].Tags.split(/,\s/g);
                        for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                            Key = SavedTags[J].toLowerCase();
                            if (!Tags[Key]) {
                                Tags[Key] = [];
                            }
                            Tags[Key].push(Popup.Results.children.length - 1);
                        }
                    }
                }
                addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                loadEndlessFeatures(Popup.Results);
                Popup.TextInput.addEventListener("input", function() {
                    var MTUsers, Matches, Filters, Context, Username;
                    selectMTCheckboxes(MT.UserCheckboxes, "uncheck", MT, "User");
                    removeMTCheckboxes("User", MT);
                    MTUsers = {};
                    Matches = Popup.Results.getElementsByClassName("SMTag");
                    for (I = 0, N = Matches.length; I < N; ++I) {
                        if (Matches[I]) {
                            Matches[I].classList.remove("SMTag");
                        }
                    }
                    if (Popup.TextInput.value) {
                        Popup.Results.classList.add("SMTags");
                        Filters = Popup.TextInput.value.split(/,\s*/g);
                        for (I = 0, N = Filters.length; I < N; ++I) {
                            Key = Filters[I].toLowerCase();
                            if (Tags[Key]) {
                                for (J = 0, NumTags = Tags[Key].length; J < NumTags; ++J) {
                                    Context = Popup.Results.children[Tags[Key][J]];
                                    Context.classList.add("SMTag");
                                    Context = Context.querySelector("a[href*='/user/']");
                                    Username = Context.textContent;
                                    if (!MTUsers[Username]) {
                                        MTUsers[Username] = [];
                                    }
                                    MTUsers[Username].push(Context);
                                }
                            }
                        }
                    } else {
                        Popup.Results.classList.remove("SMTags");
                        Matches = Popup.Results.querySelectorAll("a[href*='/user/']");
                        for (I = 0, N = Matches.length; I < N; ++I) {
                            Context = Matches[I];
                            Username = Context.textContent;
                            if (!MTUsers[Username]) {
                                MTUsers[Username] = [];
                            }
                            MTUsers[Username].push(Context);
                        }
                    }
                    addMTCheckboxes(MTUsers, "User", "beforeBegin", "previousElementSibling", MT);
                    SMManageTagsPopup.reposition();
                });
            });
        });
        SMRecentUsernameChanges.addEventListener("click", function() {
            var Popup, SMRecentUsernameChangesPopup;
            Popup = createPopup(true);
            Popup.Results.classList.add("SMRecentUsernameChanges");
            Popup.Icon.classList.add("fa-comments");
            Popup.Title.textContent = "Recent Username Changes";
            Popup.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Loading recent username changes...</span>";
            makeRequest(null, "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=2", Popup.Progress, function(Response) {
                var RecentChanges, HTML, N;
                Popup.Progress.innerHTML = "";
                RecentChanges = parseJSON(Response.responseText).RecentChanges;
                HTML = "";
                for (I = 0, N = RecentChanges.length; I < N; ++I) {
                    HTML += "<div>" + RecentChanges[I][0] + " changed to <a class=\"rhBold\" href=\"/user/" + RecentChanges[I][1] + "\">" + RecentChanges[I][1] + "</a></div>";
                }
                Popup.Results.innerHTML = HTML;
                loadEndlessFeatures(Popup.Results);
                SMRecentUsernameChangesPopup.reposition();
            });
            SMRecentUsernameChangesPopup = Popup.popUp();
        });
        SMCommentHistory.addEventListener("click", function() {
            var Popup;
            Popup = createPopup(true);
            Popup.Popup.style.width = "600px";
            Popup.Icon.classList.add("fa-comments");
            Popup.Title.textContent = "Comment History";
            Popup.Results.classList.add("SMComments");
            Popup.Results.innerHTML = GM_getValue("CommentHistory");
            loadMatchesFeatures(Popup.Results, [{
                Check: true,
                Query: "[data-timestamp]",
                Callback: setATTimestamp
            }]);
            Popup.popUp();
        });
    }

    function getSMFeature(Feature, ID) {
        var Menu, Checkbox, CheckboxInput, SMFeatures, Key;
        Menu = document.createElement("div");
        Menu.insertAdjacentHTML(
            "beforeEnd",
            "<span></span>" +
            "<span> " + Feature.Name + "</span>" +
            "<div class=\"form__row__indent SMFeatures rhHidden\"></div>"
        );
        Checkbox = Menu.firstElementChild;
        CheckboxInput = createCheckbox(Checkbox, GM_getValue(ID)).Checkbox;
        SMFeatures = Menu.lastElementChild;
        for (Key in Feature) {
            if (Key != "Name") {
                SMFeatures.appendChild(getSMFeature(Feature[Key], Key));
            }
        }
        if (CheckboxInput.checked && SMFeatures.children.length) {
            SMFeatures.classList.remove("rhHidden");
        }
        Checkbox.addEventListener("click", function() {
            GM_setValue(ID, CheckboxInput.checked);
            if (CheckboxInput.checked && SMFeatures.children.length) {
                SMFeatures.classList.remove("rhHidden");
            } else {
                SMFeatures.classList.add("rhHidden");
            }
        });
        return Menu;
    }

    function createSMSections(Sections) {
        var SectionsHTML, I, N;
        SectionsHTML = "";
        for (I = 0, N = Sections.length; I < N; ++I) {
            SectionsHTML +=
                "<div class=\"form__row\">" +
                "    <div class=\"form__heading\">" +
                "        <div class=\"form__heading__number\">" + (I + 1) + ".</div>" +
                "        <div class=\"form__heading__text\">" + Sections[I].Title + "</div>" +
                "    </div>" +
                "    <div class=\"form__row__indent" + (Sections[I].Name ? (" " + Sections[I].Name) : "") + "\">" + (Sections[I].HTML ? Sections[I].HTML : "") + "</div>" +
                "</div>";
        }
        return SectionsHTML;
    }

    // Featured Container Hider

    function hideFCHContainer() {
        document.getElementsByClassName("featured__container")[0].classList.add("rhHidden");
    }

    // Fixed Elements

    function fixFEElements() {
        if (GM_getValue("FE_H")) {
            fixFEHeader();
        }
        if (GM_getValue("FE_HI")) {
            fixFEHeading();
        }
        if (SG && GM_getValue("FE_S")) {
            fixFESidebar();
        }
        if (GM_getValue("FE_F")) {
            fixFEFooter();
        }
    }

    function fixFEHeader() {
        var Header;
        Header = document.getElementsByTagName("header")[0];
        Header.classList.add("FEHeader");
        Header.style.height = "auto";
        (document.getElementsByClassName("featured__container")[0] || document.getElementsByClassName(SG ? "page__outer-wrap" : "page_outer_wrap")[0]).style.marginTop =
            Header.offsetHeight + "px";
    }

    function fixFEHeading() {
        var Headings, Heading, Height, Width, Container, Top, Background;
        Headings = document.getElementsByClassName(SG ? "page__heading" : "page_heading");
        Heading = Headings[Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\//) ? 1 : 0];
        if (!Heading) {
            Heading = Headings[0];
        }
        Heading.classList.add("FEHeading");
        Height = document.getElementsByTagName("header")[0].offsetHeight + 25;
        Width = Heading.offsetWidth + "px";
        document.addEventListener("scroll", fixHeading);
        fixHeading();

        function fixHeading() {
            Top = Heading.offsetTop - Height;
            if (window.scrollY > Top) {
                document.removeEventListener("scroll", fixHeading);
                Heading.classList.add("FEHeadingFixed");
                Heading.style.top = Height + "px";
                Heading.style.width = Width;
                Heading.insertAdjacentHTML("afterBegin", "<div class=\"" + (SG ? "page__outer-wrap" : "page_outer_wrap") + " FEHeadingBackground\"></div>");
                Background = Heading.firstElementChild;
                Background.style.height = (Height + Heading.offsetHeight + 5) + "px";
                Background.style.width = Width;
                document.addEventListener("scroll", unfixHeading);
            }
        }

        function unfixHeading() {
            if (window.scrollY <= Top) {
                document.removeEventListener("scroll", unfixHeading);
                Heading.classList.remove("FEHeadingFixed");
                Heading.removeAttribute("style");
                Background.remove();
                document.addEventListener("scroll", fixHeading);
            }
        }
    }

    function fixFESidebar() {
        var Sidebar, Height, Container, Ad, Top;
        Sidebar = document.getElementsByClassName("sidebar")[0];
        if (Sidebar) {
            Height = document.getElementsByTagName("header")[0].offsetHeight + 25;
            Container = Sidebar.nextElementSibling;
            Ad = Path.match(/^\/giveaway(?!.+(entries|winners))\//) ?
                Sidebar.getElementsByClassName("sidebar__search-container")[0].nextElementSibling : Sidebar.getElementsByClassName("sidebar__mpu")[0];
            document.addEventListener("scroll", fixSidebar);
            fixSidebar();
        }

        function fixSidebar() {
            Top = Sidebar.offsetTop;
            if ((window.scrollY + Height) > Top) {
                document.removeEventListener("scroll", fixSidebar);
                Sidebar.classList.add("FESidebar");
                Sidebar.style.top = Height + "px";
                Container.style.marginLeft = (Sidebar.offsetWidth + 25) + "px";
                if (Ad) {
                    Ad.classList.add("rhHidden");
                }
                document.addEventListener("scroll", unfixSidebar);
            }
        }

        function unfixSidebar() {
            if ((window.scrollY + Height) <= Top) {
                document.removeEventListener("scroll", unfixSidebar);
                Sidebar.classList.remove("FESidebar");
                Container.style.marginLeft = "25px";
                if (Ad) {
                    Ad.classList.remove("rhHidden");
                }
                document.addEventListener("scroll", fixSidebar);
            }
        }
    }

    function fixFEFooter() {
        var Footer;
        Footer = SG ? document.getElementsByClassName("footer__outer-wrap")[0] : document.getElementsByTagName("footer")[0];
        Footer.classList.add("FEFooter");
        document.getElementsByClassName(SG ? "page__outer-wrap" : "page_outer_wrap")[0].style.marginBottom = Footer.offsetHeight + "px";
    }

    // Endless Scrolling

    function addESPanel(Heading) {
        var Context, RS, Temp, I, N, RecentDiscussions, Container, CommentBox, MainPagination, ESPanel, ESRefresh, Match, URL, NextPage, CurrentPage,
            Navigation, ESPause, ESStatus;
        Heading.classList.add("ESHeading");
        Context = getESContext(document);
        if (Context || (typeof Context == "undefined")) {
            RS = !GM_getValue("ES_RS") && Path.match(/^\/discussion\//);
            if (RS) {
                Temp = document.createDocumentFragment();
                for (I = 0, N = Context.children.length; I < N; ++I) {
                    Temp.appendChild(Context.lastElementChild);
                }
                Context.appendChild(Temp);
            }
            RecentDiscussions = document.getElementsByClassName("widget-container--margin-top")[0];
            if (GM_getValue("ES_RD") && RecentDiscussions) {
                RecentDiscussions.classList.add("ESRecentDiscussions");
                Container = Heading.parentElement;
                Container.insertBefore(RecentDiscussions.previousElementSibling, Container.firstElementChild);
                Container.insertBefore(RecentDiscussions, Container.firstElementChild.nextElementSibling);
            }
            MainPagination = document.getElementsByClassName("pagination")[0];
            CommentBox = document.getElementsByClassName(SG ? "comment comment--submit" : "reply_form")[0];
            if (CommentBox && !CommentBox.classList.contains("is_hidden")) {
                Heading.insertAdjacentHTML(
                    "afterEnd",
                    "<div class=\"ESCommentBox\">" +
                    "    <div class=\"pagination\"></div>" +
                    "</div>" +
                    "<div class=\"row-spacer\"></div>"
                );
                Heading.nextElementSibling.appendChild(CommentBox);
            }
            if (MainPagination) {
                Heading.insertAdjacentHTML("beforeEnd", "<div class=\"page_heading_btn ESPanel\"></div>");
                ESPanel = Heading.lastElementChild;
                ESPanel.insertAdjacentHTML(
                    "beforeEnd",
                    "<a class=\"ESRefresh\" title=\"Refresh current page.\">" +
                    "    <i class=\"fa fa-refresh\"></i>" +
                    "</a>"
                );
                ESRefresh = ESPanel.lastElementChild;
                Match = Location.match(/(.+?)(#.+?)?$/)[1].match(/(.+?)(\/search\?(page=(\d+))?(.*))?$/);
                URL = Match[1] + (Path.match(/^\/$/) ? (SG ? "giveaways/" : "trades/") : "/") + "search?" + (Match[5] ? (Match[5].replace(/^&|&$/g, "") + "&") : "") + "page=";
                NextPage = Match[4] ? (RS ? (parseInt(Match[4]) - 1) : (parseInt(Match[4]) + 1)) : (RS ? 0 : 2);
                CurrentPage = RS ? (NextPage + 1) : (NextPage - 1);
                if (Context) {
                    Context.insertAdjacentHTML("afterBegin", "<div id=\"ESPage" + CurrentPage + "\"></div>");
                } else {
                    Heading.parentElement.insertAdjacentHTML(
                        "beforeEnd",
                        "<div class=\"ESContext\">" +
                        "    <div class=\"rhHidden\" id=\"ESPage" + CurrentPage + "\"></div>" +
                        "</div>"
                    );
                }
                Navigation = MainPagination.getElementsByClassName(SG ? "pagination__navigation" : "pagination_navigation")[0];
                if (Navigation) {
                    ESPanel.insertBefore(Navigation, ESPanel.firstElementChild);
                    MainPagination.remove();
                    MainPagination = Navigation;
                    setESPagination(MainPagination);
                    if ((RS && !MainPagination.firstElementChild.classList.contains("is-selected")) || (!RS && !MainPagination.lastElementChild.classList.contains(SG ?
                    "is-selected" : "is_selected"))) {
                        ESPanel.insertAdjacentHTML(
                            "beforeEnd",
                            "<a class=\"ESPause\" title=\"Pause the endless scrolling.\">" +
                            "    <i class=\"fa fa-pause\"></i>" +
                            "</a>"
                        );
                        ESPause = ESPanel.lastElementChild;
                        ESPause.addEventListener("click", function() {
                            if (ESPause.classList.contains("ESPaused")) {
                                ESPause.classList.remove("ESPaused");
                                ESPause.title = "Pause the endless scrolling.";
                                ESPause.innerHTML = "<i class=\"fa fa-pause\"></i>";
                                loadESNextPage();
                                document.addEventListener("scroll", loadESNextPage);
                            } else {
                                document.removeEventListener("scroll", loadESNextPage);
                                ESPause.classList.add("ESPaused");
                                ESPause.title = "Resume the endless scrolling.";
                                ESPause.innerHTML = "<i class=\"fa fa-play\"></i>";
                            }
                        });
                        document.addEventListener("scroll", loadESNextPage);
                    }
                } else {
                    MainPagination.remove();
                }
                if (!document.getElementsByClassName("FEHeading")[0]) {
                    fixFEHeading();
                }
                ESRefresh.addEventListener("click", function() {
                    refreshESPage(ESRefresh, URL + CurrentPage, document.getElementById("ESPage" + CurrentPage), RS);
                });
            }
        }

        function loadESNextPage() {
            if (window.scrollY >= (document.body.offsetHeight - (window.innerHeight * 2))) {
                document.removeEventListener("scroll", loadESNextPage);
                Context.insertAdjacentHTML(
                    "beforeEnd",
                    "<div class=\"ESStatus\">" +
                    "    <i class=\"fa fa-circle-o-notch fa-spin\"></i> Loading next page..." +
                    "</div>"
                );
                ESStatus = Context.lastElementChild;
                makeRequest(null, URL + NextPage, ESStatus, function(Response) {
                    var ResponseHTML, Pagination, Top, PaginationBackup;
                    ResponseHTML = parseHTML(Response.responseText);
                    ESStatus.innerHTML =
                        "<div class=\"page__heading page_heading\">" +
                        "    <div class=\"page__heading__breadcrumbs page_heading_breadcrumbs\">Page " + NextPage + "</div>" +
                        "</div>";
                    Context.appendChild(getESContent(ResponseHTML, RS));
                    ESStatus.nextElementSibling.id = "ESPage" + NextPage;
                    Pagination = ResponseHTML.getElementsByClassName(SG ? "pagination__navigation" : "pagination_navigation")[0];
                    if (Pagination && ((RS && !Pagination.firstElementChild.classList.contains("is-selected")) || (!RS && !Pagination.lastElementChild.classList.contains(SG ?
                    "is-selected" : "is_selected")))) {
                        if (RS) {
                            --NextPage;
                        } else {
                            ++NextPage;
                        }
                        document.addEventListener("scroll", loadESNextPage);
                    }
                    Top = ESStatus.offsetTop - Heading.getElementsByClassName("FEHeadingBackground")[0].offsetHeight;
                    PaginationBackup = MainPagination.innerHTML;
                    document.addEventListener("scroll", setESNextPage);

                    function setESNextPage() {
                        if (window.scrollY > Top) {
                            document.removeEventListener("scroll", setESNextPage);
                            if (RS) {
                                --CurrentPage;
                            } else {
                                ++CurrentPage;
                            }
                            MainPagination.innerHTML = Pagination.innerHTML;
                            setESPagination(MainPagination);
                            document.addEventListener("scroll", setESPreviousPage);
                        }
                    }

                    function setESPreviousPage() {
                        if (window.scrollY <= Top) {
                            document.removeEventListener("scroll", setESPreviousPage);
                            if (RS) {
                                ++CurrentPage;
                            } else {
                                --CurrentPage;
                            }
                            MainPagination.innerHTML = PaginationBackup;
                            setESPagination(MainPagination);
                            document.addEventListener("scroll", setESNextPage);
                        }
                    }
                });
            }
        }
    }

    function getESContext(Context) {
        if (SG) {
            if (Path.match(/(^\/$|^\/giveaways)/)) {
                if (GM_getValue("ES_R") && Path.match(/\/(created|entered|won|wishlist)/)) {
                    return Context.getElementsByClassName("table__rows")[0];
                } else if (GM_getValue("ES_G")) {
                    return Context.getElementsByClassName("page__heading")[0].nextElementSibling;
                } else {
                    return null;
                }
            } else if (GM_getValue("ES_D") && Path.match(/^\/(discussions|support\/tickets)/)) {
                return Context.getElementsByClassName("table__rows")[0];
            } else if (GM_getValue("ES_R") && Path.match(/^\/(account|archive|users)/)) {
                return Context.getElementsByClassName("table__rows")[0];
            } else if (GM_getValue("ES_DC") && Path.match(/^\/(discussion|support\/ticket)\//)) {
                return Context.getElementsByClassName("comments")[1];
            } else if (GM_getValue("ES_R") && Path.match(/^\/(messages|user\/)/)) {
                return Context.getElementsByClassName("page__heading")[0].nextElementSibling;
            } else if (Path.match(/^\/giveaway\//)) {
                if (Path.match(GM_getValue("ES_R") && /\/(entries|winners)/)) {
                    return Context.getElementsByClassName("table__rows")[0];
                } else if (GM_getValue("ES_GC")) {
                    return Context.getElementsByClassName("comments")[0];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            if (GM_getValue("ES_D") && Path.match(/(^\/$|\/trades)/)) {
                return Context.getElementsByClassName("table__rows")[0];
            } else if (GM_getValue("ES_R") && Path.match(/^\/user\//)) {
                return Context.getElementsByClassName("reviews")[0];
            } else if (GM_getValue("ES_DC")) {
                return Context.getElementsByClassName("comments")[1];
            } else {
                return null;
            }
        }
    }

    function setESPagination(Pagination) {
        var Items, I, N;
        Items = Pagination.children;
        for (I = 0, N = Items.length; I < N; ++I) {
            setESPaginationItem(Items[I]);
        }
    }

    function setESPaginationItem(Item) {
        var Link, ID;
        Link = Item.getAttribute("href");
        if (!Link) {
            Link = Item.getAttribute("data-href");
        }
        Item.setAttribute("data-href", Link);
        Item.removeAttribute("href");
        ID = "ESPage" + Item.getAttribute("data-page-number");
        Item.addEventListener("click", function() {
            if (document.getElementById(ID)) {
                window.location.hash = "";
                window.location.hash = ID;
            } else {
                window.location.href = Link;
            }
        });
    }

    function refreshESPage(Context, URL, Container, RS) {
        Context.innerHTML = "<i class=\"fa fa-refresh fa-spin\"></i>";
        makeRequest(null, URL, Context, function(Response) {
            var Sibling;
            do {
                Sibling = Container.nextElementSibling;
                if (Sibling && !Sibling.classList.contains("ESStatus")) {
                    Sibling.remove();
                }
            } while (Sibling && !Sibling.classList.contains("ESStatus"));
            Container.parentElement.insertBefore(getESContent(parseHTML(Response.responseText), RS), Sibling);
            Context.innerHTML = "<i class=\"fa fa-refresh\"></i>";
        });
    }

    function getESContent(Response, RS) {
        var Context, ESContext, I, N, DocumentFragment;
        Context = getESContext(Response);
        ESContext = document.getElementsByClassName("ESContext")[0];
        if (Context && ESContext) {
            for (I = 0, N = Context.classList.length; I < N; ++I) {
                ESContext.classList.add(Context.classList[I]);
            }
            ESContext.classList.remove("ESContext");
        }
        DocumentFragment = document.createDocumentFragment();
        if (Context) {
            loadEndlessFeatures(Context);
            setESHide(Context);
            for (I = 0, N = Context.children.length; I < N; ++I) {
                DocumentFragment.appendChild(Context[RS ? "lastElementChild" : "firstElementChild"]);
            }
        }
        return DocumentFragment;
    }

    function setESHide(Context) {
        var Matches, I, N;
        Matches = Context.getElementsByClassName("giveaway__hide trigger-popup");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[I].addEventListener("click", function(Event) {
                var Popup, Giveaway;
                Popup = document.getElementsByClassName("popup--hide-games")[0];
                Giveaway = Event.currentTarget.closest(".giveaway__row-outer-wrap");
                Popup.querySelector("[name=game_id]").value = Giveaway.getAttribute("data-game-id");
                Popup.getElementsByClassName("popup__heading__bold")[0].textContent = Giveaway.getElementsByClassName("giveaway__heading__name")[0].textContent;
                $(Popup).bPopup().close();
                $(Popup).bPopup({
                    amsl: [0],
                    fadeSpeed: 200,
                    followSpeed: 500,
                    modalColor: "#3c424d",
                    opacity: 0.85
                });
            });
        }
    }

    // GV - Grid View

    function setGVContainer(Context) {
        var GVBox, GVInfo, Columns, GVIcons, Element;
        Context.parentElement.classList.add("GVView");
        Context.classList.add("GVContainer");
        GVBox = Context.getElementsByClassName("giveaway__row-inner-wrap")[0];
        GVBox.classList.add("GVBox");
        GVBox.insertAdjacentHTML("afterBegin", "<div class=\"global__image-outer-wrap GVInfo rhHidden\"></div>");
        GVInfo = GVBox.firstElementChild;
        do {
            Element = GVInfo.nextElementSibling;
            if (Element) {
                GVInfo.appendChild(Element);
            }
        } while (Element);
        GVBox.insertBefore(Context.getElementsByClassName("global__image-outer-wrap--game-medium")[0], GVInfo);
        Columns = Context.getElementsByClassName("giveaway__columns")[0];
        Context.insertAdjacentHTML("afterBegin", "<div class=\"GVIcons giveaway__columns\"></div>");
        GVIcons = Context.firstElementChild;
        while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
            Element = Columns.lastElementChild;
            if (Element.textContent.match(/Level/)) {
                Element.textContent = Element.textContent.replace(/Level\s/, "");
            }
            GVIcons.appendChild(Element);
        }
        GVBox.addEventListener("mouseenter", function() {
            GVInfo.classList.remove("rhHidden");
            repositionPopout(GVInfo, GVBox);
        });
        GVBox.addEventListener("mouseleave", function() {
            GVInfo.classList.add("rhHidden");
        });
    }

    // SGPB - SteamGifts Profile Button

    function addSGPBButton(SteamID64, SteamButton) {
        var Context;
        Context = document.getElementsByClassName("profile_links")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<div class=\"profile_reputation\">" +
            "    <a class=\"btn_action white SGPBButton\" href=\"https://www.steamgifts.com/go/user/" + SteamID64 + "\" rel=\"nofollow\" target=\"_blank\">" +
            "        <i class=\"fa\">" +
            "            <img src=\"https://cdn.steamgifts.com/img/favicon.ico\"/>" +
            "        </i>" +
            "        <span>Visit SteamGifts Profile</span>" +
            "    </a>" +
            "</div>"
        );
        Context = Context.lastElementChild;
        Context.insertBefore(SteamButton, Context.firstElementChild);
    }

    // STPB - SteamTrades Profile Button

    function addSTPBButton(Context, SteamID64) {
        var STPBButton;
        Context = Context.getElementsByClassName("sidebar__shortcut-inner-wrap")[0];
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<a class=\"STPBButton\" href=\"https://www.steamtrades.com/user/" + SteamID64 + "\" rel=\"nofollow\" target=\"_blank\">" +
            "    <i class=\"fa fa-fw\">" +
            "        <img src=\"https://cdn.steamtrades.com/img/favicon.ico\"/>" +
            "    </i>" +
            "</a>"
        );
        STPBButton = Context.lastElementChild;
        Context = Context.parentElement.getElementsByClassName("js-tooltip")[0];
        if (Context) {
            STPBButton.addEventListener("mouseenter", function() {
                Context.textContent = "Visit SteamTrades Profile";
                setSiblingsOpacity(STPBButton, "0.2");
            });
            STPBButton.addEventListener("mouseleave", function() {
                setSiblingsOpacity(STPBButton, "1");
            });
        }
    }

    // UH - Username History

    function addUHContainer(Context, SteamID64, Username) {
        var UHContainer, UHButton, UHBox, UHList, URL;
        Context = Context.getElementsByClassName("featured__heading__medium")[0];
        Context.insertAdjacentHTML(
            "afterEnd",
            "<div class=\"UHContainer\">" +
            "    <a class=\"UHButton\">" +
            "        <i class=\"fa fa-caret-down\"></i>" +
            "    </a>" +
            "    <div class=\"featured__outer-wrap UHBox rhHidden\">" +
            "        <div class=\"featured__table__row__left\">Username History</div>" +
            "        <br/>" +
            "        <ul class=\"featured__table__row__right UHList\"></ul>" +
            "    </div>" +
            "</div>"
        );
        UHContainer = Context.nextElementSibling;
        UHButton = UHContainer.firstElementChild;
        UHBox = UHButton.nextElementSibling;
        UHList = UHBox.lastElementChild;
        UHButton.addEventListener("click", function() {
            UHBox.classList.toggle("rhHidden");
            if (!UHList.innerHTML) {
                UHList.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Loading usernames...</span>";
                URL = "https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=1&SteamID64=" + SteamID64 + "&Username=" + Username;
                makeRequest(null, URL, UHList, function(Response) {
                    UHList.innerHTML = "<li>" + parseJSON(Response.responseText).Usernames.join("</li><li>") + "</li>";
                });
            }
        });
        document.addEventListener("click", function(Event) {
            if (!UHBox.classList.contains("rhHidden") && !UHContainer.contains(Event.target)) {
                UHBox.classList.add("rhHidden");
            }
        });
    }

    // CH - Comment History

    function saveCHComment(Context, URL, Title, ID) {
        var Username;
        Username = Context ? Context.previousElementSibling.getElementsByClassName("comment__username")[0].textContent : null;
        GM_setValue(
            "CommentHistory",
            "<div>" +
            "    You " + (Username ? ("replied to <a class=\"rhBold\" href=\"/user/" + Username + "\">" + Username + "</a> on") : "added a comment to") +
            "    <a class=\"rhBold\" href=\"" + URL + "\">" + Title + "</a> at" +
            "    <a class=\"rhBold\" data-timestamp=\"" + Math.floor((new Date().getTime()) / 1000) + "\" href=\"/go/comment/" + ID + "\"></a>." +
            "</div>" +
            GM_getValue("CommentHistory")
        );
    }

    // Permanent User Notes

    function addPUNButton(Context, Username, ID, SteamID64) {
        var PUNButton, UserID, User, PUNIcon, SavedUser;
        Context.insertAdjacentHTML(
            SG ? "beforeEnd" : "afterBegin",
            "<a class=\"page_heading_btn PUNButton\">" +
            "    <i class=\"fa PUNIcon\"></i>" +
            "</a>"
        );
        PUNButton = Context[SG ? "lastElementChild" : "firstElementChild"];
        UserID = SG ? Username : SteamID64;
        User = {
            Username: Username,
            ID: ID,
            SteamID64: SteamID64
        };
        PUNIcon = PUNButton.firstElementChild;
        SavedUser = getUser(User);
        PUNIcon.classList.add((SavedUser && SavedUser.Notes) ? "fa-sticky-note" : "fa-sticky-note-o");
        PUNButton.addEventListener("click", function() {
            var Popup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-sticky-note");
            Popup.Title.innerHTML = "Edit user notes for <span>" + UserID + "</span>:";
            Popup.TextArea.classList.remove("rhHidden");
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                User.Notes = Popup.TextArea.value.trim();
                queueSave(Popup, User, function() {
                    if (User.Notes) {
                        PUNIcon.classList.remove("fa-sticky-note-o");
                        PUNIcon.classList.add("fa-sticky-note");
                    } else {
                        PUNIcon.classList.remove("fa-sticky-note");
                        PUNIcon.classList.add("fa-sticky-note-o");
                    }
                    Callback();
                    Popup.Close.click();
                });
            });
            Popup.popUp(function() {
                Popup.TextArea.focus();
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Notes) {
                    Popup.TextArea.value = SavedUser.Notes;
                }
            });
        });
    }

    // Permanent User Tags

    function addPUTButton(Context, UserID) {
        var Container, User;
        Container = Context.parentElement;
        if (Container.classList.contains("comment__username")) {
            Context = Container;
        }
        Context.insertAdjacentHTML(
            "afterEnd",
            "<a class=\"PUTButton\">" +
            "    <i class=\"fa fa-tag\"></i>" +
            "    <span class=\"PUTTags\"></span>" +
            "</a>"
        );
        User = {};
        User[SG ? "Username" : "SteamID64"] = UserID;
        Context.nextElementSibling.addEventListener("click", function() {
            var Popup;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-tag");
            Popup.Title.innerHTML = "Edit user tags for <span>" + UserID + "</span>:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                User.Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                    return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
                });
                queueSave(Popup, User, function() {
                    addPUTTags(UserID, getUser(User).Tags);
                    Callback();
                    Popup.Close.click();
                });
            });
            Popup.popUp(function() {
                var SavedUser;
                Popup.TextInput.focus();
                SavedUser = getUser(User);
                if (SavedUser && SavedUser.Tags) {
                    Popup.TextInput.value = SavedUser.Tags;
                }
            });
        });
    }

    function addPUTTags(UserID, Tags) {
        var Matches, Prefix, Suffix, HTML, I, N, Context, Container;
        Matches = Users[UserID];
        Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
        Suffix = "</span>";
        HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
            return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
        }) : "";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            Container = Context.parentElement;
            if (Container) {
                if (Container.classList.contains("comment__username")) {
                    Context = Container;
                }
                Context.parentElement.getElementsByClassName("PUTTags")[0].innerHTML = HTML;
            }
        }
    }

    // Multi-Tag

    function addMTContainer(Context, MT, SM) {
        var MTContainer, MTButton, MTBox, MTUsers, MTGames, MTAll, MTNone, MTInverse, MTUsersCheckbox, MTGamesCheckbox, Popup;
        if (!MT) {
            MT = {};
        }
        MT.UserCheckboxes = {};
        MT.GameCheckboxes = {};
        MT.UsersSelected = [];
        MT.GamesSelected = [];
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div class=\"MTContainer" + (SM ? " rhHidden" : "") + "\">" +
            "    <a class=\"MTButton page_heading_btn\">" +
            "        <i class=\"fa fa-tags\"></i>" +
            "    </a>" +
            "</div>"
        );
        MTContainer = Context.firstElementChild;
        MTButton = MTContainer.firstElementChild;
        MTBox = createPopout(MTContainer);
        MTBox.CustomRule = function(Target) {
            return (!Target.closest(".MTUserCheckbox") && !Target.closest(".MTGameCheckbox"));
        };
        MTBox.Popout.classList.add("MTBox");
        Context = SM ? SM.Popup.Options : MTBox.Popout;
        Context.innerHTML =
            "<div" + ((GM_getValue("PUT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTUsers\"></span> Enable selection for user tags.</div>" +
            "<div" + ((GM_getValue("GT") && !SM) ? "" : " class=\"rhHidden\"") + "><span class=\"MTGames\"></span> Enable selection for game tags.</div>" +
            "<div><i class=\"fa fa-check-square-o MTAll\"></i> Select all.</div>" +
            "<div><i class=\"fa fa-square-o\ MTNone\"></i> Select none.</div>" +
            "<div><i class=\"fa fa-minus-square-o MTInverse\"></i> Select inverse.</div>" +
            "<div><span class=\"MTCount\">0</span> selected.</div>" +
            "<div class=\"MTTag\"></div>";
        MTUsers = Context.getElementsByClassName("MTUsers")[0];
        MTGames = Context.getElementsByClassName("MTGames")[0];
        MTAll = Context.getElementsByClassName("MTAll")[0];
        MTNone = Context.getElementsByClassName("MTNone")[0];
        MTInverse = Context.getElementsByClassName("MTInverse")[0];
        MT.Count = Context.getElementsByClassName("MTCount")[0];
        MT.Tag = Context.getElementsByClassName("MTTag")[0];
        MTUsersCheckbox = createCheckbox(MTUsers);
        MTGamesCheckbox = createCheckbox(MTGames);
        setMTCheckboxes(MTUsers, MTUsersCheckbox.Checkbox, Users, "User", "beforeBegin", "previousElementSibling", MT);
        setMTCheckboxes(MTGames, MTGamesCheckbox.Checkbox, Games, "Game", "afterBegin", "firstElementChild", MT);
        setMTSelect(MTAll, MT, "check");
        setMTSelect(MTNone, MT, "uncheck");
        setMTSelect(MTInverse, MT, "toggle");
        MT.Tag.classList.add("rhHidden");
        Popup = createPopup();
        Popup.Icon.classList.add("fa-tags");
        Popup.TextInput.classList.remove("rhHidden");
        Popup.TextInput.insertAdjacentHTML(
            "afterEnd",
            createDescription(
                "Use commas to separate tags, for example: Tag1, Tag2, ...<br/><br/>" +
                "A [*] tag means that the selected users / games have individual tags (not shared between all of them). Removing the [*] tag will delete those individual tags."
            )
        );
        createButton(MT.Tag, "fa-tags", "Multi-Tag", "", "", function(Callback) {
            var Tags, Shared, I, N, UserID, User, SavedUser, SavedTags, J, NumTags, SavedTag, SavedGames, SavedGame, Game, Key, Individual;
            Callback();
            if (!MTButton.classList.contains("rhBusy")) {
                Popup.Title.textContent = "Multi-tag " + MT.UsersSelected.length + " users and " + MT.GamesSelected.length + " games:";
                Tags = {};
                MT.UserTags = {};
                Shared = [];
                for (I = 0, N = MT.UsersSelected.length; I < N; ++I) {
                    UserID = MT.UsersSelected[I];
                    User = {};
                    User[SG ? "Username" : "SteamID64"] = UserID;
                    SavedUser = getUser(User);
                    if (SavedUser && SavedUser.Tags) {
                        SavedTags = SavedUser.Tags.split(/,\s/);
                        Tags[UserID] = MT.UserTags[UserID] = SavedTags;
                        for (J = 0, NumTags = SavedTags.length; J < NumTags; ++J) {
                            SavedTag = SavedTags[J];
                            if (Shared.indexOf(SavedTag) < 0) {
                                Shared.push(SavedTag);
                            }
                        }
                    } else {
                        Tags[UserID] = MT.UserTags[UserID] = "";
                    }
                }
                SavedGames = GM_getValue("Games");
                MT.GameTags = {};
                for (I = 0, N = MT.GamesSelected.length; I < N; ++I) {
                    Game = MT.GamesSelected[I];
                    SavedGame = SavedGames[Game];
                    if (SavedGame && SavedGame.Tags) {
                        SavedTags = SavedGame.Tags.split(/,\s/);
                        Tags[Game] = MT.GameTags[Game] = SavedTags;
                        for (J = 0, NumTags = SavedTags.length; I < NumTags; ++I) {
                            SavedTag = SavedTags[I];
                            if (Shared.indexOf(SavedTag) < 0) {
                                Shared.push(SavedTag);
                            }
                        }
                    } else {
                        Tags[Game] = MT.GameTags[Game] = "";
                    }
                }
                for (Key in Tags) {
                    Shared = Shared.filter(function(N) {
                        if (Tags[Key].indexOf(N) >= 0) {
                            return true;
                        } else {
                            Individual = true;
                            return false;
                        }
                    });
                }
                for (Key in Tags) {
                    for (I = 0, N = Shared.length; I < N; ++I) {
                        J = Tags[Key].indexOf(Shared[I]);
                        if (J >= 0) {
                            Tags[Key].splice(J, 1);
                        }
                    }
                }
                Popup.TextInput.value = Shared.length ? (Shared.join(", ") + (Individual ? ", [*]" : "")) : (Individual ? "[*]" : "");
            }
            Popup.popUp(function() {
                Popup.TextInput.focus();
            });
        });
        createButton(Popup.Button, "fa-check", "Save", "fa-times-circle", "Cancel", function(Callback) {
            var Shared, I, Individual, Keys;
            MT.Canceled = false;
            MTButton.classList.add("rhBusy");
            Shared = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
            }).split(", ");
            I = Shared.indexOf("[*]");
            if (I >= 0) {
                Shared.splice(I, 1);
                Individual = true;
            } else {
                Individual = false;
            }
            Shared = Shared.join(", ");
            Keys = Object.keys(MT.UserTags);
            saveMTUserTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.UserTags, function() {
                Keys = Object.keys(MT.GameTags);
                saveMTGameTags(MT, 0, Keys.length, Keys, Individual, Shared, MT.GameTags, function() {
                    MTButton.classList.remove("rhBusy");
                    MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
                    Callback();
                    Popup.Close.click();
                });
            });
        }, function() {
            clearInterval(MT.Request);
            clearInterval(MT.Save);
            MT.Canceled = true;
            setTimeout(function() {
                MT.Progress.innerHTML = MT.OverallProgress.innerHTML = "";
            }, 500);
            MTButton.classList.remove("rhBusy");
        });
        MT.Progress = Popup.Progress;
        MT.OverallProgress = Popup.OverallProgress;
        MTButton.addEventListener("click", function() {
            MTBox.popOut(MTButton);
        });
    }

    function setMTCheckboxes(Element, Checkbox, Selection, Type, InsertionPosition, Position, MT) {
        Element.addEventListener("click", function() {
            var Key, Matches, I, N, Context, MTCheckbox;
            if (Checkbox.checked) {
                addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT);
            } else {
                removeMTCheckboxes(Type, MT);
            }
        });
    }

    function addMTCheckboxes(Selection, Type, InsertionPosition, Position, MT) {
        var Key, Matches, I, N, Context, MTCheckbox;
        for (Key in Selection) {
            Matches = Selection[Key];
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I];
                Context.insertAdjacentHTML(InsertionPosition, "<span class=\"MT" + Type + "Checkbox\"></span>");
                MTCheckbox = createCheckbox(Context[Position]);
                if (!MT[Type + "Checkboxes"][Key]) {
                    MT[Type + "Checkboxes"][Key] = [];
                }
                MT[Type + "Checkboxes"][Key].push(MTCheckbox);
                setMTCheckbox(Type, Context[Position], MT, Key, MTCheckbox.Checkbox, MT.Tag);
            }
        }
    }

    function setMTCheckbox(Type, Context, MT, Key, Checkbox) {
        Context.addEventListener("click", function() {
            checkMTCheckbox(MT, Type, Key, Checkbox);
        });
    }

    function checkMTCheckbox(MT, Type, Key, Checkbox) {
        var Count, I, Checkboxes, N;
        Count = parseInt(MT.Count.textContent);
        I = MT[Type + "sSelected"].indexOf(Key);
        if (Checkbox.checked) {
            MT.Count.textContent = ++Count;
            if (I < 0) {
                MT[Type + "sSelected"].push(Key);
            }
        } else {
            MT.Count.textContent = --Count;
            if (I >= 0) {
                MT[Type + "sSelected"].splice(I, 1);
            }
        }
        Checkboxes = MT[Type + "Checkboxes"][Key];
        for (I = 0, N = Checkboxes.length; I < N; ++I) {
            if (Checkboxes[I].Checkbox != Checkbox) {
                Checkboxes[I].toggle();
            }
        }
        MT.Tag.classList[(Count > 1) ? "remove" : "add"]("rhHidden");
    }

    function removeMTCheckboxes(Type, MT) {
        var Matches, I, N;
        Matches = document.getElementsByClassName("MT" + Type + "Checkbox");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[0].remove();
        }
        MT[Type + "Checkboxes"] = {};
        MT[Type + "sSelected"] = [];
    }

    function setMTSelect(Element, MT, Call) {
        Element.addEventListener("click", function() {
            selectMTCheckboxes(MT.UserCheckboxes, Call, MT, "User");
            selectMTCheckboxes(MT.GameCheckboxes, Call, MT, "Game");
        });
    }

    function selectMTCheckboxes(MTCheckboxes, Call, MT, Type) {
        var Key, Checkbox, Previous, Current;
        for (Key in MTCheckboxes) {
            Checkbox = MTCheckboxes[Key][0];
            Previous = Checkbox.Checkbox.checked;
            Checkbox[Call]();
            Current = Checkbox.Checkbox.checked;
            if (Previous != Current) {
                checkMTCheckbox(MT, Type, Key, Checkbox.Checkbox);
            }
        }
    }

    function saveMTUserTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
        var UserID, User;
        if (!MT.Canceled) {
            MT.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>" + I + " of " + N + " users tagged...</span>";
            if (I < N) {
                UserID = Keys[I];
                User = {
                    Tags: Individual ? (Shared + ", " + Tags[UserID]) : Shared
                };
                User[SG ? "Username" : "SteamID64"] = UserID;
                queueSave(MT, User, function() {
                    addPUTTags(UserID, getUser(User).Tags);
                    setTimeout(saveMTUserTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
                });
            } else {
                Callback();
            }
        }
    }

    function saveMTGameTags(MT, I, N, Keys, Individual, Shared, Tags, Callback) {
        var Game, SavedGames;
        if (!MT.Canceled) {
            MT.OverallProgress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>" + I + " of " + N + " groups tagged...</span>";
            if (I < N) {
                Game = Keys[I];
                SavedGames = GM_getValue("Games");
                if (!SavedGames[Game]) {
                    SavedGames[Game] = {};
                }
                SavedGames[Game].Tags = Individual ? (Shared + ", " + Tags[Game]) : Shared;
                GM_setValue("Games", SavedGames);
                addGTTags(Game, SavedGames[Game].Tags);
                setTimeout(saveMTGameTags, 0, MT, ++I, N, Keys, Individual, Shared, Tags, Callback);
            } else {
                Callback();
            }
        }
    }

    // Whitelist / Blacklist Highlighter

    function addWBHIcon(User, Matches) {
        var Message, Icon, HTML, I, N, Context, Container;
        if (User.Whitelisted || User.Blacklisted) {
            if (User.Whitelisted) {
                Message = "whitelisted";
                Icon = "whitelist fa-heart";
            } else {
                Message = "blacklisted";
                Icon = "blacklist fa-ban";
            }
            HTML =
                "<span class=\"sidebar__shortcut-inner-wrap WBHIcon rhWBIcon\" title=\"You have " + Message + " " + User.Username + ".\">" +
                "    <i class=\"fa sidebar__shortcut__" + Icon + " is-disabled is-selected\" style=\"background: none !important;\"></i>" +
                "</span>";
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I];
                Container = Context.parentElement;
                if (Container.classList.contains("comment__username")) {
                    Context = Container;
                }
                Context.insertAdjacentHTML("beforeBegin", HTML);
            }
        }
    }

    // Whitelist / Blacklist Checker

    function addWBCButton(Context) {
        var Popup, WBC, WBCButton;
        Popup = createPopup();
        WBC = {
            Update: (Context ? false : true),
            B: GM_getValue("WBC_B"),
            Username: GM_getValue("Username")
        };
        Popup.Icon.classList.add(WBC.Update ? "fa-cog" : "fa-question");
        Popup.Title.textContent = (WBC.Update ? "Manage Whitelist / Blacklist Checker caches" : ("Check for whitelists" + (WBC.B ? " / blacklists" : ""))) + ":";
        if (Path.match(new RegExp("^\/user\/(?!" + WBC.Username + ")"))) {
            WBC.User = {
                Username: document.getElementsByClassName("featured__heading__medium")[0].textContent,
                ID: document.querySelector("[name='child_user_id']").value,
                SteamID64: document.querySelector("a[href*='/profiles/']").href.match(/\d+/)[0],
            };
        }
        createOptions(Popup.Options, WBC, [{
            Check: function() {
                return WBC.User;
            },
            Description: "Only check " + (WBC.User ? WBC.User.Username : "current user") + ".",
            Title: "If disabled, all users in the current page will be checked.",
            Name: "SingleCheck",
            Key: "SC",
            ID: "WBC_SC",
            Dependency: "FullListCheck"
        }, {
            Check: function() {
                return WBC.B;
            },
            Description: "Also check whitelist.",
            Title: "If disabled, a blacklist-only check will be performed (faster).",
            Name: "FullCheck",
            Key: "FC",
            ID: "WBC_FC"
        }, {
            Check: function() {
                return ((((WBC.User && !WBC.SC.checked) || !WBC.User) && !WBC.Update) ? true : false);
            },
            Description: "Check all pages.",
            Title: "If disabled, only the current page will be checked.",
            Name: "FullListCheck",
            Key: "FLC",
            ID: "WBC_FLC"
        }, {
            Check: function() {
                return true;
            },
            Description: "Return whitelists.",
            Title: "If enabled, everyone who has whitelisted you will be whitelisted back.",
            Name: "ReturnWhitelists",
            Key: "RW",
            ID: "WBC_RW"
        }, {
            Check: function() {
                return WBC.B;
            },
            Description: "Return blacklists.",
            Title: "If enabled, everyone who has blacklisted you will be blacklisted back.",
            Name: "ReturnBlacklists",
            Key: "RB",
            ID: "WBC_RB"
        }, {
            Check: function() {
                return WBC.Update;
            },
            Description: "Only update whitelists / blacklists.",
            Title: "If enabled, only users who have whitelisted / blacklisted you will be updated (faster).",
            Name: "SimpleUpdate",
            Key: "SU",
            ID: "WBC_SU"
        }, {
            Check: function() {
                return true;
            },
            Description: "Clear caches.",
            Title: "If enabled, the caches of all checked users will be cleared and they will be checked as if for the first time (slower).",
            Name: "ClearCaches",
            Key: "CC",
            ID: "WBC_CC"
        }]);
        Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
        if (Context) {
            Context.insertAdjacentHTML(
                "afterBegin",
                "<a class=\"WBCButton\" title=\"Check for whitelists" + (WBC.B ? " / blacklists" : "") + ".\">" +
                "    <i class=\"fa fa-heart\"></i> " + (WBC.B ? (
                    "<i class=\"fa fa-ban\"></i>") : "") +
                "    <i class=\"fa fa-question-circle\"></i>" +
                "</a>"
            );
        }
        WBCButton = document.getElementsByClassName("WBCButton")[0];
        createButton(Popup.Button, WBC.Update ? "fa-refresh" : "fa-question-circle", WBC.Update ? "Update" : "Check", "fa-times-circle", "Cancel", function(Callback) {
            WBC.ShowResults = false;
            WBCButton.classList.add("rhBusy");
            setWBCCheck(WBC, function() {
                WBCButton.classList.remove("rhBusy");
                Callback();
            });
        }, function() {
            clearInterval(WBC.Request);
            clearInterval(WBC.Save);
            WBC.Canceled = true;
            setTimeout(function() {
                WBC.Progress.innerHTML = "";
            }, 500);
            WBCButton.classList.remove("rhBusy");
        });
        WBC.Progress = Popup.Progress;
        WBC.OverallProgress = Popup.OverallProgress;
        createResults(Popup.Results, WBC, [{
            Icon: (
                "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
                "    <i class=\"fa fa-heart sidebar__shortcut__whitelist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
                "</span>"
            ),
            Description: "You are whitelisted by",
            Key: "Whitelisted"
        }, {
            Icon: (
                "<span class=\"sidebar__shortcut-inner-wrap rhWBIcon\">" +
                "    <i class=\"fa fa-ban sidebar__shortcut__blacklist is-disabled is-selected\" style=\"background: none !important;\"></i> " +
                "</span>"
            ),
            Description: "You are blacklisted by",
            Key: "Blacklisted"
        }, {
            Icon: "<i class=\"fa fa-check-circle\"></i> ",
            Description: "You are neither whitelisted nor blacklisted by",
            Key: "None"
        }, {
            Icon: "<i class=\"fa fa-question-circle\"></i> ",
            Description: "You are not blacklisted and there is not enough information to know if you are whitelisted by",
            Key: "NotBlacklisted"
        }, {
            Icon: "<i class=\"fa fa-question-circle\"></i> ",
            Description: "There is not enough information to know if you are whitelisted or blacklisted by",
            Key: "Unknown"
        }]);
        WBCButton.addEventListener("click", function() {
            WBC.Popup = Popup.popUp(function() {
                if (WBC.Update) {
                    WBC.ShowResults = true;
                    setWBCCheck(WBC);
                }
            });
        });
    }

    function setWBCCheck(WBC, Callback) {
        var SavedUsers, I, N, Username, Match;
        WBC.Progress.innerHTML = WBC.OverallProgress.innerHTML = "";
        WBC.Whitelisted.classList.add("rhHidden");
        WBC.Blacklisted.classList.add("rhHidden");
        WBC.None.classList.add("rhHidden");
        WBC.NotBlacklisted.classList.add("rhHidden");
        WBC.Unknown.classList.add("rhHidden");
        WBC.WhitelistedCount.textContent = WBC.BlacklistedCount.textContent = WBC.NoneCount.textContent = WBC.NotBlacklistedCount.textContent = WBC.UnknownCount.textContent = "0";
        WBC.WhitelistedUsers.innerHTML = WBC.BlacklistedUsers.innerHTML = WBC.NoneUsers.innerHTML = WBC.NotBlacklistedUsers.innerHTML = WBC.UnknownUsers.innerHTML = "";
        WBC.Popup.reposition();
        WBC.Users = [];
        WBC.Canceled = false;
        if (WBC.Update) {
            SavedUsers = GM_getValue("Users");
            for (I = 0, N = SavedUsers.length; I < N; ++I) {
                if (SavedUsers[I].WBC && SavedUsers[I].WBC.Result && (WBC.ShowResults || (!WBC.ShowResults && ((WBC.SU.checked &&
                                                                                                                SavedUsers[I].WBC.Result.match(/^(Whitelisted|Blacklisted)$/)) ||
                                                                                                               !WBC.SU.checked)))) {
                    WBC.Users.push(SavedUsers[I].Username);
                }
            }
            WBC.Users = sortArray(WBC.Users);
            checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
        } else if (WBC.User && WBC.SC.checked) {
            WBC.Users.push(WBC.User.Username);
            checkWBCUsers(WBC, 0, 1, Callback);
        } else {
            for (Username in Users) {
                if (Username != WBC.Username) {
                    WBC.Users.push(Username);
                }
            }
            if (WBC.FLC.checked) {
                Match = Location.match(/(.+?)(\/search\?(page=(\d+))?(.*))?$/);
                getWBCUsers(WBC, 1, Match[4] ? parseInt(Match[4]) : 1, Match[1] + (Path.match(/^\/$/) ? "giveaways/" : "/") + "search?" + (Match[5] ? (Match[5].replace(/^&|&$/g, "") + "&") :
                                                                                                                                           "") + "page=", function() {
                    WBC.Users = sortArray(WBC.Users);
                    checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
                });
            } else {
                WBC.Users = sortArray(WBC.Users);
                checkWBCUsers(WBC, 0, WBC.Users.length, Callback);
            }
        }
    }

    function checkWBCUsers(WBC, I, N, Callback) {
        var User, SavedUser, Result;
        if (!WBC.Canceled) {
            WBC.Progress.innerHTML = "";
            WBC.OverallProgress.textContent = I + " of " + N + " users checked...";
            if (I < N) {
                User = (WBC.User && WBC.SC.checked) ? WBC.User : {
                    Username: WBC.Users[I]
                };
                if (WBC.ShowResults) {
                    setTimeout(setWBCResult, 0, WBC, getUser(User), false, I, N, Callback);
                } else {
                    queueSave(WBC, User, function() {
                        SavedUser = getUser(User);
                        User.WBC = SavedUser.WBC;
                        if (User.WBC && User.WBC.Result) {
                            Result = User.WBC.Result;
                        }
                        User.Whitelisted = SavedUser.Whitelisted;
                        User.Blacklisted = SavedUser.Blacklisted;
                        checkWBCUser(WBC, User, function() {
                            setTimeout(setWBCResult, 0, WBC, User, (Result != User.WBC.Result) ? true : false, I, N, Callback);
                        });
                    });
                }
            } else if (Callback) {
                Callback();
            }
        }
    }

    function setWBCResult(WBC, User, New, I, N, Callback) {
        var Key;
        if (!WBC.Canceled) {
            Key = ((User.WBC.Result == "Blacklisted") && !WBC.B) ? "Unknown" : User.WBC.Result;
            WBC[Key].classList.remove("rhHidden");
            WBC[Key + "Count"].textContent = parseInt(WBC[Key + "Count"].textContent) + 1;
            WBC[Key + "Users"].insertAdjacentHTML("beforeEnd", "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"/user/" + User.Username + "\">" + User.Username + "</a>");
            WBC.Popup.reposition();
            if (WBC.ShowResults) {
                setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
            } else if ((WBC.RW.checked && (User.WBC.Result == "Whitelisted") && !User.Whitelisted) || (WBC.B && WBC.RB.checked && (User.WBC.Result == "Blacklisted") && !User.Blacklisted)) {
                getUserID(User, WBC, function() {
                    if (XSRFToken) {
                        returnWBCWhitelistBlacklist(WBC, User, function() {
                            queueSave(WBC, User, function() {
                                setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                            });
                        });
                    } else {
                        XSRFToken = document.querySelector("[name='xsrf_token']");
                        if (XSRFToken) {
                            XSRFToken = XSRFToken.value;
                            returnWBCWhitelistBlacklist(WBC, User, function() {
                                queueSave(WBC, User, function() {
                                    setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                                });
                            });
                        } else {
                            queueRequest(WBC, null, "/user/" + User.Username, function(Response) {
                                if (Response.finalUrl.match(/\/user\//)) {
                                    XSRFToken = parseHTML(Response.responseText).querySelector("[name='xsrf_token']").value;
                                    returnWBCWhitelistBlacklist(WBC, User, function() {
                                        queueSave(WBC, User, function() {
                                            setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                                        });
                                    });
                                } else {
                                    queueSave(WBC, User, function() {
                                        setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                queueSave(WBC, User, function() {
                    setTimeout(checkWBCUsers, 0, WBC, ++I, N, Callback);
                });
            }
        }
    }

    function returnWBCWhitelistBlacklist(WBC, User, Callback) {
        var Key, Type;
        if (!WBC.Canceled) {
            Key = User.WBC.Result;
            Type = Key.match(/(.+)ed/)[1].toLowerCase();
            WBC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Returning " + Type + " for " + User.Username + "...</span>";
            if (Path.match(new RegExp("^\/user\/" + User.Username))) {
                document.getElementsByClassName("sidebar__shortcut__" + Type)[0].click();
                User.Whitelisted = User.Blacklisted = false;
                User[Key] = true;
                Callback();
            } else {
                queueRequest(WBC, "xsrf_token=" + XSRFToken + "&do=" + Type + "&child_user_id=" + User.ID + "&action=insert", "/ajax.php", function(Response) {
                    if (parseJSON(Response.responseText).type == "success") {
                        User.Whitelisted = User.Blacklisted = false;
                        User[Key] = true;
                        Callback();
                    } else {
                        Callback();
                    }
                });
            }
        }
    }

    function checkWBCUser(WBC, User, Callback) {
        var Match;
        if (!WBC.Canceled) {
            if (WBC.CC.checked) {
                User.WBC = null;
            }
            if (!User.WBC) {
                User.WBC = {
                    LastSearch: 0,
                    Timestamp: 0
                };
            }
            if (((new Date().getTime()) - User.WBC.LastSearch) > 86400000) {
                if ((WBC.FC.checked && User.WBC.WhitelistGiveaway) || (!WBC.FC.checked && User.WBC.Giveaway)) {
                    WBC.Timestamp = User.WBC.Timestamp;
                    checkWBCGiveaway(WBC, User, Callback);
                } else {
                    WBC.Timestamp = 0;
                    WBC.GroupGiveaways = [];
                    Match = Location.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                    getWBCGiveaways(WBC, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", Callback);
                }
            } else {
                Callback();
            }
        }
    }

    function checkWBCGiveaway(WBC, User, Callback) {
        var ResponseText;
        if (!WBC.Canceled) {
            queueRequest(WBC, null, User.WBC.WhitelistGiveaway || User.WBC.Giveaway, function(Response) {
                ResponseText = Response.responseText;
                if (ResponseText.match(/you've been blacklisted by the giveaway creator/)) {
                    User.WBC.Result = "Blacklisted";
                } else if (User.WBC.WhitelistGiveaway) {
                    if (ResponseText.match(/you're not a member of the giveaway creator's whitelist/)) {
                        User.WBC.Result = "None";
                    } else {
                        User.WBC.Result = "Whitelisted";
                    }
                } else {
                    User.WBC.Result = "NotBlacklisted";
                }
                User.WBC.LastSearch = new Date().getTime();
                User.WBC.Timestamp = WBC.Timestamp;
                Callback();
            });
        }
    }

    function getWBCGiveaways(WBC, User, NextPage, CurrentPage, URL, Callback, Context) {
        var Giveaway, Pagination;
        if (Context) {
            if (!User.WBC.Giveaway) {
                Giveaway = Context.querySelector("[class='giveaway__heading__name'][href*='/giveaway/']");
                User.WBC.Giveaway = Giveaway ? Giveaway.getAttribute("href") : null;
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            Giveaway = Context.getElementsByClassName("giveaway__summary")[0];
            if (Giveaway && (WBC.Timestamp === 0)) {
                WBC.Timestamp = parseInt(Giveaway.querySelector("[data-timestamp]").getAttribute("data-timestamp"));
                if (WBC.Timestamp >= (new Date().getTime())) {
                    WBC.Timestamp = 0;
                }
            }
            if (User.WBC.Giveaway) {
                checkWBCGiveaway(WBC, User, function() {
                    var WhitelistGiveaways, I, N, GroupGiveaway;
                    if ((User.WBC.Result == "NotBlacklisted") && WBC.FC.checked) {
                        WhitelistGiveaways = Context.getElementsByClassName("giveaway__column--whitelist");
                        for (I = 0, N = WhitelistGiveaways.length; (I < N) && !User.WBC.WhitelistGiveaway; ++I) {
                            GroupGiveaway = WhitelistGiveaways[I].parentElement.getElementsByClassName("giveaway__column--group")[0];
                            if (GroupGiveaway) {
                                WBC.GroupGiveaways.push(GroupGiveaway.getAttribute("href"));
                            } else {
                                User.WBC.WhitelistGiveaway = WhitelistGiveaways[I].closest(".giveaway__summary").getElementsByClassName("giveaway__heading__name")[0].getAttribute("href");
                            }
                        }
                        if (User.WBC.WhitelistGiveaway) {
                            checkWBCGiveaway(WBC, User, Callback);
                        } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                            getWBCGiveaways(WBC, User, NextPage, CurrentPage, URL, Callback);
                        } else if ((User.WBC.GroupGiveaways && User.WBC.GroupGiveaways.length) || WBC.GroupGiveaways.length) {
                            getWBCGroupGiveaways(WBC, 0, WBC.GroupGiveaways.length, User, function(Result) {
                                var Groups, GroupGiveaways, Found;
                                if (Result) {
                                    Callback();
                                } else {
                                    Groups = GM_getValue("Groups");
                                    for (GroupGiveaway in User.WBC.GroupGiveaways) {
                                        Found = false;
                                        GroupGiveaways = User.WBC.GroupGiveaways[GroupGiveaway];
                                        for (I = 0, N = GroupGiveaways.length; (I < N) && !Found; ++I) {
                                            if (Groups.indexOf(GroupGiveaways[I]) >= 0) {
                                                Found = true;
                                            }
                                        }
                                        if (!Found) {
                                            break;
                                        }
                                    }
                                    if (Found) {
                                        Callback();
                                    } else {
                                        User.WBC.Result = "Whitelisted";
                                        Callback();
                                    }
                                }
                            });
                        } else {
                            Callback();
                        }
                    } else {
                        Callback();
                    }
                });
            } else if (((WBC.Timestamp >= User.WBC.Timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                getWBCGiveaways(WBC, User, NextPage, CurrentPage, URL, Callback);
            } else {
                User.WBC.Result = "Unknown";
                User.WBC.LastSearch = new Date().getTime();
                User.WBC.Timestamp = WBC.Timestamp;
                Callback();
            }
        } else if (!WBC.Canceled) {
            WBC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
            if (CurrentPage != NextPage) {
                queueRequest(WBC, null, URL + NextPage, function(Response) {
                    if (Response.finalUrl.match(/\/user\//)) {
                        getWBCGiveaways(WBC, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
                    } else {
                        User.WBC.Result = "Unknown";
                        User.WBC.LastSearch = new Date().getTime();
                        User.WBC.Timestamp = WBC.Timestamp;
                        Callback();
                    }
                });
            } else {
                getWBCGiveaways(WBC, User, ++NextPage, CurrentPage, URL, Callback, document);
            }
        }
    }

    function getWBCGroupGiveaways(WBC, I, N, User, Callback) {
        if (!WBC.Canceled) {
            if (I < N) {
                WBC.Progress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch\"></i> " +
                    "<span>Retrieving " + User.Username + "'s group giveaways (" + I + " of " + N + ")...</span>";
                getWBCGroups(WBC, WBC.GroupGiveaways[I] + "/search?page=", 1, User, function(Result) {
                    if (Result) {
                        Callback(Result);
                    } else {
                        getWBCGroupGiveaways(WBC, ++I, N, User, Callback);
                    }
                });
            } else {
                Callback();
            }
        }
    }

    function getWBCGroups(WBC, URL, NextPage, User, Callback) {
        if (!WBC.Canceled) {
            queueRequest(WBC, null, URL + NextPage, function(Response) {
                var ResponseText, ResponseHTML, Groups, N, GroupGiveaway, I, Group, Pagination;
                ResponseText = Response.responseText;
                ResponseHTML = parseHTML(ResponseText);
                Groups = ResponseHTML.getElementsByClassName("table__column__heading");
                N = Groups.length;
                if (N > 0) {
                    if (!User.WBC.GroupGiveaways) {
                        User.WBC.GroupGiveaways = {};
                    }
                    GroupGiveaway = URL.match(/\/giveaway\/(.+)\//)[1];
                    if (!User.WBC.GroupGiveaways[GroupGiveaway]) {
                        User.WBC.GroupGiveaways[GroupGiveaway] = [];
                    }
                    for (I = 0; I < N; ++I) {
                        Group = Groups[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
                        if (User.WBC.GroupGiveaways[GroupGiveaway].indexOf(Group) < 0) {
                            User.WBC.GroupGiveaways[GroupGiveaway].push(Group);
                        }
                    }
                    Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                    if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                        getWBCGroups(WBC, URL, ++NextPage, User, Callback);
                    } else {
                        Callback();
                    }
                } else if (ResponseText.match(/you're not a member of the giveaway creator's whitelist/)) {
                    User.WBC.Result = "None";
                    Callback(true);
                } else {
                    Callback(true);
                }
            });
        }
    }

    function getWBCUsers(WBC, NextPage, CurrentPage, URL, Callback, Context) {
        var Matches, I, N, Match, Username, Pagination;
        if (Context) {
            Matches = Context.querySelectorAll("a[href*='/user/']");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Match = Matches[I].getAttribute("href").match(/\/user\/(.+)/);
                if (Match) {
                    Username = Match[1];
                    if ((WBC.Users.indexOf(Username) < 0) && (Username != WBC.Username) && (Username == Matches[I].textContent) && !Matches[I].closest(".markdown")) {
                        WBC.Users.push(Username);
                    }
                }
            }
            Pagination = Context.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                getWBCUsers(WBC, NextPage, CurrentPage, URL, Callback);
            } else {
                Callback();
            }
        } else if (!WBC.Canceled) {
            WBC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving users (page " + NextPage + ")...</span>";
            if (CurrentPage != NextPage) {
                queueRequest(WBC, null, URL + NextPage, function(Response) {
                    getWBCUsers(WBC, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
                });
            } else {
                getWBCUsers(WBC, ++NextPage, CurrentPage, URL, Callback, document);
            }
        }
    }

    function addWBCIcon(User, Matches) {
        var Result, HTML, I, N, Context, Container;
        if (User.WBC) {
            Result = User.WBC.Result;
            if ((Result == "Whitelisted") || ((Result == "Blacklisted") && GM_getValue("WBC_B"))) {
                HTML =
                    "<span class=\"sidebar__shortcut-inner-wrap WBCIcon rhWBIcon\" title=\"" + User.Username + " has " + Result.toLowerCase() + " you.\">" +
                    "    <i class=\"fa sidebar__shortcut__" + ((Result == "Whitelisted") ? "whitelist fa-check" : "blacklist fa-times") + " is-disabled is-selected\"" +
                    "    style=\"background: none !important;\"></i>" +
                    "</span>";
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Context = Matches[I];
                    Container = Context.parentElement;
                    if (Container.classList.contains("comment__username")) {
                        Context = Container;
                    }
                    Context.insertAdjacentHTML("beforeBegin", HTML);
                }
            }
        }
    }

    // Real Won / Sent CV Links

    function addRWSCVLLinks(Context, Username) {
        var Matches, I, N, Match;
        Matches = Context.getElementsByClassName("featured__table__row__left");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I].textContent.match(/Gifts (Won|Sent)/);
            if (Match) {
                Matches[I].innerHTML = "<a class=\"RWSCVLLink\" href=\"http://www.sgtools.info/" + Match[1].toLowerCase() + "/" + Username + (GM_getValue("RWSCVL_RO") ? "/newestfirst" : "") +
                    "\" target=\"_blank\">" + Match[0] + "</a>";
            }
        }
    }

    // Not Activated / Multiple Wins Checker

    function addNAMWCProfileButton(Context, Username, ID, SteamID64) {
        var Matches, I, N;
        Matches = Context.getElementsByClassName("featured__table__row__left");
        for (I = 0, N = Matches.length; I < N; ++I) {
            if (Matches[I].textContent == "Gifts Won") {
                Matches[I].insertAdjacentHTML(
                    "beforeEnd",
                    " <span class=\"NAMWCButton\">" +
                    "    <i class=\"fa fa-question-circle\" title=\"Check for not activated / multiple wins.\"></i>" +
                    "</span>"
                );
                break;
            }
        }
        setNAMWCPopup(Context, {
            Username: Username,
            ID: ID,
            SteamID64: SteamID64
        });
    }

    function addNAMWCButton(Context) {
        if (Context) {
            Context.insertAdjacentHTML(
                "afterBegin",
                "<a class=\"NAMWCButton\" title=\"Check for not activated / multiple wins.\">" +
                "    <i class=\"fa fa-trophy\"></i>" +
                "    <i class=\"fa fa-question-circle\"></i>" +
                "</a>"
            );
        }
        setNAMWCPopup(Context);
    }

    function setNAMWCPopup(Context, User) {
        var Popup, NAMWC, NAMWCButton;
        Popup = createPopup();
        Popup.Icon.classList.add(Context ? "fa-question" : "fa-cog");
        NAMWC = {
            User: (User ? User : null)
        };
        Popup.Title.textContent = (Context ? "Check for " + (NAMWC.User ? (NAMWC.User.Username + "'s ") : "") + "not activated / multiple wins" :
                                   "Manage Not Activated / Multiple Wins Checker caches") + ":";
        NAMWCButton = (Context ? Context : document).getElementsByClassName("NAMWCButton")[0];
        if (Context) {
            createOptions(Popup.Options, NAMWC, [{
                Check: function() {
                    return true;
                },
                Description: "Only check for not activated wins.",
                Title: "If enabled, multiple wins will not be checked (faster).",
                Name: "NotActivatedCheck",
                Key: "NAC",
                ID: "NAMWC_NAC",
                Dependency: "MultipleCheck"
            }, {
                Check: function() {
                    return true;
                },
                Description: "Only check for multiple wins.",
                Title: "If enabled, not activated wins will not be checked (faster).",
                Name: "MultipleCheck",
                Key: "MC",
                ID: "NAMWC_MC",
                Dependency: "NotActivatedCheck"
            }, {
                Check: function() {
                    return true;
                },
                Description: "Clear caches.",
                Title: "If enabled, the cache of all checked users will be cleared and they will be checked as if for the first time (slower).",
                Name: "ClearCaches",
                Key: "CC",
                ID: "NAMWC_CC"
            }]);
            Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If an user is highlighted, that means they have been either checked for the first time or updated."));
            createButton(Popup.Button, "fa-question-circle", "Check", "fa-times-circle", "Cancel", function(Callback) {
                NAMWC.ShowResults = false;
                NAMWCButton.classList.add("rhBusy");
                setNAMWCCheck(NAMWC, function() {
                    NAMWCButton.classList.remove("rhBusy");
                    Callback();
                });
            }, function() {
                clearInterval(NAMWC.Request);
                clearInterval(NAMWC.Save);
                NAMWC.Canceled = true;
                setTimeout(function() {
                    NAMWC.Progress.innerHTML = "";
                }, 500);
                NAMWCButton.classList.remove("rhBusy");
            });
        }
        NAMWC.Progress = Popup.Progress;
        NAMWC.OverallProgress = Popup.OverallProgress;
        createResults(Popup.Results, NAMWC, [{
            Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
            Description: "Users with 0 not activated wins",
            Key: "Activated"
        }, {
            Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
            Description: "Users with 0 multiple wins",
            Key: "NotMultiple"
        }, {
            Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
            Description: "Users with not activated wins",
            Key: "NotActivated"
        }, {
            Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
            Description: "Users with multiple wins",
            Key: "Multiple"
        }, {
            Icon: "<i class=\"fa fa-question-circle\"></i> ",
            Description: "Users who cannot be checked for not activated wins either because they have a private profile or SteamCommunity is down",
            Key: "Unknown"
        }]);
        NAMWCButton.addEventListener("click", function() {
            NAMWC.Popup = Popup.popUp(function() {
                if (!Context) {
                    NAMWC.ShowResults = true;
                    setNAMWCCheck(NAMWC);
                }
            });
        });
    }

    function setNAMWCCheck(NAMWC, Callback) {
        var SavedUsers, I, N, Username;
        NAMWC.Progress.innerHTML = NAMWC.OverallProgress.innerHTML = "";
        NAMWC.Activated.classList.add("rhHidden");
        NAMWC.NotMultiple.classList.add("rhHidden");
        NAMWC.NotActivated.classList.add("rhHidden");
        NAMWC.Multiple.classList.add("rhHidden");
        NAMWC.Unknown.classList.add("rhHidden");
        NAMWC.ActivatedCount.textContent = NAMWC.NotMultipleCount.textContent = NAMWC.NotActivatedCount.textContent = NAMWC.MultipleCount.textContent = NAMWC.UnknownCount.textContent = "0";
        NAMWC.ActivatedUsers.innerHTML = NAMWC.NotMultipleUsers.textContent = NAMWC.NotActivatedUsers.innerHTML = NAMWC.MultipleUsers.innerHTML = NAMWC.UnknownUsers.innerHTML = "";
        NAMWC.Popup.reposition();
        NAMWC.Users = [];
        NAMWC.Canceled = false;
        if (NAMWC.ShowResults) {
            SavedUsers = GM_getValue("Users");
            for (I = 0, N = SavedUsers.length; I < N; ++I) {
                if (SavedUsers[I].NAMWC && SavedUsers[I].NAMWC.Results) {
                    NAMWC.Users.push(SavedUsers[I].Username);
                }
            }
            NAMWC.Users = sortArray(NAMWC.Users);
            checkNAMWCUsers(NAMWC, 0, NAMWC.Users.length, Callback);
        } else if (NAMWC.User) {
            NAMWC.Users.push(NAMWC.User.Username);
            checkNAMWCUsers(NAMWC, 0, 1, Callback);
        } else {
            for (Username in Users) {
                if (Username != GM_getValue("Username")) {
                    if (NAMWC.Users.length < 26) {
                        NAMWC.Users.push(Username);
                    } else {
                        break;
                    }
                }
            }
            NAMWC.Users = sortArray(NAMWC.Users);
            checkNAMWCUsers(NAMWC, 0, NAMWC.Users.length, Callback);
        }
    }

    function checkNAMWCUsers(NAMWC, I, N, Callback) {
        var User, Results, Key, New;
        if (!NAMWC.Canceled) {
            NAMWC.Progress.innerHTML = "";
            NAMWC.OverallProgress.textContent = I + " of " + N + " users checked...";
            if (I < N) {
                User = NAMWC.User ? NAMWC.User : {
                    Username: NAMWC.Users[I]
                };
                if (NAMWC.ShowResults) {
                    User.NAMWC = getUser(User).NAMWC;
                    updateNAMWCResults(User, NAMWC, function() {
                        setTimeout(setNAMWCResult, 0, NAMWC, User, false, I, N, Callback);
                    });
                } else {
                    queueSave(NAMWC, User, function() {
                        User.NAMWC = getUser(User).NAMWC;
                        updateNAMWCResults(User, NAMWC, function() {
                            if (User.NAMWC && User.NAMWC.Results) {
                                Results = User.NAMWC.Results;
                            }
                            checkNAMWCUser(NAMWC, User, function() {
                                if (Results) {
                                    for (Key in Results) {
                                        if (Results[Key] != User.NAMWC.Results[Key]) {
                                            New = true;
                                            break;
                                        }
                                    }
                                } else {
                                    New = true;
                                }
                                setTimeout(setNAMWCResult, 0, NAMWC, User, New, I, N, Callback);
                            });
                        });
                    });
                }
            } else if (Callback) {
                Callback();
            }
        }
    }

    function updateNAMWCResults(User, NAMWC, Callback) {
        var Results;
        if (User.NAMWC && User.NAMWC.Results && (typeof User.NAMWC.Results.None != "undefined")) {
            Results = User.NAMWC.Results;
            User.NAMWC.Results = {
                Activated: Results.None,
                NotMultiple: Results.None,
                NotActivated: Results.NotActivated,
                Multiple: Results.Multiple,
                Unknown: Results.PrivateDown
            };
            queueSave(NAMWC, User, Callback);
        } else {
            Callback();
        }
    }

    function setNAMWCResult(NAMWC, User, New, I, N, Callback) {
        var Key;
        if (!NAMWC.Canceled) {
            for (Key in User.NAMWC.Results) {
                if (User.NAMWC.Results[Key]) {
                    NAMWC[Key].classList.remove("rhHidden");
                    NAMWC[Key + "Count"].textContent = parseInt(NAMWC[Key + "Count"].textContent) + 1;
                    NAMWC[Key + "Users"].insertAdjacentHTML(
                        "beforeEnd",
                        "<a " + (New ? "class=\"rhBold rhItalic\" " : "") + "href=\"http://www.sgtools.info/" + (Key.match(/Multiple/) ? "multiple" : "nonactivated") + "/" + User.Username +
                        "\" target=\"_blank\">" + User.Username + (Key.match(/^(NotActivated|Multiple)$/) ? (" (" + User.NAMWC.Results[Key] + ")") : "") + "</a>"
                    );
                }
            }
            NAMWC.Popup.reposition();
            if (NAMWC.ShowResults) {
                setTimeout(checkNAMWCUsers, 0, NAMWC, ++I, N, Callback);
            } else {
                queueSave(NAMWC, User, function() {
                    setTimeout(checkNAMWCUsers, 0, NAMWC, ++I, N, Callback);
                });
            }
        }
    }

    function checkNAMWCUser(NAMWC, User, Callback) {
        if (!NAMWC.Canceled) {
            if (NAMWC.CC.checked) {
                User.NAMWC = null;
            }
            if (!User.NAMWC) {
                User.NAMWC = {
                    LastSearch: 0,
                    Results: {}
                };
            }
            if (((new Date().getTime()) - User.NAMWC.LastSearch) > 604800000) {
                if (NAMWC.NAC.checked) {
                    checkNAMWCNotActivated(NAMWC, User, Callback);
                } else if (NAMWC.MC.checked) {
                    checkNAMWCMultiple(NAMWC, User, Callback);
                } else {
                    checkNAMWCNotActivated(NAMWC, User, function() {
                        checkNAMWCMultiple(NAMWC, User, Callback);
                    });
                }
            } else {
                Callback();
            }
        }
    }

    function checkNAMWCNotActivated(NAMWC, User, Callback) {
        var N, ResponseText;
        if (!NAMWC.Canceled) {
            NAMWC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving " + User.Username + "'s not activated wins...</span>";
            queueRequest(NAMWC, null, "http://www.sgtools.info/nonactivated/" + User.Username, function(Response) {
                ResponseText = Response.responseText;
                if (ResponseText.match(/has a private profile/)) {
                    User.NAMWC.Results.Activated = false;
                    User.NAMWC.Results.NotActivated = 0;
                    User.NAMWC.Results.Unknown = true;
                } else {
                    N = parseHTML(ResponseText).getElementsByClassName("notActivatedGame").length;
                    User.NAMWC.Results.Activated = (N === 0) ? true : false;
                    User.NAMWC.Results.NotActivated = N;
                    User.NAMWC.Results.Unknown = false;
                }
                User.NAMWC.LastSearch = new Date().getTime();
                Callback();
            });
        }
    }

    function checkNAMWCMultiple(NAMWC, User, Callback) {
        var N;
        if (!NAMWC.Canceled) {
            NAMWC.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Retrieving " + User.Username + "'s multiple wins...</span>";
            queueRequest(NAMWC, null, "http://www.sgtools.info/multiple/" + User.Username, function(Response) {
                N = parseHTML(Response.responseText).getElementsByClassName("multiplewins").length;
                User.NAMWC.Results.NotMultiple = (N === 0) ? true : false;
                User.NAMWC.Results.Multiple = N;
                User.NAMWC.LastSearch = new Date().getTime();
                Callback();
            });
        }
    }

    function highlightNAMWCUser(User, Matches) {
        var Name, Title, I, N;
        if (User.NAMWC && User.NAMWC.Results) {
            Name = (User.NAMWC.Results.None || (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple)) ? "NAMWCPositive" : "NAMWCNegative";
            Title = User.Username + " has " + User.NAMWC.Results.NotActivated + " not activated wins and " + User.NAMWC.Results.Multiple + " multiple wins.";
            for (I = 0, N = Matches.length; I < N; ++I) {
                Matches[I].classList.add(Name);
                Matches[I].title = Title;
            }
        }
    }

    // Not Received Finder

    function addNRFButton(Context, Username, ID, SteamID64) {
        var Matches, I, N, NRF;
        Matches = Context.getElementsByClassName("featured__table__row__left");
        for (I = 0, N = Matches.length; I < N; ++I) {
            if (Matches[I].textContent == "Gifts Sent") {
                NRF = {
                    N: parseInt(Matches[I].nextElementSibling.firstElementChild.getAttribute("title").match(/, (.+) Not Received/)[1])
                };
                if (NRF.N > 0) {
                    NRF.I = 0;
                    NRF.Multiple = [];
                    Matches[I].insertAdjacentHTML(
                        "beforeEnd",
                        " <span class=\"NRFButton\">" +
                        "    <i class=\"fa fa-times-circle\" title=\"Find not received giveaways.\"></i>" +
                        "</span>"
                    );
                    setNRFPopup(NRF, Matches[I].lastElementChild, {
                        Username: Username,
                        ID: ID,
                        SteamID64
                    });
                }
                break;
            }
        }
    }

    function setNRFPopup(NRF, NRFButton, User) {
        var Popup;
        Popup = createPopup();
        Popup.Popup.style.width = "600px";
        Popup.Icon.classList.add("fa-times");
        Popup.Title.textContent = "Find " + User.Username + "'s not received giveaways:";
        createOptions(Popup.Options, NRF, [{
            Check: function() {
                return true;
            },
            Description: "Also search inside giveaways with multiple copies.",
            Title: "If disabled, only giveaways with visible not received copies will be found (faster).",
            Name: "FullSearch",
            Key: "FS",
            ID: "NRF_FS"
        }, {
            Check: function() {
                return true;
            },
            Description: "Clear cache.",
            Title: "If enabled, the user's cache will be cleared and they will be searched as if for the first time (slower).",
            Name: "ClearCache",
            Key: "CC",
            ID: "NRF_CC"
        }]);
        Popup.Options.insertAdjacentHTML("afterEnd", createDescription("If you're blacklisted / not whitelisted / not a member of the same Steam groups, not all giveaways will be found."));
        createButton(Popup.Button, "fa-search", "Find", "fa-times-circle", "Cancel", function(Callback) {
            NRFButton.classList.add("rhBusy");
            setNRFSearch(NRF, User, function() {
                NRF.Progress.innerHTML = "";
                NRFButton.classList.remove("rhBusy");
                Callback();
            });
        }, function() {
            clearInterval(NRF.Request);
            clearInterval(NRF.Save);
            NRF.Canceled = true;
            setTimeout(function() {
                NRF.Progress.innerHTML = "";
            }, 500);
            NRFButton.classList.remove("rhBusy");
        });
        NRF.Progress = Popup.Progress;
        NRF.OverallProgress = Popup.OverallProgress;
        NRF.Results = Popup.Results;
        NRFButton.addEventListener("click", function() {
            NRF.Popup = Popup.popUp();
        });
    }

    function setNRFSearch(NRF, User, Callback) {
        NRF.Progress.innerHTML = NRF.OverallProgress.innerHTML = NRF.Results.innerHTML = "";
        NRF.Popup.reposition();
        NRF.Canceled = false;
        queueSave(NRF, User, function() {
            var Match;
            User.NRF = getUser(User).NRF;
            if (NRF.CC.checked) {
                User.NRF = null;
            }
            if (!User.NRF) {
                User.NRF = {
                    LastSearch: 0,
                    OverallProgress: "",
                    Results: ""
                };
            }
            if (((new Date().getTime()) - User.NRF.LastSearch) > 604800000) {
                Match = Location.match(new RegExp("\/user\/" + User.Username + "(\/search\?page=(\d+))?"));
                searchNRFUser(NRF, User, 1, Match ? (Match[2] ? parseInt(Match[2]) : 1) : 0, "/user/" + User.Username + "/search?page=", function() {
                    User.NRF.LastSearch = new Date().getTime();
                    User.NRF.OverallProgress = NRF.OverallProgress.innerHTML;
                    User.NRF.Results = NRF.Results.innerHTML;
                    loadEndlessFeatures(NRF.Results);
                    queueSave(NRF, User, Callback);
                });
            } else {
                NRF.OverallProgress.innerHTML = User.NRF.OverallProgress;
                NRF.Results.innerHTML = User.NRF.Results;
                NRF.Popup.reposition();
                loadEndlessFeatures(NRF.Results);
                Callback();
            }
        });
    }

    function searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback, Context) {
        var Matches, I, N, Match, Pagination;
        if (Context) {
            Matches = Context.querySelectorAll("div.giveaway__column--negative");
            for (I = 0, N = Matches.length; I < N; ++I) {
                NRF.I += Matches[I].querySelectorAll("a[href*='/user/']").length;
                NRF.Results.appendChild(Matches[I].closest(".giveaway__summary").cloneNode(true));
                NRF.Popup.reposition();
            }
            NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
            if (NRF.I < NRF.N) {
                if (NRF.FS.checked) {
                    Matches = Context.getElementsByClassName("giveaway__heading__thin");
                    for (I = 0, N = Matches.length; I < N; ++I) {
                        Match = Matches[I].textContent.match(/\((.+) Copies\)/);
                        if (Match && (parseInt(Match[1]) > 3)) {
                            NRF.Multiple.push(Matches[I].closest(".giveaway__summary").cloneNode(true));
                        }
                    }
                }
                Pagination = Context.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    searchNRFUser(NRF, User, NextPage, CurrentPage, URL, Callback);
                } else if (NRF.FS.checked && NRF.Multiple.length) {
                    searchNRFMultiple(NRF, 0, NRF.Multiple.length, Callback);
                } else {
                    Callback();
                }
            } else {
                Callback();
            }
        } else if (!NRF.Canceled) {
            NRF.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Searching " + User.Username + "'s giveaways (page " + NextPage + ")...</span>";
            if (CurrentPage != NextPage) {
                queueRequest(NRF, null, URL + NextPage, function(Response) {
                    searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, parseHTML(Response.responseText));
                });
            } else {
                searchNRFUser(NRF, User, ++NextPage, CurrentPage, URL, Callback, document);
            }
        }
    }

    function searchNRFMultiple(NRF, I, N, Callback) {
        if (!NRF.Canceled) {
            NRF.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Searching inside giveaways with multiple copies (" + I + " of " + N + ")...</span>";
            if (I < N) {
                searchNRFGiveaway(NRF, NRF.Multiple[I].getElementsByClassName("giveaway__heading__name")[0].getAttribute("href") + "/winners/search?page=", 1, function(Found) {
                    if (Found) {
                        NRF.Results.appendChild(NRF.Multiple[I].cloneNode(true));
                    }
                    if (NRF.I < NRF.N) {
                        searchNRFMultiple(NRF, ++I, N, Callback);
                    } else {
                        Callback();
                    }
                });
            } else {
                Callback();
            }
        }
    }

    function searchNRFGiveaway(NRF, URL, NextPage, Callback) {
        if (!NRF.Canceled) {
            queueRequest(NRF, null, URL + NextPage, function(Response) {
                var ResponseHTML, Matches, I, N, Found, Pagination;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__column--width-small");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    if (Matches[I].textContent.match(/Not Received/)) {
                        Found = true;
                        ++NRF.I;
                        NRF.OverallProgress.innerHTML = NRF.I + " of " + NRF.N + " not received giveaways found...";
                        if (NRF.I >= NRF.N) {
                            break;
                        }
                    }
                }
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if ((NRF.I < NRF.N) && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    searchNRFGiveaway(NRF, URL, ++NextPage, Callback);
                } else {
                    Callback(Found);
                }
            });
        }
    }

    // Avatar Popout

    function addAPBox(Context) {
        var APAvatar, URL, Match, Key, ID, APBox;
        APAvatar = Context;
        URL = APAvatar.getAttribute("href");
        Match = URL ? URL.match(/\/(user|group)\/(.+)/) : null;
        if (Match) {
            APAvatar.classList.add("APAvatar");
            APAvatar.removeAttribute("href");
            APAvatar.insertAdjacentHTML("afterEnd", "<span>" + APAvatar.outerHTML + "</span>");
            Context = APAvatar.nextElementSibling;
            APAvatar.remove();
            APAvatar = Context.firstElementChild;
            ID = Match[2];
            Key = Match[1];
            Context.addEventListener("click", function() {
                APBox = APBoxes[ID];
                if (APBox) {
                    Context.appendChild(APBox.Popout);
                    APBox.Popout.removeAttribute("style");
                    APBox.popOut(APAvatar);
                } else {
                    APBoxes[ID] = APBox = createPopout(Context);
                    APBox.Popout.classList.add("APBox");
                    APBox.Popout.innerHTML =
                        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                        "<span>Loading " + ((Key == "user") ? "profile" : "group") + "...</span>";
                    APBox.popOut(APAvatar);
                    makeRequest(null, URL, APBox.Popout, function(Response) {
                        var ResponseHTML, Avatar, APLink, Columns, I, N, ReportButton;
                        ResponseHTML = parseHTML(Response.responseText);
                        APBox.Popout.innerHTML =
                            ResponseHTML.getElementsByClassName("featured__outer-wrap")[0].outerHTML +
                            "<div class=\"sidebar__shortcut-outer-wrap\">" + ResponseHTML.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].outerHTML + "</div>";
                        Avatar = APBox.Popout.getElementsByClassName("global__image-outer-wrap--avatar-large")[0];
                        Avatar.insertAdjacentHTML("afterEnd", "<a class=\"APLink\"></a>");
                        APLink = Avatar.nextElementSibling;
                        APLink.appendChild(Avatar);
                        APLink.setAttribute("href", URL);
                        Columns = APBox.Popout.getElementsByClassName("featured__table__column");
                        for (I = 0, N = Columns[1].children.length; I < N; ++I) {
                            Columns[0].appendChild(Columns[1].firstElementChild);
                        }
                        ReportButton = APBox.Popout.getElementsByClassName("js__submit-form-inner")[0];
                        if (ReportButton) {
                            ReportButton.addEventListener("click", function() {
                                return ReportButton.getElementsByTagName("form")[0].submit();
                            });
                        }
                        if (Key == "user") {
                            loadProfileFeatures(APBox.Popout);
                        }
                        APBox.reposition(APAvatar);
                    });
                }
            });
        }
    }

    // Unsent Gifts Sender

    function setUGSObserver() {
        document.getElementsByClassName("form__submit-button")[0].addEventListener("click", function() {
            var Winner, Rerolls;
            if (document.querySelector("[name='category_id']").value == 1) {
                Winner = document.querySelector("[name='reroll_winner_id']").value;
                Rerolls = GM_getValue("Rerolls");
                if (Rerolls.indexOf(Winner) < 0) {
                    Rerolls.push(Winner);
                    GM_setValue("Rerolls", Rerolls);
                }
            }
        });
    }

    function addUGSButton(Context) {
        var Popup, UGS, UGSButton;
        Popup = createPopup();
        Popup.Icon.classList.add("fa-gift");
        Popup.Title.textContent = "Send unsent gifts:";
        UGS = {};
        createOptions(Popup.Options, UGS, [{
            Check: function() {
                return true;
            },
            Description: "Only send to users with 0 not activated / multiple wins.",
            Title: "This option will retrieve the results in real time, without using caches.",
            Name: "SendActivatedNotMultiple",
            Key: "SANM",
            ID: "UGS_SANM"
        }, {
            Check: function() {
                return true;
            },
            Description: "Only send to users who are whitelisted.",
            Title: "This option will use your whitelist cache.\nMake sure to sync it through the settings menu if you whitelisted a new user since the last sync.\n" + (
                "Whitelisted users get a pass for not activated / multiple wins."),
            Name: "SendWhitelist",
            Key: "SW",
            ID: "UGS_SW"
        }]);
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"UGSButton\" title=\"Send unsent gifts.\">" +
            "    <i class=\"fa fa-gift\"></i>" +
            "    <i class=\"fa fa-send\"></i>" +
            "</a>"
        );
        UGSButton = Context.firstElementChild;
        createButton(Popup.Button, "fa-send", "Send", "fa-times-circle", "Cancel", function(Callback) {
            var Match;
            UGSButton.classList.add("rhBusy");
            UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
            UGS.Sent.classList.add("rhHidden");
            UGS.Unsent.classList.add("rhHidden");
            UGS.SentCount.textContent = UGS.UnsentCount.textContent = "0";
            UGS.SentUsers.innerHTML = UGS.UnsentUsers.innerHTML = "";
            UGS.Canceled = false;
            UGS.Giveaways = [];
            UGS.Checked = [];
            Match = Location.match(/page=(\d+)/);
            getUGSGiveaways(UGS, 1, Match ? parseInt(Match[1]) : 1, function() {
                var N;
                N = UGS.Giveaways.length;
                if (N > 0) {
                    getUGSWinners(UGS, 0, N, function() {
                        UGSButton.classList.remove("rhBusy");
                        UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
                        Callback();
                    });
                } else {
                    UGSButton.classList.remove("rhBusy");
                    UGS.Progress.innerHTML =
                        "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> " +
                        "<span>You have no unsent gifts.</span>";
                    UGS.OverallProgress.innerHTML = "";
                    Callback();
                }
            });
        }, function() {
            clearInterval(UGS.Request);
            clearInterval(UGS.Save);
            UGS.Canceled = true;
            setTimeout(function() {
                UGS.Progress.innerHTML = UGS.OverallProgress.innerHTML = "";
            }, 500);
            UGSButton.classList.remove("rhBusy");
        });
        UGS.Progress = Popup.Progress;
        UGS.OverallProgress = Popup.OverallProgress;
        createResults(Popup.Results, UGS, [{
            Icon: "<i class=\"fa fa-check-circle giveaway__column--positive\"></i> ",
            Description: "Sent gifts to ",
            Key: "Sent"
        }, {
            Icon: "<i class=\"fa fa-times-circle giveaway__column--negative\"></i> ",
            Description: "Did not send gifts to ",
            Key: "Unsent"
        }]);
        UGSButton.addEventListener("click", function() {
            UGS.Popup = Popup.popUp();
        });
    }

    function getUGSGiveaways(UGS, NextPage, CurrentPage, Callback, Context) {
        var Matches, N, I, Pagination;
        if (Context) {
            Matches = Context.getElementsByClassName("fa icon-red fa-warning");
            N = Matches.length;
            if (N > 0) {
                for (I = 0; I < N; ++I) {
                    UGS.Giveaways.push({
                        Name: Matches[I].closest(".table__row-inner-wrap").getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1],
                        URL: Matches[I].nextElementSibling.getAttribute("href")
                    });
                }
                Pagination = Context.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    getUGSGiveaways(UGS, NextPage, CurrentPage, Callback);
                } else {
                    Callback();
                }
            } else {
                Callback();
            }
        } else if (!UGS.Canceled) {
            UGS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch\"></i> " +
                "<span>Retrieving unsent giveaways (page " + NextPage + ")...</span>";
            if (CurrentPage != NextPage) {
                queueRequest(UGS, null, "/giveaways/created/search?page=" + NextPage, function(Response) {
                    getUGSGiveaways(UGS, ++NextPage, CurrentPage, Callback, parseHTML(Response.responseText));
                });
            } else {
                getUGSGiveaways(UGS, ++NextPage, CurrentPage, Callback, document);
            }
        }
    }

    function getUGSWinners(UGS, I, N, Callback) {
        if (!UGS.Canceled) {
            UGS.OverallProgress.textContent = I + " of " + N + " giveaways retrieved...";
            if (I < N) {
                UGS.Progress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Retrieving winners...</span>";
                queueRequest(UGS, null, UGS.Giveaways[I].URL, function(Response) {
                    var ResponseHTML, Matches, Winners, J, NumMatches, WinnersKeys;
                    ResponseHTML = parseHTML(Response.responseText);
                    if (!XSRFToken) {
                        XSRFToken = ResponseHTML.querySelector("[name='xsrf_token']").value;
                    }
                    Matches = ResponseHTML.getElementsByClassName("table__row-inner-wrap");
                    Winners = {};
                    for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                        Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                    }
                    if (NumMatches < 25) {
                        WinnersKeys = sortArray(Object.keys(Winners));
                        sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                            getUGSWinners(UGS, ++I, N, Callback);
                        });
                    } else {
                        queueRequest(UGS, null, UGS.Giveaways[I].URL + "/search?page=2", function(Response) {
                            Matches = parseHTML(Response.responseText).getElementsByClassName("table__row-inner-wrap");
                            for (J = 0, NumMatches = Matches.length; J < NumMatches; ++J) {
                                Winners[Matches[J].getElementsByClassName("table__column__heading")[0].textContent] = Matches[J].querySelector("[name='winner_id']").value;
                            }
                            WinnersKeys = sortArray(Object.keys(Winners));
                            sendUGSGifts(UGS, 0, WinnersKeys.length, I, WinnersKeys, Winners, function() {
                                getUGSWinners(UGS, ++I, N, Callback);
                            });
                        });
                    }
                });
            } else {
                Callback();
            }
        }
    }

    function sendUGSGifts(UGS, I, N, J, Keys, Winners, Callback) {
        var Reroll, SANM, SW, User;
        if (!UGS.Canceled) {
            UGS.OverallProgress.innerHTML = I + " of " + N + " winners checked...";
            if (I < N) {
                UGS.Progress.innerHTML =
                    "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                    "<span>Sending " + UGS.Giveaways[J].Name + " to " + Keys[I] + "...</span>";
                Reroll = GM_getValue("Rerolls").indexOf(Winners[Keys[I]]) < 0;
                if (Reroll && (UGS.Checked.indexOf(Keys[I] + UGS.Giveaways[J].Name) < 0)) {
                    SANM = UGS.SANM.checked;
                    SW = UGS.SW.checked;
                    if (SANM || SW) {
                        User = {
                            Username: Keys[I]
                        };
                        queueSave(UGS, User, function() {
                            var SavedUser;
                            SavedUser = getUser(User);
                            if (SANM) {
                                if (SW && SavedUser.Whitelisted) {
                                    sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                } else {
                                    User.NAMWC = SavedUser.NAMWC;
                                    updateNAMWCResults(User, UGS, function() {
                                        if (!User.NAMWC) {
                                            User.NAMWC = {
                                                Results: {}
                                            };
                                        }
                                        checkNAMWCNotActivated(UGS, User, function() {
                                            checkNAMWCMultiple(UGS, User, function() {
                                                queueSave(UGS, User, function() {
                                                    if (User.NAMWC.Results.Activated && User.NAMWC.Results.NotMultiple) {
                                                        sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                                                    } else {
                                                        UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                                        UGS.Unsent.classList.remove("rhHidden");
                                                        UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                                        UGS.UnsentUsers.insertAdjacentHTML(
                                                            "beforeEnd",
                                                            "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name +
                                                            "</a>)</span>"
                                                        );
                                                        sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                }
                            } else if (SavedUser.Whitelisted) {
                                sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                            } else {
                                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                                UGS.Unsent.classList.remove("rhHidden");
                                UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                                UGS.UnsentUsers.insertAdjacentHTML(
                                    "beforeEnd",
                                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
                                );
                                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                            }
                        });
                    } else {
                        sendUGSGift(UGS, Winners, Keys, I, J, N, Callback);
                    }
                } else {
                    UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                    UGS.Unsent.classList.remove("rhHidden");
                    UGS.UnsentCount.textContent = parseInt(UGS.UnsentCount.textContent) + 1;
                    UGS.UnsentUsers.insertAdjacentHTML(
                        "beforeEnd",
                        "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (" + (!Reroll ? ("Being rerolled for <a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name +
                                                                                                      "</a>.)") : ("Already won <a href=\"" + UGS.Giveaways[J].URL + "\">" +
                                                                                                                   UGS.Giveaways[J].Name + "</a> from you.)")) + "</span>"
                    );
                    sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
                }
            } else {
                Callback();
            }
        }
    }

    function sendUGSGift(UGS, Winners, Keys, I, J, N, Callback) {
        if (!UGS.Canceled) {
            queueRequest(UGS, "xsrf_token=" + XSRFToken + "&do=sent_feedback&action=1&winner_id=" + Winners[Keys[I]], "/ajax.php", function(Response) {
                UGS.Checked.push(Keys[I] + UGS.Giveaways[J].Name);
                UGS.Sent.classList.remove("rhHidden");
                UGS.SentCount.textContent = parseInt(UGS.SentCount.textContent) + 1;
                UGS.SentUsers.insertAdjacentHTML(
                    "beforeEnd",
                    "<span><a href=\"/user/" + Keys[I] + "\">" + Keys[I] + "</a> (<a href=\"" + UGS.Giveaways[J].URL + "\">" + UGS.Giveaways[J].Name + "</a>)</span>"
                );
                sendUGSGifts(UGS, ++I, N, J, Keys, Winners, Callback);
            });
        }
    }

    // Giveaway Templates

    function addGTSButtons() {
        var GTS;
        GTS = {
            Name: ""
        };
        addGTSView(GTS);
        addGTSSave(GTS);
    }

    function addGTSView(GTS) {
        var Context, GTSContainer, GTSView, Popout, Templates, N, I;
        Context = document.getElementsByClassName("page__heading")[0];
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div>" +
            "    <a class=\"GTSView\" title=\"View saved templates.\">" +
            "        <i class=\"fa fa-file\"></i>" +
            "    </a>" +
            "</div>"
        );
        GTSContainer = Context.firstElementChild;
        GTSView = GTSContainer.firstElementChild;
        Popout = createPopout(GTSContainer);
        Templates = GM_getValue("Templates");
        N = Templates.length;
        if (N) {
            for (I = 0; I < N; ++I) {
                Popout.Popout.insertAdjacentHTML(
                    "beforeEnd",
                    "<div class=\"GTSTemplate\">" + Templates[I].Name +
                    "    <i class=\"fa fa-check-circle GTSApply\" title=\"Apply template.\"></i>" +
                    "    <i class=\"fa fa-trash GTSDelete\" title=\"Delete template.\"></i>" +
                    "</div>");
                setGTSTemplate(Popout.Popout.lastElementChild, Templates[I], GTS);
            }
        } else {
            Popout.Popout.textContent = "No templates saved.";
        }
        GTSView.addEventListener("click", function() {
            Popout.popOut(GTSContainer);
        });
    }

    function setGTSTemplate(GTSTemplate, Template, GTS) {
        GTSTemplate.firstElementChild.addEventListener("click", function() {
            var CurrentDate, Context, Groups, Matches, I, N, ID, Selected, J;
            CurrentDate = Date.now();
            document.querySelector("[name='start_time']").value = formatDate(new Date(CurrentDate + Template.Delay));
            document.querySelector("[name='end_time']").value = formatDate(new Date(CurrentDate + Template.Delay + Template.Duration));
            document.querySelector("[data-checkbox-value='" + Template.Region + "']").click();
            document.querySelector("[data-checkbox-value='" + Template.Type + "']").click();
            if (Template.Type == "groups") {
                if (Template.Whitelist) {
                    Context = document.getElementsByClassName("form__group--whitelist")[0];
                    if (!Context.classList.contains("is-selected")) {
                        Context.click();
                    }
                }
                if (Template.Groups) {
                    Groups = Template.Groups.trim().split(/\s/);
                    Matches = document.getElementsByClassName("form__group--steam");
                    for (I = 0, N = Matches.length; I < N; ++I) {
                        Context = Matches[I];
                        ID = Context.getAttribute("data-group-id");
                        Selected = Context.classList.contains("is-selected");
                        J = Groups.indexOf(ID);
                        if ((Selected && (J < 0)) || (!Selected && (J >= 0))) {
                            Context.click();
                        }
                    }
                }
            }
            if (Template.Level > 0) {
                document.getElementsByClassName("ui-slider-range")[0].style.width = "100%";
                document.getElementsByClassName("form__level")[0].textContent = "level " + Template.Level;
                document.getElementsByClassName("form__input-description--no-level")[0].classList.add("is-hidden");
                document.getElementsByClassName("form__input-description--level")[0].classList.remove("is-hidden");
            } else {
                document.getElementsByClassName("ui-slider-range")[0].style.width = "0%";
                document.getElementsByClassName("form__input-description--level")[0].classList.add("is-hidden");
                document.getElementsByClassName("form__input-description--no-level")[0].classList.remove("is-hidden");
            }
            document.getElementsByClassName("ui-slider-handle")[0].style.left = (Template.Level * 10) + "%";
            document.querySelector("[name='contributor_level']").value = Template.Level;
            document.querySelector("[name='description']").value = Template.Description;
            GTS.Name = Template.Name;
        });
        GTSTemplate.lastElementChild.addEventListener("click", function() {
            var Templates, I, N;
            Templates = GM_getValue("Templates");
            for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != Template.Name); ++I);
            Templates.splice(I, 1);
            GM_setValue("Templates", Templates);
            if (GTS.Name == Template.Name) {
                GTS.Name = "";
            }
            GTSTemplate.remove();
        });
    }

    function addGTSSave(GTS) {
        var Context;
        Context = document.getElementsByClassName("form__submit-button")[0];
        Context.insertAdjacentHTML("afterEnd", "<div class=\"GTSSave\"></div>");
        createButton(Context.nextElementSibling, "fa-file", "Save Template", "", "", function(Callback) {
            var Popup;
            Callback();
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-file");
            Popup.Title.textContent = "Save template:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Enter a name for this template."));
            Popup.TextInput.value = GTS.Name;
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                var StartTime, Delay, Template, Templates, I, N;
                if (Popup.TextInput.value) {
                    StartTime = new Date(document.querySelector("[name='start_time']").value).getTime();
                    Delay = StartTime - (new Date().getTime());
                    Template = {
                        Name: Popup.TextInput.value,
                        Delay: (Delay > 0) ? Delay : 0,
                        Duration: (new Date(document.querySelector("[name='end_time']").value).getTime()) - StartTime,
                        Region: document.querySelector("[name='region']").value,
                        Type: document.querySelector("[name='who_can_enter']").value,
                        Whitelist: document.querySelector("[name='whitelist']").value,
                        Groups: document.querySelector("[name='group_string']").value,
                        Level: document.querySelector("[name='contributor_level']").value,
                        Description: document.querySelector("[name='description']").value
                    };
                    Templates = GM_getValue("Templates");
                    if (GTS.Name == Popup.TextInput.value) {
                        for (I = 0, N = Templates.length; (I < N) && (Templates[I].Name != GTS.Name); ++I);
                        if (I < N) {
                            Templates[I] = Template;
                        } else {
                            Templates.push(Template);
                        }
                    } else {
                        Templates.push(Template);
                    }
                    GM_setValue("Templates", Templates);
                    Callback();
                    Popup.Close.click();
                } else {
                    Popup.Progress.innerHTML =
                        "<i class=\"fa fa-times-circle\"></i> " +
                        "<span>You must enter a name.</span>";
                    Callback();
                }
            });
            Popup.popUp(function() {
                Popup.TextInput.focus();
            });
        });
    }

    // Stickied Giveaway Groups

    function setSGGGroups() {
        var StickiedGroups, SGG, Matches, I, N, Context, ID;
        StickiedGroups = GM_getValue("StickiedGroups");
        SGG = {
            Container: document.getElementsByClassName("form__groups")[0]
        };
        SGG.Separator = SGG.Container.firstElementChild.nextElementSibling;
        Matches = SGG.Container.getElementsByClassName("form__group--steam");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I];
            ID = Context.getAttribute("data-group-id");
            if (StickiedGroups.indexOf(ID) < 0) {
                setSGGButton(Context, true, ID, SGG);
            } else {
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
                setSGGButton(Context, false, ID, SGG);
            }
        }
    }

    function setSGGButton(Context, Sticky, ID, SGG) {
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"" + (Sticky ? "SGGSticky" : "SGGUnsticky") + "\" title=\"" + (Sticky ? "Sticky" : "Unsticky") + " group.\">" +
            "    <i class=\"fa fa-thumb-tack\"></i>" +
            "</a>"
        );
        Context.firstElementChild.addEventListener("click", function(Event) {
            var StickiedGroups;
            Event.stopPropagation();
            StickiedGroups = GM_getValue("StickiedGroups");
            if (Sticky) {
                StickiedGroups.push(ID);
                if (Context == SGG.Separator) {
                    SGG.Separator = SGG.Separator.nextElementSibling;
                }
                SGG.Container.insertBefore(Context, SGG.Separator);
            } else {
                StickiedGroups.splice(StickiedGroups.indexOf(ID), 1);
                SGG.Container.insertBefore(Context, SGG.Separator);
                SGG.Separator = SGG.Separator.previousElementSibling;
            }
            GM_setValue("StickiedGroups", StickiedGroups);
            Event.currentTarget.remove();
            setSGGButton(Context, !Sticky, ID, SGG);
        });
    }

    // Header Icons Refresher

    function setHIRRefresher() {
        var CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons, Interval;
        CreatedIcon = document.getElementsByClassName("nav__right-container")[0].firstElementChild;
        WonIcon = CreatedIcon.nextElementSibling;
        MessagesIcon = WonIcon.nextElementSibling;
        HIR = {};
        Background = GM_getValue("HIR_B");
        Icons = [
            "https://cdn.steamgifts.com/img/favicon.ico",
            "https://www.dropbox.com/s/b329z9nbfi9rtqk/1.ico?raw=1",
            "https://www.dropbox.com/s/h3dv3rbhgsswc3v/2.ico?raw=1",
            "https://www.dropbox.com/s/mtr7d729l9h95nm/3.ico?raw=1",
            "https://www.dropbox.com/s/amqedbg69qvs7k6/4.ico?raw=1",
            "https://www.dropbox.com/s/kvguad7ikedyiwj/5.ico?raw=1",
            "https://www.dropbox.com/s/y9i8gw8azdxb7v2/6.ico?raw=1",
            "https://www.dropbox.com/s/5croyms6e407kvk/7.ico?raw=1",
            "https://www.dropbox.com/s/33hkfd1z4leymhy/8.ico?raw=1",
            "https://www.dropbox.com/s/e8rwpy5gc39t3f2/9.ico?raw=1",
            "https://www.dropbox.com/s/8fm8m4lhwa1zy6r/0.ico?raw=1"
        ];
        Interval = setInterval(function() {
            refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
        }, 60000);
        if (!Background) {
            window.addEventListener("focus", function() {
                refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
                Interval = setInterval(function() {
                    refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons);
                }, 60000);
            });
            window.addEventListener("blur", function() {
                clearInterval(Interval);
            });
        }
    }

    function refreshHIRIcons(CreatedIcon, WonIcon, MessagesIcon, HIR, Background, Icons) {
        var Callback;
        Callback = function(Response) {
            var Created, Won, Messages, Count;
            Created = parseHTML(Response.responseText).getElementsByClassName("nav__right-container")[0].firstElementChild;
            Won = Created.nextElementSibling;
            Messages = Won.nextElementSibling;
            CreatedIcon.className = Created.className;
            CreatedIcon.innerHTML = Created.innerHTML;
            WonIcon.className = Won.className;
            WonIcon.innerHTML = Won.innerHTML;
            MessagesIcon.className = Messages.className;
            MessagesIcon.innerHTML = Messages.innerHTML;
            Count = MessagesIcon.getElementsByClassName("nav__notification")[0];
            Count = Count ? parseInt(Count.textContent) : 0;
            if (HIR.LastCount != Count) {
                HIR.LastCount = Count;
                if (Background) {
                    if (document.hasFocus()) {
                        document.querySelector("link[rel='shortcut icon']").href = Icons[0];
                    } else {
                        document.querySelector("link[rel='shortcut icon']").href = Icons[(Count > 9) ? 10 : Count];
                    }
                }
            } else if (document.hasFocus()) {
                document.querySelector("link[rel='shortcut icon']").href = Icons[0];
            }
        };
        if (Background) {
            queueRequest({}, null, "/", Callback);
        } else {
            makeRequest(null, "/", null, Callback);
        }
    }

    // Advanced Giveaway Search

    function addAGSPanel() {
        var Context, Input, Match, AGSPanel, AGS, Level, I, RegionRestricted;
        Context = document.getElementsByClassName("sidebar__search-container")[0];
        Context.firstElementChild.remove();
        Context.insertAdjacentHTML("afterBegin", "<input class=\"sidebar__search-input\" placeholder=\"Search...\" type=\"text\"/>");
        Input = Context.firstElementChild;
        Match = Location.match(/q=(.*?)(&.+?)?$/);
        if (Match) {
            Input.value = Match[1];
        }
        Context.insertAdjacentHTML("afterEnd", "<div class=\"AGSPanel\"></div>");
        AGSPanel = Context.nextElementSibling;
        AGS = {};
        Level = "<select>";
        for (I = 0; I <= 10; ++I) {
            Level += "<option>" + I + "</option>";
        }
        Level += "</select>";
        createAGSFilters(AGSPanel, AGS, [{
            Title: "Level",
            HTML: Level,
            Key: "level",
        }, {
            Title: "Entries",
            HTML: "<input type=\"text\"/>",
            Key: "entry",
        }, {
            Title: "Copies",
            HTML: "<input type=\"text\"/>",
            Key: "copy"
        }]);
        AGS.level_max.selectedIndex = 10;
        AGSPanel.insertAdjacentHTML(
            "beforeEnd",
            "<div>" +
            "    <span></span>" +
            "    <span>Region Restricted</span>" +
            "</div>"
        );
        RegionRestricted = createCheckbox(AGSPanel.lastElementChild.firstElementChild).Checkbox;
        Context.addEventListener("keydown", function(Event) {
            var Type, URL, Key;
            if (Event.key == "Enter") {
                Event.preventDefault();
                Type = Location.match(/(type=(.+?))(&.+?)?$/);
                URL = "https://www.steamgifts.com/giveaways/search?q=" + Input.value + (Type ? ("&" + Type[1]) : "");
                for (Key in AGS) {
                    if (AGS[Key].value) {
                        URL += "&" + Key + "=" + AGS[Key].value;
                    }
                }
                URL += RegionRestricted.checked ? "&region_restricted=true" : "";
                window.location.href = URL;
            }
        });
    }

    function createAGSFilters(AGSPanel, AGS, Filters) {
        var I, N, AGSFilter;
        for (I = 0, N = Filters.length; I < N; ++I) {
            AGSPanel.insertAdjacentHTML(
                "beforeEnd",
                "<div class=\"AGSFilter\">" +
                "    <span>Min " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
                "    <span>Max " + Filters[I].Title + " " + Filters[I].HTML + "</span>" +
                "</div>"
            );
            AGSFilter = AGSPanel.lastElementChild;
            AGS[Filters[I].Key + "_min"] = AGSFilter.firstElementChild.firstElementChild;
            AGS[Filters[I].Key + "_max"] = AGSFilter.lastElementChild.firstElementChild;
        }
    }

    // Points Refresher

    function setPRRefresher() {
        var Points, PR, Title, Background, Interval;
        if (XSRFToken) {
            Points = document.getElementsByClassName("nav__points")[0];
            PR = {};
            Title = document.getElementsByTagName("title")[0].textContent;
            Background = GM_getValue("PR_B");
            Interval = setInterval(function() {
                refreshPRPoints(Points, PR, Title, Background);
            }, 60000);
            if (!Background) {
                window.addEventListener("focus", function() {
                    refreshPRPoints(Points, PR, Title, Background);
                    Interval = setInterval(function() {
                        refreshPRPoints(Points, PR, Title, Background);
                    }, 60000);
                });
                window.addEventListener("blur", function() {
                    clearInterval(Interval);
                });
            }
        }
    }

    function refreshPRPoints(Points, PR, Title, Background) {
        var Callback;
        Callback = function(Response) {
            var NumPoints, Matches, I, N, Context;
            NumPoints = parseJSON(Response.responseText).points;
            Points.textContent = NumPoints;
            if (PR.LastPoints != NumPoints) {
                PR.LastPoints = NumPoints;
                updateELGBButtons(NumPoints);
                if (Background) {
                    if (document.hasFocus()) {
                        document.getElementsByTagName("title")[0].textContent = Title;
                    } else {
                        document.getElementsByTagName("title")[0].textContent = "(" + NumPoints + "P) " + Title;
                    }
                }
            } else if (document.hasFocus()) {
                document.getElementsByTagName("title")[0].textContent = Title;
            }
        };
        if (Background) {
            queueRequest({}, "xsrf_token=" + XSRFToken + "&do=entry_insert", "/ajax.php", Callback);
        } else {
            makeRequest("xsrf_token=" + XSRFToken + "&do=entry_insert", "/ajax.php", null, Callback);
        }
    }

    // Entered Games Highlighter

    function setEGHHighlighter() {
        var EnterButton, Context;
        EnterButton = document.getElementsByClassName("sidebar__entry-insert")[0];
        if (EnterButton) {
            Context = document.getElementsByClassName("featured__heading")[0];
            EnterButton.addEventListener("click", function() {
                saveEGHGame(Context);
            });
        }
    }

    function saveEGHGame(Context) {
        var Game, SavedGames;
        Game = Context.querySelector("[href*='store.steampowered.com']").getAttribute("href").match(/\d+/)[0];
        SavedGames = GM_getValue("Games");
        if (SavedGames[Game]) {
            SavedGames[Game].Entered = true;
            GM_setValue("Games", SavedGames);
        } else {
            SavedGames[Game] = {
                Entered: true
            };
            GM_setValue("Games", SavedGames);
        }
    }

    function highlightEGHGame(SavedGames, Game, Matches) {
        var I, N, Context;
        if (SavedGames[Game] && SavedGames[Game].Entered) {
            for (I = 0, N = Matches.length; I < N; ++I) {
                Context = Matches[I].closest(".featured__summary, .giveaway__row-inner-wrap, .table__row-inner-wrap")
                    .querySelector(".featured__heading, .giveaway__heading, .table__column--width-fill p");
                Context.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star EGHIcon\" title=\"You have entered giveaways for this game before. Click to unhighlight it.\"></i>");
                setEGHRemove(Context.firstElementChild, Game);
            }
        }
    }

    function setEGHRemove(EGHIcon, Game) {
        EGHIcon.addEventListener("click", function() {
            Games = GM_getValue("Games");
            Games[Game].Entered = false;
            GM_setValue("Games", Games);
            EGHIcon.remove();
        });
    }

    // Entered Giveaways Filter

    function hideEGFGiveaway(Context) {
        Context.parentElement.classList.add("rhHidden");
    }

    // Giveaway Panel

    function addGPPanel(Context) {
        var Columns, GPLinks, GP, GPPanel, Heading, Matches, Match, I, EntryPoints;
        Columns = Context.getElementsByClassName("giveaway__columns")[0];
        if (Columns.innerHTML.match(/remaining/)) {
            GPLinks = Context.getElementsByClassName("giveaway__links")[0];
            GPLinks.classList.add("GPLinks");
            GPLinks.insertAdjacentHTML("afterEnd", "<div class=\"giveaway__columns GPPanel\"></div>");
            GP = {};
            GP.Entries = GPLinks.firstElementChild.lastElementChild;
            GPPanel = GPLinks.nextElementSibling;
            while (!Columns.lastElementChild.classList.contains("giveaway__column--width-fill")) {
                GPPanel.insertBefore(Columns.lastElementChild, GPPanel.firstElementChild);
            }
            GPPanel.insertAdjacentHTML(
                "afterBegin",
                "<div class=\"ELGBButton" + (GM_getValue("ELGB") ? "" : " rhHidden") + "\"></div>" +
                "<div class=\"rhHidden\">" +
                "    <div class=\"sidebar__error is-disabled\">" +
                "        <i class=\"fa fa-exclamation-circle\"></i> " +
                "        <span>Not Enough Points</span>" +
                "    </div>" +
                "</div>" +
                "<a class=\"GDCBPButton" + (GM_getValue("GDCBP") ? "" : " rhHidden") + "\" title=\"Read giveaway description / add a comment to the giveaway.\">" +
                "    <i class=\"fa fa-file-text\"></i>" +
                "    <i class=\"fa fa-comment\"></i>" +
                "</a>" +
                "<div " + (GM_getValue("GWC") ? "" : "class=\"rhHidden\" ") + "title=\"Giveaway winning chance.\">" +
                "    <i class=\"fa fa-line-chart\"></i>" +
                "    <span class=\"GWCChance\"></span>" +
                "</div>"
            );
            GP.ELGBButton = GPPanel.firstElementChild;
            GP.GDCBPButton = GP.ELGBButton.nextElementSibling.nextElementSibling;
            GP.GWCChance = GP.GDCBPButton.nextElementSibling.lastElementChild;
            Heading = Context.getElementsByClassName("giveaway__heading__name")[0];
            GP.Title = Heading.textContent;
            GP.URL = Heading.getAttribute("href");
            GP.Code = GP.URL.match(/\/giveaway\/(.+?)\//)[1];
            Matches = Heading.parentElement.getElementsByClassName("giveaway__heading__thin");
            Match = Matches[0].textContent.match(/\((.+) Copies\)/);
            if (Match) {
                GP.Copies = parseInt(Match[1]);
                I = 1;
            } else {
                GP.Copies = 1;
                I = 0;
            }
            EntryPoints = parseInt(Matches[I].textContent.match(/\d+/)[0]);
            GP.ELGBButton.setAttribute("data-points", EntryPoints);
            GP.Username = Path.match(/^\/user\//) ?
                document.getElementsByClassName("featured__heading__medium")[0].textContent : Context.getElementsByClassName("giveaway__username")[0].textContent;
            GP.Points = document.getElementsByClassName("nav__points")[0];
            if (Context.classList.contains("is-faded")) {
                Context.classList.remove("is-faded");
                Context.classList.add("rhFaded");
                GP.ELGBButton.setAttribute("data-entered", true);
                setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
            } else {
                if (EntryPoints > parseInt(GP.Points.textContent)) {
                    GP.ELGBButton.classList.add("rhHidden");
                    GP.ELGBButton.nextElementSibling.classList.remove("rhHidden");
                }
                setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
            }
            setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
            GP.GDCBPButton.addEventListener("click", function() {
                displayGDCBPPopup(GP);
            });
        }
    }

    function setELGBButton(GP, Icon, Name, Message, Type, Context, Yellow) {
        createButton(GP.ELGBButton, Icon, Name, "fa-circle-o-notch fa-spin", Message, function() {
            if (XSRFToken) {
                enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow);
            } else {
                makeRequest("", "/", null, function(Response) {
                    XSRFToken = parseHTML(Response.responseText).querySelector("[name='xsrf_token']").value;
                    enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow);
                });
            }
        }, null, false, Yellow);
    }

    function enterLeaveELGBGiveaway(GP, Icon, Name, Message, Type, Context, Yellow) {
        var Data, URL;
        Data = "xsrf_token=" + XSRFToken + "&do=" + Type + "&code=" + GP.Code;
        URL = "/ajax.php";
        makeRequest(Data, URL, null, function(Response) {
            var ResponseJSON;
            ResponseJSON = parseJSON(Response.responseText);
            if (ResponseJSON.type == "success") {
                Context.classList.toggle("rhFaded");
                GP.Entries.textContent = ResponseJSON.entry_count + " entries";
                GP.Points.textContent = ResponseJSON.points;
                updateELGBButtons(ResponseJSON.points);
                setGWCChance(GP.GWCChance, GP.Entries, GP.Copies);
                if (GP.ELGBButton.getAttribute("data-entered")) {
                    GP.ELGBButton.removeAttribute("data-entered");
                    setELGBButton(GP, "fa-plus-circle", "Enter", "Entering...", "entry_insert", Context);
                } else {
                    if (GM_getValue("GDCBP") && GM_getValue("GDCBP_EG")) {
                        displayGDCBPPopup(GP);
                    }
                    if (GM_getValue("EGH")) {
                        saveEGHGame(Context);
                    }
                    GP.ELGBButton.setAttribute("data-entered", true);
                    setELGBButton(GP, "fa-minus-circle", "Leave", "Leaving...", "entry_delete", Context, true);
                }
            } else {
                GP.Points.textContent = ResponseJSON.points;
                GP.ELGBButton.innerHTML =
                    "<div class=\"sidebar__error is-disabled\">" +
                    "    <i class=\"fa fa-exclamation-circle\"></i> " +
                    "    <span>" + ResponseJSON.msg + "</span>" +
                    "</div>";
                updateELGBButtons(ResponseJSON.points);
            }
        });
    }

    function updateELGBButtons(Points) {
        var Matches, I, N;
        Matches = document.getElementsByClassName("ELGBButton");
        for (I = 0, N = Matches.length; I < N; ++I) {
            if (!Matches[I].getAttribute("data-entered")) {
                if (parseInt(Matches[I].getAttribute("data-points")) <= Points) {
                    Matches[I].classList.remove("rhHidden");
                    Matches[I].nextElementSibling.classList.add("rhHidden");
                } else {
                    Matches[I].classList.add("rhHidden");
                    Matches[I].nextElementSibling.classList.remove("rhHidden");
                }
            }
        }
    }

    function displayGDCBPPopup(GP) {
        GP.GDCBPButton.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
        makeRequest(null, GP.URL, null, function(Response) {
            var Description, Popup;
            GP.GDCBPButton.innerHTML =
                "<i class=\"fa fa-file-text\"></i> " +
                "<i class=\"fa fa-comment\"></i>";
            Description = parseHTML(Response.responseText).getElementsByClassName("page__description")[0];
            if (Description || GM_getValue("GDCBP_EG")) {
                Popup = createPopup(true);
                Popup.Popup.classList.add("GDCBPPopup");
                Popup.Icon.classList.add("fa-file-text");
                Popup.Title.innerHTML = "<span><a href=\"" + GP.URL + "\">" + GP.Title + "</a></span> by <a href=\"/user/" + GP.Username + "\">" + GP.Username + "</a>";
                if (Description) {
                    Popup.Description.insertBefore(Description, Popup.Description.firstElementChild);
                }
                Popup.TextArea.classList.remove("rhHidden");
                if (GM_getValue("CFH")) {
                    addCFHPanel(Popup.TextArea);
                }
                createButton(Popup.Button, "fa-send", "Submit Comment", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                    saveComment("", "", Popup.TextArea.value, GP.URL, Popup.Progress, Callback, function() {
                        makeRequest(null, GP.URL, Popup.Progress, function(Response) {
                            GP.Entries.parentElement.nextElementSibling.lastElementChild.textContent =
                                parseHTML(Response.responseText).getElementsByClassName("sidebar__navigation__item__count")[0].textContent + " comments";
                            Callback();
                            Popup.Close.click();
                        });
                    });
                });
                Popup.popUp(function() {
                    Popup.TextArea.focus();
                });
            }
        });
    }

    function setGWCChance(GWCChance, Entries, Copies) {
        var Chance;
        Entries = parseInt(Entries.textContent.replace(",", "").match(/\d+/)[0]);
        Chance = (Entries > 0) ? (Math.round(Copies / Entries * 10000) / 100) : 100;
        if (Chance > 100) {
            Chance = 100;
        }
        GWCChance.textContent = Chance + "% (" + Math.round(Entries / Copies) + ":1)";
    }

    function addGWCHeading() {
        document.getElementsByClassName("table__heading")[0].firstElementChild.nextElementSibling.insertAdjacentHTML(
            "afterEnd",
            "<div class=\"table__column--width-small text-center\">Chance</div>"
        );
    }

    function addGWCChance(Context) {
        var Entered, Entries, Copies;
        Entered = true;
        if (!Context) {
            Context = document;
            Entered = false;
        }
        Entries = Context.getElementsByClassName(Entered ? "table__column--width-small" : "live__entry-count")[0];
        Copies = Context.getElementsByClassName(Entered ? "table__column__heading" : "featured__heading__medium")[0].textContent.match(/\((.+) Copies\)/);
        Copies = Copies ? Copies[1] : 1;
        Context = Entered ? Entries : Context.getElementsByClassName("featured__column")[0];
        Context.insertAdjacentHTML(
            "afterEnd",
            "<div class=\"" + (Entered ? "table__column--width-small text-center" : "featured__column") + " GWCChance\" title=\"Giveaway winning chance.\">" + (Entered ? "" : (
                "<i class=\"fa fa-line-chart\"></i>")) +
            "    <span></span>" +
            "</div>"
        );
        setGWCChance(Context.nextElementSibling.lastElementChild, Entries, Copies);
    }

    // Groups Highlighter

    function highlightGHGroups(Matches) {
        var I, N, SavedGroups, Group;
        SavedGroups = GM_getValue("Groups");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Group = Matches[I].getAttribute("href").match(/\/group\/(.+)\//)[1];
            if (SavedGroups.indexOf(Group) >= 0) {
                Matches[I].closest(".table__row-outer-wrap").classList.add("GHHighlight");
            }
        }
    }

    // Giveaway Groups Popout

    function addGGPBox(Context) {
        var URL, GGPButton, GGPBox;
        URL = Context.getAttribute("href");
        GGPButton = Context;
        GGPButton.classList.add("GGPButton");
        GGPButton.removeAttribute("href");
        GGPButton.insertAdjacentHTML("afterEnd", "<span class=\"giveaway__column--group GGPContainer\" href=\"" + URL + "\">" + GGPButton.outerHTML + "</span>");
        Context = GGPButton.nextElementSibling;
        GGPButton.remove();
        GGPButton = Context.firstElementChild;
        GGPButton.addEventListener("click", function() {
            if (GGPBox) {
                GGPBox.Popout.innerHTML = "";
            } else {
                GGPBox = createPopout(Context);
                GGPBox.Popout.classList.add("GGPBox");
            }
            GGPBox.Popout.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Loading giveaway groups...</span>";
            GGPBox.popOut(GGPButton);
            getGGPGroups(URL + "/search?page=", 1, GGPBox.Popout, [], function(Groups) {
                var I, N;
                GGPBox.Popout.innerHTML = "<a class=\"giveaway__heading__name\" href=\"" + URL + "\">Groups</a>";
                for (I = 0, N = Groups.length; I < N; ++I) {
                    GGPBox.Popout.appendChild(Groups[I]);
                }
                loadEndlessFeatures(GGPBox.Popout);
                GGPBox.reposition(GGPButton);
            });
        });
    }

    function getGGPGroups(URL, NextPage, Context, Groups, Callback) {
        makeRequest(null, URL + NextPage, Context, function(Response) {
            var ResponseHTML, Matches, I, N, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
            for (I = 0, N = Matches.length; I < N; ++I) {
                Groups.push(Matches[I]);
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                getGGPGroups(URL, ++NextPage, Context, Groups, Callback);
            } else {
                Callback(Groups);
            }
        });
    }

    // Discussions Highlighter

    function highlightDHDiscussions(Matches) {
        var Comments, I, N, Key, Container;
        Comments = GM_getValue("Comments");
        for (I = 0, N = Matches.length; I < N; ++I) {
            Key = Matches[I].getElementsByClassName("table__column__heading")[0].getAttribute("href").match(/\/discussion\/(.+?)\//)[1];
            if (!Comments[Key]) {
                Comments[Key] = {
                    Highlighted: false
                };
            }
            Container = Matches[I].getElementsByClassName("table__column--width-fill")[0].firstElementChild;
            if (Comments[Key].Highlighted) {
                Matches[I].classList.add("DHHighlight");
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star DHIcon\" title=\"Unhighlight discussion.\"></i>");
            } else {
                Container.insertAdjacentHTML("afterBegin", "<i class=\"fa fa-star-o DHIcon\" title=\"Highlight discussion.\"></i>");
            }
            setDHIcon(Container.firstElementChild, Matches[I], Key);
        }
        GM_setValue("Comments", Comments);
    }

    function setDHIcon(DHIcon, Context, Key) {
        DHIcon.addEventListener("click", function() {
            var Comments;
            DHIcon.classList.toggle("fa-star");
            DHIcon.classList.toggle("fa-star-o");
            DHIcon.title = DHIcon.classList.contains("fa-star") ? "Highlight discussion." : "Unhighlight discussion.";
            Context.classList.toggle("DHHighlight");
            Comments = GM_getValue("Comments");
            Comments[Key].Highlighted = Comments[Key].Highlighted ? false : true;
            GM_setValue("Comments", Comments);
        });
    }

    // Comment Tracker

    function checkCTVisited(Matches) {
        var ID, Comments, I, N, Link, Match, Type, Key, Element, CommentsCount, Count, Read, LastUnread, CTPanel;
        ID = "Comments" + (SG ? "" : "_ST");
        Comments = GM_getValue(ID);
        for (I = 0, N = Matches.length; I < N; ++I) {
            Link = Matches[I].getAttribute("href");
            if (Link) {
                Match = Link.match(/\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//);
                if (Match) {
                    Type = Match[1];
                    Key = Match[2];
                    if (Match && (((Type == "giveaway") && GM_getValue("CT_G")) || (Type != "giveaway")) && Comments[Key] && Comments[Key].Visited) {
                        Element = Matches[I].closest("div");
                        Element.style.opacity = "0.5";
                        setHoverOpacity(Element, "1", "0.5");
                    }
                    if (Type == "discussion") {
                        Element = Matches[I].closest(".table__column--width-fill");
                        CommentsCount = Element.nextElementSibling.firstElementChild;
                        Count = parseInt(CommentsCount.textContent.replace(/,/g, ""));
                        if (!Comments[Key]) {
                            Comments[Key] = {};
                        }
                        delete Comments[Key].Count;
                        Read = Object.keys(Comments[Key]).length - 3;
                        if (Read < 0) {
                            Read = 0;
                        }
                        if (Read <= Count) {
                            LastUnread = GM_getValue("CT_LU");
                            CommentsCount.insertAdjacentHTML(
                                "afterEnd",
                                " <span class=\"CTPanel\">" + ((Read < Count) ? (
                                    "<a class=\"CTGoToUnread\" title=\"Go to the " + (LastUnread ? "last" : "first") + " unread comment.\">" +
                                    "    <i class=\"fa fa-comments-o\"></i>" +
                                    "</a>" +
                                    "<a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
                                    "    <i class=\"fa fa-eye\"></i>" +
                                    "</a>") : "") +
                                "</span>"
                            );
                            CTPanel = CommentsCount.nextElementSibling;
                            if (Read < Count) {
                                CommentsCount.insertAdjacentText("beforeEnd", " (+" + (Count - Read) + ")");
                                setCTPanel(CTPanel, CommentsCount.href, Key, LastUnread, Element);
                            }
                            if (!Comments[Key].Visited) {
                                CTPanel.insertAdjacentHTML(
                                    "beforeEnd",
                                    "<a class=\"CTMarkVisited\" title=\"Mark discussion as visited.\">" +
                                    "    <i class=\"fa fa-check\"></i>" +
                                    "</a>"
                                );
                                setCTVisited(CTPanel, Key, Element);
                            }
                        }
                    }
                }
            }
        }
    }

    function setCTPanel(CTPanel, URL, Key, LastUnread, Element) {
        var CTGoToUnread, CTMarkRead;
        CTGoToUnread = CTPanel.firstElementChild;
        CTMarkRead = CTGoToUnread.nextElementSibling;
        CTGoToUnread.addEventListener("click", function() {
            CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
            markCTDiscussionRead({
                Progress: CTPanel
            }, URL + "/search?page=", 1, Key, true, LastUnread, LastUnread, function(ID) {
                window.location.href = ID ? "/go/comment/" + ID : URL;
            });
        });
        CTMarkRead.addEventListener("click", function() {
            Element.style.opacity = "0.5";
            setHoverOpacity(Element, "1", "0.5");
            CTPanel.innerHTML = "<i class=\"fa fa-circle-o-notch fa-spin\"></i>";
            markCTDiscussionRead({
                Progress: CTPanel
            }, URL + "/search?page=", 1, Key, false, false, false, function() {
                CTPanel.remove();
            });
        });
    }

    function markCTDiscussionRead(CT, URL, NextPage, Key, Unread, LastUnread, LastUnreadFirst, Callback) {
        queueRequest(CT, null, URL + NextPage, function(Response) {
            var ResponseHTML, Matches, I, N, Comments, ID, Timestamp, Found, Pagination;
            ResponseHTML = parseHTML(Response.responseText);
            Matches = ResponseHTML.getElementsByClassName("comment__summary");
            for (I = 0, N = Matches.length; I < N; ++I) {
                if (!Matches[I].closest(".comment--submit")) {
                    Comments = GM_getValue("Comments");
                    if (!Comments[Key]) {
                        Comments[Key] = {
                            Visited: true
                        };
                    } else if (!Comments[Key].Visited) {
                        Comments[Key].Visited = true;
                    }
                    ID = Matches[I].id;
                    if (!Comments[Key][ID]) {
                        Comments[Key][ID] = 0;
                    }
                    Timestamp = Matches[I].getElementsByClassName("comment__actions")[0].firstElementChild.querySelectorAll("[data-timestamp]");
                    Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
                    if (Comments[Key][ID] < Timestamp) {
                        if (Unread) {
                            Found = true;
                            break;
                        } else {
                            Comments[Key][ID] = Timestamp;
                            GM_setValue("Comments", Comments);
                        }
                    }
                }
            }
            Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
            if (Matches.length && !Found && ((LastUnread && (NextPage >= 1)) || (!LastUnread && Pagination && !Pagination.lastElementChild.classList.contains("is-selected")))) {
                if (LastUnreadFirst) {
                    if (Pagination) {
                        NextPage = parseInt(Pagination.lastElementChild.getAttribute("data-page-number")) + 1;
                    } else {
                        Callback(ID);
                    }
                } else if (LastUnread && (NextPage == 1)) {
                    Callback(ID);
                }
                setTimeout(markCTDiscussionRead, 0, CT, URL, LastUnread ? --NextPage : ++NextPage, Key, Unread, LastUnread, false, Callback);
            } else {
                Callback(ID);
            }
        });
    }

    function setCTVisited(CTPanel, Key, Element) {
        var CTMarkVisited;
        CTMarkVisited = CTPanel.lastElementChild;
        CTMarkVisited.addEventListener("click", function() {
            var Comments;
            Comments = GM_getValue("Comments");
            Comments[Key].Visited = true;
            GM_setValue("Comments", Comments);
            Element.style.opacity = "0.5";
            setHoverOpacity(Element, "1", "0.5");
            CTMarkVisited.remove();
        });
    }

    function addCTPanel(Context) {
        var CTGoToUnread;
        Context.insertAdjacentHTML(
            "afterBegin",
            "<div class=\"page_heading_btn CTPanel\">" +
            "    <a class=\"CTGoToUnread\" title=\"Go to the first unread comment.\">" +
            "        <i class=\"fa fa-comments-o\"></i>" +
            "    </a>" +
            "    <a class=\"CTMarkRead\" title=\"Mark all comments as read.\">" +
            "        <i class=\"fa fa-eye\"></i>" +
            "    </a>" +
            "</span>"
        );
        CTGoToUnread = Context.firstElementChild.firstElementChild;
        CTGoToUnread.addEventListener("click", function() {
            var Unread, ID;
            Unread = document.getElementsByClassName("CTButton")[0];
            if (Unread) {
                ID = SG ? Unread.closest(".comment__summary").id : Unread.closest(".comment_inner").parentElement.id;
                if (ID) {
                    window.location.hash = "";
                    window.location.hash = ID;
                } else {
                    window.scrollTo(0, 0);
                }
            }
        });
        CTGoToUnread.nextElementSibling.addEventListener("click", function() {
            var Matches, ID, Key, I, N;
            Matches = document.getElementsByClassName("CTButton");
            ID = "Comments" + (SG ? "" : "_ST");
            Key = Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
            for (I = 0, N = Matches.length; I < N; ++I) {
                Matches[0].closest(".comment__summary, .comment_inner").style.opacity = "0.5";
                markCTRead(Matches[0], ID, Key);
            }
        });
    }

    function setCTComment(Matches) {
        var ID, Comments, Key, I, N, Comment, CommentID, Timestamp, Context;
        ID = "Comments" + (SG ? "" : "_ST");
        Comments = GM_getValue(ID);
        Key = Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3];
        if (!Comments[Key]) {
            Comments[Key] = {
                Visited: true
            };
            GM_setValue(ID, Comments);
        } else if (!Comments[Key].Visited) {
            Comments[Key].Visited = true;
            GM_setValue(ID, Comments);
        }
        for (I = 0, N = Matches.length; I < N; ++I) {
            Comment = Matches[I];
            if (!Comment.closest(".comment--submit")) {
                CommentID = SG ? Comment.id : Comment.parentElement.id;
                Timestamp = Comment.querySelectorAll("[data-timestamp]");
                Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
                if (Timestamp == Comments[Key][CommentID]) {
                    Comment.style.opacity = "0.5";
                    setHoverOpacity(Comment, "1", "0.5");
                } else {
                    delete Comments[Key][CommentID];
                    Context = Matches[I].getElementsByClassName(SG ? "comment__actions" : "action_list")[0];
                    Context.insertAdjacentHTML(
                        "beforeEnd",
                        "<a class=\"CTButton\" title=\"Mark comment as read.\">" +
                        "    <i class=\"fa fa-eye\"></i>" +
                        "</a>"
                    );
                    Context.lastElementChild.addEventListener("click", function(Event) {
                        markCTRead(Event.currentTarget, ID, Key);
                    });
                }
            }
        }
        GM_setValue(ID, Comments);
    }

    function markCTRead(CTButton, ID, Key) {
        var Timestamp, Comments, CommentID, Comment;
        Timestamp = CTButton.parentElement.firstElementChild.querySelectorAll("[data-timestamp]");
        Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
        Comments = GM_getValue(ID);
        Comment = CTButton.closest(".comment__summary, .comment_inner");
        CommentID = SG ? Comment.id : Comment.parentElement.id;
        Comments[Key][CommentID] = Timestamp;
        GM_setValue(ID, Comments);
        CTButton.remove();
        setHoverOpacity(Comment, "1", "0.5");
    }

    // Accurate Timestamp

    function setATTimestamp(Context) {
        if (!Context.textContent.match(/\*/)) {
            Context.textContent = (new Date(parseInt(Context.getAttribute("data-timestamp")) * 1000).toLocaleString()) + (Context.textContent ? (" - " + Context.textContent) : "");
        }
    }

    // Comment Formatting Helper

    function addCFHPanel(Context) {
        var CFH, I, N;
        Context.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading page_heading CFHPanel\"></div>");
        CFH = {
            Items: [{
                ID: "CFH_I",
                Name: "Italic",
                Icon: "fa-italic",
                Prefix: "*",
                Suffix: "*"
            }, {
                ID: "CFH_B",
                Name: "Bold",
                Icon: "fa-bold",
                Prefix: "**",
                Suffix: "**"
            }, {
                ID: "CFH_S",
                Name: "Spoiler",
                Icon: "fa-eye-slash",
                Prefix: "~",
                Suffix: "~"
            }, {
                ID: "CFH_ST",
                Name: "Strikethrough",
                Icon: "fa-strikethrough",
                Prefix: "~~",
                Suffix: "~~"
            }, {
                ID: "CFH_H1",
                Name: "Heading 1",
                Icon: "fa-header",
                Text: "1",
                Prefix: "# "
            }, {
                ID: "CFH_H2",
                Name: "Heading 2",
                Icon: "fa-header",
                Text: "2",
                Prefix: "## "
            }, {
                ID: "CFH_H3",
                Name: "Heading 3",
                Icon: "fa-header",
                Text: "3",
                Prefix: "### "
            }, {
                ID: "CFH_BQ",
                Name: "Blockquote",
                Icon: "fa-quote-left",
                Prefix: "> "
            }, {
                ID: "CFH_LB",
                Name: "Line Break",
                Icon: "fa-minus",
                Prefix: "\n---\n\n"
            }, {
                ID: "CFH_OL",
                Name: "Ordered List",
                Icon: "fa-list-ol",
                OrderedList: true
            }, {
                ID: "CFH_UL",
                Name: "Unordered List",
                Icon: "fa-list-ul",
                UnorderedList: true
            }, {
                ID: "CFH_IC",
                Name: "Inline Code",
                Icon: "fa-code",
                Prefix: "`",
                Suffix: "`"
            }, {
                ID: "CFH_LC",
                Name: "Line Code",
                Icon: "fa-code",
                SecondaryIcon: "fa-indent",
                Prefix: "    "
            }, {
                ID: "CFH_PC",
                Name: "Paragraph Code",
                Icon: "fa-code",
                SecondaryIcon: "fa-paragraph",
                Prefix: "```\n",
                Suffix: "\n```"
            }, {
                ID: "CFH_L",
                Name: "Link",
                Icon: "fa-globe",
                setPopout: function(Popout) {
                    var URL, Title;
                    Popout.innerHTML =
                        "URL: <input placeholder=\"http://www.example.com\" type=\"text\"/>" +
                        "Title: <input placeholder=\"Cat\" type=\"text\"/>" +
                        "<div class=\"form__saving-button btn_action white\">Add</div>";
                    URL = Popout.firstElementChild;
                    Title = URL.nextElementSibling;
                    Title.nextElementSibling.addEventListener("click", function() {
                        wrapCFHLinkImage(CFH, Title.value, URL.value);
                    });
                }
            }, {
                ID: "CFH_IMG",
                Name: "Image",
                Icon: "fa-image",
                setPopout: function(Popout) {
                    var URL, Title;
                    Popout.innerHTML =
                        "URL: <input placeholder=\"http://www.example.com/image.jpg\" type=\"text\"/>" +
                        "Title: <input placeholder=\"Cats\" type=\"text\"/>" +
                        "<div class=\"form__saving-button btn_action white\">Add</div>";
                    URL = Popout.firstElementChild;
                    Title = URL.nextElementSibling;
                    Title.nextElementSibling.addEventListener("click", function() {
                        wrapCFHLinkImage(CFH, Title.value, URL.value, true);
                    });
                }
            }, {
                ID: "CFH_T",
                Name: "Table",
                Icon: "fa-table",
                setPopout: function(Popout) {
                    var Table, InsertRow, InsertColumn;
                    Popout.innerHTML =
                        "<table></table>" +
                        "<div class=\"form__saving-button btn_action white\">Insert Row</div>" +
                        "<div class=\"form__saving-button btn_action white\">Insert Column</div>" +
                        "<div class=\"form__saving-button btn_action white\">Add</div>";
                    Table = Popout.firstElementChild;
                    InsertRow = Table.nextElementSibling;
                    InsertColumn = InsertRow.nextElementSibling;
                    insertCFHTableRows(4, Table);
                    insertCFHTableColumns(2, Table);
                    InsertRow.addEventListener("click", function() {
                        insertCFHTableRows(1, Table);
                    });
                    InsertColumn.addEventListener("click", function() {
                        insertCFHTableColumns(1, Table);
                    });
                    InsertColumn.nextElementSibling.addEventListener("click", function() {
                        var Rows, I, NumRows, J, NumColumns, Value, Start, End;
                        Rows = Table.rows;
                        for (I = 1, NumRows = Rows.length; I < NumRows; ++I) {
                            for (J = 1, NumColumns = Rows[0].cells.length; J < NumColumns; ++J) {
                                if (!Rows[I].cells[J].firstElementChild.value) {
                                    I = NumRows + 1;
                                    J = NumColumns + 1;
                                }
                            }
                        }
                        if ((I <= NumRows) || ((I > NumRows) && window.confirm("Some cells are empty. This might lead to unexpected results. Are you sure you want to continue?"))) {
                            Value = "";
                            for (I = 1; I < NumRows; ++I) {
                                Value += "\n";
                                for (J = 1; J < NumColumns; ++J) {
                                    Value += Rows[I].cells[J].firstElementChild.value + ((J < (NumColumns - 1)) ? " | " : "");
                                }
                            }
                            Value += "\n\n";
                            Start = CFH.TextArea.selectionStart;
                            End = CFH.TextArea.selectionEnd;
                            CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
                            CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
                            CFH.TextArea.focus();
                        }
                    });
                }
            }, {
                ID: "CFH_E",
                Name: "Emojis",
                Icon: "fa-smile-o",
                setPopout: function(Popout) {
                    var Emojis;
                    Popout.innerHTML =
                        "<div class=\"CFHEmojis\">" + GM_getValue("Emojis") + "</div>" +
                        "<div class=\"form__saving-button btn_action white\">Select Emojis</div>";
                    Emojis = Popout.firstElementChild;
                    setCFHEmojis(Emojis, CFH);

                    Emojis.nextElementSibling.addEventListener("click", function() {
                        var Popup, I, N, Emoji, SavedEmojis;
                        Popup = createPopup(true);
                        Popup.Icon.classList.add("fa-smile-o");
                        Popup.Title.textContent = "Select emojis:";
                        Popup.Description.insertAdjacentHTML(
                            "afterBegin",
                            "<div class=\"CFHEmojis\"></div>" +
                            createDescription("Drag the emojis you want to use and drop them in the box below. Click on an emoji to remove it.") +
                            "<div class=\"global__image-outer-wrap page_heading_btn CFHEmojis\">" + GM_getValue("Emojis") + "</div>"
                        );
                        Emojis = Popup.Description.firstElementChild;
                        for (I = 0, N = CFH.Emojis.length; I < N; ++I) {
                            Emoji = CFH.Emojis[I].Emoji;
                            Emojis.insertAdjacentHTML("beforeEnd", "<span data-id=\"" + Emoji + "\" draggable=\"true\" title=\"" + CFH.Emojis[I].Title + "\">" + Emoji + "</span>");
                            Emojis.lastElementChild.addEventListener("dragstart", function(Event) {
                                Event.dataTransfer.setData("text", Event.currentTarget.getAttribute("data-id"));
                            });
                        }
                        SavedEmojis = Emojis.nextElementSibling.nextElementSibling;
                        for (I = 0, N = SavedEmojis.children.length; I < N; ++I) {
                            SavedEmojis.children[I].addEventListener("click", function(Event) {
                                Event.currentTarget.remove();
                                GM_setValue("Emojis", SavedEmojis.innerHTML);
                                Popup.reposition();
                            });
                        }
                        SavedEmojis.addEventListener("dragover", function(Event) {
                            Event.preventDefault();
                        });
                        SavedEmojis.addEventListener("drop", function(Event) {
                            var ID;
                            Event.preventDefault();
                            ID = Event.dataTransfer.getData("text");
                            if (!SavedEmojis.querySelector("[data-id='" + ID + "']")) {
                                SavedEmojis.appendChild(document.querySelector("[data-id='" + ID + "']").cloneNode(true));
                                GM_setValue("Emojis", SavedEmojis.innerHTML);
                                Popup.reposition();
                                SavedEmojis.lastElementChild.addEventListener("click", function(Event) {
                                    Event.currentTarget.remove();
                                    GM_setValue("Emojis", SavedEmojis.innerHTML);
                                    Popup.reposition();
                                });
                            }
                        });
                        Popup = Popup.popUp(function() {
                            Popout.classList.add("rhHidden");
                        });
                    });
                },
                Callback: function(Popout) {
                    var Emojis;
                    Emojis = Popout.firstElementChild;
                    Emojis.innerHTML = GM_getValue("Emojis");
                    setCFHEmojis(Emojis, CFH);
                }
            }, {
                Name: "Automatic Links / Images Paste Formatting",
                Icon: "fa-paste",
                Callback: function(Context) {
                    CFH.ALIPF = Context.firstElementChild;
                    setCFHALIPF(CFH, GM_getValue("CFH_ALIPF"));
                },
                OnClick: function() {
                    setCFHALIPF(CFH);
                }
            }],
            Panel: Context.previousElementSibling,
            TextArea: Context,
            Emojis: [{
                Emoji: "&#x1F600",
                Title: "Grinning Face"
            }, {
                Emoji: "&#x1F601",
                Title: "Grinning Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F602",
                Title: "Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F923",
                Title: "Rolling On The Floor Laughing"
            }, {
                Emoji: "&#x1F603",
                Title: "Smiling Face With Open Mouth"
            }, {
                Emoji: "&#x1F604",
                Title: "Smiling Face With Open Mouth & Smiling Eyes"
            }, {
                Emoji: "&#x1F605",
                Title: "Smiling Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F606",
                Title: "Smiling Face With Open Mouth & Closed Eyes"
            }, {
                Emoji: "&#x1F609",
                Title: "Winking Face"
            }, {
                Emoji: "&#x1F60A",
                Title: "Smiling Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F60B",
                Title: "Face Savouring Delicious Food"
            }, {
                Emoji: "&#x1F60E",
                Title: "Smiling Face With Sunglasses"
            }, {
                Emoji: "&#x1F60D",
                Title: "Smiling Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F618",
                Title: "Face Blowing A Kiss"
            }, {
                Emoji: "&#x1F617",
                Title: "Kissing Face"
            }, {
                Emoji: "&#x1F619",
                Title: "Kissing Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F61A",
                Title: "Kissing Face With Closed Eyes"
            }, {
                Emoji: "&#x263A",
                Title: "Smiling Face"
            }, {
                Emoji: "&#x1F642",
                Title: "Slightly Smiling Face"
            }, {
                Emoji: "&#x1F917",
                Title: "Hugging Face"
            }, {
                Emoji: "&#x1F914",
                Title: "Thinking Face"
            }, {
                Emoji: "&#x1F610",
                Title: "Neutral Face"
            }, {
                Emoji: "&#x1F611",
                Title: "Expressionless Face"
            }, {
                Emoji: "&#x1F636",
                Title: "Face Without Mouth"
            }, {
                Emoji: "&#x1F644",
                Title: "Face With Rolling Eyes"
            }, {
                Emoji: "&#x1F60F",
                Title: "Smirking Face"
            }, {
                Emoji: "&#x1F623",
                Title: "Persevering Face"
            }, {
                Emoji: "&#x1F625",
                Title: "Disappointed But Relieved Face"
            }, {
                Emoji: "&#x1F62E",
                Title: "Face With Open Mouth"
            }, {
                Emoji: "&#x1F910",
                Title: "Zipper-Mouth Face"
            }, {
                Emoji: "&#x1F62F",
                Title: "Hushed Face"
            }, {
                Emoji: "&#x1F62A",
                Title: "Sleepy Face"
            }, {
                Emoji: "&#x1F62B",
                Title: "Tired Face"
            }, {
                Emoji: "&#x1F634",
                Title: "Sleeping Face"
            }, {
                Emoji: "&#x1F60C",
                Title: "Relieved Face"
            }, {
                Emoji: "&#x1F913",
                Title: "Nerd Face"
            }, {
                Emoji: "&#x1F61B",
                Title: "Face With Stuck-Out Tongue"
            }, {
                Emoji: "&#x1F61C",
                Title: "Face With Stuck-Out Tongue & Winking Eye"
            }, {
                Emoji: "&#x1F61D",
                Title: "Face With Stuck-Out Tongue & Closed Eyes"
            }, {
                Emoji: "&#x1F924",
                Title: "Drooling Face"
            }, {
                Emoji: "&#x1F612",
                Title: "Unamused Face"
            }, {
                Emoji: "&#x1F613",
                Title: "Face With Cold Sweat"
            }, {
                Emoji: "&#x1F614",
                Title: "Pensive Face"
            }, {
                Emoji: "&#x1F615",
                Title: "Confused Face"
            }, {
                Emoji: "&#x1F643",
                Title: "Upside-Down Face"
            }, {
                Emoji: "&#x1F911",
                Title: "Money-Mouth Face"
            }, {
                Emoji: "&#x1F632",
                Title: "Astonished Face"
            }, {
                Emoji: "&#x2639",
                Title: "Frowning Face"
            }, {
                Emoji: "&#x1F641",
                Title: "Slightly Frowning Face"
            }, {
                Emoji: "&#x1F616",
                Title: "Confounded Face"
            }, {
                Emoji: "&#x1F61E",
                Title: "Disappointed Face"
            }, {
                Emoji: "&#x1F61F",
                Title: "Worried Face"
            }, {
                Emoji: "&#x1F624",
                Title: "Face With Steam From Nose"
            }, {
                Emoji: "&#x1F622",
                Title: "Crying Face"
            }, {
                Emoji: "&#x1F62D",
                Title: "Loudly Crying Face"
            }, {
                Emoji: "&#x1F626",
                Title: "Frowning Face With Open Mouth"
            }, {
                Emoji: "&#x1F627",
                Title: "Anguished Face"
            }, {
                Emoji: "&#x1F628",
                Title: "Fearful Face"
            }, {
                Emoji: "&#x1F629",
                Title: "Weary Face"
            }, {
                Emoji: "&#x1F62C",
                Title: "Grimacing Face"
            }, {
                Emoji: "&#x1F630",
                Title: "Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F631",
                Title: "Face Screaming In Fear"
            }, {
                Emoji: "&#x1F633",
                Title: "Flushed Face"
            }, {
                Emoji: "&#x1F635",
                Title: "Dizzy Face"
            }, {
                Emoji: "&#x1F621",
                Title: "Pouting Face"
            }, {
                Emoji: "&#x1F620",
                Title: "Angry Face"
            }, {
                Emoji: "&#x1F607",
                Title: "Smiling Face With Halo"
            }, {
                Emoji: "&#x1F920",
                Title: "Cowboy Hat Face"
            }, {
                Emoji: "&#x1F921",
                Title: "Clown Face"
            }, {
                Emoji: "&#x1F925",
                Title: "Lying Face"
            }, {
                Emoji: "&#x1F637",
                Title: "Face With Medical Mask"
            }, {
                Emoji: "&#x1F912",
                Title: "Face With Thermometer"
            }, {
                Emoji: "&#x1F915",
                Title: "Face With Head-Bandage"
            }, {
                Emoji: "&#x1F922",
                Title: "Nauseated Face"
            }, {
                Emoji: "&#x1F927",
                Title: "Sneezing Face"
            }, {
                Emoji: "&#x1F608",
                Title: "Smiling Face With Horns"
            }, {
                Emoji: "&#x1F47F",
                Title: "Angry Face With Horns"
            }, {
                Emoji: "&#x1F479",
                Title: "Ogre"
            }, {
                Emoji: "&#x1F47A",
                Title: "Goblin"
            }, {
                Emoji: "&#x1F480",
                Title: "Skull"
            }, {
                Emoji: "&#x2620",
                Title: "Skull And Crossbones"
            }, {
                Emoji: "&#x1F47B",
                Title: "Ghost"
            }, {
                Emoji: "&#x1F47D",
                Title: "Alien"
            }, {
                Emoji: "&#x1F47E",
                Title: "Alien Monster"
            }, {
                Emoji: "&#x1F916",
                Title: "Robot Face"
            }, {
                Emoji: "&#x1F4A9",
                Title: "Pile Of Poo"
            }, {
                Emoji: "&#x1F63A",
                Title: "Smiling Cat Face With Open Mouth"
            }, {
                Emoji: "&#x1F638",
                Title: "Grinning Cat Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F639",
                Title: "Cat Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F63B",
                Title: "Smiling Cat Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F63C",
                Title: "Cat Face With Wry Smile"
            }, {
                Emoji: "&#x1F63D",
                Title: "Kissing Cat Face With Closed Eyes"
            }, {
                Emoji: "&#x1F640",
                Title: "Weary Cat Face"
            }, {
                Emoji: "&#x1F63F",
                Title: "Crying Cat Face"
            }, {
                Emoji: "&#x1F63E",
                Title: "Pouting Cat Face"
            }, {
                Emoji: "&#x1F648",
                Title: "See-No-Evil Monkey"
            }, {
                Emoji: "&#x1F649",
                Title: "Hear-No-Evil Monkey"
            }, {
                Emoji: "&#x1F64A",
                Title: "Speak-No-Evil Monkey"
            }, {
                Emoji: "&#x1F466",
                Title: "Boy"
            }, {
                Emoji: "&#x1F466&#x1F3FB",
                Title: "Boy: Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FC",
                Title: "Boy: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FD",
                Title: "Boy: Medium Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FE",
                Title: "Boy: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FF",
                Title: "Boy: Dark Skin Tone"
            }, {
                Emoji: "&#x1F467",
                Title: "Girl"
            }, {
                Emoji: "&#x1F467&#x1F3FB",
                Title: "Girl: Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FC",
                Title: "Girl: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FD",
                Title: "Girl: Medium Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FE",
                Title: "Girl: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FF",
                Title: "Girl: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468",
                Title: "Man"
            }, {
                Emoji: "&#x1F468&#x1F3FB",
                Title: "Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC",
                Title: "Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD",
                Title: "Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE",
                Title: "Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF",
                Title: "Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469",
                Title: "Woman"
            }, {
                Emoji: "&#x1F469&#x1F3FB",
                Title: "Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC",
                Title: "Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD",
                Title: "Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE",
                Title: "Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF",
                Title: "Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F474",
                Title: "Old Man"
            }, {
                Emoji: "&#x1F474&#x1F3FB",
                Title: "Old Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FC",
                Title: "Old Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FD",
                Title: "Old Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FE",
                Title: "Old Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FF",
                Title: "Old Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F475",
                Title: "Old Woman"
            }, {
                Emoji: "&#x1F475&#x1F3FB",
                Title: "Old Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FC",
                Title: "Old Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FD",
                Title: "Old Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FE",
                Title: "Old Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FF",
                Title: "Old Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F476",
                Title: "Baby"
            }, {
                Emoji: "&#x1F476&#x1F3FB",
                Title: "Baby: Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FC",
                Title: "Baby: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FD",
                Title: "Baby: Medium Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FE",
                Title: "Baby: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FF",
                Title: "Baby: Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C",
                Title: "Baby Angel"
            }, {
                Emoji: "&#x1F47C&#x1F3FB",
                Title: "Baby Angel: Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FC",
                Title: "Baby Angel: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FD",
                Title: "Baby Angel: Medium Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FE",
                Title: "Baby Angel: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FF",
                Title: "Baby Angel: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F393",
                Title: "Man Student"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F393",
                Title: "Man Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F393",
                Title: "Man Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F393",
                Title: "Man Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F393",
                Title: "Man Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F393",
                Title: "Man Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F393",
                Title: "Woman Student"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F393",
                Title: "Woman Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F393",
                Title: "Woman Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F393",
                Title: "Woman Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F393",
                Title: "Woman Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F393",
                Title: "Woman Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3EB",
                Title: "Man Teacher"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3EB",
                Title: "Man Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3EB",
                Title: "Man Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3EB",
                Title: "Woman Teacher"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3EB",
                Title: "Woman Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3EB",
                Title: "Woman Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2696&#xFE0F",
                Title: "Man Judge"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F33E",
                Title: "Man Farmer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F33E",
                Title: "Man Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F33E",
                Title: "Man Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F33E",
                Title: "Man Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F33E",
                Title: "Woman Farmer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F33E",
                Title: "Woman Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F33E",
                Title: "Woman Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F373",
                Title: "Man Cook"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F373",
                Title: "Man Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F373",
                Title: "Man Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F373",
                Title: "Man Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F373",
                Title: "Man Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F373",
                Title: "Man Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F373",
                Title: "Woman Cook"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F373",
                Title: "Woman Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F373",
                Title: "Woman Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F373",
                Title: "Woman Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F527",
                Title: "Man Mechanic"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F527",
                Title: "Man Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F527",
                Title: "Man Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F527",
                Title: "Man Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F527",
                Title: "Woman Mechanic"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F527",
                Title: "Woman Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F527",
                Title: "Woman Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3ED",
                Title: "Man Factory Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3ED",
                Title: "Woman Factory Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BC",
                Title: "Man Office Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BC",
                Title: "Man Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BC",
                Title: "Man Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BC",
                Title: "Woman Office Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F52C",
                Title: "Man Scientist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F52C",
                Title: "Man Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F52C",
                Title: "Man Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F52C",
                Title: "Man Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F52C",
                Title: "Woman Scientist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F52C",
                Title: "Woman Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F52C",
                Title: "Woman Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BB",
                Title: "Man Technologist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BB",
                Title: "Man Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BB",
                Title: "Man Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BB",
                Title: "Woman Technologist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BB",
                Title: "Woman Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BB",
                Title: "Woman Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A4",
                Title: "Man Singer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A4",
                Title: "Man Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A4",
                Title: "Man Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A4",
                Title: "Man Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A4",
                Title: "Woman Singer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A4",
                Title: "Woman Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A4",
                Title: "Woman Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A8",
                Title: "Man Artist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A8",
                Title: "Man Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A8",
                Title: "Man Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A8",
                Title: "Man Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A8",
                Title: "Woman Artist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A8",
                Title: "Woman Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A8",
                Title: "Woman Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F680",
                Title: "Man Astronaut"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F680",
                Title: "Man Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F680",
                Title: "Man Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F680",
                Title: "Man Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F680",
                Title: "Woman Astronaut"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F680",
                Title: "Woman Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F680",
                Title: "Woman Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F692",
                Title: "Man Firefighter"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F692",
                Title: "Man Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F692",
                Title: "Man Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F692",
                Title: "Man Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F692",
                Title: "Woman Firefighter"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F692",
                Title: "Woman Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F692",
                Title: "Woman Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E",
                Title: "Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB",
                Title: "Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC",
                Title: "Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD",
                Title: "Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE",
                Title: "Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF",
                Title: "Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575",
                Title: "Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB",
                Title: "Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC",
                Title: "Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD",
                Title: "Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE",
                Title: "Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF",
                Title: "Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482",
                Title: "Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB",
                Title: "Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC",
                Title: "Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD",
                Title: "Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE",
                Title: "Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF",
                Title: "Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2642&#xFE0F",
                Title: "Man Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477",
                Title: "Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB",
                Title: "Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC",
                Title: "Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD",
                Title: "Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE",
                Title: "Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF",
                Title: "Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473",
                Title: "Person Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB",
                Title: "Person Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC",
                Title: "Person Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD",
                Title: "Person Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE",
                Title: "Person Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF",
                Title: "Person Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471",
                Title: "Blond-Haired Person"
            }, {
                Emoji: "&#x1F471&#x1F3FB",
                Title: "Blond-Haired Person: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC",
                Title: "Blond-Haired Person: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD",
                Title: "Blond-Haired Person: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE",
                Title: "Blond-Haired Person: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF",
                Title: "Blond-Haired Person: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F385",
                Title: "Santa Claus"
            }, {
                Emoji: "&#x1F385&#x1F3FB",
                Title: "Santa Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FC",
                Title: "Santa Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FD",
                Title: "Santa Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FE",
                Title: "Santa Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FF",
                Title: "Santa Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F936",
                Title: "Mrs. Claus"
            }, {
                Emoji: "&#x1F936&#x1F3FB",
                Title: "Mrs. Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FC",
                Title: "Mrs. Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FD",
                Title: "Mrs. Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FE",
                Title: "Mrs. Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FF",
                Title: "Mrs. Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F478",
                Title: "Princess"
            }, {
                Emoji: "&#x1F478&#x1F3FB",
                Title: "Princess: Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FC",
                Title: "Princess: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FD",
                Title: "Princess: Medium Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FE",
                Title: "Princess: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FF",
                Title: "Princess: Dark Skin Tone"
            }, {
                Emoji: "&#x1F934",
                Title: "Prince"
            }, {
                Emoji: "&#x1F934&#x1F3FB",
                Title: "Prince: Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FC",
                Title: "Prince: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FD",
                Title: "Prince: Medium Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FE",
                Title: "Prince: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FF",
                Title: "Prince: Dark Skin Tone"
            }, {
                Emoji: "&#x1F470",
                Title: "Bride With Veil"
            }, {
                Emoji: "&#x1F470&#x1F3FB",
                Title: "Bride With Veil: Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FC",
                Title: "Bride With Veil: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FD",
                Title: "Bride With Veil: Medium Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FE",
                Title: "Bride With Veil: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FF",
                Title: "Bride With Veil: Dark Skin Tone"
            }, {
                Emoji: "&#x1F935",
                Title: "Man In Tuxedo"
            }, {
                Emoji: "&#x1F935&#x1F3FB",
                Title: "Man In Tuxedo: Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FC",
                Title: "Man In Tuxedo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FD",
                Title: "Man In Tuxedo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FE",
                Title: "Man In Tuxedo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FF",
                Title: "Man In Tuxedo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F930",
                Title: "Pregnant Woman"
            }, {
                Emoji: "&#x1F930&#x1F3FB",
                Title: "Pregnant Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FC",
                Title: "Pregnant Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FD",
                Title: "Pregnant Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FE",
                Title: "Pregnant Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FF",
                Title: "Pregnant Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F472",
                Title: "Man With Chinese Cap"
            }, {
                Emoji: "&#x1F472&#x1F3FB",
                Title: "Man With Chinese Cap: Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FC",
                Title: "Man With Chinese Cap: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FD",
                Title: "Man With Chinese Cap: Medium Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FE",
                Title: "Man With Chinese Cap: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FF",
                Title: "Man With Chinese Cap: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D",
                Title: "Person Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB",
                Title: "Person Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC",
                Title: "Person Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD",
                Title: "Person Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE",
                Title: "Person Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF",
                Title: "Person Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E",
                Title: "Person Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB",
                Title: "Person Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC",
                Title: "Person Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD",
                Title: "Person Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE",
                Title: "Person Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF",
                Title: "Person Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645",
                Title: "Person Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB",
                Title: "Person Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC",
                Title: "Person Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD",
                Title: "Person Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE",
                Title: "Person Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF",
                Title: "Person Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646",
                Title: "Person Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB",
                Title: "Person Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC",
                Title: "Person Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD",
                Title: "Person Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE",
                Title: "Person Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF",
                Title: "Person Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481",
                Title: "Person Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB",
                Title: "Person Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC",
                Title: "Person Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD",
                Title: "Person Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE",
                Title: "Person Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF",
                Title: "Person Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B",
                Title: "Person Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB",
                Title: "Person Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC",
                Title: "Person Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD",
                Title: "Person Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE",
                Title: "Person Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF",
                Title: "Person Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647",
                Title: "Person Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB",
                Title: "Person Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC",
                Title: "Person Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD",
                Title: "Person Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE",
                Title: "Person Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF",
                Title: "Person Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926",
                Title: "Person Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB",
                Title: "Person Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC",
                Title: "Person Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD",
                Title: "Person Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE",
                Title: "Person Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF",
                Title: "Person Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937",
                Title: "Person Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB",
                Title: "Person Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC",
                Title: "Person Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD",
                Title: "Person Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE",
                Title: "Person Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF",
                Title: "Person Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486",
                Title: "Person Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB",
                Title: "Person Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC",
                Title: "Person Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD",
                Title: "Person Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE",
                Title: "Person Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF",
                Title: "Person Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487",
                Title: "Person Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB",
                Title: "Person Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC",
                Title: "Person Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD",
                Title: "Person Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE",
                Title: "Person Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF",
                Title: "Person Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6",
                Title: "Person Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB",
                Title: "Person Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC",
                Title: "Person Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD",
                Title: "Person Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE",
                Title: "Person Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF",
                Title: "Person Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2642&#xFE0F",
                Title: "Man Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3",
                Title: "Person Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB",
                Title: "Person Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC",
                Title: "Person Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD",
                Title: "Person Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE",
                Title: "Person Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF",
                Title: "Person Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2642&#xFE0F",
                Title: "Man Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2640&#xFE0F",
                Title: "Woman Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F483",
                Title: "Woman Dancing"
            }, {
                Emoji: "&#x1F483&#x1F3FB",
                Title: "Woman Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FC",
                Title: "Woman Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FD",
                Title: "Woman Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FE",
                Title: "Woman Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FF",
                Title: "Woman Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A",
                Title: "Man Dancing"
            }, {
                Emoji: "&#x1F57A&#x1F3FB",
                Title: "Man Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FC",
                Title: "Man Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FD",
                Title: "Man Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FE",
                Title: "Man Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FF",
                Title: "Man Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46F",
                Title: "People With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2642&#xFE0F",
                Title: "Men With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2640&#xFE0F",
                Title: "Women With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F574",
                Title: "Man In Business Suit Levitating"
            }, {
                Emoji: "&#x1F574&#x1F3FB",
                Title: "Man In Business Suit Levitating: Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FC",
                Title: "Man In Business Suit Levitating: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FD",
                Title: "Man In Business Suit Levitating: Medium Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FE",
                Title: "Man In Business Suit Levitating: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FF",
                Title: "Man In Business Suit Levitating: Dark Skin Tone"
            }, {
                Emoji: "&#x1F5E3",
                Title: "Speaking Head"
            }, {
                Emoji: "&#x1F464",
                Title: "Bust In Silhouette"
            }, {
                Emoji: "&#x1F465",
                Title: "Busts In Silhouette"
            }, {
                Emoji: "&#x1F93A",
                Title: "Person Fencing"
            }, {
                Emoji: "&#x1F3C7",
                Title: "Horse Racing"
            }, {
                Emoji: "&#x1F3C7&#x1F3FB",
                Title: "Horse Racing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FC",
                Title: "Horse Racing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FD",
                Title: "Horse Racing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FE",
                Title: "Horse Racing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FF",
                Title: "Horse Racing: Dark Skin Tone"
            }, {
                Emoji: "&#x26F7",
                Title: "Skier"
            }, {
                Emoji: "&#x1F3C2",
                Title: "Snowboarder"
            }, {
                Emoji: "&#x1F3C2&#x1F3FB",
                Title: "Snowboarder: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FC",
                Title: "Snowboarder: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FD",
                Title: "Snowboarder: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FE",
                Title: "Snowboarder: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FF",
                Title: "Snowboarder: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC",
                Title: "Person Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB",
                Title: "Person Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC",
                Title: "Person Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD",
                Title: "Person Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE",
                Title: "Person Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF",
                Title: "Person Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4",
                Title: "Person Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB",
                Title: "Person Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC",
                Title: "Person Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD",
                Title: "Person Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE",
                Title: "Person Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF",
                Title: "Person Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3",
                Title: "Person Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB",
                Title: "Person Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC",
                Title: "Person Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD",
                Title: "Person Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE",
                Title: "Person Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF",
                Title: "Person Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA",
                Title: "Person Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB",
                Title: "Person Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC",
                Title: "Person Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD",
                Title: "Person Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE",
                Title: "Person Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF",
                Title: "Person Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9",
                Title: "Person Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB",
                Title: "Person Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC",
                Title: "Person Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD",
                Title: "Person Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE",
                Title: "Person Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF",
                Title: "Person Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB",
                Title: "Person Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB",
                Title: "Person Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC",
                Title: "Person Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD",
                Title: "Person Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE",
                Title: "Person Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF",
                Title: "Person Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4",
                Title: "Person Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB",
                Title: "Person Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC",
                Title: "Person Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD",
                Title: "Person Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE",
                Title: "Person Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF",
                Title: "Person Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2642&#xFE0F",
                Title: "Man Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5",
                Title: "Person Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB",
                Title: "Person Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC",
                Title: "Person Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD",
                Title: "Person Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE",
                Title: "Person Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF",
                Title: "Person Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CE",
                Title: "Racing Car"
            }, {
                Emoji: "&#x1F3CD",
                Title: "Motorcycle"
            }, {
                Emoji: "&#x1F938",
                Title: "Person Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB",
                Title: "Person Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC",
                Title: "Person Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD",
                Title: "Person Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE",
                Title: "Person Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF",
                Title: "Person Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93C",
                Title: "People Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2642&#xFE0F",
                Title: "Men Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2640&#xFE0F",
                Title: "Women Wrestling"
            }, {
                Emoji: "&#x1F93D",
                Title: "Person Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB",
                Title: "Person Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC",
                Title: "Person Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD",
                Title: "Person Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE",
                Title: "Person Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF",
                Title: "Person Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E",
                Title: "Person Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB",
                Title: "Person Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC",
                Title: "Person Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD",
                Title: "Person Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE",
                Title: "Person Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF",
                Title: "Person Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939",
                Title: "Person Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB",
                Title: "Person Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC",
                Title: "Person Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD",
                Title: "Person Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE",
                Title: "Person Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF",
                Title: "Person Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46B",
                Title: "Man And Woman Holding Hands"
            }, {
                Emoji: "&#x1F46C",
                Title: "Two Men Holding Hands"
            }, {
                Emoji: "&#x1F46D",
                Title: "Two Women Holding Hands"
            }, {
                Emoji: "&#x1F48F",
                Title: "Kiss"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469",
                Title: "Kiss: Woman, Woman"
            }, {
                Emoji: "&#x1F491",
                Title: "Couple With Heart"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469",
                Title: "Couple With Heart: Woman, Woman"
            }, {
                Emoji: "&#x1F46A",
                Title: "Family"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F3FB",
                Title: "Light Skin Tone"
            }, {
                Emoji: "&#x1F3FC",
                Title: "Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3FD",
                Title: "Medium Skin Tone"
            }, {
                Emoji: "&#x1F3FE",
                Title: "Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3FF",
                Title: "Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA",
                Title: "Flexed Biceps"
            }, {
                Emoji: "&#x1F4AA&#x1F3FB",
                Title: "Flexed Biceps: Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FC",
                Title: "Flexed Biceps: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FD",
                Title: "Flexed Biceps: Medium Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FE",
                Title: "Flexed Biceps: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FF",
                Title: "Flexed Biceps: Dark Skin Tone"
            }, {
                Emoji: "&#x1F933",
                Title: "Selfie"
            }, {
                Emoji: "&#x1F933&#x1F3FB",
                Title: "Selfie: Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FC",
                Title: "Selfie: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FD",
                Title: "Selfie: Medium Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FE",
                Title: "Selfie: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FF",
                Title: "Selfie: Dark Skin Tone"
            }, {
                Emoji: "&#x1F448",
                Title: "Backhand Index Pointing Left"
            }, {
                Emoji: "&#x1F448&#x1F3FB",
                Title: "Backhand Index Pointing Left: Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FC",
                Title: "Backhand Index Pointing Left: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FD",
                Title: "Backhand Index Pointing Left: Medium Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FE",
                Title: "Backhand Index Pointing Left: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FF",
                Title: "Backhand Index Pointing Left: Dark Skin Tone"
            }, {
                Emoji: "&#x1F449",
                Title: "Backhand Index Pointing Right"
            }, {
                Emoji: "&#x1F449&#x1F3FB",
                Title: "Backhand Index Pointing Right: Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FC",
                Title: "Backhand Index Pointing Right: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FD",
                Title: "Backhand Index Pointing Right: Medium Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FE",
                Title: "Backhand Index Pointing Right: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FF",
                Title: "Backhand Index Pointing Right: Dark Skin Tone"
            }, {
                Emoji: "&#x261D",
                Title: "Index Pointing Up"
            }, {
                Emoji: "&#x261D&#x1F3FB",
                Title: "Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FC",
                Title: "Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FD",
                Title: "Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FE",
                Title: "Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FF",
                Title: "Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F446",
                Title: "Backhand Index Pointing Up"
            }, {
                Emoji: "&#x1F446&#x1F3FB",
                Title: "Backhand Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FC",
                Title: "Backhand Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FD",
                Title: "Backhand Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FE",
                Title: "Backhand Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FF",
                Title: "Backhand Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F595",
                Title: "Middle Finger"
            }, {
                Emoji: "&#x1F595&#x1F3FB",
                Title: "Middle Finger: Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FC",
                Title: "Middle Finger: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FD",
                Title: "Middle Finger: Medium Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FE",
                Title: "Middle Finger: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FF",
                Title: "Middle Finger: Dark Skin Tone"
            }, {
                Emoji: "&#x1F447",
                Title: "Backhand Index Pointing Down"
            }, {
                Emoji: "&#x1F447&#x1F3FB",
                Title: "Backhand Index Pointing Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FC",
                Title: "Backhand Index Pointing Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FD",
                Title: "Backhand Index Pointing Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FE",
                Title: "Backhand Index Pointing Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FF",
                Title: "Backhand Index Pointing Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270C",
                Title: "Victory Hand"
            }, {
                Emoji: "&#x270C&#x1F3FB",
                Title: "Victory Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FC",
                Title: "Victory Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FD",
                Title: "Victory Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FE",
                Title: "Victory Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FF",
                Title: "Victory Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E",
                Title: "Crossed Fingers"
            }, {
                Emoji: "&#x1F91E&#x1F3FB",
                Title: "Crossed Fingers: Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FC",
                Title: "Crossed Fingers: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FD",
                Title: "Crossed Fingers: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FE",
                Title: "Crossed Fingers: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FF",
                Title: "Crossed Fingers: Dark Skin Tone"
            }, {
                Emoji: "&#x1F596",
                Title: "Vulcan Salute"
            }, {
                Emoji: "&#x1F596&#x1F3FB",
                Title: "Vulcan Salute: Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FC",
                Title: "Vulcan Salute: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FD",
                Title: "Vulcan Salute: Medium Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FE",
                Title: "Vulcan Salute: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FF",
                Title: "Vulcan Salute: Dark Skin Tone"
            }, {
                Emoji: "&#x1F918",
                Title: "Sign Of The Horns"
            }, {
                Emoji: "&#x1F918&#x1F3FB",
                Title: "Sign Of The Horns: Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FC",
                Title: "Sign Of The Horns: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FD",
                Title: "Sign Of The Horns: Medium Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FE",
                Title: "Sign Of The Horns: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FF",
                Title: "Sign Of The Horns: Dark Skin Tone"
            }, {
                Emoji: "&#x1F919",
                Title: "Call Me Hand"
            }, {
                Emoji: "&#x1F919&#x1F3FB",
                Title: "Call Me Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FC",
                Title: "Call Me Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FD",
                Title: "Call Me Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FE",
                Title: "Call Me Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FF",
                Title: "Call Me Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F590",
                Title: "Raised Hand With Fingers Splayed"
            }, {
                Emoji: "&#x1F590&#x1F3FB",
                Title: "Raised Hand With Fingers Splayed: Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FC",
                Title: "Raised Hand With Fingers Splayed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FD",
                Title: "Raised Hand With Fingers Splayed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FE",
                Title: "Raised Hand With Fingers Splayed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FF",
                Title: "Raised Hand With Fingers Splayed: Dark Skin Tone"
            }, {
                Emoji: "&#x270B",
                Title: "Raised Hand"
            }, {
                Emoji: "&#x270B&#x1F3FB",
                Title: "Raised Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FC",
                Title: "Raised Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FD",
                Title: "Raised Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FE",
                Title: "Raised Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FF",
                Title: "Raised Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C",
                Title: "OK Hand"
            }, {
                Emoji: "&#x1F44C&#x1F3FB",
                Title: "OK Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FC",
                Title: "OK Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FD",
                Title: "OK Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FE",
                Title: "OK Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FF",
                Title: "OK Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D",
                Title: "Thumbs Up"
            }, {
                Emoji: "&#x1F44D&#x1F3FB",
                Title: "Thumbs Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FC",
                Title: "Thumbs Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FD",
                Title: "Thumbs Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FE",
                Title: "Thumbs Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FF",
                Title: "Thumbs Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E",
                Title: "Thumbs Down"
            }, {
                Emoji: "&#x1F44E&#x1F3FB",
                Title: "Thumbs Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FC",
                Title: "Thumbs Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FD",
                Title: "Thumbs Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FE",
                Title: "Thumbs Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FF",
                Title: "Thumbs Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270A",
                Title: "Raised Fist"
            }, {
                Emoji: "&#x270A&#x1F3FB",
                Title: "Raised Fist: Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FC",
                Title: "Raised Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FD",
                Title: "Raised Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FE",
                Title: "Raised Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FF",
                Title: "Raised Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A",
                Title: "Oncoming Fist"
            }, {
                Emoji: "&#x1F44A&#x1F3FB",
                Title: "Oncoming Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FC",
                Title: "Oncoming Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FD",
                Title: "Oncoming Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FE",
                Title: "Oncoming Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FF",
                Title: "Oncoming Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B",
                Title: "Left-Facing Fist"
            }, {
                Emoji: "&#x1F91B&#x1F3FB",
                Title: "Left-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FC",
                Title: "Left-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FD",
                Title: "Left-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FE",
                Title: "Left-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FF",
                Title: "Left-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C",
                Title: "Right-Facing Fist"
            }, {
                Emoji: "&#x1F91C&#x1F3FB",
                Title: "Right-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FC",
                Title: "Right-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FD",
                Title: "Right-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FE",
                Title: "Right-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FF",
                Title: "Right-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A",
                Title: "Raised Back Of Hand"
            }, {
                Emoji: "&#x1F91A&#x1F3FB",
                Title: "Raised Back Of Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FC",
                Title: "Raised Back Of Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FD",
                Title: "Raised Back Of Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FE",
                Title: "Raised Back Of Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FF",
                Title: "Raised Back Of Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B",
                Title: "Waving Hand"
            }, {
                Emoji: "&#x1F44B&#x1F3FB",
                Title: "Waving Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FC",
                Title: "Waving Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FD",
                Title: "Waving Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FE",
                Title: "Waving Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FF",
                Title: "Waving Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F",
                Title: "Clapping Hands"
            }, {
                Emoji: "&#x1F44F&#x1F3FB",
                Title: "Clapping Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FC",
                Title: "Clapping Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FD",
                Title: "Clapping Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FE",
                Title: "Clapping Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FF",
                Title: "Clapping Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x270D",
                Title: "Writing Hand"
            }, {
                Emoji: "&#x270D&#x1F3FB",
                Title: "Writing Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FC",
                Title: "Writing Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FD",
                Title: "Writing Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FE",
                Title: "Writing Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FF",
                Title: "Writing Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F450",
                Title: "Open Hands"
            }, {
                Emoji: "&#x1F450&#x1F3FB",
                Title: "Open Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FC",
                Title: "Open Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FD",
                Title: "Open Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FE",
                Title: "Open Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FF",
                Title: "Open Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C",
                Title: "Raising Hands"
            }, {
                Emoji: "&#x1F64C&#x1F3FB",
                Title: "Raising Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FC",
                Title: "Raising Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FD",
                Title: "Raising Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FE",
                Title: "Raising Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FF",
                Title: "Raising Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F",
                Title: "Folded Hands"
            }, {
                Emoji: "&#x1F64F&#x1F3FB",
                Title: "Folded Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FC",
                Title: "Folded Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FD",
                Title: "Folded Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FE",
                Title: "Folded Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FF",
                Title: "Folded Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91D",
                Title: "Handshake"
            }, {
                Emoji: "&#x1F485",
                Title: "Nail Polish"
            }, {
                Emoji: "&#x1F485&#x1F3FB",
                Title: "Nail Polish: Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FC",
                Title: "Nail Polish: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FD",
                Title: "Nail Polish: Medium Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FE",
                Title: "Nail Polish: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FF",
                Title: "Nail Polish: Dark Skin Tone"
            }, {
                Emoji: "&#x1F442",
                Title: "Ear"
            }, {
                Emoji: "&#x1F442&#x1F3FB",
                Title: "Ear: Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FC",
                Title: "Ear: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FD",
                Title: "Ear: Medium Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FE",
                Title: "Ear: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FF",
                Title: "Ear: Dark Skin Tone"
            }, {
                Emoji: "&#x1F443",
                Title: "Nose"
            }, {
                Emoji: "&#x1F443&#x1F3FB",
                Title: "Nose: Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FC",
                Title: "Nose: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FD",
                Title: "Nose: Medium Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FE",
                Title: "Nose: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FF",
                Title: "Nose: Dark Skin Tone"
            }, {
                Emoji: "&#x1F463",
                Title: "Footprints"
            }, {
                Emoji: "&#x1F440",
                Title: "Eyes"
            }, {
                Emoji: "&#x1F441",
                Title: "Eye"
            }, {
                Emoji: "&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F",
                Title: "Eye In Speech Bubble"
            }, {
                Emoji: "&#x1F445",
                Title: "Tongue"
            }, {
                Emoji: "&#x1F444",
                Title: "Mouth"
            }, {
                Emoji: "&#x1F48B",
                Title: "Kiss Mark"
            }, {
                Emoji: "&#x1F498",
                Title: "Heart With Arrow"
            }, {
                Emoji: "&#x2764",
                Title: "Red Heart"
            }, {
                Emoji: "&#x1F493",
                Title: "Beating Heart"
            }, {
                Emoji: "&#x1F494",
                Title: "Broken Heart"
            }, {
                Emoji: "&#x1F495",
                Title: "Two Hearts"
            }, {
                Emoji: "&#x1F496",
                Title: "Sparkling Heart"
            }, {
                Emoji: "&#x1F497",
                Title: "Growing Heart"
            }, {
                Emoji: "&#x1F499",
                Title: "Blue Heart"
            }, {
                Emoji: "&#x1F49A",
                Title: "Green Heart"
            }, {
                Emoji: "&#x1F49B",
                Title: "Yellow Heart"
            }, {
                Emoji: "&#x1F49C",
                Title: "Purple Heart"
            }, {
                Emoji: "&#x1F5A4",
                Title: "Black Heart"
            }, {
                Emoji: "&#x1F49D",
                Title: "Heart With Ribbon"
            }, {
                Emoji: "&#x1F49E",
                Title: "Revolving Hearts"
            }, {
                Emoji: "&#x1F49F",
                Title: "Heart Decoration"
            }, {
                Emoji: "&#x2763",
                Title: "Heavy Heart Exclamation"
            }, {
                Emoji: "&#x1F48C",
                Title: "Love Letter"
            }, {
                Emoji: "&#x1F4A4",
                Title: "Zzz"
            }, {
                Emoji: "&#x1F4A2",
                Title: "Anger Symbol"
            }, {
                Emoji: "&#x1F4A3",
                Title: "Bomb"
            }, {
                Emoji: "&#x1F4A5",
                Title: "Collision"
            }, {
                Emoji: "&#x1F4A6",
                Title: "Sweat Droplets"
            }, {
                Emoji: "&#x1F4A8",
                Title: "Dashing Away"
            }, {
                Emoji: "&#x1F4AB",
                Title: "Dizzy"
            }, {
                Emoji: "&#x1F4AC",
                Title: "Speech Balloon"
            }, {
                Emoji: "&#x1F5E8",
                Title: "Left Speech Bubble"
            }, {
                Emoji: "&#x1F5EF",
                Title: "Right Anger Bubble"
            }, {
                Emoji: "&#x1F4AD",
                Title: "Thought Balloon"
            }, {
                Emoji: "&#x1F573",
                Title: "Hole"
            }, {
                Emoji: "&#x1F453",
                Title: "Glasses"
            }, {
                Emoji: "&#x1F576",
                Title: "Sunglasses"
            }, {
                Emoji: "&#x1F454",
                Title: "Necktie"
            }, {
                Emoji: "&#x1F455",
                Title: "T-Shirt"
            }, {
                Emoji: "&#x1F456",
                Title: "Jeans"
            }, {
                Emoji: "&#x1F457",
                Title: "Dress"
            }, {
                Emoji: "&#x1F458",
                Title: "Kimono"
            }, {
                Emoji: "&#x1F459",
                Title: "Bikini"
            }, {
                Emoji: "&#x1F45A",
                Title: "Woman’s Clothes"
            }, {
                Emoji: "&#x1F45B",
                Title: "Purse"
            }, {
                Emoji: "&#x1F45C",
                Title: "Handbag"
            }, {
                Emoji: "&#x1F45D",
                Title: "Clutch Bag"
            }, {
                Emoji: "&#x1F6CD",
                Title: "Shopping Bags"
            }, {
                Emoji: "&#x1F392",
                Title: "School Backpack"
            }, {
                Emoji: "&#x1F45E",
                Title: "Man’s Shoe"
            }, {
                Emoji: "&#x1F45F",
                Title: "Running Shoe"
            }, {
                Emoji: "&#x1F460",
                Title: "High-Heeled Shoe"
            }, {
                Emoji: "&#x1F461",
                Title: "Woman’s Sandal"
            }, {
                Emoji: "&#x1F462",
                Title: "Woman’s Boot"
            }, {
                Emoji: "&#x1F451",
                Title: "Crown"
            }, {
                Emoji: "&#x1F452",
                Title: "Woman’s Hat"
            }, {
                Emoji: "&#x1F3A9",
                Title: "Top Hat"
            }, {
                Emoji: "&#x1F393",
                Title: "Graduation Cap"
            }, {
                Emoji: "&#x26D1",
                Title: "Rescue Worker’s Helmet"
            }, {
                Emoji: "&#x1F4FF",
                Title: "Prayer Beads"
            }, {
                Emoji: "&#x1F484",
                Title: "Lipstick"
            }, {
                Emoji: "&#x1F48D",
                Title: "Ring"
            }, {
                Emoji: "&#x1F48E",
                Title: "Gem Stone"
            }, {
                Emoji: "&#x1F435",
                Title: "Monkey Face"
            }, {
                Emoji: "&#x1F412",
                Title: "Monkey"
            }, {
                Emoji: "&#x1F98D",
                Title: "Gorilla"
            }, {
                Emoji: "&#x1F436",
                Title: "Dog Face"
            }, {
                Emoji: "&#x1F415",
                Title: "Dog"
            }, {
                Emoji: "&#x1F429",
                Title: "Poodle"
            }, {
                Emoji: "&#x1F43A",
                Title: "Wolf Face"
            }, {
                Emoji: "&#x1F98A",
                Title: "Fox Face"
            }, {
                Emoji: "&#x1F431",
                Title: "Cat Face"
            }, {
                Emoji: "&#x1F408",
                Title: "Cat"
            }, {
                Emoji: "&#x1F981",
                Title: "Lion Face"
            }, {
                Emoji: "&#x1F42F",
                Title: "Tiger Face"
            }, {
                Emoji: "&#x1F405",
                Title: "Tiger"
            }, {
                Emoji: "&#x1F406",
                Title: "Leopard"
            }, {
                Emoji: "&#x1F434",
                Title: "Horse Face"
            }, {
                Emoji: "&#x1F40E",
                Title: "Horse"
            }, {
                Emoji: "&#x1F98C",
                Title: "Deer"
            }, {
                Emoji: "&#x1F984",
                Title: "Unicorn Face"
            }, {
                Emoji: "&#x1F42E",
                Title: "Cow Face"
            }, {
                Emoji: "&#x1F402",
                Title: "Ox"
            }, {
                Emoji: "&#x1F403",
                Title: "Water Buffalo"
            }, {
                Emoji: "&#x1F404",
                Title: "Cow"
            }, {
                Emoji: "&#x1F437",
                Title: "Pig Face"
            }, {
                Emoji: "&#x1F416",
                Title: "Pig"
            }, {
                Emoji: "&#x1F417",
                Title: "Boar"
            }, {
                Emoji: "&#x1F43D",
                Title: "Pig Nose"
            }, {
                Emoji: "&#x1F40F",
                Title: "Ram"
            }, {
                Emoji: "&#x1F411",
                Title: "Sheep"
            }, {
                Emoji: "&#x1F410",
                Title: "Goat"
            }, {
                Emoji: "&#x1F42A",
                Title: "Camel"
            }, {
                Emoji: "&#x1F42B",
                Title: "Two-Hump Camel"
            }, {
                Emoji: "&#x1F418",
                Title: "Elephant"
            }, {
                Emoji: "&#x1F98F",
                Title: "Rhinoceros"
            }, {
                Emoji: "&#x1F42D",
                Title: "Mouse Face"
            }, {
                Emoji: "&#x1F401",
                Title: "Mouse"
            }, {
                Emoji: "&#x1F400",
                Title: "Rat"
            }, {
                Emoji: "&#x1F439",
                Title: "Hamster Face"
            }, {
                Emoji: "&#x1F430",
                Title: "Rabbit Face"
            }, {
                Emoji: "&#x1F407",
                Title: "Rabbit"
            }, {
                Emoji: "&#x1F43F",
                Title: "Chipmunk"
            }, {
                Emoji: "&#x1F987",
                Title: "Bat"
            }, {
                Emoji: "&#x1F43B",
                Title: "Bear Face"
            }, {
                Emoji: "&#x1F428",
                Title: "Koala"
            }, {
                Emoji: "&#x1F43C",
                Title: "Panda Face"
            }, {
                Emoji: "&#x1F43E",
                Title: "Paw Prints"
            }, {
                Emoji: "&#x1F983",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F414",
                Title: "Chicken"
            }, {
                Emoji: "&#x1F413",
                Title: "Rooster"
            }, {
                Emoji: "&#x1F423",
                Title: "Hatching Chick"
            }, {
                Emoji: "&#x1F424",
                Title: "Baby Chick"
            }, {
                Emoji: "&#x1F425",
                Title: "Front-Facing Baby Chick"
            }, {
                Emoji: "&#x1F426",
                Title: "Bird"
            }, {
                Emoji: "&#x1F427",
                Title: "Penguin"
            }, {
                Emoji: "&#x1F54A",
                Title: "Dove"
            }, {
                Emoji: "&#x1F985",
                Title: "Eagle"
            }, {
                Emoji: "&#x1F986",
                Title: "Duck"
            }, {
                Emoji: "&#x1F989",
                Title: "Owl"
            }, {
                Emoji: "&#x1F438",
                Title: "Frog Face"
            }, {
                Emoji: "&#x1F40A",
                Title: "Crocodile"
            }, {
                Emoji: "&#x1F422",
                Title: "Turtle"
            }, {
                Emoji: "&#x1F98E",
                Title: "Lizard"
            }, {
                Emoji: "&#x1F40D",
                Title: "Snake"
            }, {
                Emoji: "&#x1F432",
                Title: "Dragon Face"
            }, {
                Emoji: "&#x1F409",
                Title: "Dragon"
            }, {
                Emoji: "&#x1F433",
                Title: "Spouting Whale"
            }, {
                Emoji: "&#x1F40B",
                Title: "Whale"
            }, {
                Emoji: "&#x1F42C",
                Title: "Dolphin"
            }, {
                Emoji: "&#x1F41F",
                Title: "Fish"
            }, {
                Emoji: "&#x1F420",
                Title: "Tropical Fish"
            }, {
                Emoji: "&#x1F421",
                Title: "Blowfish"
            }, {
                Emoji: "&#x1F988",
                Title: "Shark"
            }, {
                Emoji: "&#x1F419",
                Title: "Octopus"
            }, {
                Emoji: "&#x1F41A",
                Title: "Spiral Shell"
            }, {
                Emoji: "&#x1F980",
                Title: "Crab"
            }, {
                Emoji: "&#x1F990",
                Title: "Shrimp"
            }, {
                Emoji: "&#x1F991",
                Title: "Squid"
            }, {
                Emoji: "&#x1F98B",
                Title: "Butterfly"
            }, {
                Emoji: "&#x1F40C",
                Title: "Snail"
            }, {
                Emoji: "&#x1F41B",
                Title: "Bug"
            }, {
                Emoji: "&#x1F41C",
                Title: "Ant"
            }, {
                Emoji: "&#x1F41D",
                Title: "Honeybee"
            }, {
                Emoji: "&#x1F41E",
                Title: "Lady Beetle"
            }, {
                Emoji: "&#x1F577",
                Title: "Spider"
            }, {
                Emoji: "&#x1F578",
                Title: "Spider Web"
            }, {
                Emoji: "&#x1F982",
                Title: "Scorpion"
            }, {
                Emoji: "&#x1F490",
                Title: "Bouquet"
            }, {
                Emoji: "&#x1F338",
                Title: "Cherry Blossom"
            }, {
                Emoji: "&#x1F4AE",
                Title: "White Flower"
            }, {
                Emoji: "&#x1F3F5",
                Title: "Rosette"
            }, {
                Emoji: "&#x1F339",
                Title: "Rose"
            }, {
                Emoji: "&#x1F940",
                Title: "Wilted Flower"
            }, {
                Emoji: "&#x1F33A",
                Title: "Hibiscus"
            }, {
                Emoji: "&#x1F33B",
                Title: "Sunflower"
            }, {
                Emoji: "&#x1F33C",
                Title: "Blossom"
            }, {
                Emoji: "&#x1F337",
                Title: "Tulip"
            }, {
                Emoji: "&#x1F331",
                Title: "Seedling"
            }, {
                Emoji: "&#x1F332",
                Title: "Evergreen Tree"
            }, {
                Emoji: "&#x1F333",
                Title: "Deciduous Tree"
            }, {
                Emoji: "&#x1F334",
                Title: "Palm Tree"
            }, {
                Emoji: "&#x1F335",
                Title: "Cactus"
            }, {
                Emoji: "&#x1F33E",
                Title: "Sheaf Of Rice"
            }, {
                Emoji: "&#x1F33F",
                Title: "Herb"
            }, {
                Emoji: "&#x2618",
                Title: "Shamrock"
            }, {
                Emoji: "&#x1F340",
                Title: "Four Leaf Clover"
            }, {
                Emoji: "&#x1F341",
                Title: "Maple Leaf"
            }, {
                Emoji: "&#x1F342",
                Title: "Fallen Leaf"
            }, {
                Emoji: "&#x1F343",
                Title: "Leaf Fluttering In Wind"
            }, {
                Emoji: "&#x1F347",
                Title: "Grapes"
            }, {
                Emoji: "&#x1F348",
                Title: "Melon"
            }, {
                Emoji: "&#x1F349",
                Title: "Watermelon"
            }, {
                Emoji: "&#x1F34A",
                Title: "Tangerine"
            }, {
                Emoji: "&#x1F34B",
                Title: "Lemon"
            }, {
                Emoji: "&#x1F34C",
                Title: "Banana"
            }, {
                Emoji: "&#x1F34D",
                Title: "Pineapple"
            }, {
                Emoji: "&#x1F34E",
                Title: "Red Apple"
            }, {
                Emoji: "&#x1F34F",
                Title: "Green Apple"
            }, {
                Emoji: "&#x1F350",
                Title: "Pear"
            }, {
                Emoji: "&#x1F351",
                Title: "Peach"
            }, {
                Emoji: "&#x1F352",
                Title: "Cherries"
            }, {
                Emoji: "&#x1F353",
                Title: "Strawberry"
            }, {
                Emoji: "&#x1F95D",
                Title: "Kiwi Fruit"
            }, {
                Emoji: "&#x1F345",
                Title: "Tomato"
            }, {
                Emoji: "&#x1F951",
                Title: "Avocado"
            }, {
                Emoji: "&#x1F346",
                Title: "Eggplant"
            }, {
                Emoji: "&#x1F954",
                Title: "Potato"
            }, {
                Emoji: "&#x1F955",
                Title: "Carrot"
            }, {
                Emoji: "&#x1F33D",
                Title: "Ear Of Corn"
            }, {
                Emoji: "&#x1F336",
                Title: "Hot Pepper"
            }, {
                Emoji: "&#x1F952",
                Title: "Cucumber"
            }, {
                Emoji: "&#x1F344",
                Title: "Mushroom"
            }, {
                Emoji: "&#x1F95C",
                Title: "Peanuts"
            }, {
                Emoji: "&#x1F330",
                Title: "Chestnut"
            }, {
                Emoji: "&#x1F35E",
                Title: "Bread"
            }, {
                Emoji: "&#x1F950",
                Title: "Croissant"
            }, {
                Emoji: "&#x1F956",
                Title: "Baguette Bread"
            }, {
                Emoji: "&#x1F95E",
                Title: "Pancakes"
            }, {
                Emoji: "&#x1F9C0",
                Title: "Cheese Wedge"
            }, {
                Emoji: "&#x1F356",
                Title: "Meat On Bone"
            }, {
                Emoji: "&#x1F357",
                Title: "Poultry Leg"
            }, {
                Emoji: "&#x1F953",
                Title: "Bacon"
            }, {
                Emoji: "&#x1F354",
                Title: "Hamburger"
            }, {
                Emoji: "&#x1F35F",
                Title: "French Fries"
            }, {
                Emoji: "&#x1F355",
                Title: "Pizza"
            }, {
                Emoji: "&#x1F32D",
                Title: "Hot Dog"
            }, {
                Emoji: "&#x1F32E",
                Title: "Taco"
            }, {
                Emoji: "&#x1F32F",
                Title: "Burrito"
            }, {
                Emoji: "&#x1F959",
                Title: "Stuffed Flatbread"
            }, {
                Emoji: "&#x1F95A",
                Title: "Egg"
            }, {
                Emoji: "&#x1F373",
                Title: "Cooking"
            }, {
                Emoji: "&#x1F958",
                Title: "Shallow Pan Of Food"
            }, {
                Emoji: "&#x1F372",
                Title: "Pot Of Food"
            }, {
                Emoji: "&#x1F957",
                Title: "Green Salad"
            }, {
                Emoji: "&#x1F37F",
                Title: "Popcorn"
            }, {
                Emoji: "&#x1F371",
                Title: "Bento Box"
            }, {
                Emoji: "&#x1F358",
                Title: "Rice Cracker"
            }, {
                Emoji: "&#x1F359",
                Title: "Rice Ball"
            }, {
                Emoji: "&#x1F35A",
                Title: "Cooked Rice"
            }, {
                Emoji: "&#x1F35B",
                Title: "Curry Rice"
            }, {
                Emoji: "&#x1F35C",
                Title: "Steaming Bowl"
            }, {
                Emoji: "&#x1F35D",
                Title: "Spaghetti"
            }, {
                Emoji: "&#x1F360",
                Title: "Roasted Sweet Potato"
            }, {
                Emoji: "&#x1F362",
                Title: "Oden"
            }, {
                Emoji: "&#x1F363",
                Title: "Sushi"
            }, {
                Emoji: "&#x1F364",
                Title: "Fried Shrimp"
            }, {
                Emoji: "&#x1F365",
                Title: "Fish Cake With Swirl"
            }, {
                Emoji: "&#x1F361",
                Title: "Dango"
            }, {
                Emoji: "&#x1F366",
                Title: "Soft Ice Cream"
            }, {
                Emoji: "&#x1F367",
                Title: "Shaved Ice"
            }, {
                Emoji: "&#x1F368",
                Title: "Ice Cream"
            }, {
                Emoji: "&#x1F369",
                Title: "Doughnut"
            }, {
                Emoji: "&#x1F36A",
                Title: "Cookie"
            }, {
                Emoji: "&#x1F382",
                Title: "Birthday Cake"
            }, {
                Emoji: "&#x1F370",
                Title: "Shortcake"
            }, {
                Emoji: "&#x1F36B",
                Title: "Chocolate Bar"
            }, {
                Emoji: "&#x1F36C",
                Title: "Candy"
            }, {
                Emoji: "&#x1F36D",
                Title: "Lollipop"
            }, {
                Emoji: "&#x1F36E",
                Title: "Custard"
            }, {
                Emoji: "&#x1F36F",
                Title: "Honey Pot"
            }, {
                Emoji: "&#x1F37C",
                Title: "Baby Bottle"
            }, {
                Emoji: "&#x1F95B",
                Title: "Glass Of Milk"
            }, {
                Emoji: "&#x2615",
                Title: "Hot Beverage"
            }, {
                Emoji: "&#x1F375",
                Title: "Teacup Without Handle"
            }, {
                Emoji: "&#x1F376",
                Title: "Sake"
            }, {
                Emoji: "&#x1F37E",
                Title: "Bottle With Popping Cork"
            }, {
                Emoji: "&#x1F377",
                Title: "Wine Glass"
            }, {
                Emoji: "&#x1F378",
                Title: "Cocktail Glass"
            }, {
                Emoji: "&#x1F379",
                Title: "Tropical Drink"
            }, {
                Emoji: "&#x1F37A",
                Title: "Beer Mug"
            }, {
                Emoji: "&#x1F37B",
                Title: "Clinking Beer Mugs"
            }, {
                Emoji: "&#x1F942",
                Title: "Clinking Glasses"
            }, {
                Emoji: "&#x1F943",
                Title: "Tumbler Glass"
            }, {
                Emoji: "&#x1F37D",
                Title: "Fork And Knife With Plate"
            }, {
                Emoji: "&#x1F374",
                Title: "Fork And Knife"
            }, {
                Emoji: "&#x1F944",
                Title: "Spoon"
            }, {
                Emoji: "&#x1F52A",
                Title: "Kitchen Knife"
            }, {
                Emoji: "&#x1F3FA",
                Title: "Amphora"
            }, {
                Emoji: "&#x1F30D",
                Title: "Globe Showing Europe-Africa"
            }, {
                Emoji: "&#x1F30E",
                Title: "Globe Showing Americas"
            }, {
                Emoji: "&#x1F30F",
                Title: "Globe Showing Asia-Australia"
            }, {
                Emoji: "&#x1F310",
                Title: "Globe With Meridians"
            }, {
                Emoji: "&#x1F5FA",
                Title: "World Map"
            }, {
                Emoji: "&#x1F5FE",
                Title: "Map Of Japan"
            }, {
                Emoji: "&#x1F3D4",
                Title: "Snow-Capped Mountain"
            }, {
                Emoji: "&#x26F0",
                Title: "Mountain"
            }, {
                Emoji: "&#x1F30B",
                Title: "Volcano"
            }, {
                Emoji: "&#x1F5FB",
                Title: "Mount Fuji"
            }, {
                Emoji: "&#x1F3D5",
                Title: "Camping"
            }, {
                Emoji: "&#x1F3D6",
                Title: "Beach With Umbrella"
            }, {
                Emoji: "&#x1F3DC",
                Title: "Desert"
            }, {
                Emoji: "&#x1F3DD",
                Title: "Desert Island"
            }, {
                Emoji: "&#x1F3DE",
                Title: "National Park"
            }, {
                Emoji: "&#x1F3DF",
                Title: "Stadium"
            }, {
                Emoji: "&#x1F3DB",
                Title: "Classical Building"
            }, {
                Emoji: "&#x1F3D7",
                Title: "Building Construction"
            }, {
                Emoji: "&#x1F3D8",
                Title: "House"
            }, {
                Emoji: "&#x1F3D9",
                Title: "Cityscape"
            }, {
                Emoji: "&#x1F3DA",
                Title: "Derelict House"
            }, {
                Emoji: "&#x1F3E0",
                Title: "House"
            }, {
                Emoji: "&#x1F3E1",
                Title: "House With Garden"
            }, {
                Emoji: "&#x1F3E2",
                Title: "Office Building"
            }, {
                Emoji: "&#x1F3E3",
                Title: "Japanese Post Office"
            }, {
                Emoji: "&#x1F3E4",
                Title: "Post Office"
            }, {
                Emoji: "&#x1F3E5",
                Title: "Hospital"
            }, {
                Emoji: "&#x1F3E6",
                Title: "Bank"
            }, {
                Emoji: "&#x1F3E8",
                Title: "Hotel"
            }, {
                Emoji: "&#x1F3E9",
                Title: "Love Hotel"
            }, {
                Emoji: "&#x1F3EA",
                Title: "Convenience Store"
            }, {
                Emoji: "&#x1F3EB",
                Title: "School"
            }, {
                Emoji: "&#x1F3EC",
                Title: "Department Store"
            }, {
                Emoji: "&#x1F3ED",
                Title: "Factory"
            }, {
                Emoji: "&#x1F3EF",
                Title: "Japanese Castle"
            }, {
                Emoji: "&#x1F3F0",
                Title: "Castle"
            }, {
                Emoji: "&#x1F492",
                Title: "Wedding"
            }, {
                Emoji: "&#x1F5FC",
                Title: "Tokyo Tower"
            }, {
                Emoji: "&#x1F5FD",
                Title: "Statue Of Liberty"
            }, {
                Emoji: "&#x26EA",
                Title: "Church"
            }, {
                Emoji: "&#x1F54C",
                Title: "Mosque"
            }, {
                Emoji: "&#x1F54D",
                Title: "Synagogue"
            }, {
                Emoji: "&#x26E9",
                Title: "Shinto Shrine"
            }, {
                Emoji: "&#x1F54B",
                Title: "Kaaba"
            }, {
                Emoji: "&#x26F2",
                Title: "Fountain"
            }, {
                Emoji: "&#x26FA",
                Title: "Tent"
            }, {
                Emoji: "&#x1F301",
                Title: "Foggy"
            }, {
                Emoji: "&#x1F303",
                Title: "Night With Stars"
            }, {
                Emoji: "&#x1F304",
                Title: "Sunrise Over Mountains"
            }, {
                Emoji: "&#x1F305",
                Title: "Sunrise"
            }, {
                Emoji: "&#x1F306",
                Title: "Cityscape At Dusk"
            }, {
                Emoji: "&#x1F307",
                Title: "Sunset"
            }, {
                Emoji: "&#x1F309",
                Title: "Bridge At Night"
            }, {
                Emoji: "&#x2668",
                Title: "Hot Springs"
            }, {
                Emoji: "&#x1F30C",
                Title: "Milky Way"
            }, {
                Emoji: "&#x1F3A0",
                Title: "Carousel Horse"
            }, {
                Emoji: "&#x1F3A1",
                Title: "Ferris Wheel"
            }, {
                Emoji: "&#x1F3A2",
                Title: "Roller Coaster"
            }, {
                Emoji: "&#x1F488",
                Title: "Barber Pole"
            }, {
                Emoji: "&#x1F3AA",
                Title: "Circus Tent"
            }, {
                Emoji: "&#x1F3AD",
                Title: "Performing Arts"
            }, {
                Emoji: "&#x1F5BC",
                Title: "Framed Picture"
            }, {
                Emoji: "&#x1F3A8",
                Title: "Artist Palette"
            }, {
                Emoji: "&#x1F3B0",
                Title: "Slot Machine"
            }, {
                Emoji: "&#x1F682",
                Title: "Locomotive"
            }, {
                Emoji: "&#x1F683",
                Title: "Railway Car"
            }, {
                Emoji: "&#x1F684",
                Title: "High-Speed Train"
            }, {
                Emoji: "&#x1F685",
                Title: "High-Speed Train With Bullet Nose"
            }, {
                Emoji: "&#x1F686",
                Title: "Train"
            }, {
                Emoji: "&#x1F687",
                Title: "Metro"
            }, {
                Emoji: "&#x1F688",
                Title: "Light Rail"
            }, {
                Emoji: "&#x1F689",
                Title: "Station"
            }, {
                Emoji: "&#x1F68A",
                Title: "Tram"
            }, {
                Emoji: "&#x1F69D",
                Title: "Monorail"
            }, {
                Emoji: "&#x1F69E",
                Title: "Mountain Railway"
            }, {
                Emoji: "&#x1F68B",
                Title: "Tram Car"
            }, {
                Emoji: "&#x1F68C",
                Title: "Bus"
            }, {
                Emoji: "&#x1F68D",
                Title: "Oncoming Bus"
            }, {
                Emoji: "&#x1F68E",
                Title: "Trolleybus"
            }, {
                Emoji: "&#x1F690",
                Title: "Minibus"
            }, {
                Emoji: "&#x1F691",
                Title: "Ambulance"
            }, {
                Emoji: "&#x1F692",
                Title: "Fire Engine"
            }, {
                Emoji: "&#x1F693",
                Title: "Police Car"
            }, {
                Emoji: "&#x1F694",
                Title: "Oncoming Police Car"
            }, {
                Emoji: "&#x1F695",
                Title: "Taxi"
            }, {
                Emoji: "&#x1F696",
                Title: "Oncoming Taxi"
            }, {
                Emoji: "&#x1F697",
                Title: "Automobile"
            }, {
                Emoji: "&#x1F698",
                Title: "Oncoming Automobile"
            }, {
                Emoji: "&#x1F699",
                Title: "Sport Utility Vehicle"
            }, {
                Emoji: "&#x1F69A",
                Title: "Delivery Truck"
            }, {
                Emoji: "&#x1F69B",
                Title: "Articulated Lorry"
            }, {
                Emoji: "&#x1F69C",
                Title: "Tractor"
            }, {
                Emoji: "&#x1F6B2",
                Title: "Bicycle"
            }, {
                Emoji: "&#x1F6F4",
                Title: "Kick Scooter"
            }, {
                Emoji: "&#x1F6F5",
                Title: "Motor Scooter"
            }, {
                Emoji: "&#x1F68F",
                Title: "Bus Stop"
            }, {
                Emoji: "&#x1F6E3",
                Title: "Motorway"
            }, {
                Emoji: "&#x1F6E4",
                Title: "Railway Track"
            }, {
                Emoji: "&#x26FD",
                Title: "Fuel Pump"
            }, {
                Emoji: "&#x1F6A8",
                Title: "Police Car Light"
            }, {
                Emoji: "&#x1F6A5",
                Title: "Horizontal Traffic Light"
            }, {
                Emoji: "&#x1F6A6",
                Title: "Vertical Traffic Light"
            }, {
                Emoji: "&#x1F6A7",
                Title: "Construction"
            }, {
                Emoji: "&#x1F6D1",
                Title: "Stop Sign"
            }, {
                Emoji: "&#x2693",
                Title: "Anchor"
            }, {
                Emoji: "&#x26F5",
                Title: "Sailboat"
            }, {
                Emoji: "&#x1F6F6",
                Title: "Canoe"
            }, {
                Emoji: "&#x1F6A4",
                Title: "Speedboat"
            }, {
                Emoji: "&#x1F6F3",
                Title: "Passenger Ship"
            }, {
                Emoji: "&#x26F4",
                Title: "Ferry"
            }, {
                Emoji: "&#x1F6E5",
                Title: "Motor Boat"
            }, {
                Emoji: "&#x1F6A2",
                Title: "Ship"
            }, {
                Emoji: "&#x2708",
                Title: "Airplane"
            }, {
                Emoji: "&#x1F6E9",
                Title: "Small Airplane"
            }, {
                Emoji: "&#x1F6EB",
                Title: "Airplane Departure"
            }, {
                Emoji: "&#x1F6EC",
                Title: "Airplane Arrival"
            }, {
                Emoji: "&#x1F4BA",
                Title: "Seat"
            }, {
                Emoji: "&#x1F681",
                Title: "Helicopter"
            }, {
                Emoji: "&#x1F69F",
                Title: "Suspension Railway"
            }, {
                Emoji: "&#x1F6A0",
                Title: "Mountain Cableway"
            }, {
                Emoji: "&#x1F6A1",
                Title: "Aerial Tramway"
            }, {
                Emoji: "&#x1F680",
                Title: "Rocket"
            }, {
                Emoji: "&#x1F6F0",
                Title: "Satellite"
            }, {
                Emoji: "&#x1F6CE",
                Title: "Bellhop Bell"
            }, {
                Emoji: "&#x1F6AA",
                Title: "Door"
            }, {
                Emoji: "&#x1F6CC",
                Title: "Person In Bed"
            }, {
                Emoji: "&#x1F6CC&#x1F3FB",
                Title: "Person In Bed: Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FC",
                Title: "Person In Bed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FD",
                Title: "Person In Bed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FE",
                Title: "Person In Bed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FF",
                Title: "Person In Bed: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CF",
                Title: "Bed"
            }, {
                Emoji: "&#x1F6CB",
                Title: "Couch And Lamp"
            }, {
                Emoji: "&#x1F6BD",
                Title: "Toilet"
            }, {
                Emoji: "&#x1F6BF",
                Title: "Shower"
            }, {
                Emoji: "&#x1F6C0",
                Title: "Person Taking Bath"
            }, {
                Emoji: "&#x1F6C0&#x1F3FB",
                Title: "Person Taking Bath: Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FC",
                Title: "Person Taking Bath: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FD",
                Title: "Person Taking Bath: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FE",
                Title: "Person Taking Bath: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FF",
                Title: "Person Taking Bath: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C1",
                Title: "Bathtub"
            }, {
                Emoji: "&#x231B",
                Title: "Hourglass"
            }, {
                Emoji: "&#x23F3",
                Title: "Hourglass With Flowing Sand"
            }, {
                Emoji: "&#x231A",
                Title: "Watch"
            }, {
                Emoji: "&#x23F0",
                Title: "Alarm Clock"
            }, {
                Emoji: "&#x23F1",
                Title: "Stopwatch"
            }, {
                Emoji: "&#x23F2",
                Title: "Timer Clock"
            }, {
                Emoji: "&#x1F570",
                Title: "Mantelpiece Clock"
            }, {
                Emoji: "&#x1F55B",
                Title: "Twelve O’clock"
            }, {
                Emoji: "&#x1F567",
                Title: "Twelve-Thirty"
            }, {
                Emoji: "&#x1F550",
                Title: "One O’clock"
            }, {
                Emoji: "&#x1F55C",
                Title: "One-Thirty"
            }, {
                Emoji: "&#x1F551",
                Title: "Two O’clock"
            }, {
                Emoji: "&#x1F55D",
                Title: "Two-Thirty"
            }, {
                Emoji: "&#x1F552",
                Title: "Three O’clock"
            }, {
                Emoji: "&#x1F55E",
                Title: "Three-Thirty"
            }, {
                Emoji: "&#x1F553",
                Title: "Four O’clock"
            }, {
                Emoji: "&#x1F55F",
                Title: "Four-Thirty"
            }, {
                Emoji: "&#x1F554",
                Title: "Five O’clock"
            }, {
                Emoji: "&#x1F560",
                Title: "Five-Thirty"
            }, {
                Emoji: "&#x1F555",
                Title: "Six O’clock"
            }, {
                Emoji: "&#x1F561",
                Title: "Six-Thirty"
            }, {
                Emoji: "&#x1F556",
                Title: "Seven O’clock"
            }, {
                Emoji: "&#x1F562",
                Title: "Seven-Thirty"
            }, {
                Emoji: "&#x1F557",
                Title: "Eight O’clock"
            }, {
                Emoji: "&#x1F563",
                Title: "Eight-Thirty"
            }, {
                Emoji: "&#x1F558",
                Title: "Nine O’clock"
            }, {
                Emoji: "&#x1F564",
                Title: "Nine-Thirty"
            }, {
                Emoji: "&#x1F559",
                Title: "Ten O’clock"
            }, {
                Emoji: "&#x1F565",
                Title: "Ten-Thirty"
            }, {
                Emoji: "&#x1F55A",
                Title: "Eleven O’clock"
            }, {
                Emoji: "&#x1F566",
                Title: "Eleven-Thirty"
            }, {
                Emoji: "&#x1F311",
                Title: "New Moon"
            }, {
                Emoji: "&#x1F312",
                Title: "Waxing Crescent Moon"
            }, {
                Emoji: "&#x1F313",
                Title: "First Quarter Moon"
            }, {
                Emoji: "&#x1F314",
                Title: "Waxing Gibbous Moon"
            }, {
                Emoji: "&#x1F315",
                Title: "Full Moon"
            }, {
                Emoji: "&#x1F316",
                Title: "Waning Gibbous Moon"
            }, {
                Emoji: "&#x1F317",
                Title: "Last Quarter Moon"
            }, {
                Emoji: "&#x1F318",
                Title: "Waning Crescent Moon"
            }, {
                Emoji: "&#x1F319",
                Title: "Crescent Moon"
            }, {
                Emoji: "&#x1F31A",
                Title: "New Moon Face"
            }, {
                Emoji: "&#x1F31B",
                Title: "First Quarter Moon With Face"
            }, {
                Emoji: "&#x1F31C",
                Title: "Last Quarter Moon With Face"
            }, {
                Emoji: "&#x1F321",
                Title: "Thermometer"
            }, {
                Emoji: "&#x2600",
                Title: "Sun"
            }, {
                Emoji: "&#x1F31D",
                Title: "Full Moon With Face"
            }, {
                Emoji: "&#x1F31E",
                Title: "Sun With Face"
            }, {
                Emoji: "&#x2B50",
                Title: "White Medium Star"
            }, {
                Emoji: "&#x1F31F",
                Title: "Glowing Star"
            }, {
                Emoji: "&#x1F320",
                Title: "Shooting Star"
            }, {
                Emoji: "&#x2601",
                Title: "Cloud"
            }, {
                Emoji: "&#x26C5",
                Title: "Sun Behind Cloud"
            }, {
                Emoji: "&#x26C8",
                Title: "Cloud With Lightning And Rain"
            }, {
                Emoji: "&#x1F324",
                Title: "Sun Behind Small Cloud"
            }, {
                Emoji: "&#x1F325",
                Title: "Sun Behind Large Cloud"
            }, {
                Emoji: "&#x1F326",
                Title: "Sun Behind Rain Cloud"
            }, {
                Emoji: "&#x1F327",
                Title: "Cloud With Rain"
            }, {
                Emoji: "&#x1F328",
                Title: "Cloud With Snow"
            }, {
                Emoji: "&#x1F329",
                Title: "Cloud With Lightning"
            }, {
                Emoji: "&#x1F32A",
                Title: "Tornado"
            }, {
                Emoji: "&#x1F32B",
                Title: "Fog"
            }, {
                Emoji: "&#x1F32C",
                Title: "Wind Face"
            }, {
                Emoji: "&#x1F300",
                Title: "Cyclone"
            }, {
                Emoji: "&#x1F308",
                Title: "Rainbow"
            }, {
                Emoji: "&#x1F302",
                Title: "Closed Umbrella"
            }, {
                Emoji: "&#x2602",
                Title: "Umbrella"
            }, {
                Emoji: "&#x2614",
                Title: "Umbrella With Rain Drops"
            }, {
                Emoji: "&#x26F1",
                Title: "Umbrella On Ground"
            }, {
                Emoji: "&#x26A1",
                Title: "High Voltage"
            }, {
                Emoji: "&#x2744",
                Title: "Snowflake"
            }, {
                Emoji: "&#x2603",
                Title: "Snowman"
            }, {
                Emoji: "&#x26C4",
                Title: "Snowman Without Snow"
            }, {
                Emoji: "&#x2604",
                Title: "Comet"
            }, {
                Emoji: "&#x1F525",
                Title: "Fire"
            }, {
                Emoji: "&#x1F4A7",
                Title: "Droplet"
            }, {
                Emoji: "&#x1F30A",
                Title: "Water Wave"
            }, {
                Emoji: "&#x1F383",
                Title: "Jack-O-Lantern"
            }, {
                Emoji: "&#x1F384",
                Title: "Christmas Tree"
            }, {
                Emoji: "&#x1F386",
                Title: "Fireworks"
            }, {
                Emoji: "&#x1F387",
                Title: "Sparkler"
            }, {
                Emoji: "&#x2728",
                Title: "Sparkles"
            }, {
                Emoji: "&#x1F388",
                Title: "Balloon"
            }, {
                Emoji: "&#x1F389",
                Title: "Party Popper"
            }, {
                Emoji: "&#x1F38A",
                Title: "Confetti Ball"
            }, {
                Emoji: "&#x1F38B",
                Title: "Tanabata Tree"
            }, {
                Emoji: "&#x1F38D",
                Title: "Pine Decoration"
            }, {
                Emoji: "&#x1F38E",
                Title: "Japanese Dolls"
            }, {
                Emoji: "&#x1F38F",
                Title: "Carp Streamer"
            }, {
                Emoji: "&#x1F390",
                Title: "Wind Chime"
            }, {
                Emoji: "&#x1F391",
                Title: "Moon Viewing Ceremony"
            }, {
                Emoji: "&#x1F380",
                Title: "Ribbon"
            }, {
                Emoji: "&#x1F381",
                Title: "Wrapped Gift"
            }, {
                Emoji: "&#x1F397",
                Title: "Reminder Ribbon"
            }, {
                Emoji: "&#x1F39F",
                Title: "Admission Tickets"
            }, {
                Emoji: "&#x1F3AB",
                Title: "Ticket"
            }, {
                Emoji: "&#x1F396",
                Title: "Military Medal"
            }, {
                Emoji: "&#x1F3C6",
                Title: "Trophy"
            }, {
                Emoji: "&#x1F3C5",
                Title: "Sports Medal"
            }, {
                Emoji: "&#x1F947",
                Title: "1st Place Medal"
            }, {
                Emoji: "&#x1F948",
                Title: "2nd Place Medal"
            }, {
                Emoji: "&#x1F949",
                Title: "3rd Place Medal"
            }, {
                Emoji: "&#x26BD",
                Title: "Soccer Ball"
            }, {
                Emoji: "&#x26BE",
                Title: "Baseball"
            }, {
                Emoji: "&#x1F3C0",
                Title: "Basketball"
            }, {
                Emoji: "&#x1F3D0",
                Title: "Volleyball"
            }, {
                Emoji: "&#x1F3C8",
                Title: "American Football"
            }, {
                Emoji: "&#x1F3C9",
                Title: "Rugby Football"
            }, {
                Emoji: "&#x1F3BE",
                Title: "Tennis"
            }, {
                Emoji: "&#x1F3B1",
                Title: "Pool 8 Ball"
            }, {
                Emoji: "&#x1F3B3",
                Title: "Bowling"
            }, {
                Emoji: "&#x1F3CF",
                Title: "Cricket"
            }, {
                Emoji: "&#x1F3D1",
                Title: "Field Hockey"
            }, {
                Emoji: "&#x1F3D2",
                Title: "Ice Hockey"
            }, {
                Emoji: "&#x1F3D3",
                Title: "Ping Pong"
            }, {
                Emoji: "&#x1F3F8",
                Title: "Badminton"
            }, {
                Emoji: "&#x1F94A",
                Title: "Boxing Glove"
            }, {
                Emoji: "&#x1F94B",
                Title: "Martial Arts Uniform"
            }, {
                Emoji: "&#x1F945",
                Title: "Goal Net"
            }, {
                Emoji: "&#x1F3AF",
                Title: "Direct Hit"
            }, {
                Emoji: "&#x26F3",
                Title: "Flag In Hole"
            }, {
                Emoji: "&#x26F8",
                Title: "Ice Skate"
            }, {
                Emoji: "&#x1F3A3",
                Title: "Fishing Pole"
            }, {
                Emoji: "&#x1F3BD",
                Title: "Running Shirt"
            }, {
                Emoji: "&#x1F3BF",
                Title: "Skis"
            }, {
                Emoji: "&#x1F3AE",
                Title: "Video Game"
            }, {
                Emoji: "&#x1F579",
                Title: "Joystick"
            }, {
                Emoji: "&#x1F3B2",
                Title: "Game Die"
            }, {
                Emoji: "&#x2660",
                Title: "Spade Suit"
            }, {
                Emoji: "&#x2665",
                Title: "Heart Suit"
            }, {
                Emoji: "&#x2666",
                Title: "Diamond Suit"
            }, {
                Emoji: "&#x2663",
                Title: "Club Suit"
            }, {
                Emoji: "&#x1F0CF",
                Title: "Joker"
            }, {
                Emoji: "&#x1F004",
                Title: "Mahjong Red Dragon"
            }, {
                Emoji: "&#x1F3B4",
                Title: "Flower Playing Cards"
            }, {
                Emoji: "&#x1F507",
                Title: "Muted Speaker"
            }, {
                Emoji: "&#x1F508",
                Title: "Speaker Low Volume"
            }, {
                Emoji: "&#x1F509",
                Title: "Speaker Medium Volume"
            }, {
                Emoji: "&#x1F50A",
                Title: "Speaker High Volume"
            }, {
                Emoji: "&#x1F4E2",
                Title: "Loudspeaker"
            }, {
                Emoji: "&#x1F4E3",
                Title: "Megaphone"
            }, {
                Emoji: "&#x1F4EF",
                Title: "Postal Horn"
            }, {
                Emoji: "&#x1F514",
                Title: "Bell"
            }, {
                Emoji: "&#x1F515",
                Title: "Bell With Slash"
            }, {
                Emoji: "&#x1F3BC",
                Title: "Musical Score"
            }, {
                Emoji: "&#x1F3B5",
                Title: "Musical Note"
            }, {
                Emoji: "&#x1F3B6",
                Title: "Musical Notes"
            }, {
                Emoji: "&#x1F399",
                Title: "Studio Microphone"
            }, {
                Emoji: "&#x1F39A",
                Title: "Level Slider"
            }, {
                Emoji: "&#x1F39B",
                Title: "Control Knobs"
            }, {
                Emoji: "&#x1F3A4",
                Title: "Microphone"
            }, {
                Emoji: "&#x1F3A7",
                Title: "Headphone"
            }, {
                Emoji: "&#x1F4FB",
                Title: "Radio"
            }, {
                Emoji: "&#x1F3B7",
                Title: "Saxophone"
            }, {
                Emoji: "&#x1F3B8",
                Title: "Guitar"
            }, {
                Emoji: "&#x1F3B9",
                Title: "Musical Keyboard"
            }, {
                Emoji: "&#x1F3BA",
                Title: "Trumpet"
            }, {
                Emoji: "&#x1F3BB",
                Title: "Violin"
            }, {
                Emoji: "&#x1F941",
                Title: "Drum"
            }, {
                Emoji: "&#x1F4F1",
                Title: "Mobile Phone"
            }, {
                Emoji: "&#x1F4F2",
                Title: "Mobile Phone With Arrow"
            }, {
                Emoji: "&#x260E",
                Title: "Telephone"
            }, {
                Emoji: "&#x1F4DE",
                Title: "Telephone Receiver"
            }, {
                Emoji: "&#x1F4DF",
                Title: "Pager"
            }, {
                Emoji: "&#x1F4E0",
                Title: "Fax Machine"
            }, {
                Emoji: "&#x1F50B",
                Title: "Battery"
            }, {
                Emoji: "&#x1F50C",
                Title: "Electric Plug"
            }, {
                Emoji: "&#x1F4BB",
                Title: "Laptop Computer"
            }, {
                Emoji: "&#x1F5A5",
                Title: "Desktop Computer"
            }, {
                Emoji: "&#x1F5A8",
                Title: "Printer"
            }, {
                Emoji: "&#x2328",
                Title: "Keyboard"
            }, {
                Emoji: "&#x1F5B1",
                Title: "Computer Mouse"
            }, {
                Emoji: "&#x1F5B2",
                Title: "Trackball"
            }, {
                Emoji: "&#x1F4BD",
                Title: "Computer Disk"
            }, {
                Emoji: "&#x1F4BE",
                Title: "Floppy Disk"
            }, {
                Emoji: "&#x1F4BF",
                Title: "Optical Disk"
            }, {
                Emoji: "&#x1F4C0",
                Title: "Dvd"
            }, {
                Emoji: "&#x1F3A5",
                Title: "Movie Camera"
            }, {
                Emoji: "&#x1F39E",
                Title: "Film Frames"
            }, {
                Emoji: "&#x1F4FD",
                Title: "Film Projector"
            }, {
                Emoji: "&#x1F3AC",
                Title: "Clapper Board"
            }, {
                Emoji: "&#x1F4FA",
                Title: "Television"
            }, {
                Emoji: "&#x1F4F7",
                Title: "Camera"
            }, {
                Emoji: "&#x1F4F8",
                Title: "Camera With Flash"
            }, {
                Emoji: "&#x1F4F9",
                Title: "Video Camera"
            }, {
                Emoji: "&#x1F4FC",
                Title: "Videocassette"
            }, {
                Emoji: "&#x1F50D",
                Title: "Left-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F50E",
                Title: "Right-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F52C",
                Title: "Microscope"
            }, {
                Emoji: "&#x1F52D",
                Title: "Telescope"
            }, {
                Emoji: "&#x1F4E1",
                Title: "Satellite Antenna"
            }, {
                Emoji: "&#x1F56F",
                Title: "Candle"
            }, {
                Emoji: "&#x1F4A1",
                Title: "Light Bulb"
            }, {
                Emoji: "&#x1F526",
                Title: "Flashlight"
            }, {
                Emoji: "&#x1F3EE",
                Title: "Red Paper Lantern"
            }, {
                Emoji: "&#x1F4D4",
                Title: "Notebook With Decorative Cover"
            }, {
                Emoji: "&#x1F4D5",
                Title: "Closed Book"
            }, {
                Emoji: "&#x1F4D6",
                Title: "Open Book"
            }, {
                Emoji: "&#x1F4D7",
                Title: "Green Book"
            }, {
                Emoji: "&#x1F4D8",
                Title: "Blue Book"
            }, {
                Emoji: "&#x1F4D9",
                Title: "Orange Book"
            }, {
                Emoji: "&#x1F4DA",
                Title: "Books"
            }, {
                Emoji: "&#x1F4D3",
                Title: "Notebook"
            }, {
                Emoji: "&#x1F4D2",
                Title: "Ledger"
            }, {
                Emoji: "&#x1F4C3",
                Title: "Page With Curl"
            }, {
                Emoji: "&#x1F4DC",
                Title: "Scroll"
            }, {
                Emoji: "&#x1F4C4",
                Title: "Page Facing Up"
            }, {
                Emoji: "&#x1F4F0",
                Title: "Newspaper"
            }, {
                Emoji: "&#x1F5DE",
                Title: "Rolled-Up Newspaper"
            }, {
                Emoji: "&#x1F4D1",
                Title: "Bookmark Tabs"
            }, {
                Emoji: "&#x1F516",
                Title: "Bookmark"
            }, {
                Emoji: "&#x1F3F7",
                Title: "Label"
            }, {
                Emoji: "&#x1F4B0",
                Title: "Money Bag"
            }, {
                Emoji: "&#x1F4B4",
                Title: "Yen Banknote"
            }, {
                Emoji: "&#x1F4B5",
                Title: "Dollar Banknote"
            }, {
                Emoji: "&#x1F4B6",
                Title: "Euro Banknote"
            }, {
                Emoji: "&#x1F4B7",
                Title: "Pound Banknote"
            }, {
                Emoji: "&#x1F4B8",
                Title: "Money With Wings"
            }, {
                Emoji: "&#x1F4B3",
                Title: "Credit Card"
            }, {
                Emoji: "&#x1F4B9",
                Title: "Chart Increasing With Yen"
            }, {
                Emoji: "&#x1F4B1",
                Title: "Currency Exchange"
            }, {
                Emoji: "&#x1F4B2",
                Title: "Heavy Dollar Sign"
            }, {
                Emoji: "&#x2709",
                Title: "Envelope"
            }, {
                Emoji: "&#x1F4E7",
                Title: "E-Mail"
            }, {
                Emoji: "&#x1F4E8",
                Title: "Incoming Envelope"
            }, {
                Emoji: "&#x1F4E9",
                Title: "Envelope With Arrow"
            }, {
                Emoji: "&#x1F4E4",
                Title: "Outbox Tray"
            }, {
                Emoji: "&#x1F4E5",
                Title: "Inbox Tray"
            }, {
                Emoji: "&#x1F4E6",
                Title: "Package"
            }, {
                Emoji: "&#x1F4EB",
                Title: "Closed Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4EA",
                Title: "Closed Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EC",
                Title: "Open Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4ED",
                Title: "Open Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EE",
                Title: "Postbox"
            }, {
                Emoji: "&#x1F5F3",
                Title: "Ballot Box With Ballot"
            }, {
                Emoji: "&#x270F",
                Title: "Pencil"
            }, {
                Emoji: "&#x2712",
                Title: "Black Nib"
            }, {
                Emoji: "&#x1F58B",
                Title: "Fountain Pen"
            }, {
                Emoji: "&#x1F58A",
                Title: "Pen"
            }, {
                Emoji: "&#x1F58C",
                Title: "Paintbrush"
            }, {
                Emoji: "&#x1F58D",
                Title: "Crayon"
            }, {
                Emoji: "&#x1F4DD",
                Title: "Memo"
            }, {
                Emoji: "&#x1F4BC",
                Title: "Briefcase"
            }, {
                Emoji: "&#x1F4C1",
                Title: "File Folder"
            }, {
                Emoji: "&#x1F4C2",
                Title: "Open File Folder"
            }, {
                Emoji: "&#x1F5C2",
                Title: "Card Index Dividers"
            }, {
                Emoji: "&#x1F4C5",
                Title: "Calendar"
            }, {
                Emoji: "&#x1F4C6",
                Title: "Tear-Off Calendar"
            }, {
                Emoji: "&#x1F5D2",
                Title: "Spiral Notepad"
            }, {
                Emoji: "&#x1F5D3",
                Title: "Spiral Calendar"
            }, {
                Emoji: "&#x1F4C7",
                Title: "Card Index"
            }, {
                Emoji: "&#x1F4C8",
                Title: "Chart Increasing"
            }, {
                Emoji: "&#x1F4C9",
                Title: "Chart Decreasing"
            }, {
                Emoji: "&#x1F4CA",
                Title: "Bar Chart"
            }, {
                Emoji: "&#x1F4CB",
                Title: "Clipboard"
            }, {
                Emoji: "&#x1F4CC",
                Title: "Pushpin"
            }, {
                Emoji: "&#x1F4CD",
                Title: "Round Pushpin"
            }, {
                Emoji: "&#x1F4CE",
                Title: "Paperclip"
            }, {
                Emoji: "&#x1F587",
                Title: "Linked Paperclips"
            }, {
                Emoji: "&#x1F4CF",
                Title: "Straight Ruler"
            }, {
                Emoji: "&#x1F4D0",
                Title: "Triangular Ruler"
            }, {
                Emoji: "&#x2702",
                Title: "Scissors"
            }, {
                Emoji: "&#x1F5C3",
                Title: "Card File Box"
            }, {
                Emoji: "&#x1F5C4",
                Title: "File Cabinet"
            }, {
                Emoji: "&#x1F5D1",
                Title: "Wastebasket"
            }, {
                Emoji: "&#x1F512",
                Title: "Locked"
            }, {
                Emoji: "&#x1F513",
                Title: "Unlocked"
            }, {
                Emoji: "&#x1F50F",
                Title: "Locked With Pen"
            }, {
                Emoji: "&#x1F510",
                Title: "Locked With Key"
            }, {
                Emoji: "&#x1F511",
                Title: "Key"
            }, {
                Emoji: "&#x1F5DD",
                Title: "Old Key"
            }, {
                Emoji: "&#x1F528",
                Title: "Hammer"
            }, {
                Emoji: "&#x26CF",
                Title: "Pick"
            }, {
                Emoji: "&#x2692",
                Title: "Hammer And Pick"
            }, {
                Emoji: "&#x1F6E0",
                Title: "Hammer And Wrench"
            }, {
                Emoji: "&#x1F5E1",
                Title: "Dagger"
            }, {
                Emoji: "&#x2694",
                Title: "Crossed Swords"
            }, {
                Emoji: "&#x1F52B",
                Title: "Pistol"
            }, {
                Emoji: "&#x1F3F9",
                Title: "Bow And Arrow"
            }, {
                Emoji: "&#x1F6E1",
                Title: "Shield"
            }, {
                Emoji: "&#x1F527",
                Title: "Wrench"
            }, {
                Emoji: "&#x1F529",
                Title: "Nut And Bolt"
            }, {
                Emoji: "&#x2699",
                Title: "Gear"
            }, {
                Emoji: "&#x1F5DC",
                Title: "Clamp"
            }, {
                Emoji: "&#x2697",
                Title: "Alembic"
            }, {
                Emoji: "&#x2696",
                Title: "Balance Scale"
            }, {
                Emoji: "&#x1F517",
                Title: "Link"
            }, {
                Emoji: "&#x26D3",
                Title: "Chains"
            }, {
                Emoji: "&#x1F489",
                Title: "Syringe"
            }, {
                Emoji: "&#x1F48A",
                Title: "Pill"
            }, {
                Emoji: "&#x1F6AC",
                Title: "Cigarette"
            }, {
                Emoji: "&#x26B0",
                Title: "Coffin"
            }, {
                Emoji: "&#x26B1",
                Title: "Funeral Urn"
            }, {
                Emoji: "&#x1F5FF",
                Title: "Moai"
            }, {
                Emoji: "&#x1F6E2",
                Title: "Oil Drum"
            }, {
                Emoji: "&#x1F52E",
                Title: "Crystal Ball"
            }, {
                Emoji: "&#x1F6D2",
                Title: "Shopping Cart"
            }, {
                Emoji: "&#x1F3E7",
                Title: "ATM Sign"
            }, {
                Emoji: "&#x1F6AE",
                Title: "Litter In Bin Sign"
            }, {
                Emoji: "&#x1F6B0",
                Title: "Potable Water"
            }, {
                Emoji: "&#x267F",
                Title: "Wheelchair Symbol"
            }, {
                Emoji: "&#x1F6B9",
                Title: "Men’s Room"
            }, {
                Emoji: "&#x1F6BA",
                Title: "Women’s Room"
            }, {
                Emoji: "&#x1F6BB",
                Title: "Restroom"
            }, {
                Emoji: "&#x1F6BC",
                Title: "Baby Symbol"
            }, {
                Emoji: "&#x1F6BE",
                Title: "Water Closet"
            }, {
                Emoji: "&#x1F6C2",
                Title: "Passport Control"
            }, {
                Emoji: "&#x1F6C3",
                Title: "Customs"
            }, {
                Emoji: "&#x1F6C4",
                Title: "Baggage Claim"
            }, {
                Emoji: "&#x1F6C5",
                Title: "Left Luggage"
            }, {
                Emoji: "&#x26A0",
                Title: "Warning"
            }, {
                Emoji: "&#x1F6B8",
                Title: "Children Crossing"
            }, {
                Emoji: "&#x26D4",
                Title: "No Entry"
            }, {
                Emoji: "&#x1F6AB",
                Title: "Prohibited"
            }, {
                Emoji: "&#x1F6B3",
                Title: "No Bicycles"
            }, {
                Emoji: "&#x1F6AD",
                Title: "No Smoking"
            }, {
                Emoji: "&#x1F6AF",
                Title: "No Littering"
            }, {
                Emoji: "&#x1F6B1",
                Title: "Non-Potable Water"
            }, {
                Emoji: "&#x1F6B7",
                Title: "No Pedestrians"
            }, {
                Emoji: "&#x1F4F5",
                Title: "No Mobile Phones"
            }, {
                Emoji: "&#x1F51E",
                Title: "No One Under Eighteen"
            }, {
                Emoji: "&#x2622",
                Title: "Radioactive"
            }, {
                Emoji: "&#x2623",
                Title: "Biohazard"
            }, {
                Emoji: "&#x2B06",
                Title: "Up Arrow"
            }, {
                Emoji: "&#x2197",
                Title: "Up-Right Arrow"
            }, {
                Emoji: "&#x27A1",
                Title: "Right Arrow"
            }, {
                Emoji: "&#x2198",
                Title: "Down-Right Arrow"
            }, {
                Emoji: "&#x2B07",
                Title: "Down Arrow"
            }, {
                Emoji: "&#x2199",
                Title: "Down-Left Arrow"
            }, {
                Emoji: "&#x2B05",
                Title: "Left Arrow"
            }, {
                Emoji: "&#x2196",
                Title: "Up-Left Arrow"
            }, {
                Emoji: "&#x2195",
                Title: "Up-Down Arrow"
            }, {
                Emoji: "&#x2194",
                Title: "Left-Right Arrow"
            }, {
                Emoji: "&#x21A9",
                Title: "Right Arrow Curving Left"
            }, {
                Emoji: "&#x21AA",
                Title: "Left Arrow Curving Right"
            }, {
                Emoji: "&#x2934",
                Title: "Right Arrow Curving Up"
            }, {
                Emoji: "&#x2935",
                Title: "Right Arrow Curving Down"
            }, {
                Emoji: "&#x1F503",
                Title: "Clockwise Vertical Arrows"
            }, {
                Emoji: "&#x1F504",
                Title: "Anticlockwise Arrows Button"
            }, {
                Emoji: "&#x1F519",
                Title: "BACK Arrow"
            }, {
                Emoji: "&#x1F51A",
                Title: "END Arrow"
            }, {
                Emoji: "&#x1F51B",
                Title: "ON! Arrow"
            }, {
                Emoji: "&#x1F51C",
                Title: "SOON Arrow"
            }, {
                Emoji: "&#x1F51D",
                Title: "TOP Arrow"
            }, {
                Emoji: "&#x1F6D0",
                Title: "Place Of Worship"
            }, {
                Emoji: "&#x269B",
                Title: "Atom Symbol"
            }, {
                Emoji: "&#x1F549",
                Title: "Om"
            }, {
                Emoji: "&#x2721",
                Title: "Star Of David"
            }, {
                Emoji: "&#x2638",
                Title: "Wheel Of Dharma"
            }, {
                Emoji: "&#x262F",
                Title: "Yin Yang"
            }, {
                Emoji: "&#x271D",
                Title: "Latin Cross"
            }, {
                Emoji: "&#x2626",
                Title: "Orthodox Cross"
            }, {
                Emoji: "&#x262A",
                Title: "Star And Crescent"
            }, {
                Emoji: "&#x262E",
                Title: "Peace Symbol"
            }, {
                Emoji: "&#x1F54E",
                Title: "Menorah"
            }, {
                Emoji: "&#x1F52F",
                Title: "Dotted Six-Pointed Star"
            }, {
                Emoji: "&#x2648",
                Title: "Aries"
            }, {
                Emoji: "&#x2649",
                Title: "Taurus"
            }, {
                Emoji: "&#x264A",
                Title: "Gemini"
            }, {
                Emoji: "&#x264B",
                Title: "Cancer"
            }, {
                Emoji: "&#x264C",
                Title: "Leo"
            }, {
                Emoji: "&#x264D",
                Title: "Virgo"
            }, {
                Emoji: "&#x264E",
                Title: "Libra"
            }, {
                Emoji: "&#x264F",
                Title: "Scorpius"
            }, {
                Emoji: "&#x2650",
                Title: "Sagittarius"
            }, {
                Emoji: "&#x2651",
                Title: "Capricorn"
            }, {
                Emoji: "&#x2652",
                Title: "Aquarius"
            }, {
                Emoji: "&#x2653",
                Title: "Pisces"
            }, {
                Emoji: "&#x26CE",
                Title: "Ophiuchus"
            }, {
                Emoji: "&#x1F500",
                Title: "Shuffle Tracks Button"
            }, {
                Emoji: "&#x1F501",
                Title: "Repeat Button"
            }, {
                Emoji: "&#x1F502",
                Title: "Repeat Single Button"
            }, {
                Emoji: "&#x25B6",
                Title: "Play Button"
            }, {
                Emoji: "&#x23E9",
                Title: "Fast-Forward Button"
            }, {
                Emoji: "&#x23ED",
                Title: "Next Track Button"
            }, {
                Emoji: "&#x23EF",
                Title: "Play Or Pause Button"
            }, {
                Emoji: "&#x25C0",
                Title: "Reverse Button"
            }, {
                Emoji: "&#x23EA",
                Title: "Fast Reverse Button"
            }, {
                Emoji: "&#x23EE",
                Title: "Last Track Button"
            }, {
                Emoji: "&#x1F53C",
                Title: "Up Button"
            }, {
                Emoji: "&#x23EB",
                Title: "Fast Up Button"
            }, {
                Emoji: "&#x1F53D",
                Title: "Down Button"
            }, {
                Emoji: "&#x23EC",
                Title: "Fast Down Button"
            }, {
                Emoji: "&#x23F8",
                Title: "Pause Button"
            }, {
                Emoji: "&#x23F9",
                Title: "Stop Button"
            }, {
                Emoji: "&#x23FA",
                Title: "Record Button"
            }, {
                Emoji: "&#x23CF",
                Title: "Eject Button"
            }, {
                Emoji: "&#x1F3A6",
                Title: "Cinema"
            }, {
                Emoji: "&#x1F505",
                Title: "Dim Button"
            }, {
                Emoji: "&#x1F506",
                Title: "Bright Button"
            }, {
                Emoji: "&#x1F4F6",
                Title: "Antenna Bars"
            }, {
                Emoji: "&#x1F4F3",
                Title: "Vibration Mode"
            }, {
                Emoji: "&#x1F4F4",
                Title: "Mobile Phone Off"
            }, {
                Emoji: "&#x267B",
                Title: "Recycling Symbol"
            }, {
                Emoji: "&#x1F4DB",
                Title: "Name Badge"
            }, {
                Emoji: "&#x269C",
                Title: "Fleur-De-Lis"
            }, {
                Emoji: "&#x1F530",
                Title: "Japanese Symbol For Beginner"
            }, {
                Emoji: "&#x1F531",
                Title: "Trident Emblem"
            }, {
                Emoji: "&#x2B55",
                Title: "Heavy Large Circle"
            }, {
                Emoji: "&#x2705",
                Title: "White Heavy Check Mark"
            }, {
                Emoji: "&#x2611",
                Title: "Ballot Box With Check"
            }, {
                Emoji: "&#x2714",
                Title: "Heavy Check Mark"
            }, {
                Emoji: "&#x2716",
                Title: "Heavy Multiplication X"
            }, {
                Emoji: "&#x274C",
                Title: "Cross Mark"
            }, {
                Emoji: "&#x274E",
                Title: "Cross Mark Button"
            }, {
                Emoji: "&#x2795",
                Title: "Heavy Plus Sign"
            }, {
                Emoji: "&#x2640",
                Title: "Female Sign"
            }, {
                Emoji: "&#x2642",
                Title: "Male Sign"
            }, {
                Emoji: "&#x2695",
                Title: "Medical Symbol"
            }, {
                Emoji: "&#x2796",
                Title: "Heavy Minus Sign"
            }, {
                Emoji: "&#x2797",
                Title: "Heavy Division Sign"
            }, {
                Emoji: "&#x27B0",
                Title: "Curly Loop"
            }, {
                Emoji: "&#x27BF",
                Title: "Double Curly Loop"
            }, {
                Emoji: "&#x303D",
                Title: "Part Alternation Mark"
            }, {
                Emoji: "&#x2733",
                Title: "Eight-Spoked Asterisk"
            }, {
                Emoji: "&#x2734",
                Title: "Eight-Pointed Star"
            }, {
                Emoji: "&#x2747",
                Title: "Sparkle"
            }, {
                Emoji: "&#x203C",
                Title: "Double Exclamation Mark"
            }, {
                Emoji: "&#x2049",
                Title: "Exclamation Question Mark"
            }, {
                Emoji: "&#x2753",
                Title: "Question Mark"
            }, {
                Emoji: "&#x2754",
                Title: "White Question Mark"
            }, {
                Emoji: "&#x2755",
                Title: "White Exclamation Mark"
            }, {
                Emoji: "&#x2757",
                Title: "Exclamation Mark"
            }, {
                Emoji: "&#x3030",
                Title: "Wavy Dash"
            }, {
                Emoji: "&#x00A9",
                Title: "Copyright"
            }, {
                Emoji: "&#x00AE",
                Title: "Registered"
            }, {
                Emoji: "&#x2122",
                Title: "Trade Mark"
            }, {
                Emoji: "&#x0023&#xFE0F&#x20E3",
                Title: "Keycap: #"
            }, {
                Emoji: "&#x002A&#xFE0F&#x20E3",
                Title: "Keycap: *"
            }, {
                Emoji: "&#x0030&#xFE0F&#x20E3",
                Title: "Keycap: 0"
            }, {
                Emoji: "&#x0031&#xFE0F&#x20E3",
                Title: "Keycap: 1"
            }, {
                Emoji: "&#x0032&#xFE0F&#x20E3",
                Title: "Keycap: 2"
            }, {
                Emoji: "&#x0033&#xFE0F&#x20E3",
                Title: "Keycap: 3"
            }, {
                Emoji: "&#x0034&#xFE0F&#x20E3",
                Title: "Keycap: 4"
            }, {
                Emoji: "&#x0035&#xFE0F&#x20E3",
                Title: "Keycap: 5"
            }, {
                Emoji: "&#x0036&#xFE0F&#x20E3",
                Title: "Keycap: 6"
            }, {
                Emoji: "&#x0037&#xFE0F&#x20E3",
                Title: "Keycap: 7"
            }, {
                Emoji: "&#x0038&#xFE0F&#x20E3",
                Title: "Keycap: 8"
            }, {
                Emoji: "&#x0039&#xFE0F&#x20E3",
                Title: "Keycap: 9"
            }, {
                Emoji: "&#x1F51F",
                Title: "Keycap 10"
            }, {
                Emoji: "&#x1F4AF",
                Title: "Hundred Points"
            }, {
                Emoji: "&#x1F520",
                Title: "Input Latin Uppercase"
            }, {
                Emoji: "&#x1F521",
                Title: "Input Latin Lowercase"
            }, {
                Emoji: "&#x1F522",
                Title: "Input Numbers"
            }, {
                Emoji: "&#x1F523",
                Title: "Input Symbols"
            }, {
                Emoji: "&#x1F524",
                Title: "Input Latin Letters"
            }, {
                Emoji: "&#x1F170",
                Title: "A Button (blood Type)"
            }, {
                Emoji: "&#x1F18E",
                Title: "AB Button (blood Type)"
            }, {
                Emoji: "&#x1F171",
                Title: "B Button (blood Type)"
            }, {
                Emoji: "&#x1F191",
                Title: "CL Button"
            }, {
                Emoji: "&#x1F192",
                Title: "COOL Button"
            }, {
                Emoji: "&#x1F193",
                Title: "FREE Button"
            }, {
                Emoji: "&#x2139",
                Title: "Information"
            }, {
                Emoji: "&#x1F194",
                Title: "ID Button"
            }, {
                Emoji: "&#x24C2",
                Title: "Circled M"
            }, {
                Emoji: "&#x1F195",
                Title: "NEW Button"
            }, {
                Emoji: "&#x1F196",
                Title: "NG Button"
            }, {
                Emoji: "&#x1F17E",
                Title: "O Button (blood Type)"
            }, {
                Emoji: "&#x1F197",
                Title: "OK Button"
            }, {
                Emoji: "&#x1F17F",
                Title: "P Button"
            }, {
                Emoji: "&#x1F198",
                Title: "SOS Button"
            }, {
                Emoji: "&#x1F199",
                Title: "UP! Button"
            }, {
                Emoji: "&#x1F19A",
                Title: "VS Button"
            }, {
                Emoji: "&#x1F201",
                Title: "Japanese “here” Button"
            }, {
                Emoji: "&#x1F202",
                Title: "Japanese “service Charge” Button"
            }, {
                Emoji: "&#x1F237",
                Title: "Japanese “monthly Amount” Button"
            }, {
                Emoji: "&#x1F236",
                Title: "Japanese “not Free Of Charge” Button"
            }, {
                Emoji: "&#x1F22F",
                Title: "Japanese “reserved” Button"
            }, {
                Emoji: "&#x1F250",
                Title: "Japanese “bargain” Button"
            }, {
                Emoji: "&#x1F239",
                Title: "Japanese “discount” Button"
            }, {
                Emoji: "&#x1F21A",
                Title: "Japanese “free Of Charge” Button"
            }, {
                Emoji: "&#x1F232",
                Title: "Japanese “prohibited” Button"
            }, {
                Emoji: "&#x1F251",
                Title: "Japanese “acceptable” Button"
            }, {
                Emoji: "&#x1F238",
                Title: "Japanese “application” Button"
            }, {
                Emoji: "&#x1F234",
                Title: "Japanese “passing Grade” Button"
            }, {
                Emoji: "&#x1F233",
                Title: "Japanese “vacancy” Button"
            }, {
                Emoji: "&#x3297",
                Title: "Japanese “congratulations” Button"
            }, {
                Emoji: "&#x3299",
                Title: "Japanese “secret” Button"
            }, {
                Emoji: "&#x1F23A",
                Title: "Japanese “open For Business” Button"
            }, {
                Emoji: "&#x1F235",
                Title: "Japanese “no Vacancy” Button"
            }, {
                Emoji: "&#x25AA",
                Title: "Black Small Square"
            }, {
                Emoji: "&#x25AB",
                Title: "White Small Square"
            }, {
                Emoji: "&#x25FB",
                Title: "White Medium Square"
            }, {
                Emoji: "&#x25FC",
                Title: "Black Medium Square"
            }, {
                Emoji: "&#x25FD",
                Title: "White Medium-Small Square"
            }, {
                Emoji: "&#x25FE",
                Title: "Black Medium-Small Square"
            }, {
                Emoji: "&#x2B1B",
                Title: "Black Large Square"
            }, {
                Emoji: "&#x2B1C",
                Title: "White Large Square"
            }, {
                Emoji: "&#x1F536",
                Title: "Large Orange Diamond"
            }, {
                Emoji: "&#x1F537",
                Title: "Large Blue Diamond"
            }, {
                Emoji: "&#x1F538",
                Title: "Small Orange Diamond"
            }, {
                Emoji: "&#x1F539",
                Title: "Small Blue Diamond"
            }, {
                Emoji: "&#x1F53A",
                Title: "Red Triangle Pointed Up"
            }, {
                Emoji: "&#x1F53B",
                Title: "Red Triangle Pointed Down"
            }, {
                Emoji: "&#x1F4A0",
                Title: "Diamond With A Dot"
            }, {
                Emoji: "&#x1F518",
                Title: "Radio Button"
            }, {
                Emoji: "&#x1F532",
                Title: "Black Square Button"
            }, {
                Emoji: "&#x1F533",
                Title: "White Square Button"
            }, {
                Emoji: "&#x26AA",
                Title: "White Circle"
            }, {
                Emoji: "&#x26AB",
                Title: "Black Circle"
            }, {
                Emoji: "&#x1F534",
                Title: "Red Circle"
            }, {
                Emoji: "&#x1F535",
                Title: "Blue Circle"
            }, {
                Emoji: "&#x1F3C1",
                Title: "Chequered Flag"
            }, {
                Emoji: "&#x1F6A9",
                Title: "Triangular Flag"
            }, {
                Emoji: "&#x1F38C",
                Title: "Crossed Flags"
            }, {
                Emoji: "&#x1F3F4",
                Title: "Black Flag"
            }, {
                Emoji: "&#x1F3F3",
                Title: "White Flag"
            }, {
                Emoji: "&#x1F3F3&#xFE0F&#x200D&#x1F308",
                Title: "Rainbow Flag"
            }, {
                Emoji: "&#x1F1E6&#x1F1E8",
                Title: "Ascension Island"
            }, {
                Emoji: "&#x1F1E6&#x1F1E9",
                Title: "Andorra"
            }, {
                Emoji: "&#x1F1E6&#x1F1EA",
                Title: "United Arab Emirates"
            }, {
                Emoji: "&#x1F1E6&#x1F1EB",
                Title: "Afghanistan"
            }, {
                Emoji: "&#x1F1E6&#x1F1EC",
                Title: "Antigua & Barbuda"
            }, {
                Emoji: "&#x1F1E6&#x1F1EE",
                Title: "Anguilla"
            }, {
                Emoji: "&#x1F1E6&#x1F1F1",
                Title: "Albania"
            }, {
                Emoji: "&#x1F1E6&#x1F1F2",
                Title: "Armenia"
            }, {
                Emoji: "&#x1F1E6&#x1F1F4",
                Title: "Angola"
            }, {
                Emoji: "&#x1F1E6&#x1F1F6",
                Title: "Antarctica"
            }, {
                Emoji: "&#x1F1E6&#x1F1F7",
                Title: "Argentina"
            }, {
                Emoji: "&#x1F1E6&#x1F1F8",
                Title: "American Samoa"
            }, {
                Emoji: "&#x1F1E6&#x1F1F9",
                Title: "Austria"
            }, {
                Emoji: "&#x1F1E6&#x1F1FA",
                Title: "Australia"
            }, {
                Emoji: "&#x1F1E6&#x1F1FC",
                Title: "Aruba"
            }, {
                Emoji: "&#x1F1E6&#x1F1FD",
                Title: "Åland Islands"
            }, {
                Emoji: "&#x1F1E6&#x1F1FF",
                Title: "Azerbaijan"
            }, {
                Emoji: "&#x1F1E7&#x1F1E6",
                Title: "Bosnia & Herzegovina"
            }, {
                Emoji: "&#x1F1E7&#x1F1E7",
                Title: "Barbados"
            }, {
                Emoji: "&#x1F1E7&#x1F1E9",
                Title: "Bangladesh"
            }, {
                Emoji: "&#x1F1E7&#x1F1EA",
                Title: "Belgium"
            }, {
                Emoji: "&#x1F1E7&#x1F1EB",
                Title: "Burkina Faso"
            }, {
                Emoji: "&#x1F1E7&#x1F1EC",
                Title: "Bulgaria"
            }, {
                Emoji: "&#x1F1E7&#x1F1ED",
                Title: "Bahrain"
            }, {
                Emoji: "&#x1F1E7&#x1F1EE",
                Title: "Burundi"
            }, {
                Emoji: "&#x1F1E7&#x1F1EF",
                Title: "Benin"
            }, {
                Emoji: "&#x1F1E7&#x1F1F1",
                Title: "St. Barthélemy"
            }, {
                Emoji: "&#x1F1E7&#x1F1F2",
                Title: "Bermuda"
            }, {
                Emoji: "&#x1F1E7&#x1F1F3",
                Title: "Brunei"
            }, {
                Emoji: "&#x1F1E7&#x1F1F4",
                Title: "Bolivia"
            }, {
                Emoji: "&#x1F1E7&#x1F1F6",
                Title: "Caribbean Netherlands"
            }, {
                Emoji: "&#x1F1E7&#x1F1F7",
                Title: "Brazil"
            }, {
                Emoji: "&#x1F1E7&#x1F1F8",
                Title: "Bahamas"
            }, {
                Emoji: "&#x1F1E7&#x1F1F9",
                Title: "Bhutan"
            }, {
                Emoji: "&#x1F1E7&#x1F1FB",
                Title: "Bouvet Island"
            }, {
                Emoji: "&#x1F1E7&#x1F1FC",
                Title: "Botswana"
            }, {
                Emoji: "&#x1F1E7&#x1F1FE",
                Title: "Belarus"
            }, {
                Emoji: "&#x1F1E7&#x1F1FF",
                Title: "Belize"
            }, {
                Emoji: "&#x1F1E8&#x1F1E6",
                Title: "Canada"
            }, {
                Emoji: "&#x1F1E8&#x1F1E8",
                Title: "Cocos (Keeling) Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1E9",
                Title: "Congo - Kinshasa"
            }, {
                Emoji: "&#x1F1E8&#x1F1EB",
                Title: "Central African Republic"
            }, {
                Emoji: "&#x1F1E8&#x1F1EC",
                Title: "Congo - Brazzaville"
            }, {
                Emoji: "&#x1F1E8&#x1F1ED",
                Title: "Switzerland"
            }, {
                Emoji: "&#x1F1E8&#x1F1EE",
                Title: "Côte D’Ivoire"
            }, {
                Emoji: "&#x1F1E8&#x1F1F0",
                Title: "Cook Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1F1",
                Title: "Chile"
            }, {
                Emoji: "&#x1F1E8&#x1F1F2",
                Title: "Cameroon"
            }, {
                Emoji: "&#x1F1E8&#x1F1F3",
                Title: "China"
            }, {
                Emoji: "&#x1F1E8&#x1F1F4",
                Title: "Colombia"
            }, {
                Emoji: "&#x1F1E8&#x1F1F5",
                Title: "Clipperton Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1F7",
                Title: "Costa Rica"
            }, {
                Emoji: "&#x1F1E8&#x1F1FA",
                Title: "Cuba"
            }, {
                Emoji: "&#x1F1E8&#x1F1FB",
                Title: "Cape Verde"
            }, {
                Emoji: "&#x1F1E8&#x1F1FC",
                Title: "Curaçao"
            }, {
                Emoji: "&#x1F1E8&#x1F1FD",
                Title: "Christmas Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1FE",
                Title: "Cyprus"
            }, {
                Emoji: "&#x1F1E8&#x1F1FF",
                Title: "Czech Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1EA",
                Title: "Germany"
            }, {
                Emoji: "&#x1F1E9&#x1F1EC",
                Title: "Diego Garcia"
            }, {
                Emoji: "&#x1F1E9&#x1F1EF",
                Title: "Djibouti"
            }, {
                Emoji: "&#x1F1E9&#x1F1F0",
                Title: "Denmark"
            }, {
                Emoji: "&#x1F1E9&#x1F1F2",
                Title: "Dominica"
            }, {
                Emoji: "&#x1F1E9&#x1F1F4",
                Title: "Dominican Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1FF",
                Title: "Algeria"
            }, {
                Emoji: "&#x1F1EA&#x1F1E6",
                Title: "Ceuta & Melilla"
            }, {
                Emoji: "&#x1F1EA&#x1F1E8",
                Title: "Ecuador"
            }, {
                Emoji: "&#x1F1EA&#x1F1EA",
                Title: "Estonia"
            }, {
                Emoji: "&#x1F1EA&#x1F1EC",
                Title: "Egypt"
            }, {
                Emoji: "&#x1F1EA&#x1F1ED",
                Title: "Western Sahara"
            }, {
                Emoji: "&#x1F1EA&#x1F1F7",
                Title: "Eritrea"
            }, {
                Emoji: "&#x1F1EA&#x1F1F8",
                Title: "Spain"
            }, {
                Emoji: "&#x1F1EA&#x1F1F9",
                Title: "Ethiopia"
            }, {
                Emoji: "&#x1F1EA&#x1F1FA",
                Title: "European Union"
            }, {
                Emoji: "&#x1F1EB&#x1F1EE",
                Title: "Finland"
            }, {
                Emoji: "&#x1F1EB&#x1F1EF",
                Title: "Fiji"
            }, {
                Emoji: "&#x1F1EB&#x1F1F0",
                Title: "Falkland Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F2",
                Title: "Micronesia"
            }, {
                Emoji: "&#x1F1EB&#x1F1F4",
                Title: "Faroe Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F7",
                Title: "France"
            }, {
                Emoji: "&#x1F1EC&#x1F1E6",
                Title: "Gabon"
            }, {
                Emoji: "&#x1F1EC&#x1F1E7",
                Title: "United Kingdom"
            }, {
                Emoji: "&#x1F1EC&#x1F1E9",
                Title: "Grenada"
            }, {
                Emoji: "&#x1F1EC&#x1F1EA",
                Title: "Georgia"
            }, {
                Emoji: "&#x1F1EC&#x1F1EB",
                Title: "French Guiana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EC",
                Title: "Guernsey"
            }, {
                Emoji: "&#x1F1EC&#x1F1ED",
                Title: "Ghana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EE",
                Title: "Gibraltar"
            }, {
                Emoji: "&#x1F1EC&#x1F1F1",
                Title: "Greenland"
            }, {
                Emoji: "&#x1F1EC&#x1F1F2",
                Title: "Gambia"
            }, {
                Emoji: "&#x1F1EC&#x1F1F3",
                Title: "Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F5",
                Title: "Guadeloupe"
            }, {
                Emoji: "&#x1F1EC&#x1F1F6",
                Title: "Equatorial Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F7",
                Title: "Greece"
            }, {
                Emoji: "&#x1F1EC&#x1F1F8",
                Title: "South Georgia & South Sandwich Islands"
            }, {
                Emoji: "&#x1F1EC&#x1F1F9",
                Title: "Guatemala"
            }, {
                Emoji: "&#x1F1EC&#x1F1FA",
                Title: "Guam"
            }, {
                Emoji: "&#x1F1EC&#x1F1FC",
                Title: "Guinea-Bissau"
            }, {
                Emoji: "&#x1F1EC&#x1F1FE",
                Title: "Guyana"
            }, {
                Emoji: "&#x1F1ED&#x1F1F0",
                Title: "Hong Kong SAR China"
            }, {
                Emoji: "&#x1F1ED&#x1F1F2",
                Title: "Heard & McDonald Islands"
            }, {
                Emoji: "&#x1F1ED&#x1F1F3",
                Title: "Honduras"
            }, {
                Emoji: "&#x1F1ED&#x1F1F7",
                Title: "Croatia"
            }, {
                Emoji: "&#x1F1ED&#x1F1F9",
                Title: "Haiti"
            }, {
                Emoji: "&#x1F1ED&#x1F1FA",
                Title: "Hungary"
            }, {
                Emoji: "&#x1F1EE&#x1F1E8",
                Title: "Canary Islands"
            }, {
                Emoji: "&#x1F1EE&#x1F1E9",
                Title: "Indonesia"
            }, {
                Emoji: "&#x1F1EE&#x1F1EA",
                Title: "Ireland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F1",
                Title: "Israel"
            }, {
                Emoji: "&#x1F1EE&#x1F1F2",
                Title: "Isle Of Man"
            }, {
                Emoji: "&#x1F1EE&#x1F1F3",
                Title: "India"
            }, {
                Emoji: "&#x1F1EE&#x1F1F4",
                Title: "British Indian Ocean Territory"
            }, {
                Emoji: "&#x1F1EE&#x1F1F6",
                Title: "Iraq"
            }, {
                Emoji: "&#x1F1EE&#x1F1F7",
                Title: "Iran"
            }, {
                Emoji: "&#x1F1EE&#x1F1F8",
                Title: "Iceland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F9",
                Title: "Italy"
            }, {
                Emoji: "&#x1F1EF&#x1F1EA",
                Title: "Jersey"
            }, {
                Emoji: "&#x1F1EF&#x1F1F2",
                Title: "Jamaica"
            }, {
                Emoji: "&#x1F1EF&#x1F1F4",
                Title: "Jordan"
            }, {
                Emoji: "&#x1F1EF&#x1F1F5",
                Title: "Japan"
            }, {
                Emoji: "&#x1F1F0&#x1F1EA",
                Title: "Kenya"
            }, {
                Emoji: "&#x1F1F0&#x1F1EC",
                Title: "Kyrgyzstan"
            }, {
                Emoji: "&#x1F1F0&#x1F1ED",
                Title: "Cambodia"
            }, {
                Emoji: "&#x1F1F0&#x1F1EE",
                Title: "Kiribati"
            }, {
                Emoji: "&#x1F1F0&#x1F1F2",
                Title: "Comoros"
            }, {
                Emoji: "&#x1F1F0&#x1F1F3",
                Title: "St. Kitts & Nevis"
            }, {
                Emoji: "&#x1F1F0&#x1F1F5",
                Title: "North Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1F7",
                Title: "South Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1FC",
                Title: "Kuwait"
            }, {
                Emoji: "&#x1F1F0&#x1F1FE",
                Title: "Cayman Islands"
            }, {
                Emoji: "&#x1F1F0&#x1F1FF",
                Title: "Kazakhstan"
            }, {
                Emoji: "&#x1F1F1&#x1F1E6",
                Title: "Laos"
            }, {
                Emoji: "&#x1F1F1&#x1F1E7",
                Title: "Lebanon"
            }, {
                Emoji: "&#x1F1F1&#x1F1E8",
                Title: "St. Lucia"
            }, {
                Emoji: "&#x1F1F1&#x1F1EE",
                Title: "Liechtenstein"
            }, {
                Emoji: "&#x1F1F1&#x1F1F0",
                Title: "Sri Lanka"
            }, {
                Emoji: "&#x1F1F1&#x1F1F7",
                Title: "Liberia"
            }, {
                Emoji: "&#x1F1F1&#x1F1F8",
                Title: "Lesotho"
            }, {
                Emoji: "&#x1F1F1&#x1F1F9",
                Title: "Lithuania"
            }, {
                Emoji: "&#x1F1F1&#x1F1FA",
                Title: "Luxembourg"
            }, {
                Emoji: "&#x1F1F1&#x1F1FB",
                Title: "Latvia"
            }, {
                Emoji: "&#x1F1F1&#x1F1FE",
                Title: "Libya"
            }, {
                Emoji: "&#x1F1F2&#x1F1E6",
                Title: "Morocco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E8",
                Title: "Monaco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E9",
                Title: "Moldova"
            }, {
                Emoji: "&#x1F1F2&#x1F1EA",
                Title: "Montenegro"
            }, {
                Emoji: "&#x1F1F2&#x1F1EB",
                Title: "St. Martin"
            }, {
                Emoji: "&#x1F1F2&#x1F1EC",
                Title: "Madagascar"
            }, {
                Emoji: "&#x1F1F2&#x1F1ED",
                Title: "Marshall Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F0",
                Title: "Macedonia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F1",
                Title: "Mali"
            }, {
                Emoji: "&#x1F1F2&#x1F1F2",
                Title: "Myanmar (Burma)"
            }, {
                Emoji: "&#x1F1F2&#x1F1F3",
                Title: "Mongolia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F4",
                Title: "Macau SAR China"
            }, {
                Emoji: "&#x1F1F2&#x1F1F5",
                Title: "Northern Mariana Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F6",
                Title: "Martinique"
            }, {
                Emoji: "&#x1F1F2&#x1F1F7",
                Title: "Mauritania"
            }, {
                Emoji: "&#x1F1F2&#x1F1F8",
                Title: "Montserrat"
            }, {
                Emoji: "&#x1F1F2&#x1F1F9",
                Title: "Malta"
            }, {
                Emoji: "&#x1F1F2&#x1F1FA",
                Title: "Mauritius"
            }, {
                Emoji: "&#x1F1F2&#x1F1FB",
                Title: "Maldives"
            }, {
                Emoji: "&#x1F1F2&#x1F1FC",
                Title: "Malawi"
            }, {
                Emoji: "&#x1F1F2&#x1F1FD",
                Title: "Mexico"
            }, {
                Emoji: "&#x1F1F2&#x1F1FE",
                Title: "Malaysia"
            }, {
                Emoji: "&#x1F1F2&#x1F1FF",
                Title: "Mozambique"
            }, {
                Emoji: "&#x1F1F3&#x1F1E6",
                Title: "Namibia"
            }, {
                Emoji: "&#x1F1F3&#x1F1E8",
                Title: "New Caledonia"
            }, {
                Emoji: "&#x1F1F3&#x1F1EA",
                Title: "Niger"
            }, {
                Emoji: "&#x1F1F3&#x1F1EB",
                Title: "Norfolk Island"
            }, {
                Emoji: "&#x1F1F3&#x1F1EC",
                Title: "Nigeria"
            }, {
                Emoji: "&#x1F1F3&#x1F1EE",
                Title: "Nicaragua"
            }, {
                Emoji: "&#x1F1F3&#x1F1F1",
                Title: "Netherlands"
            }, {
                Emoji: "&#x1F1F3&#x1F1F4",
                Title: "Norway"
            }, {
                Emoji: "&#x1F1F3&#x1F1F5",
                Title: "Nepal"
            }, {
                Emoji: "&#x1F1F3&#x1F1F7",
                Title: "Nauru"
            }, {
                Emoji: "&#x1F1F3&#x1F1FA",
                Title: "Niue"
            }, {
                Emoji: "&#x1F1F3&#x1F1FF",
                Title: "New Zealand"
            }, {
                Emoji: "&#x1F1F4&#x1F1F2",
                Title: "Oman"
            }, {
                Emoji: "&#x1F1F5&#x1F1E6",
                Title: "Panama"
            }, {
                Emoji: "&#x1F1F5&#x1F1EA",
                Title: "Peru"
            }, {
                Emoji: "&#x1F1F5&#x1F1EB",
                Title: "French Polynesia"
            }, {
                Emoji: "&#x1F1F5&#x1F1EC",
                Title: "Papua New Guinea"
            }, {
                Emoji: "&#x1F1F5&#x1F1ED",
                Title: "Philippines"
            }, {
                Emoji: "&#x1F1F5&#x1F1F0",
                Title: "Pakistan"
            }, {
                Emoji: "&#x1F1F5&#x1F1F1",
                Title: "Poland"
            }, {
                Emoji: "&#x1F1F5&#x1F1F2",
                Title: "St. Pierre & Miquelon"
            }, {
                Emoji: "&#x1F1F5&#x1F1F3",
                Title: "Pitcairn Islands"
            }, {
                Emoji: "&#x1F1F5&#x1F1F7",
                Title: "Puerto Rico"
            }, {
                Emoji: "&#x1F1F5&#x1F1F8",
                Title: "Palestinian Territories"
            }, {
                Emoji: "&#x1F1F5&#x1F1F9",
                Title: "Portugal"
            }, {
                Emoji: "&#x1F1F5&#x1F1FC",
                Title: "Palau"
            }, {
                Emoji: "&#x1F1F5&#x1F1FE",
                Title: "Paraguay"
            }, {
                Emoji: "&#x1F1F6&#x1F1E6",
                Title: "Qatar"
            }, {
                Emoji: "&#x1F1F7&#x1F1EA",
                Title: "Réunion"
            }, {
                Emoji: "&#x1F1F7&#x1F1F4",
                Title: "Romania"
            }, {
                Emoji: "&#x1F1F7&#x1F1F8",
                Title: "Serbia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FA",
                Title: "Russia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FC",
                Title: "Rwanda"
            }, {
                Emoji: "&#x1F1F8&#x1F1E6",
                Title: "Saudi Arabia"
            }, {
                Emoji: "&#x1F1F8&#x1F1E7",
                Title: "Solomon Islands"
            }, {
                Emoji: "&#x1F1F8&#x1F1E8",
                Title: "Seychelles"
            }, {
                Emoji: "&#x1F1F8&#x1F1E9",
                Title: "Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1EA",
                Title: "Sweden"
            }, {
                Emoji: "&#x1F1F8&#x1F1EC",
                Title: "Singapore"
            }, {
                Emoji: "&#x1F1F8&#x1F1ED",
                Title: "St. Helena"
            }, {
                Emoji: "&#x1F1F8&#x1F1EE",
                Title: "Slovenia"
            }, {
                Emoji: "&#x1F1F8&#x1F1EF",
                Title: "Svalbard & Jan Mayen"
            }, {
                Emoji: "&#x1F1F8&#x1F1F0",
                Title: "Slovakia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F1",
                Title: "Sierra Leone"
            }, {
                Emoji: "&#x1F1F8&#x1F1F2",
                Title: "San Marino"
            }, {
                Emoji: "&#x1F1F8&#x1F1F3",
                Title: "Senegal"
            }, {
                Emoji: "&#x1F1F8&#x1F1F4",
                Title: "Somalia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F7",
                Title: "Suriname"
            }, {
                Emoji: "&#x1F1F8&#x1F1F8",
                Title: "South Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1F9",
                Title: "São Tomé & Príncipe"
            }, {
                Emoji: "&#x1F1F8&#x1F1FB",
                Title: "El Salvador"
            }, {
                Emoji: "&#x1F1F8&#x1F1FD",
                Title: "Sint Maarten"
            }, {
                Emoji: "&#x1F1F8&#x1F1FE",
                Title: "Syria"
            }, {
                Emoji: "&#x1F1F8&#x1F1FF",
                Title: "Swaziland"
            }, {
                Emoji: "&#x1F1F9&#x1F1E6",
                Title: "Tristan Da Cunha"
            }, {
                Emoji: "&#x1F1F9&#x1F1E8",
                Title: "Turks & Caicos Islands"
            }, {
                Emoji: "&#x1F1F9&#x1F1E9",
                Title: "Chad"
            }, {
                Emoji: "&#x1F1F9&#x1F1EB",
                Title: "French Southern Territories"
            }, {
                Emoji: "&#x1F1F9&#x1F1EC",
                Title: "Togo"
            }, {
                Emoji: "&#x1F1F9&#x1F1ED",
                Title: "Thailand"
            }, {
                Emoji: "&#x1F1F9&#x1F1EF",
                Title: "Tajikistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F0",
                Title: "Tokelau"
            }, {
                Emoji: "&#x1F1F9&#x1F1F1",
                Title: "Timor-Leste"
            }, {
                Emoji: "&#x1F1F9&#x1F1F2",
                Title: "Turkmenistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F3",
                Title: "Tunisia"
            }, {
                Emoji: "&#x1F1F9&#x1F1F4",
                Title: "Tonga"
            }, {
                Emoji: "&#x1F1F9&#x1F1F7",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F1F9&#x1F1F9",
                Title: "Trinidad & Tobago"
            }, {
                Emoji: "&#x1F1F9&#x1F1FB",
                Title: "Tuvalu"
            }, {
                Emoji: "&#x1F1F9&#x1F1FC",
                Title: "Taiwan"
            }, {
                Emoji: "&#x1F1F9&#x1F1FF",
                Title: "Tanzania"
            }, {
                Emoji: "&#x1F1FA&#x1F1E6",
                Title: "Ukraine"
            }, {
                Emoji: "&#x1F1FA&#x1F1EC",
                Title: "Uganda"
            }, {
                Emoji: "&#x1F1FA&#x1F1F2",
                Title: "U.S. Outlying Islands"
            }, {
                Emoji: "&#x1F1FA&#x1F1F3",
                Title: "United Nations"
            }, {
                Emoji: "&#x1F1FA&#x1F1F8",
                Title: "United States"
            }, {
                Emoji: "&#x1F1FA&#x1F1FE",
                Title: "Uruguay"
            }, {
                Emoji: "&#x1F1FA&#x1F1FF",
                Title: "Uzbekistan"
            }, {
                Emoji: "&#x1F1FB&#x1F1E6",
                Title: "Vatican City"
            }, {
                Emoji: "&#x1F1FB&#x1F1E8",
                Title: "St. Vincent & Grenadines"
            }, {
                Emoji: "&#x1F1FB&#x1F1EA",
                Title: "Venezuela"
            }, {
                Emoji: "&#x1F1FB&#x1F1EC",
                Title: "British Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1EE",
                Title: "U.S. Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1F3",
                Title: "Vietnam"
            }, {
                Emoji: "&#x1F1FB&#x1F1FA",
                Title: "Vanuatu"
            }, {
                Emoji: "&#x1F1FC&#x1F1EB",
                Title: "Wallis & Futuna"
            }, {
                Emoji: "&#x1F1FC&#x1F1F8",
                Title: "Samoa"
            }, {
                Emoji: "&#x1F1FD&#x1F1F0",
                Title: "Kosovo"
            }, {
                Emoji: "&#x1F1FE&#x1F1EA",
                Title: "Yemen"
            }, {
                Emoji: "&#x1F1FE&#x1F1F9",
                Title: "Mayotte"
            }, {
                Emoji: "&#x1F1FF&#x1F1E6",
                Title: "South Africa"
            }, {
                Emoji: "&#x1F1FF&#x1F1F2",
                Title: "Zambia"
            }]
        };
        for (I = 0, N = CFH.Items.length; I < N; ++I) {
            addCFHItem(CFH.Items[I], CFH);
        }
        CFH.TextArea.addEventListener("paste", function(Event) {
            var Value;
            if (GM_getValue("CFH_ALIPF")) {
                Value = Event.clipboardData.getData("text/plain");
                if (Value.match(/^https?:/)) {
                    Event.preventDefault();
                    wrapCFHLinkImage(CFH, "", Value, Value.match(/\.(jpg|jpeg|gif|bmp|png)/) ? true : false);
                }
            }
        });
    }

    function wrapCFHLinkImage(CFH, Title, URL, Image) {
        var Start, End, Value;
        Start = CFH.TextArea.selectionStart;
        End = CFH.TextArea.selectionEnd;
        Value = (Image ? "!" : "") + "[" + Title + "](" + URL + ")";
        CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
        CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
        CFH.TextArea.focus();
    }

    function insertCFHTableRows(N, Table) {
        while (N > 0) {
            insertCFHTableRow(Table);
            --N;
        }
    }

    function insertCFHTableRow(Table) {
        var N, Row, I, J, Delete;
        N = Table.rows.length;
        Row = Table.insertRow(N);
        for (I = 0, J = Table.rows[0].cells.length - 1; I < J; ++I) {
            Row.insertCell(0).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
        }
        Delete = Row.insertCell(0);
        if (N > 2) {
            Delete.innerHTML =
                "<a>" +
                "    <i class=\"fa fa-times-circle\" title=\"Delete row.\"></i>" +
                "</a>";
            Delete.firstElementChild.addEventListener("click", function() {
                if (Table.rows.length > 4) {
                    Row.remove();
                } else {
                    window.alert("A table must have a least one row and two columns.");
                }
            });
        }
    }

    function insertCFHTableColumns(N, Table) {
        while (N > 0) {
            insertCFHTableColumn(Table);
            --N;
        }
    }

    function insertCFHTableColumn(Table) {
        var Rows, N, I, J, Delete, Column;
        Rows = Table.rows;
        N = Rows[0].cells.length;
        for (I = 3, J = Rows.length; I < J; ++I) {
            Rows[I].insertCell(N).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
        }
        Rows[2].insertCell(N).innerHTML =
            "<select>" +
            "    <option value=\":-\">Left</option>" +
            "    <option value=\":-:\">Center</option>" +
            "    <option value=\"-:\">Right</option>" +
            "</select>";
        Delete = Rows[0].insertCell(N);
        Delete.innerHTML =
            "<a>" +
            "    <i class=\"fa fa-times-circle\" title=\"Delete column.\"></i>" +
            "</a>";
        Column = Rows[1].insertCell(N);
        Column.innerHTML = "<input placeholder=\"Header\" type=\"text\"/>";
        Delete.firstElementChild.addEventListener("click", function() {
            Rows = Table.rows;
            N = Rows[1].cells.length;
            if (N > 3) {
                do {
                    --N;
                } while (Rows[1].cells[N] != Column);
                for (I = 0, J = Rows.length; I < J; ++I) {
                    Rows[I].deleteCell(N);
                }
            } else {
                window.alert("A table must have at least one row and two columns.");
            }
        });
    }

    function setCFHEmojis(Emojis, CFH) {
        var I, N;
        for (I = 0, N = Emojis.children.length; I < N; ++I) {
            Emojis.children[I].addEventListener("click", function(Event) {
                wrapCFHFormat(CFH, Event.currentTarget.textContent);
            });
        }
    }

    function addCFHItem(Item, CFH) {
        var Context, Popout;
        if ((Item.ID && GM_getValue(Item.ID)) || !Item.ID) {
            CFH.Panel.insertAdjacentHTML(
                "beforeEnd",
                "<span>" +
                "    <a class=\"page_heading_btn\" title=\"" + Item.Name + "\">" +
                "        <i class=\"fa " + Item.Icon + "\"></i>" + (Item.SecondaryIcon ? (
                    "    <i class=\"fa " + Item.SecondaryIcon + "\"></i>") : "") + (Item.Text ? (
                    "    <span>" + Item.Text + "</span") : "") +
                "    </a>" +
                "</span>"
            );
            Context = CFH.Panel.lastElementChild;
            if (Item.setPopout) {
                Popout = createPopout(Context);
                Item.setPopout(Popout.Popout);
                Context.addEventListener("click", function() {
                    Popout.popOut(Context, Item.Callback);
                });
            } else {
                if (Item.Callback) {
                    Item.Callback(Context);
                }
                Context.addEventListener("click", function() {
                    if (Item.OnClick) {
                        Item.OnClick();
                    } else {
                        wrapCFHFormat(CFH, Item.Prefix, Item.Suffix, Item.OrderedList, Item.UnorderedList);
                    }
                });
            }
        }
    }

    function wrapCFHFormat(CFH, Prefix, Suffix, OrderedList, UnorderedList) {
        var Value, Start, End, N;
        Value = CFH.TextArea.value;
        Start = CFH.TextArea.selectionStart;
        End = CFH.TextArea.selectionEnd;
        if (OrderedList || UnorderedList) {
            if (OrderedList) {
                N = 1;
                Prefix = N + ". " + Value.slice(Start, End).replace(/\n/g, function() {
                    return ("\n" + (++N) + ". ");
                });
            } else {
                Prefix = "* " + Value.slice(Start, End).replace(/\n/g, "\n* ");
            }
        }
        CFH.TextArea.value = Value.slice(0, Start) + Prefix + ((OrderedList || UnorderedList) ? "" : (Value.slice(Start, End) + (Suffix ? Suffix : ""))) + Value.slice(End);
        CFH.TextArea.setSelectionRange(End + Prefix.length, End + Prefix.length);
        CFH.TextArea.focus();
    }

    function setCFHALIPF(CFH, Value) {
        if (typeof Value == "undefined") {
            Value = GM_getValue("CFH_ALIPF") ? false : true;
            GM_setValue("CFH_ALIPF", Value);
        }
        if (Value) {
            CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: On";
            CFH.ALIPF.classList.remove("CFHALIPF");
        } else {
            CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: Off";
            CFH.ALIPF.classList.add("CFHALIPF");
        }
    }

    // Main Comment Box Popup

    function addMCBPButton(Context) {
        var CommentBox, Popup, ESCommentBox;
        CommentBox = document.getElementsByClassName(SG ? "comment--submit" : "reply_form")[0];
        if (CommentBox && !CommentBox.classList.contains("is_hidden")) {
            Popup = createPopup();
            Popup.Popup.style.width = "auto";
            Popup.Icon.classList.add("fa-comment");
            Popup.Title.textContent = "Add a comment:";
            Popup.TextArea.classList.remove("rhHidden");
            if (GM_getValue("CFH")) {
                addCFHPanel(Popup.TextArea);
            }
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                Popup.Progress.innerHTML = "";
                saveComment(SG ? "" : document.querySelector("[name='trade_code']").value, "", Popup.TextArea.value, SG ? Location.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php", Popup.Progress,
                            Callback);
            });
            ESCommentBox = Context.nextElementSibling;
            if (ESCommentBox.classList.contains("ESCommentBox")) {
                ESCommentBox.classList.add("rhHidden");
            } else {
                Context.insertAdjacentHTML(
                    "afterEnd",
                    "<div class=\"ESCommentBox rhHidden\">" +
                    "    <div class=\"pagination\"></div>" +
                    "</div>" +
                    "<div class=\"row-spacer\"></div>"
                );
                Context.nextElementSibling.appendChild(CommentBox);
            }
            Context.insertAdjacentHTML(
                "afterBegin",
                "<a class=\"page_heading_btn MCBPButton\" title=\"Add a comment.\">" +
                "    <i class=\"fa fa-comment\"></i>" +
                "</a>"
            );
            Context.firstElementChild.addEventListener("click", function() {
                Popup.popUp(function() {
                    Popup.TextArea.focus();
                });
            });
        }
    }

    // Multi-Reply

    function addMRButton(Context) {
        var MR, Parent, ReplyButton, Permalink;
        MR = {
            Context: Context,
            Comment: Context.closest(SG ? ".comment" : ".comment_outer")
        };
        if (MR.Comment) {
            Parent = MR.Comment.closest(SG ? ".comment" : ".comment_outer");
            MR.Container = MR.Comment.getElementsByClassName(SG ? "comment__summary" : "comment_inner")[0];
            MR.Timestamp = MR.Context.firstElementChild;
            ReplyButton = MR.Context.getElementsByClassName(SG ? "js__comment-reply" : "js_comment_reply")[0];
            Permalink = MR.Context.lastElementChild;
            if (ReplyButton || Path.match(/^\/messages/)) {
                if (ReplyButton) {
                    ReplyButton.remove();
                    MR.ParentID = Parent.getAttribute(SG ? "data-comment-id" : "data-id");
                    if (Path.match(/^\/messages/)) {
                        MR.URL = Permalink.getAttribute("href");
                    }
                } else {
                    MR.URL = Permalink.getAttribute("href");
                    MR.Comment.insertAdjacentHTML("beforeEnd", "<div class=\"comment__children comment_children\"></div>");
                }
                if (SG) {
                    MR.TradeCode = "";
                } else {
                    if (!Path.match(/^\/messages/)) {
                        MR.TradeCode = Path.match(/^\/trade\/(.+)\//)[1];
                    }
                    MR.Username = MR.Comment.getElementsByClassName("author_name")[0].textContent;
                }
                MR.Timestamp.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MRReply\">Reply</a>");
                MR.Timestamp.nextElementSibling.addEventListener("click", function() {
                    if (!MR.Box) {
                        addMRBox(MR);
                    } else {
                        MR.Description.focus();
                    }
                });
            }
            MR.Children = MR.Comment.getElementsByClassName(SG ? "comment__children" : "comment_children")[0];
            setMREdit(MR);
        }
    }

    function addMRBox(MR) {
        var Username;
        Username = GM_getValue("Username");
        MR.Children.insertAdjacentHTML(
            "afterBegin",
            "<div class=\"comment reply_form MRBox\">" + (SG ? (
                "<div class=\"comment__child\">" +
                "    <a href=\"/user/" + Username + "\" class=\"global__image-outer-wrap global__image-outer-wrap--avatar-small\">" +
                "        <div class=\"global__image-inner-wrap\" style=\"background-image: url(" + GM_getValue("Avatar") + ");\"></div>" +
                "    </a>" +
                "    <div class=\"comment__summary\">" +
                "        <div class=\"comment__author\">" +
                "            <div class=\"comment__username\">" +
                "                <a href=\"/user/" + Username + "\">" + Username + "</a>" +
                "            </div>" +
                "        </div>" +
                "        <div class=\"comment__display-state\">" +
                "            <div class=\"comment__description\">") : "") +
            "                    <input name=\"trade_code\" type=\"hidden\" value=\"" + MR.TradeCode + "\">" +
            "                    <input name=\"parent_id\" type=\"hidden\" value=\"" + MR.ParentID + "\">" +
            "                    <textarea class=\"MRDescription\" name=\"description\"" + (SG ? "" : " placeholder=\"Write a reply to " + MR.Username + "...\"") + "></textarea>" +
            "                    <div class=\"align-button-container btn_actions\">" +
            "                        <div></div>" +
            "                        <div class=\"comment__cancel-button btn_cancel MRCancel\">" +
            "                            <span>Cancel</span>" +
            "                        </div>" +
            "                    </div>" + (SG ? (
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</div>") : "") +
            "</div>"
        );
        MR.Box = MR.Children.firstElementChild;
        MR.Description = MR.Box.getElementsByClassName("MRDescription")[0];
        MR.Cancel = MR.Box.getElementsByClassName("MRCancel")[0];
        if (GM_getValue("CFH")) {
            addCFHPanel(MR.Description);
        }
        MR.Description.focus();
        addDEDButton(MR.Box, MR.URL, function(Response, DEDStatus) {
            var ReplyID, Reply, ResponseJSON;
            if (SG) {
                ReplyID = Response.finalUrl.match(/#(.+)/);
                if (ReplyID) {
                    MR.Box.remove();
                    Reply = parseHTML(Response.responseText).getElementById(ReplyID[1]).closest(".comment");
                    addRMLLink(MR.Container, [Reply]);
                    loadEndlessFeatures(Reply);
                    MR.Children.appendChild(Reply);
                    window.location.hash = ReplyID[1];
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times\"></i> " +
                        "<span>Failed!</span>";
                }
            } else {
                ResponseJSON = parseJSON(Response.responseText);
                if (ResponseJSON.success) {
                    MR.Box.remove();
                    Reply = parseHTML(ResponseJSON.html).getElementsByClassName("comment_outer")[0];
                    addRMLLink(MR.Container, [Reply]);
                    loadEndlessFeatures(Reply);
                    MR.Children.appendChild(Reply);
                    window.location.hash = Reply.id;
                } else {
                    DEDStatus.innerHTML =
                        "<i class=\"fa fa-times\"></i> " +
                        "<span>Failed!</span>";
                }
            }
        });
        MR.Cancel.addEventListener("click", function() {
            MR.Box.remove();
            MR.Box = null;
        });
    }

    function setMREdit(MR) {
        var DisplayState, EditState, EditSave, ID, AllowReplies, Description;
        MR.Edit = MR.Context.getElementsByClassName(SG ? "js__comment-edit" : "js_comment_edit")[0];
        if (MR.Edit) {
            MR.Edit.insertAdjacentHTML("afterEnd", "<a class=\"comment__actions__button MREdit\">Edit</a>");
            MR.Edit = MR.Edit.nextElementSibling;
            MR.Edit.previousElementSibling.remove();
            DisplayState = MR.Comment.getElementsByClassName(SG ? "comment__display-state" : "comment_body_default")[0];
            EditState = MR.Comment.getElementsByClassName(SG ? "comment__edit-state" : "edit_form")[0];
            EditSave = EditState.getElementsByClassName(SG ? "js__comment-edit-save" : "js_submit")[0];
            EditSave.insertAdjacentHTML(
                "afterEnd",
                "<a class=\"comment__submit-button btn_action white EditSave\">" +
                "    <i class=\"fa fa-edit\"></i>" +
                "    <span>Edit</span>" +
                "</a>"
            );
            EditSave = EditSave.nextElementSibling;
            EditSave.previousElementSibling.remove();
            XSRFToken = EditState.querySelector("[name='xsrf_token']").value;
            ID = EditState.querySelector("[name='comment_id']").value;
            AllowReplies = SG ? EditState.querySelector("[name='allow_replies']").value : "";
            Description = EditState.querySelector("[name='description']");
            MR.Edit.addEventListener("click", function() {
                var Temp;
                if (SG) {
                    DisplayState.classList.add("is-hidden");
                    MR.Context.classList.add("is-hidden");
                } else {
                    MR.Container.classList.add("is_hidden");
                }
                EditState.classList.remove(SG ? "is-hidden" : "is_hidden");
                Temp = Description.value;
                Description.focus();
                Description.value = "";
                Description.value = Temp;
            });
            EditSave.addEventListener("click", function() {
                makeRequest("xsrf_token=" + XSRFToken + "&do=comment_edit&comment_id=" + ID + "&allow_replies=" + AllowReplies + "&description=" + encodeURIComponent(Description.value),
                            "/ajax.php", null, function(Response) {
                    var ResponseJSON, ResponseHTML;
                    ResponseJSON = parseJSON(Response.responseText);
                    if (ResponseJSON.type == "success" || ResponseJSON.success) {
                        ResponseHTML = parseHTML(ResponseJSON[SG ? "comment" : "html"]);
                        DisplayState.innerHTML = ResponseHTML.getElementsByClassName(SG ? "comment__display-state" : "comment_body_default")[0].innerHTML;
                        EditState.classList.add(SG ? "is-hidden" : "is_hidden");
                        MR.Timestamp.innerHTML = ResponseHTML.getElementsByClassName(SG ? "comment__actions" : "action_list")[0].firstElementChild.innerHTML;
                        setATTimestamp(MR.Timestamp.querySelector("[data-timestamp]"));
                        if (SG) {
                            DisplayState.classList.remove("is-hidden");
                            MR.Context.classList.remove("is-hidden");
                        } else {
                            MR.Container.classList.remove("is_hidden");
                        }
                    }
                });
            });
        }
    }

    // Game Tags

    function addGTButton(Context, Game, Title) {
        Context.insertAdjacentHTML(
            "beforeEnd",
            "<a class=\"GTButton\">" +
            "    <i class=\"fa fa-tag\"></i>" +
            "    <span class=\"GTTags\"></i>" +
            "</a>"
        );
        Context.lastElementChild.addEventListener("click", function() {
            var Popup, SavedGames;
            Popup = createPopup(true);
            Popup.Icon.classList.add("fa-tag");
            Popup.Title.innerHTML = "Edit game tags for <span>" + Title + "</span>:";
            Popup.TextInput.classList.remove("rhHidden");
            Popup.TextInput.insertAdjacentHTML("afterEnd", createDescription("Use commas to separate tags, for example: Tag1, Tag2, ..."));
            createButton(Popup.Button, "fa-check", "Save", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
                SavedGames = GM_getValue("Games");
                if (!SavedGames[Game]) {
                    SavedGames[Game] = {};
                }
                SavedGames[Game].Tags = Popup.TextInput.value.replace(/(,\s*)+/g, function(Match, P1, Offset, String) {
                    return (((Offset === 0) || (Offset == (String.length - Match.length))) ? "" : ", ");
                });
                GM_setValue("Games", SavedGames);
                addGTTags(Game, SavedGames[Game].Tags);
                Callback();
                Popup.Close.click();
            });
            Popup.popUp(function() {
                Popup.TextInput.focus();
                SavedGames = GM_getValue("Games");
                if (SavedGames[Game]) {
                    Popup.TextInput.value = SavedGames[Game].Tags;
                }
            });
        });
    }

    function addGTTags(Game, Tags) {
        var Matches, Prefix, Suffix, HTML, I, N;
        Matches = Games[Game];
        Prefix = "<span class=\"global__image-outer-wrap author_avatar is_icon\">";
        Suffix = "</span>";
        HTML = Tags ? Tags.replace(/^|,\s|$/g, function(Match, Offset, String) {
            return ((Offset === 0) ? Prefix : ((Offset == (String.length - Match.length)) ? Suffix : (Suffix + Prefix)));
        }) : "";
        for (I = 0, N = Matches.length; I < N; ++I) {
            Matches[I].getElementsByClassName("GTTags")[0].innerHTML = HTML;
        }
    }

    // Giveaway Winners Link

    function addGWLLink(Context) {
        var Columns, Copies, Match, Entries, URL, Link;
        Columns = Context.getElementsByClassName("giveaway__columns")[0];
        if (parseInt(Columns.querySelector("[data-timestamp]").getAttribute("data-timestamp")) < ((new Date().getTime()) / 1000)) {
            Copies = Context.getElementsByClassName("giveaway__heading__thin")[0].textContent;
            Match = Copies.match(/\((.+) Copies\)/);
            Copies = Match ? Match[1] : (Columns.textContent.match("No winners") ? 0 : 1);
            Entries = Context.getElementsByClassName("giveaway__links")[0].firstElementChild;
            URL = Entries.getAttribute("href");
            Link = URL ? (" href=\"" + URL.match(/(.+)\/entries/)[1] + "/winners\"") : "";
            Entries.insertAdjacentHTML(
                "afterEnd",
                "<a class=\"GWLLink\"" + Link + ">" +
                "    <i class=\"fa fa-trophy\"></i>" +
                "    <span>" + Copies + " winners</span>" +
                "</a>"
            );
        }
    }

    // Main Post Popup

    function addMPPButton(Context) {
        var MPPPost, Sibling, Visited, Timestamp, Hidden;
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"MPPButton\" title=\"Open the main post.\">" +
            "    <i class=\"fa fa-home\"></i>" +
            "</a>"
        );
        MPPPost = document.createElement("div");
        MPPPost.className = "page__outer-wrap";
        do {
            Sibling = Context.previousElementSibling;
            if (Sibling) {
                MPPPost.insertBefore(Sibling, MPPPost.firstElementChild);
            }
        } while (Sibling);
        Context.parentElement.insertBefore(MPPPost, Context);
        if (GM_getValue("CT")) {
            Visited = GM_getValue("Comments" + (SG ? "" : "_ST"))[Path.match(/^\/(giveaway(?!.+(entries|winners))|discussion|support\/ticket|trade)\/(.+?)\//)[3]];
            Timestamp = MPPPost.querySelectorAll("[data-timestamp]");
            Timestamp = parseInt(Timestamp[Timestamp.length - 1].getAttribute("data-timestamp"));
            Hidden = Visited ? ((Visited[""] == Timestamp) ? true : false) : false;
        } else {
            Hidden = true;
        }
        MPPPost.classList.add(Hidden ? "MPPPostOpen" : "MPPPostDefault");
        Context.firstElementChild.addEventListener("click", function() {
            if (!Hidden) {
                MPPPost.classList.remove("MPPPostDefault");
                MPPPost.classList.add("MPPPostOpen");
            }
            $(MPPPost).bPopup({
                amsl: [0],
                fadeSpeed: 200,
                followSpeed: 500,
                modalColor: "#3c424d",
                opacity: 0.85,
                onClose: function() {
                    if (!Hidden) {
                        MPPPost.classList.remove("MPPPostOpen");
                        MPPPost.classList.add("MPPPostDefault");
                        MPPPost.removeAttribute("style");
                        Context.parentElement.insertBefore(MPPPost, Context);
                    }
                }
            });
        });
    }

    // Discussion Edit Detector

    function addDEDButton(Context, CommentURL, DEDCallback) {
        var TradeCode, ParentID, Description, URL, DEDButton, DEDStatus, ResponseHTML;
        if (!XSRFToken && !CommentURL) {
            XSRFToken = document.querySelector("[name='xsrf_token']").value;
        }
        TradeCode = Context.querySelector("[name='trade_code']");
        TradeCode = TradeCode ? TradeCode.value : "";
        ParentID = Context.querySelector("[name='parent_id']");
        Description = Context.querySelector("[name='description']");
        URL = SG ? Location.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
        Context = Context.getElementsByClassName(SG ? "align-button-container" : "btn_actions")[0];
        Context.firstElementChild.remove();
        Context.insertAdjacentHTML("afterBegin", "<div class=\"DEDButton\"></div>");
        Context.insertAdjacentHTML("beforeEnd", "<div class=\"comment__actions action_list DEDStatus\"></div>");
        DEDButton = Context.firstElementChild;
        DEDStatus = Context.lastElementChild;
        createButton(DEDButton, "fa-send", "Submit", "fa-circle-o-notch fa-spin", "Saving...", function(Callback) {
            DEDStatus.innerHTML = "";
            if (CommentURL) {
                makeRequest(null, CommentURL, DEDStatus, function(Response) {
                    ResponseHTML = parseHTML(Response.responseText);
                    XSRFToken = ResponseHTML.querySelector("[name='xsrf_token']").value;
                    TradeCode = SG ? "" : Response.finalUrl.match(/\/trade\/(.+)\//)[1];
                    ParentID = ResponseHTML.getElementById(CommentURL.match(/\/comment\/(.+)/)[1]);
                    ParentID = SG ? ParentID.closest(".comment").getAttribute("data-comment-id") : ParentID.getAttribute("data-id");
                    URL = SG ? Response.finalUrl.match(/(.+?)(#.+?)?$/)[1] : "/ajax.php";
                    saveComment(TradeCode, ParentID, Description.value, URL, DEDStatus, Callback, DEDCallback);
                });
            } else {
                saveComment(TradeCode, ParentID.value, Description.value, URL, DEDStatus, Callback, DEDCallback);
            }
        }, null, true);
    }

    // Reply Mention Link

    function setRMLLink(Context) {
        var Matches;
        Matches = Context.children;
        if (Matches.length) {
            addRMLLink(SG ? Context.parentElement.getElementsByClassName("comment__summary")[0] : Context.parentElement, Matches);
        }
    }

    function addRMLLink(Context, Matches) {
        var Username, ID, I, N, RMLLink;
        Username = Context.getElementsByClassName(SG ? "comment__username" : "author_name")[0].textContent.trim();
        ID = Context.id;
        for (I = 0, N = Matches.length; I < N; ++I) {
            Context = Matches[I].getElementsByClassName(SG ? "comment__actions" : "action_list")[0];
            RMLLink = Context.getElementsByClassName("RMLLink")[0];
            if (RMLLink) {
                RMLLink.textContent = "@" + Username;
            } else {
                Context.insertAdjacentHTML("beforeEnd", "<a class=\"comment__actions__button RMLLink\" href=\"#" + ID + "\">@" + Username + "</a>");
            }
        }
    }

    // Archive Searcher

    function addASButton(Context) {
        var Popup, Category, AS, ASButton;
        Popup = createPopup();
        Popup.Popup.style.width = "600px";
        Popup.Icon.classList.add("fa-folder");
        Category = Path.match(/^\/archive\/(coming-soon|open|closed|deleted)/);
        Popup.Title.textContent = "Search archive" + (Category ? (" for " + Category[1] + " giveaways") : "") + ":";
        Popup.TextInput.classList.remove("rhHidden");
        AS = {};
        createOptions(Popup.Options, AS, [{
            Check: function() {
                return true;
            },
            Description: "Search by AppID.",
            Title: "If unchecked, a search by exact title will be performed.",
            Key: "AIS",
            Name: "AppIDSearch",
            ID: "AS_AIS"
        }]);
        Context.insertAdjacentHTML(
            "afterBegin",
            "<a class=\"ASButton\" title=\"Search archive.\">" +
            "    <i class=\"fa fa-folder\"></i>" +
            "    <i class=\"fa fa-search\"></i>" +
            "</a>"
        );
        ASButton = Context.firstElementChild;
        createButton(Popup.Button, "fa-search", "Search", "fa-times-circle", "Cancel", function(Callback) {
            ASButton.classList.add("rhBusy");
            AS.Progress.innerHTML = AS.OverallProgress.innerHTML = AS.Results.innerHTML = "";
            AS.Popup.reposition();
            AS.Canceled = false;
            AS.Query = Popup.TextInput.value;
            if (AS.Query) {
                if (AS.AIS.checked) {
                    AS.Progress.innerHTML =
                        "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                        "<span>Retrieving game title...</span>";
                    makeRequest(null, "https://steamcommunity.com/app/" + AS.Query, AS.Progress, function(Response) {
                        var Title;
                        Title = parseHTML(Response.responseText).getElementsByClassName("apphub_AppName")[0];
                        if (Title) {
                            AS.Query = Title.textContent;
                            setASSearch(AS, ASButton, Callback);
                        } else {
                            ASButton.classList.remove("rhBusy");
                            AS.Progress.innerHTML =
                                "<i class=\"fa fa-times-circle\"></i> " +
                                "<span>Game title not found. Make sure you are entering a valid AppID. For example, 229580 is the AppID for Dream (http://steamcommunity.com/app/229580).</span>";
                            Callback();
                        }
                    });
                } else {
                    setASSearch(AS, ASButton, Callback);
                }
            } else {
                ASButton.classList.remove("rhBusy");
                AS.Progress.innerHTML =
                    "<i class=\"fa fa-times-circle\"></i> " +
                    "<span>Please enter a title / AppID.</span>";
                Callback();
            }
        }, function() {
            clearInterval(AS.Request);
            AS.Canceled = true;
            setTimeout(function() {
                AS.Progress.innerHTML = "";
            }, 500);
            ASButton.classList.remove("rhBusy");
        });
        AS.Progress = Popup.Progress;
        AS.OverallProgress = Popup.OverallProgress;
        AS.Results = Popup.Results;
        ASButton.addEventListener("click", function() {
            AS.Popup = Popup.popUp(function() {
                Popup.TextInput.focus();
            });
        });
    }

    function setASSearch(AS, ASButton, Callback) {
        AS.Query = ((AS.Query.length >= 50) ? AS.Query.slice(0, 50) : AS.Query).toLowerCase();
        searchASGame(AS, Location.match(/(.+?)(\/search.+?)?$/)[1] + "/search?q=" + encodeURIComponent(AS.Query) + "&page=", 1, function() {
            ASButton.classList.remove("rhBusy");
            AS.Progress.innerHTML = "";
            Callback();
        });
    }

    function searchASGame(AS, URL, NextPage, Callback) {
        if (!AS.Canceled) {
            AS.Progress.innerHTML =
                "<i class=\"fa fa-circle-o-notch fa-spin\"></i> " +
                "<span>Loading page " + NextPage + "...</span>";
            queueRequest(AS, null, URL + NextPage, function(Response) {
                var ResponseHTML, Matches, I, N, Title, Pagination;
                ResponseHTML = parseHTML(Response.responseText);
                Matches = ResponseHTML.getElementsByClassName("table__row-outer-wrap");
                for (I = 0, N = Matches.length; I < N; ++I) {
                    Title = Matches[I].getElementsByClassName("table__column__heading")[0].textContent.match(/(.+?)( \(.+ Copies\))?$/)[1];
                    if (Title.toLowerCase() == AS.Query) {
                        AS.Results.appendChild(Matches[I].cloneNode(true));
                        loadEndlessFeatures(AS.Results.lastElementChild);
                        AS.Popup.reposition();
                    }
                }
                AS.OverallProgress.textContent = AS.Results.children.length + " giveaways found...";
                Pagination = ResponseHTML.getElementsByClassName("pagination__navigation")[0];
                if (Pagination && !Pagination.lastElementChild.classList.contains("is-selected")) {
                    searchASGame(AS, URL, ++NextPage, Callback);
                } else {
                    Callback();
                }
            });
        }
    }

    // Styles

    function addStyles() {
        var Temp, Positive, Negative;
        document.body.insertAdjacentHTML(
            "beforeEnd",
            "<span class=\"author_small\">" +
            "    <span class=\"giveaway__column--positive is_positive\"></span>" +
            "    <span class=\"giveaway__column--negative is_negative\"></span>" +
            "</span>"
        );
        Temp = document.body.lastElementChild;
        Positive = window.getComputedStyle(Temp.firstElementChild).color;
        Negative = window.getComputedStyle(Temp.lastElementChild).color;
        Temp.remove();
        GM_addStyle(
            ".markdown {" +
            "    word-break: break-word;" +
            "}" +
            ".rhHidden {" +
            "    display: none !important;" +
            "}" +
            ".rhBold {" +
            "    font-weight: bold;" +
            "}" +
            ".rhItalic {" +
            "    font-style: italic;" +
            "}" +
            ".rhBusy >*, .CFHALIPF {" +
            "    opacity: 0.2;" +
            "}" +
            ".rhFaded .giveaway__summary >:not(.GPPanel):not(.giveaway__columns), .rhFaded .giveaway__columns >:not(.GGPContainer), .rhFaded .global__image-outer-wrap--game-medium {" +
            "    opacity: 0.5;" +
            "}" +
            ".rhPopup {" +
            "    max-width: none;" +
            "    min-width: 300px;" +
            "    width: 300px;" +
            "}" +
            ".rhPopupIcon {" +
            "    height: 48px;" +
            "    width: 48px;" +
            "}" +
            ".rhPopupTitle span {" +
            "    font-weight: bold;" +
            "}" +
            ".rhPopupTextArea {" +
            "    max-height: 200px !important;" +
            "    min-height: 200px !important;" +
            "}" +
            ".rhPopupOptions, .rhDescription, .SMFeatures {" +
            "    margin: 5px;" +
            "}" +
            ".rhPopupButton {" +
            "    display: flex;" +
            "    justify-content: center;" +
            "    margin: 15px 0 0;" +
            "}" +
            ".rhPopupButton div {" +
            "    justify-content: center;" +
            "    line-height: normal;" +
            "    margin: 0 !important;" +
            "    min-width: 200px;" +
            "    padding: 7px 15px;" +
            "}" +
            ".rhPopupButton div >* {" +
            "    flex: 0;" +
            "}" +
            ".rhPopupStatus {" +
            "    margin: 15px 0;" +
            "}" +
            ".rhPopupResults {" +
            "    margin: 0 !important;" +
            "    max-height: 200px;" +
            "    overflow: auto;" +
            "}" +
            ".rhPopupResults >* {" +
            "    margin: 0 0 15px;" +
            "}" +
            ".rhPopupResults .popup__actions, .comment__actions .RMLLink {" +
            "    margin: 0 0 0 10px;" +
            "}" +
            ".rhPopupResults .popup__actions >* {" +
            "    border: 0;" +
            "    cursor: initial;" +
            "    display: inline-block;" +
            "}" +
            ".rhPopupResults .popup__actions a {" +
            "    border-bottom: 1px dotted;" +
            "}" +
            ".rhPopupResults .table__row-outer-wrap {" +
            "    margin: 0;" +
            "    text-align: left;" +
            "}" +
            ".rhPopout {" +
            "    align-self: baseline;" +
            "    background-color: #fff;" +
            "    border: 1px solid #d2d6e0;" +
            "    border-radius: 5px;" +
            "    font-size: 12px;" +
            "    padding: 5px !important;" +
            "    position: absolute;" +
            "    text-shadow: none;" +
            "    width: 375px;" +
            "    z-index: 997;" +
            "}" +
            ".rhCheckbox, .APAvatar, .APLink, .APLink >* {" +
            "    cursor: pointer;" +
            "}" +
            ".rhWBIcon {" +
            "    display: inline-block;" +
            "    line-height: normal;" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".rhWBIcon i {" +
            "    border: 0;" +
            "    line-height: normal;" +
            "    margin: 0;" +
            "    text-shadow: none !important;" +
            "}" +
            ".SMMenu .form__submit-button {" +
            "    margin: 0 5px;" +
            "}" +
            ".SMTags >* {" +
            "    display: none;" +
            "}" +
            ".SMTag {" +
            "    display: block;" +
            "}" +
            ".SMRecentUsernameChanges a, .SMComments a {" +
            "    border-bottom: 1px dotted;" +
            "}" +
            ".SMSyncFrequency {" +
            "    display: block;" +
            "    width: 200px;" +
            "}" +
            ".FEHeader {" +
            "    height: auto !important;" +
            "    position: fixed;" +
            "    top: 0;" +
            "    width: 100%;" +
            "    z-index: 999 !important;" +
            "}" +
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
            "}" +
            ".FESidebar {" +
            "    position: fixed;" +
            "}" +
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
            "}" +
            ".ESHeading {" +
            "    margin: 0 0 5px;" +
            "}" +
            ".ESRecentDiscussions {" +
            "    margin: 25px 0;" +
            "}" +
            ".ESCommentBox {" +
            "    margin: 5px 0 15px;" +
            "    padding: 0;" +
            "}" +
            ".ESPanel >*:not(:last-child), .APBox .featured__table__row__left, .MRReply, .MREdit {" +
            "    margin: 0 10px 0 0;" +
            "}" +
            ".ESStatus {" +
            "    margin: 5px 0;" +
            "    text-align: center;" +
            "}" +
            ".GVView {" +
            "    text-align: center;" +
            "}" +
            ".GVContainer {" +
            "    border: 0 !important;" +
            "    box-shadow: none !important;" +
            "    display: inline-block;" +
            "    margin: 5px;" +
            "    padding: 0;" +
            "}" +
            ".GVContainer .giveaway__columns:not(.GPPanel) {" +
            "    display: block;" +
            "}" +
            ".GVContainer .giveaway__columns:not(.GPPanel) >:first-child {" +
            "    margin: 0;" +
            "}" +
            ".GVIcons {" +
            "    position: absolute;" +
            "    width: 25px;" +
            "}" +
            ".GVIcons >:not(.GGPContainer) {" +
            "    text-align: center;" +
            "}" +
            ".GVIcons >* {" +
            "    border-radius: 2px;" +
            "    display: block;" +
            "    line-height: normal;" +
            "    padding: 2px;" +
            "    margin: 0 !important;" +
            "}" +
            ".GVIcons .GGPButton {" +
            "    padding: 0;" +
            "}" +
            ".GVBox {" +
            "    display: block;" +
            "    margin: 0 0 0 25px;" +
            "}" +
            ".GVBox >:first-child {" +
            "    margin: 0 !important;" +
            "}" +
            ".GVInfo {" +
            "    align-items: center;" +
            "    display: flex;" +
            "    position: absolute;" +
            "    text-align: left;" +
            "    z-index: 1;" +
            "}" +
            ".GVInfo >:last-child {" +
            "    margin: -35px 0 0 5px;" +
            "}" +
            ".GVInfo .text-right {" +
            "    text-align: left;" +
            "}" +
            ".GVInfo .GPLinks, .GVInfo .GPPanel {" +
            "    float: none;" +
            "}" +
            ".ESPanel .pagination__navigation >*, .ESPanel .pagination_navigation >*, .ESRefresh, .ESPause, .UHButton, .PUNButton, .MTButton, .MTAll, .MTNone, .MTInverse, .WBCButton," +
            ".NAMWCButton, .NRFButton, .GTSView, .UGSButton, .GDCBPButton, .CTGoToUnread, .CTMarkRead, .CTMarkVisited, .MCBPButton, .MPPButton, .ASButton {" +
            "    cursor: pointer;" +
            "    display: inline-block;" +
            "}" +
            ".SGPBButton i, .SGPBButton img {" +
            "    height: 14px;" +
            "    width: 14px;" +
            "}" +
            ".UHBox {" +
            "    background-position: center;" +
            "    margin: 5px 0 0;" +
            "    max-height: 75px;" +
            "    overflow: auto;" +
            "    padding: 10px;" +
            "    position: absolute;" +
            "    text-align: center;" +
            "    width: 150px !important;" +
            "}" +
            ".UHBox .featured__table__row__left, .PUTButton i, .MTUserCheckbox i, .MTGameCheckbox i, .CFHPanel span >:first-child >* {" +
            "    margin: 0 !important;" +
            "}" +
            ".PUTButton, .GTButton {" +
            "    border: 0! important;" +
            "    cursor: pointer;" +
            "    display: inline-block;" +
            "    line-height: normal;" +
            "    margin: 0 0 0 5px;" +
            "    text-decoration: none !important;" +
            "}" +
            ".author_name + .PUTButton {" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".PUTTags, .GTTags {" +
            "    font-size: 10px;" +
            "    font-weight: bold;" +
            "}" +
            ".PUTTags >*, .GTTags >* {" +
            "    display: inline-block !important;" +
            "    height: auto;" +
            "    margin: 0;" +
            "    padding: 1px 2px;" +
            "    width: auto;" +
            "}" +
            ".PUTTags >:not(:first-child), .CTPanel >:not(:first-child), .GTTags >:not(:first-child) {" +
            "    margin: 0 0 0 5px;" +
            "}" +
            ".MTTag {" +
            "    display: inline-block;" +
            "}" +
            ".MTUserCheckbox, .MTGameCheckbox {" +
            "    display: inline-block;" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".NAMWCPositive {" +
            "    color: " + Positive + " !important;" +
            "    font-weight: bold;" +
            "}" +
            ".NAMWCNegative {" +
            "    color: " + Negative + " !important;" +
            "    font-weight: bold;" +
            "}" +
            ".APBox .featured__outer-wrap {" +
            "    padding: 5px;" +
            "    width: 365px;" +
            "}" +
            ".APBox .featured__inner-wrap, .MPPPostDefault {" +
            "    padding: 0;" +
            "}" +
            ".APBox .global__image-outer-wrap--avatar-large {" +
            "    height: 64px;" +
            "    margin: 5px;" +
            "    width: 64px;" +
            "}" +
            ".APBox .featured__heading, .APBox .sidebar__shortcut-inner-wrap {" +
            "    margin: 0;" +
            "}" +
            ".APBox .featured__heading__medium {" +
            "    font-size: 18px;" +
            "}" +
            ".APBox .featured__table {" +
            "    display: inline-block;" +
            "    width: 100%;" +
            "}" +
            ".APBox .featured__table__row {" +
            "    padding: 2px;" +
            "}" +
            ".GTSApply, .GTSDelete, .CTButton {" +
            "    cursor: pointer;" +
            "}" +
            ".GTSSave {" +
            "    display: inline-block;" +
            "    margin: 0 0 0 5px;" +
            "}" +
            ".SGGSticky {" +
            "    margin: 0 5px 0 0;" +
            "    opacity: 0.5;" +
            "}" +
            ".SGGUnsticky {" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".AGSPanel {" +
            "    margin: 0 0 15px 0;" +
            "}" +
            ".AGSFilter {" +
            "    display: flex;" +
            "}" +
            ".AGSFilter >* {" +
            "    display: inline-flex;" +
            "    justify-content: space-between;" +
            "    margin: 5px;" +
            "    width: 150px;" +
            "}" +
            ".AGSPanel input, .AGSPanel select {" +
            "    padding: 0 5px;" +
            "    width: 50px;" +
            "}" +
            ".EGHIcon {" +
            "    cursor: pointer;" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".GGPContainer {" +
            "    padding: 0;" +
            "}" +
            ".GGPButton {" +
            "    cursor: pointer;" +
            "    padding: 0 8px;" +
            "}" +
            ".GGPBox {" +
            "    line-height: normal;" +
            "    max-height: 300px;" +
            "    opacity: 1 !important;" +
            "    overflow: auto;" +
            "    width: 400px;" +
            "}" +
            ".GPLinks {" +
            "    float: left;" +
            "    margin: 2px;" +
            "}" +
            ".GPPanel {" +
            "    float: right;" +
            "    margin: 2px;" +
            "}" +
            ".ELGBButton, .ELGBButton + div {" +
            "    background: none;" +
            "    border: 0;" +
            "    box-shadow: none;" +
            "    padding: 0;" +
            "}" +
            ".ELGBButton >*, .ELGBButton + div >* {" +
            "    line-height: inherit;" +
            "    margin: 0;" +
            "}" +
            ".GDCBPPopup {" +
            "    overflow: auto;" +
            "    max-height: 75%;" +
            "    max-width: 75%;" +
            "    min-width: 600px;" +
            "}" +
            ".DHHighlight, .GHHighlight {" +
            "    background-color: " + Positive.replace(/rgb/, "rgba").replace(/\)/, ", 0.2)") + ";" +
            "}" +
            ".DHIcon {" +
            "    cursor: pointer;" +
            "    margin: 0 5px 0 0;" +
            "}" +
            ".comment__actions .CTButton {" +
            "    margin: 0 0 0 10px;" +
            "}" +
            ".comment__actions >:first-child + .CTButton {" +
            "    margin: 0;" +
            "}" +
            ".CFHPanel {" +
            "    margin: 0 0 2px;" +
            "    text-align: left;" +
            "}" +
            ".CFHPanel >* {" +
            "    display: inline-block;" +
            "    margin: 1px !important;" +
            "    padding: 0;" +
            "}" +
            ".CFHPanel span >:first-child {" +
            "    cursor: pointer;" +
            "    display: flex;" +
            "    padding: 0 5px;" +
            "}" +
            ".CFHPanel span >:not(:first-child), .DEDStatus {" +
            "    display: block;" +
            "}" +
            ".CFHPanel span i {" +
            "    line-height: 22px;" +
            "}" +
            ".CFHPanel .form__saving-button {" +
            "    display: inline-block;" +
            "    margin: 5px;" +
            "    min-width:0;" +
            "}" +
            ".CFHPanel table {" +
            "    display: block;" +
            "    max-height: 200px;" +
            "    max-width: 375px;" +
            "    overflow: auto;" +
            "}" +
            ".CFHPanel table td:first-child {" +
            "   min-width: 25px;" +
            "   text-align: center;" +
            "}" +
            ".CFHPanel table td:not(:first-child) {" +
            "   min-width: 75px;" +
            "   text-align: center;" +
            "}" +
            ".CFHEmojis {" +
            "    display: block !important;" +
            "    font-size: 18px;" +
            "    max-height: 150px;" +
            "    overflow: auto;" +
            "    text-align: center;" +
            "}" +
            ".CFHEmojis >* {" +
            "    cursor: pointer;" +
            "    display: inline-block;" +
            "    margin: 2px;" +
            "}" +
            ".CFHPanel ~ textarea {" +
            "    max-height: 475px;" +
            "}" +
            ".MPPPostOpen {" +
            "    display: none;" +
            "    max-height: 75%;" +
            "    overflow: auto;" +
            "    padding: 15px;" +
            "    position: absolute;" +
            "    width: 75%;" +
            "}"
        );
    }
})();