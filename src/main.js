
'use strict'; 
import {sub,formatDistance, daysToWeeks} from 'date-fns';
import { Random } from "random-js";


 window.onresize = function() {
  //location.reload();
  //displayMessages();
  this.location.reload();
  addButtonsEvents();
};

const elementsData={
  jsonData: '',
  newJsonData:'',
  messagesHTML:[],
  currentUser:'',
  nested: false,
  displayMessages: document.querySelector('.js-comments'),
  deleteId:'',
}
//https://raw.githubusercontent.com/cmb347827/interactive-comments-section/refs/heads/main/data.json
//the next two functions are for fetching the data, then the next two functions for save/loading the data
function getJson() {
    return fetch('https://raw.githubusercontent.com/cmb347827/interactive-comments-vite-two/refs/heads/main/data.json')
    .then(response => response.json())
    .then(response => response)
    .catch(err => {
    console.error(err);
     });  
}
async function getData(){
  elementsData.jsonData= await(getJson());
  //make a copy of the returned json data js object, so that users can add to the comments, update, delete comments and both are preserved.
  elementsData.newJsonData = elementsData.jsonData;   
    
  convertToDate();
  displayMessages();
}


//next three functions deal with the createdAt dates. 
function saveToStorage(key,which){
    //whenever the messages are updated , will be saved in local storage.
    localStorage.setItem(key,JSON.stringify(which));//to json string
}

function loadFromStorage(key){
  let tryget = localStorage.getItem(key);
  
    if(tryget){
    elementsData.newJsonData = JSON.parse(tryget);
    displayMessages();
    }else{ 
    //load default.
    getData();
    }
}



//the next three functions are for setting createdAt 
const toISO8659=(str)=>{
     
  const [amount, unit] = str.split(' ');
  const num = parseInt(amount);
  const now = new Date();
  
  switch(unit) {
    case 'second':
    case 'seconds': return sub(now, {seconds:num});
    case 'minute':
    case 'minutes': return sub(now, {minutes: num});
    case 'hour':
    case 'hours': return sub(now, {hours:num});
     case 'day':
    case 'days': 
                return sub(now, { days: num });
    case 'week':
    case 'weeks': 
                
                return sub(now, { weeks: num });
    case 'month':
    case 'months': return sub(now, { months: num });
    case 'year':
    case 'years': return sub(now, { years: num });
    default: return now;
  }
  
}
const pastDate = (createdAt) => {
  const pastDate = new Date(createdAt);
  const now = new Date();
  
  return formatDistance(pastDate, now, { addSuffix: true });
};
const convertToDate =()=>{
     //convert json file's createdAt's '1 week ago' etc, to dec-10-25 etc.
     //Do this once.
       elementsData.newJsonData.comments.forEach((comment,index)=>{
             comment.createdAt = toISO8659(comment.createdAt);
                    if(comment.replies.length>0){
            comment.replies.map(reply=>{
              reply.createdAt = toISO8659(reply.createdAt);
            });
          }	
    });
    saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData);
}


