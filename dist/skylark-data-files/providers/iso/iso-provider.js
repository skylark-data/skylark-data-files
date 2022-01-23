/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-paths","../synchronous-provider","../../no-sync-file","../../stats","../../file-type","../../action-type","../../file-error","../../error-codes","../../utils"],function(t,e,r,i,s,o,n,a,c){"use strict";const{copyingSlice:h,bufferValidator:l}=c;class d extends e{constructor(t,e=""){super(),this._data=t;let r=!1,i=32768;const s=new Array;for(;!r;){const e=t.slice(i);switch(new VolumeDescriptor(e).type()){case 1:s.push(new PrimaryVolumeDescriptor(e));break;case 2:s.push(new SupplementaryVolumeDescriptor(e));break;case 255:r=!0}i+=2048}if(0===s.length)throw new n(a.EIO,"Unable to find a suitable volume descriptor.");s.forEach(t=>{this._pvd&&2===this._pvd.type()||(this._pvd=t)}),this._root=this._pvd.rootDirectoryEntry(t),this._name=e}static Create(t,e){try{e(null,new d(t.data,t.name))}catch(t){e(t)}}static isAvailable(){return!0}getName(){let t=`IsoProvider${this._name}${this._pvd?`-${this._pvd.name()}`:""}`;return this._root&&this._root.hasRockRidge()&&(t+="-RockRidge"),t}diskSpace(t,e){e(this._data.length,0)}isReadOnly(){return!0}supportsLinks(){return!1}supportsProps(){return!1}supportsSynch(){return!0}statSync(t,e){const r=this._getDirectoryRecord(t);if(null===r)throw n.ENOENT(t);return this._getStats(t,r)}openSync(e,i,s){if(i.isWriteable())throw new n(a.EPERM,e);const c=this._getDirectoryRecord(e);if(!c)throw n.ENOENT(e);if(c.isSymlink(this._data))return this.openSync(t.resolve(e,c.getSymlinkPath(this._data)),i,s);if(c.isDirectory(this._data))throw n.EISDIR(e);{const t=c.getFile(this._data),s=this._getStats(e,c);switch(i.pathExistsAction()){case o.THROW_EXCEPTION:case o.TRUNCATE_FILE:throw n.EEXIST(e);case o.NOP:return new r(this,e,i,s,t);default:throw new n(a.EINVAL,"Invalid FileMode object.")}}}readdirSync(t){const e=this._getDirectoryRecord(t);if(e){if(e.isDirectory(this._data))return e.getDirectory(this._data).getFileList().slice(0);throw n.ENOTDIR(t)}throw n.ENOENT(t)}readFileSync(t,e,r){const i=this.openSync(t,r,420);try{const t=i.getBuffer();return null===e?h(t):t.toString(e)}finally{i.closeSync()}}_getDirectoryRecord(t){if("/"===t)return this._root;const e=t.split("/").slice(1);let r=this._root;for(const t of e){if(!r.isDirectory(this._data))return null;if(!(r=r.getDirectory(this._data).getRecord(t)))return null}return r}_getStats(e,r){if(r.isSymlink(this._data)){const i=t.resolve(e,r.getSymlinkPath(this._data)),s=this._getDirectoryRecord(i);return s?this._getStats(i,s):null}{const t=r.dataLength();let e=365;const o=r.recordingDate().getTime();let n=o,a=o,c=o;if(r.hasRockRidge()){const t=r.getSUEntries(this._data);for(const r of t)if(r instanceof PXEntry)e=r.mode();else if(r instanceof TFEntry){const t=r.flags();4&t&&(n=r.access().getTime()),2&t&&(a=r.modify().getTime()),1&t&&(c=r.creation().getTime())}}return e&=365,new i(r.isDirectory(this._data)?s.DIRECTORY:s.FILE,t,e,n,a,c)}}}return d.Name="Iso",d.Options={data:{type:"object",description:"The ISO file in a buffer",validator:l}},d});
//# sourceMappingURL=../../sourcemaps/providers/iso/iso-provider.js.map