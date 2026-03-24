/* Companding Curves — Chapter 6 Sim 2 */
(function(){
  let chart;
  function init(){const el=document.getElementById('companding-chart');if(!el)return;buildChart(el);bindControls();}
  function muLaw(x,mu){return Math.sign(x)*Math.log(1+mu*Math.abs(x))/Math.log(1+mu);}
  function aLaw(x,A){const ax=Math.abs(x);if(ax<1/A)return Math.sign(x)*(A*ax)/(1+Math.log(A));return Math.sign(x)*(1+Math.log(A*ax))/(1+Math.log(A));}
  function buildChart(el){
    const N=200;const labels=[];const uniform=[];const muData=[];const aData=[];
    const mu=parseFloat(document.getElementById('comp-mu')?.value||255);
    const A=parseFloat(document.getElementById('comp-A')?.value||87.6);
    for(let i=0;i<=N;i++){const x=-1+2*i/N;labels.push(x.toFixed(2));uniform.push(x);muData.push(muLaw(x,mu));aData.push(aLaw(x,A));}
    chart=new Chart(el,{type:'line',data:{labels:labels,datasets:[
      {label:'Uniform',data:uniform,borderColor:'#64748b',borderWidth:1,borderDash:[4,4],pointRadius:0,fill:false},
      {label:'μ-law (μ='+mu+')',data:muData,borderColor:'#38bdf8',borderWidth:2,pointRadius:0,fill:false},
      {label:'A-law (A='+A+')',data:aData,borderColor:'#fbbf24',borderWidth:2,pointRadius:0,fill:false}
    ]},options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{title:{display:true,text:'Input',color:'#94a3b8'},ticks:{color:'#94a3b8',maxTicksLimit:10},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'Output',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'},min:-1.1,max:1.1}},plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function updateChart(){
    if(!chart)return;
    const mu=parseFloat(document.getElementById('comp-mu')?.value||255);
    const A=parseFloat(document.getElementById('comp-A')?.value||87.6);
    const N=chart.data.labels.length-1;
    for(let i=0;i<=N;i++){const x=-1+2*i/N;chart.data.datasets[1].data[i]=muLaw(x,mu);chart.data.datasets[2].data[i]=aLaw(x,A);}
    chart.data.datasets[1].label='μ-law (μ='+mu+')';chart.data.datasets[2].label='A-law (A='+A+')';chart.update('none');
  }
  function bindControls(){
    const ms=document.getElementById('comp-mu');if(ms)ms.addEventListener('input',debounce(function(){document.getElementById('comp-mu-val').textContent=ms.value;updateChart();},30));
    const as=document.getElementById('comp-A');if(as)as.addEventListener('input',debounce(function(){document.getElementById('comp-A-val').textContent=as.value;updateChart();},30));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
