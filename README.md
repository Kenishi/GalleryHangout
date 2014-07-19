#Gallery Hangout
###Hangout Widget to share image among participants
===

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


As always, Thanks for checking this out!
