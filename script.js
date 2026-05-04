document.addEventListener('DOMContentLoaded', () => {
            const titleElement = document.querySelector('.hero-title');
            const targetText = "Initialize\nCommunication";
            let currentText = "";
            let charIndex = 0;
            let isDeletingAll = false;
            let isCorrectingMistake = false;

            function getRandomChar(correctChar) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let char = chars.charAt(Math.floor(Math.random() * chars.length));
                while (char === correctChar || correctChar === '\n') {
                    char = chars.charAt(Math.floor(Math.random() * chars.length));
                    if (correctChar === '\n') break;
                }
                return char;
            }

            function updateDOM() {
                titleElement.innerHTML = currentText.replace(/\n/g, '<br>') + '<span class="cursor">|</span>';
            }

            function type() {
                let delay = Math.random() * 100 + 50;

                if (isDeletingAll) {
                    currentText = currentText.substring(0, currentText.length - 1);
                    delay = 30;
                    if (currentText === "") {
                        isDeletingAll = false;
                        charIndex = 0;
                        delay = 500;
                    }
                } else if (isCorrectingMistake) {
                    currentText = currentText.substring(0, currentText.length - 1);
                    isCorrectingMistake = false;
                    delay = 200;
                } else {
                    if (charIndex < targetText.length) {
                        let charToType = targetText.charAt(charIndex);

                        if (!isCorrectingMistake && Math.random() < 0.1 && charToType !== ' ' && charToType !== '\n') {
                            currentText += getRandomChar(charToType);
                            isCorrectingMistake = true;
                            delay = 300;
                        } else {
                            currentText += charToType;
                            charIndex++;
                            if (charToType === ' ' || charToType === '\n') delay = 200;
                        }
                    } else {
                        delay = 3000;
                        isDeletingAll = true;
                    }
                }

                updateDOM();
                setTimeout(type, delay);
            }

            titleElement.innerHTML = '<span class="cursor">|</span>';
            setTimeout(type, 1000);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // --- Glitch Logo Effect ---
        (function() {
            let isGlitching = false;

            function triggerGlitchLogo() {
                if (isGlitching) return;
                
                const originalLogo = document.querySelector('.logo-icon');
                if (!originalLogo) return;
                
                isGlitching = true;

                // Create Overlay
                let overlay = document.querySelector('.glitch-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'glitch-overlay';
                    document.body.appendChild(overlay);
                }

                const rect = originalLogo.getBoundingClientRect();
                
                // Wrapper to handle positioning and scaling without interfering with the glitch animation
                const wrapper = document.createElement('div');
                Object.assign(wrapper.style, {
                    position: 'fixed',
                    top: rect.top + 'px',
                    left: rect.left + 'px',
                    width: rect.width + 'px',
                    height: rect.height + 'px',
                    zIndex: '9999',
                    transformOrigin: 'center center',
                    transition: 'transform 0.6s cubic-bezier(0.8, 0, 0.2, 1)',
                    willChange: 'transform'
                });

                // Clone of the logo to apply the glitch animation
                const clone = document.createElement('img');
                clone.src = originalLogo.src;
                Object.assign(clone.style, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    willChange: 'transform, filter'
                });

                wrapper.appendChild(clone);
                document.body.appendChild(wrapper);

                // Hide original logo
                originalLogo.style.visibility = 'hidden';

                // Sequence Step 1: Initial Glitch
                clone.classList.add('glitch-anim');

                setTimeout(() => {
                    clone.classList.remove('glitch-anim');
                    
                    // Sequence Step 2: Move to center and enlarge
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    const logoCenterX = rect.left + rect.width / 2;
                    const logoCenterY = rect.top + rect.height / 2;
                    
                    const moveX = centerX - logoCenterX;
                    const moveY = centerY - logoCenterY;
                    const scale = 12; // Enlarge 12x

                    overlay.style.opacity = '1';
                    wrapper.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

                    // Sequence Step 3: Wait at center, then glitch again
                    setTimeout(() => {
                        clone.classList.add('glitch-anim');
                        
                        setTimeout(() => {
                            clone.classList.remove('glitch-anim');
                            
                            // Sequence Step 4: Return to origin
                            overlay.style.opacity = '0';
                            wrapper.style.transform = 'translate(0px, 0px) scale(1)';
                            
                            // Sequence Step 5: Cleanup
                            setTimeout(() => {
                                originalLogo.style.visibility = 'visible';
                                wrapper.remove();
                                isGlitching = false;
                            }, 600); // Wait for return transition
                            
                        }, 400); // Duration of second glitch
                    }, 1500); // Time spent in center
                }, 400); // Duration of first glitch
            }

            // Attach to all download buttons
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    triggerGlitchLogo();
                });
            });
        })();