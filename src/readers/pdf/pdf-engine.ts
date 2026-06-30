import { Platform } from 'react-native';

export function getPdfSourceUri(path: string): string {
  if (Platform.OS === 'web') return path;
  return path.startsWith('file://') ? path : `file://${path}`;
}

export function getViewerHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#525659}
#viewer{width:100%;height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:8px 0}
.page{margin:4px auto;box-shadow:0 2px 8px rgba(0,0,0,.3);background:#fff}
.page canvas{display:block;width:100%;height:auto}
.loading,.error{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:sans-serif;font-size:15px;text-align:center;padding:20px;line-height:1.6}
.loading{color:#aaa}
.error{color:#ff6b6b}
</style>
</head>
<body>
<div id="viewer"><div class="loading">Loading PDF\u2026</div></div>
<script>
var W=window, P=W.pdfjsLib, D=document, pdfDoc=null, scale=1.5, cache={};
function injectPDFjs(cb){
  if(typeof pdfjsLib!=='undefined'&&pdfjsLib){cb();return}
  var s=D.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  s.onload=function(){
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    cb();
  };
  s.onerror=function(){ D.getElementById('viewer').innerHTML='<div class="error">Failed to load PDF engine.\\nInternet required for first use.</div>' };
  D.head.appendChild(s);
}
function render(n){
  var el=D.getElementById('p'+n);
  if(!el||cache[n]){if(el)el.scrollIntoView({behavior:'smooth'});return}
  pdfDoc.getPage(n).then(function(pg){
    var vp=pg.getViewport({scale:scale});
    el.style.height=vp.height+'px';
    el.innerHTML='';
    var cv=D.createElement('canvas');
    cv.width=vp.width;cv.height=vp.height;
    el.appendChild(cv);
    pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise.then(function(){cache[n]=1;update()});
  });
}
function renderAll(){if(!pdfDoc)return;for(var i=1;i<=pdfDoc.numPages;i++)!function(p){setTimeout(function(){render(p)},p*80)}(i)}
function update(){
  if(!pdfDoc)return;
  var c=D.getElementById('viewer').querySelector('.page:last-child');
  W.ReactNativeWebView&&W.ReactNativeWebView.postMessage(JSON.stringify({type:'pages',total:pdfDoc.numPages}));
}
function loadPDF(url){
  D.getElementById('viewer').innerHTML='<div class="loading">Loading PDF\u2026</div>';
  injectPDFjs(function(){
    pdfjsLib.getDocument(url).promise.then(function(doc){
      pdfDoc=doc;cache={};
      var h='';
      for(var i=1;i<=doc.numPages;i++)h+='<div id="p'+i+'" class="page"></div>';
      D.getElementById('viewer').innerHTML=h;
      renderAll();
      W.ReactNativeWebView&&W.ReactNativeWebView.postMessage(JSON.stringify({type:'loaded',pages:doc.numPages}));
    },function(err){
      D.getElementById('viewer').innerHTML='<div class="error">'+err.message+'</div>';
      W.ReactNativeWebView&&W.ReactNativeWebView.postMessage(JSON.stringify({type:'error',message:err.message}));
    });
  });
}
W.addEventListener('message',function(e){
  try{var m=JSON.parse(e.data);if(m.type==='load')loadPDF(m.url);if(m.type==='go'&&pdfDoc){render(Math.max(1,Math.min(m.page,pdfDoc.numPages)))}if(m.type==='zi'&&pdfDoc){scale=Math.min(5,scale+.25);cache={};renderAll()}if(m.type==='zo'&&pdfDoc){scale=Math.max(.5,scale-.25);cache={};renderAll()}}catch(e){}
});
</script>
</body>
</html>`;
}
