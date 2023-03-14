import{_ as S,S as U,a as j}from"./index.632b0bf4.js";import{C as x,a as B,D as O}from"./CMap.3cedf296.js";import{u as I,x as N,p as k,j as v,o as m,b as u,i as s,t as n,k as p,w as D,F as f,q as $,n as E,s as H,v as z,C as g,r as w}from"./vendor.dfe6942c.js";import{a as L}from"./config.f80ebd36.js";const A={components:{Scroll:U},setup(){const a=I(),r=N(()=>(a.state.robot?a.state.robot.status:{})||{}),l=N(()=>(a.state.robot?a.state.robot.task:{})||{}),t=N(()=>L[a.state.snst]||L[a.state.snt]||[]),_=k(!1);return{status:r,task:l,list:t,show:_,taskMenu:L}}},V={class:"c-tasktable-main"},W={class:"c-tasktable-table"},F={key:0,class:"c-tasktable-tr"},P={class:"c-tasktable-th"},q={class:"c-tasktable-td"},G={key:1,class:"c-tasktable-tr"},J={class:"c-tasktable-th"},K={class:"c-tasktable-td"},Q={key:2,class:"c-tasktable-tr"},X={class:"c-tasktable-th"},Y={class:"c-tasktable-td"},Z={key:3,class:"c-tasktable-tr"},tt={class:"c-tasktable-th"},at={class:"c-tasktable-td"},st={key:4,class:"c-tasktable-tr"},et={class:"c-tasktable-th"},ot={class:"c-tasktable-td"},nt={key:5,class:"c-tasktable-tr"},lt={class:"c-tasktable-th"},rt={class:"c-tasktable-td"},ct={key:6,class:"c-tasktable-tr"},dt={class:"c-tasktable-th"},mt={class:"c-tasktable-td"},ut={class:"c-tasktable-tr"},_t={class:"c-tasktable-th",colspan:"2"},it={class:"c-tasktable-log",colspan:"2"};function ht(a,r,l,t,_,h){const i=v("Scroll");return m(),u("div",{class:H(["c-tasktable",{active:t.show}])},[s("div",{class:"c-tasktable-status",onClick:r[0]||(r[0]=o=>t.list.length&&(t.show=!0))},n(t.status.tag||a.$t("btn.Task")),1),s("div",V,[p(i,{class:"c-tasktable-scroll",x:"",y:"",hideBar:""},{default:D(()=>[s("table",W,[(m(!0),u(f,null,$(t.list,o=>(m(),u(f,{key:o},[o==="ID"?(m(),u("tr",F,[s("th",P,n(a.$t("sd.TaID")),1),s("td",q,n(t.task.task_id||"NULL"),1)])):o==="CREATE_TIME"?(m(),u("tr",G,[s("th",J,n(a.$t("sd.CrTi")),1),s("td",K,n(t.task.create_time||"NULL"),1)])):o==="STATUS"?(m(),u("tr",Q,[s("th",X,n(a.$t("sd.TaSt")),1),s("td",Y,n(t.task.status||"NULL"),1)])):o==="ORDER_ID"?(m(),u("tr",Z,[s("th",tt,n(a.$t("sd.OrID")),1),s("td",at,n(t.task.order_id||"NULL"),1)])):o==="ORDER_SN"?(m(),u("tr",st,[s("th",et,n(a.$t("sd.OrNu")),1),s("td",ot,n(t.task.order_no||"NULL"),1)])):o==="LOAD"?(m(),u("tr",nt,[s("th",lt,n(a.$t("sd.LoWa")),1),s("td",rt,n(t.task.load_point_name||"NULL"),1)])):o==="TARGET"?(m(),u("tr",ct,[s("th",dt,n(a.$t("sd.TaWa")),1),s("td",mt,n(t.task.target_point_name||"NULL"),1)])):E("",!0)],64))),128)),t.task.log&&t.task.log.length?(m(),u(f,{key:0},[s("tr",ut,[s("th",_t,n(a.$t("sd.Logs")),1)]),s("tr",null,[s("td",it,[(m(!0),u(f,null,$(t.task.log,o=>(m(),u("div",{class:"c-tasktable-div",key:o},n(o),1))),128))])])],64)):E("",!0)])]),_:1}),s("div",{class:"c-tasktable-close",onClick:r[1]||(r[1]=o=>t.show=!1)},n(a.$t("btn.Clos")),1)])],2)}var bt=S(A,[["render",ht]]);const kt={components:{CMap:x,TaskTable:bt},setup(){const{t:a}=z(),r=I(),l=k(null),t=k(null),_=k(null),h=k("");let i=0;g(l,d=>{!d||d.setEvent({wheel:()=>!(i!==1/0&&(i=new Date().getTime())&&!1),down:e=>!(e.length===1&&(i=1/0)&&!1),up:e=>!(!e.length&&(i=new Date().getTime())&&!1)})}),g([l,t],([d,e])=>{if(!d||!e)return;let c=0,M=0;e.forEach((T,C)=>{T.is_default>0&&(c=C+1),T.is_current>0&&(M=C+1)});const R=(M||c||1)-1;_.value=e[R].uuid}),g(_,d=>{if(!l.value||!t.value||!d)return;const e=t.value.find(c=>c.uuid===d);if(!e)return h.value="";h.value=e.name,l.value.setMap(j.join(e.image_path,{t:r.state.t})),l.value.setMapPoints(e.point_list.map(c=>new B(Object.assign(c,{x:Number(c.x),y:Number(c.y),name:c.name,type:Number(c.type),angle:Number(c.angle)})))),l.value.setMapWalls(e.wall_list.map(c=>({sx:Number(c.start_x),sy:Number(c.start_y),ex:Number(c.end_x),ey:Number(c.end_y)})))}),r.getters.maps.then(d=>d&&(t.value=d));let o=null;function y(){o=window.loading(a("top.MaLo"))}function b(){!o||(o.remove(),o=null)}return g(()=>r.state.robot,({status:d,position:e})=>{!l.value||!_.value||(!d||!e||d.map_uuid!==_.value?(d&&(_.value=d.map_uuid),l.value.setMapRobot(null),l.value.setMapLine(null),l.value.setMapLaser(null)):(l.value.setMapRobot(new O({x:Number(e.x),y:Number(e.y),angle:Number(e.angle)})),new Date().getTime()-i>3e3&&l.value.moveTo(Number(e.x),Number(e.y),100),l.value.setMapLine(e.path),l.value.setMapLaser(e.laser,{x:Number(e.x),y:Number(e.y),angle:Number(e.angle)})))}),{map:l,mapUuid:_,mapName:h,mapImgLoadStart:y,mapImgLoadEnd:b,showStatus:()=>window.showStatus()}}},vt={class:"common-home"},pt=s("path",{d:"M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z m0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z m0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"},null,-1),ft=[pt],gt={class:"common-home-btns"};function yt(a,r,l,t,_,h){const i=v("Navbar"),o=v("CMap"),y=v("TaskTable");return m(),u("div",vt,[p(i,{class:"common-home-navbar",title:a.$store.state.sn+" : "+(t.mapName||a.$t("sd.DiRo")),hideBack:!0},{default:D(()=>[(m(),u("svg",{class:"common-home-menu",onClick:r[0]||(r[0]=b=>a.$router.push({name:"Set"})),viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32"},ft))]),_:1},8,["title"]),p(o,{class:"common-home-map",autoplay:"",onMaploadstart:t.mapImgLoadStart,onMapload:t.mapImgLoadEnd,onMaploadfail:t.mapImgLoadEnd,ref:"map"},null,8,["onMaploadstart","onMapload","onMaploadfail"]),w(a.$slots,"header",{},()=>[p(y)]),w(a.$slots,"default"),w(a.$slots,"footer",{},()=>[s("div",gt,[s("div",{class:"common-home-btn",onClick:r[1]||(r[1]=(...b)=>t.showStatus&&t.showStatus(...b))},n(a.$t("btn.Stat")),1),s("div",{class:"common-home-btn",onClick:r[2]||(r[2]=b=>a.$router.push({name:"MapIndex",params:{uuid:t.mapUuid}}))},n(a.$t("sd.MaMa")),1)])])])}var Tt=S(kt,[["render",yt]]);export{Tt as C};