//next three functions are for generating/displaying the html
function getGeneratedHTML(insert,which){
    let addMargin = (elementsData.nested)?'addMargin':'';
  let replyingTo = false;
    
  if(insert.replyingTo){
    //insert.currentuser, is last comment at bottom (currentUser 'send') or outer comments, and so do not have replyingTo
    if(insert.user.username !== elementsData.currentUser){
          //is other user reply
        replyingTo=true;
        //make sure to add 'replyingTo'
        //see line 155 and 172
      
    }
  }
  
  if(which==='currentuser-comment'){
    //outer currentuser comment, no need to add 'replyingto' 
       insert.replyingTo='';
  }
  if(which==='reply'){
    if(insert.replyingTo.startsWith('@')){
      //@ has been added previously to the currentuser inner reply, no need to add it again.
          insert.replyingTo= insert.replyingTo;
    }else{
      //will add teh @ to the currentuser inner reply, if it's not added yet.
      insert.replyingTo= `@${insert.replyingTo}`;
    }
  }
  //see lines 209 + 211  as well as 173/174 as well as 226/227
  let textlabel2=uuidv4();  let textlabel1=uuidv4(); let textlabel3=uuidv4();
     

  if(which ==='comment'){
         let innerreply=(replyingTo)? `@${insert.replyingTo}`: '';
             
       return `<div class=' off-white-background ${addMargin}'>
              <!--all outer comments-->
            <div class='display-flex flex-column' id='${insert.id}'>             
              <div class='display-flex justify-content-space-between'>
                <div class='display-flex align-items-center'>
                  <div class='desktop'>
                    <div class='display-flex flex-column ms-3 align-items-center darker-white-background js-score-desktop' id='${insert.id}' >
                      <button aria-label='Comment upvote' type='button' class='upvote-desktop darker-white-background'><svg class='darker-white-background' width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
                      <span title='Comment score' data-value='${insert.score}'>${insert.score}</span>
                      <button aria-label='Comment downvote' type='button' class='downvote-desktop darker-white-background'><svg class='darker-white-background' svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></button>
                    </div>
                  </div>
                  
                  <img class='ms-3' src='${insert.user.image.png}' alt='User avatar' width='64' height='64'>
                  <span class='ms-3 me-1'>${insert.user.username}</span>
                  <span> ${pastDate(insert.createdAt)}</span>
                </div>
                <div  class='desktop margin-desktop' >
                  <svg  width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                  <button type='button' class='js-reply-desktop'>Reply</button>
                </div>
              </div>
              <p class='' ><span class='firstword'> ${innerreply}</span>${insert.content}</p>
              <div class='mobile'>
                 <div class='display-flex justify-content-space-between w-100'>
                    <div class='border-radius-1 display-flex  align-items-center darker-white-background js-score-mobile' id='${insert.id}' >
                     <button aria-label='Comment upvote' type='button' class='upvote-mobile darker-white-background'><svg class='darker-white-background' width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
                     <span title='Comment score' data-value='${insert.score}'>${insert.score}</span>
                     <button aria-label='Comment downvote' type='button' class='downvote-mobile darker-white-background'><svg class='darker-white-background' svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></button>
                     </div>
                      <div  class='w-10 display-flex align-items-center' >
                     <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                     <button type='button' class='js-reply-mobile'>Reply</button>
                    </div>
                </div>
              </div>
            </div>
            <div class='hidden reply off-white-background'>
                <form class='display-flex js-display-reply' method='post' action='#'>
                    <img src='${elementsData.currentUser.image.png}' alt='User avatar' width='64' height='64'> 
                    <label for='${textlabel1}' class='visually-hidden'>User comment</label>
                    <textarea id='${textlabel1}' class='w-100 off-white-background' ></textarea>
                    <button title='Submit reply' type='button' class='js-submit-reply'>Reply</button>
                     <button title='Cancel reply' type='button' class='js-cancel-reply'>Cancel</button>
                </form>
                
            </div>
        </div><br>`;
       
  }
  
  if(which==='reply' || which==='currentuser-comment'){
                
        return `<div  class=' off-white-background ${addMargin}'>
                
                <div id='${insert.id}'>
                  <div class='display-flex justify-content-space-between'>
                    <div class='display-flex align-items-center'>
                        <div class='desktop'>
                          <div class='display-flex flex-column ms-3 align-items-center darker-white-background js-score-desktop' id='${insert.id}' >
                            <button aria-label='Comment upvote' type='button' class='upvote-desktop darker-white-background'><svg class='darker-white-background' width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
                            <span title='Comment score' data-value='${insert.score}'>${insert.score}</span>
                            <button aria-label='Comment downvote' type='button' class='downvote-desktop darker-white-background'><svg class='darker-white-background' svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></button>
                          </div>
                        </div>
                      <img class='ms-3' src='${insert.user.image.png}' alt='User avatar' width='64' height='64'> 
                      <span class='ms-3 me-1'>${insert.user.username}</span>
                      <span class='you white-font'>You</span>
                      <span>${pastDate(insert.createdAt)}</span>
                    </div>
                    <div class=' desktop '>
                      <div class='' id='${insert.id}'>
                        <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                        <button title='Delete comment' type='button' class='js-delete-desktop'>Delete</button>
                      </div>
                      <div class=' '>
                        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
                        <button title='Edit comment' type='button' class='js-edit-desktop'>Edit</button>
                      </div>
                    </div>
                  </div>

                  <form class='display-flex justify-content-space-between align-items-sm-flex-start' method='post' action='#'>
                    <div id='${insert.id}'>
                         <label for='${textlabel2}' class='visually-hidden'>Current user's comment to a reply</label>
                         <span class='reply'>${insert.replyingTo}</span>
                         <textarea   id='${textlabel2}' class='move-down user-text currentuser-old-reply smaller-width move-right off-white-background height-5'> ${insert.content}</textarea>
                      
                    </div>
                    <div class='display-flex'>
                      <button title='Update comment' type='button' class='js-update hidden'>Update</button>
                      <button title='Cancel update comment' type='button' class='js-edit-cancel hidden'>Cancel</button>
                    </div>
                  </form>
                  <div class='mobile'>
                      <div class='display-flex align-items-center justify-content-space-between w-100'>
                          <div class='border-radius-1 display-flex  align-items-center darker-white-background js-score-mobile' id='${insert.id}' >
                             <button aria-label='Comment upvote' type='button' class='upvote-mobile darker-white-background'><svg class='darker-white-background' width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></button>
                             <span title='Comment score' data-value='${insert.score}'>${insert.score}</span>
                             <button aria-label='Comment downvote' type='button' class='downvote-mobile darker-white-background'><svg class='darker-white-background' svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></button>
                            </div>
                        <div class='display-flex '>
                          <div class='' id='${insert.id}'>
                           <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                           <button title='Delete comment' type='button' class='js-delete-mobile'>Delete</button>
                          </div>
                          <div class=' '> 
                           <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
                           <button title='Edit comment' type='button' class='js-edit-mobile'>Edit</button>
                          </div>
                        </div>
                      </div>
                  </div>
                  
                </div>
            </div><br>`;
  }
  if(which==='send'){
    return `<form class='display-flex w-100 off-white-background p2' method='post' action='#'>
      <label for='${textlabel3}' class='visually-hidden'>User can enter text for a new commment</label>
      <div class='textgrid w-100'>
         <img src='${insert.image.png}' alt='User avatar' width='64' height='64' class='send area-img'> 
         <textarea id='${textlabel3}' class='currentuser-new-message w-100 off-white-background area-text'></textarea>
         <button title='Submit new comment' type='button' class='js-add-comment area-button grid-item'>Send</button>
      </div>
        </form>`;
  }
  
}
function createParentEl(){
  const el =document.createElement('article');  // needed?                                          ///
  return el;
}

