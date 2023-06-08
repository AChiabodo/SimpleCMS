"use strict";
import dayjs from "dayjs";

function Page(id,title,author,publishDate=null,creationDate){
    this.id=id;
    this.title=title;
    this.author=author;
    this.publishDate=publishDate;
    this.creationDate=creationDate;
}
    
function mapToPage(e){
    return new Page(e.id,e.title,e.author,e.publishDate ? dayjs(e.publishDate) : null,e.creationDate ? dayjs(e.creationDate) : null);
}

function mapFromPage(e){
    return {'id' : e.id , 'title' : e.title , 'author' : e.author, 'publishDate' : e.publishDate ? dayjs(e.publishDate).format("YYYY-MM-DD") : null , 'creationDate' : e.creationDate ? dayjs(e.creationDate).format("YYYY-MM-DD") : null}
}

function Component(id,pageID,componentType,componentData,order){
    this.id=id;
    this.pageID=pageID;
    this.componentType=componentType;
    this.componentData=componentData;
    this.order=order;
}
    
function mapToComponent(e){
    return new Component(e.id,e.pageID,e.type,e.content,e.position);
}
function mapFromComponent(e){
    return {'id' : e.id , 'pageID' : e.pageID , 'componentType' : e.componentType, 'componentData' : e.componentData , 'order' : e.order}
}
export default Page
export {mapToPage , mapFromPage , mapToComponent , mapFromComponent , Component}