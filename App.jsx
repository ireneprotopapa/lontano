import React, { useMemo, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

// ---------------------------------------------
// L'Ontano sulle Alpi — Single-page app (hash routing)
// Palette: #0A400C (primary), #819067 (accent), #B1AB86 (muted), #FEFAE0 (bg)
// Pages:
//   #/                 -> Home (Hero full-bleed, Strutture, Disponibilità centered-left, Dove Siamo)
//   #/galleria         -> Galleria full-bleed + modal viewer
//   #/contatti         -> Contatti full-screen + form
//   #/strutture/:slug  -> Pagina struttura (foto, descrizione, calendario, CTA prenota)
// ---------------------------------------------

const COLORS = {
  primary: "#0A400C",
  accent: "#819067",
  muted: "#B1AB86",
  bg: "#FEFAE0",
  white: "#FFFFFF",
};

function cls(...a) { return a.filter(Boolean).join(" "); }

// Parse hash routes
function parseHash() {
  const h = window.location.hash || "#/";
  const m = h.match(/^#\/strutture\/([^/?#]+)/);
  if (m) return { page: "structure", slug: decodeURIComponent(m[1]) };
  if (h === "#/galleria") return { page: "gallery" };
  if (h === "#/contatti") return { page: "contact" };
  return { page: "home" };
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showStructsMenu, setShowStructsMenu] = useState(false);
  const [range, setRange] = useState({ from: undefined, to: undefined }); // home availability
  const [structRanges, setStructRanges] = useState({}); // per-structure ranges
  const [openStruct, setOpenStruct] = useState(null); // indice struttura aperta (modal overview)
  const [openGalleryIdx, setOpenGalleryIdx] = useState(null); // indice immagine galleria aperta

  // Router minimale basato su hash
  const [route, setRoute] = useState(parseHash());
  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Fonts: Playfair Display (titoli) + Quicksand (testo)
  useEffect(() => {
    const l1 = document.createElement("link"); l1.rel = "preconnect"; l1.href = "https://fonts.googleapis.com";
    const l2 = document.createElement("link"); l2.rel = "preconnect"; l2.href = "https://fonts.gstatic.com"; l2.crossOrigin = "";
    const l3 = document.createElement("link"); l3.rel = "stylesheet"; l3.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Quicksand:wght@400;500;600;700&display=swap";
    document.head.append(l1, l2, l3);
    return () => { [l1, l2, l3].forEach(el => { try { document.head.removeChild(el); } catch {} }); };
  }, []);

  const structures = [
    { slug: "a", title: "Struttura A", desc: "XXX descrizione della Struttura A.", images: [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1600&auto=format&fit=crop" ] },
    { slug: "b", title: "Struttura B", desc: "XXX descrizione della Struttura B.", images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558944351-c36d3a4d1985?q=80&w=1600&auto=format&fit=crop" ] },
    { slug: "c", title: "Struttura C", desc: "XXX descrizione della Struttura C.", images: [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519058497183-06b6111b5b16?q=80&w=1600&auto=format&fit=crop" ] },
    { slug: "d", title: "Struttura D", desc: "XXX descrizione della Struttura D.", images: [
      "https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1600&auto=format&fit=crop" ] },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558944351-c36d3a4d1985?q=80&w=1400&auto=format&fit=crop",
  ];

  const openStructPage = (slug) => {
    window.location.hash = `#/strutture/${encodeURIComponent(slug)}`;
    setMobileOpen(false);
    setShowStructsMenu(false);
  };

  const setStructRange = (slug, r) => setStructRanges(prev => ({ ...prev, [slug]: r }));

  return (
    <div style={{ backgroundColor: COLORS.bg, color: COLORS.primary, fontFamily: "'Quicksand', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji','Segoe UI Emoji'", overflowX: 'hidden' }} className="min-h-screen">
      <style>{`
.font-display{ font-family:'Playfair Display', serif; }
html, body, #root{ margin:0; padding:0; width:100%; }
.full-bleed{ position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw; width:100vw; }
`}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(254,250,224,0.8)", backdropFilter: "blur(6px)", borderColor: COLORS.muted }}>
        <div className="w-full px-6 md:px-10 py-3 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl font-bold" style={{backgroundColor: COLORS.accent, color: COLORS.bg}}>LO</span>
            <div>
              <div className="font-semibold">L'Ontano sulle Alpi</div>
              <div className="text-xs opacity-70 -mt-0.5">Località XXX</div>
            </div>
          </a>

          {/* Hamburger */}
          <button onClick={()=>setMobileOpen(v=>!v)} className="inline-flex items-center justify-center h-10 w-10 rounded-xl" aria-label="Apri menu" style={{backgroundColor: COLORS.accent, color: COLORS.bg}}>☰</button>
        </div>

        {/* Slide-in Menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
            <div className="absolute inset-0" style={{background:"rgba(0,0,0,0.4)"}} onClick={()=>setMobileOpen(false)} />
            <aside className="absolute right-0 top-0 h-full w-72 p-5 shadow-lg" style={{backgroundColor: COLORS.bg, borderLeft:`1px solid ${COLORS.muted}`}}>
              <div className="flex items-center justify-between mb-4">
                <strong>Menu</strong>
                <button onClick={()=>setMobileOpen(false)} aria-label="Chiudi" className="text-xl">×</button>
              </div>
              <nav className="grid gap-1 text-sm">
                <a href="#/" onClick={()=>setMobileOpen(false)} className="py-2 border-b" style={{borderColor: COLORS.muted}}>Homepage</a>
                <button onClick={()=>setShowStructsMenu(s=>!s)} className="py-2 border-b flex items-center justify-between" style={{borderColor: COLORS.muted}}>
                  <span>Le Strutture</span><span>{showStructsMenu ? '▴' : '▾'}</span>
                </button>
                {showStructsMenu && (
                  <div className="pl-3 pb-2 grid">
                    {structures.map(s => (
                      <a key={s.slug} href={`#/strutture/${s.slug}`} onClick={()=>openStructPage(s.slug)} className="py-2 border-b last:border-b-0" style={{borderColor: COLORS.muted}}>
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
                <a href="#/galleria" onClick={()=>setMobileOpen(false)} className="py-2 border-b" style={{borderColor: COLORS.muted}}>Galleria</a>
                <a href="#/contatti" onClick={()=>setMobileOpen(false)} className="py-2">Contatti</a>
              </nav>
            </aside>
          </div>
        )}
      </header>

      {/* HERO full-bleed only on home */}
      {route.page === 'home' && (
        <section id="home" className="relative">
          <div className="absolute inset-0">
            <img className="w-full h-[80vh] md:h-[85vh] object-cover" src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop" alt="Hero"/>
            <div className="absolute inset-0" style={{background: "rgba(254,250,224,0.55)"}}/>
          </div>
          <div className="relative w-full px-6 md:px-10 pt-10 md:py-28">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{color: COLORS.primary}}>
              Benvenuti a <span style={{color: COLORS.accent}}>L'Ontano sulle Alpi</span>
            </h1>
            <p className="leading-relaxed mb-6" style={{opacity: 0.9}}>XXX descrizione breve dell'appartamento, atmosfera accogliente e servizi principali.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#disponibilita" className="rounded-xl px-5 py-3 font-medium hover:opacity-90" style={{backgroundColor: COLORS.accent, color: COLORS.bg}}>Verifica disponibilità</a>
              <a href="#/contatti" className="rounded-xl px-5 py-3 font-medium hover:opacity-80 border" style={{borderColor: COLORS.muted}}>Contattaci</a>
            </div>
          </div>
        </section>
      )}

      {/* GALLERIA page full-bleed */}
      {route.page === 'gallery' && (
        <section id="galleria" className="full-bleed min-h-screen flex flex-col">
          <div className="w-full px-6 md:px-10 flex items-baseline justify-between mb-3 pt-6">
            <h2 className="font-display text-2xl font-bold">Galleria</h2>
            <span className="text-sm" style={{opacity:0.7}}>Clicca una foto per aprirla</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-6 px-0 md:px-0" style={{scrollSnapType: "x mandatory"}}>
              {galleryImages.map((src, i)=> (
                <button key={i} onClick={()=>setOpenGalleryIdx(i)} className="rounded-2xl overflow-hidden shadow">
                  <img src={src} alt={`Foto ${i+1}`} className="object-cover flex-none" style={{width: "24rem", height: "15rem", scrollSnapAlign: "start"}}/>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LE STRUTTURE (home only) */}
      {route.page === 'home' && (
        <section id="strutture" className="full-bleed mt-12 md:mt-20">
          <div className="w-full px-6 md:px-10 pb-12">
            <h2 className="font-display text-2xl font-bold mb-4">Le Strutture</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {structures.map((s, idx)=> (
                <button key={s.slug} onClick={()=>setOpenStruct(idx)} className="group text-left">
                  <div className="rounded-2xl overflow-hidden shadow border" style={{borderColor: COLORS.muted}}>
                    <img src={s.images[0]} alt={s.title} className="h-40 w-full object-cover group-hover:scale-[1.02] transition-transform"/>
                  </div>
                  <div className="mt-2 text-sm font-medium" style={{color: COLORS.primary}}>{s.title}</div>
                  <div className="text-xs" style={{opacity:0.7}}>Clicca per dettagli</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DISPONIBILITÀ (home only) */}
      {route.page === 'home' && (
        <section id="disponibilita" className="full-bleed border-t border-b py-12" style={{borderColor: COLORS.muted, backgroundColor: COLORS.white}}>
          <div className="w-full px-6 md:px-10">
            <div className="max-w-xl w-full mr-auto ml-0 text-center">
              <h2 className="font-display text-2xl font-bold mb-2 text-center">Disponibilità</h2>
              <p className="text-sm mb-4 text-center" style={{opacity:0.8}}>Seleziona le date di <strong>check‑in</strong> e <strong>check‑out</strong>.</p>
              <div className="rounded-2xl border p-4 shadow-sm" style={{backgroundColor: COLORS.bg, borderColor: COLORS.muted}}>
                <div className="flex justify-center"><DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={2} weekStartsOn={1} fromMonth={new Date()} styles={{ caption: { fontWeight: 700, color: COLORS.primary }, day: { borderRadius: 12 } }} /></div>
                <div className="mt-2" style={{color: COLORS.primary}}>
                  {range?.from && range?.to ? `Dal ${format(range.from, "PPP")} al ${format(range.to, "PPP")}` : range?.from ? `Check‑in: ${format(range.from, "PPP")}. Seleziona il check‑out.` : "Seleziona check‑in e check‑out"}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DOVE SIAMO (home only) */}
      {route.page === 'home' && (
        <section id="dovesiamo" className="full-bleed border-t" style={{borderColor: COLORS.muted}}>
          <div className="w-full px-6 md:px-10 py-12">
            <h2 className="font-display text-2xl font-bold mb-4">Dove Siamo</h2>
            <p className="text-sm mb-4" style={{opacity:0.85}}>XXXXX</p>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl overflow-hidden border shadow-sm" style={{borderColor: COLORS.muted}}>
                <iframe title="Mappa: Val Pellice" width="100%" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Val+Pellice&hl=it&z=11&output=embed"></iframe>
              </div>
              <div className="text-xs mt-2 opacity-70 text-center">Destinazione: Val Pellice</div>
              <div className="mt-3 text-center"><a href="https://www.google.com/maps/search/?api=1&query=Val+Pellice" target="_blank" rel="noreferrer" className="underline">Apri indicazioni su Google Maps</a></div>
            </div>
          </div>
        </section>
      )}

      {/* PAGINA STRUTTURA */}
      {route.page === 'structure' && (
        <StructurePage
          colors={COLORS}
          structure={structures.find(s=>s.slug===route.slug)}
          range={structRanges[route.slug] || {from:undefined, to:undefined}}
          setRange={(r)=>setStructRange(route.slug, r)}
        />
      )}

      {/* CONTATTI page full-screen */}
      {route.page === 'contact' && (
        <section id="contatti" className="full-bleed min-h-screen flex items-center" style={{backgroundColor: COLORS.white}}>
          <div className="w-full px-6 md:px-10 mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-bold mb-4">Contatti</h2>
            <ul className="text-sm mb-6">
              <li><strong>Telefono:</strong> +39 XXX XXX XXXX</li>
              <li><strong>Email:</strong> info@example.com</li>
            </ul>
            <ContactForm colors={COLORS} range={range} />
          </div>
        </section>
      )}

      {/* Footer (static) */}
      <footer className="border-t" style={{borderColor: COLORS.muted}}>
        <div className="w-full px-6 md:px-10 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4" style={{opacity:0.8}}>
          <div>© {new Date().getFullYear()} L'Ontano sulle Alpi</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#/contatti">Contatti</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#/">Torna su</a>
          </div>
        </div>
      </footer>

      {openGalleryIdx !== null && (
        <GalleryModal colors={COLORS} images={galleryImages} idx={openGalleryIdx} setIdx={setOpenGalleryIdx} onClose={()=>setOpenGalleryIdx(null)} />
      )}
      {openStruct !== null && (
        <StructureModal colors={COLORS} structure={structures[openStruct]} onClose={()=>setOpenStruct(null)} onMore={()=>{ const slug=structures[openStruct].slug; setOpenStruct(null); openStructPage(slug); }} />
      )}
    </div>
  );
}

function StructurePage({ colors, structure, range, setRange }){
  if (!structure) return (
    <section className="full-bleed min-h-screen flex items-center justify-center">
      <div className="px-6 md:px-10 text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Struttura non trovata</h2>
        <a className="underline" href="#/">Torna alla homepage</a>
      </div>
    </section>
  );
  return (
    <section className="full-bleed min-h-screen" style={{backgroundColor: colors.white}}>
      <div className="w-full px-6 md:px-10 py-8">
        <a href="#/" className="text-sm underline">← Torna alla homepage</a>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4" style={{color: colors.primary}}>{structure.title}</h1>
        <p className="text-sm mb-6" style={{opacity:0.85}}>XXXXX descrizione estesa della struttura. Servizi, capienza (X persone), posizione (XXX), punti di forza, ecc.</p>

        {/* Foto scorrevoli */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-2" style={{scrollSnapType: 'x mandatory'}}>
            {structure.images.map((src, i)=> (
              <img key={i} src={src} alt={`${structure.title} foto ${i+1}`} className="rounded-2xl object-cover flex-none shadow" style={{width:'24rem', height:'15rem', scrollSnapAlign:'start'}}/>
            ))}
          </div>
        </div>

        {/* Calendario + CTA */}
        <div className="max-w-xl w-full mt-8">
          <h3 className="font-display text-2xl font-bold mb-2">Disponibilità — {structure.title}</h3>
          <div className="rounded-2xl border p-4 shadow-sm" style={{backgroundColor: colors.bg, borderColor: colors.muted}}>
            <div className="flex justify-center"><DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={2} weekStartsOn={1} fromMonth={new Date()} styles={{ caption: { fontWeight: 700, color: colors.primary }, day: { borderRadius: 12 } }} /></div>
            <div className="mt-2" style={{color: colors.primary}}>
              {range?.from && range?.to ? `Dal ${format(range.from, 'PPP')} al ${format(range.to, 'PPP')}` : range?.from ? `Check‑in: ${format(range.from, 'PPP')}. Seleziona il check‑out.` : 'Seleziona check‑in e check‑out'}
            </div>
            <div className="mt-4">
              <a href="#/contatti" className="inline-block rounded-xl px-5 py-3 font-medium hover:opacity-90" style={{backgroundColor: colors.accent, color: colors.bg}}>Prenota ora</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm({ colors, range }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [nights, setNights] = useState(3);

  const FORMSPREE_ACTION = ""; // es: "https://formspree.io/f/abcdwxyz"

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Richiesta prenotazione dal sito");
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\nTelefono: ${phone}\nCheck‑in: ${range?.from ? format(range.from, "yyyy-MM-dd") : "-"}\nCheck‑out: ${range?.to ? format(range.to, "yyyy-MM-dd") : "-"}\nNotti: ${nights}\n\nMessaggio:\n${message}`);
    return `mailto:host@example.com?subject=${subject}&body=${body}`;
  }, [name, email, phone, message, range, nights]);

  return (
    <form action={FORMSPREE_ACTION || undefined} method={FORMSPREE_ACTION ? "POST" : undefined} className="grid gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Nome" name="name" value={name} onChange={(e)=>setName(e.target.value)} required style={{borderColor: colors.muted}}/>
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Email" name="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={{borderColor: colors.muted}}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Telefono (opzionale)" name="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} style={{borderColor: colors.muted}}/>
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Notti" name="nights" type="number" min={1} max={60} value={nights} onChange={(e)=>setNights(Number(e.target.value))} style={{borderColor: colors.muted}}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Check‑in (AAAA‑MM‑GG)" readOnly value={range?.from ? format(range.from, 'yyyy-MM-dd') : ''} style={{borderColor: colors.muted}}/>
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Check‑out (AAAA‑MM‑GG)" readOnly value={range?.to ? format(range.to, 'yyyy-MM-dd') : ''} style={{borderColor: colors.muted}}/>
      </div>
      <textarea className="rounded-lg border px-3 py-2 text-sm min-h-[100px]" placeholder="Il tuo messaggio" name="message" value={message} onChange={(e)=>setMessage(e.target.value)} required style={{borderColor: colors.muted}}/>

      {FORMSPREE_ACTION ? (
        <button type="submit" className="rounded-xl px-5 py-3 font-medium hover:opacity-90" style={{backgroundColor: colors.accent, color: colors.bg}}>Invia richiesta</button>
      ) : (
        <a href={mailtoHref} className="inline-block rounded-xl px-5 py-3 font-medium hover:opacity-90" style={{backgroundColor: colors.accent, color: colors.bg}}>Invia via email</a>
      )}
    </form>
  );
}

function GalleryModal({ colors, images, idx, setIdx, onClose }) {
  const total = images.length;
  const prev = () => setIdx((i)=> (i - 1 + total) % total);
  const next = () => setIdx((i)=> (i + 1) % total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{background:"rgba(0,0,0,0.6)"}} onClick={onClose} />
      <div className="relative w-[min(100%,1100px)] max-h-[90vh] overflow-hidden rounded-2xl shadow-xl" style={{backgroundColor: colors.white}}>
        <button onClick={onClose} aria-label="Chiudi" className="absolute top-3 right-3 text-2xl leading-none px-3 py-1 rounded-xl" style={{backgroundColor: colors.bg}}>×</button>
        <div className="relative">
          <img src={images[idx]} alt={`Galleria immagine ${idx+1}`} className="w-full object-cover" style={{height: "70vh"}}/>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
            <button onClick={prev} className="rounded-xl px-3 py-2 text-sm" style={{backgroundColor: colors.bg}}>‹ Prev</button>
            <div className="text-xs" style={{backgroundColor: colors.bg, padding:"4px 8px", borderRadius: "10px"}}>{idx+1} / {total}</div>
            <button onClick={next} className="rounded-xl px-3 py-2 text-sm" style={{backgroundColor: colors.bg}}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StructureModal({ colors, structure, onClose, onMore }) {
  const [idx, setIdx] = useState(0);
  const total = structure.images.length;
  const prev = () => setIdx((i)=> (i - 1 + total) % total);
  const next = () => setIdx((i)=> (i + 1) % total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{background:"rgba(0,0,0,0.6)"}} onClick={onClose} />
      <div className="relative w-[min(100%,1100px)] max-h-[90vh] overflow-hidden rounded-2xl shadow-xl" style={{backgroundColor: colors.white}}>
        <button onClick={onClose} aria-label="Chiudi" className="absolute top-3 right-3 text-2xl leading-none px-3 py-1 rounded-xl" style={{backgroundColor: colors.bg}}>×</button>
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-3">
            <div className="relative">
              <img src={structure.images[idx]} alt={`${structure.title} immagine ${idx+1}`} className="w-full object-cover" style={{height: "60vh"}}/>
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
                <button onClick={prev} className="rounded-xl px-3 py-2 text-sm" style={{backgroundColor: colors.bg}}>‹ Prev</button>
                <div className="text-xs" style={{backgroundColor: colors.bg, padding:"4px 8px", borderRadius: "10px"}}>{idx+1} / {total}</div>
                <button onClick={next} className="rounded-xl px-3 py-2 text-sm" style={{backgroundColor: colors.bg}}>Next ›</button>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 p-4 overflow-auto" style={{maxHeight: "60vh"}}>
            <h3 className="font-display font-semibold text-lg mb-2" style={{color: colors.primary}}>{structure.title}</h3>
            <p className="text-sm mb-4" style={{opacity:0.85}}>{structure.desc}</p>
            <div className="flex gap-3">
              <a onClick={onMore} className="underline cursor-pointer">Scopri di più</a>
              <a href="#/contatti" className="underline">Prenota ora</a>
            </div>
            <div className="overflow-x-auto mt-4">
              <div className="flex gap-2">
                {structure.images.map((s,i)=> (
                  <button key={i} onClick={()=>setIdx(i)} className={cls("rounded-xl overflow-hidden border", i===idx && "ring-2")} style={{borderColor: colors.muted}}>
                    <img src={s} alt={`thumb ${i+1}`} className="h-20 w-28 object-cover"/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
