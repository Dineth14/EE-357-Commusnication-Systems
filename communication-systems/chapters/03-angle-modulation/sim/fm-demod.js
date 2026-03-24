/* FM Demodulator Comparator — Chapter 3 Sim 4 */
(function(){
  const st={fc:8,fm:1,kf:5,noise:0,playing:true,time:0,speed:1};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('fm-demod-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=360;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;ctx.clearRect(0,0,W,H);
    const pH=H/3,dur=4/st.fm;
    const labels=['m(t) — Original','Discriminator Output','PLL Demod Output'];
    const colors=['#fbbf24','#2dd4bf','#38bdf8'];
    for(let p=0;p<3;p++){const yO=p*pH,mid=yO+pH/2,amp=pH*.36;
      ctx.strokeStyle='#1e2d4a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,yO);ctx.lineTo(W,yO);ctx.stroke();
      ctx.strokeStyle='#64748b';ctx.lineWidth=.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(labels[p],8,yO+16);
      ctx.strokeStyle=colors[p];ctx.lineWidth=1.8;ctx.beginPath();
      for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const m=Math.sin(2*Math.PI*st.fm*t);
        const n=st.noise>0?gaussianNoise(0,st.noise*0.1):0;let y;
        if(p===0)y=mid-amp*m;
        else if(p===1){y=mid-amp*(m+n)*0.9;}
        else{const tracked=m*(1-0.02*st.noise)+n*0.5;y=mid-amp*tracked*0.85;}
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
    requestAnimationFrame(draw);}
  function bindControls(){const ns=document.getElementById('fm-demod-noise');if(ns)ns.addEventListener('input',debounce(function(){st.noise=parseFloat(ns.value);const v=document.getElementById('fm-demod-noise-val');if(v)v.textContent=ns.value;},16));
    const pb=document.getElementById('fm-demod-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});}
  document.addEventListener('DOMContentLoaded',init);
})();