function displayMessages(){
      elementsData.displayMessages.innerHTML='';                                     
    elementsData.messagesHTML=''; 
    elementsData.currentUser= elementsData.newJsonData.currentUser; 
      
    elementsData.newJsonData.comments.forEach((comment,index)=>{
            
                    elementsData.nested=false;
          //if the new comment is from another user ,from the json file return false, otherwise return true for the currentuser new comment
          const commentchild = (comment.user.username === elementsData.newJsonData.currentUser.username)?getGeneratedHTML(comment,'currentuser-comment'):getGeneratedHTML(comment,'comment');
          const el = createParentEl();
          el.innerHTML =  commentchild;
                    elementsData.messagesHTML += el.outerHTML;
            
          
                    if(comment.replies.length>0){
            
            elementsData.nested=true;
            comment.replies.forEach(reply=>{
          
              if(elementsData.currentUser.username !== reply.user.username){
                //replies from other users to comments : bv Ramsesmiron
                const replyChild = getGeneratedHTML(reply,'comment');
                const replyEl = createParentEl();
              
                replyEl.innerHTML= replyChild;
                elementsData.messagesHTML += replyEl.outerHTML;
              }else {
                //currentUser's reply
                
                const userChild = getGeneratedHTML(reply,'reply');
                const userEl = createParentEl();
                
                userEl.innerHTML = userChild;
                elementsData.messagesHTML += userEl.outerHTML; 
              }
            });
            
          }
          
          if(index===(elementsData.newJsonData.comments.length-1)) {
            //currentUsers new comment or last comment at bottom
            elementsData.nested=false;
              const sendChild =getGeneratedHTML(elementsData.currentUser,'send');
            const sendEl = createParentEl();
            sendEl.innerHTML = sendChild;
            elementsData.messagesHTML += sendEl.outerHTML;
          } 
          
    });
    elementsData.displayMessages.innerHTML = elementsData.messagesHTML;
    if(document.getElementById('main').offsetWidth>768){
            setAria('.upvote-desktop');
           setAria('.downvote-desktop');
    }else{
      setAria('.upvote-mobile');
      setAria('.downvote-mobile');
    }
    saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData);
    addButtonsEvents();
    //console.log(elementsData.displayMessages.innerHTML);
}



