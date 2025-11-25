document.addEventListener('DOMContentLoaded', () => {
	const selectors = [
		{ selector: '.title-target', label: '<h1 class="title">' }
	];
	
	const labelPairs = [];
	let triggerLine = null;
	let triggerLabel = null;
	
	function createLabels() {
		selectors.forEach(({ selector, label }) => {
			document.querySelectorAll(selector).forEach(el => {
				const labelEl = document.createElement('div');
				labelEl.className = 'code-label';
				document.body.appendChild(labelEl);
				
				el.classList.add('code-labeled-element');
				
				// Special handling for title-target elements with color data
				if (el.classList.contains('title-target') && el.dataset.color) {
					const colorClass = `has-text-${el.dataset.color}`;
					
					// Function to update dimensions only when needed
					const updateDimensions = () => {
						const classList = Array.from(el.classList).filter(cls => cls !== 'code-labeled-element').join(' ');
						labelEl.textContent = `class="${classList}" ${el.offsetWidth}x${el.offsetHeight}px`;
					};
					
					// Use ResizeObserver to update dimensions only when element resizes
					const resizeObserver = new ResizeObserver(updateDimensions);
					resizeObserver.observe(el);
					updateDimensions(); // Initial update
					
					// Simple color changes on hover without dimension calculations
					el.addEventListener('mouseenter', () => {
						el.classList.remove('has-text-grey');
						el.classList.add(colorClass);
					});
					
					el.addEventListener('mouseleave', () => {
						el.classList.remove(colorClass);
						el.classList.add('has-text-grey');
					});
				}
				
				labelPairs.push({ element: el, label: labelEl, text: label });
			});
		});
	}
	
	function updateLabels() {
		labelPairs.forEach(({ element, label, text }) => {
			const rect = element.getBoundingClientRect();
			const width = Math.round(rect.width);
			const height = Math.round(rect.height);
			const classList = Array.from(element.classList).filter(cls => cls !== 'code-labeled-element').join(' ');
			
			label.textContent = `class="${classList}" ${width}x${height}px`;
			label.style.left = `${rect.left + window.scrollX}px`;
			label.style.top = `${rect.top + window.scrollY}px`;
		});
	}
	
	function createTriggerLine() {
		// Clone template
		const template = document.getElementById('trigger-template');
		const triggerContainer = template.content.cloneNode(true).firstElementChild;
		
		triggerLine = triggerContainer.querySelector('.trigger-line');
		triggerLabel = triggerContainer.querySelector('.trigger-label');
		
		document.body.appendChild(triggerContainer);
	}
	
	function setupIntersectionObserver() {
		if (!triggerLabel) return;
		
		const observer = new IntersectionObserver((entries) => {
			let intersectingElement = null;
			
			entries.forEach(entry => {
				const colorClass = `has-text-${entry.target.dataset.color}`;
				
				if (entry.isIntersecting) {
					entry.target.classList.remove('has-text-grey');
					entry.target.classList.add(colorClass);
					intersectingElement = entry.target;
				} else {
					entry.target.classList.remove(colorClass);
					entry.target.classList.add('has-text-grey');
				}
			});
			
			// Update trigger label
			if (intersectingElement) {
				triggerLabel.textContent = `intersecting: <h1>${intersectingElement.textContent}</h1>`;
			} else {
				triggerLabel.textContent = '...';
			}
		}, {
			rootMargin: '-50% 0px -50% 0px'
		});
		
		// Observe all title elements with color data
		document.querySelectorAll('.title-target').forEach(el => {
			if (el.dataset.color) {
				observer.observe(el);
			}
		});
	}
	
	createLabels();
	updateLabels();
	createTriggerLine();
	setupIntersectionObserver();
	
	// Binary flicker animation
	function createBinaryFlicker() {
		const binarySpan = document.getElementById('binary-flicker');
		if (!binarySpan) return;
		
		const generateBinary = () => Math.random() > 0.5 ? '1' : '0';
		
		function flicker() {
			let newBinary = '';
			for (let i = 0; i < 5; i++) {
				newBinary += generateBinary();
			}
			binarySpan.textContent = newBinary;
		}
		
		// Flicker every 100-500ms with random intervals
		function scheduleNextFlicker() {
			const delay = Math.random() * 400 + 100; // 100-500ms
			setTimeout(() => {
				flicker();
				scheduleNextFlicker();
			}, delay);
		}
		
		scheduleNextFlicker();
	}
	
	createBinaryFlicker();
	
	// Use ResizeObserver for more efficient label updates
	if (labelPairs.length > 0) {
		const resizeObserver = new ResizeObserver(() => {
			updateLabels();
		});
		
		// Observe each labeled element and the window
		labelPairs.forEach(({ element }) => resizeObserver.observe(element));
		resizeObserver.observe(document.body);
	}
});