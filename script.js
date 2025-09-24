(function() {
    const CART_KEY = 'bloom_cart_items_v1'; // now stored in sessionStorage per Task 3.2
    const FEEDBACK_KEY = 'bloom_feedback_entries_v1';

    function readCart() {
        try { return JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
    }
    function writeCart(items) {
        sessionStorage.setItem(CART_KEY, JSON.stringify(items));
        renderCartModal();
    }
    function addToCart(item) {
        const items = readCart();
        items.push(item);
        writeCart(items);
        alert('Item added to the cart');
    }
    function clearCart() {
        const items = readCart();
        if (items.length > 0) {
            writeCart([]);
            alert('Cart cleared');
        } else {
            alert('No items to clear');
        }
    }

    function renderCartModal() {
        const items = readCart();
        const container = document.querySelector('#cart-items');
        const totalEl = document.querySelector('#cart-total');
        if (!container) {
            // Even if the modal body isn't present, keep total in sync when possible
            if (totalEl) {
                const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0);
                totalEl.textContent = `$${total.toFixed(2)}`;
            }
            return;
        }
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p>Your cart is empty.</p>';
            if (totalEl) totalEl.textContent = '$0.00';
            return;
        }
        const list = document.createElement('ul');
        list.className = 'cart-list';
        items.forEach((it) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `<span>${it.name}</span><span>$${Number(it.price).toFixed(2)}</span>`;
            list.appendChild(li);
        });
        container.appendChild(list);
        const total = items.reduce((sum, it) => sum + Number(it.price || 0), 0);
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
        if (processBtn) {
            const items = readCart();
            if (items.length > 0) {
                writeCart([]);
                alert('Thank you for your order');
                closeModal('cart-modal');
            } else {
                alert('Cart is empty');
            }
        }
        const backdrop = e.target.classList.contains('modal');
        if (backdrop) closeModal(e.target.id);
    }

    function onSubmit(e) {
        // About Us / Contact page feedback form
        const feedbackForm = e.target.closest('#feedback-form');
        if (feedbackForm) {
            e.preventDefault();
            const entry = {
                name: feedbackForm.querySelector('[name="name"]').value.trim(),
                email: feedbackForm.querySelector('[name="email"]').value.trim(),
                message: feedbackForm.querySelector('[name="message"]').value.trim(),
                createdAt: new Date().toISOString()
            };
            if (!entry.name || !entry.email || !entry.message) return;
            try {
                const list = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
                list.push(entry);
                localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
                feedbackForm.reset();
                alert('Thank you for your message');
            } catch {}
            return;
        }

        // Footer newsletter subscribe forms on all pages
        const newsletterForm = e.target.closest('.newsletter form, form[aria-label="Newsletter signup"]');
        if (newsletterForm) {
            e.preventDefault();
            // optional: basic non-empty check
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() === '') {
                emailInput.focus();
                return;
            }
            newsletterForm.reset();
            alert('Thank you for subscribing');
            return;
        }

        // Homepage contact form
        const contactForm = e.target.closest('form.contact-form');
        if (contactForm) {
            e.preventDefault();
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            if (!name || !email || !message) return;
            contactForm.reset();
            alert('Thank you for your message');
            return;
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


