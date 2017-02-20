# rhSGST

A script that adds some cool features to SteamGifts and SteamTrades.

## Installation

To install the script, you must install [Tampermonkey](https://tampermonkey.net/) or [Greasemonkey](http://www.greasespot.net/) first. Then [click here](https://github.com/revilheart/rhSGST/raw/master/rhSGST.user.js) and you should be prompted to install it.

* [Changelog](#changelog)

## Compatibility

Fully tested and working in the latest version of:

* Google Chrome (Tampermonkey)

Should be working in the latest version of:

* Firefox (Greasemonkey & Tampermonkey)
* Opera (Tampermonkey)

Tested on Microsoft Edge and most of it seems to work fine, but for some reason requests made from `https://www.steamgifts.com/account` redirect to `https://www.steamgifts.com`. I haven't been able to figure out why yet, so avoid Edge for now.

## Features

* [Settings Menu](#settings-menu)
* [Fixed Elements](#fixed-elements)
* [Endless Scrolling](#endless-scrolling)
* [SteamGifts Profile Button](#steamgifts-profile-button)
* [SteamTrades Profile Button](#steamtrades-profile-button)
* [Username History](#username-history)
* [Permanent User Notes](#permanent-user-notes)
* [Permanent User Tags](#permanent-user-tags)
* [Whitelist / Blacklist Highlighter](#whitelist--blacklist-highlighter)
* [Whitelist / Blacklist Checker](#whitelist--blacklist-checker)
* [Real Won / Sent CV Links](#real-won--sent-cv-links)
* [Not Activated / Multiple Wins Checker](#not-activated--multiple-wins-checker)
* [Not Received Finder](#not-received-finder)
* [Avatar Popout](#avatar-popout)
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

### SteamGifts Profile Button

`steamtrades.com/user/*`

![](http://i.imgur.com/k4P3OMy.png)

* Adds a button that links to an user's SteamGifts profile.

### SteamTrades Profile Button

`steamgifts.com/user/*`

![](http://i.imgur.com/iJxVz6D.png)

* Adds a button that links to an user's SteamTrades profile.

### Username History

`steamgifts.com/user/*`

![](http://i.imgur.com/cTnt7sk.png)

* Keeps track of usernames from the database and detects username changes every month.
* An user is added to the database when you click on the arrow next to their username.

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

### Comment Tracker

`(steamgifts|steamtrades).com/*(!messages)`

* Fades out giveaways / discussions / support tickets / trades you have already visited. Note that this does not mean every comment inside the page has been read, it simply means you have visited it.
* Keeps track of comments / editions and fades out those you have already read.
* To mark a comment as read, simply hover over it.
* Adds a button that allows you to go to the first unread comment of the page:

![](http://i.imgur.com/J8Q9SSk.png)

### Accurate Timestamp

`(steamgifts|steamtrades).com/*`

* Increases the accuracy of timestamps by changing them from `2 hours ago` to `1/1/2017, 0:00:00 AM - 2 hours ago`.

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

## Changelog

**2017-02-20 v4.0.3**

* Fixed an issue that prevented Not Activated / Multiple Wins Checker results from loading in the settings menu.

**2017-02-20 v4.0.2**

* Fixed an issue that was preventing the script from running for some people.

**2017-02-20 v4.0.1**

* Fixed an issue with the colors not displaying properly for Not Activated /  Multiple Wins Checker results from v4.0-.
* Fixed an issue with the header from Extended SteamGifts.

**2017-02-20 v4.0**

* Script moved from Greasy Fork to GitHub with a major update and lots of changes / new features.
