// ══════════════════════════════════════════════
//  SPORTÍN — SHARED LAYOUT (header, footer, cart, chatbot, checkout)
//  Call: Layout.init(activePage)
// ══════════════════════════════════════════════

const Layout = {

  NAV: [
    {href:'index.html',     label:'Inicio'},
    {href:'coleccion.html', label:'Colección'},
    {href:'paquetes.html',  label:'Paquetes'},
    {href:'categorias.html',label:'Categorías'},
    {href:'reseñas.html',   label:'Reseñas'},
    {href:'dashboard.html', label:'Dashboard'},
    {href:'pagos.html',     label:'Métodos de pago'},
    {href:'devoluciones.html',label:'Devoluciones'},
  ],

  MARQUEE_ITEMS: ['ENVÍO GRATIS +S/100','NUEVA COLECCIÓN 2026','−30% EN HOODIES','PAGO SEGURO SSL 256 BITS','DEVOLUCIONES GRATIS 30 DÍAS','+500 PRODUCTOS','YAPE · TARJETA · PAYPAL'],

  BOT_RESPONSES: {
    stock() {
      const low = SPORTIN.PRODUCTS.filter(p=>p.stock>0&&p.stock<=5).map(p=>`${p.name} (${p.stock} uds)`).join(', ');
      const out = SPORTIN.PRODUCTS.filter(p=>p.stock===0).map(p=>p.name).join(', ');
      return `📦 <strong>Inventario actual:</strong><br>${out?`<br>❌ Sin stock: ${out}.`:''}${low?`<br>⚠️ Stock bajo: ${low}.`:''}<br><br>El resto está disponible 😊`;
    },
    envio:()=>'🚚 <strong>Tiempos de entrega:</strong><br>• Lima: 1-2 días hábiles.<br>• Provincias: 3-5 días hábiles.<br>• Express 24H: +S/15 adicional.<br><br>Recibirás un código de seguimiento por WhatsApp.',
    courier:()=>'📮 <strong>Courier que usamos:</strong><br>• Olva Courier (nacional)<br>• Shalom (+150 ciudades)<br>• DHL Express (urgente)<br>• Recojo en tienda — Miraflores.',
    devolucion:()=>'🔄 <strong>Devoluciones:</strong><br>• 30 días para devolver.<br>• Recojo gratuito.<br>• Reembolso 100% en 5-7 días.<br>• Cambio de talla sin costo.<br><br>WhatsApp: <strong>+51 999 999 999</strong>',
    descuento:()=>'🏷️ <strong>Descuentos activos:</strong><br>• −30% Hoodie Thermal X<br>• −25% Leggings PowerFlex<br>• −20% Camiseta Yoga Zen<br>• 15% OFF suscribiéndote al newsletter.',
    pago:()=>'💳 <strong>Métodos de pago:</strong><br>📱 Yape · 📲 Plin · 💳 Visa · 💳 Mastercard · 🔵 PayPal · 💚 PagoEfectivo · 🏦 Transferencia bancaria.<br><br>Todo con SSL 256 bits. 100% seguro.',
    talla:()=>'📏 <strong>Guía rápida de tallas:</strong><br>• XS: cintura 63-68 cm<br>• S: cintura 68-73 cm<br>• M: cintura 73-79 cm<br>• L: cintura 79-84 cm<br>• XL: cintura 84-90 cm',
    default:()=>'¡Hola! 👋 Soy <strong>SportBot</strong>, asistente de Sportín.<br>Puedo ayudarte con:<br>📦 Stock · 🚚 Envíos · 📮 Courier · 🔄 Devoluciones · 💳 Pagos · 📏 Tallas<br><br>¿Qué necesitas?',
  },

  getBotReply(text) {
    const t = text.toLowerCase();
    if(/stock|inventario|queda|disponible|hay/.test(t)) return this.BOT_RESPONSES.stock();
    if(/env[ií]o|tiempo|tarda|llega|entrega/.test(t)) return this.BOT_RESPONSES.envio();
    if(/courier|empresa|olva|shalom|despacha/.test(t)) return this.BOT_RESPONSES.courier();
    if(/devoluci|cambio|devolver|reembolso/.test(t)) return this.BOT_RESPONSES.devolucion();
    if(/descuento|oferta|promo|preci/.test(t)) return this.BOT_RESPONSES.descuento();
    if(/yape|pago|tarjeta|plin|paypal/.test(t)) return this.BOT_RESPONSES.pago();
    if(/talla|medida|tama/.test(t)) return this.BOT_RESPONSES.talla();
    return this.BOT_RESPONSES.default();
  },

  renderHeader(activePage) {
    const user = SPORTIN.getSession();
    const navLinks = this.NAV.map(n=>`<a href="${n.href}" class="${n.href===activePage?'active':''}">${n.label}</a>`).join('');
    return `
    <header>
      <a href="index.html" class="logo-wrap">
        <div class="logo-icon">S</div>
        <span class="logo-text">SPORT<span>ÍN</span></span>
      </a>
      <nav>${navLinks}</nav>
      <div class="hdr-search">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Buscar..." id="hdrSearch" oninput="Layout.handleSearch(this.value)" autocomplete="off">
      </div>
      <div id="searchDrop" style="position:absolute;top:66px;left:50%;transform:translateX(-50%);z-index:900;background:var(--charcoal);border:1px solid var(--border);border-radius:14px;width:340px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.6);display:none;max-height:340px;overflow-y:auto;padding:8px"></div>
      <div class="hdr-icons">
        <button class="hdr-btn" onclick="Layout.openCart()" title="Carrito">🛒<span class="cart-badge" id="cartBadge">0</span></button>
        ${user
          ? `<div class="hdr-user" onclick="Layout.handleUserMenu()"><span class="hdr-user-dot"></span>${user.name.split(' ')[0]}</div>`
          : `<a href="login.html" class="hdr-btn" title="Iniciar sesión">👤</a>`}
      </div>
    </header>`;
  },

  renderMarquee() {
    const items = [...this.MARQUEE_ITEMS, ...this.MARQUEE_ITEMS].map(i=>`<span class="mitem"><span class="mdot"></span>${i}</span>`).join('');
    return `<div class="marquee"><div class="mtrack">${items}</div></div>`;
  },

  renderFooter() {
    return `
    <footer>
      <div class="ft-grid">
        <div>
          <a href="index.html" class="ft-logo">SPORT<span>ÍN</span></a>
          <p class="ft-desc">Ropa deportiva de alto rendimiento para atletas que no se conforman. Lima, Perú — Envíos a todo el país.</p>
          <div class="ft-socials">
            <a href="https://tiktok.com/@sportin" target="_blank" rel="noopener" class="soc-btn soc-tiktok" title="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.93a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/></svg>
            </a>
            <a href="https://instagram.com/sportin" target="_blank" rel="noopener" class="soc-btn soc-ig" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://wa.me/51999999999?text=Hola%20Sportín!" target="_blank" rel="noopener" class="soc-btn soc-wsp" title="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4>Tienda</h4>
          <ul class="ft-links">
            <li><a href="coleccion.html">Nueva colección</a></li>
            <li><a href="coleccion.html">Hombre</a></li>
            <li><a href="coleccion.html">Mujer</a></li>
            <li><a href="paquetes.html">Paquetes VIP</a></li>
            <li><a href="coleccion.html">Outlet</a></li>
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul class="ft-links">
            <li><a href="devoluciones.html">Devoluciones</a></li>
            <li><a href="#">Guía de tallas</a></li>
            <li><a href="#">Seguimiento</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="https://wa.me/51999999999" target="_blank">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h4>Empresa</h4>
          <ul class="ft-links">
            <li><a href="index.html">Sobre Sportín</a></li>
            <li><a href="#">Sostenibilidad</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Embajadores</a></li>
            <li><a href="#">Trabaja con nosotros</a></li>
          </ul>
        </div>
      </div>
      <div class="ft-bottom">
        <div class="ft-copy">© 2026 Sportín. Todos los derechos reservados. | Lima, Perú</div>
        <div class="trust-row">
          <span class="trust">🔒 SSL 256-bit</span>
          <span class="trust">✅ PCI-DSS</span>
          <span class="trust">🇵🇪 Hecho en Perú</span>
          <span class="trust">📦 Olva Courier</span>
        </div>
      </div>
    </footer>`;
  },

  renderCart() {
    return `
    <div id="cartOverlay" onclick="if(event.target===this)Layout.closeCart()">
      <div class="cart-panel">
        <div class="cart-hdr">
          <span class="cart-ttl">🛒 Mi carrito</span>
          <button class="cart-x" onclick="Layout.closeCart()">✕</button>
        </div>
        <div class="cart-body" id="cartBody"></div>
        <div id="cartFoot" style="display:none">
          <div class="cart-foot">
            <div class="cart-ssl"><span>🔒</span> Cifrado SSL 256 bits · PCI-DSS</div>
            <div class="cart-row"><span>Subtotal</span><span id="cartSub">S/ 0</span></div>
            <div class="cart-row"><span>Envío</span><span style="color:var(--green)">Gratis (sobre S/100)</span></div>
            <div class="cart-total-row"><span class="cart-total-label">Total</span><span class="cart-total-val" id="cartTotalVal">S/ 0</span></div>
            <button class="checkout-btn" onclick="Layout.openCheckout()">🔒 Pagar de forma segura</button>
            <div class="pay-row">
              <span class="pm">📱 Yape</span><span class="pm">💳 Visa</span><span class="pm">💳 Mastercard</span>
              <span class="pm">🔵 PayPal</span><span class="pm">📲 Plin</span><span class="pm">💚 PagoEfectivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  renderCheckout() {
    return `
    <div id="checkoutModal">
      <div class="modal-box">
        <h3>Finalizar compra</h3>
        <div class="msteps">
          <div class="mstep on" id="ms1">1 · Datos</div>
          <div class="mstep" id="ms2">2 · Envío</div>
          <div class="mstep" id="ms3">3 · Pago</div>
        </div>
        <div class="mform on" id="mf1">
          <div class="fg"><label>Nombre completo</label><input type="text" id="f_name" placeholder="Juan Pérez"></div>
          <div class="fg"><label>Correo electrónico</label><input type="email" id="f_email" placeholder="juan@email.com"></div>
          <div class="fg"><label>Teléfono / WhatsApp</label><input type="tel" id="f_phone" placeholder="+51 999 999 999"></div>
          <div class="fg"><label>DNI / RUC</label><input type="text" id="f_dni" placeholder="12345678"></div>
          <div class="mnav"><button class="mbtn-back" onclick="Layout.closeCheckout()">Cancelar</button><button class="mbtn-next" onclick="Layout.nextStep(2)">Continuar →</button></div>
        </div>
        <div class="mform" id="mf2">
          <div class="fg"><label>Departamento</label><select id="f_dep"><option>Lima</option><option>Arequipa</option><option>Cusco</option><option>Trujillo</option><option>Ancash</option><option>Piura</option><option>Otro</option></select></div>
          <div class="fg"><label>Dirección completa</label><input type="text" id="f_addr" placeholder="Av. Los Olivos 123, Miraflores"></div>
          <div class="fg-row">
            <div class="fg"><label>Distrito</label><input type="text" id="f_dist" placeholder="Miraflores"></div>
            <div class="fg"><label>Referencia</label><input type="text" id="f_ref" placeholder="Cerca al parque"></div>
          </div>
          <div class="fg"><label>Tipo de entrega</label><select id="f_ship"><option>Estándar (3-5 días) — Gratis sobre S/100</option><option>Express 24-48H — S/15 adicional</option><option>Recojo en tienda — Miraflores</option></select></div>
          <div class="mnav"><button class="mbtn-back" onclick="Layout.nextStep(1)">← Volver</button><button class="mbtn-next" onclick="Layout.nextStep(3)">Continuar →</button></div>
        </div>
        <div class="mform" id="mf3">
          <div class="pay-opts">
            <div class="pay-opt sel" onclick="Layout.selPay(this,'yape')"><div class="pay-opt-ico">📱</div>Yape</div>
            <div class="pay-opt" onclick="Layout.selPay(this,'visa')"><div class="pay-opt-ico">💳</div>Visa</div>
            <div class="pay-opt" onclick="Layout.selPay(this,'mc')"><div class="pay-opt-ico">💳</div>Mastercard</div>
            <div class="pay-opt" onclick="Layout.selPay(this,'paypal')"><div class="pay-opt-ico">🔵</div>PayPal</div>
            <div class="pay-opt" onclick="Layout.selPay(this,'plin')"><div class="pay-opt-ico">📲</div>Plin</div>
            <div class="pay-opt" onclick="Layout.selPay(this,'pago')"><div class="pay-opt-ico">💚</div>PagoEfectivo</div>
          </div>
          <div class="order-summary-box" id="orderSummary"></div>
          <div class="mnav"><button class="mbtn-back" onclick="Layout.nextStep(2)">← Volver</button><button class="mbtn-next" onclick="Layout.confirmOrder()">✅ Confirmar pedido</button></div>
        </div>
      </div>
    </div>
    <div id="successModal">
      <div class="success-box">
        <div class="success-ico">✅</div>
        <h3>¡Pedido confirmado!</h3>
        <p>Gracias por tu compra en <strong>Sportín</strong>. Recibirás confirmación por correo y WhatsApp.</p>
        <div class="track-label">Código de trazabilidad</div>
        <div class="track-code" id="trackCode">SPT-2026-XXXXXX</div>
        <p style="font-size:.78rem;color:var(--muted);margin-bottom:16px">Usa este código para rastrear tu pedido en tiempo real.</p>
        <button class="btn-v" style="width:100%;justify-content:center" onclick="Layout.closeSuccess()">🏠 Seguir comprando</button>
      </div>
    </div>`;
  },

  renderChatbot() {
    return `
    <button id="chatToggle" onclick="Layout.toggleChat()" title="SportBot">🤖<span class="chat-unread" id="chatUnread">1</span></button>
    <div id="chatWin">
      <div class="chat-hdr">
        <div class="bot-av">🤖</div>
        <div><div class="bot-n">SportBot — Asistente Sportín</div><div class="bot-s"><span class="sdot"></span>En línea ahora</div></div>
        <button class="chat-xbtn" onclick="Layout.toggleChat()">✕</button>
      </div>
      <div class="chat-msgs" id="chatMsgs"></div>
      <div class="qicks">
        <button class="qick" onclick="Layout.qick('¿Cuánto stock hay?')">📦 Stock</button>
        <button class="qick" onclick="Layout.qick('¿Cuánto tarda el envío?')">🚚 Envío</button>
        <button class="qick" onclick="Layout.qick('¿Por qué courier envían?')">📮 Courier</button>
        <button class="qick" onclick="Layout.qick('¿Cómo hago una devolución?')">🔄 Devolución</button>
        <button class="qick" onclick="Layout.qick('¿Cómo pago con Yape?')">📱 Yape</button>
        <button class="qick" onclick="Layout.qick('¿Tienen descuentos?')">🏷️ Descuentos</button>
      </div>
      <div class="chat-inp-area">
        <input type="text" class="chat-inp" id="chatInp" placeholder="Escribe tu pregunta..." onkeypress="if(event.key==='Enter')Layout.sendMsg()">
        <button class="chat-send" onclick="Layout.sendMsg()">➤</button>
      </div>
    </div>`;
  },

  // ── STATE ──
  _chatOpen: false,
  _step: 1,
  _selPay: 'yape',
  _quantities: {},

  // ── INIT ──
  init(activePage) {
    // Inject header
    document.body.insertAdjacentHTML('afterbegin', this.renderHeader(activePage));
    // Inject marquee after header (pages include manually if needed)
    // Inject footer before closing body
    document.body.insertAdjacentHTML('beforeend', this.renderFooter());
    document.body.insertAdjacentHTML('beforeend', this.renderCart());
    document.body.insertAdjacentHTML('beforeend', this.renderCheckout());
    document.body.insertAdjacentHTML('beforeend', this.renderChatbot());
    // Update cart badge
    SPORTIN.updateCartBadge();
    // Pre-fill user data if logged in
    const user = SPORTIN.getSession();
    if(user) {
      const el = document.getElementById('f_name'); if(el) el.value = user.name;
      const el2 = document.getElementById('f_email'); if(el2) el2.value = user.email;
    }
  },

  // ── SEARCH ──
  _searchTimer: null,
  handleSearch(val) {
    clearTimeout(this._searchTimer);
    const drop = document.getElementById('searchDrop');
    if(!val.trim()) { drop.style.display='none'; return; }
    this._searchTimer = setTimeout(() => {
      const matches = SPORTIN.PRODUCTS.filter(p=>p.name.toLowerCase().includes(val.toLowerCase())||p.cat.toLowerCase().includes(val.toLowerCase()));
      if(!matches.length) { drop.style.display='block'; drop.innerHTML='<div style="color:var(--muted);font-size:.82rem;text-align:center;padding:18px">Sin resultados</div>'; return; }
      drop.style.display='block';
      drop.innerHTML = matches.map(p=>`
        <div onclick="Layout.quickAdd(${p.id})" style="display:flex;align-items:center;gap:10px;padding:9px;border-radius:9px;cursor:pointer;transition:var(--t)" onmouseover="this.style.background='var(--mid)'" onmouseout="this.style.background=''">
          <span style="font-size:1.5rem">${p.emoji}</span>
          <div style="flex:1"><div style="font-size:.87rem;font-weight:600">${p.name}</div><div style="font-size:.72rem;color:var(--muted)">${p.cat} · ${p.stock>0?`Stock: ${p.stock}`:'Sin stock'}</div></div>
          <span style="font-family:var(--F);font-size:.95rem;font-weight:700;color:var(--volt)">S/ ${p.price}</span>
        </div>`).join('');
      document.addEventListener('click', e=>{ if(!drop.contains(e.target)&&e.target!==document.getElementById('hdrSearch')) drop.style.display='none'; }, {once:true});
    }, 220);
  },

  quickAdd(id) {
    document.getElementById('searchDrop').style.display='none';
    document.getElementById('hdrSearch').value='';
    SPORTIN.addToCart(id,1);
    SPORTIN.updateCartBadge();
    this.refreshCartUI();
    this.openCart();
  },

  // ── USER MENU ──
  handleUserMenu() {
    const user = SPORTIN.getSession();
    if(!user) return;
    if(confirm(`Sesión activa: ${user.name}\n¿Deseas cerrar sesión?`)) {
      SPORTIN.clearSession();
      window.location.href='login.html';
    }
  },

  // ── CART ──
  openCart() { document.getElementById('cartOverlay').classList.add('open'); this.refreshCartUI(); },
  closeCart() { document.getElementById('cartOverlay').classList.remove('open'); },

  refreshCartUI() {
    const cart = SPORTIN.getCart();
    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if(!body) return;
    if(!cart.length) {
      body.innerHTML='<div class="cart-empty"><div style="font-size:3rem;margin-bottom:10px">🛒</div><p>Tu carrito está vacío</p></div>';
      if(foot) foot.style.display='none';
      return;
    }
    if(foot) foot.style.display='block';
    body.innerHTML = cart.map(i=>`
      <div class="ci">
        <div class="ci-img">${i.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${i.name}</div>
          <div class="ci-meta">S/ ${i.price} c/u</div>
          <div class="ci-ctrl">
            <button class="ci-qb" onclick="Layout.ciQty(${i.id},-1)">−</button>
            <span class="ci-q">${i.qty}</span>
            <button class="ci-qb" onclick="Layout.ciQty(${i.id},1)">+</button>
            <button class="ci-del" onclick="Layout.ciDel(${i.id})">🗑 Quitar</button>
          </div>
        </div>
        <div class="ci-price">S/ ${i.price*i.qty}</div>
      </div>`).join('');
    const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const sub = document.getElementById('cartSub'); if(sub) sub.textContent=`S/ ${total}`;
    const tv = document.getElementById('cartTotalVal'); if(tv) tv.textContent=`S/ ${total}`;
  },

  ciQty(id, delta) {
    const cart = SPORTIN.getCart();
    const item = cart.find(i=>i.id===id);
    if(!item) return;
    item.qty = Math.max(1, Math.min(item.stock||999, item.qty+delta));
    SPORTIN.setCart(cart);
    this.refreshCartUI();
  },

  ciDel(id) {
    SPORTIN.setCart(SPORTIN.getCart().filter(i=>i.id!==id));
    this.refreshCartUI();
  },

  // ── CHECKOUT ──
  openCheckout() {
    if(!SPORTIN.getSession()) { SPORTIN.toast('⚠️','Inicia sesión para comprar',''); setTimeout(()=>window.location.href='login.html',1200); return; }
    if(!SPORTIN.getCart().length) return;
    this.closeCart();
    document.getElementById('checkoutModal').classList.add('open');
    this.nextStep(1);
  },
  closeCheckout() { document.getElementById('checkoutModal').classList.remove('open'); },

  nextStep(n) {
    this._step = n;
    [1,2,3].forEach(i=>{
      document.getElementById('mf'+i).classList.toggle('on',i===n);
      const ms=document.getElementById('ms'+i);
      ms.classList.toggle('on',i===n);
      ms.classList.toggle('done',i<n);
    });
    if(n===3) this.renderOrderSummary();
  },

  renderOrderSummary() {
    const cart = SPORTIN.getCart();
    const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const box = document.getElementById('orderSummary');
    if(box) box.innerHTML = cart.map(i=>`<div class="os-row"><span>${i.emoji} ${i.name} x${i.qty}</span><span>S/ ${i.price*i.qty}</span></div>`).join('')
      +`<div class="os-total"><span>Total</span><span class="os-total-v">S/ ${total}</span></div>`;
  },

  selPay(el, method) {
    document.querySelectorAll('.pay-opt').forEach(o=>o.classList.remove('sel'));
    el.classList.add('sel');
    this._selPay = method;
  },

  confirmOrder() {
    const name = document.getElementById('f_name')?.value.trim();
    const email = document.getElementById('f_email')?.value.trim();
    if(!name||!email) { SPORTIN.toast('⚠️','Completa los datos personales',''); this.nextStep(1); return; }
    this.closeCheckout();
    const code = SPORTIN.genTrackingCode();
    const tc = document.getElementById('trackCode'); if(tc) tc.textContent=code;
    document.getElementById('successModal').classList.add('open');
    SPORTIN.setCart([]);
    this.refreshCartUI();
    SPORTIN.toast('🎉','¡Compra exitosa!',`Código: ${code}`);
  },

  closeSuccess() { document.getElementById('successModal').classList.remove('open'); },

  // ── CHATBOT ──
  toggleChat() {
    this._chatOpen = !this._chatOpen;
    const win = document.getElementById('chatWin');
    win.classList.toggle('open', this._chatOpen);
    const u = document.getElementById('chatUnread'); if(u) u.style.display='none';
    if(this._chatOpen && !document.getElementById('chatMsgs').children.length)
      setTimeout(()=>this.addBotMsg(this.BOT_RESPONSES.default()),400);
  },

  addBotMsg(html) {
    const msgs = document.getElementById('chatMsgs');
    const now = new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
    const typing = document.createElement('div');
    typing.className='cmsg bot';
    typing.innerHTML='<div class="typing-wrap"><span class="td"></span><span class="td"></span><span class="td"></span></div>';
    msgs.appendChild(typing); msgs.scrollTop=msgs.scrollHeight;
    setTimeout(()=>{ typing.innerHTML=`<div class="cbubble">${html}</div><div class="ctime">${now}</div>`; msgs.scrollTop=msgs.scrollHeight; },750);
  },

  addUserMsg(text) {
    const msgs = document.getElementById('chatMsgs');
    const now = new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
    const m=document.createElement('div'); m.className='cmsg user';
    m.innerHTML=`<div class="cbubble">${text}</div><div class="ctime" style="text-align:right">${now}</div>`;
    msgs.appendChild(m); msgs.scrollTop=msgs.scrollHeight;
  },

  sendMsg() {
    const inp=document.getElementById('chatInp');
    const text=inp.value.trim(); if(!text) return;
    this.addUserMsg(text); inp.value='';
    setTimeout(()=>this.addBotMsg(this.getBotReply(text)),200);
  },

  qick(text) {
    if(!this._chatOpen) this.toggleChat();
    setTimeout(()=>{ this.addUserMsg(text); setTimeout(()=>this.addBotMsg(this.getBotReply(text)),200); },100);
  },
};
