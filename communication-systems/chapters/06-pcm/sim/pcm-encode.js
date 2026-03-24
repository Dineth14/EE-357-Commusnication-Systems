/* PCM Encoder Visualizer — Chapter 6 Sim 1 */
(function(){
  const st={bits:4,fs:10,fm:1,playing:true,time:0,speed:0.5};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('pcm-encode-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=420;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return 0.9*Math.sin(2*Math.PI*st.fm*t);}
  function quantize(v,bits){const L=Math.pow(2,bits);const step=2.0/L;const idx=Math.floor((v+1)/step);const clamped=Math.max(0,Math.min(L-1,idx));return{level:clamped,value:-1+clamped*step+step/2};}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const pH=H*0.55,mid1=pH/2,amp1=pH*0.4,dur=2.5/st.fm;
    const Ts=1/st.fs,L=Math.pow(2,st.bits);
    // Panel 1: Signal + quantized + binary labels
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('Analog → Quantized → Binary ('+st.bits+'-bit, '+L+' levels)',8,14);
    // Quantization levels
    ctx.strokeStyle='rgba(100,116,139,0.15)';ctx.lineWidth=0.5;
    for(let i=0;i<=L;i++){const v=-1+i*(2/L);const y=mid1-amp1*v;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Original signal
    ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid1-amp1*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    // Quantized staircase + binary
    ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();
    const samples=[];
    for(let tn=Math.ceil(st.time*st.fs)/st.fs;tn<=st.time+dur;tn+=Ts){
      const v=msg(tn);const q=quantize(v,st.bits);samples.push({t:tn,level:q.level,qv:q.value});
      const x=((tn-st.time)/dur)*W;const y=mid1-amp1*q.value;
      ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(x,y,4,0,2*Math.PI);ctx.fill();
      // Binary label
      const bin=q.level.toString(2).padStart(st.bits,'0');
      ctx.fillStyle='#2dd4bf';ctx.font='bold 10px JetBrains Mono';ctx.save();ctx.translate(x,y-12);ctx.fillText(bin,-bin.length*3,0);ctx.restore();
    }
    // Panel 2: PCM bitstream
    const y2=pH+10;ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('PCM Bitstream (NRZ)',8,y2+10);
    const bitsTotal=samples.length*st.bits;const bitW=W/Math.max(bitsTotal,1);
    let bx=0;
    for(let s=0;s<samples.length;s++){
      const bin=samples[s].level.toString(2).padStart(st.bits,'0');
      for(let b=0;b<st.bits;b++){const bit=parseInt(bin[b]);
        const y=bit?y2+20:y2+H-pH-20;const h=bit?30:-30;
        ctx.fillStyle=bit?'rgba(56,189,248,0.3)':'rgba(251,113,133,0.15)';
        ctx.fillRect(bx,y2+25,bitW-1,H-pH-50);
        ctx.strokeStyle=bit?'#38bdf8':'#fb7185';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(bx,bit?y2+25:y2+H-pH-25);ctx.lineTo(bx+bitW-1,bit?y2+25:y2+H-pH-25);ctx.stroke();
        ctx.fillStyle='#94a3b8';ctx.font='9px JetBrains Mono';ctx.fillText(bit.toString(),bx+bitW/2-3,y2+H/2-pH/2+25);
        bx+=bitW;}
      // separator
      ctx.strokeStyle='rgba(100,116,139,0.3)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(bx,y2+20);ctx.lineTo(bx,y2+H-pH-15);ctx.stroke();
    }
    // Readouts
    const br=document.getElementById('pcm-bitrate');if(br)br.textContent=(st.fs*st.bits).toFixed(0)+' bps';
    const bw=document.getElementById('pcm-bw');if(bw)bw.textContent=(st.fs*st.bits/2).toFixed(0)+' Hz (min)';
    requestAnimationFrame(draw);}
  function bindControls(){
    const bs=document.getElementById('pcm-bits');if(bs)bs.addEventListener('input',debounce(function(){st.bits=parseInt(bs.value);document.getElementById('pcm-bits-val').textContent=bs.value;},16));
    const fs=document.getElementById('pcm-fs');if(fs)fs.addEventListener('input',debounce(function(){st.fs=parseFloat(fs.value);document.getElementById('pcm-fs-val').textContent=fs.value;},16));
    const pb=document.getElementById('pcm-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