//only used to add the aria-disabled attribute to  the currentuser upvote/downvote buttons
const setAria=(el)=>{
    let screensize='';
    const votesHtmlContainer = document.querySelectorAll(el);
    const nodes = Array.from(votesHtmlContainer);
    if(document.getElementById('main').offsetWidth>768){
        //desktop
        screensize='desktop';    
    }
  
    elementsData.newJsonData.comments.forEach((comment)=>{
      for(const node of nodes){
        let id='';
        if(screensize==='desktop'){
          id = node.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        }else{
          id = node.parentNode.parentNode.parentNode.parentNode.id;
        }
        if((Number(id)===Number(comment.id)) && (comment.user.username===elementsData.currentUser.username)){
          node.setAttribute("aria-disabled", "true");
        }
      }		
    
    if(comment.replies.length>0){
      comment.replies.forEach((reply)=>{
          
          for(const node of nodes){
            let id2='';
            if(screensize==='desktop'){
                            id2 = node.parentNode.parentNode.parentNode.parentNode.parentNode.id;
                }else{
                            id2 = node.parentNode.parentNode.parentNode.parentNode.id;
                }
             if((Number(id2)===Number(reply.id)) && (reply.user.username===elementsData.currentUser.username)){
                node.setAttribute("aria-disabled", "true");
             }
            }	
      });
    }
  });
}
function uuidv4() {
  //random.js 
  //need a number id as my old uuidv4 returns a string, and I'm comparing number id's (from the json file) and adding new in new comments
  const random = new Random(); 
    const value = random.integer(1, 100000);
  return value;
}
function toggleReplyArea(event){
  //currentUser's new reply
  const parent = event.target.closest('article');
  const reply = parent.querySelector('.reply');
  reply.classList.toggle('hidden');
}


//next two functions are for sorting by score
const sortByScore=()=>{
    //called after new comment added and after updated comment score.

  elementsData.newJsonData.comments=  elementsData.newJsonData.comments.sort((a,b)=> b.score - a.score);
  
    displayMessages();
}

const setCommentScore=(parent,val)=>{
  // needs IDs at lines 139 and 172   =>now lines 155, 189

    let parentId = Number(parent.getAttribute('id'));                          
  console.log('parentid',parentId);
    
  elementsData.newJsonData.comments.forEach((comment)=>{
    if(Number(comment.id) === parentId){
      comment.score = val;
    }
    if(comment.replies.length>0){
      comment.replies.forEach((reply)=>{
        if(Number(reply.id) === parentId){
          reply.score = val;
        }
      });
    }
  });
  saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData);
}



