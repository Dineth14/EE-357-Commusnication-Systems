/* PM Waveform Animator — Chapter 3 Sim 1 */
(function(){
  const st={kp:2,fm:1,fc:8,playing:true,speed:1,time:0};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('pm-waveform-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=400;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;ctx.clearRect(0,0,W,H);
    const pH=H/3,dur=4/st.fm,labels=['m(t) — Message','θ_i(t) — Instantaneous Phase','s_PM(t) — PM Signal'],colors=['#fbbf24','#2dd4bf','#38bdf8'];
    for(let p=0;p<3;p++){const yO=p*pH,mid=yO+pH/2,amp=pH*.38;
      ctx.strokeStyle='#1e2d4a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,yO);ctx.lineTo(W,yO);ctx.stroke();
      ctx.strokeStyle='#64748b';ctx.lineWidth=.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(labels[p],8,yO+16);
      ctx.strokeStyle=colors[p];ctx.lineWidth=1.8;ctx.beginPath();
      for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;let y;const m=Math.sin(2*Math.PI*st.fm*t);
        if(p===0)y=mid-amp*m;
        else if(p===1){const theta=2*Math.PI*st.fc*t+st.kp*m;y=mid-amp*(theta%(2*Math.PI))/(Math.PI);}
        else{const theta=2*Math.PI*st.fc*t+st.kp*m;y=mid-amp*.7*Math.cos(theta);}
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
      if(p===2){ctx.strokeStyle='#fbbf2440';ctx.lineWidth=1;ctx.setLineDash([5,4]);ctx.beginPath();
        for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const m=Math.sin(2*Math.PI*st.fm*t);const y=mid-amp*.7*Math.cos(2*Math.PI*st.fc*t+st.kp*m);/* envelope placeholder */}ctx.setLineDash([]);}
    }
    const dpEl=document.getElementById('pm-delta-phi');if(dpEl)dpEl.textContent=(st.kp*1).toFixed(2)+' rad';
    requestAnimationFrame(draw);}
  function bindControls(){[['pm-kp','kp'],['pm-fm','fm'],['pm-fc','fc'],['pm-speed','speed']].forEach(function(p){const el=document.getElementById(p[0]);if(el)el.addEventListener('input',debounce(function(){st[p[1]]=parseFloat(el.value);const v=document.getElementById(p[0]+'-val');if(v)v.textContent=el.value;},16));});
    const pb=document.getElementById('pm-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});}
  document.addEventListener('DOMContentLoaded',init);
})();
