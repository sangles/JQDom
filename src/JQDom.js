'use strict'
class JQDom {
    static find( selector, target=document ){
      if(typeof selector=='object') return new JQElement(selector);
      var elements = target.querySelectorAll(selector);//selectors[0]);
      if(elements.length>1){
        var elList = new JQList();
        for(var e=0; e<elements.length; e++){
          elList.push(new JQElement(elements[e]));
        };
        return elList;
      }else if(elements.length==1){
        return new JQElement(elements[0]);
      }else{
        return false;
      }
    }
    static getVar(name){
      if(name.substr(0,1)!='--') name = '--'+name;
      return Number(getComputedStyle(document.body).getPropertyValue(name));
    }
  }
  JQDom.find.getVar = function (name){
    return JQDom.getVar(name);
  }
  // JQDom.find = function(selector, target=document ){
  //   if(typeof selector=='object') return new JQElement(selector);
  //   var elements = target.querySelectorAll(selector);//selectors[0]);
  //   if(elements.length>1){
  //     var elList = new JQList();
  //     for(var e=0; e<elements.length; e++){
  //       elList.push(new JQElement(elements[e]));
  //     };
  //     return elList;
  //   }else{
  //     return new JQElement(elements[0]);
  //   };
  // }
  class JQElement {
    constructor(e){
      this.element = e;
      this.delayOffset = 0;
      this.delayQueue = []
    }
    globalLeft(){
      let offset = 0;
      let element = this.element;
      while(element!=undefined){
        offset+=element.offsetLeft;
        element=element.parentElement;
      }
      return offset;
      //face.scale.element.parentElement.parentElement.parentElement.parentElement.parentElement.offsetLeft
    }
    forEach(callback){
      callback(this.element,0);
    }
    forEach$(callback){
      callback(this,0);
    }
    href(){
      return this.element.href;
    }
    click( callback ){
      if(!callback){
        this.element.click();
        return;
      }
      // if(!this.element) return this;
      this.on('click',callback);
      return this;
    }
    css(styles){
      // if(!this.element) return this;
      if(typeof(styles)=='string') return this.element.style[styles];
      for(var key in styles){
         this.element.style[key] = styles[key];
      }
      return this;
    }
    hide(){
    //   if(!this.element) return this;
      this.prevDisplay = this.element.style.display;
      this.element.style.display = 'none';
      return this;
    }
    show(){
    //   if(!this.element) return this;
      if(this.prevDisplay=='none'){
        this.element.style.display = "block";
      }else{
          this.element.style.display = this.prevDisplay||"";
      }
      return this;
    }
    delay(d){
  
      this.delayOffset+=d;
      return this;
    }
    resetDelay(){
      this.delayQueue = [];
      this.delayOffset = 0;
      return this;
    }
    addClassDelay(classList,delay){
      this.delayQueue.push(delay);
      setTimeout((classes)=>{
        this.addClass(classes,true)
        this.delayQueue.shift();
        if(this.delayQueue.length<=0) this.resetDelay();
      },delay,classList);
      return this;
    }
    removeClassDelay(classList,delay){
      this.delayQueue.push(delay);
      setTimeout((classes)=>{
        this.removeClass(classes,true)
        this.delayQueue.shift();
        if(this.delayQueue.length<=0) this.resetDelay();
      },delay,classList);
      return this;
    }
    addClass(classList,x=false){
      // if(!this.element) return this;
      if(!x && this.delayOffset>0) return this.addClassDelay(classList,this.delayOffset);
      if(classList.trim()!=''){
        var classes = classList.trim().split(' ');
        for(let c of classes) this.element.classList.add(c)
      }
      return this;
    }
    toggleClass(classList){
      // if(!this.element) return this;
      if(classList.trim()!=''){
        var classes = classList.trim().split(' ');
        for(let c of classes) {
          let cls = c.trim();
          if(this.hasClass(cls)){
            this.removeClass(cls);
          }else{
            this.addClass(cls);
          }
        }
      }
      return this;
    }
    bem(block,element=null){
      this.bemCfg = {block,element};
    }
    getModClass(className){
      if(!this.bemCfg) return className;
      let mods = className.split(' ');
      for(var m=0;m<mods.length;m++){
        let mod = this.bemCfg.block;
        if(this.bemCfg.element) mod+='__'+this.bemCfg.element;
        mods[m] = mod+'--'+mods[m];
      }
      return mods.join(' ');
    }
    addMod(className){
      if(this.bemCfg) className = this.getModClass(className);
      return this.addClass(className)
    }
    remMod(className){
      if(this.bemCfg) className = this.getModClass(className);
      return this.removeClass(className)
    }
    hasMod(className){
      className = this.getModClass(className);
      return this.hasClass(className)
    }
    removeClass(classList,x=false){
    //   if(!this.element) return this;
      if(!x && this.delayOffset>0) return this.removeClassDelay(classList,this.delayOffset);
      if(classList.trim()!=''){
        var classes = classList.trim().split(' ');
        for(let c of classes) this.element.classList.remove(c)
      }
      return this;
    }
    hasClass(c){
      if(!this.element) return false;
      return this.element.classList.contains(c);
    }
    find(s){
      return JQDom.find(s,this.element);
    }
    findBem(block,element){
      let s = '.'+block;
      if(element) s+='__'+element;
      // console.log(s);
      let result = JQDom.find(s,this.element);
      result.bem(block,element);
      return result;
    }
    first(){
      return this;
    }
    get(i){
      return this;
    }
    last(){
      return this;
    }
    on(event,callback){
      // if(!this.element) return this;
      this.element.addEventListener(event,callback,false);
      return this;
    }
    off(event,callback){
    //   if(!this.element) return this;
      this.element.removeEventListener(event,callback,false);
      return this;
    }
    html(content){
    //   if(!this.element) return this;
      this.element.innerHTML = content;
      return this;
  
    }
    scrollTop(content){
      if(!this.element) return 0;
      return this.element.scrollTop||0;
    }
    hover(over,out){
      if(over) this.on('mouseenter',over);
      if(out) this.on('mouseleave',out);
      return this;
    }
    parent(){
      return new JQElement(this.element.parentElement);
    }
    offset(){
      if(!this.element) return {top:0,left:0};
      return this.element.getBoundingClientRect();
    }
    classes(index){
      if(!this.element) return [];
      if(index==undefined){
        return this.element.classList.length;
      }else{
        return this.element.classList[index];
      }
    }
    data(key,value){
      if(!this.element) return false;
      if(value!==undefined){
        this.element.dataset[key] = value;
        return this;
      }else{
        return this.element.dataset[key];
      };
    }
  
  
    swipeHorizontal(left,right){
      this.touchData = {
        startx:0,
        events:{}
      };
      if(left) this.touchData.events.left = left;
      if(right) this.touchData.events.right = right;
      this.on('touchstart',(e)=>this.touchData.endx = this.touchData.startx = e.targetTouches[0].clientX);
      this.on('touchend',(e)=>{
        let distance = this.touchData.endx-this.touchData.startx;
        if(Math.abs(distance)>50){
          if(distance<0 && this.touchData.events.left){
            this.touchData.events.left();
          }else if(distance>0 && this.touchData.events.right){
            this.touchData.events.right();
          }
        }
      });
      this.on('touchmove', (e)=>this.touchData.endx = e.targetTouches[0].clientX);
    }
    swipeHorizontalMouse(left,right){
      this.mouseData = {
        startx:0,
        events:{}
      };
      if(left) this.mouseData.events.left = left;
      if(right) this.mouseData.events.right = right;
      this.on('mousedown',(e)=>this.mouseData.endx = this.mouseData.startx = e.clientX);
      this.on('mouseup',(e)=>{
        let distance = this.mouseData.endx-this.mouseData.startx;
        if(Math.abs(distance)>50){
          if(distance<0 && this.mouseData.events.left){
            this.mouseData.events.left();
          }else if(distance>0 && this.mouseData.events.right){
            this.mouseData.events.right();
          }
        }
      });
      this.on('mousemove', (e)=>this.mouseData.endx = e.clientX);
    }
    get length(){
      return 1;
    }
  }
  
  class JQList {
    constructor(elements=[]){
      this.elements = elements;
    }
    get length(){
      return this.elements.length||0;
    }
    forEach(callback){
      let ix=0;
      this.elements.forEach((item)=>{
        callback(item.element,ix);
        ix++
      });
    }
    forEach$(callback){
      let ix=0;
      this.elements.forEach((item)=>{
        callback(item,ix);
        ix++
      });
    }
    push(element){
      this.elements.push(element)
    };
    _call(method,param,other=null){
      this.elements.forEach((item)=>item[method](param,other));
      return this;
    }
    addClass(classList){
      return this._call('addClass',classList);
    }
    addClassDelay(classList,delay){
      return this._call('addClassDelay',classList,delay);
    }
    toggleClass(classList){
      return this._call('toggleClass',classList);
    }
    removeClass(classList){
      return this._call('removeClass',classList);
    }
    removeClassDelay(classList,delay){
      return this._call('removeClass',classList,delay);
    }
    css(cssProps){
      return this._call('css',cssProps);
    }
    find(selector){
      return this._call('find',selector);
    }
    findBem(block,element){
      this.elements.forEach((item)=>item.findBem(block,element));
      return this;
    }
    first(){
      return this.get(0);
    }
    get(ix){
      return this.elements[ix];
    }
    last(){
      return this.get(this.length-1);
    }
    hasClass(className){
      return this._call('hasClass',className);
    }
    addMod(className){
      return this._call('addMod',className);
    }
    remMod(className){
      return this._call('remMod',className);
    }
    hasMod(className){
      return this._call('hasMod',className);
    }
    html(content){
      return this._call('html',content);
    }
    click(callback){
      return this._call('click',callback);
    }
    parent(){
      return this._call('parent');
    }
    offset(){
      return this._call('offset');
    }
    show(){
      return this._call('show');
    }
    hide(){
      return this._call('hide');
    }
    scrollTop(){
      return this._call('scrollTop');
    }
    on(method,callback){
      this.elements.forEach((item)=>item.on(method,callback));
      return this;
    }
    off(method,callback){
      this.elements.forEach((item)=>item.off(method,callback));
      return this;
    }
    hover(over,out){
      this.elements.forEach((item)=>item.hover(over,out));
      return this;
    }
  
    bem(block,element){
      this.elements.forEach((item)=>item.bem(block,element));
      return this;
    }
  }
  
  export default JQDom.find;
  export {
    JQDom,
    JQElement,
    JQList
  };  