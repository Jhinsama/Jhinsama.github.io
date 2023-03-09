import{_ as T,a as i}from"./index.101c31c3.js";import{C as U,D as V}from"./CMap.d100e5df.js";import{a as B}from"./RobotRocker.27d8cdcd.js";import{v as F,u as A,D as G,a as P,p as v,g as O,C as h,j as k,o as b,b as w,k as C,i as r,t as d,n as R,E as S,G as N}from"./vendor.dfe6942c.js";const z={components:{CMap:U,RobotRocker:B},setup(){const{t}=F(),e=A(),g=G(),a=P(),l=v(null),p=v(null),c=v(!1),u=v(""),n=v("");if(!g.query.expand)c.value=!0;else{let o="";const s=window.loading(t("top.MaEx"));i.map.expand({sn:e.state.sn}).then(()=>(s.set(t("top.MERe")),o=res.preview_url,i.query(!0))).then(()=>{p.value=o}).catch(m=>alert(m.message)).finally(()=>s.remove())}let M=null;function L(){const o=p.value;if(!o)return l.value.cleanEvent();l.value.setEvent({tap:_}),M=setTimeout(()=>l.value.setMap(i.join(o,{t:new Date().getTime()}),!0),1e3)}function f(){clearTimeout(M),p.value=null}O(f),h([l,p],([o,s])=>o&&s&&o.setMap(i.join(s,{t:new Date().getTime()}))),h(()=>e.state.robot,o=>{!l.value||(o.position?(l.value.setMapRobot(new V({x:Number(o.position.x),y:Number(o.position.y),angle:Number(o.position.angle)})),l.value.setMapLine(o.position.path),l.value.setMapLaser(o.position.laser,{x:Number(o.position.x),y:Number(o.position.y),angle:Number(o.position.angle)})):(l.value.setMapRobot(null),l.value.setMapLine(null),l.value.setMapLaser(null)))});function _(o){const{x:s,y:m}=l.value.cvs2map(o.mx,o.my),y=window.loading(s+" , "+m);i.move.toCoordinate({sn:e.state.sn,x:s,y:m}).then(()=>(y.set(t("top.SMRe")),i.query(!0))).catch(I=>alert(I.message)).finally(()=>y.remove())}function E(){const o=window.loading(t("top.SaMa"));i.map.complete({sn:e.state.sn}).then(()=>(o.set(t("top.SSaR")),i.query(!0))).then(()=>{e.commit("t"),f(),a.back()}).catch(s=>alert(s.message)).finally(()=>o.remove())}function j(){const o=window.loading(t("top.Canc"));i.map.cancel({sn:e.state.sn}).then(()=>(o.set(t("top.SCaR")),i.query(!0))).then(()=>{f(),a.back()}).catch(s=>alert(s.message)).finally(()=>o.remove())}function x(){if(!u.value||!n.value)return!1;let o="";const s=window.loading(t("top.MaGe"));i.map.create({sn:e.state.sn,map_name:u.value,floor:n.value}).then(m=>(s.set(t("top.SMGe")),o=m.preview_url,i.query(!0))).then(()=>{p.value=o,c.value=!1}).catch(m=>alert(m.message)).finally(()=>s.remove())}function D(){const o=window.loading(t("top.SyRa"));i.map.laser({sn:e.state.sn,time:30}).catch(s=>alert(s.message)).finally(()=>o.remove())}function q(){i.move.stop({sn:e.state.sn})}return{map:l,showModal:c,mapName:u,mapFloor:n,mapImgLoadend:L,save:E,cancel:j,confirm:x,showLarse:D,stopAction:q,showStatus:()=>window.showStatus()}}},H={class:"v-map-scan"},J={class:"editor-btns"},K={class:"move-box"},Q={key:0,class:"modal-back"},W={key:1,class:"modal"},X={class:"modal-title"},Y=["placeholder"],Z=["placeholder"];function $(t,e,g,a,l,p){const c=k("CMap"),u=k("RobotRocker");return b(),w("div",H,[C(c,{class:"map-box",onMapload:a.mapImgLoadend,onMaploadfail:a.mapImgLoadend,autoplay:"",ref:"map"},null,8,["onMapload","onMaploadfail"]),r("div",J,[r("div",{class:"editor-btn",onClick:e[0]||(e[0]=(...n)=>a.showStatus&&a.showStatus(...n))},d(t.$t("btn.Stat")),1),r("div",{class:"editor-btn",onClick:e[1]||(e[1]=(...n)=>a.cancel&&a.cancel(...n))},d(t.$t("btn.Canc")),1),r("div",{class:"editor-btn",onClick:e[2]||(e[2]=(...n)=>a.save&&a.save(...n))},d(t.$t("btn.Save")),1)]),r("div",K,[r("div",{class:"btn laser",onClick:e[3]||(e[3]=(...n)=>a.showLarse&&a.showLarse(...n))},d(t.$t("btn.Rada")),1),C(u),r("div",{class:"btn stop",onClick:e[4]||(e[4]=(...n)=>a.stopAction&&a.stopAction(...n))},d(t.$t("btn.Stop")),1)]),a.showModal?(b(),w("div",Q)):R("",!0),a.showModal?(b(),w("div",W,[r("div",X,d(t.$t("map.NewM")),1),S(r("input",{class:"modal-input","onUpdate:modelValue":e[5]||(e[5]=n=>a.mapName=n),type:"text",placeholder:t.$t("map.PEMN")},null,8,Y),[[N,a.mapName]]),S(r("input",{class:"modal-input","onUpdate:modelValue":e[6]||(e[6]=n=>a.mapFloor=n),type:"number",placeholder:t.$t("map.PEFN")},null,8,Z),[[N,a.mapFloor]]),r("button",{class:"modal-btn",onClick:e[7]||(e[7]=n=>t.$router.back())},d(t.$t("btn.Canc")),1),r("button",{class:"modal-btn",onClick:e[8]||(e[8]=(...n)=>a.confirm&&a.confirm(...n))},d(t.$t("btn.Ok")),1)])):R("",!0)])}var no=T(z,[["render",$]]);export{no as default};
