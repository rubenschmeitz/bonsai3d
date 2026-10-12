(function(root){
  'use strict';
  var types={table:{base:35,width:240,depth:160,height:80,wood:25},jita:{base:20,width:180,depth:120,height:12,wood:15},pot:{base:30,width:180,depth:120,height:80,wood:0},miniature:{base:15,width:60,depth:60,height:80,wood:15},accent:{base:15,width:100,depth:80,height:30,wood:15},stone:{base:25,width:160,depth:100,height:25,wood:20},accessory:{base:10,width:100,depth:50,height:80,wood:15}};
  function money(n,lang){return new Intl.NumberFormat(lang==='en'?'en-IE':'nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);}
  function product(p,finish){return p.pricing.base+(finish==='wood'?p.pricing.woodExtra:0);}
  function estimate(c){
    var type=types[c.type], w=Number(c.width),d=Number(c.depth),h=Number(c.height),q=Number(c.quantity);
    if(!type||![w,d,h,q].every(Number.isFinite)||w<10||d<10||h<5||w>600||d>600||h>600||!Number.isInteger(q)||q<1||q>20||!['black','grey','wood'].includes(c.finish)||!['plain','relief','intricate'].includes(c.detail)||!['adapt','new'].includes(c.design))return {valid:false};
    var scale=Math.max(w/type.width,d/type.depth,h/type.height), size=Math.round(Math.max(0,scale-1)*18), detail={plain:0,relief:10,intricate:20}[c.detail],design=c.design==='new'?20:0,finish=c.finish==='wood'?type.wood:0;
    var unit=type.base+size+detail+design+finish,manual=unit>100||scale>=2.5||(c.type==='pot'&&c.finish==='wood');
    return {valid:true,manual:manual,base:type.base,size:size,detail:detail,design:design,finish:finish,unit:unit,total:unit*q,low:Math.max(10,Math.floor(unit*.9/5)*5),high:Math.min(100,Math.ceil(unit*1.1/5)*5),quantity:q};
  }
  var api={types:types,money:money,product:product,estimate:estimate};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.BonsaiPricing=api;
})(typeof window==='undefined'?this:window);
