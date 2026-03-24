/* FM Bessel Spectrum — Chapter 3 Sim 3 */
(function(){
  let chart=null;const st={beta:2,fm:1,fc:8};
  function init(){const el=document.getElementById('fm-bessel-chart');if(!el||typeof Chart==='undefined')return;
    chart=new Chart(el,{type:'bar',data:{labels:[],datasets:[{label:'|J_n(β)|',backgroundColor:[],data:[],barPercentage:0.7}]},
      options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{labels:{color:'#e2e8f0',font:{family:'Inter',size:11}}},tooltip:{callbacks:{label:function(c){return'J_'+c.label+'(β) = '+c.parsed.y.toFixed(4);}}}},
        scales:{x:{title:{display:true,text:'Harmonic index n',color:'#64748b'},ticks:{color:'#64748b'},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'|J_n(β)|',color:'#64748b'},ticks:{color:'#64748b'},grid:{color:'#1e2d4a'}}}}});
    update();bindControls();}
  function update(){if(!chart)return;const N=Math.ceil(st.beta+4);const labels=[],data=[],colors=[];
    for(let n=-N;n<=N;n++){labels.push(n.toString());const jn=Math.abs(besselJ(n,st.beta));data.push(jn);
      colors.push(n===0?'#2dd4bf':n>0?'#fbbf24':'#fb7185');}
    chart.data.labels=labels;chart.data.datasets[0].data=data;chart.data.datasets[0].backgroundColor=colors;chart.update('none');
    const bt=2*(st.beta+1)*st.fm;const btEl=document.getElementById('fm-carson-bw');if(btEl)btEl.textContent='Carson BW = '+bt.toFixed(1);}
  function bindControls(){const bs=document.getElementById('fm-beta');if(bs)bs.addEventListener('input',debounce(function(){st.beta=parseFloat(bs.value);const v=document.getElementById('fm-beta-val');if(v)v.textContent=bs.value;update();},16));
    const fms=document.getElementById('fm-bessel-fm');if(fms)fms.addEventListener('input',debounce(function(){st.fm=parseFloat(fms.value);const v=document.getElementById('fm-bessel-fm-val');if(v)v.textContent=fms.value;update();},16));}
  document.addEventListener('DOMContentLoaded',init);
})();
