const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const B=document.body.dataset.base||'',P={};
const DB={get(k,d){try{return JSON.parse(localStorage.getItem('bh_'+k))??d}catch{return d}},set(k,v){localStorage.setItem('bh_'+k,JSON.stringify(v))}};
const peso=n=>'₱'+Number(n).toFixed(2),uid=p=>p+Date.now().toString(36).toUpperCase().slice(-6)+Math.floor(Math.random()*90+10);
const hash=s=>btoa(unescape(encodeURIComponent(s))); // demo only; use server-side hashing in PHP
const me=()=>DB.get('session',null),qs=k=>new URLSearchParams(location.search).get(k);
const ISBN={'Atomic Habits':'9780735211292','Dune':'9780441172719','Sapiens':'9780062316110','Clean Code':'9780132350884','Pride and Prejudice':'9780141439518','The Hobbit':'9780547928227','Educated':'9780399590504'};
function seed(){if(DB.get('books')&&DB.get('v')!=2){DB.set('books',DB.get('books').map(b=>ISBN[b.title]&&b.isbn.startsWith('978000')?{...b,isbn:ISBN[b.title]}:b));DB.set('v',2)}
 if(DB.get('books'))return;DB.set('v',2);
 const t=[['The Quiet Orchard','Mara Ellison','Fiction',350,12,4.6,30],['Atomic Habits','James Clear','Self-Help',520,25,4.8,90],['Dune','Frank Herbert','Sci-Fi',480,3,4.7,70],['Sapiens','Yuval Harari','History',560,18,4.5,60],['Clean Code','Robert Martin','Technology',690,9,4.6,40],['Pride and Prejudice','Jane Austen','Classics',250,30,4.4,20],['The Hobbit','J.R.R. Tolkien','Fantasy',420,0,4.8,80],['Educated','Tara Westover','Memoir',450,14,4.5,50]];
 DB.set('books',t.map((b,i)=>({id:'b'+(i+1),title:b[0],author:b[1],isbn:ISBN[b[0]]||'',cat:b[2],price:b[3],stock:b[4],rating:b[5],sold:b[6],disc:i%3==0?15:0,hue:i*43,added:Date.now()-i*864e5*9,desc:`A beloved ${b[2].toLowerCase()} title by ${b[1]}. Sample description for demonstration.`})));
 DB.set('cats',[...new Set(t.map(b=>b[2]))].map((n,i)=>({id:'c'+i,name:n})));
 DB.set('users',[{id:'u0',name:'Admin',username:'admin',email:'admin@bookhaven.com',pw:hash('admin123'),role:'admin',phone:'',addr:'',created:Date.now()},{id:'u1',name:'Demo Reader',username:'demo',email:'demo@bookhaven.com',pw:hash('demo1234'),role:'customer',phone:'09171234567',addr:'Hagonoy, Bulacan',created:Date.now()}]);DB.set('orders',[]);DB.set('notes',[])}
const price=b=>+(b.price*(1-b.disc/100)).toFixed(2);
function toast(m,bad){const t=document.createElement('div');t.className='toast'+(bad?' bad':'');t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),3200)}
function notify(m,to){const n=DB.get('notes',[]);n.push({m,to,d:Date.now()});DB.set('notes',n);if(to===(me()||{}).id||to==='admin')toast(m)}
function confirmBox(msg,ok){const d=$('#dlg');d.innerHTML=`<h3>Please confirm</h3><p>${msg}</p><button class="btn red" id="y">Yes</button> <button class="btn alt" id="n">Cancel</button>`;d.showModal();$('#y').onclick=()=>{d.close();ok()};$('#n').onclick=()=>d.close()}
function cover(b){const src=b.img||(b.isbn?`https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false`:'');return `<div class="cover" style="background:linear-gradient(160deg,hsl(${b.hue},45%,35%),hsl(${b.hue+30},50%,22%))">${b.title}${src?`<img src="${src}" alt="${b.title}" loading="lazy" onerror="this.remove()">`:''}</div>`}
function empty(t,l,h){return `<div class="empty"><div style="font-size:3rem">📚</div><p>${t}</p>${l?`<a class="btn" href="${B+h}">${l}</a>`:''}</div>`}
function nav(){const u=me(),c=cartCount();
 $('#nav').innerHTML=`<a class="logo" href="${B}index.html">📖 BookHaven</a><button id="menu" class="btn alt sm">☰</button><nav><a href="${B}index.html">Home</a><a href="${B}shop.html">Shop</a><a href="${B}cart.html">Cart (${c})</a>`+
 (u?`<a href="${B}${u.role=='admin'?'admin':'customer'}/dashboard.html">${u.role=='admin'?'Admin':'Dashboard'}</a><a href="#" id="out">Logout</a>`:`<a href="${B}login.html">Login</a><a href="${B}signup.html">Sign up</a>`)+`<button class="btn alt sm" id="th">🌓</button></nav>`;
 $('#menu').onclick=()=>$('nav').classList.toggle('open');$('#th').onclick=()=>{const d=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=d;DB.set('theme',d)};
 if($('#out'))$('#out').onclick=e=>{e.preventDefault();DB.set('session',null);location.href=B+'index.html'}}
function sideNav(items){return `<div class="side">${items.map(([h,l])=>`<a href="${h}" class="${location.pathname.endsWith(h)?'on':''}">${l}</a>`).join('')}</div>`}
function run(){seed();document.documentElement.dataset.theme=DB.get('theme','light');const u=me(),r=document.body.dataset.role;
 if(r&&(!u||(r=='admin'&&u.role!='admin'))){sessionStorage.setItem('bh_msg','Please log in with the right account.');location.href=B+'login.html';return}
 nav();const m=sessionStorage.getItem('bh_msg');if(m){setTimeout(()=>toast(m),100);sessionStorage.removeItem('bh_msg')}
 (P[document.body.dataset.page]||(()=>{}))()}
