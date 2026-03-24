/* PAM Simulator — Chapter 5 Sim 1 */
(function(){
  const st={fs:10,fm:1,type:'natural',playing:true,time:0,speed:1,duty:0.3};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('pam-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=360;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*st.fm*t)+0.25*Math.sin(2*Math.PI*2.5*st.fm*t);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);const mid=H/2,amp=H*0.35,dur=3/st.fm;
    ctx.strokeStyle='#334155';ctx.lineWidth=0.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('PAM — '+st.type.toUpperCase(),8,14);
    // Original signal
    ctx.strokeStyle='rgba(56,189,248,0.3)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid-amp*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    // PAM pulses
    const Ts=1/st.fs;const pw=(st.duty*Ts/dur)*W;
    for(let tn=Math.ceil(st.time*st.fs)/st.fs;tn<=st.time+dur;tn+=Ts){
      const x0=((tn-st.time)/dur)*W;if(x0<0||x0>W)continue;
      const v=msg(tn);
      if(st.type==='natural'){
        ctx.fillStyle='rgba(251,191,36,0.2)';ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,mid);
        for(let px=0;px<=pw;px++){const tt=tn+(px/W)*dur;const y=mid-amp*msg(tt);ctx.lineTo(x0+px,y);}
        ctx.lineTo(x0+pw,mid);ctx.closePath();ctx.fill();ctx.stroke();
      } else {
        const y=mid-amp*v;const h=y-mid;
        ctx.fillStyle='rgba(251,191,36,0.2)';ctx.fillRect(x0,Math.min(y,mid),pw,Math.abs(h)||1);
        ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.5;ctx.strokeRect(x0,Math.min(y,mid),pw,Math.abs(h)||1);
      }
    }
    requestAnimationFrame(draw);}
  function bindControls(){
    const fsS=document.getElementById('pam-fs');if(fsS)fsS.addEventListener('input',debounce(function(){st.fs=parseFloat(fsS.value);document.getElementById('pam-fs-val').textContent=fsS.value;},16));
    document.querySelectorAll('input[name="pam-type"]').forEach(function(r){r.addEventListener('change',function(){st.type=r.value;});});
    const pb=document.getElementById('pam-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
