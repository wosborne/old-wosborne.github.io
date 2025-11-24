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
					
					el.addEventListener('mouseenter', () => {
						el.classList.remove('has-text-grey');
						el.classList.add(colorClass);
						const rect = el.getBoundingClientRect();
						const classList = Array.from(el.classList).filter(cls => cls !== 'code-labeled-element').join(' ');
						labelEl.textContent = `class="${classList}" ${Math.round(rect.width)}x${Math.round(rect.height)}px`;
					});
					
					el.addEventListener('mouseleave', () => {
						el.classList.remove(colorClass);
						el.classList.add('has-text-grey');
						const rect = el.getBoundingClientRect();
						const classList = Array.from(el.classList).filter(cls => cls !== 'code-labeled-element').join(' ');
						labelEl.textContent = `class="${classList}" ${Math.round(rect.width)}x${Math.round(rect.height)}px`;
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
	
	function checkTriggerIntersection() {
		if (!triggerLine || !triggerLabel) return;
		
		const triggerRect = triggerLine.getBoundingClientRect();
		const triggerY = triggerRect.top;xx
		let intersectingElement = null;
		
		document.querySelectorAll('.title-target').forEach(h1 => {
			if (h1.dataset.color) {
				const h1Rect = h1.getBoundingClientRect();
				const isIntersecting = triggerY >= h1Rect.top && triggerY <= h1Rect.bottom;
				const colorClass = `has-text-${h1.dataset.color}`;
				
				if (isIntersecting) {
					h1.classList.remove('has-text-grey');
					h1.classList.add(colorClass);
					intersectingElement = h1;
				} else {
					h1.classList.remove(colorClass);
					h1.classList.add('has-text-grey');
				}
			}
		});
		
		// Update trigger label
		if (intersectingElement) {
			triggerLabel.textContent = `intersecting: <h1>${intersectingElement.textContent}</h1>`;
		} else {
			triggerLabel.textContent = '...';
		}
	}
	
	createLabels();
	updateLabels();
	createTriggerLine();
	
	window.addEventListener('resize', () => {
		updateLabels();
		checkTriggerIntersection();
	});
	
	window.addEventListener('scroll', () => {
		updateLabels();
		checkTriggerIntersection();
	});
	
	checkTriggerIntersection();
});