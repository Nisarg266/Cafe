/* ==========================================================================
   SIP & CHILL CAFÉ — MENU DATA
   --------------------------------------------------------------------------
   Every item on the website is rendered from this single file.
   To update the menu, edit the entries below — no other changes needed.

   Item fields:
     n  : item name (displayed)
     c  : category key (must match a key in CATEGORIES below)
     p  : price in INR. Single price ("40") or two options ("100 / 150")
     u  : optional note under the price (e.g. layer sizes for grills)
     d  : short description shown under the name

   NOTE — two names are transcribed EXACTLY as printed on the café's menu
   board and should be confirmed with the owner before go-live:
     • "Baaskon" shake   (possibly "Baskin" / another name)
     • "Borenvita"       (possibly "Bournvita")
   ========================================================================== */

window.MENU_CATEGORIES = [
  { key: 'tea',        heading: 'Tea' },
  { key: 'coffee',     heading: 'Coffee & Hot Sips' },
  { key: 'cold',       heading: 'Cold Beverages' },
  { key: 'shakes',     heading: 'Milk Shakes' },
  { key: 'sandwiches', heading: 'Sandwiches' },
  { key: 'grilled',    heading: 'Grilled Sandwiches' },
  { key: 'fries',      heading: 'Fries' },
  { key: 'maggie',     heading: 'Maggie' },
  { key: 'chaat',      heading: 'Chaat' }
];

window.MENU_ITEMS = [
  /* ---- Tea ---- */
  { n: 'Elaichi Tea',            c: 'tea',   p: '20', d: 'Fragrant cardamom comfort in a cup.' },
  { n: 'Ginger Tea',             c: 'tea',   p: '25', d: 'Warm, spicy and endlessly soothing.' },
  { n: 'Masala Tea',             c: 'tea',   p: '30', d: 'The classic spiced chai, brewed strong.' },
  { n: 'Pudina Tea',             c: 'tea',   p: '35', d: 'Fresh mint steeped into an aromatic brew.' },
  { n: 'Tulsi Tea',              c: 'tea',   p: '35', d: 'Herbal, calming and gently warming.' },
  { n: 'Sip & Chill Special Tea',c: 'tea',   p: '40', d: 'Our signature brew, made the house way.' },

  /* ---- Coffee & hot sips ---- */
  { n: 'Black Coffee',           c: 'coffee', p: '50', d: 'Clean, bold, no fuss.' },
  { n: 'Hot Coffee',             c: 'coffee', p: '60', d: 'Creamy, comforting, classic.' },
  { n: 'Hot Borenvita',          c: 'coffee', p: '60', d: 'A malty favourite, served warm.' },
  { n: 'Hot Chocolate',          c: 'coffee', p: '90', d: 'Rich cocoa, hug-in-a-mug territory.' },

  /* ---- Cold beverages ---- */
  { n: 'Cold Coffee',            c: 'cold',  p: '70', d: 'Chilled, frothy and always refreshing.' },
  { n: 'Cold Borenvita',         c: 'cold',  p: '70', d: 'The malty classic, served over ice.' },
  { n: 'Iced Black Coffee',      c: 'cold',  p: '80', d: 'Bold coffee, refreshingly cold.' },
  { n: 'Strong Cold Coffee',     c: 'cold',  p: '90', d: 'For days that need an extra kick.' },

  /* ---- Milk shakes ---- */
  { n: 'Vanilla Shake',          c: 'shakes', p: '120', d: 'Smooth, simple, timeless.' },
  { n: 'Chocolate Shake',        c: 'shakes', p: '120', d: 'Deep chocolate, thick and cold.' },
  { n: 'Oreo Shake',             c: 'shakes', p: '130', d: 'Cookies and cream, blended thick.' },
  { n: 'KitKat Shake',           c: 'shakes', p: '130', d: 'Crunchy chocolate wafers, shaken up.' },
  { n: 'Baaskon Shake',          c: 'shakes', p: '140', d: 'A menu-board original worth trying.' },
  { n: 'Brownie Shake',          c: 'shakes', p: '150', d: 'Chocolate brownie goodness in a glass.' },

  /* ---- Sandwiches ---- */
  { n: 'Butter Slices (2)',      c: 'sandwiches', p: '50',  d: 'Soft bread, golden butter, simple joy.' },
  { n: 'Garlic Butter Slices (2)',c:'sandwiches', p: '60',  d: 'Buttered slices with a garlicky lift.' },
  { n: 'Vegetable Sandwich',     c: 'sandwiches', p: '60',  d: 'Fresh veggies in every bite.' },
  { n: 'Cheese Sandwich',        c: 'sandwiches', p: '90',  d: 'Gooey cheese, simply delicious.' },
  { n: 'Cheese Chutney Sandwich',c: 'sandwiches', p: '100', d: 'Cheese meets punchy green chutney.' },

  /* ---- Grilled sandwiches (2-layer / 3-layer pricing) ---- */
  { n: 'Vegetable Grill',        c: 'grilled', p: '100 / 150', u: '2-layer / 3-layer', d: 'The dependable classic, grilled crisp.' },
  { n: 'Cheese Grill',           c: 'grilled', p: '120 / 170', u: '2-layer / 3-layer', d: 'Double the cheese, double the comfort.' },
  { n: 'Corn & Cheese Grill',    c: 'grilled', p: '140 / 190', u: '2-layer / 3-layer', d: 'Sweet corn and molten cheese.' },
  { n: 'Paneer Tikka Grill',     c: 'grilled', p: '150 / 200', u: '2-layer / 3-layer', d: 'Spiced paneer, grilled golden.' },
  { n: 'Chocolate Grill',        c: 'grilled', p: '120 / 170', u: '2-layer / 3-layer', d: 'A dessert-style grilled treat.' },

  /* ---- Fries ---- */
  { n: 'Salted Fries',           c: 'fries', p: '70',  d: 'Golden, crispy, perfectly salted.' },
  { n: 'Peri Peri Fries',        c: 'fries', p: '90',  d: 'Tossed with a fiery peri-peri kick.' },
  { n: 'Cheesy Fries',           c: 'fries', p: '100', d: 'Loaded with molten cheese.' },
  { n: 'Signature Loaded Fries', c: 'fries', p: '130', d: 'Our most-loaded plate of fries.' },

  /* ---- Maggie ---- */
  { n: 'Plain Maggie',           c: 'maggie', p: '50', d: 'The nostalgic two-minute classic.' },
  { n: 'Butter Maggie',          c: 'maggie', p: '60', d: 'Slippery, buttery noodles.' },
  { n: 'Veggie Maggie',          c: 'maggie', p: '70', d: 'Tossed with fresh veggies.' },
  { n: 'Cheese Maggie',          c: 'maggie', p: '90', d: 'Finished with a cheesy melt.' },

  /* ---- Chaat ---- */
  { n: 'Sev Puri',               c: 'chaat', p: '60', d: 'Crunchy, tangy, chaat-counter classic.' },
  { n: 'Dahi Papdi Chaat',       c: 'chaat', p: '70', d: 'Crisp papdi, cool yoghurt, chaat masala.' },
  { n: 'Dahi Puri',              c: 'chaat', p: '80', d: 'Little puris of cool, tangy goodness.' }
];

