import{S as B}from"./Switch.189fa9fa.js";import{P as D}from"./PickerBox.b315c901.js";import{T as R}from"./TimePicker.2e3e6fe2.js";import{v as F,u as V,D as U,a as W,p as r,j as p,o as l,b as d,k as y,i as s,t as a,F as g,q as T,z as N,w as k,n as b,E as P,Q as j}from"./vendor.dfe6942c.js";import{_ as O,b as E}from"./index.632b0bf4.js";import{b as J}from"./config.f80ebd36.js";import{_ as w}from"./open.72cf3b93.js";const M={components:{Switch:B,PickerBox:D,TimePicker:R},setup(){const{t}=F(),o=V();U();const S=W(),e=r(0),u=r(null),m=r(null),_=r(o.state.snst!=="SC3"?`05'00"`:`00'01"`),v=r(0),h=r(!0);function f(i){u.value=i}function n(i){m.value=i}function c(){const i={task_type:2,stay_time:E(_.value),disinfect_move:o.state.snst==="SC3"?1:v.value,go_home:Number(h.value)};if(e.value===0){if(!u.value)return window.toast(t("top.DiRo"));i.cruise_id_list=JSON.stringify(u.value.map(C=>C.uuid))}else{if(!m.value)return window.toast(t("top.ChWa"));i.point_id_list=JSON.stringify(m.value.map(C=>C.uuid))}S.replace({name:"SCTodo",params:i})}return{type:e,route:u,point:m,time:_,uvc:v,charge:h,timeFormat:J,routeChoose:f,pointChoose:n,nextStep:c}}},q={class:"v-sc-task"},z={class:"row"},I={class:"name"},L={class:"value"},Q=["value"],$={class:"radio-name"},A={class:"name"},G={class:"value"},H={class:"select-btn"},K={class:"select-name"},X=s("img",{class:"select-icon",src:w,alt:"\u2193"},null,-1),Y={class:"name"},Z={class:"value"},x={class:"select-btn"},ss={class:"select-name"},es=s("img",{class:"select-icon",src:w,alt:"\u2193"},null,-1),ts={class:"name"},os={class:"value"},as={class:"select-btn"},ns={class:"select-name"},is=s("img",{class:"select-icon",src:w,alt:"\u2193"},null,-1),ls={key:2,class:"row"},cs={class:"name"},rs={class:"value"},ds=["value"],us={class:"radio-name"},ms={class:"row"},vs={class:"name"},_s={class:"value"};function hs(t,o,S,e,u,m){const _=p("Navbar"),v=p("PickerBox"),h=p("TimePicker"),f=p("Switch");return l(),d("div",q,[y(_,{class:"navbar",title:t.$t("sc.TaMo")},null,8,["title"]),s("div",z,[s("div",I,a(t.$t("sc.Type")),1),s("div",L,[(l(!0),d(g,null,T([t.$t("sc.Rout"),t.$t("sc.Wayp")],(n,c)=>(l(),d("label",{class:"radio-item",key:c},[P(s("input",{class:"radio-input",type:"radio",name:"type","onUpdate:modelValue":o[0]||(o[0]=i=>e.type=i),value:c},null,8,Q),[[j,e.type]]),s("span",$,a(n),1)]))),128))])]),e.type===0?(l(),N(v,{key:0,class:"row",type:"route",value:e.route,title:t.$t("sc.CDRo"),onChoose:e.routeChoose},{default:k(()=>[s("div",A,a(t.$t("sc.sRou")),1),s("div",G,[s("div",H,[s("span",K,a(e.route?t.$t("sc.Chos")+": "+e.route.length:t.$t("sc.ChCh")),1),X])])]),_:1},8,["value","title","onChoose"])):b("",!0),e.type!==0?(l(),N(v,{key:1,class:"row",type:"point",value:e.point,title:t.$t("sc.CDWa"),onChoose:e.pointChoose},{default:k(()=>[s("div",Y,a(t.$t("sc.Wayp")),1),s("div",Z,[s("div",x,[s("span",ss,a(e.point?t.$t("sc.Chos")+": "+e.point.length:t.$t("sc.ChCh")),1),es])])]),_:1},8,["value","title","onChoose"])):b("",!0),y(h,{class:"row",value:e.time,"onUpdate:value":o[1]||(o[1]=n=>e.time=n),format:e.timeFormat},{default:k(()=>[s("div",ts,a(t.$t("sc.DiTi")),1),s("div",os,[s("div",as,[s("span",ns,a(e.time),1),is])])]),_:1},8,["value","format"]),t.$store.state.snst!=="SC3"?(l(),d("div",ls,[s("div",cs,a(t.$t("sc.UVCD")),1),s("div",rs,[(l(!0),d(g,null,T([t.$t("sc.FiPo"),t.$t("sc.OnTW")],(n,c)=>(l(),d("label",{class:"radio-item",key:c},[P(s("input",{class:"radio-input",type:"radio",name:"uvc","onUpdate:modelValue":o[2]||(o[2]=i=>e.uvc=i),value:c},null,8,ds),[[j,e.uvc]]),s("span",us,a(n),1)]))),128))])])):b("",!0),s("div",ms,[s("div",vs,a(t.$t("sc.ChFi")),1),s("div",_s,[y(f,{value:e.charge,"onUpdate:value":o[3]||(o[3]=n=>e.charge=n)},null,8,["value"])])]),s("div",{class:"next",onClick:o[4]||(o[4]=(...n)=>e.nextStep&&e.nextStep(...n))},a(t.$t("sc.Next")),1)])}var Ss=O(M,[["render",hs]]);export{Ss as default};