#!/usr/bin/env node
// Seed demo data via backend API. Creates 20 records per resource.
const API = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:8080';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@janesjeans.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const wait = ms => new Promise(r => setTimeout(r, ms));

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function loginAsAdmin() {
  console.log('Logging in as admin...');
  const res = await fetch(`${API}/api/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Admin login failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.accessToken || data.token || data.access_token;
}

async function createProducts(token) {
  console.log('Creating products...');
  const genders = ['MEN','WOMEN','UNISEX'];
  const created = [];
  for (let i=1;i<=20;i++){
    const payload = {
      name: `Demo Product ${i}`,
      description: `Auto-generated demo product ${i}`,
      price: (rand(20,150) + 0.99).toFixed(2),
      gender: genders[i % genders.length],
      sizes: ['30','32','34'],
      stock: rand(5,150)
    };
    const res = await fetch(`${API}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { console.error('Product create failed', await res.text()); continue; }
    const p = await res.json();
    created.push(p);
    await wait(120);
  }
  return created;
}

async function createCustomers(token) {
  console.log('Creating customers...');
  const created = [];
  for (let i=1;i<=20;i++){
    const payload = {
      name: `Demo Customer ${i}`,
      email: `demo.customer.${i}@example.com`,
      phone: `+8801${rand(10000000,99999999)}`,
      address: `${i} Demo Street, Demo City`
    };
    const res = await fetch(`${API}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { console.error('Customer create failed', await res.text()); continue; }
    const c = await res.json();
    created.push(c);
    await wait(100);
  }
  return created;
}

async function createVendors(token) {
  console.log('Creating shipping vendors...');
  const created = [];
  for (let i=1;i<=20;i++){
    const payload = {
      name: `Demo Vendor ${i}`,
      code: `DV${1000+i}`,
      contactEmail: `vendor${i}@logistics.example.com`,
      contactPhone: `+8801${rand(10000000,99999999)}`,
      website: `https://vendor${i}.example.com`,
      trackingUrlTemplate: `https://vendor${i}.example.com/track/{trackingNumber}`
    };
    const res = await fetch(`${API}/api/vendors`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { console.error('Vendor create failed', await res.text()); continue; }
    const v = await res.json();
    created.push(v);
    await wait(80);
  }
  return created;
}

async function createOrders(token, products, customers) {
  console.log('Creating orders...');
  const created = [];
  for (let i=1;i<=20;i++){
    const customer = customers[i % customers.length];
    const itemsCount = rand(1,3);
    const items = [];
    let total = 0;
    for (let j=0;j<itemsCount;j++){
      const p = products[(i+j) % products.length];
      const qty = rand(1,3);
      const price = Number(p.price || p.price || 49.99);
      items.push({ productId: p.id || p.uuid || p._id, productName: p.name, quantity: qty, price, size: '32' });
      total += price * qty;
    }
    const payload = {
      customerName: customer.name || `Customer ${i}`,
      customerEmail: customer.email,
      status: 'Pending',
      totalAmount: Number(total.toFixed(2)),
      shippingAddress: customer.address || 'Demo Address',
      notes: 'Auto-seeded order',
      items
    };
    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { console.error('Order create failed', await res.text()); continue; }
    const o = await res.json();
    created.push(o);
    await wait(140);
  }
  return created;
}

async function createShipments(token, orders, vendors) {
  console.log('Creating shipments...');
  const created = [];
  for (let i=0;i<20;i++){
    const order = orders[i % orders.length];
    const vendor = vendors[i % vendors.length];
    const payload = {
      orderId: order.id || order.orderId || order.uuid,
      vendorId: vendor.id || vendor.uuid,
      trackingNumber: `TRK-${Date.now()}-${i}`,
      status: 'IN_TRANSIT',
      shippingAddress: order.shippingAddress || order.shipping_address || 'Demo Address'
    };
    const res = await fetch(`${API}/api/shipments`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { console.error('Shipment create failed', await res.text()); continue; }
    const s = await res.json();
    created.push(s);
    await wait(120);
  }
  return created;
}

async function main(){
  try{
    const token = await loginAsAdmin();
    console.log('Token acquired');
    const products = await createProducts(token);
    const customers = await createCustomers(token);
    const vendors = await createVendors(token);
    const orders = await createOrders(token, products, customers);
    const shipments = await createShipments(token, orders, vendors);

    console.log('\nSeeding complete:');
    console.log('Products:', products.length);
    console.log('Customers:', customers.length);
    console.log('Vendors:', vendors.length);
    console.log('Orders:', orders.length);
    console.log('Shipments:', shipments.length);
  }catch(e){
    console.error('Seeding failed:', e);
    process.exit(1);
  }
}

main();