//Below function is used to generate new comments and new replies by the currentuser , called addButtonEvents()
const returnComment=(content,which,comment)=>{
      if(which==='replies'){
      const newComment = {
        "id": `${uuidv4()}`,
        "content": `${content}`,
        "createdAt": `${new Date()}`,
        "score": 0,                                          
        "user": {
          "image": { 
          "png": `${elementsData.currentUser.image.png}`,
          "webp": `${elementsData.currentUser.image.webp}`
          },
          "username": `${elementsData.currentUser.username}`
        },
        "replies":[]
        };
      return newComment;
    }
    if(which==='replyingto'){
            const newReplyToComment = {
        "id": `${uuidv4()}`,
        "content": `${content}`,
        "createdAt": `${new Date()}`,
        "score": 0,
        "replyingTo": `${comment.user.username}`,                  
        "user": {
          "image": { 
          "png": `${elementsData.currentUser.image.png}`,
          "webp": `${elementsData.currentUser.image.webp}`
          },
          "username": `${elementsData.currentUser.username}`
        }
        };
      return newReplyToComment;
    }
}


async function findUser(id){
      for(const comment of elementsData.newJsonData.comments){                   
      if(Number(comment.id) === Number(id)){
        return comment.user.username;
      }
      
      if(comment.replies.length>0){
        for(const reply of comment.replies){
          if(Number(reply.id) === Number(id)){
            return reply.user.username;
          }
        }
      }
    }
      
}




const toggleBtns=(text,cancel,update,index)=>{
  text[index].toggleAttribute("disabled");
  text[index].toggleAttribute('aria-disabled');
  //cancel edit and update buttons 'hidden' is toggled everytime 'edit' is clicked
  (cancel[index]).classList.toggle('hidden');
  (update[index]).classList.toggle('hidden');
}



