"use strict";
import dayjs from "dayjs";

function Page(id,title,author,publishDate=null,creationDate,components=[]){
    this.id=id;
    this.title=title;
    this.author=author;
    this.publishDate=publishDate;
    this.creationDate=creationDate;
    this.components=components
}
    
function mapToPage(e){
    return new Page(e.id,e.title,e.author,e.publishDate ? dayjs(e.publishDate) : null,e.creationDate ? dayjs(e.creationDate) : null,e.contentBlocks?e.contentBlocks.map((component) => mapToComponent(component)):[]);
}

function mapFromPage(e){
    return {'id' : e.id , 'title' : e.title , 'author' : e.author, 'publishDate' : e.publishDate ? dayjs(e.publishDate).format("YYYY-MM-DD") : null , 'creationDate' : e.creationDate ? dayjs(e.creationDate).format("YYYY-MM-DD") : null,'contentBlocks' : e.components.map((component) => mapFromComponent(component))}
}

function Component(id,pageID,componentType,content,position){
    this.id=id;
    this.pageID=pageID;
    this.componentType=componentType;
    this.componentData=content;
    this.position=position;
}
    
function mapToComponent(e){
    //    return new Component(e.id,e.pageID,e.type,e.content,e.position);
    return new Component(e.id,e.pageID,e.type,e.content ,e.position);
}
function mapFromComponent(e){
    return {'id' : e.id , 'pageID' : e.pageID , 'type' : e.componentType, 'content' : e.componentData , 'position' : e.order}
}
export default Page
export {mapToPage , mapFromPage , mapToComponent , mapFromComponent , Component}