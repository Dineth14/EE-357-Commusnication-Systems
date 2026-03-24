/* FM Waveform & Instantaneous Frequency — Chapter 3 Sim 2 */
(function(){
  const st={kf:5,fm:1,fc:8,playing:true,speed:1,time:0};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('fm-waveform-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=520;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;ctx.clearRect(0,0,W,H);
    const pH=H/4,dur=4/st.fm;
    const labels=['m(t) — Message','f_i(t) — Instantaneous Frequency','θ_i(t) — Phase','s_FM(t) — FM Signal'];
    const colors=['#fbbf24','#2dd4bf','#64748b','#38bdf8'];
    const df=st.kf*1,beta=df/st.fm;
    for(let p=0;p<4;p++){const yO=p*pH,mid=yO+pH/2,amp=pH*.36;
      ctx.strokeStyle='#1e2d4a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,yO);ctx.lineTo(W,yO);ctx.stroke();
      ctx.strokeStyle='#64748b';ctx.lineWidth=.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(labels[p],8,yO+16);
      ctx.lineWidth=1.8;ctx.beginPath();
      for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const m=Math.sin(2*Math.PI*st.fm*t);let y;
        if(p===0){ctx.strokeStyle='#fbbf24';y=mid-amp*m;}
        else if(p===1){const fi=st.fc+st.kf*m;ctx.strokeStyle=fi>st.fc?'#2dd4bf':fi<st.fc?'#fb7185':'#e2e8f0';y=mid-amp*(fi-st.fc)/df*.8;
          if(x>0){ctx.stroke();ctx.beginPath();ctx.moveTo(x-1,y);ctx.strokeStyle=fi>st.fc?'#2dd4bf':fi<st.fc?'#fb7185':'#e2e8f0';}}
        else if(p===2){const mInt=-Math.cos(2*Math.PI*st.fm*t)/(2*Math.PI*st.fm);const theta=2*Math.PI*st.fc*t+2*Math.PI*st.kf*mInt;ctx.strokeStyle='#64748b';y=mid-amp*(theta%(4*Math.PI))/(2*Math.PI);}
        else{const mInt=-Math.cos(2*Math.PI*st.fm*t)/(2*Math.PI*st.fm);const theta=2*Math.PI*st.fc*t+2*Math.PI*st.kf*mInt;const fi=st.fc+st.kf*m;const col=fi>st.fc?'#2dd4bf':fi<st.fc?'#fb7185':'#e2e8f0';ctx.strokeStyle=col;y=mid-amp*.7*Math.cos(theta);
          if(x>0){ctx.stroke();ctx.beginPath();ctx.moveTo(x-1,y);ctx.strokeStyle=col;}}
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
    const bt=2*(df+st.fm);
    setT('fm-df-val2',df.toFixed(1));setT('fm-beta-val2',beta.toFixed(2));setT('fm-bt-val2',bt.toFixed(1));
    requestAnimationFrame(draw);}
  function setT(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}
  function bindControls(){[['fm-kf','kf'],['fm-fm','fm'],['fm-fc','fc'],['fm-speed','speed']].forEach(function(p){const el=document.getElementById(p[0]);if(el)el.addEventListener('input',debounce(function(){st[p[1]]=parseFloat(el.value);const v=document.getElementById(p[0]+'-val');if(v)v.textContent=el.value;},16));});
    const pb=document.getElementById('fm-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});}
  document.addEventListener('DOMContentLoaded',init);
})();
