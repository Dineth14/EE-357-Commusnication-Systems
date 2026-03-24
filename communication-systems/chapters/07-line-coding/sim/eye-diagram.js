/* Eye Diagram — Chapter 7 Sim 3 */
(function(){
  const st={code:'nrz-l',noise:0.1,numTraces:50,baud:1};
  let canvas,ctx,W,H;
  function init(){canvas=document.getElementById('eye-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();draw();}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=300;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function randBits(n){const b=[];for(let i=0;i<n;i++)b.push(Math.random()>0.5?1:0);return b;}
  function encodeVal(b,prev,code){
    switch(code){
      case 'nrz-l':return b?1:-1;
      case 'manchester':return null;// handled separately
      case 'ami':return b?(prev<=0?1:-1):0;
      default:return b?1:-1;
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);const mid=H/2,amp=H*0.35;
    // Grid
    ctx.strokeStyle='rgba(100,116,139,0.2)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    ctx.strokeStyle='rgba(100,116,139,0.15)';ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(0,mid-amp);ctx.lineTo(W,mid-amp);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,mid+amp);ctx.lineTo(W,mid+amp);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#64748b';ctx.font='10px Inter';ctx.fillText('Eye Diagram — '+st.code.toUpperCase(),8,14);
    // Traces
    const spp=100;// samples per period (2 bit intervals shown)
    const bitsPerTrace=4;
    ctx.globalAlpha=0.15;ctx.strokeStyle='#38bdf8';ctx.lineWidth=1;
    for(let t=0;t<st.numTraces;t++){
      const bits=randBits(bitsPerTrace);let prevLevel=1;
      ctx.beginPath();
      for(let s=0;s<spp*2;s++){const frac=s/spp;// 0-2 bit intervals
        const bitIdx=Math.floor(frac);const subFrac=frac-bitIdx;
        const b=bits[bitIdx]||0;const bNext=bits[bitIdx+1]||0;
        let level;
        if(st.code==='manchester'){level=b?(subFrac<0.5?1:-1):(subFrac<0.5?-1:1);}
        else{level=encodeVal(b,prevLevel,st.code);if(b&&st.code==='ami')prevLevel=level;}
        const n=gaussianNoise(0,st.noise);const y=mid-amp*(level+n);const x=(s/(spp*2))*W;
        if(s===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }ctx.stroke();
    }
    ctx.globalAlpha=1;
    // Eye opening measurement
    const opening=(1-st.noise*3)*100;
    const eo=document.getElementById('eye-opening');if(eo)eo.textContent=Math.max(0,opening).toFixed(0)+'%';
  }
  function bindControls(){
    document.querySelectorAll('input[name="eye-code"]').forEach(function(r){r.addEventListener('change',function(){st.code=r.value;draw();});});
    const ns=document.getElementById('eye-noise');if(ns)ns.addEventListener('input',debounce(function(){st.noise=parseFloat(ns.value);document.getElementById('eye-noise-val').textContent=ns.value;draw();},30));
    const ts=document.getElementById('eye-traces');if(ts)ts.addEventListener('input',debounce(function(){st.numTraces=parseInt(ts.value);document.getElementById('eye-traces-val').textContent=ts.value;draw();},30));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
