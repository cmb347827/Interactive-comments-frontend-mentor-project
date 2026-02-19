# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Screenshot

[screenshot](screenshot.PNG "screenshot")

### Links

- Solution URL: [Github]()
- Live Site URL: [Live Netlify](https://comfy-taffy-898756.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS
- Javascript
- Mobile-first workflow


### What I learned

- Users aren't able to reply to their own comment, as this wouldn't make sense. But can edit/delete their own comments.
  also users can't upvote/downvote their own comments.
   if one upvotes/downvotes nested comments, it does not affect their position: First-level comments should be ordered by their score, whereas nested replies are ordered by time added.
- I added date-fns and random.js. Someone at Discord suggested I use Vite to do so as it would be easier. As I also had trouble adding date-fns without.
- The 'createdAt' dates wouldn't update in Netlify , till I figureded out how to clear localstorage in  dev tools (under storage, local storage, delete the value)
- I had a lot of trouble when I first try to incorporate in my (old) exisiting project. I had to eventually give up and start from scratch. I had to create a new empty folder, then install Vite : `npm create vite@latest`.
  I had alot of trouble installing any modules, till someone at Discord mentioned I needed to CD into the root/current folder, and then I could install date-fns and random.js. It took me a long time to figure out this order of steps.
  Finally I figured I had to then type `git init` , and then after creating the repo and grabbing the url from quick setup, 
  I finally figured I needed to type `git remote add origin https://github.com/cmb347827/Interactive-comments-frontend-mentor-project.git` in the project terminal .
   Then could I again commit like I usually do from source control in VS.
   Then I only needed to connect my repo to Netlify witin Netlify.
- The way this app is setup is bad form, I realize. All the code in: setAria(),  generatedHTML(), and addButtonEvent() are tied to the html structure in displayMessages(). If I change anything in displayMessages() then I need to update these functions or everything breaks.
- Also the repeated use of the same ID (for each comment), throughout displayMessages().  If I were to create another app like this I would do this different, in a way that will lead to fewer maintenance issues in the future. It was a learning project.
- As I had to restart this app many times with a new repo and new everything , the comments in my repo are lacking therefore.




### Continued development

- Daily tutorials and projects in HTML5, CSS3, Javascript, Sass/SCSS. For now, in time I will go re-learn React ect.

### Useful resources

 

## Author

- Website - [One of my latest codepens](https://codepen.io/cynthiab72/pen/oNybYON)
- Frontend Mentor - [@cmb347827](https://www.frontendmentor.io/profile/cmb347827)