function addButtonsEvents(){    
  
  //upvote/downvote apply to both currentuser comments and other user comments.      //id at line 144.
  //user clicks upvote button, either in mobile or desktop view
  let whichupvote= (document.getElementById('main').offsetWidth<=768)? 'upvote-mobile':'upvote-desktop';
  console.log('whichupvote:',whichupvote);
  let upvoteHTMLCollection = document.getElementsByClassName(whichupvote);
  let upvoteNodes = Array.from(upvoteHTMLCollection);

  let jsScore =  (document.getElementById('main').offsetWidth<=768)? '.js-score-mobile':'.js-score-desktop';
  console.log('jssocore',jsScore);


  upvoteNodes.forEach((btn,index)=>{  
      btn.addEventListener('click', async (event) => {
          const id = event.target.closest('div').id;
          let user = await findUser(id);
          if(user!== elementsData.currentUser.username){
            let scoreEl = event.target.closest(jsScore).querySelector('span');
            let scoreVal = scoreEl.getAttribute('data-value');
            scoreEl.setAttribute('data-value',++scoreVal);
            scoreEl.textContent= scoreVal;
            
            let parent='';
            if(document.getElementById('main').offsetWidth>768){
               //desktop
                parent =event.target.parentElement.parentElement.parentElement.parentElement.parentElement;    
            }else{
               //mobile
              parent =event.target.parentElement.parentElement.parentElement.parentElement;
            }
            //update comment score in elementsData.newJsonData.
            setCommentScore(parent,scoreVal);                                                 
            sortByScore();  
                                                   
              }
        },
        false
      );
      
  });
  let whichdownvote= (document.getElementById('main').offsetWidth<=768)? 'downvote-mobile':'downvote-desktop';
    let downvoteHTMLCollection = document.getElementsByClassName(whichdownvote);
  let downvoteNodes = Array.from(downvoteHTMLCollection);

  downvoteNodes.forEach((btn,index)=>{
           btn.addEventListener('click',async (event)=>{
              const id = event.target.closest('div').id;
          let user = await findUser(id);
          if(user!== elementsData.currentUser.username){
            let scoreEl = event.target.closest(jsScore).querySelector('span');
            let scoreVal = scoreEl.getAttribute('data-value');
            scoreEl.setAttribute('data-value',--scoreVal);
            scoreEl.textContent= scoreVal;
          
            let parent='';
            if(document.getElementById('main').offsetWidth>768){
               //if desktop
                 parent =event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
            }else{
               parent =event.target.parentElement.parentElement.parentElement.parentElement;
            }
            //update comment score in elementsData.newJsonData.
            setCommentScore(parent,scoreVal);
            sortByScore();
              }
        },
        false
        );
  });

    
    //all the rest is currentUser only
  document.querySelector('.js-add-comment').addEventListener('click',(event)=>{
       
      //add new currentUser comment 
      const content = event.target.previousElementSibling.value;
      const newComment = returnComment(content,'replies');
      elementsData.newJsonData.comments.push(newComment);
      //needed to update new comment from currentuser createdAt with each new comment.
      saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData); 
      sortByScore();
  })
  
  document.querySelectorAll('.js-submit-reply').forEach((btn,btnIndex)=>{
      btn.addEventListener('click',(event)=>{
        //The currentUser has clicked the reply button to submit a  reply
        const content = event.target.previousElementSibling.value;
        const inReplyToThisComment= event.target.parentElement.parentElement.previousElementSibling;
        
      
        //check to see if this is a reply to an inner comment or outer comment.
                // ids at lines 139 and 172 is needed for these lines of code. =>now lines 155, 189
               elementsData.newJsonData.comments.forEach((comment,index)=>{
              //if comment.replies  contains inreplytothiscomment.id , this is a reply to an inner comment 
            if(comment.replies.length>0){
                            comment.replies.forEach((reply,index)=>{
                if(reply.id === Number(inReplyToThisComment.id)){
                                     //create a new id for the new reply to the comment
                  //the reply with the new id and content
                  const newReplyToInnerComment = returnComment(content,'replyingto',reply);       
                  comment.replies.push(newReplyToInnerComment);
                }
              })
            }

            //if replying to outer comment , 
            if(comment.id === Number(inReplyToThisComment.id)){
                //this is the comment in elementsData.newJsonData that is the same being replied to.
                //the reply with the new id and content
                const newReplyToOuterComment = returnComment(content,'replyingto',comment);
                //add the new reply to the comment's replies[]
                               comment.replies.push(newReplyToOuterComment);
                            
            }
        });
        displayMessages();
      });
  });

  //user clicks reply button, either in mobile or desktop view
  let whichreply= (document.getElementById('main').offsetWidth<=768)? 'js-reply-mobile':'js-reply-desktop';
  console.log(whichreply);
    let replyHTMLCollection = document.getElementsByClassName(whichreply);
  let replyNodes = Array.from(replyHTMLCollection);
  replyNodes.forEach((btn,index)=>{
      btn.addEventListener("click", (event)=>{
        //The currentUser has clicked the 'reply' button in a comment   
        toggleReplyArea(event); 
      });
  });
  
  let cancelReplyHtmlCollection = document.getElementsByClassName('js-cancel-reply');
  let cancelReplyNodes = Array.from(cancelReplyHtmlCollection);
    cancelReplyNodes.forEach((btn,index)=>{
    btn.addEventListener('click',(event)=>{
      //The currentUser has clicked the cancel button to cancel adding a reply
      toggleReplyArea(event); 
    });
  });


  let currentUserReplyHtmlCollection = document.getElementsByClassName('currentuser-old-reply');
  let currentUserReplyNodes = Array.from(currentUserReplyHtmlCollection);
  //currentuser's old reply textarea should be disabled
    currentUserReplyNodes.forEach((textarea)=>{
         textarea.setAttribute('aria-disabled','true');
     textarea.setAttribute('disabled','true');
  });


  const textHtmlCollection = document.getElementsByClassName('currentuser-old-reply');
  const textareaNodes = Array.from(textHtmlCollection);
  const editcancelHtmlCollection = document.getElementsByClassName('js-edit-cancel');
  const jscancelNodes = Array.from(editcancelHtmlCollection);
  const updateHtmlCollection = document.getElementsByClassName('js-update');
  const jsupdateNodes = Array.from(updateHtmlCollection);
  
  
  //currentuser clicks 'edit' button, either in mobile or desktop view.
  let whichEdit= (document.getElementById('main').offsetWidth<=768)? 'js-edit-mobile':'js-edit-desktop';
   let EditHTMLCollection = document.getElementsByClassName(whichEdit);
  let EditNodes = Array.from(EditHTMLCollection);
  
  
    EditNodes.forEach((btn,index)=>{
      let updateEvent ='';
      textareaNodes[index].addEventListener('input',(event)=>{
          updateEvent= event;
          
      });
      btn.addEventListener("click", ()=>{
        //edit button is pressed, toggle textarea to disabled/abled or abled/disabled.
        toggleBtns(textareaNodes,jscancelNodes,jsupdateNodes,index);
      });
      let firstspace=''; let id='';
      (jsupdateNodes[index]).addEventListener('click',()=>{
        //the user clicks the current update button
          id = Number(textareaNodes[index].closest('div').id);             //id at line 209  Id at line 174,212,and 227(textareas) is purely for the associated label.
          let usethisIndex= index;

          elementsData.newJsonData.comments.forEach((comment)=>{
              
            if(Number(comment.id) === id){
                             const [replyingto,...updatedcomment] = updateEvent.target.value.split(' ');
              comment.content = [...updatedcomment].join(' ');
              saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData); 
              comment.content='';
                            //after updating the comment toggle textarea to disabled/abled or abled/disabled.
              toggleBtns(textareaNodes,jscancelNodes,jsupdateNodes,usethisIndex);
            }
            if(comment.replies.length>0){
              comment.replies.forEach((reply)=>{    
                                
                if(Number(reply.id) === id){
                  
                  //remove @replyingto entirely before saving , or it will double/triple etc , with each edit , add this.
                    const [replyingto,...updatedcomment] = updateEvent.target.value.split(' ');
                  reply.content = [...updatedcomment].join(' ');
                  saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData); 
                  reply.content='';
                   //after updating the comment toggle textarea to disabled/abled or abled/disabled.
                  toggleBtns(textareaNodes,jscancelNodes,jsupdateNodes,usethisIndex);
                }
              });
            }
             });
      });
       
       (jscancelNodes[index]).addEventListener('click',()=>{
                //the user clicks the current cancel edit button
          toggleBtns(textareaNodes,jscancelNodes,jsupdateNodes,index);
       });

  });


  //currentUser wants to delete a comment 
  const deletecomment = document.querySelector('.js-yes'); //see html file
    const cancel = document.querySelector('.js-cancel');     //see html file
  const dialog = document.querySelector('.js-dialog');     //see html file.

  //user clicks delete button, either in mobile or desktop view
  let whichdelete= (document.getElementById('main').offsetWidth<=768)? 'js-delete-mobile':'js-delete-desktop';
    let deleteHTMLCollection = document.getElementsByClassName(whichdelete);
  let deleteNodes = Array.from(deleteHTMLCollection);


  deleteNodes.forEach((btn,index)=>{
    btn.addEventListener("click", (event)=>{
      //delete currentuser reply button is pressed
      //pop-up dialog asks to make sure to delete.
                                                                                           //line 198 id
      elementsData.deleteId=  event.target.closest('div').id;
      dialog.showModal();

    });
  });
    deletecomment.addEventListener('click',(event)=>{
    //delete comment with id at elementsData.deleteId 
    elementsData.newJsonData.comments.forEach((comment,outerindex)=>{
        
        if(Number(comment.id) === Number(elementsData.deleteId)){
          elementsData.newJsonData.comments.splice(outerindex,1);
          saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData); 
        }
        if(comment.replies.length>0){
          comment.replies.forEach((reply,innerindex)=>{
            if(Number(reply.id) === Number(elementsData.deleteId)){
                
              comment.replies.splice(innerindex,1);
              saveToStorage('messages1358szaq1tritujfdcx2',elementsData.newJsonData); 
            }
          });
        }
    });
        elementsData.deleteId='';
    dialog.close();
    displayMessages();
  });
  cancel.addEventListener('click',()=>{
    dialog.close();
  });
}

window.onload = function() {
  //localStorage.clear();  
  loadFromStorage('messages1358szaq1tritujfdcx2');
  //getData();
  //createElement 
 
  //elementsData.displayMessages = JSON.parse(localStorage.getItem('messages'));
  
};