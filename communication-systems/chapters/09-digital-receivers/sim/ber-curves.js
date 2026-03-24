/* BER Curves — Chapter 9 Sim 2 */
(function(){
  let chart;
  function init(){const el=document.getElementById('ber-chart');if(!el)return;buildChart(el);bindControls();}
  function buildChart(el){
    const N=200;const labels=[];
    const bpsk=[];const dpsk=[];const fsk_coh=[];const fsk_ncoh=[];const ask=[];const qpsk=[];
    for(let i=0;i<=N;i++){
      const ebno_db=-2+22*i/N;labels.push(ebno_db.toFixed(1));
      const ebno=Math.pow(10,ebno_db/10);
      bpsk.push(Math.max(1e-8,qFunc(Math.sqrt(2*ebno))));
      dpsk.push(Math.max(1e-8,0.5*Math.exp(-ebno)));
      fsk_coh.push(Math.max(1e-8,qFunc(Math.sqrt(ebno))));
      fsk_ncoh.push(Math.max(1e-8,0.5*Math.exp(-ebno/2)));
      ask.push(Math.max(1e-8,qFunc(Math.sqrt(ebno))));
      qpsk.push(Math.max(1e-8,qFunc(Math.sqrt(2*ebno))));// same as BPSK per bit
    }
    chart=new Chart(el,{type:'line',data:{labels:labels,datasets:[
      {label:'BPSK / QPSK',data:bpsk,borderColor:'#38bdf8',borderWidth:2,pointRadius:0,fill:false},
      {label:'DPSK',data:dpsk,borderColor:'#fbbf24',borderWidth:2,pointRadius:0,fill:false},
      {label:'Coherent FSK',data:fsk_coh,borderColor:'#2dd4bf',borderWidth:2,pointRadius:0,fill:false},
      {label:'Non-coh FSK',data:fsk_ncoh,borderColor:'#fb7185',borderWidth:2,pointRadius:0,fill:false},
      {label:'Coherent ASK',data:ask,borderColor:'#a78bfa',borderWidth:2,pointRadius:0,fill:false,borderDash:[6,3]}
    ]},options:{responsive:true,maintainAspectRatio:false,animation:false,
      scales:{x:{title:{display:true,text:'Eb/N0 (dB)',color:'#94a3b8'},ticks:{color:'#94a3b8',maxTicksLimit:12},grid:{color:'#1e2d4a'}},
        y:{type:'logarithmic',title:{display:true,text:'BER',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'},min:1e-8,max:1}},
      plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function bindControls(){
    const hl=document.getElementById('ber-highlight');
    if(hl)hl.addEventListener('input',function(){
      const db=parseFloat(hl.value);document.getElementById('ber-highlight-val').textContent=db;
      const ebno=Math.pow(10,db/10);const ber=qFunc(Math.sqrt(2*ebno));
      document.getElementById('ber-readout').textContent=ber.toExponential(2);
    });
  }
  document.addEventListener('DOMContentLoaded',init);
})();
