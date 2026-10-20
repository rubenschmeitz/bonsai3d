(function(root){
  'use strict';
  var types={table:{base:35,width:240,depth:160,height:80,wood:25},jita:{base:20,width:180,depth:120,height:12,wood:15},pot:{base:30,width:180,depth:120,height:80,wood:0},miniature:{base:15,width:60,depth:60,height:80,wood:15},accent:{base:15,width:100,depth:80,height:30,wood:15},stone:{base:25,width:160,depth:100,height:25,wood:20},accessory:{base:10,width:100,depth:50,height:80,wood:15}};
  function money(n,lang){if(n===null||!Number.isFinite(n))return lang==='en'?'On request':'Op aanvraag';return new Intl.NumberFormat(lang==='en'?'en-IE':'nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);}
  function woodSurcharge(mm){return mm<=100?10:mm<=200?15:mm<=300?20:mm<=400?25:30;}
  function product(p,finish){if(p.pricing.kind==='quote'||!Number.isFinite(p.pricing.base))return null;return p.pricing.base+(finish==='wood'?p.pricing.woodExtra:0);}
  function estimate(c, cataloguePricing){
    var type=types[c.type], w=Number(c.width),d=Number(c.depth),h=Number(c.height),q=Number(c.quantity);
    if(!type||![w,d,h,q].every(Number.isFinite)||w<10||d<10||h<5||w>600||d>600||h>600||!Number.isInteger(q)||q<1||q>20||!['black','grey','wood','custom'].includes(c.finish)||!['plain','relief','intricate'].includes(c.detail)||!['adapt','new'].includes(c.design))return {valid:false};
    if(cataloguePricing&&(cataloguePricing.kind==='quote'||!Number.isFinite(cataloguePricing.base)))return {valid:true,manual:true,unit:null,total:null,reason:'catalogue-price'};
    var scale=Math.max(w/type.width,d/type.depth,h/type.height), size=Math.round(Math.max(0,scale-1)*18), detail={plain:0,relief:10,intricate:20}[c.detail],design=c.design==='new'?20:0,finish=c.finish==='wood'?type.wood:0;
    var base=cataloguePricing?cataloguePricing.base:type.base; finish=c.finish==='wood'?woodSurcharge(Math.max(w,d,h)):0;
    var unit=base+size+detail+finish,manual=c.finish==='custom'||unit+design>100||scale>=2.5||(c.type==='pot'&&c.finish==='wood');
    return {valid:true,manual:manual,base:base,size:size,detail:detail,design:design,finish:finish,unit:unit,total:unit*q+design,totalLow:Math.max(10,Math.floor(unit*.9/5)*5)*q+design,totalHigh:Math.min(100,Math.ceil(unit*1.1/5)*5)*q+design,low:Math.max(10,Math.floor(unit*.9/5)*5),high:Math.min(100,Math.ceil(unit*1.1/5)*5),quantity:q};
  }
  var api={types:types,money:money,product:product,estimate:estimate,woodSurcharge:woodSurcharge};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.BonsaiPricing=api;
})(typeof window==='undefined'?this:window);
