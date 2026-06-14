/**
 * Dynamic gamer background renderer
 * Loads game images and creates a blended composite background on canvas
 * 
 * ADDING MORE IMAGES:
 * 1. Add your image file to docs/v2/images/
 * 2. Add the filename to the imageNames array below
 * 3. That's it! The script handles any image size automatically
 */

class GamerBackground {
	constructor() {
		this.images = [];
		// EASY TO EXTEND: Just add more image filenames here!
		this.imageNames = [
			'Deadlock.jpg',
			'clair-obscur-expedition-33.jpg',
			'farewell-north.jpg',
			'have-a-nice-death.jpg',
			'helldivers-2-escalation-of-freedom.jpg',
			'persona3r.jpg',
			'persona5r.jpg'
			// Add more images here: 'your-image.jpg', 'another-image.png', etc.
		];
		this.canvas = null;
		this.ctx = null;
		this.isActive = false;
		this.imagesLoaded = 0;
		
		this.init();
	}

	async init() {
		// Create canvas element
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'gamer-background-canvas';
		this.canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			display: none;
		`;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		// Load all images
		await this.loadImages();

		// Setup event listeners
		window.addEventListener('resize', () => this.render());
		document.addEventListener('DOMContentLoaded', () => this.checkTheme());
		
		// Listen for theme changes
		const observer = new MutationObserver(() => this.checkTheme());
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

		// Initial render
		this.checkTheme();
	}

	async loadImages() {
		console.log('🎮 Loading gamer background images...');
		const promises = this.imageNames.map((name, idx) => 
			this.loadImage(`images/${name}`, idx)
		);
		await Promise.all(promises);
		console.log(`✅ Loaded ${this.images.filter(i => i).length}/${this.imageNames.length} game images`);
		
		if (this.images.filter(i => i).length === 0) {
			console.error('❌ No images loaded! Check that images are in docs/v2/images/');
		}
	}

	loadImage(path, index) {
		return new Promise((resolve) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				console.log(`✓ Loaded: ${this.imageNames[index]} (${img.width}x${img.height})`);
				this.images[index] = img;
				this.imagesLoaded++;
				resolve();
			};
			img.onerror = () => {
				console.warn(`✗ Failed to load: ${this.imageNames[index]} (${path})`);
				this.images[index] = null;
				resolve();
			};
			img.src = path;
		});
	}

	checkTheme() {
		const theme = document.documentElement.getAttribute('data-theme');
		console.log(`🔄 Theme changed: ${theme}`);
		
		if (theme === 'personal' && !this.isActive) {
			console.log('✅ Activating gamer background...');
			this.isActive = true;
			this.canvas.style.display = 'block';
			console.log(`📊 Canvas size: ${this.canvas.width}x${this.canvas.height}`);
			console.log(`🖼️  Images loaded: ${this.images.filter(i => i).length}/${this.imageNames.length}`);
			this.render();
		} else if (theme !== 'personal' && this.isActive) {
			console.log('❌ Deactivating gamer background');
			this.isActive = false;
			this.canvas.style.display = 'none';
		}
	}

	calculateGridLayout(numImages, maxCols) {
		/**
		 * Calculate optimal grid layout to avoid unfinished rows.
		 * Redistributes images to fill space evenly.
		 * Returns: array of column counts per row
		 */
		if (numImages === 0) return [];
		if (numImages <= maxCols) return [numImages];
		
		const rows = Math.ceil(numImages / maxCols);
		const colDistribution = [];
		
		const lastRowCount = numImages % maxCols;
		
		if (lastRowCount === 1 && rows > 1) {
			// Redistribute to avoid single image on last row
			if (rows === 2) {
				// For 2 rows: distribute as (maxCols-1) and (numImages - maxCols + 1)
				colDistribution.push(maxCols - 1);
				colDistribution.push(numImages - (maxCols - 1));
			} else {
				// For 3+ rows: distribute evenly
				const avgCols = Math.floor(numImages / rows);
				const remainder = numImages % rows;
				for (let r = 0; r < rows; r++) {
					colDistribution.push(r < remainder ? avgCols + 1 : avgCols);
				}
			}
		} else {
			// Standard distribution
			for (let r = 0; r < rows - 1; r++) {
				colDistribution.push(maxCols);
			}
			colDistribution.push(numImages - (rows - 1) * maxCols);
		}
		
		return colDistribution;
	}

	resizeCanvas() {
		const header = document.querySelector('header');
		const headerHeight = header ? header.offsetHeight : 0;
		
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight - headerHeight;
		this.canvas.style.top = headerHeight + 'px';
	}

	createDiagonalBlendMask(width, height) {
		/**
		 * Create a mask for diagonal "/" blending
		 * Returns ImageData where 0 = left image, 255 = right image
		 */
		const mask = this.ctx.createImageData(width, height);
		const data = mask.data;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = (y * width + x) * 4;
				// Diagonal blend: lower-left -> upper-right
				const blendVal = ((x / width) + (1 - y / height)) / 2;
				const normalizedVal = Math.max(0, Math.min(1, blendVal));
				const val = Math.floor(normalizedVal * 255);

				data[idx] = val;      // R
				data[idx + 1] = val;  // G
				data[idx + 2] = val;  // B
				data[idx + 3] = 255;  // A
			}
		}
		return mask;
	}

	blendImages(leftCanvas, rightCanvas, overlapWidth) {
		/**
		 * Blend two canvases with a diagonal "/" overlap
		 * Handles different heights by using the maximum
		 */
		const leftHeight = leftCanvas.height;
		const rightHeight = rightCanvas.height;
		const maxHeight = Math.max(leftHeight, rightHeight);

		// Create output canvas with correct dimensions
		const totalWidth = leftCanvas.width + rightCanvas.width - overlapWidth;
		const outputCanvas = document.createElement('canvas');
		outputCanvas.width = totalWidth;
		outputCanvas.height = maxHeight;
		const outputCtx = outputCanvas.getContext('2d');

		// Fill background
		outputCtx.fillStyle = '#111111';
		outputCtx.fillRect(0, 0, totalWidth, maxHeight);

		// Calculate vertical offsets for different height images
		const leftOffsetY = (maxHeight - leftHeight) / 2;
		const rightOffsetY = (maxHeight - rightHeight) / 2;

		// Paste left image (may not fill full height)
		outputCtx.drawImage(leftCanvas, 0, leftOffsetY);

		// Create blend mask for overlap
		const mask = this.createDiagonalBlendMask(overlapWidth, maxHeight);

		// Get overlap regions from both images
		const leftOvx = leftCanvas.width - overlapWidth;
		
		// Handle overlap: need to get pixels from left canvas
		const overlapLeftCanvas = document.createElement('canvas');
		overlapLeftCanvas.width = overlapWidth;
		overlapLeftCanvas.height = maxHeight;
		const ovLeftCtx = overlapLeftCanvas.getContext('2d');
		
		// Draw the overlap portion from left canvas
		if (overlapWidth <= leftCanvas.width) {
			ovLeftCtx.drawImage(leftCanvas, leftOvx, 0);
		}

		// Extract overlap from right canvas
		const overlapRightCanvas = document.createElement('canvas');
		overlapRightCanvas.width = overlapWidth;
		overlapRightCanvas.height = maxHeight;
		const ovRightCtx = overlapRightCanvas.getContext('2d');
		
		// Draw the overlap portion from right canvas
		if (overlapWidth <= rightCanvas.width) {
			ovRightCtx.drawImage(rightCanvas, 0, 0);
		}

		// Blend the overlaps
		const leftOverlapData = ovLeftCtx.getImageData(0, 0, overlapWidth, maxHeight);
		const rightOverlapData = ovRightCtx.getImageData(0, 0, overlapWidth, maxHeight);
		const blendedData = outputCtx.createImageData(overlapWidth, maxHeight);

		const leftPixels = leftOverlapData.data;
		const rightPixels = rightOverlapData.data;
		const blendPixels = blendedData.data;
		const maskPixels = mask.data;

		for (let i = 0; i < leftPixels.length; i += 4) {
			const maskVal = maskPixels[i] / 255; // 0 to 1
			blendPixels[i] = Math.floor(leftPixels[i] * (1 - maskVal) + rightPixels[i] * maskVal);
			blendPixels[i + 1] = Math.floor(leftPixels[i + 1] * (1 - maskVal) + rightPixels[i + 1] * maskVal);
			blendPixels[i + 2] = Math.floor(leftPixels[i + 2] * (1 - maskVal) + rightPixels[i + 2] * maskVal);
			blendPixels[i + 3] = 255;
		}

		// Paste blended overlap
		outputCtx.putImageData(blendedData, leftOvx, 0);

		// Paste right image (non-overlapping part)
		if (rightCanvas.width > overlapWidth) {
			const rightPasteX = leftCanvas.width - overlapWidth + overlapWidth;
			outputCtx.drawImage(
				rightCanvas,
				overlapWidth, 0, rightCanvas.width - overlapWidth, rightHeight,
				rightPasteX, rightOffsetY, rightCanvas.width - overlapWidth, rightHeight
			);
		}

		return outputCanvas;
	}

	render() {
		if (!this.isActive || this.images.length === 0) {
			console.warn('⚠️  Render skipped - isActive:', this.isActive, 'images:', this.images.length);
			return;
		}

		this.resizeCanvas();
		console.log(`🎨 Rendering at ${this.canvas.width}x${this.canvas.height}`);

		const validImages = this.images.filter(img => img);
		if (validImages.length === 0) {
			console.error('❌ No valid images to render!');
			return;
		}

		const maxImagesPerRow = 2;
		const colDistribution = this.calculateGridLayout(validImages.length, maxImagesPerRow);
		console.log(`📐 Grid layout: ${colDistribution.length} rows - ${colDistribution.join('+')}`);
		console.log(`🖼️  Rendering ${validImages.length} images with blends...`);

		const overlapWidth = 40;
		const totalRows = colDistribution.length;
		const rowHeight = this.canvas.height / totalRows;
		const canvasWidth = this.canvas.width;

		// Render each row
		const renderedRows = [];
		let imgIdx = 0;

		for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
			const colsInRow = colDistribution[rowIdx];
			const rowImages = validImages.slice(imgIdx, imgIdx + colsInRow);
			imgIdx += colsInRow;

			console.log(`  Row ${rowIdx + 1}: ${colsInRow} images`);

			// Calculate width per image in this row
			const overlapTotal = Math.max(0, (colsInRow - 1) * overlapWidth);
			const availableWidth = canvasWidth - overlapTotal;
			const imgWidthAlloc = availableWidth / colsInRow;

			// Create and blend images in this row
			let rowCanvas = null;

			for (let i = 0; i < rowImages.length; i++) {
				const img = rowImages[i];
				
				// Create canvas for this image
				const imgCanvas = document.createElement('canvas');
				imgCanvas.height = rowHeight;
				imgCanvas.width = imgWidthAlloc;
				const imgCtx = imgCanvas.getContext('2d');

				// Calculate scaling to fit allocated space
				const imgAspectRatio = img.width / img.height;
				const targetRatio = imgWidthAlloc / rowHeight;

				let drawWidth, drawHeight, offsetX, offsetY;

				if (imgAspectRatio > targetRatio) {
					// Image is wider - fit to height
					drawHeight = rowHeight;
					drawWidth = drawHeight * imgAspectRatio;
					offsetX = (imgWidthAlloc - drawWidth) / 2;
					offsetY = 0;
				} else {
					// Image is taller - fit to width
					drawWidth = imgWidthAlloc;
					drawHeight = drawWidth / imgAspectRatio;
					offsetX = 0;
					offsetY = (rowHeight - drawHeight) / 2;
				}

				// Draw image centered on its canvas
				imgCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

				// Blend with previous image if not first
				if (i === 0) {
					rowCanvas = imgCanvas;
				} else {
					rowCanvas = this.blendImages(rowCanvas, imgCanvas, overlapWidth);
				}
			}

			// Ensure row width fits output width
			if (rowCanvas.width > canvasWidth) {
				const excess = rowCanvas.width - canvasWidth;
				const left = excess / 2;
				const tempCanvas = document.createElement('canvas');
				tempCanvas.width = canvasWidth;
				tempCanvas.height = rowCanvas.height;
				const tempCtx = tempCanvas.getContext('2d');
				tempCtx.drawImage(rowCanvas, -left, 0);
				rowCanvas = tempCanvas;
			} else if (rowCanvas.width < canvasWidth) {
				const tempCanvas = document.createElement('canvas');
				tempCanvas.width = canvasWidth;
				tempCanvas.height = rowCanvas.height;
				const tempCtx = tempCanvas.getContext('2d');
				tempCtx.fillStyle = '#111111';
				tempCtx.fillRect(0, 0, canvasWidth, rowCanvas.height);
				const offset = (canvasWidth - rowCanvas.width) / 2;
				tempCtx.drawImage(rowCanvas, offset, 0);
				rowCanvas = tempCanvas;
			}

			// Ensure row height matches
			if (rowCanvas.height !== rowHeight) {
				const tempCanvas = document.createElement('canvas');
				tempCanvas.width = rowCanvas.width;
				tempCanvas.height = rowHeight;
				const tempCtx = tempCanvas.getContext('2d');
				tempCtx.drawImage(rowCanvas, 0, 0, rowCanvas.width, rowCanvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
				rowCanvas = tempCanvas;
			}

			renderedRows.push(rowCanvas);
		}

		// Stack all rows vertically on main canvas
		this.ctx.fillStyle = '#111111';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		let yOffset = 0;
		for (const rowCanvas of renderedRows) {
			this.ctx.drawImage(rowCanvas, 0, yOffset, canvasWidth, rowHeight);
			yOffset += rowHeight;
		}

		console.log(`✅ Rendered successfully with ${totalRows} rows`);
	}
}

// Initialize on page load
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		window.gamerBackground = new GamerBackground();
	});
} else {
	window.gamerBackground = new GamerBackground();
}
