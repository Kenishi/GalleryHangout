#Gallery Hangout
###Hangout Widget to share image among participants
===

##Setup
There are 3 steps to setting this project up to run on Google Hangout.

1. Download the source
2. Setup a Google Web AppEngine Project
3. Setup a Application Project on ImgUr to get an App ID.
4. Upload the program to your AppSpot and "Enter a Hangout."

###1 Download the source
This should be straight forward. Clone the tree to get the source.

###2 Setup a Google App Engine Project
The simplest way to do this is to follow the instructions in the "Web App Setup.txt" file. This is a file pulled from the "Starter App" that can be found on the Google Hangouts App Sample Apps section.

__Note: Where it says to replace "YOUR APP ID", you need to replace "galleryhangout" instead.__

In addition, if you are trying to find the "Hangouts" button on the list that is mentioned in the text file, you will have some trouble. Google recently changed their Developer's Console layout so its no longer in the same place. To get the Hangout's screen that the text mentions. You need to click "APIs" on the left menu in the Developer's Console and click the sprocket next to the "Hangouts" in the API list. This will take you to the screen where you can "Enter a hangout" and use the app.

###3 Setup a ImgUr App
You can register your application at [this site](https://api.imgur.com/oauth2/addclient) or by going to your ImgUr Account settings and clicking "Applications."

Once you have an ID create a Javascript file in /static called "imgur_client.js" and add a line:
`var imgur_clientId = "YOUR IMGUR APP ID";`

###4 Upload everything
You can now upload everything to Google (Follow the directions in the Web App Setup.txt to do this) and click the "Enter a Hangout" in the Hangouts Developer screen. Remember, this app is not public so you'll have to invite people for them to be able to use it and you won't be able to use it in a normal Hangout.

====

##Project Motivation
I have often used Google Hangouts with some of my friends and found I wanted to share some images with them; often times on my computer.
This leaves you with two options:

1. Upload to a hosting site like Imgur
2. Upload to your Google Drive/Dropbox/Etc.

Both of which have a problems.

1. Upload to hosting site
  
  Of the two options this is actually probably the simplest. The problem with doing it this way is that its still time consuming and it still results in having to open up a number of links. It also makes it difficult to refer to certain links sometimes unless you the images are different enough.

2. Upload to the cloud
  
  Google actually provides a widget in Hangouts that makes it easy to share your drive with others in the chat, so whats the problem? In order for people to be able to see the files you have to go in and set the permissions to allow them to see it. In addition, the system is often slow to respond and there is a bit of handshaking that has to happen in order for people to gain access. Dropbox is simpler with its share links but thats about the same as #1.

So what is the problem in both cases? __Convenience__!

There have been instant messaging clients back in the early-2000's that made it simple to drag and drop images into a chat and have people see them. It makes no sense why there shouldn't be a system in place on Hangouts. So I have decided to write this widget to solve this problem.

##Goal
The main goal is to be able to launch the app and start dragging images into the hangout so others can see them. They won't be inline with the chat but its easier than opening up your desktop for others to see the images. It also gives the ability for people to saave the images, so it really is like sharing.

No program is without problems though.

##Problems
The leading problem is that there is no easy way to share the images. It might be possible to set up the widget to load the imges into your Google Drive and then make them available automatically. I suspect there may be a number of issues with security permissions that make this difficult or impossible. So I went with the next best option.

__Imgur__

Imgur has a RESTful API in place that allows for easy uploading of images and viewing of images in the system. So this is why I went this route.

##What to learn?
Every project provides something new to learn. This is my first project that makes strong use of __Javascript__ as the main part of the app. In addition its a __Google App Engine__ project so it was my first exposure to hosting a program in the cloud. In addition there are the usual 'culprits' as well: __HTML, CSS, JQuery,__ and some light use of __Ajax__ obviously, since there is __REST API__ being used.

##Credits
I'm making use of one library at the moment:

[JQuery ToastMessage Plugin](http://akquinet.github.io/jquery-toastmessage-plugin/) by [akquinet](http://github.com/akquinet)

[JQuery UI](http://jqueryui.com/) for the upload dialog.

[JQuery UI Layout](http://layout.jquery-dev.com/) for easy split panes.

---
As always, Thanks for checking this out!
