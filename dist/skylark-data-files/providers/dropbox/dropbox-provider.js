/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-funcs/defer","skylark-langx-binary/buffer","skylark-langx-paths","../registry","../base-provider","../../stats","../../file-type","../../file-error","../../error-codes","../../utils","./dropbox-file"],function(e,t,r,a,s,n,o,i,c,l,h){"use strict";const{arrayBuffer2Buffer:u,buffer2ArrayBuffer:f}=l,{dirname:p}=r;function _(e){return"/"===e?"":e}function d(e){const t=e.error;if(t[".tag"])return t;if(t.error){const e=t.error;return e[".tag"]?e:e.reason&&e.reason[".tag"]?e.reason:e}if("string"==typeof t)try{const r=JSON.parse(t);if(r.error&&r.error.reason&&r.error.reason[".tag"])return r.error.reason}catch(e){}return t}function w(e){if(e.user_message)return e.user_message.text;if(e.error_summary)return e.error_summary;if("string"==typeof e.error)return e.error;if("object"==typeof e.error)return w(e.error);throw new Error(`Dropbox's servers gave us a garbage error message: ${JSON.stringify(e)}`)}function m(e,t,r){switch(e[".tag"]){case"malformed_path":return new i(c.EBADF,r,t);case"not_found":return i.ENOENT(t);case"not_file":return i.EISDIR(t);case"not_folder":return i.ENOTDIR(t);case"restricted_content":return i.EPERM(t);case"other":default:return new i(c.EIO,r,t)}}function E(e,t,r){switch(e[".tag"]){case"malformed_path":case"disallowed_name":return new i(c.EBADF,r,t);case"conflict":case"no_write_permission":case"team_folder":return i.EPERM(t);case"insufficient_space":return new i(c.ENOSPC,r);case"other":default:return new i(c.EIO,r,t)}}function b(e,t,r){const a={path:_(t)};e.filesDeleteV2(a).then(()=>{r()}).catch(a=>{const s=d(a);switch(s[".tag"]){case"path_lookup":r(m(s.path_lookup,t,w(a)));break;case"path_write":r(E(s.path_write,t,w(a)));break;case"too_many_write_operations":setTimeout(()=>b(e,t,r),500+300*Math.random());break;case"other":default:r(new i(c.EIO,w(a),t))}})}class y extends s{constructor(e){super(),this._client=e}static Create(e,t){t(null,new y(e.client))}static isAvailable(){return"undefined"!=typeof Dropbox}getName(){return y.Name}isReadOnly(){return!1}supportsSymlinks(){return!1}supportsProps(){return!1}supportsSynch(){return!1}empty(e){this.readdir("/",(t,r)=>{if(r){const t=a=>{0===r.length?e():b(this._client,r.shift(),t)};t()}else e(t)})}rename(e,t,r){this.stat(t,!1,(a,s)=>{const n=()=>{const a={from_path:_(e),to_path:_(t)};this._client.filesMoveV2(a).then(()=>r()).catch(function(a){const s=d(a);switch(s[".tag"]){case"from_lookup":r(m(s.from_lookup,e,w(a)));break;case"from_write":r(E(s.from_write,e,w(a)));break;case"to":r(E(s.to,t,w(a)));break;case"cant_copy_shared_folder":case"cant_nest_shared_folder":r(new i(c.EPERM,w(a),e));break;case"cant_move_folder_into_itself":case"duplicated_or_nested_paths":r(new i(c.EBADF,w(a),e));break;case"too_many_files":r(new i(c.ENOSPC,w(a),e));break;case"other":default:r(new i(c.EIO,w(a),e))}})};a?n():e===t?a?r(i.ENOENT(t)):r():s&&s.isDirectory()?r(i.EISDIR(t)):this.unlink(t,e=>{e?r(e):n()})})}stat(t,r,a){if("/"===t)return void e(function(){a(null,new n(o.DIRECTORY,4096))});const s={path:_(t)};this._client.filesGetMetadata(s).then(e=>{switch(e[".tag"]){case"file":const r=e;a(null,new n(o.FILE,r.size));break;case"folder":a(null,new n(o.DIRECTORY,4096));break;case"deleted":a(i.ENOENT(t))}}).catch(e=>{const r=d(e);switch(r[".tag"]){case"path":a(m(r.path,t,w(e)));break;default:a(new i(c.EIO,w(e),t))}})}openFile(e,t,r){const a={path:_(e)};this._client.filesDownload(a).then(a=>{const s=a.fileBlob,i=new FileReader;i.onload=(()=>{const a=i.result;r(null,new h(this,e,t,new n(o.FILE,a.byteLength),u(a)))}),i.readAsArrayBuffer(s)}).catch(t=>{const a=d(t);switch(a[".tag"]){case"path":r(m(a.path,e,w(t)));break;case"other":default:r(new i(c.EIO,w(t),e))}})}createFile(e,r,a,s){const l=t.alloc(0),u={contents:new Blob([f(l)],{type:"octet/stream"}),path:_(e)};this._client.filesUpload(u).then(t=>{s(null,new h(this,e,r,new n(o.FILE,0),l))}).catch(t=>{const n=d(t);switch(n[".tag"]){case"path":s(E(n.path.reason,e,w(t)));break;case"too_many_write_operations":setTimeout(()=>this.createFile(e,r,a,s),500+300*Math.random());break;case"other":default:s(new i(c.EIO,w(t),e))}})}unlink(e,t){this.stat(e,!1,(r,a)=>{a?a.isDirectory()?t(i.EISDIR(e)):b(this._client,e,t):t(r)})}rmdir(e,t){this.readdir(e,(r,a)=>{a?a.length>0?t(i.ENOTEMPTY(e)):b(this._client,e,t):t(r)})}mkdir(e,t,r){const a=p(e);this.stat(a,!1,(s,n)=>{if(s)r(s);else if(n&&!n.isDirectory())r(i.ENOTDIR(a));else{const a={path:_(e)};this._client.filesCreateFolderV2(a).then(()=>r()).catch(a=>{"too_many_write_operations"===d(a)[".tag"]?setTimeout(()=>this.mkdir(e,t,r),500+300*Math.random()):r(E(d(a).path,e,w(a)))})}})}readdir(e,t){const r={path:_(e)};this._client.filesListFolder(r).then(r=>{!function e(t,r,a,s,n){const o=a.entries.map(e=>e.path_display).filter(e=>!!e);const i=s.concat(o);if(a.has_more){const s={cursor:a.cursor};t.filesListFolderContinue(s).then(a=>{e(t,r,a,i,n)}).catch(e=>{g(e,r,n)})}else n(null,i)}(this._client,e,r,[],t)}).catch(r=>{g(r,e,t)})}_syncFile(e,t,r){const a={contents:new Blob([f(t)],{type:"octet/stream"}),path:_(e),mode:{".tag":"overwrite"}};this._client.filesUpload(a).then(()=>{r()}).catch(a=>{const s=d(a);switch(s[".tag"]){case"path":r(E(s.path.reason,e,w(a)));break;case"too_many_write_operations":setTimeout(()=>this._syncFile(e,t,r),500+300*Math.random());break;case"other":default:r(new i(c.EIO,w(a),e))}})}}function g(e,t,r){const a=d(e);switch(a[".tag"]){case"path":r(m(a.path,t,w(e)));break;case"other":default:r(new i(c.EIO,w(e),t))}}return y.Name="DropboxV2",y.Options={client:{type:"object",description:"An *authenticated* Dropbox client. Must be from the 2.5.x JS SDK."}},y.DropboxFile=h,y});
//# sourceMappingURL=../../sourcemaps/providers/dropbox/dropbox-provider.js.map
