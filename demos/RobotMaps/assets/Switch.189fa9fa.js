import{o as a,b as c,s as l,m as o}from"./vendor.dfe6942c.js";import{_ as r}from"./index.632b0bf4.js";const n={emits:["click","update:value"],props:{value:Boolean},methods:{click(){this.$emit("click",!this.value),this.$emit("update:value",!this.value)}}};function u(_,e,s,v,d,t){return a(),c("div",{class:l(["c-switch",{active:s.value}]),onClick:e[0]||(e[0]=o((...i)=>t.click&&t.click(...i),["stop"]))},null,2)}var f=r(n,[["render",u]]);export{f as S};
