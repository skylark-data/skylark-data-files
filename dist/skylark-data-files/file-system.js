/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-funcs/defer","skylark-langx-binary/buffer","skylark-langx-paths","./files","./error-codes","./file-error","./file-flag","./stats"],function(t,n,e,r,o,i,c,s){"use strict";let a=function(t,n){return t};function l(n,e){if("function"!=typeof n)throw new Error("Callback must be a function.");const r=a(n,e);switch(e){case 1:return function(n){t(function(){return r(n)})};case 2:return function(n,e){t(function(){return r(n,e)})};case 3:return function(n,e,o){t(function(){return r(n,e,o)})};default:throw new Error("Invalid invocation of wrapCb.")}}function f(t){if(t)return t;throw new i(o.EIO,"Initialize BrowserFS with a file system using BrowserFS.initialize(filesystem)")}function h(t,n){switch(typeof t){case"number":return t;case"string":const e=parseInt(t,8);return isNaN(e)?n:e;default:return n}}function u(t){if(t instanceof Date)return t;if("number"==typeof t)return new Date(1e3*t);throw new i(o.EINVAL,"Invalid time.")}function y(t){if(t.indexOf("\0")>=0)throw new i(o.EINVAL,"Path must be a string without null bytes.");if(""===t)throw new i(o.EINVAL,"Path must not be empty.");return e.resolve(t)}function d(t,n,e,r){switch(null===t?"null":typeof t){case"object":return{encoding:void 0!==t.encoding?t.encoding:n,flag:void 0!==t.flag?t.flag:e,mode:h(t.mode,r)};case"string":return{encoding:t,flag:e,mode:r};case"null":case"undefined":case"function":return{encoding:n,flag:e,mode:r};default:throw new TypeError(`"options" must be a string or an object, got ${typeof t} instead.`)}}function w(){}return r.FileSystem=class{constructor(){this.F_OK=0,this.R_OK=4,this.W_OK=2,this.X_OK=1,this.root=null,this.fdMap={},this.nextFd=100}initialize(t){if(!t.constructor.isAvailable())throw new i(o.EINVAL,"Tried to instantiate BrowserFS with an unavailable file system.");return this.root=t}_toUnixTimestamp(t){if("number"==typeof t)return t;if(t instanceof Date)return t.getTime()/1e3;throw new Error("Cannot parse time: "+t)}getRootFS(){return this.root?this.root:null}rename(t,n,e=w){const r=l(e,1);try{f(this.root).rename(y(t),y(n),r)}catch(t){r(t)}}renameSync(t,n){f(this.root).renameSync(y(t),y(n))}exists(t,n=w){const e=l(n,1);try{return f(this.root).exists(y(t),e)}catch(t){return e(!1)}}existsSync(t){try{return f(this.root).existsSync(y(t))}catch(t){return!1}}stat(t,n=w){const e=l(n,2);try{return f(this.root).stat(y(t),!1,e)}catch(t){return e(t)}}statSync(t){return f(this.root).statSync(y(t),!1)}lstat(t,n=w){const e=l(n,2);try{return f(this.root).stat(y(t),!0,e)}catch(t){return e(t)}}lstatSync(t){return f(this.root).statSync(y(t),!0)}truncate(t,n=0,e=w){let r=0;"function"==typeof n?e=n:"number"==typeof n&&(r=n);const c=l(e,1);try{if(r<0)throw new i(o.EINVAL);return f(this.root).truncate(y(t),r,c)}catch(t){return c(t)}}truncateSync(t,n=0){if(n<0)throw new i(o.EINVAL);return f(this.root).truncateSync(y(t),n)}unlink(t,n=w){const e=l(n,1);try{return f(this.root).unlink(y(t),e)}catch(t){return e(t)}}unlinkSync(t){return f(this.root).unlinkSync(y(t))}open(t,n,e,r=w){const o=h(e,420),i=l(r="function"==typeof e?e:r,2);try{f(this.root).open(y(t),c.getFileFlag(n),o,(t,n)=>{n?i(t,this.getFdForFile(n)):i(t)})}catch(t){i(t)}}openSync(t,n,e=420){return this.getFdForFile(f(this.root).openSync(y(t),c.getFileFlag(n),h(e,420)))}readFile(t,n={},e=w){const r=d(n,null,"r",null),s=l(e="function"==typeof n?n:e,2);try{const n=c.getFileFlag(r.flag);return n.isReadable()?f(this.root).readFile(y(t),r.encoding,n,s):s(new i(o.EINVAL,"Flag passed to readFile must allow for reading."))}catch(t){return s(t)}}readFileSync(t,n={}){const e=d(n,null,"r",null),r=c.getFileFlag(e.flag);if(!r.isReadable())throw new i(o.EINVAL,"Flag passed to readFile must allow for reading.");return f(this.root).readFileSync(y(t),e.encoding,r)}writeFile(t,n,e={},r=w){const s=d(e,"utf8","w",420),a=l(r="function"==typeof e?e:r,1);try{const e=c.getFileFlag(s.flag);return e.isWriteable()?f(this.root).writeFile(y(t),n,s.encoding,e,s.mode,a):a(new i(o.EINVAL,"Flag passed to writeFile must allow for writing."))}catch(t){return a(t)}}writeFileSync(t,n,e){const r=d(e,"utf8","w",420),s=c.getFileFlag(r.flag);if(!s.isWriteable())throw new i(o.EINVAL,"Flag passed to writeFile must allow for writing.");return f(this.root).writeFileSync(y(t),n,r.encoding,s,r.mode)}appendFile(t,n,e,r=w){const s=d(e,"utf8","a",420),a=l(r="function"==typeof e?e:r,1);try{const e=c.getFileFlag(s.flag);if(!e.isAppendable())return a(new i(o.EINVAL,"Flag passed to appendFile must allow for appending."));f(this.root).appendFile(y(t),n,s.encoding,e,s.mode,a)}catch(t){a(t)}}appendFileSync(t,n,e){const r=d(e,"utf8","a",420),s=c.getFileFlag(r.flag);if(!s.isAppendable())throw new i(o.EINVAL,"Flag passed to appendFile must allow for appending.");return f(this.root).appendFileSync(y(t),n,r.encoding,s,r.mode)}fstat(t,n=w){const e=l(n,2);try{this.fd2file(t).stat(e)}catch(t){e(t)}}fstatSync(t){return this.fd2file(t).statSync()}close(t,n=w){const e=l(n,1);try{this.fd2file(t).close(n=>{n||this.closeFd(t),e(n)})}catch(t){e(t)}}closeSync(t){this.fd2file(t).closeSync(),this.closeFd(t)}ftruncate(t,n,e=w){const r="number"==typeof n?n:0,c=l(e="function"==typeof n?n:e,1);try{const n=this.fd2file(t);if(r<0)throw new i(o.EINVAL);n.truncate(r,c)}catch(t){c(t)}}ftruncateSync(t,n=0){const e=this.fd2file(t);if(n<0)throw new i(o.EINVAL);e.truncateSync(n)}fsync(t,n=w){const e=l(n,1);try{this.fd2file(t).sync(e)}catch(t){e(t)}}fsyncSync(t){this.fd2file(t).syncSync()}fdatasync(t,n=w){const e=l(n,1);try{this.fd2file(t).datasync(e)}catch(t){e(t)}}fdatasyncSync(t){this.fd2file(t).datasyncSync()}write(t,e,r,c,s,a=w){let f,h,u,y=null;if("string"==typeof e){let t="utf8";switch(typeof r){case"function":a=r;break;case"number":y=r,t="string"==typeof c?c:"utf8",a="function"==typeof s?s:a;break;default:return(a="function"==typeof c?c:"function"==typeof s?s:a)(new i(o.EINVAL,"Invalid arguments."))}h=0,u=(f=n.from(e,t)).length}else f=e,h=r,u=c,y="number"==typeof s?s:null,a="function"==typeof s?s:a;const d=l(a,3);try{const n=this.fd2file(t);void 0!==y&&null!==y||(y=n.getPos()),n.write(f,h,u,y,d)}catch(t){d(t)}}writeSync(t,e,r,o,i){let c,s,a,l=0;if("string"==typeof e){a="number"==typeof r?r:null;const t="string"==typeof o?o:"utf8";l=0,s=(c=n.from(e,t)).length}else c=e,l=r,s=o,a="number"==typeof i?i:null;const f=this.fd2file(t);return void 0!==a&&null!==a||(a=f.getPos()),f.writeSync(c,l,s,a)}read(t,e,r,o,i,c=w){let s,a,f,h,u;if("number"==typeof e){f=e,s=r;const t=o;c="function"==typeof i?i:c,a=0,h=n.alloc(f),u=l((n,e,r)=>{if(n)return c(n);c(n,r.toString(t),e)},3)}else h=e,a=r,f=o,s=i,u=l(c,3);try{const n=this.fd2file(t);void 0!==s&&null!==s||(s=n.getPos()),n.read(h,a,f,s,u)}catch(t){u(t)}}readSync(t,e,r,o,i){let c,s,a,l,f=!1,h="utf8";"number"==typeof e?(a=e,l=r,h=o,s=0,c=n.alloc(a),f=!0):(c=e,s=r,a=o,l=i);const u=this.fd2file(t);void 0!==l&&null!==l||(l=u.getPos());const y=u.readSync(c,s,a,l);return f?[c.toString(h),y]:y}fchown(t,n,e,r=w){const o=l(r,1);try{this.fd2file(t).chown(n,e,o)}catch(t){o(t)}}fchownSync(t,n,e){this.fd2file(t).chownSync(n,e)}fchmod(t,n,e){const r=l(e,1);try{const e="string"==typeof n?parseInt(n,8):n;this.fd2file(t).chmod(e,r)}catch(t){r(t)}}fchmodSync(t,n){const e="string"==typeof n?parseInt(n,8):n;this.fd2file(t).chmodSync(e)}futimes(t,n,e,r=w){const o=l(r,1);try{const r=this.fd2file(t);"number"==typeof n&&(n=new Date(1e3*n)),"number"==typeof e&&(e=new Date(1e3*e)),r.utimes(n,e,o)}catch(t){o(t)}}futimesSync(t,n,e){this.fd2file(t).utimesSync(u(n),u(e))}rmdir(t,n=w){const e=l(n,1);try{t=y(t),f(this.root).rmdir(t,e)}catch(t){e(t)}}rmdirSync(t){return t=y(t),f(this.root).rmdirSync(t)}mkdir(t,n,e=w){"function"==typeof n&&(e=n,n=511);const r=l(e,1);try{t=y(t),f(this.root).mkdir(t,n,r)}catch(t){r(t)}}mkdirSync(t,n){f(this.root).mkdirSync(y(t),h(n,511))}readdir(t,n=w){const e=l(n,2);try{t=y(t),f(this.root).readdir(t,e)}catch(t){e(t)}}readdirSync(t){return t=y(t),f(this.root).readdirSync(t)}link(t,n,e=w){const r=l(e,1);try{t=y(t),n=y(n),f(this.root).link(t,n,r)}catch(t){r(t)}}linkSync(t,n){return t=y(t),n=y(n),f(this.root).linkSync(t,n)}symlink(t,n,e,r=w){const c="string"==typeof e?e:"file",s=l(r="function"==typeof e?e:r,1);try{if("file"!==c&&"dir"!==c)return s(new i(o.EINVAL,"Invalid type: "+c));t=y(t),n=y(n),f(this.root).symlink(t,n,c,s)}catch(t){s(t)}}symlinkSync(t,n,e){if(e){if("file"!==e&&"dir"!==e)throw new i(o.EINVAL,"Invalid type: "+e)}else e="file";return t=y(t),n=y(n),f(this.root).symlinkSync(t,n,e)}readlink(t,n=w){const e=l(n,2);try{t=y(t),f(this.root).readlink(t,e)}catch(t){e(t)}}readlinkSync(t){return t=y(t),f(this.root).readlinkSync(t)}chown(t,n,e,r=w){const o=l(r,1);try{t=y(t),f(this.root).chown(t,!1,n,e,o)}catch(t){o(t)}}chownSync(t,n,e){t=y(t),f(this.root).chownSync(t,!1,n,e)}lchown(t,n,e,r=w){const o=l(r,1);try{t=y(t),f(this.root).chown(t,!0,n,e,o)}catch(t){o(t)}}lchownSync(t,n,e){t=y(t),f(this.root).chownSync(t,!0,n,e)}chmod(t,n,e=w){const r=l(e,1);try{const e=h(n,-1);if(e<0)throw new i(o.EINVAL,"Invalid mode.");f(this.root).chmod(y(t),!1,e,r)}catch(t){r(t)}}chmodSync(t,n){const e=h(n,-1);if(e<0)throw new i(o.EINVAL,"Invalid mode.");t=y(t),f(this.root).chmodSync(t,!1,e)}lchmod(t,n,e=w){const r=l(e,1);try{const e=h(n,-1);if(e<0)throw new i(o.EINVAL,"Invalid mode.");f(this.root).chmod(y(t),!0,e,r)}catch(t){r(t)}}lchmodSync(t,n){const e=h(n,-1);if(e<1)throw new i(o.EINVAL,"Invalid mode.");f(this.root).chmodSync(y(t),!0,e)}utimes(t,n,e,r=w){const o=l(r,1);try{f(this.root).utimes(y(t),u(n),u(e),o)}catch(t){o(t)}}utimesSync(t,n,e){f(this.root).utimesSync(y(t),u(n),u(e))}realpath(t,n,e=w){const r="object"==typeof n?n:{},o=l("function"==typeof n?n:w,2);try{t=y(t),f(this.root).realpath(t,r,o)}catch(t){o(t)}}realpathSync(t,n={}){return t=y(t),f(this.root).realpathSync(t,n)}watchFile(t,n,e=w){throw new i(o.ENOTSUP)}unwatchFile(t,n=w){throw new i(o.ENOTSUP)}watch(t,n,e=w){throw new i(o.ENOTSUP)}access(t,n,e=w){throw new i(o.ENOTSUP)}accessSync(t,n){throw new i(o.ENOTSUP)}createReadStream(t,n){throw new i(o.ENOTSUP)}createWriteStream(t,n){throw new i(o.ENOTSUP)}wrapCallbacks(t){a=t}getFdForFile(t){const n=this.nextFd++;return this.fdMap[n]=t,n}fd2file(t){const n=this.fdMap[t];if(n)return n;throw new i(o.EBADF,"Invalid file descriptor.")}closeFd(t){delete this.fdMap[t]}}});
//# sourceMappingURL=sourcemaps/file-system.js.map
