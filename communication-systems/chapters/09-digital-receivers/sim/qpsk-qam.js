/* QPSK / QAM Constellation — Chapter 9 Sim 3 */
(function(){
  const st={scheme:'qpsk',noise:0.15,numPoints:200};
  let canvas,ctx,W,H;
  function init(){canvas=document.getElementById('constellation-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();draw();}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=Math.min(r.width,400);canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function getIdealPoints(scheme){
    switch(scheme){
      case 'bpsk':return[[-1,0],[1,0]];
      case 'qpsk':return[[1,1],[-1,1],[-1,-1],[1,-1]].map(function(p){return[p[0]*0.707,p[1]*0.707];});
      case '8psk':{const pts=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;pts.push([Math.cos(a),Math.sin(a)]);}return pts;}
      case '16qam':{const pts=[];for(let i=-3;i<=3;i+=2)for(let j=-3;j<=3;j+=2)pts.push([i/3,j/3]);return pts;}
      default:return[[1,0],[-1,0]];
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);const cx=W/2,cy=H/2,scale=H*0.35;
    // Grid
    ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    // Unit circle for PSK
    if(st.scheme!=='16qam'){ctx.strokeStyle='#334155';ctx.lineWidth=0.5;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(cx,cy,scale,0,2*Math.PI);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle='#64748b';ctx.font='10px Inter';ctx.fillText('I',W-15,cy-5);ctx.fillText('Q',cx+5,12);
    ctx.fillText(st.scheme.toUpperCase()+' Constellation',8,14);
    // Ideal points
    const ideal=getIdealPoints(st.scheme);
    // Noisy received points
    ctx.globalAlpha=0.4;
    for(let n=0;n<st.numPoints;n++){
      const idx=n%ideal.length;const p=ideal[idx];
      const ni=gaussianNoise(0,st.noise);const nq=gaussianNoise(0,st.noise);
      const x=cx+scale*(p[0]+ni);const y=cy-scale*(p[1]+nq);
      const colors=['#38bdf8','#2dd4bf','#fbbf24','#fb7185','#a78bfa','#34d399','#f472b6','#60a5fa','#facc15','#c084fc','#22d3ee','#f87171','#4ade80','#fcd34d','#818cf8','#e879f9'];
      ctx.fillStyle=colors[idx%colors.length];
      ctx.beginPath();ctx.arc(x,y,2.5,0,2*Math.PI);ctx.fill();
    }
    ctx.globalAlpha=1;
    // Ideal constellation points
    for(let i=0;i<ideal.length;i++){
      const x=cx+scale*ideal[i][0];const y=cy-scale*ideal[i][1];
      ctx.fillStyle='#e2e8f0';ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.stroke();
      ctx.beginPath();ctx.arc(x,y,2,0,2*Math.PI);ctx.fill();
    }
    // Decision boundaries for QPSK
    if(st.scheme==='qpsk'){
      ctx.strokeStyle='rgba(251,113,133,0.3)';ctx.lineWidth=1;ctx.setLineDash([6,4]);
      ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();ctx.setLineDash([]);
    }
  }
  function bindControls(){
    document.querySelectorAll('input[name="const-scheme"]').forEach(function(r){r.addEventListener('change',function(){st.scheme=r.value;draw();});});
    const ns=document.getElementById('const-noise');if(ns)ns.addEventListener('input',debounce(function(){st.noise=parseFloat(ns.value);document.getElementById('const-noise-val').textContent=ns.value;draw();},30));
    const np=document.getElementById('const-points');if(np)np.addEventListener('input',debounce(function(){st.numPoints=parseInt(np.value);document.getElementById('const-points-val').textContent=np.value;draw();},30));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
