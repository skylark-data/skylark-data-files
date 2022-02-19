/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-async","skylark-langx-paths","../../no-sync-file","../base-provider","../../error-codes","../../file-error","../../action-type","../../stats","../../file-type","../../utils","./xhr","./fetch","../../inodes/dir-inode","../../inodes/file-index","../../inodes/file-inode"],function(e,t,n,i,r,s,l,a,o,c,u,h,f,d,y){"use strict";const{copyingSlice:S}=c,{xhrIsAvailable:p,asyncDownloadFile:I,syncDownloadFile:E,getFileSizeAsync:g,getFileSizeSync:_}=u,{fetchIsAvailable:F,fetchFileAsync:x,fetchFileSizeAsync:T}=h,w=y.isFileInode,N=f.isDirInode;function A(){throw new s(r.ENOTSUP,"Synchronous HTTP download methods are not available in this environment.")}class D extends i{constructor(e,t="",n=!1){super(),t.length>0&&"/"!==t.charAt(t.length-1)&&(t+="/"),this.prefixUrl=t,this._index=d.fromListing(e),!F||n&&p?(this._requestFileAsyncInternal=I,this._requestFileSizeAsyncInternal=g):(this._requestFileAsyncInternal=x,this._requestFileSizeAsyncInternal=T),p?(this._requestFileSyncInternal=E,this._requestFileSizeSyncInternal=_):(this._requestFileSyncInternal=A,this._requestFileSizeSyncInternal=A)}static Create(e,t){void 0===e.index&&(e.index="index.json"),"string"==typeof e.index?I(e.index,"json",(n,i)=>{n?t(n):t(null,new D(i,e.baseUrl))}):t(null,new D(e.index,e.baseUrl))}static isAvailable(){return p||F}empty(){this._index.fileIterator(function(e){e.fileData=null})}getName(){return D.Name}diskSpace(e,t){t(0,0)}isReadOnly(){return!0}supportsLinks(){return!1}supportsProps(){return!1}supportsSynch(){return p}preloadFile(e,t){const n=this._index.getInode(e);if(!w(n))throw s.EISDIR(e);{if(null===n)throw s.ENOENT(e);const i=n.getData();i.size=t.length,i.fileData=t}}stat(e,t,n){const i=this._index.getInode(e);if(null===i)return n(s.ENOENT(e));let l;w(i)?(l=i.getData()).size<0?this._requestFileSizeAsync(e,function(e,t){if(e)return n(e);l.size=t,n(null,a.clone(l))}):n(null,a.clone(l)):N(i)?(l=i.getStats(),n(null,l)):n(s.FileError(r.EINVAL,e))}statSync(e,t){const n=this._index.getInode(e);if(null===n)throw s.ENOENT(e);let i;if(w(n))(i=n.getData()).size<0&&(i.size=this._requestFileSizeSync(e));else{if(!N(n))throw s.FileError(r.EINVAL,e);i=n.getStats()}return i}open(e,t,i,o){if(t.isWriteable())return o(new s(r.EPERM,e));const c=this,u=this._index.getInode(e);if(null===u)return o(s.ENOENT(e));if(!w(u))return o(s.EISDIR(e));{const i=u.getData();switch(t.pathExistsAction()){case l.THROW_EXCEPTION:case l.TRUNCATE_FILE:return o(s.EEXIST(e));case l.NOP:if(i.fileData)return o(null,new n(c,e,t,a.clone(i),i.fileData));this._requestFileAsync(e,"buffer",function(r,s){return r?o(r):(i.size=s.length,i.fileData=s,o(null,new n(c,e,t,a.clone(i),s)))});break;default:return o(new s(r.EINVAL,"Invalid FileMode object."))}}}openSync(e,t,i){if(t.isWriteable())throw new s(r.EPERM,e);const o=this._index.getInode(e);if(null===o)throw s.ENOENT(e);if(!w(o))throw s.EISDIR(e);{const i=o.getData();switch(t.pathExistsAction()){case l.THROW_EXCEPTION:case l.TRUNCATE_FILE:throw s.EEXIST(e);case l.NOP:if(i.fileData)return new n(this,e,t,a.clone(i),i.fileData);const o=this._requestFileSync(e,"buffer");return i.size=o.length,i.fileData=o,new n(this,e,t,a.clone(i),o);default:throw new s(r.EINVAL,"Invalid FileMode object.")}}}readdir(e,t){try{t(null,this.readdirSync(e))}catch(e){t(e)}}readdirSync(e){const t=this._index.getInode(e);if(null===t)throw s.ENOENT(e);if(N(t))return t.getListing();throw s.ENOTDIR(e)}readFile(e,t,n,i){const r=i;this.open(e,n,420,function(e,n){if(e)return i(e);i=function(e,t){n.close(function(n){return e||(e=n),r(e,t)})};const s=n.getBuffer();null===t?i(e,S(s)):function(e,t,n){try{n(null,e.toString(t))}catch(e){n(e)}}(s,t,i)})}readFileSync(e,t,n){const i=this.openSync(e,n,420);try{const e=i.getBuffer();return null===t?S(e):e.toString(t)}finally{i.closeSync()}}_getHTTPPath(e){return"/"===e.charAt(0)&&(e=e.slice(1)),this.prefixUrl+e}_requestFileAsync(e,t,n){this._requestFileAsyncInternal(this._getHTTPPath(e),t,n)}_requestFileSync(e,t){return this._requestFileSyncInternal(this._getHTTPPath(e),t)}_requestFileSizeAsync(e,t){this._requestFileSizeAsyncInternal(this._getHTTPPath(e),t)}_requestFileSizeSync(e){return this._requestFileSizeSyncInternal(this._getHTTPPath(e))}}return D.Name="http",D.Options={index:{type:["string","object"],optional:!0,description:"URL to a file index as a JSON file or the file index object itself, generated with the make_http_index script. Defaults to `index.json`."},baseUrl:{type:"string",optional:!0,description:"Used as the URL prefix for fetched files. Default: Fetch files relative to the index."},preferXHR:{type:"boolean",optional:!0,description:"Whether to prefer XmlHttpRequest or fetch for async operations if both are available. Default: false"}},D});
//# sourceMappingURL=../../sourcemaps/providers/http/http-provider.js.map
