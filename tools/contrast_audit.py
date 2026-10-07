import sys, json
from playwright.sync_api import sync_playwright
import os
base='file://'+os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
JS = r"""
() => {
  function parse(c){const q=c.match(/color\(srgb ([^)]+)\)/);if(q){const p=q[1].split(/[ \/]+/).filter(Boolean).map(Number);return {r:p[0]*255,g:p[1]*255,b:p[2]*255,a:p.length>3?p[3]:1};}const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
  function over(fg,bg){const a=fg.a;return {r:fg.r*a+bg.r*(1-a),g:fg.g*a+bg.g*(1-a),b:fg.b*a+bg.b*(1-a),a:1};}
  function lin(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
  function L(c){return 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b);}
  function ratio(a,b){const x=L(a),y=L(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
  function stopsOf(str){const out=[];const re=/(?:rgba?|color)\([^)]*\)/g;let m;while((m=re.exec(str))){const c=parse(m[0]);if(c&&c.a>=0.6)out.push(c);}return out;}
  function bgOf(el){
    const stack=[];let e=el;let grad=null;
    while(e){const cs=getComputedStyle(e);const c=parse(cs.backgroundColor);
      if(c&&c.a>0){stack.push(c);if(c.a>=1)break;}
      else if(!grad&&cs.backgroundImage.indexOf('gradient')>=0){const st=stopsOf(cs.backgroundImage);if(st.length){grad=st;break;}}
      e=e.parentElement;}
    if(grad){ // worst case over the gradient stops
      return grad;}
    let base={r:255,g:255,b:255,a:1};
    if(!(stack.length&&stack[stack.length-1].a>=1)){const c=parse(getComputedStyle(document.body).backgroundColor);if(c)base=c;}
    let out=stack.length&&stack[stack.length-1].a>=1?stack.pop():base;
    while(stack.length){out=over(stack.pop(),out);}
    return [out];
  }
  const res=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const seen=new Set();
  while(walker.nextNode()){
    const n=walker.currentNode;if(!n.textContent.trim())continue;
    const el=n.parentElement;if(!el||seen.has(el))continue;seen.add(el);
    if(el.closest('.pal,script,style,noscript,video,canvas,.sr,#toast,.edu-tab.active,.capmac-num'))continue;
    const cs=getComputedStyle(el);
    if(cs.visibility==='hidden'||cs.display==='none')continue;
    const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
    if(cs.webkitTextFillColor==='rgba(0, 0, 0, 0)')continue; // gradient text handled separately
    let fg=parse(cs.color);if(!fg)continue;
    let op=1,p=el;while(p){op*=parseFloat(getComputedStyle(p).opacity);p=p.parentElement;}
    const bgs=bgOf(el);let worst=99;bgs.forEach(bg=>{const eff=over({...fg,a:fg.a*op},bg);worst=Math.min(worst,ratio(eff,bg));});
    res.push({t:n.textContent.trim().slice(0,32),cls:(el.className&&el.className.baseVal===undefined?el.className:'')||el.tagName,ratio:+worst.toFixed(2),fs:parseFloat(cs.fontSize)});
  }
  return res;
}
"""
def run(pages,pals,themes,thr=4.5,show=6):
    out={}
    with sync_playwright() as p:
        b=p.chromium.launch()
        for pal in pals:
            for th in themes:
                allr=[]
                for n in pages:
                    pg=b.new_page(viewport={'width':1440,'height':900})
                    pg.goto(base+f'{n}.html?p={pal}&t={th}'); pg.wait_for_timeout(350)
                    if n=='education' and pg.locator('.edu-tab').count()>1: pg.locator('.edu-tab').nth(1).click(); pg.wait_for_timeout(400)  # also audit the DC Motor Kit tab
                    pg.evaluate("document.querySelectorAll('.fade-up').forEach(e=>e.classList.add('vis'));document.querySelectorAll('.sbar-fill').forEach(f=>f.style.width=f.dataset.w+'%')"); pg.wait_for_timeout(700)
                    for r in pg.evaluate(JS): r['page']=n; allr.append(r)
                    pg.close()
                bad=sorted([r for r in allr if r['ratio']<thr],key=lambda r:r['ratio'])
                weak=[r for r in allr if thr<=r['ratio']<6]
                out[(pal,th)]=(len(allr),len(bad),len(weak))
                print(f'{pal:8s} {th:5s}: {len(allr)} text nodes | <{thr}: {len(bad)} | 4.5–6: {len(weak)}')
                seen=set()
                for r in bad:
                    k=(r['cls'],r['ratio'])
                    if k in seen: continue
                    seen.add(k)
                    if len(seen)>show: break
                    print('     ',r['ratio'],r['page'],'|',str(r['cls'])[:34],'|',r['t'])
        b.close()
if __name__=='__main__':
    pages=['index','education','matlab','training','industry','labs','about']
    # usage: python3 tools/contrast_audit.py [light,dark] [threshold]   (the palette is fixed: Sea Mist)
    pals=['sea']
    themes=sys.argv[1].split(',') if len(sys.argv)>1 else ['light','dark']
    thr=float(sys.argv[2]) if len(sys.argv)>2 else 4.5
    run(pages,pals,themes,thr)
