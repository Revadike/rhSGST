# rhSGST

A script that adds some cool features to SteamGifts and SteamTrades.

## Installation

To install the script, you must install [Tampermonkey](https://tampermonkey.net/) or [Greasemonkey](http://www.greasespot.net/) first. Then [click here](https://github.com/revilheart/rhSGST/raw/master/rhSGST.user.js) and you should be prompted to install it.

## Compatibility

Fully tested and working in the latest version of:

* Google Chrome (Tampermonkey)

Should be working in the latest version of:

* Firefox (Greasemonkey & Tampermonkey)
* Opera (Tampermonkey)

Tested on Microsoft Edge and most of it seems to work fine, but for some reason requests made from `https://www.steamgifts.com/account` redirect to `https://www.steamgifts.com`. I haven't been able to figure out why yet, so avoid Edge for now.

## Features

* [Settings Menu](#settings-menu)
* [Featured Container Hider](#featured-container-hider)
* [Blacklist Stats Hider](#blacklist-stats-hider)
* [Fixed Elements](#fixed-elements)
* [Endless Scrolling](#endless-scrolling)
* [Grid View](#grid-view)
* [SteamGifts Profile Button](#steamgifts-profile-button)
* [SteamTrades Profile Button](#steamtrades-profile-button)
* [Shared Groups Checker](#shared-groups-checker)
* [Comment History](#comment-history)
* [Username History](#username-history)
* [Permanent User Notes](#permanent-user-notes)
* [Permanent User Tags](#permanent-user-tags)
* [Multi-Tag](#multi--tag)
* [Whitelist / Blacklist Highlighter](#whitelist--blacklist-highlighter)
* [Whitelist / Blacklist Checker](#whitelist--blacklist-checker)
* [Real Won / Sent CV Links](#real-won--sent-cv-links)
* [Not Activated / Multiple Wins Checker](#not-activated--multiple-wins-checker)
* [Not Received Finder](#not-received-finder)
* [Avatar Popout](#avatar-popout)
* [Unsent Gifts Sender](#unsent-gifts-sender)
* [Giveaway Templates](#giveaway-templates)
* [Stickied Giveaway Groups](#stickied-giveaway-groups)
* [Header Icons Refresher](#header-icons-refresher)
* [Advanced Giveaway Search](#advanced-giveaway-search)
* [Points Refresher](#points-refresher)
* [Entered Games Highlighter](#entered-games-highlighter)
* [Entered Giveaways Filter](#entered-giveaways-filter)
* [Enter / Leave Giveaway Button](#enter--leave-giveaway-button)
* [Giveaway Description / Comment Box Popup](#giveaway-description--comment-box-popup)
* [Giveaway Winning Chance](#giveaway-winning-chance)
* [Giveaway Groups Popout](#giveaway-groups-popout)
* [Discussions Highlighter](#discussions-highlighter)
* [Comment Tracker](#comment-tracker)
* [Accurate Timestamp](#accurate-timestamp)
* [Comment Formatting Helper](#comment-formatting-helper)
* [Main Comment Box Popup](#main-comment-box-popup)
* [Multi-Reply](#multi-reply)
* [Reply From Inbox](#reply-from-inbox)
* [Game Tags](#game-tags)
* [Giveaway Winners Link](#giveaway-winners-link)
* [Main Post Popup](#main-post-popup)
* [Discussion Edit Detector](#discussion-edit-detector)
* [Reply Mention Link](#reply-mention-link)
* [Archive Searcher](#archive-searcher)
* [Other Info](#other-info)

### Settings Menu

`steamgifts.com/account/*`

* Allows you to enable / disable features.
* Allows you import / export your data.
* Allows you to manage `Whitelist / Blacklist Highlighter` and `Not Activated / Multiple Wins Checker` caches.
* Allows you to sync your data and enable / disable the automatic sync.

### Featured Container Hider

`steamgifts.com/giveaways/*`

![](http://i.imgur.com/QjTxvo2.png)

* Hides the featured container in the giveaways pages.

### Blacklist Stats Hider

`steamgifts.com/stats/personal/community`

![](http://i.imgur.com/yB3pQSI.png)

* Hides blacklist stats in the stats page.

### Fixed Elements

`(steamgifts|steamtrades).com/*`

* Allows you to fix the header, heading, sidebar and footer, so that they scroll together with the page.
* You can disable any of the elements through the settings menu.
* In case it isn't clear, this is the heading:

![](http://i.imgur.com/6Hk0nus.png)

### Endless Scrolling

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/sCJ97Dk.png)

* Allows you to endlessly scroll through pages.
* You can choose in which pages you want to enable the endless scrolling from the settings menu.
* If you click on the link to a page and that page is currently loaded, it will jump to the page instead of loading it. This only works on SteamGifts though, and if you jump between pages that aren't next to each other, the pagination gets messed up, but you can fix it by then going to the immediate previous / next page and returning.
* You can refresh pages without leaving the page.
* You can pause / resume the endless scrolling.
* You can enable reverse scrolling for discussions.

### Grid View

`steamgifts.com/giveaways*`

![](http://i.imgur.com/jhd1m4A.png)

### SteamGifts Profile Button

`steamtrades.com/user/*`

![](http://i.imgur.com/k4P3OMy.png)

* Adds a button that links to an user's SteamGifts profile.

### SteamTrades Profile Button

`steamgifts.com/user/*`

![](http://i.imgur.com/iJxVz6D.png)

* Adds a button that links to an user's SteamTrades profile.

### Shared Groups Checker

`steamgifts.com\/*`

![](http://i.imgur.com/5NkCrum.png)

* Allows you to check which groups you and another user have in common.

### Comment History

`steamgifts.com/*`

![](http://i.imgur.com/lDSXYcS.png)

* Keeps track of the comments you make (they can be seen from the settings menu).
* This feature **only** works with Main Comment Box Popup, Discussion Edit Detector and Multi-Reply / Reply From Inbox. If you submit a comment though SG's native comment box, the comment will not be tracked.

### Username History

`steamgifts.com/user/*`

![](http://i.imgur.com/cTnt7sk.png)

* Keeps track of usernames from the [database](https://docs.google.com/spreadsheets/d/1rZQuo6T02zutwSo1edbDzW8q9GmpDIbaVvKN79TyFqA/edit?usp=sharing) and detects username changes every month.
* There are currently 7200+ users being tracked.
* An user is added to the database when you click on the arrow next to their username.
* You can view recent username changes from the settings menu.

### Permanent User Notes

`(steamgifts|steamtrades).com/user/*`

![](http://i.imgur.com/lF9YKjm.png)
![](http://i.imgur.com/1AvN0Co.png)

* Allows you to add notes to users.
* The notes are permanent because they are tied to an user's SteamID64 instead of their username.
* The icon changes if the notes are not empty:

![](http://i.imgur.com/PYm3Ds7.png)

### Permanent User Tags

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/AIPs4d1.png)
![](http://i.imgur.com/4660IaT.png)

* Allows you to add tags to users.
* Unlike the permanent user notes, the tags are not tied to an user's SteamID64, because that information is only available in the profile page, but they are still permament because upon adding a tag to an user, it automatically detects username changes and returns any old tags you might have saved for that user before they changed their username.
* While the tags are not tied to an user's SteamID64, it still has to retrieve the user's profile page in order to save to the storage, so if you're adding tags to an user for the first time, it might take a while to do so.
* Separation of tags is purely cosmetic.

### Multi-Tag

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/aZRQkxr.png)
![](http://i.imgur.com/mhjTmn1.png)

* Allows you to tag multiple users / games at the same time.
* It goes without saying that this feature only works if either Permanent User Notes or Game Tags are enabled.

### Whitelist / Blacklist Highlighter

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/rxqGu9i.png)
![](http://i.imgur.com/mRIrwb7.png)

* Adds a heart or ban icon next to the username of all users from your whitelist / blacklist.
* The users must be scanned through the settings menu for the feature to work. You can scan them manually or enable the automatic scan to run every once in a while.

### Whitelist / Blacklist Checker

`steamgifts.com/*`

![](http://i.imgur.com/KDAHDme.png)
![](http://i.imgur.com/x6AWyp7.png)

* Allows you to check if an user or a list of users have whitelisted / blacklisted you.
* Results are cached for 24 hours.
* The caches can be seen and updated from the settings menu.
* The checker has a simplified version that only checks / shows whitelists. It can be activated from the settings menu by enabling `Show blacklist information.`. If this version is activated and the checker finds an user that has blacklisted you, it will return `There is not enough information to know if you are whitelisted or blacklisted.` instead of `You are blacklisted.`.
* You can highlight users who have whitelisted / blacklisted you by enabling this option through the settings menu. This functionality is supported on SteamTrades (`steamtrades.com/*`). The following icons will be added next to their username:

![](http://i.imgur.com/yPoDrnm.png)
![](http://i.imgur.com/BRLSAXD.png)

### Real Won / Sent CV Links

`steamgifts.com/user/*`

![](http://i.imgur.com/NvGf47L.png)
![](http://i.imgur.com/Shwsgdh.png)

* Adds links to an user's SGTools real won / sent CV pages.

### Not Activated / Multiple Wins Checker

`steamgifts.com/(user|giveaway/.../winners)/*`

![](http://i.imgur.com/QsNfLPJ.png)
![](http://i.imgur.com/vaSRuPJ.png)
![](http://i.imgur.com/nBeDvPw.png)

* Allows you to check if an user or a page of winners from a giveaway have any not activated / multiple wins.
* Results are cached for 7 days.
* The caches can be seen from the settings menu (updating all of them at once is not possible).
* You can highlight users who have not received / multiple wins by enabling this option through the settings menu. This functionality is supported on SteamTrades (`steamtrades.com/*`). Their username will change to the following colors:

![](http://i.imgur.com/6Oo1Bkg.png)
![](http://i.imgur.com/IH9khSq.png)

### Not Received Finder

`steamgifts.com/user/*`

![](http://i.imgur.com/lgjr9mo.png)
![](http://i.imgur.com/8AXpAd2.png)

* Allows you to find an user's not received giveaways.
* If the user doesn't have any not received giveaways, the button will not appear.
* Results are cached for 7 days.

### Avatar Popout

`steamgifts.com/*`

![](http://i.imgur.com/aEEKnim.png)
![](http://i.imgur.com/o8os3un.png)

* Pops out a box with info about an user / group if you click on their avatar.
* Has all the features that run on `steamgifts.com/user/*` built-in.

### Unsent Gifts Sender

`steamgifts.com/created/*`

![](http://i.imgur.com/IXgP9G0.png)
![](http://i.imgur.com/69wbkUP.png)

* Allows you to send all your unsent gifts directly from your created giveaways page.
* You can choose to only send the gifts to winners with 0 not activated / multiple wins or who are whitelisted.

### Giveaway Templates

`steamgifts.com/giveaways/new`

![](http://i.imgur.com/yl9ogWx.png)
![](http://i.imgur.com/PFML0cc.png)

* Allows you to save giveaway templates for later use.
* To edit a template, simply apply it normally, perform your changes and save it with the same name.

### Stickied Giveaway Groups

`steamgifts.com/giveaways/new`

![](http://i.imgur.com/5QeKO7e.png)

* Allows you to sticky groups while creating a giveaway.

### Header Icons Refresher

`steamgifts.com/*`

* Updates the header icons every 60 seconds (only if the tab is active).
* You can enable an option that runs the refresher in the background and changes the icon of the tab when not active.
* This feature also notifies you if one of your won gifts has been delivered:

![](http://i.imgur.com/BDTqCPU.png)

### Advanced Giveaway Search

`steamgifts.com/giveaways/*(!(wishlist|created|entered|won)`

![](http://i.imgur.com/RHYmAGs.png)

* Allows you to easily search giveaways using SG's [search parameters](https://www.steamgifts.com/discussion/8SzdT/).

### Points Refresher

`steamgifts.com/?`

* Updates your points every 60 seconds (only if the tab is active).
* You can enable an option that runs the refresher in the background and changes the title of the tab when not active.

### Entered Games Highlighter

`steamgifts.com/*`

![](http://i.imgur.com/gblD658.png)

* Highlights games you have already entered giveaways for.

### Entered Giveaways Filter

`steamgifts.com/*`

* Hides entered giveaways.

### Enter / Leave Giveaway Button

`steamgifts.com/(giveaways|user|group)/*`

![](http://i.imgur.com/dR5gyHW.png)

* Allows you to enter / leave giveaways directly from the giveaways pages.

### Giveaway Description / Comment Box Popup

`steamgifts.com/(giveaways|user|group)/*`

![](http://i.imgur.com/6HJTICj.png)

* Allows you to view giveaway descriptions and add comments to giveaways directly from the giveaways pages.
* You can enable an option to show it automatically upon entering a giveaway if Enter / Leave Giveaway Button is enabled.

### Giveaway Winning Chance

`steamgifts.com/(giveaways|giveaways/entered|giveaway|user|group)/*`

![](http://i.imgur.com/Pib5Tom.png)

* Displays your winning chance for a giveaway.

### Groups Highlighter

`steamgifts.com/giveaway/groups/*`

![](http://i.imgur.com/eaGeLUj.png)

* Highlights which groups you are a member of in the giveaway groups page.

### Giveaway Groups Popout

`steamgifts.com/*`

![](http://i.imgur.com/XiThr1l.png)

* Pops out a box with all the groups of a giveaway upon clicking on the groups button.
* Has Avatar Popout and Groups Highlighter built-in.

### Discussions Highlighter

`steamgifts.com/discussions/*`

![](http://i.imgur.com/A2o14yw.png)

* Allows you to highlight discussions.

### Comment Tracker

`(steamgifts|steamtrades).com/*(!messages)`

![](http://i.imgur.com/6nALh8y.png)

* Fades out giveaways / discussions / support tickets / trades you have already visited. Note that this does not mean every comment inside the page has been read, it simply means you have visited it.
* Keeps track of comments / editions and fades out those you have already read.
* To mark a comment as read, click on the eye icon below it:

![](http://i.imgur.com/UCb55vi.png)

* Adds a panel that allows you to go to the first unread comment of the page or mark all comments of the page as read:

![](http://i.imgur.com/8fPMwjG.png)

* Keeps track of discussion comments and shows how many comments are unread on the discussions page.
* Allows you to go to the first unread comment of a discussion or mark all its comments as read directly from the discussions page.

### Accurate Timestamp

`(steamgifts|steamtrades).com/*`

* Increases the accuracy of timestamps by changing them from `2 hours ago` to `1/1/2017, 0:00:00 AM - 2 hours ago`.
* You can disable it in the main giveaways pages through the settings menu.

### Comment Formatting Helper

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/g9C3e0g.png)

* Adds a panel that helps you with comment formatting.
* Allows you to turn automatic links / images paste formatting on / off.
* You can disable any items of the panel through the settings menu, except for the automatic links / images paste formatting item.

### Main Comment Box Popup

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/hmaZQYn.png)
![](http://i.imgur.com/ClGzBNS.png)

* Hides the main comment box and adds a button that pops up a box which allows you to add comments to the page.
* Has `Discussion Edit Detector` built-in.

### Multi-Reply

`(steamgifts|steamtrades).com/*`

* Allows you to reply to multiple comments at the same time, since each comment has their own comment box and the page isn't reloaded after submitting it.
* Has `Discussion Edit Detector` built-in.

### Reply From Inbox

`(steamgifts|steamtrades).com/messages/*`

* Allows you to reply to your messages directly from your inbox.
* Has `Multi-Reply` built-in.

### Game Tags

`steamgifts.com/*`

![](http://i.imgur.com/qCLDa2g.png)
![](http://i.imgur.com/g4pTzCe.png)

* Allows you to add tags to games.
* Separation of tags is purely cosmetic.

### Giveaway Winners Link

`steamgifts.com/*`

![](http://i.imgur.com/g2kaFD9.png)

* Adds a link to the winners page of a giveaway.

### Main Post Popup

`steamgifts.com/discussion/*`

![](http://i.imgur.com/lA9QNLM.png)

* Hides the main post and adds a button that pops it up.
* If `Comment Tracker` is enabled, the main post is only hidden if it has been marked as read.

### Discussion Edit Detector

`steamgifts.com/discussion/*`

* Detects if the discussion you're posting a comment to has been edited since the time you opened it and saves your comment correctly.
* This fixes a bug on SteamGifts that does not save your comment to a discussion if you submit it after the discussion has been edited.

### Reply Mention Link

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/SgEzjXC.png)

* Adds a mention link to the comment replied to.

### Archive Searcher

`steamgifts.com/archive/*`

![](http://i.imgur.com/DtvFj5J.png)
![](http://i.imgur.com/bkUPFuV.png)

* Allows you to search the archive by exact title / AppID.

### Other Info

* All requests from `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` are limited to 2 per second, to prevent a stress on the SG servers.
* If you try to leave the page while `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` are running, you will get a confirmation dialog asking you if you want to leave the page. Additionally, while these features are running, their buttons are faded out.
* `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` allow for real-time options. For example, if you start `Whitelist / Blacklist Checker` with `Also check for whitelist.` enabled, but in the middle of the process you decide to disable that option, from that point onwards it will no longer check for whitelist.
