(function() {
    const CART_KEY = 'bloom_cart_items_v1';
    const FEEDBACK_KEY = 'bloom_feedback_entries_v1';

    function readCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
    }
    function writeCart(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        renderCartModal();
    }
    function addToCart(item) {
        const items = readCart();
        items.push(item);
        writeCart(items);
        alert('Item added.');
    }
    function clearCart() { writeCart([]); }

    function renderCartModal() {
        const items = readCart();
        const container = document.querySelector('#cart-items');
        if (!container) return;
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        const list = document.createElement('ul');
        list.className = 'cart-list';
        items.forEach((it, idx) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `<span>${it.name}</span><span>$${Number(it.price).toFixed(2)}</span>`;
            list.appendChild(li);
        });
        container.appendChild(list);
        const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0);
        const totalEl = document.querySelector('#cart-total');
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            renderCartModal();
        }
    }
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }
    }

    function onClick(e) {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
            const name = addBtn.getAttribute('data-name') || 'Plant';
            const price = addBtn.getAttribute('data-price') || '0';
            addToCart({ name, price });
        }
        const openCart = e.target.closest('[data-open-cart]');
        if (openCart) openModal('cart-modal');
        const closeCart = e.target.closest('[data-close-modal]');
        if (closeCart) closeModal(closeCart.getAttribute('data-close-modal'));
        const clearBtn = e.target.closest('[data-clear-cart]');
        if (clearBtn) { clearCart(); }
        const processBtn = e.target.closest('[data-process-order]');
        if (processBtn) { clearCart(); alert('Thank you for your order'); closeModal('cart-modal'); }
        const backdrop = e.target.classList.contains('modal');
        if (backdrop) closeModal(e.target.id);
    }

    function onSubmit(e) {
        const form = e.target.closest('#feedback-form');
        if (form) {
            e.preventDefault();
            const entry = {
                name: form.querySelector('[name="name"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                message: form.querySelector('[name="message"]').value.trim(),
                createdAt: new Date().toISOString()
            };
            if (!entry.name || !entry.email || !entry.message) return;
            try {
                const list = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
                list.push(entry);
                localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
                form.reset();
                alert('Thanks for your feedback!');
            } catch {}
        }
    }

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('DOMContentLoaded', function() {
        renderCartModal();
        var header = document.querySelector('.site-header');
        if (header) {
            var onScroll = function() {
                if (window.scrollY > 4) header.classList.add('is-scrolled');
                else header.classList.remove('is-scrolled');
            };
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    });
})();


