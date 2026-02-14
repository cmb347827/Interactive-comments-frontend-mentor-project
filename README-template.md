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

![screenshot](./images/screenshot.PNG "screenshot")

### Links

- Solution URL: [Github]()
- Live Site URL: [Live Github]()

## My process

### Built with

- Semantic HTML5 markup
- Sass/SCSS
- jQuery/Javascript
- Mobile-first workflow


### What I learned

- Users aren't able to reply to their own comment, as this wouldn't make sense. But can edit/delete their own comments.
  also users can't upvote/downvote their own comments.
   if one upvotes/downvotes nested comments, it does not affect their position: First-level comments should be ordered by their score, whereas nested replies are ordered by time added.
- I added date-fns and random.js, used vite also new as I had trouble adding date-fns without.'
- clear localstorage dev would work in netlify
- static vite site
- code structure  : setaria + upvotenodes/downvotenodes + getgeneratedhtml
- all the repeat ids because of my code structure

todo: style.css on hover styles, 

### Continued development

- Daily tutorials and projects in HTML5, CSS3, Javascript, Sass/SCSS. For now, in time I will go re-learn React ect.

### Useful resources

 

## Author

- Website - [One of my latest codepens](https://codepen.io/cynthiab72/pen/oNybYON)
- Frontend Mentor - [@cmb347827](https://www.frontendmentor.io/profile/cmb347827)


