const assert=require('node:assert/strict');const cart=require('../assets/cart.js'),pricing=require('../assets/pricing.js'),products=require('../assets/catalogue.json').bonsai.products;
const p=products.find(p=>p.id==='bonsai-classic-table');const make=(quantity=1,personalisation={})=>cart.normalise({id:p.id,finish:'black',quantity,personalisation},products,pricing);
const standard=make(2);assert.equal(cart.quote(standard,products,pricing).total,pricing.product(p,'black')*2);
const rows=[];assert(cart.add(rows,make()));assert(cart.add(rows,make(2)));assert.equal(rows[0].quantity,3);
assert(cart.add(rows,make(1,{note:'Different finish detail'})));assert.equal(rows.length,2);
assert.equal(cart.add(rows,make(20)),false);assert.equal(rows[0].quantity,3);
assert.equal(cart.normalise({id:p.id,quantity:0},products,pricing),null);assert.equal(cart.normalise({id:'retired',quantity:1},products,pricing),null);
assert.equal(cart.hydrate([{id:p.id,finish:'dark',quantity:1}],products,pricing)[0].finish,'black');
const pending=make(1,{mode:'custom'});assert.equal(cart.quote(pending,products,pricing).manual,true);const mixed=cart.summary([standard,pending],products,pricing);assert.equal(mixed.pending,1);assert.equal(mixed.total,pricing.product(p,'black')*2);
const spec={mode:'custom',width:240,depth:160,height:80,detail:'plain',design:'new'};const a=cart.quote(make(1,spec),products,pricing),b=cart.quote(make(3,spec),products,pricing);assert.equal(a.design,20);assert.equal(b.total,3*b.unit+20);assert.equal(b.total-a.total,2*a.unit);
const huge=make(1,{...spec,width:600,depth:600,height:600});assert.equal(cart.quote(huge,products,pricing).manual,true);
const c={type:'jita',finish:'black',width:180,depth:120,height:12,detail:'plain',design:'new',quantity:4};const quote=pricing.estimate(c);assert.equal(quote.total,quote.unit*4+20);assert.equal(quote.totalLow,quote.low*4+20);
const custom=cart.normalise({kind:'custom',configuration:c,quantity:4,note:'Example'},products,pricing);assert(custom);assert.equal(cart.quote(custom,products,pricing).total,quote.total);assert.deepEqual(cart.hydrate(JSON.parse(JSON.stringify([custom,pending])),products,pricing),[custom,pending]);
assert.equal(cart.normalise({kind:'custom',configuration:{...c,width:'invalid'},quantity:1},products,pricing),null);
const bounded=make(1,{note:'a'.repeat(800),width:5,depth:-1,height:Infinity});assert.equal(bounded.personalisation.note.length,600);assert.equal(bounded.personalisation.width,'');assert.equal(bounded.personalisation.height,'');
console.log('Cart model: pricing, one-off design fees, quote-only totals, variant separation, quantity limits, migration and persistence passed.');

for(const [size,extra] of [[80,10],[100,10],[150,15],[200,15],[250,20],[350,25],[500,30]])assert.equal(pricing.woodSurcharge(size),extra);
for(const type of Object.keys(pricing.types)){const c={type,finish:'black',...pricing.types[type],detail:'plain',design:'adapt',quantity:1};c.finish='black';const estimate=pricing.estimate(c);assert(estimate.valid);assert(Number.isFinite(estimate.unit));assert.equal(estimate.base,pricing.types[type].base);assert.equal(estimate.unit,pricing.types[type].base);}
const small=pricing.estimate({type:'miniature',finish:'wood',width:60,depth:60,height:80,detail:'plain',design:'adapt',quantity:1});assert.equal(small.finish,10);assert.equal(small.unit,25);
const big=pricing.estimate({type:'table',finish:'wood',width:500,depth:200,height:80,detail:'plain',design:'adapt',quantity:1});assert.equal(big.finish,30);assert(Number.isFinite(big.total));
const colourA=cart.normalise({id:p.id,finish:'custom',quantity:1,personalisation:{colour:{hex:'#aabbcc',name:'RAL 6009'}}},products,pricing);assert.equal(colourA.personalisation.colour.hex,'#aabbcc');assert.equal(cart.quote(colourA,products,pricing).manual,true);
const colourB=cart.normalise({...colourA,personalisation:{colour:{hex:'#112233',name:'Blue'}}},products,pricing);assert.notEqual(cart.key(colourA),cart.key(colourB));assert.deepEqual(cart.hydrate(JSON.parse(JSON.stringify([colourA])),products,pricing),[colourA]);
console.log('Own colour, size-based wood fees and finite calculator base prices passed.');

// Newly listed models have no confirmed guide price; they must never count as free.
const unpriced={...p,id:'new-model-on-request',pricing:{base:null,woodExtra:0,currency:'EUR',kind:'quote'}};
const unpricedProducts=[...products,unpriced];
const unpricedRow=cart.normalise({id:unpriced.id,finish:'black',quantity:2},unpricedProducts,pricing);
assert.equal(pricing.product(unpriced,'black'),null);
assert.equal(pricing.money(null,'nl'),'Op aanvraag');
assert.equal(pricing.money(null,'en'),'On request');
assert.equal(cart.quote(unpricedRow,unpricedProducts,pricing).manual,true);
assert.equal(cart.quote({...unpricedRow,personalisation:{...unpricedRow.personalisation,mode:'custom',width:180,depth:135,height:12}},unpricedProducts,pricing).manual,true);
const unpricedSummary=cart.summary([standard,unpricedRow],unpricedProducts,pricing);
assert.equal(unpricedSummary.pending,1);assert.equal(unpricedSummary.total,pricing.product(p,'black')*2);
assert.equal(pricing.estimate({type:'pot',finish:'black',width:100,depth:100,height:30,detail:'plain',design:'adapt',quantity:1},unpriced.pricing).manual,true);
console.log('New catalogue models remain on request and are excluded from numeric totals.');
