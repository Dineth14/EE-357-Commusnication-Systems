/* Quantization Simulator — Chapter 4 Sim 2 */
(function(){
  const st={bits:3,range:1,type:'midrise',playing:true,time:0,speed:1};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('quantization-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=420;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*t)+0.3*Math.sin(2*Math.PI*2.3*t);}
  function quantize(v){
    const L=Math.pow(2,st.bits);const step=2*st.range/L;
    if(st.type==='midrise'){return Math.floor(v/step)*step+step/2;}
    else{return Math.round(v/step)*step;}
  }
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const pH=H/2,dur=3;
    const L=Math.pow(2,st.bits);const step=2*st.range/L;
    // Panel 1: Signal + Quantized
    const mid1=pH/2,amp1=pH*0.38;
    ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W,0);ctx.stroke();
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('Signal (blue) + Quantized (amber)',8,14);
    // Quantization levels
    ctx.strokeStyle='rgba(100,116,139,0.2)';ctx.lineWidth=0.5;
    for(let i=-L/2;i<=L/2;i++){const lv=i*step;const y=mid1-amp1*lv/st.range;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Original
    ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const v=msg(t);const y=mid1-amp1*v/st.range;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    // Quantized (staircase)
    ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const v=msg(t);const q=Math.max(-st.range,Math.min(st.range,quantize(v)));const y=mid1-amp1*q/st.range;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();

    // Panel 2: Quantization error
    const mid2=pH+pH/2,amp2=pH*0.35;
    ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,pH);ctx.lineTo(W,pH);ctx.stroke();
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('Quantization Error e(t)',8,pH+14);
    ctx.strokeStyle='#334155';ctx.lineWidth=0.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid2);ctx.lineTo(W,mid2);ctx.stroke();ctx.setLineDash([]);
    // max error lines
    ctx.strokeStyle='rgba(251,113,133,0.3)';ctx.lineWidth=0.5;
    const ey=amp2*(step/2)/st.range;
    ctx.beginPath();ctx.moveTo(0,mid2-ey);ctx.lineTo(W,mid2-ey);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,mid2+ey);ctx.lineTo(W,mid2+ey);ctx.stroke();
    // Error signal
    ctx.strokeStyle='#fb7185';ctx.lineWidth=1.5;ctx.beginPath();
    let sqErr=0,cnt=0;
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const v=msg(t);const q=Math.max(-st.range,Math.min(st.range,quantize(v)));const e=v-q;sqErr+=e*e;cnt++;const y=mid2-amp2*e*4/st.range;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    // Readouts
    const snrQ=cnt>0?10*Math.log10((1)/(sqErr/cnt+1e-15)):0;
    const snrTheory=6.02*st.bits+1.76;
    const el=document.getElementById('quant-levels');if(el)el.textContent=L;
    const es=document.getElementById('quant-step');if(es)es.textContent=step.toFixed(4);
    const eq=document.getElementById('quant-sqnr-meas');if(eq)eq.textContent=snrQ.toFixed(1)+' dB';
    const et=document.getElementById('quant-sqnr-theory');if(et)et.textContent=snrTheory.toFixed(1)+' dB';
    requestAnimationFrame(draw);}

  function bindControls(){
    const bs=document.getElementById('quant-bits');if(bs)bs.addEventListener('input',debounce(function(){st.bits=parseInt(bs.value);document.getElementById('quant-bits-val').textContent=bs.value;},16));
    document.querySelectorAll('input[name="quant-type"]').forEach(function(r){r.addEventListener('change',function(){st.type=r.value;});});
    const pb=document.getElementById('quant-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
