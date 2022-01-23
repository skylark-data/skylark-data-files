/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-funcs/defer","skylark-langx-async","skylark-langx-paths","skylark-data-compression/inflate-raw","../../inodes/dir-inode","../../inodes/file-inode","../../inodes/file-index","../../no-sync-file","../synchronous-provider","../../error-codes","../../file-error","../../action-type","../../stats","../../file-type","../core/global","../core/util","./extended_ascii","./central-directory","./compression-method","./end-of-central-directory","./zip-toc"],function(e,t,n,i,r,o,s,a,c,d,l,h,p,u,f,E,y,g,I,w,m){const{arrayish2Buffer:x,copyingSlice:_,bufferValidator:D}=E;class N extends SynchronousProvider{constructor(e,t=""){super(),this.name=t,this._index=new FileIndex,this._directoryEntries=[],this._eocd=null,this._index=e.index,this._directoryEntries=e.directoryEntries,this._eocd=e.eocd,this.data=e.data}static Create(e,t){try{N._computeIndex(e.zipData,(n,i)=>{if(i){const n=new N(i,e.name);t(null,n)}else t(n)})}catch(e){t(e)}}static isAvailable(){return!0}static _getEOCD(e){const t=Math.min(65557,e.length-1);for(let n=22;n<t;n++)if(101010256===e.readUInt32LE(e.length-n))return new w(e.slice(e.length-n));throw new l(d.EINVAL,"Invalid ZIP file: Could not locate End of Central Directory signature.")}static _addToIndex(e,t){let n=e.fileName();if("/"===n.charAt(0))throw new l(d.EPERM,"Unexpectedly encountered an absolute path in a zip file. Please file a bug.");"/"===n.charAt(n.length-1)&&(n=n.substr(0,n.length-1)),e.isDirectory()?t.addPathFast("/"+n,new r(e)):t.addPathFast("/"+n,new o(e))}static _computeIndex(e,t){try{const n=new FileIndex,i=N._getEOCD(e);if(i.diskNumber()!==i.cdDiskNumber())return t(new l(d.EINVAL,"ZipProvider does not support spanned zip files."));const r=i.cdOffset();if(4294967295===r)return t(new l(d.EINVAL,"ZipProvider does not support Zip64."));const o=r+i.cdSize();N._computeIndexResponsive(e,n,r,o,t,[],i)}catch(e){t(e)}}static _computeIndexResponsiveTrampoline(e,t,n,i,r,o,s){try{N._computeIndexResponsive(e,t,n,i,r,o,s)}catch(e){r(e)}}static _computeIndexResponsive(t,n,i,r,o,s,a){if(i<r){let c=0;for(;c++<200&&i<r;){const e=new g(t,t.slice(i));N._addToIndex(e,n),i+=e.totalSize(),s.push(e)}e(()=>{N._computeIndexResponsiveTrampoline(t,n,i,r,o,s,a)})}else o(null,new m(n,s,a,t))}getName(){return N.Name+(""!==this.name?` ${this.name}`:"")}getCentralDirectoryEntry(e){const t=this._index.getInode(e);if(null===t)throw l.ENOENT(e);if(o.isFileInode(t))return t.getData();if(r.isDirInode(t))return t.getData();throw l.EPERM(`Invalid inode: ${t}`)}getCentralDirectoryEntryAt(e){const t=this._directoryEntries[e];if(!t)throw new RangeError(`Invalid directory index: ${e}.`);return t}getNumberOfCentralDirectoryEntries(){return this._directoryEntries.length}getEndOfCentralDirectory(){return this._eocd}diskSpace(e,t){t(this.data.length,0)}isReadOnly(){return!0}supportsLinks(){return!1}supportsProps(){return!1}supportsSynch(){return!0}statSync(e,t){const n=this._index.getInode(e);if(null===n)throw l.ENOENT(e);let i;if(o.isFileInode(n))i=n.getData().getStats();else{if(!r.isDirInode(n))throw new l(d.EINVAL,"Invalid inode.");i=n.getStats()}return i}openSync(e,t,n){if(t.isWriteable())throw new l(d.EPERM,e);const i=this._index.getInode(e);if(!i)throw l.ENOENT(e);if(!o.isFileInode(i))throw l.EISDIR(e);{const n=i.getData(),r=n.getStats();switch(t.pathExistsAction()){case h.THROW_EXCEPTION:case h.TRUNCATE_FILE:throw l.EEXIST(e);case h.NOP:return new a(this,e,t,r,n.getData());default:throw new l(d.EINVAL,"Invalid FileMode object.")}}}readdirSync(e){const t=this._index.getInode(e);if(t){if(r.isDirInode(t))return t.getListing();throw l.ENOTDIR(e)}throw l.ENOENT(e)}readFileSync(e,t,n){const i=this.openSync(e,n,420);try{const e=i.getBuffer();return null===t?_(e):e.toString(t)}finally{i.closeSync()}}}return N.Name="ZipProvider",N.Options={zipData:{type:"object",description:"The zip file as a Buffer object.",validator:D},name:{type:"string",optional:!0,description:"The name of the zip file (optional)."}},N.CompressionMethod=I,N.RegisterDecompressionMethod(I.DEFLATE,(e,t,n)=>x(i(e.slice(0,t),{chunkSize:n}))),N.RegisterDecompressionMethod(I.STORED,(e,t,n)=>_(e,0,n)),N});
//# sourceMappingURL=../../sourcemaps/providers/zip/zip-provider.js.map