/* Menu-board footnotes, shown under the full menu */
window.MENU_NOTES = [
  'All Jain preparations are available on request.',
  'More items coming soon.'
];

/* Hand-picked showcase rows for the "Signature Menu" section.
   Includes 3D-popping dish image, category, badge, and description. */
window.MENU_FEATURED = [
  {
    name: 'Sip & Chill Special Tea',
    cat: 'tea',
    icon: 'i-tea',
    img: './assets/images/dish-special-tea.jpg',
    badge: 'House Signature',
    blurb: 'The cup the café is named for — our special spiced brew with fragrant cardamom, made the house way and served piping hot.'
  },
  {
    name: 'Strong Cold Coffee',
    cat: 'cold',
    icon: 'i-iced',
    img: './assets/images/dish-cold-coffee.jpg',
    badge: 'Bestseller Frappe',
    blurb: 'Everything you love about our rich cold coffee, turned up a notch with chocolate swirls and thick foam for long, slow afternoons.'
  },
  {
    name: 'Brownie Shake',
    cat: 'shakes',
    icon: 'i-shake',
    img: './assets/images/dish-brownie-shake.jpg',
    badge: 'Chocoholic Favourite',
    blurb: 'Thick, cold and unapologetically chocolatey — fresh fudge brownie pieces blended into every single sip.'
  },
  {
    name: 'Paneer Tikka Grill',
    cat: 'grilled',
    icon: 'i-grill',
    img: './assets/images/dish-paneer-grill.jpg',
    badge: 'Molten Cheese Pull',
    blurb: 'Spiced marinated paneer stacked with crisp veggies, molten cheese, and grilled golden. Available in 2-layer or 3-layer.'
  },
  {
    name: 'Signature Loaded Fries',
    cat: 'fries',
    icon: 'i-fries',
    img: './assets/images/dish-loaded-fries.jpg',
    badge: 'Cheesy & Peri-Peri',
    blurb: 'Our most-loaded plate — a full portion of crisp fries generously topped with molten cheddar cheese sauce and fiery peri-peri.'
  },
  {
    name: 'Cheese Maggie',
    cat: 'maggie',
    icon: 'i-bowl',
    img: './assets/images/dish-cheese-maggie.jpg',
    badge: 'Comfort Classic',
    blurb: 'The nostalgic Indian masala noodles everyone comes back for, finished with a generous layer of melting cheese.'
  }
];

